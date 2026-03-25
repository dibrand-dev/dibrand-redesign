import { getOAuth2Client, saveTokens } from '@/lib/google-calendar';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import { createClient } from '@/lib/supabase-server-client';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    if (!code) {
        console.error('No code provided in Google Callback');
        const errorUrl = new URL('/ats/interviews', request.url);
        errorUrl.searchParams.set('error', 'no_code');
        return NextResponse.redirect(errorUrl);
    }

    const oauth2Client = getOAuth2Client();
    console.log('--- EXCHANGING CODE FOR TOKENS ---');
    const { tokens } = await oauth2Client.getToken(code);
    console.log('--- TOKENS RECEIVED ---');
    
    const supabaseAuth = await createClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();
    
    if (user) {
      await saveTokens(user.id, tokens);
      console.log('--- GOOGLE TOKENS SAVED FOR RECRUITER', user.id, '---');
    }

    const redirectUrl = new URL('/ats/interviews', request.url);
    redirectUrl.searchParams.set('success', 'connected');
    return NextResponse.redirect(redirectUrl);
  } catch (err: any) {
    console.error('--- GOOGLE CALLBACK ERROR ---');
    console.error('Error message:', err.message);
    if (err.response) {
        console.error('Error details:', err.response.data);
    }
    return NextResponse.json({ 
        error: 'Google OAuth failed', 
        details: err.message,
        hint: 'Verify the redirect URI matches EXACTLY what is registered in Google Console'
    }, { status: 500 });
  }
}
