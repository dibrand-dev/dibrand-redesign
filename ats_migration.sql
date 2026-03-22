-- Dibrand ATS Module - Database Migration Instructions
-- Execute these in your Supabase SQL Editor

-- 1. Create RECRUITERS Table
CREATE TABLE IF NOT EXISTS recruiters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT,
  last_name TEXT,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  company TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add columns to job_applications
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_applications' AND column_name='recruiter_id') THEN
    ALTER TABLE job_applications ADD COLUMN recruiter_id UUID REFERENCES recruiters(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_applications' AND column_name='updated_at') THEN
    ALTER TABLE job_applications ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
  END IF;
END $$;

-- 3. Add columns to job_openings
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_openings' AND column_name='target_hires') THEN
    ALTER TABLE job_openings ADD COLUMN target_hires INT DEFAULT 1;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_openings' AND column_name='updated_at') THEN
    ALTER TABLE job_openings ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
  END IF;
END $$;

-- 4. Function for auto-updating updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Set triggers for updated_at
DROP TRIGGER IF EXISTS handle_recruiters_updated_at ON public.recruiters;
CREATE TRIGGER handle_recruiters_updated_at BEFORE UPDATE ON public.recruiters
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

DROP TRIGGER IF EXISTS handle_applications_updated_at ON public.job_applications;
CREATE TRIGGER handle_applications_updated_at BEFORE UPDATE ON public.job_applications
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

DROP TRIGGER IF EXISTS handle_openings_updated_at ON public.job_openings;
CREATE TRIGGER handle_openings_updated_at BEFORE UPDATE ON public.job_openings
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- 6. Add Index for performance
CREATE INDEX IF NOT EXISTS idx_job_applications_recruiter ON job_applications(recruiter_id);

-- 7. SUPABASE TRIGGER: Handle Invited User Sync
-- This function copies metadata from auth.users to public.recruiters automatically
CREATE OR REPLACE FUNCTION public.handle_invited_recruiter()
RETURNS TRIGGER AS $$
BEGIN
  -- First, we check if there's an existing recruiter with this email but different ID
  -- This avoids unique constraint violations if a user was re-invited
  DELETE FROM public.recruiters WHERE email = NEW.email AND id != NEW.id;

  INSERT INTO public.recruiters (id, email, first_name, last_name, full_name, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'firstName', ''),
    COALESCE(NEW.raw_user_meta_data->>'lastName', ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    TRUE
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    full_name = EXCLUDED.full_name,
    updated_at = timezone('utc'::text, now());
    
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- We catch all errors to never block the main Auth process
  -- The syncRecruiterProfile() action in the code will handle 
  -- the profile creation if this trigger fails.
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute on auth.users AFTER INSERT
DROP TRIGGER IF EXISTS on_auth_user_invited ON auth.users;
CREATE TRIGGER on_auth_user_invited
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_invited_recruiter();

-- 8. Enable RLS
ALTER TABLE recruiters ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- 9. RECRUITERS Policies
DROP POLICY IF EXISTS "Recruiters are viewable by everyone logged in" ON recruiters;
CREATE POLICY "Recruiters are viewable by everyone logged in"
  ON recruiters FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Recruiters can update own profile" ON recruiters;
CREATE POLICY "Recruiters can update own profile"
  ON recruiters FOR UPDATE
  USING (auth.uid() = id);

-- 10. JOB_APPLICATIONS Policies
DROP POLICY IF EXISTS "Admins can do everything on applications" ON job_applications;
CREATE POLICY "Admins can do everything on applications"
  ON job_applications FOR ALL
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

DROP POLICY IF EXISTS "Recruiters can view assigned applications" ON job_applications;
CREATE POLICY "Recruiters can view assigned applications"
  ON job_applications FOR SELECT
  USING (
    recruiter_id = auth.uid() OR 
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

DROP POLICY IF EXISTS "Recruiters can update assigned applications" ON job_applications;
CREATE POLICY "Recruiters can update assigned applications"
  ON job_applications FOR UPDATE
  USING (
    recruiter_id = auth.uid() OR 
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- 11. DATA CLEANUP: Link all current applications to the first active recruiter (for testing)
-- Replace 'USER_ID_HERE' with a real ID if needed, or let the sync handle it.
-- This ensures the user can see existing demo data.
DO $$
DECLARE
  first_recruiter_id UUID;
BEGIN
  SELECT id INTO first_recruiter_id FROM recruiters LIMIT 1;
  IF first_recruiter_id IS NOT NULL THEN
    UPDATE job_applications SET recruiter_id = first_recruiter_id WHERE recruiter_id IS NULL;
  END IF;
END $$;
