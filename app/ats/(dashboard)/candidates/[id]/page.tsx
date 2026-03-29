import { getCandidateById, getApplicationLogs, getStackNames, syncRecruiterProfile, getApplicationsByEmail } from '@/app/ats/actions';
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

    if (!candidate) notFound();

    // Fetch all applications for this candidate to show which positions they applied for
    const allApplications = await getApplicationsByEmail(candidate.email);
    const uniqueJobTitles = Array.from(new Set(allApplications.map((app: any) => {
        const jobData = app.job;
        return Array.isArray(jobData) ? jobData[0]?.title : jobData?.title;
    }).filter(Boolean))) as string[];

    const rejectionLog = (logs || []).find(log => log.note_text?.startsWith('RECHAZADO: '));
    const rejectionReason = rejectionLog ? rejectionLog.note_text.split(' (Por ')[0].replace('RECHAZADO: ', '') : null;

    const resolvedStackNames = await getStackNames(candidate.stack_ids || []);
    const allSkills = Array.from(new Set([...resolvedStackNames, ...(candidate.skills || [])])).sort();

    return (
        <div className="min-h-[calc(100vh-80px)] bg-[#FAFAFA] font-inter">
            {/* Main Content */}
            <div className="overflow-y-auto px-12 py-10 custom-scrollbar">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-10 gap-8">
                        <div className="flex items-start gap-6 min-w-0 flex-1">
                            <div className="w-[110px] h-[110px] rounded-[24px] bg-slate-200 overflow-hidden shadow-sm shrink-0 border border-slate-200/60 ring-4 ring-white relative group">
                                <img 
                                    src={candidate.avatar_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} 
                                    alt="Avatar" 
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                            <div className="min-w-0 flex-1 pt-1">
                                {candidate.status === 'Rejected' && <DisqualifiedTag reason={rejectionReason} />}
                                <h1 className="text-[22px] font-black text-slate-900 leading-none mb-3 tracking-tight truncate" title={candidate.full_name || `${candidate.first_name} ${candidate.last_name}`}>
                                    {candidate.full_name || `${candidate.first_name} ${candidate.last_name}`}
                                </h1>
                                <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-[13px] text-slate-500 font-semibold mb-3">
                                    <div className="flex items-center gap-1.5 whitespace-nowrap"><MapPin size={16} className="text-slate-400" /> {candidate.country || 'Sin especificar'}</div>
                                    <div className="flex items-center gap-1.5 whitespace-nowrap"><Mail size={16} className="text-slate-400" /> {candidate.email}</div>
                                    <div className="flex items-center gap-1.5 whitespace-nowrap"><Phone size={16} className="text-slate-400" /> {candidate.phone || 'Sin número'}</div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">Postulaciones:</span>
                                    {uniqueJobTitles.map((title, i) => (
                                        <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-lg border border-slate-200 flex items-center gap-1.5">
                                            <Briefcase size={12} className="text-slate-400" /> {title}
                                        </span>
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
                        <CandidatePipelineTracker currentStatus={candidate.status || 'Applied'} />
                    </div>

                    {/* Content Section with Tabs */}
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                        {/* LEFT/MAIN COLUMN (Tabs) */}
                        <div className="xl:col-span-8">
                            <CandidateTabs candidate={candidate} logs={logs || []} />
                        </div>

                        {/* RIGHT SIDEBAR (Quick Actions/Meta) */}
                        <div className="xl:col-span-4 space-y-8">
                             {/* Assigned Recruiter Card */}
                             <div className="bg-white rounded-[20px] shadow-sm border border-slate-200/60 p-6">
                                <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-5">Reclutador Asignado</h3>
                                <div className="flex items-center gap-4 bg-[#F8FAFC] p-4 rounded-xl border border-slate-100">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B4FEA] to-blue-700 text-white flex items-center justify-center font-black text-sm shadow-md">
                                        {(candidate.recruiter?.full_name || 'SA')[0].toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[14px] font-black text-slate-900 leading-tight truncate px-1">
                                            {candidate.recruiter?.full_name || 'Sin asignar'}
                                        </p>
                                        <p className="text-[11px] font-semibold text-slate-500 mt-0.5 px-1 truncate capitalize">
                                            Managing Recruiter
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Process Actions Widget */}
                            <ProcessActionsWidget 
                                candidateId={id} 
                                currentStatus={candidate.status || 'Applied'} 
                            />

                            {/* Core Competencies (Skills) */}
                            <div className="bg-white rounded-[20px] shadow-sm border border-slate-200/60 p-6">
                                <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-5">Core Competencies</h3>
                                <div className="flex flex-wrap gap-2">
                                    {allSkills.length > 0 ? allSkills.slice(0, 10).map(skill => (
                                         <span key={skill} className="px-3 py-1.5 bg-[#EEF2FF] text-blue-700 text-[10px] font-black rounded-lg uppercase tracking-widest border border-blue-100">
                                            {skill}
                                         </span>
                                    )) : (
                                        <p className="text-[12px] text-slate-400 italic">No skills listed</p>
                                    )}
                                </div>
                            </div>
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
