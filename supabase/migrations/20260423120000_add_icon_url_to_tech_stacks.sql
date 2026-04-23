-- Add icon_url column to tech_stacks table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tech_stacks' AND column_name='icon_url') THEN
        ALTER TABLE public.tech_stacks ADD COLUMN icon_url TEXT;
    END IF;
END $$;

-- Verify if we need to rename logo_url to icon_url (unlikely but just in case someone added logo_url)
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tech_stacks' AND column_name='logo_url') 
    AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tech_stacks' AND column_name='icon_url') THEN
        ALTER TABLE public.tech_stacks RENAME COLUMN logo_url TO icon_url;
    END IF;
END $$;
