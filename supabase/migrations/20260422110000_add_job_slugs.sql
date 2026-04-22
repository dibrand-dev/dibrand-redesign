
-- Add slug column to job_openings
ALTER TABLE job_openings 
ADD COLUMN IF NOT EXISTS slug text UNIQUE;

-- Create an index for the slug column for better performance
CREATE INDEX IF NOT EXISTS job_openings_slug_idx ON job_openings (slug);

-- Update existing jobs to have a slug if they don't have one
-- Removes special characters, replaces spaces with hyphens, and appends prefix of ID to ensure uniqueness
UPDATE job_openings 
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      title, 
      '[^a-zA-Z0-9\s-]', '', 'g'
    ),
    '\s+', '-', 'g'
  )
) || '-' || SUBSTRING(id::text, 1, 4)
WHERE slug IS NULL OR slug LIKE '%/%' OR slug LIKE '% %';
