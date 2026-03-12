-- JOBS ROBUSTNESS MIGRATION
-- Ensures all columns required by the new UI exist

-- 1. Add missing systemic columns
ALTER TABLE public.job_openings 
ADD COLUMN IF NOT EXISTS modality TEXT DEFAULT 'Remoto',
ADD COLUMN IF NOT EXISTS industry TEXT DEFAULT 'SaaS',
ADD COLUMN IF NOT EXISTS seniority TEXT DEFAULT 'Senior',
ADD COLUMN IF NOT EXISTS salary_range TEXT;

-- 2. Add bilingual columns (just in case they weren't added)
ALTER TABLE public.job_openings
ADD COLUMN IF NOT EXISTS title_es TEXT,
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS description_es TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS requirements_es TEXT,
ADD COLUMN IF NOT EXISTS requirements_en TEXT,
ADD COLUMN IF NOT EXISTS location_es TEXT,
ADD COLUMN IF NOT EXISTS location_en TEXT;

-- 3. Sync data
UPDATE public.job_openings
SET 
    title_es = COALESCE(title_es, title),
    description_es = COALESCE(description_es, description),
    requirements_es = COALESCE(requirements_es, requirements),
    location_es = COALESCE(location_es, location)
WHERE title_es IS NULL;

UPDATE public.job_openings
SET 
    title_en = COALESCE(title_en, title_es),
    description_en = COALESCE(description_en, description_es),
    requirements_en = COALESCE(requirements_en, requirements_es),
    location_en = COALESCE(location_en, location_es)
WHERE title_en IS NULL;
