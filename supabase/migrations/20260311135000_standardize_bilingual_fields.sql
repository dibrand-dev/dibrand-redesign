-- Standardize bilingual fields in success_stories and case_studies
-- Following user request for specific column names

-- SUCCESS STORIES
ALTER TABLE public.success_stories
ADD COLUMN IF NOT EXISTS title_es TEXT,
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS client_name TEXT,
ADD COLUMN IF NOT EXISTS description_es TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS challenge_es TEXT,
ADD COLUMN IF NOT EXISTS challenge_en TEXT,
ADD COLUMN IF NOT EXISTS solution_es TEXT,
ADD COLUMN IF NOT EXISTS solution_en TEXT,
ADD COLUMN IF NOT EXISTS impact_es TEXT,
ADD COLUMN IF NOT EXISTS impact_en TEXT;

-- CASE STUDIES
ALTER TABLE public.case_studies
ADD COLUMN IF NOT EXISTS title_es TEXT,
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS description_es TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS challenge_es TEXT,
ADD COLUMN IF NOT EXISTS challenge_en TEXT,
ADD COLUMN IF NOT EXISTS solution_es TEXT,
ADD COLUMN IF NOT EXISTS solution_en TEXT,
ADD COLUMN IF NOT EXISTS impact_es TEXT,
ADD COLUMN IF NOT EXISTS impact_en TEXT;

-- Data Rescue / Migration
-- Copy from existing columns to new bilingual ES columns if ES is empty
UPDATE public.success_stories
SET
    title_es = COALESCE(title_es, title),
    client_name = COALESCE(client_name, client_company),
    description_es = COALESCE(description_es, executive_summary),
    challenge_es = COALESCE(challenge_es, problem_text),
    solution_es = COALESCE(solution_es, solution_text),
    impact_es = COALESCE(impact_es, result_text);

UPDATE public.case_studies
SET
    title_es = COALESCE(title_es, title),
    description_es = COALESCE(description_es, summary),
    challenge_es = COALESCE(challenge_es, challenge),
    solution_es = COALESCE(solution_es, solution),
    impact_es = COALESCE(impact_es, outcome_impact);

-- Ensure client_name is populated and set unique constraint if possible
-- Note: UNIQUE constraint might fail if there are duplicates. 
-- We'll try to add it but maybe wrapped in a way that doesn't break everything if failing.
-- For now, let's just make sure client_name is not null where possible.
UPDATE public.success_stories SET client_name = 'Pending Client' WHERE client_name IS NULL;

-- DO NOT enforce UNIQUE yet to avoid migration failure, but will use it in logic.
-- ALTER TABLE public.success_stories ADD CONSTRAINT success_stories_client_name_key UNIQUE (client_name);
