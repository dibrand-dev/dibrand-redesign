-- Add testimonial_id to link case studies with the testimonials module
alter table public.case_studies 
add column if not exists testimonial_id uuid references public.testimonials(id);

-- Add index for performance
create index if not exists idx_case_studies_testimonial_id on public.case_studies(testimonial_id);
