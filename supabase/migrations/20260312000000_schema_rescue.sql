-- RESCUE MIGRATION (VFINAL): Ensure all columns expected by the application exist
-- This fixes "Runtime Error" and "Empty Content" in both Admin and Frontend

-- 1. SUCCESS STORIES: Add missing bilingual and metadata columns
ALTER TABLE public.success_stories
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS description_es TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS challenge_es TEXT,
ADD COLUMN IF NOT EXISTS challenge_en TEXT,
ADD COLUMN IF NOT EXISTS solution_es TEXT,
ADD COLUMN IF NOT EXISTS solution_en TEXT,
ADD COLUMN IF NOT EXISTS impact_es TEXT,
ADD COLUMN IF NOT EXISTS impact_en TEXT,
ADD COLUMN IF NOT EXISTS hero_image_url TEXT,
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS stack_ids UUID[] DEFAULT '{}'::uuid[],
ADD COLUMN IF NOT EXISTS services JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS project_type TEXT,
-- Aliases for fallback/legacy support
ADD COLUMN IF NOT EXISTS summary_es TEXT,
ADD COLUMN IF NOT EXISTS summary_en TEXT,
ADD COLUMN IF NOT EXISTS problem_es TEXT,
ADD COLUMN IF NOT EXISTS problem_en TEXT,
ADD COLUMN IF NOT EXISTS result_es TEXT,
ADD COLUMN IF NOT EXISTS result_en TEXT;

-- 2. CASE STUDIES: Synchronize columns with success_stories
ALTER TABLE public.case_studies
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS description_es TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS challenge_es TEXT,
ADD COLUMN IF NOT EXISTS challenge_en TEXT,
ADD COLUMN IF NOT EXISTS solution_es TEXT,
ADD COLUMN IF NOT EXISTS solution_en TEXT,
ADD COLUMN IF NOT EXISTS impact_es TEXT,
ADD COLUMN IF NOT EXISTS impact_en TEXT,
ADD COLUMN IF NOT EXISTS project_type TEXT,
ADD COLUMN IF NOT EXISTS services JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS stack_ids UUID[] DEFAULT '{}'::uuid[],
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true,
-- Extra Aliases for the "Shotgun Approach" sync
ADD COLUMN IF NOT EXISTS summary_es TEXT,
ADD COLUMN IF NOT EXISTS summary_en TEXT,
ADD COLUMN IF NOT EXISTS problem_es TEXT,
ADD COLUMN IF NOT EXISTS problem_en TEXT,
ADD COLUMN IF NOT EXISTS result_es TEXT,
ADD COLUMN IF NOT EXISTS result_en TEXT;
