-- Create interviews table
CREATE TABLE IF NOT EXISTS public.job_interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES public.job_applications(id) ON DELETE CASCADE,
    recruiter_id UUID REFERENCES public.recruiters(id) ON DELETE SET NULL,
    job_id UUID REFERENCES public.job_openings(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('Technical', 'Cultural', 'Final Review', 'Case Study', 'Offer')),
    status TEXT NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Completed', 'Cancelled', 'Rescheduled')),
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    video_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.job_interviews ENABLE ROW LEVEL SECURITY;

-- Simple RLS Policy
CREATE POLICY "Allow authenticated users to manage interviews" 
ON public.job_interviews 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Add sample interviews for demo/testing
-- Elena Rodriguez (Assuming she exists from Elena's ID or dummy uuid if needed)
-- We'll insert real candidate IDs after checking them
