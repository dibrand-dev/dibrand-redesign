-- NOTIFICATIONS SYSTEM
-- Implementation of notification tracking

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL, -- 'candidate', 'lead', 'system'
    title TEXT NOT NULL,
    description TEXT,
    is_read BOOLEAN DEFAULT false,
    link TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON public.notifications(created_at);

-- RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable select for authenticated' AND tablename = 'notifications') THEN
        CREATE POLICY "Enable select for authenticated" ON public.notifications FOR SELECT TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable update for authenticated' AND tablename = 'notifications') THEN
        CREATE POLICY "Enable update for authenticated" ON public.notifications FOR UPDATE TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable insert for authenticated' AND tablename = 'notifications') THEN
        CREATE POLICY "Enable insert for authenticated" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
END $$;
