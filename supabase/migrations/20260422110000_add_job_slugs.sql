
-- Add slug column to job_openings
ALTER TABLE job_openings 
ADD COLUMN IF NOT EXISTS slug text UNIQUE;

-- Create an index for the slug column for better performance
CREATE INDEX IF NOT EXISTS job_openings_slug_idx ON job_openings (slug);

-- Update existing jobs to have a slug if they don't have one
-- This is a simple version, might have collisions but it's a starting point for existing data
UPDATE job_openings 
SET slug = LOWER(REPLACE(title, ' ', '-')) || '-' || SUBSTRING(id::text, 1, 4)
WHERE slug IS NULL;
