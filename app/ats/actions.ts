'use server'

import { createClient } from '@/lib/supabase-server-client';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import { createNotification } from '@/app/admin/(dashboard)/notifications-actions';
import { revalidatePath } from 'next/cache';

export async function getRecentCandidates() {
    return getAllCandidates({ limit: 5 } as any);
}

export async function syncRecruiterProfile() {
    const supabaseAuth = await createClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();

    if (!user) return null;

    // Check if recruiter exists
    const { data: recruiter, error } = await supabase
        .from('recruiters')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error && error.code === 'PGRST116') { // Not found
        const { error: insertError } = await supabase
            .from('recruiters')
            .insert([{
                id: user.id,
                full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Recruiter',
                email: user.email,
                avatar_url: user.user_metadata?.avatar_url || null
            }]);
        
        if (insertError) console.error('Error auto-creating recruiter:', insertError);
    }

    return user.id;
}
export async function getRecruiterStats() {
    const supabaseAuth = await createClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();

    if (!user) return null;

    // 1. Get stats by status
    const { data: statusCounts, error: statusError } = await supabase
        .from('job_applications')
        .select('status')
        .eq('recruiter_id', user.id);

    if (statusError) console.error('Error fetching status counts:', statusError);

    const counts = (statusCounts || []).reduce((acc: any, curr: any) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        acc['Total'] = (acc['Total'] || 0) + 1;
        return acc;
    }, { Total: 0 });

    // 2. Get Stale Candidates (> 5 days without updates)
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const { count: staleCount, error: staleError } = await supabase
        .from('job_applications')
        .select('*', { count: 'exact', head: true })
        .eq('recruiter_id', user.id)
        .lt('created_at', fiveDaysAgo.toISOString()) // Temporary fallback until migration is complete
        .not('status', 'in', '("Rejected","Offered")'); // Exclude terminal states

    if (staleError) console.error('Error fetching stale count:', staleError);

    return {
        counts,
        staleCount: staleCount || 0
    };
}

export async function getRecruiterJobs() {
    const supabaseAuth = await createClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();

    if (!user) return [];

    // Fetch jobs and include candidate counts for this recruiter
    // In a real scenario, we might want to see ALL active jobs 
    // but with specific recruiter context
    const { data: jobs, error: jobsError } = await supabase
        .from('job_openings')
        .select(`
            *,
            candidates:job_applications(id, recruiter_id)
        `)
        .eq('is_active', true);

    if (jobsError) {
        console.error('Error fetching jobs:', jobsError);
        return [];
    }

    return jobs?.map(job => {
        const recruiterCandidates = job.candidates?.filter((c: any) => c.recruiter_id === user.id) || [];
        const totalCandidates = job.candidates || [];
        
        return {
            ...job,
            myCandidatesCount: recruiterCandidates.length,
            totalCandidatesCount: totalCandidates.length,
            targetHires: job.target_hires || 1 // Fallback if column not yet added
        };
    }) || [];
}

export async function getAllCandidates(filters: { status?: string, search?: string, limit?: number } = {}) {
    const supabaseAuth = await createClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();

    if (!user) return [];

    const isAdmin = user.user_metadata?.role === 'admin';

    let query = supabase
        .from('job_applications')
        .select(`
            *,
            job:job_openings(title)
        `)
        .order('created_at', { ascending: false });

    if (!isAdmin) {
        query = query.eq('recruiter_id', user.id);
    }

    if (filters.status) {
        query = query.eq('status', filters.status);
    }

    if (filters.search) {
        query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,full_name.ilike.%${filters.search}%`);
    }

    if (filters.limit) {
        query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching candidates:', error);
        return [];
    }

    return data || [];
}

export async function updateCandidateStatus(id: string, status: string) {
    const { error } = await supabase
        .from('job_applications')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

    if (error) throw error;
    revalidatePath('/ats/candidates');
    revalidatePath('/ats');
    return { success: true };
}

export async function assignRecruiter(candidateId: string, recruiterId: string) {
    const { error } = await supabase
        .from('job_applications')
        .update({ recruiter_id: recruiterId, updated_at: new Date().toISOString() })
        .eq('id', candidateId);

    if (error) throw error;
    revalidatePath('/ats/candidates');
    revalidatePath('/ats');
    return { success: true };
}

export async function getRecruiters() {
    const { data, error } = await supabase
        .from('recruiters')
        .select('*')
        .eq('is_active', true)
        .order('full_name');

    if (error) throw error;
    return data || [];
}
