-- JOBS BILINGUAL RESCUE MIGRATION V2
-- Adds bilingual support to job_openings and migrates existing data.

-- 1. Add bilingual columns
ALTER TABLE public.job_openings
ADD COLUMN IF NOT EXISTS title_es TEXT,
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS description_es TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS requirements_es TEXT,
ADD COLUMN IF NOT EXISTS requirements_en TEXT,
ADD COLUMN IF NOT EXISTS location_es TEXT,
ADD COLUMN IF NOT EXISTS location_en TEXT;

-- 2. Migrate existing data from legacy columns to _es versions
-- Only update if the target column is NULL to avoid overwriting existing bilingual work
UPDATE public.job_openings
SET 
    title_es = COALESCE(title_es, title),
    description_es = COALESCE(description_es, description),
    requirements_es = COALESCE(requirements_es, requirements),
    location_es = COALESCE(location_es, location);

-- 3. Ensure title_en/description_en fallbacks if they are empty
UPDATE public.job_openings
SET 
    title_en = COALESCE(title_en, title),
    description_en = COALESCE(description_en, description),
    requirements_en = COALESCE(requirements_en, requirements),
    location_en = COALESCE(location_en, location)
WHERE title_en IS NULL OR title_en = '';
