-- ============================================================
-- RLS Policies for the 'avatars' Storage Bucket
-- Allows authenticated users to upload / update / delete their
-- own files (scoped to their user ID folder) while keeping
-- SELECT open to everyone (public bucket).
-- ============================================================

-- 1. Public read access (anyone can view avatars via their public URL)
CREATE POLICY "avatars_public_read"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- 2. Authenticated users can INSERT files inside their own folder
--    File path pattern: {user_id}/...
CREATE POLICY "avatars_auth_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. Authenticated users can UPDATE (upsert) their own files
CREATE POLICY "avatars_auth_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Authenticated users can DELETE their own files
CREATE POLICY "avatars_auth_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
);
