-- Create resumes bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow Public Select for resumes
CREATE POLICY "Public Read Resumes" 
ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id = 'resumes');

-- Allow Public Upload for resumes (needed for the public form)
CREATE POLICY "Public Upload Resumes" 
ON storage.objects 
FOR INSERT 
TO public 
WITH CHECK (bucket_id = 'resumes');

-- Ensure job_applications table is ready (if not already)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_applications' AND column_name='linkedin_url') THEN
        ALTER TABLE public.job_applications ADD COLUMN linkedin_url text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_applications' AND column_name='resume_url') THEN
        ALTER TABLE public.job_applications ADD COLUMN resume_url text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_applications' AND column_name='phone') THEN
        ALTER TABLE public.job_applications ADD COLUMN phone text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_applications' AND column_name='state') THEN
        ALTER TABLE public.job_applications ADD COLUMN state text;
    END IF;
END $$;
