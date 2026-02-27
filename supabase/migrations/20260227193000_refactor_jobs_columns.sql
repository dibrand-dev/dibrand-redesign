-- Migration to align job_openings table with new requirements
DO $$ 
BEGIN
    -- Rename department to industry if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'job_openings' AND column_name = 'department') THEN
        ALTER TABLE public.job_openings RENAME COLUMN department TO industry;
    END IF;

    -- Add seniority if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'job_openings' AND column_name = 'seniority') THEN
        ALTER TABLE public.job_openings ADD COLUMN seniority text;
    END IF;

    -- Add salary_range if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'job_openings' AND column_name = 'salary_range') THEN
        ALTER TABLE public.job_openings ADD COLUMN salary_range text;
    END IF;
END $$;
