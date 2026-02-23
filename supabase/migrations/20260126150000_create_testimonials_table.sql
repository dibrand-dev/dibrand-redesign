-- Create testimonials table
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_logo_url text,
  quote text not null,
  author_name text not null,
  author_role text not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.testimonials enable row level security;

-- Create policy for public select
drop policy if exists "Public Select" on public.testimonials;
create policy "Public Select"
on public.testimonials
for select
to public
using (true);

-- Insert seed data
insert into public.testimonials (client_name, client_logo_url, quote, author_name, author_role)
values
  (
    'IQVIA',
    'https://placehold.co/120x40',
    'Dibrand provides amazing development and design resourcing. They helped us speed up product delivery while reducing costs.',
    'Adam Isley',
    'Director of Digital Strategy'
  ),
  (
    'Instructure',
    'https://placehold.co/120x40',
    'A trustworthy, knowledgeable, and adaptable partner. They ask the right questions and really add value to our culture.',
    'Matt Mecham',
    'Program Manager'
  ),
  (
    'NextRoll',
    'https://placehold.co/120x40',
    'Seamless integration with our internal team. They achieve key objectives with the same expertise as our own employees.',
    'Patrick Mee',
    'VP of Engineering'
  );
