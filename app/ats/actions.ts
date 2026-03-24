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

    const isAdmin = user.user_metadata?.role === 'admin' || user.user_metadata?.role === 'SuperAdmin';

    // 1. Get stats by status
    let query = supabase
        .from('job_applications')
        .select('status')
        .eq('is_deleted', false);

    if (!isAdmin) {
        query = query.eq('recruiter_id', user.id);
    }

    const { data: statusCounts, error: statusError } = await query;

    if (statusError) console.error('Error fetching status counts:', statusError);

    const counts = (statusCounts || []).reduce((acc: any, curr: any) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        acc['Total'] = (acc['Total'] || 0) + 1;
        return acc;
    }, { Total: 0 });

    // 2. Get Stale Candidates (> 5 days without updates)
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    let staleQuery = supabase
        .from('job_applications')
        .select('*', { count: 'exact', head: true })
        .eq('is_deleted', false)
        .lt('created_at', fiveDaysAgo.toISOString()) // Temporary fallback
        .not('status', 'in', '("Rejected","Offered")'); // Exclude terminal states

    if (!isAdmin) {
        staleQuery = staleQuery.eq('recruiter_id', user.id);
    }

    const { count: staleCount, error: staleError } = await staleQuery;

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

    const isAdmin = user.user_metadata?.role === 'admin' || user.user_metadata?.role === 'SuperAdmin';

    // Fetch jobs and include candidate counts
    const { data: jobs, error: jobsError } = await supabase
        .from('job_openings')
        .select(`
            *,
            candidates:job_applications(id, recruiter_id, is_deleted)
        `)
        .eq('is_active', true);

    if (jobsError) {
        console.error('Error fetching jobs:', jobsError);
        return [];
    }

    return jobs?.map(job => {
        const allCandidates = job.candidates || [];
        const activeCandidates = allCandidates.filter((c: any) => !c.is_deleted);
        const recruiterCandidates = activeCandidates.filter((c: any) => c.recruiter_id === user.id);
        
        return {
            ...job,
            myCandidatesCount: recruiterCandidates.length,
            totalCandidatesCount: isAdmin ? activeCandidates.length : recruiterCandidates.length,
            targetHires: job.target_hires || 1
        };
    }) || [];
}

export async function getAllCandidates(filters: { status?: string, search?: string, limit?: number } = {}) {
    const supabaseAuth = await createClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();

    if (!user) return [];

    // Robust check for both metadata and the auth role field
    const isAdmin = 
        user.user_metadata?.role === 'admin' || 
        user.user_metadata?.role === 'SuperAdmin' ||
        user.role === 'admin' ||
        user.role === 'SuperAdmin';

    let query = supabase
        .from('job_applications')
        .select(`
            *,
            job:job_openings(title)
        `, { count: 'exact' })
        .eq('is_deleted', false)
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

export async function getCandidateById(id: string) {
    const { data, error } = await supabase
        .from('job_applications')
        .select(`
            *,
            job:job_openings(title),
            recruiter:recruiters(full_name)
        `)
        .eq('id', id)
        .eq('is_deleted', false)
        .single();

    if (error) {
        console.error('Error fetching candidate detail:', error);
        return null;
    }

    return data;
}

export async function updateCandidate(id: string, updates: any) {
    const { error } = await supabase
        .from('job_applications')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

    if (error) throw error;
    revalidatePath(`/ats/candidates/${id}`);
    revalidatePath('/ats/candidates');
    return { success: true };
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

export async function deleteCandidate(id: string) {
    const supabaseAuth = await createClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();

    if (user?.user_metadata?.role !== 'admin') {
        throw new Error('Solo los administradores pueden eliminar candidatos.');
    }

    const { error } = await supabase
        .from('job_applications')
        .update({ is_deleted: true, updated_at: new Date().toISOString() })
        .eq('id', id);

    if (error) throw error;
    revalidatePath('/ats/candidates');
    return { success: true };
}

export async function updateCandidateNotes(id: string, notes: string) {
    const { error } = await supabase
        .from('job_applications')
        .update({ recruiter_notes: notes, updated_at: new Date().toISOString() })
        .eq('id', id);

    if (error) throw error;
    revalidatePath('/ats/candidates');
    return { success: true };
}

export async function getApplicationLogs(applicationId: string) {
    const { data, error } = await supabase
        .from('application_notes')
        .select('*')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function addApplicationLog(applicationId: string, noteText: string) {
    const supabaseAuth = await createClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();

    const fullName = user?.user_metadata?.full_name || user?.email || 'Recruiter';
    const avatarUrl = user?.user_metadata?.avatar_url || null;

    const { error } = await supabase
        .from('application_notes')
        .insert([{
            application_id: applicationId,
            author_name: fullName,
            author_avatar_url: avatarUrl,
            note_text: noteText
        }]);

    if (error) throw error;
    revalidatePath(`/ats/candidates/${applicationId}`);
    return { success: true };
}

export async function getStackNames(ids: string[]) {
    if (!ids || ids.length === 0) return [];
    
    const { data, error } = await supabase
        .from('tech_stacks')
        .select('name')
        .in('id', ids);

    if (error) {
        console.error('Error resolving stack names:', error);
        return [];
    }

    return (data || []).map(s => s.name.toUpperCase());
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

export async function getGlobalSkills() {
    // Select from tech_stacks (Admin defined)
    const { data: adminStacks, error } = await supabase
        .from('tech_stacks')
        .select('name')
        .order('name');

    if (error) {
        console.error('Error fetching admin stacks:', error);
    }

    // Select skills from candidates as well for a broader list
    const { data: candidateSkills, error: cError } = await supabase
        .from('job_applications')
        .select('skills')
        .not('skills', 'is', null)
        .eq('is_deleted', false);

    const adminNames = (adminStacks || []).map(s => s.name);
    const candidateNames = (candidateSkills || []).flatMap(item => item.skills || []);

    // Flatten, make unique and sort
    return Array.from(new Set([...adminNames, ...candidateNames])).sort();
}

export async function updateCandidateSkills(id: string, skills: string[]) {
    const { error } = await supabase
        .from('job_applications')
        .update({ skills, updated_at: new Date().toISOString() })
        .eq('id', id);

    if (error) throw error;
    revalidatePath(`/ats/candidates/${id}`);
    return { success: true };
}
