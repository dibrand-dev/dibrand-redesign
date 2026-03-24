import React from 'react';
import { getCandidateById } from '../../../actions';
import { 
    MapPin, Mail, Phone, MessageSquare, 
    ChevronRight, Briefcase, CheckCircle2, 
    Download, Maximize2, FileText, 
    UserPlus, XCircle, MoreVertical,
    Clock, Globe, Linkedin, Star,
    Edit2
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import EditProfileButton from '@/components/ats/EditProfileButton';

export default async function CandidateDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const candidate = await getCandidateById(id);

    if (!candidate) {
        notFound();
    }

    // Map DB status to Figma Pipeline Stages
    const stages = [
        { label: 'Applied', key: ['Applied', 'New'] },
        { label: 'Screening', key: ['Screening'] },
        { label: 'Interview', key: ['Interview', 'Technical Interview'] },
        { label: 'Cultural Fit', key: ['Cultural Fit'] },
        { label: 'Final Round', key: ['Final Round', 'Offered'] }
    ];

    const currentStatus = candidate.status || 'Applied';
    const activeIndex = stages.findIndex(s => s.key.includes(currentStatus));
    const effectiveIndex = activeIndex === -1 ? 0 : activeIndex;

    return (
        <div className="min-h-full bg-[#E5E5E5] pb-20 font-inter">
            <div className="max-w-[1280px] mx-auto p-10 space-y-12">
                {/* Header Profile Hub Card */}
                <div className="bg-white rounded-[16px] p-10 shadow-sm border border-[#E1E2E5]">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
                        <div className="flex items-center gap-10">
                            <div className="relative">
                                <div className="w-[100px] h-[100px] rounded-2xl bg-[#F8FAFC] border border-[#E1E2E5] flex items-center justify-center text-3xl font-bold text-[#0040A1] overflow-hidden uppercase">
                                     {candidate.full_name?.charAt(0) || candidate.first_name?.charAt(0) || 'C'}
                                     {candidate.last_name?.charAt(0)}
                                </div>
                                {currentStatus !== 'Rejected' && (
                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 border-4 border-white rounded-full flex items-center justify-center text-white">
                                         <CheckCircle2 size={14} />
                                    </div>
                                )}
                            </div>
                            
                            <div>
                                <h1 className="text-[34px] font-bold text-[#191C1D] leading-tight mb-4">
                                    {candidate.full_name || `${candidate.first_name} ${candidate.last_name}`}
                                </h1>
                                <div className="flex flex-wrap items-center gap-8 text-[14px] text-[#737785] font-medium">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={18} className="text-[#A1A5B7]" />
                                        {candidate.country || 'Not Specified'}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail size={18} className="text-[#A1A5B7]" />
                                        {candidate.email}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone size={18} className="text-[#A1A5B7]" />
                                        {candidate.phone || 'No phone provided'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <EditProfileButton candidate={candidate} />
                            <button className="px-8 py-3 rounded-xl border border-[#E1E2E5] text-[13px] font-bold text-[#191C1D] hover:bg-[#F8FAFC] transition-all bg-white shadow-sm flex items-center gap-2">
                                <MessageSquare size={18} /> Message
                            </button>
                        </div>
                    </div>

                    {/* Horizontal Pipeline Status */}
                    <div className="mt-12 pt-10 border-t border-[#F1F5F9]">
                         <div className="relative flex items-center justify-between w-full">
                             {/* Connecting Line */}
                             <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#F1F5F9] -z-0"></div>
                             <div 
                                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#0040A1] transition-all duration-1000 -z-0" 
                                style={{ width: `${(effectiveIndex / (stages.length - 1)) * 100}%` }}
                             ></div>

                             {/* Pipeline Steps */}
                             {stages.map((step, idx) => {
                                const isDone = idx < effectiveIndex;
                                const isActive = idx === effectiveIndex;
                                return (
                                    <div key={step.label} className="relative z-10 flex flex-col items-center">
                                        <div className={`w-12 h-12 rounded-full border-4 border-white flex items-center justify-center shadow-sm transition-all duration-500 ${
                                            isDone ? 'bg-[#0040A1] text-white' : 
                                            isActive ? (currentStatus === 'Rejected' ? 'bg-red-600 text-white' : 'bg-[#0040A1] text-white scale-125') : 
                                            'bg-[#F1F5F9] text-[#A1A5B7]'
                                        }`}>
                                            {isDone ? <CheckCircle2 size={18} /> : 
                                             isActive ? (currentStatus === 'Rejected' ? <XCircle size={18} /> : <Briefcase size={18} />) : 
                                             <div className="w-2 h-2 rounded-full bg-[#A1A5B7]"></div>}
                                        </div>
                                        <span className={`absolute top-16 whitespace-nowrap text-[10px] font-bold uppercase tracking-widest ${
                                            isActive ? (currentStatus === 'Rejected' ? 'text-red-600' : 'text-[#0040A1]') : 'text-[#6B7485]'
                                        }`}>{step.label}</span>
                                    </div>
                                );
                             })}
                         </div>
                    </div>
                </div>

                {/* Main Bento Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column (Main Context) */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Current Application Detail */}
                        <section className="bg-white rounded-[16px] p-10 border border-[#E1E2E5] shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-[20px] font-bold text-[#191C1D]">Active Application</h3>
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase ${
                                    currentStatus === 'Rejected' ? 'bg-[#FFDAD6] text-[#BA1A1A]' : 'bg-[#DAE2FF] text-[#001D49]'
                                }`}>
                                    {currentStatus}
                                </span>
                            </div>
                            
                            <div className="p-8 bg-[#FBFCFD] border border-[#E1E2E5] rounded-xl">
                                <div className="flex items-start justify-between mb-8">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-white border border-[#E1E2E5] flex items-center justify-center text-[#0040A1] shadow-sm">
                                            <Briefcase size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[18px] font-bold text-[#191C1D]">{candidate.job?.title || candidate.position || 'General Application'}</p>
                                            <p className="text-[14px] text-[#737785] font-medium">Applied on {new Date(candidate.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-[#A1A5B7] uppercase tracking-widest mb-1">Assigned Recruiter</p>
                                        <p className="text-[14px] font-bold text-[#191C1D]">{candidate.recruiter?.full_name || 'Not assigned'}</p>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-[#F1F5F9]">
                                     <h4 className="text-[11px] font-bold text-[#6B7485] uppercase tracking-widest mb-3">Recruiter Notes</h4>
                                     <p className="text-[14px] text-[#191C1D] leading-relaxed italic">
                                         {candidate.recruiter_notes || 'No notes added for this candidate yet.'}
                                     </p>
                                </div>
                            </div>
                        </section>

                        {/* Resume Viewer */}
                        <section className="bg-white rounded-[16px] border border-[#E1E2E5] shadow-sm overflow-hidden">
                            <div className="p-6 bg-[#F8FAFC] border-b border-[#E1E2E5] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white border border-[#E1E2E5] flex items-center justify-center text-[#0040A1]">
                                        <FileText size={16} />
                                    </div>
                                    <h3 className="text-[15px] font-bold text-[#191C1D] truncate max-w-xs">{candidate.cv_filename || `${candidate.full_name}_CV.pdf`}</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                     <button className="p-2 text-[#737785] hover:text-[#191C1D]"><Download size={18} /></button>
                                     <button className="p-2 text-[#737785] hover:text-[#191C1D]"><Maximize2 size={18} /></button>
                                </div>
                            </div>
                            <div className="aspect-[4/5] bg-[#F1F5F9] flex flex-col items-center justify-center p-20 text-center">
                                 {candidate.resume_url || candidate.cv_filename ? (
                                     <>
                                        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-6 shadow-xl shadow-slate-200">
                                            <FileText size={40} className="text-[#0040A1]" />
                                        </div>
                                        <h4 className="text-xl font-bold mb-2">Resume Preview</h4>
                                        <p className="text-sm text-[#737785] max-w-sm mx-auto mb-8 leading-relaxed">The document has been securely processed.</p>
                                        <a 
                                            href={candidate.resume_url || '#'} 
                                            target="_blank" 
                                            className="px-8 py-3 bg-[#0040A1] text-white rounded-xl text-[13px] font-bold hover:bg-[#003380] transition-all"
                                        >
                                            View Full Resume
                                        </a>
                                     </>
                                 ) : (
                                     <div className="text-[#A1A5B7]">
                                         <FileText size={60} className="mx-auto mb-4 opacity-20" />
                                         <p className="font-bold uppercase tracking-widest text-xs">No Resume Uploaded</p>
                                     </div>
                                 )}
                            </div>
                        </section>
                    </div>

                    {/* Right Column (Sidebar/Actions) */}
                    <div className="lg:col-span-4 space-y-12">
                        {/* Process Actions */}
                        <div className="bg-white rounded-[16px] p-8 border border-[#E1E2E5] shadow-sm space-y-4">
                            <h4 className="text-[11px] font-black text-[#6B7485] uppercase tracking-[0.2em] mb-4">Manage Process</h4>
                            <button className="w-full py-4 bg-[#DAE2FF] text-[#001D49] rounded-xl text-[13px] font-bold flex items-center justify-center gap-3 hover:bg-[#C9D6FF] transition-all">
                                <UserPlus size={18} /> Advance Stage
                            </button>
                            <button className="w-full py-4 bg-[#FFDAD6] text-[#BA1A1A] rounded-xl text-[13px] font-bold flex items-center justify-center gap-3 hover:bg-[#FFC9C4] transition-all">
                                <XCircle size={18} /> Reject Candidate
                            </button>
                            <button className="w-full py-4 bg-white border border-[#E1E2E5] text-[#191C1D] rounded-xl text-[13px] font-bold flex items-center justify-center gap-3 hover:bg-[#F8FAFC] transition-all">
                                <MoreVertical size={18} /> Other Actions
                            </button>
                        </div>

                        {/* Personal Metadata */}
                        <div className="bg-white rounded-[16px] p-8 border border-[#E1E2E5] shadow-sm">
                            <h4 className="text-[11px] font-black text-[#6B7485] uppercase tracking-[0.2em] mb-6">Candidate Meta</h4>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                     <Globe size={18} className="text-[#A1A5B7] mt-0.5" />
                                     <div>
                                         <p className="text-[10px] font-bold text-[#A1A5B7] uppercase tracking-widest mb-1">Source</p>
                                         <p className="text-[13px] font-bold text-[#191C1D] truncate">LinkedIn / Career Page</p>
                                     </div>
                                </div>
                                <div className="flex items-start gap-4">
                                     <Linkedin size={18} className="text-[#A1A5B7] mt-0.5" />
                                     <div>
                                         <p className="text-[10px] font-bold text-[#A1A5B7] uppercase tracking-widest mb-1">LinkedIn Profile</p>
                                         {candidate.linkedin_url ? (
                                             <a href={candidate.linkedin_url} target="_blank" className="text-[13px] font-bold text-[#0040A1] hover:underline truncate block max-w-[180px]">View Profile</a>
                                         ) : <p className="text-[13px] font-bold text-[#A1A5B7]">Not Provided</p>}
                                     </div>
                                </div>
                                <div className="flex items-start gap-4">
                                     <Clock size={18} className="text-[#A1A5B7] mt-0.5" />
                                     <div>
                                         <p className="text-[10px] font-bold text-[#A1A5B7] uppercase tracking-widest mb-1">Created At</p>
                                         <p className="text-[13px] font-bold text-[#191C1D]">{new Date(candidate.created_at).toLocaleDateString()}</p>
                                     </div>
                                </div>
                            </div>
                        </div>

                        {/* Core Competencies placeholders - could be connected if DB had a skills table */}
                        <div className="bg-white rounded-[16px] p-8 border border-[#E1E2E5] shadow-sm">
                            <h4 className="text-[11px] font-black text-[#6B7485] uppercase tracking-[0.2em] mb-6">Evaluated Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {(candidate.skills || ['Hardworking', 'Analytical', 'Communication']).map((skill: string) => (
                                    <span key={skill} className="px-3 py-1.5 bg-[#F1F5F9] text-[#424654] text-[11px] font-bold rounded-lg border border-transparent hover:border-[#0040A1] transition-all">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
