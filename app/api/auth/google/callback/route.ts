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
  
  // Link to Norberto's recruiter ID (First recruiter for now)
  const { data: recs } = await supabase.from('recruiters').select('id').limit(1).single();
  
  if (recs) {
    await saveTokens(recs.id, tokens);
  }

  return NextResponse.redirect('/ats/interviews?success=connected');
}
