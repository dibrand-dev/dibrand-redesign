-- Add modality column to job_openings
ALTER TABLE job_openings ADD COLUMN IF NOT EXISTS modality TEXT DEFAULT 'Remoto';
