-- Add services column to success_stories
ALTER TABLE public.success_stories
ADD COLUMN IF NOT EXISTS services JSONB DEFAULT '[]'::jsonb;

-- Insert missing tech stacks
INSERT INTO public.tech_stacks (name)
SELECT unnest(ARRAY[
    'JavaScript', 'Java', 'C', 'C++', 'C#', 'Flutter', 'Kotlin', 'PHP', 
    'SQL', 'Swift', 'Go', 'Rust', 'R', 'Ruby', '.Net', 'Azure', 'GCP'
])
ON CONFLICT (name) DO NOTHING;
