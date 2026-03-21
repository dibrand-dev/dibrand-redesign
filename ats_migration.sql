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
    full_name = EXCLUDED.full_name,
    updated_at = timezone('utc'::text, now());
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
