insert into storage.buckets (id, name, public)
values ('portfolio_images', 'portfolio_images', true)
on conflict (id) do nothing;

create policy "Portfolio Images Public Read"
on storage.objects for select
using ( bucket_id = 'portfolio_images' );

create policy "Portfolio Images Auth Insert"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'portfolio_images' );

create policy "Portfolio Images Auth Update"
on storage.objects for update
to authenticated
using ( bucket_id = 'portfolio_images' );

create policy "Portfolio Images Auth Delete"
on storage.objects for delete
to authenticated
using ( bucket_id = 'portfolio_images' );
