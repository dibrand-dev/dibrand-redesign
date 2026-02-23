-- Create job_openings table
create table if not exists public.job_openings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  department text not null,
  location text not null,
  employment_type text not null,
  description text not null,
  requirements text not null,
  is_active boolean not null default true,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.job_openings enable row level security;

-- Create policy for public select
drop policy if exists "Public Select" on public.job_openings;
create policy "Public Select"
on public.job_openings
for select
to public
using (true);

-- Create policy for development (open access)
drop policy if exists "Enable all for development" on public.job_openings;
create policy "Enable all for development"
on public.job_openings
for all
to public
using (true)
with check (true);
