'use server'

import { createClient } from '@/lib/supabase-server-client';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import { createNotification } from '@/app/admin/(dashboard)/notifications-actions';
import { revalidatePath } from 'next/cache';
import { createGoogleEvent, listGoogleEvents } from '@/lib/google-calendar';

export async function getRecentCandidates() {
    const { data } = await getAllCandidates({ limit: 5 } as any);
    return data;
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
                avatar_url: user.user_metadata?.avatar_url || null,
                job_title: user.user_metadata?.job_title || null,
                phone: user.user_metadata?.phone || null
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
        const stage = curr.status || 'Applied';
        acc[stage] = (acc[stage] || 0) + 1;
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
        .lt('created_at', fiveDaysAgo.toISOString()) 
        .not('status', 'in', '("Rejected","Offered","Hired")');

    if (!isAdmin) {
        staleQuery = staleQuery.eq('recruiter_id', user.id);
    }

    const { count: staleCount } = await staleQuery;

    // 3. Get Real Jobs Count
    let jobsQuery = supabase
        .from('job_openings')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

    if (!isAdmin) {
        jobsQuery = jobsQuery.eq('recruiter_id', user.id);
    }

    const { count: activeJobsCount } = await jobsQuery;

    return {
        counts,
        staleCount: staleCount || 0,
        activeJobsCount: activeJobsCount || 0,
        hiredCount: counts['Hired'] || 0
    };
}

export async function getRecruiterJobs() {
    const supabaseAuth = await createClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();

    if (!user) return [];

    const isAdmin = user.user_metadata?.role === 'admin' || user.user_metadata?.role === 'SuperAdmin';

    // Fetch jobs and include candidate counts with statuses
    const { data: jobs, error: jobsError } = await supabase
        .from('job_openings')
        .select(`
            *,
            candidates:job_applications(id, recruiter_id, status, is_deleted, avatar_url)
        `);

    if (jobsError) {
        console.error('Error fetching jobs:', jobsError);
        return [];
    }

    return jobs?.map(job => {
        const allCandidates = job.candidates || [];
        const activeCandidates = allCandidates.filter((c: any) => !c.is_deleted);
        const recruiterCandidates = activeCandidates.filter((c: any) => c.recruiter_id === user.id);
        
        // Count statuses for pipeline visualization
        const countsByStatus = (isAdmin ? activeCandidates : recruiterCandidates).reduce((acc: any, curr: any) => {
            const status = curr.status || 'Applied';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {
            'Applied': 0,
            'Interview': 0,
            'Offer': 0,
            'Hired': 0,
            'Rejected': 0,
            'Withdrawn': 0
        });

        // Map statuses to the UI buckets in the design (NEW, INTERVIEWING, OFFER)
        const uiCounts = {
            new: (countsByStatus['Applied'] || 0) + (countsByStatus['Screening'] || 0),
            interviewing: (countsByStatus['Interview'] || 0) + (countsByStatus['Technical'] || 0) + (countsByStatus['Culture'] || 0),
            offer: (countsByStatus['Offer'] || 0) + (countsByStatus['Contract'] || 0),
            total: isAdmin ? activeCandidates.length : recruiterCandidates.length
        };

        return {
            ...job,
            myCandidatesCount: recruiterCandidates.length,
            totalCandidatesCount: uiCounts.total,
            targetHires: job.target_hires || 1,
            countsByStatus: uiCounts,
            // Real avatars/initials from candidates (limit to 3 for UI)
            avatars: (isAdmin ? activeCandidates : recruiterCandidates)
                .slice(0, 3)
                .map((c: any) => ({
                    url: c.avatar_url,
                    initials: `${c.first_name?.charAt(0) || ''}${c.last_name?.charAt(0) || ''}`
                }))
        };
    }) || [];
}

export async function getAllCandidates(filters: { status?: string, search?: string, limit?: number, offset?: number, jobId?: string, country?: string } = {}) {
    const supabaseAuth = await createClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();

    if (!user) return { data: [], count: 0 };

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
            job:job_openings(id, title)
        `, { count: 'exact' })
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

    if (!isAdmin) {
        query = query.eq('recruiter_id', user.id);
    }

    if (filters.status) {
        query = query.eq('status', filters.status);
    }

    if (filters.jobId) {
        query = query.eq('job_id', filters.jobId);
    }

    if (filters.country) {
        query = query.eq('country', filters.country);
    }

    if (filters.search) {
        query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,full_name.ilike.%${filters.search}%`);
    }

    if (filters.limit) {
        const from = filters.offset || 0;
        const to = from + filters.limit - 1;
        query = query.range(from, to);
    }

    const { data, error, count } = await query;

    if (error) {
        console.error('Error fetching candidates:', error);
        return { data: [], count: 0 };
    }

    return { data: data || [], count: count || 0 };
}

export async function getCandidateById(id: string) {
    try {
        console.log('Querying Supabase for Candidate ID:', id);
        
        // Basic UUID check
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            console.error('INVALID UUID FORMAT:', id);
            return null;
        }

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
            console.error('--- SUPABASE QUERY ERROR ---');
            console.error('Code:', error.code);
            console.error('Message:', error.message);
            console.error('Details:', error.details);
            console.error('Hint:', error.hint);
            return null;
        }

        return data;
    } catch (e) {
        console.error('CRITICAL ERROR IN getCandidateById:', e);
        return null;
    }
}

export async function updateCandidate(id: string, updates: any) {
    console.log('UPDATING CANDIDATE:', id, updates);
    const { error } = await supabase
        .from('job_applications')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

    if (error) {
        console.error('--- UPDATE CANDIDATE ERROR ---');
        console.error('Code:', error.code);
        console.error('Message:', error.message);
        console.error('Details:', error.details);
        console.error('Hint:', error.hint);
        throw new Error(error.message);
    }

    revalidatePath(`/ats/candidates/${id}`);
    revalidatePath('/ats/candidates');
    return { success: true };
}

export async function updateCandidateStatus(id: string, status: string) {
    const supabaseAuth = await createClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();
    const fullName = user?.user_metadata?.full_name || user?.email || 'Recruiter';

    const { error } = await supabase
        .from('job_applications')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

    if (error) throw error;

    // Log the status change
    await addApplicationLog(id, `Status changed to ${status} by ${fullName}`);

    revalidatePath(`/ats/candidates/${id}`);
    revalidatePath('/ats/candidates');
    revalidatePath('/ats');
    return { success: true };
}

export async function updateCoverLetter(id: string, coverLetter: string) {
    const { error } = await supabase
        .from('job_applications')
        .update({ cover_letter: coverLetter, updated_at: new Date().toISOString() })
        .eq('id', id);

    if (error) {
        console.error('Error updating cover letter:', error);
        throw error;
    }

    revalidatePath(`/ats/candidates/${id}`);
    return { success: true };
}

export async function assignRecruiter(candidateId: string, recruiterId: string) {
    const supabaseAuth = await createClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();
    const currentAdmin = user?.user_metadata?.full_name || user?.email || 'Admin';

    // Get the recruiter name
    const { data: recruiter } = await supabase
        .from('recruiters')
        .select('full_name')
        .eq('id', recruiterId)
        .single();

    // Verify permission: only SuperAdmin can reassign
    const isSuperAdmin = user?.user_metadata?.role === 'SuperAdmin' || user?.role === 'SuperAdmin';
    if (!isSuperAdmin) {
        throw new Error('Only SuperAdmin can reassign candidates to another recruiter');
    }
    const { error } = await supabase
        .from('job_applications')
        .update({ recruiter_id: recruiterId, updated_at: new Date().toISOString() })
        .eq('id', candidateId);

    if (error) throw error;

    // Log the assignment
    const recruiterName = recruiter?.full_name || 'a new recruiter';
    await addApplicationLog(candidateId, `Candidate assigned to ${recruiterName} by ${currentAdmin}`);

    revalidatePath(`/ats/candidates/${candidateId}`);
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

export async function getAllTechStacks() {
    const { data, error } = await supabase
        .from('tech_stacks')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching tech stacks:', error);
        return [];
    }

    return data || [];
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

export async function getJobs() {
    const { data, error } = await supabase
        .from('job_openings')
        .select('id, title')
        .order('title');

    if (error) {
        console.error('Error fetching jobs:', error);
        return [];
    }

    return data || [];
}

export async function getCountries() {
    const { data, error } = await supabase
        .from('job_applications')
        .select('country')
        .not('country', 'is', null)
        .neq('country', '');

    if (error) {
        console.error('Error fetching countries:', error);
        return [];
    }

    // De-duplicate countries
    const unique = Array.from(new Set(data.map(d => d.country))).sort();
    return unique;
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

export async function patchCandidateByEmail(email: string, patchData: any) {
    const { error } = await supabase
        .from('job_applications')
        .update(patchData)
        .eq('email', email);

    if (error) throw error;
    return { success: true };
}

export async function getCandidateNames() {
    const { data, error } = await supabase
        .from('job_applications')
        .select('id, full_name, first_name, last_name, email')
        .eq('is_deleted', false);

    if (error) {
        console.error('Error fetching candidate names:', error);
        return [];
    }

    return (data || []).map((c: any) => ({
        id: c.id,
        name: c.full_name || `${c.first_name} ${c.last_name}`,
        email: c.email
    }));
}

export async function createCandidate(formData: {
    full_name: string;
    email: string;
    phone: string;
    candidate_summary: string;
    resume_url: string;
    country: string;
    state_province: string;
    job_id: string;
    linkedin_url?: string;
    skills?: string[];
}) {
    // 1. Check for duplicate email
    const { data: existing } = await supabase
        .from('job_applications')
        .select('id')
        .eq('email', formData.email)
        .eq('is_deleted', false)
        .single();

    if (existing) {
        return { error: 'Este email ya pertenece a otro candidato.' };
    }

    // 2. Name Splitting
    const names = formData.full_name.trim().split(' ');
    const first_name = names[0];
    const last_name = names.length > 1 ? names.slice(1).join(' ') : '';

    const supabaseAuth = await createClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();
    if (!user) return { error: 'User not authenticated' };
    // 3. Insert into DB with default recruiter association
    const { data, error } = await supabase
        .from('job_applications')
        .insert([{
            full_name: formData.full_name,
            first_name,
            last_name,
            email: formData.email,
            phone: formData.phone,
            candidate_summary: formData.candidate_summary,
            resume_url: formData.resume_url,
            country: formData.country,
            state_province: formData.state_province,
            job_id: formData.job_id,
            recruiter_id: user.id, // associate to creator
            linkedin_url: formData.linkedin_url,
            skills: formData.skills || [],
            status: 'Applied', // Default Stage
            is_deleted: false,
            created_at: new Date().toISOString()
        }])
        .select()
        .single();

    if (error) {
        console.error('Error creating candidate:', error);
        return { error: error.message };
    }

    revalidatePath('/ats/candidates');
    revalidatePath('/ats');
    
    return { success: true, id: data.id };
}

// INTERVIEW ACTIONS
export async function getInterviews(filters: { startDate?: string, endDate?: string, recruiterId?: string } = {}) {
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
        console.error('Error fetching interviews:', error);
        return [];
    }
    return data || [];
}

export async function createInterview(data: any) {
  const { data: interview, error } = await supabase
    .from('job_interviews')
    .insert([{
      ...data,
      status: 'Scheduled'
    }])
    .select('*, candidate:job_applications(full_name, email), job:job_openings(title)')
    .single();

  if (error) throw error;

  let googleEvent: any;

  // Sync with Google Calendar if possible
  try {
    googleEvent = await createGoogleEvent(data.recruiter_id, {
        id: interview.id,
        type: data.type,
        candidate_name: interview.candidate?.full_name,
        candidate_email: interview.candidate?.email,
        job_title: interview.job?.title,
        scheduled_at: data.scheduled_at,
        duration_minutes: data.duration_minutes || 60,
    });

    if (googleEvent?.hangoutLink) {
        await supabase
            .from('job_interviews')
            .update({ video_url: googleEvent.hangoutLink })
            .eq('id', interview.id);
    }
  } catch (err) {
    console.error('Failed to sync google calendar:', err);
  }

  revalidatePath('/ats/interviews');
  return { 
    success: true, 
    id: interview.id, 
    video_url: googleEvent?.hangoutLink || null 
  };
}

export async function disconnectGoogleCalendar() {
    const supabaseAuth = await createClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();
    
    if (user) {
        await supabase
            .from('recruiter_google_tokens')
            .delete()
            .eq('recruiter_id', user.id);
        
        revalidatePath('/ats/settings');
        revalidatePath('/ats/interviews');
    }
}

export async function getCombinedInterviews(recruiterId: string, startDate: string, endDate: string) {
    // 1. Get ATS Interviews
    const atsInterviews = await getInterviews({ startDate, endDate, recruiterId });
    
    // 2. Get Google Events
    let googleEvents: any[] = [];
    try {
        googleEvents = await listGoogleEvents(recruiterId, startDate, endDate);
    } catch (err) {
        console.error('Failed to fetch google events:', err);
    }

    // 3. Merge or handle duplicates (simplified for now)
    const formattedGoogle = googleEvents
        .filter(ge => !ge.description?.includes(atsInterviews[0]?.id)) // Crude check
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

export async function updateInterview(id: string, updates: any) {
    const { error } = await supabase
        .from('job_interviews')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

    if (error) throw error;
    revalidatePath('/ats/interviews');
    return { success: true };
}

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
        console.error('Error fetching upcoming interviews:', error);
        return [];
    }
    return data || [];
}

export async function updateRecruiterProfile(data: { fullName: string, jobTitle: string, phone: string, avatarUrl?: string }) {
    try {
        const supabaseAuth = await createClient();
        const { data: { user } } = await supabaseAuth.auth.getUser();

        if (!user) throw new Error('Not authenticated');

        // 1. Update Auth Metadata using Admin Client (More robust)
        const { error: authError } = await supabase.auth.admin.updateUserById(user.id, {
            user_metadata: {
                full_name: data.fullName,
                job_title: data.jobTitle,
                phone: data.phone,
                avatar_url: data.avatarUrl || user.user_metadata?.avatar_url
            }
        });

        if (authError) {
            console.error('AUTH METADATA UPDATE ERROR:', authError);
            throw authError;
        }

        // 2. Update recruiters table (using UPSERT to be safe)
        const { error: dbError } = await supabase
            .from('recruiters')
            .upsert({
                id: user.id,
                full_name: data.fullName,
                job_title: data.jobTitle,
                phone: data.phone,
                avatar_url: data.avatarUrl || user.user_metadata?.avatar_url,
                email: user.email,
                updated_at: new Date().toISOString()
            }, { 
                onConflict: 'id' 
            });

        if (dbError) {
            console.error('DATABASE UPDATE ERROR:', dbError);
            throw dbError;
        }

        revalidatePath('/ats/settings');
        revalidatePath('/ats');
        
        return { success: true };
    } catch (error: any) {
        console.error('CATCH BLOCK ERROR:', error);
        throw error;
    }
}

