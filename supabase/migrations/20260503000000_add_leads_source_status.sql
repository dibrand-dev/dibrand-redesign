-- Add source_form column to leads table to track where the lead came from
alter table public.leads
add column if not exists source_form text;

-- Also add a status column for future lead management workflows
alter table public.leads
add column if not exists status text not null default 'new';
