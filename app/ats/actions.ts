'use server'

import { createClient } from '@/lib/supabase-server-client';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import { createNotification } from '@/app/admin/(dashboard)/notifications-actions';
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';
import { createGoogleEvent, listGoogleEvents } from '@/lib/google-calendar';
import { capitalizeName as capitalizeEachWord } from '@/lib/utils';
import { getStageConfig } from '@/lib/ats-constants';

export async function getAtsUserContext() {
    try {
        const supabaseAuth = await createClient();
        const { data: { user } } = await supabaseAuth.auth.getUser();
        if (!user) return { role: '', email: '' };
        
        return {
            role: user.user_metadata?.role || user.role || '',
            email: user.email?.toLowerCase() || ''
        };
    } catch (e) {
        return { role: '', email: '' };
    }
}

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
        const stage = curr.status || 'Nuevo';
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
        hiredCount: counts['Contratado'] || counts['Hired'] || 0
    };
}

export async function getRecruiterJobs() {
    const supabaseAuth = await createClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();

    if (!user) return [];

    const isAdmin = user.user_metadata?.role === 'admin' || user.user_metadata?.role === 'SuperAdmin';

    // Fetch all jobs excluding only the ones fully deleted (we check by status or deleted_at in JS for safety)
    let { data: jobs, error: jobsError } = await supabase
        .from('job_openings')
        .select(`
            *,
            candidates:job_applications(id, recruiter_id, status, is_deleted, avatar_url)
        `);

    if (jobsError) {
        console.error('CRITICAL ERROR FETCHING RECRUITER JOBS:', jobsError);
        return [];
    }

    // Filter jobs by active status for the dashboard
    const validJobs = (jobs || []).filter(j => j.is_active);

    return validJobs.map(job => {
        const allCandidates = job.candidates || [];
        const activeCandidates = allCandidates.filter((c: any) => !c.is_deleted);
        const recruiterCandidates = activeCandidates.filter((c: any) => c.recruiter_id === user.id);
        
        // Determine if they should see all candidates (Admin/SuperAdmin) or just their own
        const isSuperAdmin = 
            user.user_metadata?.role === 'admin' || 
            user.user_metadata?.role === 'SuperAdmin' ||
            user.role === 'admin' ||
            user.role === 'SuperAdmin';

        // Map statuses to the UI buckets in the design (NEW, INTERVIEWING, OFFER)
        const uiCounts = {
            new: 0,
            interviewing: 0,
            offer: 0,
            total: isSuperAdmin ? activeCandidates.length : recruiterCandidates.length
        };

        (isAdmin ? activeCandidates : recruiterCandidates).forEach((c: any) => {
            const config = getStageConfig(c.status);
            const val = config.value;
            if (val === 'Nuevo' || val === 'Screening' || val === 'Phone Screen') uiCounts.new++;
            else if (val === 'Entrevista RRHH' || val === 'Entrevista Técnica' || val === 'Prueba Técnica' || val === 'Entrevista Cliente') uiCounts.interviewing++;
            else if (val === 'Oferta') uiCounts.offer++;
        });

        return {
            ...job,
            myCandidatesCount: recruiterCandidates.length,
            totalCandidatesCount: uiCounts.total,
            targetHires: job.target_hires || 1,
            countsByStatus: uiCounts,
            // Real avatars/initials from candidates (limit to 3 for UI)
            avatars: (isSuperAdmin ? activeCandidates : recruiterCandidates)
                .slice(0, 3)
                .map((c: any) => ({
                    url: c.avatar_url,
                    initials: `${c.first_name?.charAt(0) || ''}${c.last_name?.charAt(0) || ''}`
                }))
        };
    }) || [];
}

export async function getAllCandidates(filters: { status?: string, search?: string, limit?: number, offset?: number, jobId?: string, country?: string, recruiterId?: string, skills?: string[] } = {}) {
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
            job:job_openings(id, title),
            recruiter:recruiters(id, full_name, avatar_url)
        `, { count: 'exact' })
        .eq('is_deleted', false);

    // Initial sort if no skills ranking is used
    if (!filters.skills || filters.skills.length === 0) {
        query = query.order('created_at', { ascending: false });
    }

    if (!isAdmin) {
        query = query.eq('recruiter_id', user.id);
    } else if (filters.recruiterId && filters.recruiterId !== 'all') {
        query = query.eq('recruiter_id', filters.recruiterId);
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

    const hasSkills = filters.skills && filters.skills.length > 0;
    
    // Apply skills overlap filter if present
    if (hasSkills) {
        query = query.overlaps('skills', filters.skills!);
    }

    // Handle pagination vs ranking
    if (hasSkills) {
        // Fetch all matching candidates to rank them in JS
        const { data, error, count } = await query;
        
        if (error) {
            console.error('Error fetching candidates with skills:', error);
            return { data: [], count: 0 };
        }

        // Rank by match count
        const ranked = (data || []).map(cand => {
            const candSkills = cand.skills || [];
            // Match count is intersection of requested skills and candidate skills
            const matchCount = filters.skills!.filter(s => candSkills.includes(s)).length;
            return { ...cand, matchCount };
        }).sort((a, b) => {
            // Primarily by match count DESC
            if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
            // Secondarily by date DESC
            return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        });

        // Paginate in memory
        const from = filters.offset || 0;
        const total = ranked.length;
        const slice = ranked.slice(from, from + (filters.limit || 9));

        return { data: slice, count: total };
    } else {
        // Standard server-side pagination path
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
                job:job_openings(title, questionnaire),
                recruiter:recruiters(full_name)
            `)
            .eq('id', id)
            .eq('is_deleted', false)
            .single();

        if (error) {
            // PGRST116 is "The result contains 0 rows", which is expected for deleted candidates
            if (error.code === 'PGRST116') return null;
            
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

export async function getApplicationsByEmail(email: string) {
    if (!email) return [];
    
    // UUID regex check (not needed since email is dynamic, but we can check if it's a valid email)
    
    const { data, error } = await supabase
        .from('job_applications')
        .select(`
            id,
            status,
            created_at,
            job:job_openings(id, title)
        `)
        .eq('email', email)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching applications by email:', error);
        return [];
    }

    return data;
}

export async function updateCandidate(id: string, updates: any) {
    console.log('UPDATING CANDIDATE:', id, updates);
    
    // Normalize names if present
    const normalizedUpdates = { ...updates };
    if (normalizedUpdates.full_name) {
        normalizedUpdates.full_name = capitalizeEachWord(normalizedUpdates.full_name);
        
        // Split for sync if they aren't provided
        const names = normalizedUpdates.full_name.trim().split(' ');
        normalizedUpdates.first_name = names[0];
        normalizedUpdates.last_name = names.length > 1 ? names.slice(1).join(' ') : '';
    }

    const { error } = await supabase
        .from('job_applications')
        .update({ ...normalizedUpdates, updated_at: new Date().toISOString() })
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

    // Fetch job_id for revalidation before update
    const { data: cand } = await supabase.from('job_applications').select('job_id').eq('id', id).single();

    revalidatePath(`/ats/candidates/${id}`);
    revalidatePath('/ats/candidates');
    revalidatePath('/ats');
    if (cand?.job_id) {
        revalidatePath(`/ats/jobs/${cand.job_id}`);
        revalidatePath('/ats/jobs');
    }
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

export async function rejectCandidate(id: string, reason: string) {
    const supabaseAuth = await createClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();
    const fullName = user?.user_metadata?.full_name || user?.email || 'Recruiter';

    const { error } = await supabase
        .from('job_applications')
        .update({ status: 'Rejected', updated_at: new Date().toISOString() })
        .eq('id', id);

    if (error) throw error;

    // Log the rejection as a special note
    await addApplicationLog(id, `RECHAZADO: ${reason} (Por ${fullName})`);

    revalidatePath(`/ats/candidates/${id}`);
    revalidatePath('/ats/candidates');
    revalidatePath('/ats');
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

    // Fetch job_id for revalidation
    const { data: cand } = await supabase.from('job_applications').select('job_id').eq('id', candidateId).single();

    revalidatePath(`/ats/candidates/${candidateId}`);
    revalidatePath('/ats/candidates');
    if (cand?.job_id) {
        revalidatePath(`/ats/jobs/${cand.job_id}`);
        revalidatePath('/ats/jobs');
    }
    revalidatePath('/ats');
    return { success: true };
}

export async function deleteCandidate(id: string) {
    const supabaseAuth = await createClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();

    const { data: cand } = await supabase.from('job_applications').select('job_id').eq('id', id).single();
    
    // Permanent Hard Delete as requested by user
    const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error in hard delete:', error);
        throw error;
    }

    if (cand?.job_id) {
        revalidatePath(`/ats/jobs/${cand.job_id}`);
        revalidatePath('/ats/jobs');
    }

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

    if (!user) {
        throw new Error("No authenticated user found for application log.");
    }

    const { error } = await supabase
        .from('application_notes')
        .insert([{
            application_id: applicationId,
            author_id: user.id,
            author_name: fullName,
            author_avatar_url: avatarUrl,
            note_text: noteText
        }]);

    if (error) throw error;

    // --- NOTIFICATION LOGIC (RESEND) ---
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const SUPERADMIN_EMAIL = 'nriccitelli@dibrand.co';

        // 1. Get Candidate and Assigned Recruiter Info
        const { data: candidate } = await supabase
            .from('job_applications')
            .select('full_name, recruiter_id')
            .eq('id', applicationId)
            .single();

        if (candidate) {
            // 2. Resolve Emails
            const [authorRes, assignedRes] = await Promise.all([
                supabase.from('recruiters').select('email, full_name').eq('id', user.id).single(),
                supabase.from('recruiters').select('email').eq('id', candidate.recruiter_id).single()
            ]);

            const author = authorRes.data;
            const assignedRecruiterEmail = assignedRes.data?.email;

            if (author) {
                // Determine recipient
                const isSuperAdmin = author.email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase();
                const recipientEmail = isSuperAdmin ? assignedRecruiterEmail : SUPERADMIN_EMAIL;

                if (recipientEmail) {
                    await resend.emails.send({
                        from: 'ATS Dibrand <hola@dibrand.co>',
                        to: recipientEmail,
                        subject: `💬 Nuevo comentario sobre: ${candidate.full_name}`,
                        html: `
                            <div style="font-family: sans-serif; max-width: 600px; padding: 20px; color: #334155;">
                                <p style="font-size: 16px; margin-bottom: 24px;">
                                    <strong>${author.full_name}</strong> ha dejado un nuevo comentario sobre el candidato <strong>${candidate.full_name}</strong>:
                                </p>
                                <div style="background: #F1F5F9; border-left: 4px solid #0040A1; padding: 20px; border-radius: 8px; margin-bottom: 32px; font-style: italic;">
                                    "${noteText}"
                                </div>
                                <p style="margin-bottom: 24px;">Puedes revisar la ficha completa del candidato y responder desde el panel del ATS:</p>
                                <a href="https://www.dibrand.co/ats/candidates/${applicationId}" 
                                   style="display: inline-block; background: #0040A1; color: white; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px;">
                                    Ver Perfil del Candidato
                                </a>
                                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #E2E8F0; font-size: 12px; color: #94A3B8;">
                                    Este es un mensaje automático del sistema de reclutamiento de Dibrand.
                                </div>
                            </div>
                        `
                    });
                }
            }
        }
    } catch (notificationError) {
        console.error('NOTIFICATION_ERROR:', notificationError);
        // We don't throw here to avoid failing the whole save operation if email fails
    }

    revalidatePath(`/ats/candidates/${applicationId}`);
    revalidatePath('/ats/candidates');
    revalidatePath('/ats');
    return { success: true };
}

export async function updateApplicationLog(id: string, applicationId: string, noteText: string) {
    const { error } = await supabase
        .from('application_notes')
        .update({ note_text: noteText })
        .eq('id', id);

    if (error) throw error;
    revalidatePath(`/ats/candidates/${applicationId}`);
    return { success: true };
}

export async function deleteApplicationLog(id: string, applicationId: string) {
    const { error } = await supabase
        .from('application_notes')
        .delete()
        .eq('id', id);

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
    try {
        // 1. Try to get from recruiters table
        const { data: dbRecruiters, error: dbError } = await supabase
            .from('recruiters')
            .select('*')
            .order('full_name');

        if (!dbError && dbRecruiters && dbRecruiters.length > 0) {
            return dbRecruiters;
        }

        console.log('Recruiters table empty or error, falling back to auth.admin.listUsers()');

        // 2. Fallback: Get directly from Auth (requires Service Role Key)
        const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authError) {
            console.error('Error listing auth users:', authError);
            return [];
        }

        // Map auth users to Recruiter format
        return users
            .filter(u => {
                const role = (u.user_metadata?.role || '').toLowerCase();
                return ['admin', 'superadmin', 'recruiter'].includes(role) || u.email?.includes('dibrand');
            })
            .map(u => ({
                id: u.id,
                full_name: u.user_metadata?.full_name || u.email || 'Reclutador',
                avatar_url: u.user_metadata?.avatar_url || null
            }));

    } catch (error) {
        console.error('CRITICAL error in getRecruiters:', error);
        return [];
    }
}

export async function getJobs() {
    const { data, error } = await supabase
        .from('job_openings')
        .select('id, title')
        .eq('is_active', true)
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
    candidate_summary?: string;
    cover_letter?: string;
    resume_url: string;
    cv_filename?: string;
    country: string;
    state_province?: string;
    job_id: string;
    linkedin_url?: string;
    skills?: string[];
    status?: string;
    questionnaire_answers?: any[];
}) {
    // 1. Check for duplicate email (case-insensitive)
    const { data: existing } = await supabase
        .from('job_applications')
        .select('id, full_name, phone, linkedin_url')
        .ilike('email', formData.email.trim())
        .eq('is_deleted', false)
        .maybeSingle();

    if (existing) {
        console.warn('--- DUPLICATE CANDIDATE BLOCKED ---', formData.email);
        return { error: `Este email ya pertenece a otro candidato: ${existing.full_name}.` };
    }

    // 2. Name Splitting & Capitalization
    const capitalizedName = capitalizeEachWord(formData.full_name);
    const names = capitalizedName.trim().split(' ');
    const first_name = names[0];
    const last_name = names.length > 1 ? names.slice(1).join(' ') : '';

    const supabaseAuth = await createClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();
    if (!user) return { error: 'User not authenticated' };
    // 3. Insert into DB with default recruiter association
    const { data, error } = await supabase
        .from('job_applications')
        .insert([{
            full_name: capitalizedName,
            first_name,
            last_name,
            email: formData.email,
            phone: formData.phone,
            candidate_summary: formData.candidate_summary || formData.cover_letter || '',
            cover_letter: formData.cover_letter || formData.candidate_summary || '',
            resume_url: formData.resume_url,
            cv_filename: formData.cv_filename || '',
            country: formData.country,
            state_province: formData.state_province || '',
            job_id: formData.job_id,
            recruiter_id: user.id, // associate to creator
            linkedin_url: formData.linkedin_url,
            skills: formData.skills || [],
            questionnaire_answers: formData.questionnaire_answers || [],
            status: formData.status || 'Nuevo', // Use provided status or default
            source: `Manual / ${user.user_metadata?.full_name || user.email?.split('@')[0] || 'Recruiter'}`,
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

        if (!user) return { success: false, error: 'No autenticado' };

        // 1. Update Auth Metadata using standard updateUser
        const { error: authError } = await supabaseAuth.auth.updateUser({
            data: {
                full_name: data.fullName,
                job_title: data.jobTitle,
                phone: data.phone,
                avatar_url: data.avatarUrl || user.user_metadata?.avatar_url
            }
        });

        if (authError) {
            console.error('AUTH METADATA UPDATE ERROR:', authError);
            return { success: false, error: `Error en Auth: ${authError.message}` };
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
            return { success: false, error: `Error en base de datos: ${dbError.message}` };
        }

        revalidatePath('/ats/settings');
        revalidatePath('/ats');
        return { success: true };
    } catch (e: any) {
        console.error('CRITICAL ERROR IN updateRecruiterProfile:', e);
        return { success: false, error: e.message || 'Error crítico inesperado' };
    }
}

export async function updateJobQuestionnaire(jobId: string, questionnaireData: any) {
    const { error } = await supabase
        .from('job_openings')
        .update({ questionnaire: questionnaireData })
        .eq('id', jobId);

    if (error) {
        console.error('Error updating job questionnaire:', error);
        throw new Error(error.message);
    }

    revalidatePath(`/ats/jobs/${jobId}`);
    return { success: true };
}

export async function updateJobDescription(jobId: string, description: string, requirements: string, industry?: string) {
    const updatePayload: any = {
        description: description,
        requirements: requirements,
        updated_at: new Date().toISOString()
    };
    if (industry) {
        updatePayload.industry = industry;
    }

    const { error } = await supabase
        .from('job_openings')
        .update(updatePayload)
        .eq('id', jobId);

    if (error) {
        console.error('Error updating job description:', error);
        throw new Error(error.message);
    }

    revalidatePath(`/ats/jobs/${jobId}`);
    return { success: true };
}

export async function getTodayEvents() {
    const supabaseAuth = await createClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();

    if (!user) return { title: 'Agenda de Hoy', events: [] };

    const candidateList = await getCandidateNames();
    const now = new Date();
    const timeZone = 'America/Argentina/Buenos_Aires';

    const getDayInfo = (date: Date) => {
        const formatter = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' });
        const p = formatter.formatToParts(date);
        const year = p.find(v => v.type === 'year')?.value;
        const month = p.find(v => v.type === 'month')?.value;
        const day = p.find(v => v.type === 'day')?.value;
        return `${year}-${month}-${day}`;
    };

    const todayStr = getDayInfo(now);

    const processEvents = (events: any[]) => {
        return (events || [])
            .filter((event: any) => {
                // Filter 1: Must have a specific start time (not all-day)
                if (!event.start?.dateTime) return false;
                
                // Filter 2: Exclude potential non-meeting noise
                const summary = (event.summary || '').toLowerCase();
                if (summary.includes('cumpleaños') || summary.includes('birthday')) return false;

                // Filter 3: Only show current or upcoming events (exclude those that already ended)
                const endTime = new Date(event.end?.dateTime || event.start.dateTime);
                if (endTime < now) return false;

                return true;
            })
            .map((event: any) => {
                const summary = event.summary || 'Sin título';
                
                // Try to match candidate names for highlighting
                let matchedCandidateId = null;
                for (const candidate of candidateList) {
                    if (summary.toLowerCase().includes(candidate.name.toLowerCase())) {
                        matchedCandidateId = candidate.id;
                        break;
                    }
                }

                return {
                    id: event.id,
                    summary,
                    start: event.start.dateTime, 
                    end: event.end?.dateTime || event.start.dateTime,
                    location: event.location,
                    link: event.htmlLink,
                    hangoutLink: event.hangoutLink,
                    candidateId: matchedCandidateId
                };
            });
    };

    try {
        // 1. Try Today
        const startOfToday = `${todayStr}T00:00:00-03:00`;
        const endOfToday = `${todayStr}T23:59:59-03:00`;
        const todayEventsRaw = await listGoogleEvents(user.id, startOfToday, endOfToday);
        const todayEvents = processEvents(todayEventsRaw);

        if (todayEvents.length > 0) {
            return { title: 'Agenda de Hoy', events: todayEvents };
        }

        // 2. If no events today (or all finished), Try Tomorrow
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = getDayInfo(tomorrow);
        
        const startOfTomorrow = `${tomorrowStr}T00:00:00-03:00`;
        const endOfTomorrow = `${tomorrowStr}T23:59:59-03:00`;
        const tomorrowEventsRaw = await listGoogleEvents(user.id, startOfTomorrow, endOfTomorrow);
        const tomorrowEvents = processEvents(tomorrowEventsRaw);

        if (tomorrowEvents.length > 0) {
            return { title: 'Agenda de Mañana', events: tomorrowEvents };
        }

        return { title: 'Agenda de Hoy', events: [] };
    } catch (error) {
        console.error('Error fetching agenda events:', error);
        return { title: 'Agenda de Hoy', events: [] };
    }
}

export async function toggleJobStatus(jobId: string, currentStatus: string) {
    const supabaseAuth = await createClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();
    
    const isSuperAdmin = 
        user?.user_metadata?.role?.toLowerCase() === 'superadmin' || 
        user?.user_metadata?.role?.toLowerCase() === 'admin' || 
        user?.role === 'SuperAdmin' || 
        ['norberto@dibrand.co', 'eugenia@dibrand.co', 'nriccitelli@dibrand.co'].includes(user?.email?.toLowerCase() || '');
    if (!isSuperAdmin) throw new Error('Unauthorized');

    const isActive = currentStatus === 'Suspended' || currentStatus === 'Paused' ? true : false;
    const newStatus = isActive ? 'Active' : 'Suspended';

    console.log(`Toggling job ${jobId} status conceptually from ${currentStatus} to ${newStatus}`);

    const { error } = await supabase
        .from('job_openings')
        .update({ 
            is_active: isActive,
            updated_at: new Date().toISOString()
        })
        .eq('id', jobId);

    if (error) {
        console.error('ERROR TOGGLING JOB STATUS:', error);
        throw error;
    }
    revalidatePath('/ats/jobs');
    revalidatePath('/[lang]/join-us', 'page');
    return { success: true, newStatus };
}

export async function deleteJob(jobId: string) {
    const supabaseAuth = await createClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();
    
    const isSuperAdmin = 
        user?.user_metadata?.role?.toLowerCase() === 'superadmin' || 
        user?.user_metadata?.role?.toLowerCase() === 'admin' || 
        user?.role === 'SuperAdmin' || 
        ['norberto@dibrand.co', 'eugenia@dibrand.co', 'nriccitelli@dibrand.co'].includes(user?.email?.toLowerCase() || '');
    if (!isSuperAdmin) throw new Error('Unauthorized');

    const { error } = await supabase
        .from('job_openings')
        .delete()
        .eq('id', jobId);

    if (error) throw error;
    revalidatePath('/ats/jobs');
    revalidatePath('/[lang]/join-us', 'page');
    return { success: true };
}
