-- ============================================================
-- Update RLS Policies for the 'avatars' Storage Bucket
-- Loosen the restriction that required the first folder to be the user ID
-- to allow recruiters to upload candidate avatars.
-- ============================================================

-- Drop old restricted policies
DROP POLICY IF EXISTS "avatars_auth_insert" ON storage.objects;
DROP POLICY IF EXISTS "avatars_auth_update" ON storage.objects;
DROP POLICY IF EXISTS "avatars_auth_delete" ON storage.objects;

-- 1. Any authenticated user can INSERT files in the 'avatars' bucket
CREATE POLICY "avatars_auth_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'avatars' );

-- 2. Any authenticated user can UPDATE/UPSERT files in the 'avatars' bucket
CREATE POLICY "avatars_auth_update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'avatars' );

-- 3. Any authenticated user can DELETE files in the 'avatars' bucket
CREATE POLICY "avatars_auth_delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'avatars' );
