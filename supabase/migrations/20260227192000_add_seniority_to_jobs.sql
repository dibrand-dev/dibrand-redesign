-- Add seniority column to job_openings table
alter table public.job_openings 
add column if not exists seniority text;
