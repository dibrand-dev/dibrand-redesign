
-- Drop the array column if we decided to go with a join table for better JOIN performance
ALTER TABLE public.job_openings DROP COLUMN IF EXISTS stack_ids;

-- Create join table for Job Openings and Tech Stacks
CREATE TABLE IF NOT EXISTS public.job_opening_stacks (
    job_id UUID REFERENCES public.job_openings(id) ON DELETE CASCADE,
    stack_id UUID REFERENCES public.tech_stacks(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    PRIMARY KEY (job_id, stack_id)
);

-- Enable RLS
ALTER TABLE public.job_opening_stacks ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Public Read Job Opening Stacks"
ON public.job_opening_stacks FOR SELECT
TO public USING (true);

-- Allow admin all
CREATE POLICY "Admin All Job Opening Stacks"
ON public.job_opening_stacks FOR ALL
TO authenticated USING (true) WITH CHECK (true);
