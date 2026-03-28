import { Suspense } from 'react';
import { getCandidateById, getApplicationLogs, getStackNames, syncRecruiterProfile } from '@/app/ats/actions';
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

    const resolvedStackNames = await getStackNames(candidate.stack_ids || []);
    const allSkills = Array.from(new Set([...resolvedStackNames, ...(candidate.skills || [])])).sort();

    return (
        <div className="-m-10 min-h-[calc(100vh-80px)] flex bg-[#FAFAFA] font-inter">
            {/* Secondary Sidebar */}
            <div className="w-56 bg-white border-r border-[#E2E8F0] shrink-0 flex flex-col justify-between hidden lg:flex">
                <div>
                   <div className="p-6">
                       <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 tracking-widest uppercase mb-6 mt-2">
                           <div className="w-4 h-4 bg-slate-900 rounded-sm"></div>
                           Recruitment Hub
                       </div>
                       
                       <nav className="space-y-1 relative mt-4">
                           {/* Active marker right edge */}
                           <div className="absolute right-[-24px] top-0 bottom-0 w-[4px] bg-transparent">
                               <div className="absolute top-0 right-0 h-[44px] w-[4px] bg-[#0B4FEA] rounded-l-full"></div>
                           </div>

                           <Link href="#" className="flex items-center gap-3 px-4 py-3 text-[#0B4FEA] bg-[#EEF2FF] rounded-xl text-[13px] font-bold">
                               <User size={16} /> Overview
                           </Link>
                           <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-900 text-[13px] font-semibold transition-colors">
                               <Calendar size={16} /> Timeline
                           </Link>
                           <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-900 text-[13px] font-semibold transition-colors">
                               <FileText size={16} /> Resume
                           </Link>
                           <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-900 text-[13px] font-semibold transition-colors">
                               <StickyNote size={16} /> Notes
                           </Link>
                           <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-900 text-[13px] font-semibold transition-colors">
                               <Clock size={16} /> History
                           </Link>
                       </nav>
                   </div>
                </div>
                
                <div className="p-6 border-t border-slate-100">
                    <button className="w-full py-3 bg-[#0B4FEA] text-white rounded-xl text-[13px] font-bold shadow-md shadow-blue-600/20 hover:bg-blue-800 transition-colors">
                        Hire Candidate
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-10">
                        <div className="flex items-center gap-8">
                            <div className="w-[110px] h-[110px] rounded-[24px] bg-slate-200 overflow-hidden shadow-sm shrink-0 border border-slate-200/60 ring-4 ring-white relative group">
                                <img 
                                    src={candidate.avatar_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} 
                                    alt="Avatar" 
                                    className="w-full h-full object-cover" 
                                />
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 outline outline-4 outline-white rounded-full flex items-center justify-center text-white text-[10px] shadow-sm">
                                    <Briefcase size={12} fill="currentColor" className="text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-[34px] font-black text-slate-900 leading-tight mb-3 tracking-tight">
                                    {candidate.full_name || `${candidate.first_name} ${candidate.last_name}`}
                                </h1>
                                <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-[14px] text-slate-500 font-semibold">
                                    <div className="flex items-center gap-1.5 whitespace-nowrap"><MapPin size={16} className="text-slate-400" /> {candidate.country || 'Sin especificar'}</div>
                                    <div className="flex items-center gap-1.5 whitespace-nowrap"><Mail size={16} className="text-slate-400" /> {candidate.email}</div>
                                    <div className="flex items-center gap-1.5 whitespace-nowrap"><Phone size={16} className="text-slate-400" /> {candidate.phone || 'Sin número'}</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                            <Link href={`/ats/candidates/${id}?edit=true`} className="px-6 py-2.5 border border-slate-200 bg-white rounded-xl text-[14px] font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all flex items-center gap-2">
                                <Pencil size={14} /> Editar
                            </Link>
                            <button className="px-6 py-2.5 border border-slate-200 bg-white rounded-xl text-[14px] font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all">Message</button>
                            <Link href={`/ats/candidates/${id}?schedule=true`} className="px-6 py-2.5 bg-[#0B4FEA] text-white rounded-xl text-[14px] font-bold hover:bg-blue-800 shadow-md shadow-blue-600/20 transition-all flex items-center justify-center">Interview</Link>
                        </div>
                    </div>

                    {/* Progress Tracker Widget */}
                    <CandidatePipelineTracker currentStatus={candidate.status || 'Applied'} />

                    {/* Subgrid layout */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        <div className="xl:col-span-2 space-y-8">
                            {/* Cover Letter */}
                            <div className="bg-white rounded-[20px] shadow-sm border border-slate-200/60 p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-[18px] font-extrabold text-slate-900">Cover Letter</h3>
                                    <button className="flex items-center gap-2 text-blue-600 text-[13px] font-bold hover:text-blue-800 transition-colors"><Pencil size={14} /> Edit</button>
                                </div>
                                {/* Editor Toolbar */}
                                <div className="flex gap-4 p-2.5 bg-slate-100 rounded-xl mb-6 text-slate-500 items-center shrink-0">
                                    <button className="p-1 rounded hover:bg-slate-200 text-slate-700"><Bold size={16} /></button>
                                    <button className="p-1 rounded hover:bg-slate-200"><Italic size={16} /></button>
                                    <button className="p-1 rounded hover:bg-slate-200"><Underline size={16} /></button>
                                    <div className="w-px h-5 bg-slate-300 mx-2"></div>
                                    <button className="p-1 rounded hover:bg-slate-200"><List size={16} /></button>
                                    <button className="p-1 rounded hover:bg-slate-200"><ListOrdered size={16} /></button>
                                    <div className="w-px h-5 bg-slate-300 mx-2"></div>
                                    <button className="p-1 rounded hover:bg-slate-200"><LinkIcon size={16} /></button>
                                </div>
                                <div className="p-8 bg-slate-50 rounded-2xl text-[14px] text-slate-700 leading-chill font-medium">
                                    <p className="mb-5">Dear Hiring Team,</p>
                                    <p className="mb-5">I am writing to express my strong interest in the Senior Product Designer position at Editorial Intelligence. With over 8 years of experience in creating user-centered digital experiences and leading design systems for complex SaaS products, I am confident in my ability to contribute significantly to your team.</p>
                                    <p className="mb-5">In my recent roles, I have specialized in bridging the gap between design and engineering, ensuring that high-fidelity prototypes are not only visually stunning but also technically feasible and accessible. My approach is deeply rooted in user research and data-driven iteration.</p>
                                    <p className="mb-6">I have long admired Editorial Intelligence's commitment to quality journalism and innovative digital storytelling. I look forward to the possibility of discussing how my background in strategic design can support your mission.</p>
                                    <p className="mb-1">Best regards,</p>
                                    <p className="font-bold text-slate-900">Eleanor Vance</p>
                                </div>
                            </div>

                            {/* Application History */}
                            <div className="bg-white rounded-[20px] shadow-sm border border-slate-200/60 p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-[18px] font-extrabold text-slate-900">Application History</h3>
                                    <button className="text-blue-600 text-[13px] font-bold hover:underline">View Archive</button>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center p-5 bg-slate-50 rounded-2xl border border-slate-100 gap-4">
                                        <div className="w-12 h-12 bg-[#EEF2FF] rounded-xl flex items-center justify-center text-blue-600 shrink-0 shadow-sm border border-blue-100">
                                            <Briefcase size={20} fill="currentColor" className="text-blue-600/20" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-[15px] font-extrabold text-slate-900 leading-tight mb-1">Senior Product Designer</h4>
                                            <p className="text-[12px] text-slate-500 font-semibold">Editorial Intelligence • Aug 2023</p>
                                        </div>
                                        <div className="flex items-center gap-5 sm:ml-auto">
                                            <div className="flex items-center gap-2.5 text-[12px] font-bold text-slate-700">
                                                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                                                    <img src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" alt="Recruiter" />
                                                </div> James W.
                                            </div>
                                            <span className="px-3.5 py-1.5 bg-[#EEF2FF] text-blue-700 text-[10px] font-black rounded-lg tracking-widest uppercase shadow-sm">ACTIVE</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row sm:items-center p-5 bg-slate-50/50 rounded-2xl border border-slate-100 gap-4 opacity-80">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 shrink-0 border border-slate-200 shadow-sm">
                                            <FileText size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-[15px] font-bold text-slate-600 leading-tight mb-1">UX Strategy Lead</h4>
                                            <p className="text-[12px] text-slate-400 font-medium">Future Media Group • Mar 2023</p>
                                        </div>
                                        <div className="flex items-center gap-5 sm:ml-auto">
                                            <span className="px-3.5 py-1.5 bg-red-50 text-red-600 text-[10px] font-black rounded-lg tracking-widest uppercase">WITHDRAWN</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Resume / CV */}
                            <div className="bg-white rounded-[20px] shadow-sm border border-slate-200/60 p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-[18px] font-extrabold text-slate-900">Resume / CV</h3>
                                    <div className="flex gap-4 text-slate-400">
                                        <button className="hover:text-slate-700 transition-colors"><Download size={18} /></button>
                                        <button className="hover:text-slate-700 transition-colors"><Maximize2 size={18} /></button>
                                    </div>
                                </div>
                                <div className="border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center justify-center py-20 mb-6 h-[400px] relative overflow-hidden group">
                                    <div className="w-72 bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] rounded-sm p-8 absolute transform transition-transform duration-500 group-hover:-translate-y-2">
                                        <div className="h-5 bg-slate-200 w-1/3 mb-6 rounded-sm"></div>
                                        <div className="h-2.5 bg-slate-100 w-full mb-3 rounded-full"></div>
                                        <div className="h-2.5 bg-slate-100 w-full mb-3 rounded-full"></div>
                                        <div className="h-2.5 bg-slate-100 w-4/5 mb-6 rounded-full"></div>
                                        <div className="h-2.5 bg-slate-200 w-1/4 mb-3 rounded-full"></div>
                                        <div className="h-2.5 bg-slate-100 w-full mb-3 rounded-full"></div>
                                        <div className="h-2.5 bg-slate-100 w-2/3 mb-3 rounded-full"></div>
                                    </div>
                                    <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                        <button className="px-6 py-3 bg-white text-slate-900 font-extrabold text-[13px] rounded-xl shadow-xl flex items-center gap-2 hover:scale-105 transition-transform">
                                            <Maximize2 size={16}/> View Full Document
                                        </button>
                                    </div>
                                </div>
                                <p className="text-center text-[12px] font-bold text-slate-500">Eleanor_Vance_Resume_2024.pdf (2.4 MB)</p>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            {/* Assigned Recruiter Card */}
                            <div className="bg-white rounded-[20px] shadow-sm border border-slate-200/60 p-6 animate-in slide-in-from-right-4 duration-500">
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

                            {/* Process Actions */}
                            <ProcessActionsWidget 
                                candidateId={id} 
                                currentStatus={candidate.status || 'Applied'} 
                            />

                            {/* Recruiter Notes */}
                            <div className="bg-white rounded-[20px] shadow-sm border border-slate-200/60 p-6">
                                <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-5">Recruiter Notes</h3>
                                <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-500 transition-all shadow-sm">
                                    <textarea 
                                        placeholder="Add a private note..." 
                                        className="w-full text-[14px] text-slate-700 resize-none outline-none placeholder:text-slate-400 min-h-[80px]"
                                    ></textarea>
                                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                                        <div className="flex gap-4 text-slate-400">
                                            <button className="hover:text-slate-700 transition-colors"><LinkIcon size={16} /></button>
                                            <button className="hover:text-slate-700 transition-colors"><span className="font-extrabold font-serif text-[16px]">@</span></button>
                                        </div>
                                        <button className="px-6 py-2 bg-[#0B4FEA] text-white rounded-lg text-[12px] font-bold shadow-sm hover:bg-blue-800 transition-colors">POST</button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-slate-50 p-5 rounded-xl flex gap-3.5 border border-slate-100">
                                        <div className="w-8 h-8 rounded-full shrink-0 shadow-sm ring-2 ring-white bg-slate-200 overflow-hidden">
                                            <img src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" alt="Avatar" />
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-center mb-1.5">
                                                <span className="text-[13px] font-extrabold text-slate-900">Maria Garcia</span>
                                                <span className="text-[11px] font-semibold text-slate-400">2h ago</span>
                                            </div>
                                            <p className="text-[13px] text-slate-600 font-medium leading-relaxed">
                                                Strong technical foundation. Explained the intricate state management logic perfectly.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Core Competencies */}
                            <div className="bg-white rounded-[20px] shadow-sm border border-slate-200/60 p-6">
                                <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-5">Core Competencies</h3>
                                <div className="flex flex-wrap gap-2">
                                    {allSkills.length > 0 ? allSkills.slice(0, 5).map(skill => (
                                         <span key={skill} className="px-3 py-1.5 bg-[#EEF2FF] text-blue-700 text-[10px] font-black rounded-lg uppercase tracking-widest border border-blue-100">
                                            {skill}
                                         </span>
                                    )) : (
                                        <>
                                            <span className="px-3.5 py-2 bg-[#EEF2FF] text-blue-700 text-[10px] font-black rounded-lg uppercase tracking-widest border border-blue-100">PRODUCT STRATEGY</span>
                                            <span className="px-3.5 py-2 bg-[#EEF2FF] text-blue-700 text-[10px] font-black rounded-lg uppercase tracking-widest border border-blue-100">DESIGN SYSTEMS</span>
                                            <span className="px-3.5 py-2 bg-[#EEF2FF] text-blue-700 text-[10px] font-black rounded-lg uppercase tracking-widest border border-blue-100">FIGMA</span>
                                            <span className="px-3.5 py-2 bg-[#EEF2FF] text-blue-700 text-[10px] font-black rounded-lg uppercase tracking-widest border border-blue-100">USER RESEARCH</span>
                                            <span className="px-3.5 py-2 bg-[#EEF2FF] text-blue-700 text-[10px] font-black rounded-lg uppercase tracking-widest border border-blue-100">REACT/TS</span>
                                        </>
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
