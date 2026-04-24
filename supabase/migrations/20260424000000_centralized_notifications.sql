
-- 1. CLEANUP / UPDATE NOTIFICATIONS TABLE
-- Adjusting the existing table to match the new centralized system requirements

-- Add user_id if it doesn't exist (it didn't in the previous schema)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notifications' AND column_name='user_id') THEN
        ALTER TABLE public.notifications ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
    
    -- Rename description to message if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notifications' AND column_name='description') THEN
        ALTER TABLE public.notifications RENAME COLUMN description TO message;
    END IF;
END $$;

-- Ensure types are consistent (we can use a check constraint if we want, but TEXT is more flexible)
-- type: 'nota', 'estado', 'asignación', 'recordatorio', 'candidato'

-- 2. ENABLE REALTIME
-- This allows the UI to listen for new notifications instantly
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
-- We need to add the table to the supabase_realtime publication
-- This is usually done via Supabase dashboard but can be done via SQL
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;
END $$;

-- 3. UPDATED RLS POLICIES
-- Ensure users can only see and update their OWN notifications
DROP POLICY IF EXISTS "Enable select for authenticated" ON public.notifications;
DROP POLICY IF EXISTS "Enable update for authenticated" ON public.notifications;
DROP POLICY IF EXISTS "Enable insert for authenticated" ON public.notifications;

CREATE POLICY "Users can view own or global notifications" 
    ON public.notifications 
    FOR SELECT 
    TO authenticated 
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own notifications" 
ON public.notifications FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

-- System/Triggers will insert notifications, but if we need manual ones:
CREATE POLICY "Enable insert for authenticated" 
ON public.notifications FOR INSERT 
TO authenticated 
WITH CHECK (true); 

-- 4. ADD ASSIGNMENT TO JOB OPENINGS
-- To support "Job Assignment" notifications
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_openings' AND column_name='recruiter_id') THEN
        ALTER TABLE public.job_openings ADD COLUMN recruiter_id UUID REFERENCES public.recruiters(id);
    END IF;
END $$;


-- 5. TRIGGER LOGIC

-- Helper function to create a notification
CREATE OR REPLACE FUNCTION public.create_notification(
    p_user_id UUID,
    p_type TEXT,
    p_title TEXT,
    p_message TEXT,
    p_link TEXT
) RETURNS VOID AS $$
BEGIN
    IF p_user_id IS NOT NULL THEN
        INSERT INTO public.notifications (user_id, type, title, message, link)
        VALUES (p_user_id, p_type, p_title, p_message, p_link);
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- A. Trigger for New Notes
CREATE OR REPLACE FUNCTION public.on_application_note_created()
RETURNS TRIGGER AS $$
DECLARE
    v_recruiter_id UUID;
    v_candidate_name TEXT;
BEGIN
    -- Find the assigned recruiter for this application
    SELECT recruiter_id, (first_name || ' ' || last_name) INTO v_recruiter_id, v_candidate_name
    FROM public.job_applications
    WHERE id = NEW.application_id;

    -- Only notify if there's an assigned recruiter AND it's not the note author (if we had author_id)
    -- Since we only have author_name, we notify the assigned recruiter regardless
    IF v_recruiter_id IS NOT NULL THEN
        PERFORM public.create_notification(
            v_recruiter_id,
            'nota',
            'Nueva nota en candidato',
            'Se ha agregado una nota para ' || v_candidate_name,
            '/admin/candidates/' || NEW.application_id
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_on_note_created ON public.application_notes;
CREATE TRIGGER trigger_on_note_created
AFTER INSERT ON public.application_notes
FOR EACH ROW EXECUTE PROCEDURE public.on_application_note_created();

-- B. Trigger for Status Changes
CREATE OR REPLACE FUNCTION public.on_application_status_changed()
RETURNS TRIGGER AS $$
BEGIN
    -- Only notify if the status actually changed
    IF (OLD.status IS DISTINCT FROM NEW.status) AND NEW.recruiter_id IS NOT NULL THEN
        PERFORM public.create_notification(
            NEW.recruiter_id,
            'estado',
            'Estado actualizado',
            'El estado de ' || NEW.first_name || ' ' || NEW.last_name || ' cambió a ' || NEW.status,
            '/admin/candidates/' || NEW.id
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_on_status_changed ON public.job_applications;
CREATE TRIGGER trigger_on_status_changed
AFTER UPDATE OF status ON public.job_applications
FOR EACH ROW EXECUTE PROCEDURE public.on_application_status_changed();

-- C. Trigger for Candidate Assignment
CREATE OR REPLACE FUNCTION public.on_application_assigned()
RETURNS TRIGGER AS $$
BEGIN
    -- Only notify if the recruiter_id changed (or was newly set)
    IF (OLD.recruiter_id IS DISTINCT FROM NEW.recruiter_id) AND NEW.recruiter_id IS NOT NULL THEN
        PERFORM public.create_notification(
            NEW.recruiter_id,
            'asignación',
            'Nuevo candidato asignado',
            'Se te ha asignado el candidato: ' || NEW.first_name || ' ' || NEW.last_name,
            '/admin/candidates/' || NEW.id
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_on_candidate_assigned ON public.job_applications;
CREATE TRIGGER trigger_on_candidate_assigned
AFTER INSERT OR UPDATE OF recruiter_id ON public.job_applications
FOR EACH ROW EXECUTE PROCEDURE public.on_application_assigned();

-- D. Trigger for Job Assignment
CREATE OR REPLACE FUNCTION public.on_job_assigned()
RETURNS TRIGGER AS $$
BEGIN
    -- Only notify if the recruiter_id changed (or was newly set)
    IF (OLD.recruiter_id IS DISTINCT FROM NEW.recruiter_id) AND NEW.recruiter_id IS NOT NULL THEN
        PERFORM public.create_notification(
            NEW.recruiter_id,
            'asignación',
            'Nueva vacante asignada',
            'Se te ha asignado la vacante: ' || NEW.title_es,
            '/admin/jobs/' || NEW.id
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_on_job_assigned ON public.job_openings;
CREATE TRIGGER trigger_on_job_assigned
AFTER INSERT OR UPDATE OF recruiter_id ON public.job_openings
FOR EACH ROW EXECUTE PROCEDURE public.on_job_assigned();
