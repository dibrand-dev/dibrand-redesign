-- Dibrand ATS Module - Database Migration Instructions
-- Execute these in your Supabase SQL Editor

-- 1. Create RECRUITERS Table
CREATE TABLE IF NOT EXISTS recruiters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- 4. Enable RLS (Optional, recommended)
ALTER TABLE recruiters ENABLE ROW LEVEL SECURITY;

-- 5. Example Policy: Recruiters can only see their own application records
-- CREATE POLICY recruiter_view_own_candidates ON job_applications
-- FOR SELECT USING (recruiter_id = auth.uid());
