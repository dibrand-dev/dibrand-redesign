-- Add project_type and services to case_studies table
ALTER TABLE public.case_studies
ADD COLUMN IF NOT EXISTS project_type TEXT,
ADD COLUMN IF NOT EXISTS services JSONB DEFAULT '[]'::jsonb;

-- Comment for clarity
COMMENT ON COLUMN public.case_studies.project_type IS 'Type of project (e.g. Web App, Mobile App, etc.)';
COMMENT ON COLUMN public.case_studies.services IS 'Array of services provided';
