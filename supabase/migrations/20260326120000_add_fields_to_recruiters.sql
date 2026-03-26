-- Add phone and job_title columns to recruiters table
ALTER TABLE public.recruiters 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS job_title TEXT;

-- Refresh the view if any, or just ensure columns are available for the application
COMMENT ON COLUMN public.recruiters.phone IS 'Recruiter phone number for contact';
COMMENT ON COLUMN public.recruiters.job_title IS 'Recruiter professional title/position';
