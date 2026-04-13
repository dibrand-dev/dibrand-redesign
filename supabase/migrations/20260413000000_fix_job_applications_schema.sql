
-- FIX: Standardize job_applications schema for spontaneous applications
-- Ensures all columns used in submitApplication exist

DO $$ 
BEGIN 
  -- 1. Metadata column (for area of interest, seniority pref, etc)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_applications' AND column_name='metadata') THEN
    ALTER TABLE job_applications ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
  END IF;

  -- 2. Source column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_applications' AND column_name='source') THEN
    ALTER TABLE job_applications ADD COLUMN source TEXT;
  END IF;

  -- 3. Skills column (ensure it's TEXT[])
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_applications' AND column_name='skills') THEN
    ALTER TABLE job_applications ADD COLUMN skills TEXT[];
  END IF;

  -- 4. First Name / Last Name (if missing, though they should be there)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_applications' AND column_name='first_name') THEN
    ALTER TABLE job_applications ADD COLUMN first_name TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_applications' AND column_name='last_name') THEN
    ALTER TABLE job_applications ADD COLUMN last_name TEXT;
  END IF;

  -- 5. Email (Fundamental)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_applications' AND column_name='email') THEN
    ALTER TABLE job_applications ADD COLUMN email TEXT;
  END IF;

  -- 6. Country / State Province
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_applications' AND column_name='country') THEN
    ALTER TABLE job_applications ADD COLUMN country TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_applications' AND column_name='state_province') THEN
    ALTER TABLE job_applications ADD COLUMN state_province TEXT;
  END IF;

END $$;
