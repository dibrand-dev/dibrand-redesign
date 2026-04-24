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

-- Sync existing recruiters from auth.users
INSERT INTO public.recruiters (id, full_name, email, is_active)
SELECT 
    id, 
    COALESCE(raw_user_meta_data->>'full_name', email, 'Reclutador'), 
    email, 
    true
FROM auth.users
WHERE (raw_user_meta_data->>'role' IN ('admin', 'SuperAdmin', 'recruiter')) OR (email LIKE '%dibrand%')
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email;
