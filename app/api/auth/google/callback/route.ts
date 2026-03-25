import { getOAuth2Client, saveTokens } from '@/lib/google-calendar';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (!code) {
    return NextResponse.redirect('/ats/interviews?error=no_code');
  }

  const oauth2Client = getOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  
  // Link to current logged-in recruiter
  const { data: rec } = await supabase.from('recruiters').select('id').limit(1).single(); 
  // In a real multi-user scenario, we'd use auth.getUser()
  
  if (rec) {
    await saveTokens(rec.id, tokens);
  }

  return NextResponse.redirect('/ats/interviews?success=connected');
}
