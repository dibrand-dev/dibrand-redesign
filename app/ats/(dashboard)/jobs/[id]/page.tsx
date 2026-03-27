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
                created_at,
                candidates:job_applications(
                    id, first_name, last_name, email, status, created_at, is_deleted,
                    recruiter:recruiters(id, full_name, role, avatar_url)
                )
            `)
            .eq('id', params.id)
            .single();

        if (error) {
            console.error('Error fetching job details:', error);
        } else {
            // Process candidates correctly
            const activeCandidates = (job.candidates || []).filter((c: any) => !c.is_deleted);
            const totalApplicants = activeCandidates.length;

            const countsByStatus = activeCandidates.reduce((acc: any, curr: any) => {
                const status = curr.status || 'Applied';
                acc[status] = (acc[status] || 0) + 1;
                return acc;
            }, {});

            // Extract unique recruiters for this job
            const teamMap = new Map();
            activeCandidates.forEach((c: any) => {
                const rec = Array.isArray(c.recruiter) ? c.recruiter[0] : c.recruiter;
                if (rec && rec.id && !teamMap.has(rec.id)) {
                    teamMap.set(rec.id, rec);
                }
            });
            const team = Array.from(teamMap.values());

            // Group into UI buckets
            const newCount = (countsByStatus['Applied'] || 0) + (countsByStatus['New'] || 0);
            const screenedCount = countsByStatus['Screening'] || 0;
            const interviewingCount = countsByStatus['Interview'] || 0 + countsByStatus['Technical'] || 0;
            const offerCount = countsByStatus['Offered'] || 0;
            const hiredCount = countsByStatus['Hired'] || 0;

            const daysOpen = Math.floor((Date.now() - new Date(job.created_at).getTime()) / (1000 * 60 * 60 * 24)) || 0;
            
            // Sort to get recent activity
            const recentActivity = activeCandidates
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(0, 5);

            jobData = {
                ...job,
                team,
                stats: {
                    totalApplicants,
                    newCount,
                    screenedCount,
                    interviewingCount,
                    offerCount,
                    hiredCount,
                    daysOpen
                },
                recentActivity
            };
        }
    } catch (e) {
        console.error('Exception fetching job:', e);
    }

    return (
        <JobViewClient job={jobData} />
    );
}
