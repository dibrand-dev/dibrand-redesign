-- DASHBOARD V2 SCHEMA
-- Implementation of analytics tracking and admin logging

-- 1. Create analytics_events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL, -- 'page_view', 'click'
    event_name TEXT NOT NULL, -- 'portfolio_view', 'appointment_click'
    path TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS analytics_events_event_name_idx ON public.analytics_events(event_name);
CREATE INDEX IF NOT EXISTS analytics_events_created_at_idx ON public.analytics_events(created_at);

-- 2. Create admin_logs table
CREATE TABLE IF NOT EXISTS public.admin_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_email TEXT, -- We can use email for easier display if we don't want to join with auth.users constantly
    action TEXT NOT NULL,
    target_type TEXT, -- 'case_study', 'job_opening', etc.
    target_name TEXT, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Create leads table if missing (Recovery)
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  service_interest text,
  message text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT leads_pkey PRIMARY KEY (id)
);

-- 3. RLS for analytics
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable insert for all' AND tablename = 'analytics_events') THEN
        CREATE POLICY "Enable insert for all" ON public.analytics_events FOR INSERT TO anon WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable select for authenticated' AND tablename = 'analytics_events') THEN
        CREATE POLICY "Enable select for authenticated" ON public.analytics_events FOR SELECT TO authenticated USING (true);
    END IF;
END $$;

-- 4. RLS for admin_logs
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable select for authenticated' AND tablename = 'admin_logs') THEN
        CREATE POLICY "Enable select for authenticated" ON public.admin_logs FOR SELECT TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable insert for authenticated' AND tablename = 'admin_logs') THEN
        CREATE POLICY "Enable insert for authenticated" ON public.admin_logs FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
END $$;

-- 6. RLS for leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable insert for all' AND tablename = 'leads') THEN
        CREATE POLICY "Enable insert for all" ON public.leads FOR INSERT TO anon WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable insert for authenticated' AND tablename = 'leads') THEN
        CREATE POLICY "Enable insert for authenticated" ON public.leads FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable read for authenticated' AND tablename = 'leads') THEN
        CREATE POLICY "Enable read for authenticated" ON public.leads FOR SELECT TO authenticated USING (true);
    END IF;
END $$;
