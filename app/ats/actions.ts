'use server'

import { createClient } from '@/lib/supabase-server-client';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

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
        .lt('updated_at', fiveDaysAgo.toISOString())
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

export async function getRecentCandidates() {
   const supabaseAuth = await createClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from('job_applications')
        .select(`
            *,
            job:job_openings(title)
        `)
        .eq('recruiter_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error('Error fetching recent candidates:', error);
        return [];
    }

    return data || [];
}
