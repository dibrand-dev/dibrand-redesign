import { google } from 'googleapis';
import { supabaseAdmin as supabase } from './supabase-admin';

const OAuth2 = google.auth.OAuth2;

const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly'
];

export function getOAuth2Client() {
  const isProd = process.env.NODE_ENV === 'production';
  const redirectUri = isProd 
    ? process.env.GOOGLE_REDIRECT_URI_PROD || 'https://dibrand.co/api/auth/google/callback'
    : process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback';

  return new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );
}

export function getAuthUrl() {
  const oauth2Client = getOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });
}

export async function saveTokens(recruiterId: string, tokens: any) {
  const dataToSave: any = {
    recruiter_id: recruiterId,
    access_token: tokens.access_token,
    expires_at: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : new Date(Date.now() + 3500 * 1000).toISOString(),
    scope: tokens.scope,
    token_type: tokens.token_type,
    updated_at: new Date().toISOString()
  };

  if (tokens.refresh_token) {
    dataToSave.refresh_token = tokens.refresh_token;
  }

  console.log('--- SAVING TOKENS FOR RECRUITER', recruiterId, '---');
  console.log('Has Refresh Token:', !!tokens.refresh_token);

  const { error } = await supabase
    .from('recruiter_google_tokens')
    .upsert(dataToSave);

  if (error) {
    console.error('Error saving tokens to Supabase:', error);
    throw error;
  }
}

export async function getRecruiterClient(recruiterId: string) {
  const { data: tokens, error } = await supabase
    .from('recruiter_google_tokens')
    .select('*')
    .eq('recruiter_id', recruiterId)
    .single();

  if (error || !tokens) {
    console.warn('--- NO GOOGLE TOKENS FOUND FOR RECRUITER', recruiterId, '---');
    return null;
  }

  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expiry_date: new Date(tokens.expires_at).getTime()
  });

  // Basic check for token refresh
  oauth2Client.on('tokens', async (newTokens) => {
    if (newTokens.refresh_token) {
        await saveTokens(recruiterId, newTokens);
    } else {
        // Just update access token
        await supabase
            .from('recruiter_google_tokens')
            .update({ 
                access_token: newTokens.access_token,
                expires_at: new Date(newTokens.expiry_date!).toISOString()
            })
            .eq('recruiter_id', recruiterId);
    }
  });

  return oauth2Client;
}

export async function createGoogleEvent(recruiterId: string, interview: any) {
  const auth = await getRecruiterClient(recruiterId);
  if (!auth) return null;

  const calendar = google.calendar({ version: 'v3', auth });
  
  const event = {
    summary: `${interview.type} Interview: ${interview.candidate_name}`,
    description: `Interview for ${interview.job_title}. \nNotes: ${interview.notes || ''}`,
    start: {
      dateTime: interview.scheduled_at,
      timeZone: 'UTC',
    },
    end: {
      dateTime: new Date(new Date(interview.scheduled_at).getTime() + (interview.duration_minutes || 60) * 60000).toISOString(),
      timeZone: 'UTC',
    },
    conferenceData: {
      createRequest: {
        requestId: `interview-${interview.id}-${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
    attendees: [
        { email: interview.candidate_email }
    ]
  };

  console.log('--- CREATING GOOGLE CALENDAR EVENT ---');
  console.log('Payload:', JSON.stringify(event, null, 2));

  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
    conferenceDataVersion: 1,
  });

  console.log('--- GOOGLE CALENDAR RESPONSE ---');
  console.log('Status:', response.status);
  console.log('Event Link:', response.data.htmlLink);

  return response.data;
}

export async function listGoogleEvents(recruiterId: string, minTime: string, maxTime: string) {
    const auth = await getRecruiterClient(recruiterId);
    if (!auth) return [];

    try {
        const calendar = google.calendar({ version: 'v3', auth });
        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: minTime,
            timeMax: maxTime,
            singleEvents: true,
            orderBy: 'startTime',
        });

        console.log(`--- GOOGLE CALENDAR SYNC ---`);
        console.log(`Min: ${minTime}, Max: ${maxTime}`);
        console.log(`Found ${response.data.items?.length || 0} events.`);

        return response.data.items || [];
    } catch (err: any) {
        console.error('--- GOOGLE LIST EVENTS ERROR ---');
        console.error('Status:', err.response?.status);
        console.error('Data:', err.response?.data);
        console.error('Message:', err.message);
        return [];
    }
}
