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
import { capitalizeName, getInitials } from '@/lib/utils';
import RecruiterAssignment from '@/components/ats/RecruiterAssignment';
import DeleteCandidateButton from '@/components/ats/DeleteCandidateButton';

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
        <div className="min-h-[calc(100vh-80px)] bg-[#FAFAFA] font-outfit relative pb-20 lg:pb-0">
            {/* Main Content */}
            <div className="overflow-y-auto px-4 sm:px-8 lg:px-12 py-6 lg:py-10 custom-scrollbar">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row justify-between items-start mb-8 lg:mb-10 gap-6 lg:gap-8">
                        <div className="flex flex-col sm:flex-row items-start gap-6 min-w-0 flex-1">
                            <div className="w-[90px] h-[90px] lg:w-[110px] lg:h-[110px] rounded-full bg-[#EBF1FF] border border-[#D0DFFF] flex items-center justify-center text-[#0040A1] font-bold text-3xl lg:text-4xl shrink-0 overflow-hidden shadow-sm ring-4 ring-white relative group">
                                {candidate.avatar_url ? (
                                    <img 
                                        src={candidate.avatar_url} 
                                        alt={candidate.full_name ? capitalizeName(candidate.full_name) : 'Avatar'} 
                                        className="w-full h-full object-cover" 
                                    />
                                ) : (
                                    getInitials(candidate.full_name, candidate.first_name, candidate.last_name)
                                )}
                            </div>
                            <div className="min-w-0 flex-1 pt-1">
                                {candidate.status === 'Rejected' && <DisqualifiedTag reason={rejectionReason} />}
                                <h1 
                                    className="text-[24px] lg:text-[28px] font-black text-slate-900 leading-tight mb-3 tracking-tight" 
                                    title={candidate.full_name ? capitalizeName(candidate.full_name) : `${capitalizeName(candidate.first_name)} ${capitalizeName(candidate.last_name)}`}
                                >
                                    {capitalizeName(candidate.full_name || `${candidate.first_name} ${candidate.last_name}`)}
                                </h1>
                                <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-[14px] text-slate-500 font-semibold mb-4">
                                    <div className="flex items-center gap-2"><MapPin size={18} className="text-slate-400" /> {candidate.country ? capitalizeName(candidate.country) : 'Sin especificar'}</div>
                                    <div className="flex items-center gap-2"><Mail size={18} className="text-slate-400" /> {candidate.email}</div>
                                    <div className="flex items-center gap-2"><Phone size={18} className="text-slate-400" /> {candidate.phone || 'Sin número'}</div>
                                </div>
                                
                                {candidate.linkedin_url && (
                                    <div className="flex items-center gap-2 mb-4">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#0077b5" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                        </svg>
                                        <a 
                                            href={candidate.linkedin_url.startsWith('http') ? candidate.linkedin_url : `https://${candidate.linkedin_url}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-[14px] font-bold text-[#0077b5] hover:underline flex items-center gap-1"
                                        >
                                            Perfil de LinkedIn
                                        </a>
                                    </div>
                                )}

                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest mr-1">Postulaciones:</span>
                                    {uniqueJobs.map((job: any) => (
                                        <Link 
                                            key={job.id} 
                                            href={`/ats/jobs/${job.id}`}
                                            className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[12px] font-bold rounded-xl border border-slate-200 flex items-center gap-2 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                                        >
                                            <Briefcase size={14} className="text-slate-400" /> {job.title}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden lg:flex items-center gap-3 shrink-0">
                            <Link href={`/ats/candidates/${id}/edit`} className="h-[48px] px-6 border border-slate-200 bg-white rounded-xl text-[14px] font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all flex items-center gap-2">
                                <Pencil size={16} /> Editar
                            </Link>
                            <DeleteCandidateButton candidateId={id} candidateName={candidate.full_name || `${candidate.first_name} ${candidate.last_name}`} />
                            <Link href={`/ats/candidates/${id}?schedule=true`} className="h-[48px] px-8 bg-[#0B4FEA] text-white rounded-xl text-[14px] font-bold hover:bg-blue-800 shadow-md shadow-blue-600/20 transition-all flex items-center justify-center">Entrevista</Link>
                        </div>
                    </div>

                    {/* Progress Tracker Widget */}
                    <div className="mb-10 overflow-x-auto pb-4">
                        <div className="min-w-[600px] lg:min-w-0">
                            <CandidatePipelineTracker 
                                candidateId={id}
                                currentStatus={candidate.status || 'Nuevo'} 
                            />
                        </div>
                    </div>

                    {/* Content Section with Tabs */}
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-10">
                        {/* Mobile Sidebar (Top on mobile) */}
                        <div className="xl:hidden space-y-8 order-first">
                             <RecruiterAssignment 
                                 candidateId={candidate.id}
                                 currentRecruiterId={candidate.recruiter_id}
                                 currentRecruiterName={candidate.recruiter?.full_name || null}
                                 currentRecruiterAvatar={candidate.recruiter?.avatar_url || null}
                                 allRecruiters={allRecruiters}
                                 isAdmin={isAdmin}
                             />
                        </div>

                        {/* LEFT/MAIN COLUMN (Tabs) */}
                        <div className="xl:col-span-8">
                            <CandidateTabs candidate={candidate} logs={logs || []} />
                        </div>

                        {/* RIGHT SIDEBAR (Quick Actions/Meta) */}
                        <div className="xl:col-span-4 space-y-8 flex flex-col">
                             {/* Desktop only Recruiter Assignment */}
                             <div className="hidden xl:block">
                                <RecruiterAssignment 
                                    candidateId={candidate.id}
                                    currentRecruiterId={candidate.recruiter_id}
                                    currentRecruiterName={candidate.recruiter?.full_name || null}
                                    currentRecruiterAvatar={candidate.recruiter?.avatar_url || null}
                                    allRecruiters={allRecruiters}
                                    isAdmin={isAdmin}
                                />
                             </div>

                            {/* Process Actions Widget - 100% width on mobile */}
                            <ProcessActionsWidget 
                                candidateId={id} 
                                currentStatus={candidate.status || 'Nuevo'} 
                            />

                            {/* Core Competencies (Skills) - 100% width on mobile */}
                            <CandidateSkills 
                                candidateId={id} 
                                initialSkills={allSkills} 
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Mobile Footer */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-40 flex items-center gap-3 shadow-[0_-8px_30px_rgb(0,0,0,0.12)]">
                <Link 
                    href={`/ats/candidates/${id}/edit`} 
                    className="flex-1 h-[52px] border border-slate-200 bg-white rounded-2xl text-[14px] font-bold text-slate-700 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                    <Pencil size={18} /> Editar
                </Link>
                <div className="flex-none">
                    <DeleteCandidateButton 
                        candidateId={id} 
                        candidateName={candidate.full_name || `${candidate.first_name} ${candidate.last_name}`} 
                    />
                </div>
                <Link 
                    href={`/ats/candidates/${id}?schedule=true`} 
                    className="flex-[2] h-[52px] bg-[#0040A1] text-white rounded-2xl text-[14px] font-bold shadow-lg shadow-blue-200 flex items-center justify-center active:scale-95 transition-all"
                >
                    Agendar Entrevista
                </Link>
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
