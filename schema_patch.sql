-- SQL to add missing columns for Add Candidate form
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS candidate_summary TEXT;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS state_province TEXT;
-- Ensure full_name exists (it was mentioned in step 923, but let's be sure)
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS full_name TEXT;
