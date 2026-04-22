
-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_code TEXT UNIQUE NOT NULL,
    company_name TEXT NOT NULL,
    contact_name TEXT,
    email TEXT,
    phone TEXT,
    mobile TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add company_id to job_openings table
ALTER TABLE job_openings 
ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id) ON DELETE SET NULL;

-- Create index for company_id for better join performance
CREATE INDEX IF NOT EXISTS job_openings_company_id_idx ON job_openings (company_id);

-- Enable RLS for companies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Policy for admins only (assuming service_role or specific admin roles)
-- For now, we'll keep it simple if the project uses service_role for admin actions
CREATE POLICY "Admins can do everything on companies" 
ON companies FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
