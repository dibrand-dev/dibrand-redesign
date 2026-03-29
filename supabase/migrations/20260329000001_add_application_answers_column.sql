-- Add questionnaire_answers column to job_applications table
ALTER TABLE public.job_applications 
ADD COLUMN IF NOT EXISTS questionnaire_answers JSONB DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN public.job_applications.questionnaire_answers IS 'Stores the candidate answers to the job vetting questionnaire';
