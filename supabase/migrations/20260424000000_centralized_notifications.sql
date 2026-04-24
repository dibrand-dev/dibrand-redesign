
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
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can view own or global notifications" ON public.notifications;

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

-- A. Trigger for New Notes (Handles Assignments & Mentions)
CREATE OR REPLACE FUNCTION public.on_application_note_created()
RETURNS TRIGGER AS $$
DECLARE
    v_recruiter_id UUID;
    v_candidate_name TEXT;
    v_mentioned_recruiter_id UUID;
    v_mention RECORD;
BEGIN
    -- 1. Resolve Candidate Info
    SELECT recruiter_id, COALESCE(full_name, first_name || ' ' || last_name, 'Candidato') 
    INTO v_recruiter_id, v_candidate_name
    FROM public.job_applications
    WHERE id = NEW.application_id;

    -- 2. Notify Assigned Recruiter (Standard)
    IF v_recruiter_id IS NOT NULL THEN
        PERFORM public.create_notification(
            v_recruiter_id,
            'nota',
            'Nueva nota en candidato',
            'Se ha agregado una nota para ' || v_candidate_name || ': "' || LEFT(NEW.note_text, 50) || '..."',
            '/ats/candidates/' || NEW.application_id
        );
    END IF;

    -- 3. Notify Mentioned Recruiters (@name)
    -- We look for @ followed by words in the note text
    -- This is a simple implementation: looks for @[Name]
    FOR v_mention IN 
        SELECT id, full_name 
        FROM public.recruiters 
        WHERE NEW.note_text ~* ('@' || replace(full_name, ' ', '.*'))
           OR NEW.note_text ~* ('@' || split_part(full_name, ' ', 1))
    LOOP
        -- Don't notify the assigned recruiter twice
        IF v_mention.id != COALESCE(v_recruiter_id, '00000000-0000-0000-0000-000000000000'::uuid) THEN
            PERFORM public.create_notification(
                v_mention.id,
                'nota',
                'Has sido mencionado/a',
                NEW.author_name || ' te mencionó en una nota de ' || v_candidate_name,
                '/ats/candidates/' || NEW.application_id
            );
        END IF;
    END LOOP;

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
            'El estado de ' || COALESCE(NEW.full_name, NEW.first_name || ' ' || NEW.last_name, 'Candidato') || ' cambió a ' || NEW.status,
            '/ats/candidates/' || NEW.id
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
            'Se te ha asignado el candidato: ' || COALESCE(NEW.full_name, NEW.first_name || ' ' || NEW.last_name, 'Candidato'),
            '/ats/candidates/' || NEW.id
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
            'Se te ha asignado la vacante: ' || COALESCE(NEW.title, NEW.title_es),
            '/ats/jobs/' || NEW.id
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_on_job_assigned ON public.job_openings;
CREATE TRIGGER trigger_on_job_assigned
AFTER INSERT OR UPDATE OF recruiter_id ON public.job_openings
FOR EACH ROW EXECUTE PROCEDURE public.on_job_assigned();
