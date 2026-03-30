-- Update application_notes to include author_id
ALTER TABLE application_notes ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id);

-- Create Webhook Trigger for email notifications
-- This will be managed via Supabase UI or another migration later.
