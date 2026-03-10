-- Add multilingual fields to success_stories
ALTER TABLE public.success_stories
ADD COLUMN IF NOT EXISTS title_es TEXT,
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS summary_es TEXT,
ADD COLUMN IF NOT EXISTS summary_en TEXT,
ADD COLUMN IF NOT EXISTS problem_es TEXT,
ADD COLUMN IF NOT EXISTS problem_en TEXT,
ADD COLUMN IF NOT EXISTS solution_es TEXT,
ADD COLUMN IF NOT EXISTS solution_en TEXT,
ADD COLUMN IF NOT EXISTS result_es TEXT,
ADD COLUMN IF NOT EXISTS result_en TEXT;

-- Add multilingual fields to case_studies
ALTER TABLE public.case_studies
ADD COLUMN IF NOT EXISTS title_es TEXT,
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS summary_es TEXT,
ADD COLUMN IF NOT EXISTS summary_en TEXT,
ADD COLUMN IF NOT EXISTS challenge_es TEXT,
ADD COLUMN IF NOT EXISTS challenge_en TEXT,
ADD COLUMN IF NOT EXISTS solution_es TEXT,
ADD COLUMN IF NOT EXISTS solution_en TEXT,
ADD COLUMN IF NOT EXISTS outcome_impact_es TEXT,
ADD COLUMN IF NOT EXISTS outcome_impact_en TEXT;

-- Backfill data (copy existing single-language content to ES and EN as a starting point)
UPDATE public.success_stories 
SET 
  title_es = COALESCE(title_es, title),
  title_en = COALESCE(title_en, title),
  summary_es = COALESCE(summary_es, executive_summary),
  summary_en = COALESCE(summary_en, executive_summary),
  problem_es = COALESCE(problem_es, problem_text),
  problem_en = COALESCE(problem_en, problem_text),
  solution_es = COALESCE(solution_es, solution_text),
  solution_en = COALESCE(solution_en, solution_text),
  result_es = COALESCE(result_es, result_text),
  result_en = COALESCE(result_en, result_text);

UPDATE public.case_studies
SET
  title_es = COALESCE(title_es, title),
  title_en = COALESCE(title_en, title),
  summary_es = COALESCE(summary_es, summary),
  summary_en = COALESCE(summary_en, summary),
  challenge_es = COALESCE(challenge_es, challenge),
  challenge_en = COALESCE(challenge_en, challenge),
  solution_es = COALESCE(solution_es, solution),
  solution_en = COALESCE(solution_en, solution),
  outcome_impact_es = COALESCE(outcome_impact_es, outcome_impact),
  outcome_impact_en = COALESCE(outcome_impact_en, outcome_impact);
