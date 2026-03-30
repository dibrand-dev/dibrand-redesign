import { createClient } from '@/lib/supabase-server-client';
import { redirect } from 'next/navigation';
import JobViewClient from './JobViewClient';

export default async function JobViewPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/admin/login');
    }

    const userRole = user?.user_metadata?.role || user?.role;

    let jobData: any = null;

    try {
        const { data: job, error } = await supabase
            .from('job_openings')
            .select(`
                id,
                title, 
                location,
                is_active,
                description,
                requirements,
                employment_type,
                seniority,
                salary_range,
                questionnaire,
                created_at,
                candidates:job_applications(
                    id, first_name, last_name, email, status, created_at, is_deleted, avatar_url, recruiter_id
                )
            `)
            .eq('id', params.id)
            .single();

        if (error) {
            console.error('Error fetching job details:', error);
        } else {
            const activeCandidates = (job.candidates || []).filter((c: any) => !c.is_deleted);

            // Fetch all recruiters using service role to bypass RLS
            const { createClient: createSupabase } = await import('@supabase/supabase-js');
            const adminClient = createSupabase(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!
            );
            const { data: allRecruiters } = await adminClient.from('recruiters').select('id, full_name, role, avatar_url');
            const recruiterMap: Record<string, any> = {};
            (allRecruiters || []).forEach((r: any) => { recruiterMap[r.id] = r; });

            // Inject recruiter data into candidates using direct map lookup
            const candidatesWithRecruiters = activeCandidates.map((c: any) => ({
                ...c,
                recruiter: recruiterMap[c.recruiter_id] || null
            }));

            const totalApplicants = candidatesWithRecruiters.length;
            const countsByStatus = candidatesWithRecruiters.reduce((acc: any, curr: any) => {
                const status = curr.status || 'Applied';
                acc[status] = (acc[status] || 0) + 1;
                return acc;
            }, {});

            // Extract unique recruiters for hiring team
            const teamMap = new Map();
            candidatesWithRecruiters.forEach((c: any) => {
                if (c.recruiter?.id && !teamMap.has(c.recruiter.id)) {
                    teamMap.set(c.recruiter.id, c.recruiter);
                }
            });
            const team = Array.from(teamMap.values());

            const newCount = (countsByStatus['Applied'] || 0) + (countsByStatus['New'] || 0);
            const screenedCount = countsByStatus['Screening'] || 0;
            const interviewingCount = (countsByStatus['Interview'] || 0) + (countsByStatus['Technical'] || 0);
            const offerCount = countsByStatus['Offered'] || 0;
            const hiredCount = countsByStatus['Hired'] || 0;
            const daysOpen = Math.floor((Date.now() - new Date(job.created_at).getTime()) / (1000 * 60 * 60 * 24)) || 0;

            const recentActivity = candidatesWithRecruiters
                .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(0, 5);

            jobData = {
                ...job,
                team,
                stats: { totalApplicants, newCount, screenedCount, interviewingCount, offerCount, hiredCount, daysOpen },
                recentActivity,
                allCandidates: candidatesWithRecruiters
            };
        }
    } catch (e) {
        console.error('Exception fetching job:', e);
    }

    return (
        <JobViewClient job={jobData} userRole={userRole} />
    );
}
