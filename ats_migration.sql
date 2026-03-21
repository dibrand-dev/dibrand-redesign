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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add recruiter_id to job_applications
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_applications' AND column_name='recruiter_id') THEN
    ALTER TABLE job_applications ADD COLUMN recruiter_id UUID REFERENCES recruiters(id);
  END IF;
END $$;

-- 3. Add target_hires to job_openings (if not exists)
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_openings' AND column_name='target_hires') THEN
    ALTER TABLE job_openings ADD COLUMN target_hires INT DEFAULT 1;
  END IF;
END $$;

-- 4. Add Index for performance
CREATE INDEX IF NOT EXISTS idx_job_applications_recruiter ON job_applications(recruiter_id);

-- 5. SUPABASE TRIGGER: Handle Invited User Sync
-- This function copies metadata from auth.users to public.recruiters automatically
CREATE OR REPLACE FUNCTION public.handle_invited_recruiter()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.recruiters (id, email, first_name, last_name, full_name, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'firstName',
    NEW.raw_user_meta_data->>'lastName',
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    TRUE
  )
  ON CONFLICT (id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    full_name = EXCLUDED.full_name;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute on auth.users AFTER INSERT
DROP TRIGGER IF EXISTS on_auth_user_invited ON auth.users;
CREATE TRIGGER on_auth_user_invited
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_invited_recruiter();

-- 6. Enable RLS
ALTER TABLE recruiters ENABLE ROW LEVEL SECURITY;
