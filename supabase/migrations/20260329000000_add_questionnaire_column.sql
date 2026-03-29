-- Add questionnaire column to job_openings
ALTER TABLE job_openings ADD COLUMN IF NOT EXISTS questionnaire JSONB DEFAULT NULL;
