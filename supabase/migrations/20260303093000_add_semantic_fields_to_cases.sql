-- Add semantic fields to case_studies for SEO and AI discovery
alter table public.case_studies 
add column if not exists industry text,
add column if not exists challenge text,
add column if not exists solution text,
add column if not exists outcome_impact text,
add column if not exists results_metrics jsonb default '[]'::jsonb,
add column if not exists testimonial_text text,
add column if not exists testimonial_author text;

-- Comment for clarity
comment on column public.case_studies.challenge is 'Detailed description of the business/technical problem';
comment on column public.case_studies.solution is 'The implementation detail and AI-augmented workflow';
comment on column public.case_studies.outcome_impact is 'Business results and impact overview';
comment on column public.case_studies.results_metrics is 'JSON array of key metrics: [{"label": "ROI", "value": "3.5x"}]';
comment on column public.case_studies.testimonial_text is 'Client quote/testimonial';
comment on column public.case_studies.testimonial_author is 'Name and position of the testimonial author';
