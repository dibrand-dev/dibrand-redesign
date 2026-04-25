-- Ensure recruiters can see each other for mentions
ALTER TABLE public.recruiters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated to view recruiters" ON public.recruiters;
CREATE POLICY "Allow authenticated to view recruiters" 
ON public.recruiters FOR SELECT 
TO authenticated 
USING (true);

-- Ensure is_active and profile columns exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='recruiters' AND column_name='is_active') THEN
        ALTER TABLE public.recruiters ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='recruiters' AND column_name='job_title') THEN
        ALTER TABLE public.recruiters ADD COLUMN job_title TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='recruiters' AND column_name='phone') THEN
        ALTER TABLE public.recruiters ADD COLUMN phone TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='recruiters' AND column_name='avatar_url') THEN
        ALTER TABLE public.recruiters ADD COLUMN avatar_url TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='recruiters' AND column_name='updated_at') THEN
        ALTER TABLE public.recruiters ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Sync existing recruiters from auth.users (Improved version)
INSERT INTO public.recruiters (id, full_name, email, is_active, job_title, phone, avatar_url)
SELECT 
    id, 
    COALESCE(raw_user_meta_data->>'full_name', email, 'Reclutador'), 
    email, 
    true,
    raw_user_meta_data->>'job_title',
    raw_user_meta_data->>'phone',
    raw_user_meta_data->>'avatar_url'
FROM auth.users
WHERE 
    LOWER(raw_user_meta_data->>'role') IN ('admin', 'superadmin', 'recruiter') 
    OR email LIKE '%dibrand%'
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    job_title = EXCLUDED.job_title,
    phone = EXCLUDED.phone,
    avatar_url = EXCLUDED.avatar_url;

-- 4. Automatic sync trigger for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_recruiter()
RETURNS TRIGGER AS $$
BEGIN
    IF (LOWER(NEW.raw_user_meta_data->>'role') IN ('admin', 'superadmin', 'recruiter')) THEN
        INSERT INTO public.recruiters (id, full_name, email, is_active, job_title, phone, avatar_url)
        VALUES (
            NEW.id, 
            COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), 
            NEW.email, 
            true,
            NEW.raw_user_meta_data->>'job_title',
            NEW.raw_user_meta_data->>'phone',
            NEW.raw_user_meta_data->>'avatar_url'
        )
        ON CONFLICT (id) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            job_title = EXCLUDED.job_title,
            phone = EXCLUDED.phone,
            avatar_url = EXCLUDED.avatar_url;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_recruiter ON auth.users;
CREATE TRIGGER on_auth_user_created_recruiter
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_recruiter();
