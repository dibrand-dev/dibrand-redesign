-- Create leads table
create table public.leads (
  id uuid not null default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  service_interest text,
  message text,
  created_at timestamp with time zone not null default now(),
  constraint leads_pkey primary key (id)
);

-- Enable RLS
alter table public.leads enable row level security;

-- Policies for leads

-- Public Insert (Anyone can submit a lead)
create policy "Enable insert for all users"
on public.leads
as permissive
for insert
to public
with check (true);

-- Admin Read (Authenticated users only)
create policy "Enable read access for authenticated users only"
on public.leads
as permissive
for select
to authenticated
using (true);

-- Admin Delete (Authenticated users only - optional, but good for cleanup)
create policy "Enable delete for authenticated users only"
on public.leads
as permissive
for delete
to authenticated
using (true);
