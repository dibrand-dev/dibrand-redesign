
-- Add new fields for job filtering and management
ALTER TABLE job_openings 
ADD COLUMN IF NOT EXISTS required_language text,
ADD COLUMN IF NOT EXISTS years_of_experience text,
ADD COLUMN IF NOT EXISTS positions_count integer DEFAULT 1;

-- Ensure employment_type is present (already should be, but just in case)
-- ALTER TABLE job_openings ADD COLUMN IF NOT EXISTS employment_type text;
