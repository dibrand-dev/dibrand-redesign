-- Ensure tech_stacks table exists and has icon_url column
CREATE TABLE IF NOT EXISTS public.tech_stacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  icon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add icon_url if table existed but column didn't
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tech_stacks' AND column_name='icon_url') THEN
        ALTER TABLE public.tech_stacks ADD COLUMN icon_url TEXT;
    END IF;
END $$;

-- Enable RLS
ALTER TABLE public.tech_stacks ENABLE ROW LEVEL SECURITY;

-- Allow public select
DROP POLICY IF EXISTS "Public Read Tech Stacks" ON public.tech_stacks;
CREATE POLICY "Public Read Tech Stacks"
ON public.tech_stacks
FOR SELECT
TO public
USING (true);

-- Allow everything for authenticated users (admin)
DROP POLICY IF EXISTS "Admin All Tech Stacks" ON public.tech_stacks;
CREATE POLICY "Admin All Tech Stacks"
ON public.tech_stacks
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
