-- Add sort_order column to success_stories and case_studies
ALTER TABLE public.success_stories
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

ALTER TABLE public.case_studies
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
