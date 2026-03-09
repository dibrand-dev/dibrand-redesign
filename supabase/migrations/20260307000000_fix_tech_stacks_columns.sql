-- Add icon_url column to tech_stacks table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tech_stacks' AND column_name='icon_url') THEN
        ALTER TABLE public.tech_stacks ADD COLUMN icon_url text;
    END IF;
END $$;

-- Ensure name is unique
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tech_stacks_name_key') THEN
        ALTER TABLE public.tech_stacks ADD CONSTRAINT tech_stacks_name_key UNIQUE (name);
    END IF;
END $$;
