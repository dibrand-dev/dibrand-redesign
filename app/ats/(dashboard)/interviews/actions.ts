'use server';

/**
 * Dedicated Server Actions for Interview Scheduling.
 *
 * WHY THIS FILE EXISTS:
 * Next.js generates Server Action IDs based on the module + function signature
 * at build time. When a large barrel file (app/ats/actions.ts) is shared between
 * Server and Client Components, any change anywhere in that file can cause ALL
 * Action IDs to change, leading to "UnrecognizedActionError: Server Action not found"
 * on production if the client bundle and server bundle get out of sync.
 *
 * By isolating interview actions in this dedicated file, Next.js generates stable,
 * predictable Action IDs that survive deploys correctly.
 */

import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';
import { createGoogleEvent, listGoogleEvents } from '@/lib/google-calendar';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Attendee {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string | null;
}

// ─── getRecruitersForScheduling ───────────────────────────────────────────────
// Fetches real Dibrand team members (recruiters table) for the attendee picker.
export async function getRecruitersForScheduling(): Promise<Attendee[]> {
    const { data, error } = await supabase
        .from('recruiters')
        .select('id, full_name, email, avatar_url')
        .order('full_name');

    if (error) {
        console.error('[getRecruitersForScheduling] error:', error);
        return [];
    }
    // Filter out entries without an email (shouldn't happen, but be safe)
    return (data || []).filter((r): r is Attendee => !!r.email);
}

// ─── createInterview ──────────────────────────────────────────────────────────
export async function createInterview(data: {
    candidate_id: string;
    recruiter_id: string | null;
    job_id?: string;
    scheduled_at: string;
    duration_minutes?: number;
    type: string;
    notes?: string;
    // Additional team members to invite (beyond the candidate)
    additional_attendees?: { email: string; name: string }[];
}) {
    const { additional_attendees, ...dbData } = data;

    const { data: interview, error } = await supabase
        .from('job_interviews')
        .insert([{ ...dbData, status: 'Scheduled' }])
        .select('*, candidate:job_applications(full_name, email), job:job_openings(title)')
        .single();

    if (error) {
        console.error('[createInterview] DB error:', error);
        throw new Error(error.message);
    }

    let googleHangoutLink: string | null = null;

    // Sync with Google Calendar — candidate + all selected attendees receive real invite
    try {
        if (data.recruiter_id) {
            const googleEvent = await createGoogleEvent(data.recruiter_id, {
                id: interview.id,
                type: data.type,
                candidate_name: interview.candidate?.full_name,
                candidate_email: interview.candidate?.email,
                job_title: interview.job?.title,
                scheduled_at: data.scheduled_at,
                duration_minutes: data.duration_minutes || 60,
                notes: data.notes,
                additional_attendees: additional_attendees || [],
            });

            if (googleEvent?.hangoutLink) {
                googleHangoutLink = googleEvent.hangoutLink;
                await supabase
                    .from('job_interviews')
                    .update({ video_url: googleHangoutLink })
                    .eq('id', interview.id);
            }
        }
    } catch (err) {
        console.error('[createInterview] Google Calendar sync failed (non-fatal):', err);
    }

    revalidatePath('/ats/interviews');
    revalidatePath('/ats/candidates/' + data.candidate_id);

    return {
        success: true,
        id: interview.id,
        video_url: googleHangoutLink
    };
}

// ─── getInterviews ────────────────────────────────────────────────────────────
export async function getInterviews(filters: {
    startDate?: string;
    endDate?: string;
    recruiterId?: string;
} = {}) {
    let query = supabase
        .from('job_interviews')
        .select(`
            *,
            candidate:job_applications(id, first_name, last_name, full_name, email),
            job:job_openings(id, title)
        `)
        .order('scheduled_at', { ascending: true });

    if (filters.startDate) query = query.gte('scheduled_at', filters.startDate);
    if (filters.endDate) query = query.lte('scheduled_at', filters.endDate);
    if (filters.recruiterId) query = query.eq('recruiter_id', filters.recruiterId);

    const { data, error } = await query;
    if (error) {
        console.error('[getInterviews] error:', error);
        return [];
    }
    return data || [];
}

// ─── getUpcomingInterviews ────────────────────────────────────────────────────
export async function getUpcomingInterviews(limit = 10) {
    const now = new Date().toISOString();
    const { data, error } = await supabase
        .from('job_interviews')
        .select(`
            *,
            candidate:job_applications(id, full_name, first_name, last_name),
            job:job_openings(id, title)
        `)
        .gte('scheduled_at', now)
        .eq('status', 'Scheduled')
        .order('scheduled_at', { ascending: true })
        .limit(limit);

    if (error) {
        console.error('[getUpcomingInterviews] error:', error);
        return [];
    }
    return data || [];
}

// ─── getCombinedInterviews ────────────────────────────────────────────────────
export async function getCombinedInterviews(
    recruiterId: string,
    startDate: string,
    endDate: string
) {
    const atsInterviews = await getInterviews({ startDate, endDate, recruiterId });

    let googleEvents: any[] = [];
    try {
        googleEvents = await listGoogleEvents(recruiterId, startDate, endDate);
    } catch (err) {
        console.error('[getCombinedInterviews] Google Events fetch failed (non-fatal):', err);
    }

    const formattedGoogle = googleEvents
        .filter(ge => !ge.description?.includes(atsInterviews[0]?.id))
        .map(ge => ({
            id: ge.id,
            type: 'Google',
            isExternal: true,
            scheduled_at: ge.start?.dateTime || ge.start?.date,
            candidate: { full_name: ge.summary },
            video_url: ge.hangoutLink
        }));

    return [...atsInterviews, ...formattedGoogle];
}

// ─── updateInterview ──────────────────────────────────────────────────────────
export async function updateInterview(id: string, updates: Record<string, any>) {
    const { error } = await supabase
        .from('job_interviews')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/ats/interviews');
    return { success: true };
}
