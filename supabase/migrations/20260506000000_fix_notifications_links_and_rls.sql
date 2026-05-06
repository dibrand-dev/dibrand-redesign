-- =============================================================================
-- Migration: Fix notification links & RLS UPDATE policy for global notifications
-- Date: 2026-05-06
-- =============================================================================

-- 1. FIX STALE LINKS
-- Notifications created before the leads module was added have link = '/admin/dashboard'
-- which now returns 404. Redirect them to the correct leads page.
UPDATE public.notifications
SET link = '/admin/leads'
WHERE link = '/admin/dashboard';

-- Also fix any variants that might exist
UPDATE public.notifications
SET link = '/admin/leads'
WHERE link ILIKE '%/admin/dashboard%'
  AND link NOT ILIKE '%leads%';

-- 2. FIX RLS UPDATE POLICY FOR GLOBAL NOTIFICATIONS
-- The previous policy only allowed UPDATE where auth.uid() = user_id.
-- Global notifications have user_id IS NULL, so the update was silently skipped
-- (returns success=true but 0 rows updated), causing the "ghost badge" bug.
-- We now allow authenticated users to mark global notifications as read too.

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;

CREATE POLICY "Users can update own or global notifications"
ON public.notifications
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id       -- personal notification
  OR user_id IS NULL         -- global/broadcast notification
)
WITH CHECK (
  auth.uid() = user_id
  OR user_id IS NULL
);
