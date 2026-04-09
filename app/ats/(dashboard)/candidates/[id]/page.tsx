import { getCandidateById, getApplicationLogs, getStackNames, syncRecruiterProfile, getApplicationsByEmail, getRecruiters, getAtsUserContext } from '@/app/ats/actions';
import { 
    MapPin, Mail, Phone, Calendar, FileText, StickyNote, Clock,
    Check, Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon, Download, Maximize2, User, Pencil, Users, Briefcase
} from 'lucide-react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ScheduleInterviewModal from '@/components/ats/ScheduleInterviewModal';
import EditCandidateModal from '@/components/ats/EditCandidateModal';
import ProcessActionsWidget from '@/components/ats/ProcessActionsWidget';
import CandidatePipelineTracker from '@/components/ats/CandidatePipelineTracker';
import CoverLetterCard from '@/components/ats/CoverLetterCard';
import DisqualifiedTag from '@/components/ats/DisqualifiedTag';
import RecruiterNotesWidget from '@/components/ats/RecruiterNotesWidget';
import ApplicationHistoryWidget from '@/components/ats/ApplicationHistoryWidget';
import ResumeViewer from '@/components/ats/ResumeViewer';
import CandidateTabs from '@/components/ats/CandidateTabs';
import CandidateSkills from '@/components/ats/CandidateSkills';
import { capitalizeName } from '@/lib/utils';
import RecruiterAssignment from '@/components/ats/RecruiterAssignment';

export default async function CandidateDetailPage({ 
    params,
    searchParams 
}: { 
    params: Promise<{ id: string }>,
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { id } = await params;
    const sParams = await searchParams;
    const showSchedule = sParams.schedule === 'true';
    const showEdit = sParams.edit === 'true';
    
    const candidate = await getCandidateById(id);
    const logs = await getApplicationLogs(id);
    const recruiterId = await syncRecruiterProfile();
    const allRecruiters = await getRecruiters();
    const userCtx = await getAtsUserContext();
    const isAdmin = userCtx.role === 'admin' || userCtx.role === 'SuperAdmin';

    if (!candidate) notFound();

    // Fetch all applications for this candidate to show which positions they applied for
    const allApplications = await getApplicationsByEmail(candidate.email);
    
    // Create a unique set of jobs (id + title)
    const uniqueJobs = Array.from(new Map(
        allApplications.map((app: any) => {
            const jobData = app.job;
            const singleJob = Array.isArray(jobData) ? jobData[0] : jobData;
            return singleJob ? [singleJob.id, singleJob] : null;
        }).filter(Boolean) as [string, { id: string, title: string }][]
    ).values());

    const rejectionLog = (logs || []).find(log => log.note_text?.startsWith('RECHAZADO: '));
    const rejectionReason = rejectionLog ? rejectionLog.note_text.split(' (Por ')[0].replace('RECHAZADO: ', '') : null;

    const resolvedStackNames = await getStackNames(candidate.stack_ids || []);
    const allSkills = Array.from(new Set([...resolvedStackNames, ...(candidate.skills || [])])).sort();

    return (
        <div className="min-h-[calc(100vh-80px)] bg-[#FAFAFA] font-outfit">
            {/* Main Content */}
            <div className="overflow-y-auto px-12 py-10 custom-scrollbar">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-10 gap-8">
                        <div className="flex items-start gap-6 min-w-0 flex-1">
                            <div className="w-[110px] h-[110px] rounded-[24px] bg-slate-200 overflow-hidden shadow-sm shrink-0 border border-slate-200/60 ring-4 ring-white relative group">
                                <img 
                                    src={candidate.avatar_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} 
                                    alt={candidate.full_name ? capitalizeName(candidate.full_name) : 'Avatar'} 
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                            <div className="min-w-0 flex-1 pt-1">
                                {candidate.status === 'Rejected' && <DisqualifiedTag reason={rejectionReason} />}
                                <h1 
                                    className="text-[22px] font-black text-slate-900 leading-none mb-3 tracking-tight truncate" 
                                    title={candidate.full_name ? capitalizeName(candidate.full_name) : `${capitalizeName(candidate.first_name)} ${capitalizeName(candidate.last_name)}`}
                                >
                                    {capitalizeName(candidate.full_name || `${candidate.first_name} ${candidate.last_name}`)}
                                </h1>
                                <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-[13px] text-slate-500 font-semibold mb-3">
                                    <div className="flex items-center gap-1.5 whitespace-nowrap"><MapPin size={16} className="text-slate-400" /> {candidate.country ? capitalizeName(candidate.country) : 'Sin especificar'}</div>
                                    <div className="flex items-center gap-1.5 whitespace-nowrap"><Mail size={16} className="text-slate-400" /> {candidate.email}</div>
                                    <div className="flex items-center gap-1.5 whitespace-nowrap"><Phone size={16} className="text-slate-400" /> {candidate.phone || 'Sin número'}</div>
                                </div>
                                
                                {candidate.linkedin_url && (
                                    <div className="flex items-center gap-1.5 mb-3">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#0077b5" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                        </svg>
                                        <a 
                                            href={candidate.linkedin_url.startsWith('http') ? candidate.linkedin_url : `https://${candidate.linkedin_url}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-[13px] font-bold text-[#0077b5] hover:underline flex items-center gap-1"
                                        >
                                            Perfil de LinkedIn
                                        </a>
                                    </div>
                                )}

                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">Postulaciones:</span>
                                    {uniqueJobs.map((job: any) => (
                                        <Link 
                                            key={job.id} 
                                            href={`/ats/jobs/${job.id}`}
                                            className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-lg border border-slate-200 flex items-center gap-1.5 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                                        >
                                            <Briefcase size={12} className="text-slate-400" /> {job.title}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <Link href={`/ats/candidates/${id}/edit`} className="h-[42px] px-6 border border-slate-200 bg-white rounded-xl text-[13px] font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all flex items-center gap-2">
                                <Pencil size={14} /> Editar
                            </Link>
                            <button className="h-[42px] px-6 border border-slate-200 bg-white rounded-xl text-[13px] font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all">Message</button>
                            <Link href={`/ats/candidates/${id}?schedule=true`} className="h-[42px] px-6 bg-[#0B4FEA] text-white rounded-xl text-[13px] font-bold hover:bg-blue-800 shadow-md shadow-blue-600/20 transition-all flex items-center justify-center">Interview</Link>
                        </div>
                    </div>

                    {/* Progress Tracker Widget */}
                    <div className="mb-10">
                        <CandidatePipelineTracker 
                            candidateId={id}
                            currentStatus={candidate.status || 'Nuevo'} 
                        />
                    </div>

                    {/* Content Section with Tabs */}
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                        {/* LEFT/MAIN COLUMN (Tabs) */}
                        <div className="xl:col-span-8">
                            <CandidateTabs candidate={candidate} logs={logs || []} />
                        </div>

                        {/* RIGHT SIDEBAR (Quick Actions/Meta) */}
                        <div className="xl:col-span-4 space-y-8">
                             {/* Assigned Recruiter Component */}
                             <RecruiterAssignment 
                                 candidateId={candidate.id}
                                 currentRecruiterId={candidate.recruiter_id}
                                 currentRecruiterName={candidate.recruiter?.full_name || null}
                                 currentRecruiterAvatar={candidate.recruiter?.avatar_url || null}
                                 allRecruiters={allRecruiters}
                                 isAdmin={isAdmin}
                             />

                            {/* Process Actions Widget */}
                            <ProcessActionsWidget 
                                candidateId={id} 
                                currentStatus={candidate.status || 'Nuevo'} 
                            />

                            {/* Core Competencies (Skills) */}
                            <CandidateSkills 
                                candidateId={id} 
                                initialSkills={allSkills} 
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            {showSchedule && (
                <ScheduleInterviewModal candidate={candidate} recruiterId={recruiterId || null} />
            )}

            {showEdit && (
                <EditCandidateModal candidate={candidate} />
            )}
        </div>
    );
}
