-- Table to store Google OAuth tokens for recruiters
CREATE TABLE IF NOT EXISTS public.recruiter_google_tokens (
    recruiter_id UUID PRIMARY KEY REFERENCES public.recruiters(id) ON DELETE CASCADE,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_at TIMESTAMPTZ,
    scope TEXT,
    token_type TEXT DEFAULT 'Bearer',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.recruiter_google_tokens ENABLE ROW LEVEL SECURITY;

-- Simple RLS Policy
CREATE POLICY "Allow recruiters to manage their own tokens" 
ON public.recruiter_google_tokens 
FOR ALL 
TO authenticated 
USING (auth.uid() = recruiter_id);
