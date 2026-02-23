-- Fix Case Studies Table Columns (ensure they match current code)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='case_studies' AND column_name='summary') THEN
        ALTER TABLE public.case_studies ADD COLUMN summary text DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='case_studies' AND column_name='description') THEN
        ALTER TABLE public.case_studies ADD COLUMN description text DEFAULT '';
    END IF;
END $$;

-- Reset and Fix RLS Policies for case_studies
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Select" ON public.case_studies;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.case_studies;
DROP POLICY IF EXISTS "Enable all for development" ON public.case_studies;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.case_studies;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.case_studies;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.case_studies;

CREATE POLICY "Allow All for development" 
ON public.case_studies 
FOR ALL 
TO public 
USING (true) 
WITH CHECK (true);

-- Storage Policies for 'portfolio' bucket
-- Note: User said bucket 'portfolio' already exists

-- Grant access to the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow Public Select for images
CREATE POLICY "Public Access" 
ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id = 'portfolio');

-- Allow All for development on Storage
CREATE POLICY "Full Access for development" 
ON storage.objects 
FOR ALL 
TO public 
USING (bucket_id = 'portfolio') 
WITH CHECK (bucket_id = 'portfolio');
