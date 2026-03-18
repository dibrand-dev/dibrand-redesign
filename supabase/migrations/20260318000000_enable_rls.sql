-- Fix missing RLS on public tables flagged by Supabase Security Advisor
-- Report Date: 15 Mar 2026

-- 1. Enable RLS on all mentioned tables
ALTER TABLE public.tech_stacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;

-- 2. Add appropriate policies. 
-- Note: The admin UI often uses the supabaseAdmin client (service_role key), 
-- which bypasses RLS naturally. These policies provide basic read access where needed
-- and broader authenticated access just in case the regular client is used.

-- tech_stacks: Anybody can read (public forms need to fetch tech stacks)
DROP POLICY IF EXISTS "Public Read Tech Stacks" ON public.tech_stacks;
CREATE POLICY "Public Read Tech Stacks"
ON public.tech_stacks FOR SELECT TO public USING (true);

-- success_stories: Anybody can read (portfolio sections)
DROP POLICY IF EXISTS "Public Read Success Stories" ON public.success_stories;
CREATE POLICY "Public Read Success Stories"
ON public.success_stories FOR SELECT TO public USING (true);

-- Admin / Authenticated policies for all tables
-- This ensures logged-in users (like admins) can perform necessary operations 
-- if they happen to use the standard authenticated client instead of the admin client.

DROP POLICY IF EXISTS "Admin All Tech Stacks" ON public.tech_stacks;
CREATE POLICY "Admin All Tech Stacks"
ON public.tech_stacks FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin All Success Stories" ON public.success_stories;
CREATE POLICY "Admin All Success Stories"
ON public.success_stories FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin All Job Applications" ON public.job_applications;
CREATE POLICY "Admin All Job Applications"
ON public.job_applications FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin All Application Notes" ON public.application_notes;
CREATE POLICY "Admin All Application Notes"
ON public.application_notes FOR ALL TO authenticated USING (true) WITH CHECK (true);
