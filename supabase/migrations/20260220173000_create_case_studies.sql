-- Create case_studies table
create table if not exists public.case_studies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  client_name text not null,
  summary text not null,
  description text not null,
  tags text[] not null default '{}',
  image_url text,
  is_published boolean not null default true,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.case_studies enable row level security;

-- Create policy for public select
drop policy if exists "Public Select" on public.case_studies;
create policy "Public Select"
on public.case_studies
for select
to public
using (true);

-- Create policy for authenticated insert/update/delete (open for development as requested)
-- Note: In production these should be restricted to admin users
drop policy if exists "Enable all for development" on public.case_studies;
create policy "Enable all for development"
on public.case_studies
for all
to public
using (true)
with check (true);
