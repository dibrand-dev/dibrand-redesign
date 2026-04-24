-- Ensure recruiters can see each other for mentions
ALTER TABLE public.recruiters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated to view recruiters" ON public.recruiters;
CREATE POLICY "Allow authenticated to view recruiters" 
ON public.recruiters FOR SELECT 
TO authenticated 
USING (true);

-- Ensure is_active column exists and has a default
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='recruiters' AND column_name='is_active') THEN
        ALTER TABLE public.recruiters ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
END $$;
