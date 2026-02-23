-- Create case_studies table
create table public.case_studies (
  id uuid not null default gen_random_uuid(),
  title text not null,
  client_name text not null,
  summary_en text,
  summary_es text,
  image_url text,
  tags text[],
  created_at timestamp with time zone not null default now(),
  constraint case_studies_pkey primary key (id)
);

-- Create job_openings table
create table public.job_openings (
  id uuid not null default gen_random_uuid(),
  position_title text not null,
  seniority text,
  location text,
  description_en text,
  description_es text,
  is_active boolean not null default true,
  constraint job_openings_pkey primary key (id)
);

-- Enable RLS
alter table public.case_studies enable row level security;
alter table public.job_openings enable row level security;

-- Policies for case_studies

-- Public Read
create policy "Enable read access for all users"
on public.case_studies
as permissive
for select
to public
using (true);

-- Admin Write (Authenticated users)
create policy "Enable insert for authenticated users only"
on public.case_studies
as permissive
for insert
to authenticated
with check (true);

create policy "Enable update for authenticated users only"
on public.case_studies
as permissive
for update
to authenticated
using (true)
with check (true);

create policy "Enable delete for authenticated users only"
on public.case_studies
as permissive
for delete
to authenticated
using (true);

-- Policies for job_openings

-- Public Read
create policy "Enable read access for all users"
on public.job_openings
as permissive
for select
to public
using (true);

-- Admin Write (Authenticated users)
create policy "Enable insert for authenticated users only"
on public.job_openings
as permissive
for insert
to authenticated
with check (true);

create policy "Enable update for authenticated users only"
on public.job_openings
as permissive
for update
to authenticated
using (true)
with check (true);

create policy "Enable delete for authenticated users only"
on public.job_openings
as permissive
for delete
to authenticated
using (true);
