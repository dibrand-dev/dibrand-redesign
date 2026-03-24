'use client';

import React, { useState } from 'react';
import { 
    User, Clock, FileText, MessageSquare, Star, 
    UserPlus, Briefcase, Download, Maximize2, Globe, Linkedin, Mail, Phone
} from 'lucide-react';
import EditableCoverLetter from './EditableCoverLetter';
import CandidateProcessActions from './CandidateProcessActions';
import CandidateSkills from './CandidateSkills';
import RecruiterNotes from './RecruiterNotes';

interface CandidateDetailTabsProps {
    candidate: any;
    logs: any;
    allSkills: string[];
    stages: any[];
    currentStatus: string;
}

export default function CandidateDetailTabs({ candidate, logs, allSkills, stages, currentStatus }: CandidateDetailTabsProps) {
    const [activeTab, setActiveTab] = useState('Overview');

    const tabs = [
        { id: 'Overview', icon: User, label: 'Overview' },
        { id: 'Timeline', icon: Clock, label: 'Timeline' },
        { id: 'Resume', icon: FileText, label: 'Resume' },
        { id: 'Notes', icon: MessageSquare, label: 'Notes' },
        { id: 'History', icon: Star, label: 'History' }
    ];

    const renderMainContent = () => {
        switch (activeTab) {
            case 'Overview':
                return (
                    <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-500">
                        <EditableCoverLetter 
                            candidateId={candidate.id} 
                            initialContent={candidate.cover_letter || candidate.candidate_summary || ""} 
                        />
                    </div>
                );
            case 'Timeline':
                return (
                    <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-500">
                        <section className="bg-white rounded-[12px] p-8 border border-[#E2E8F0] shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-[11px] font-black text-[#6B7485] uppercase tracking-[0.2em]">Application History</h3>
                                <button className="text-[11px] font-bold text-[#0040A1] hover:underline uppercase tracking-widest">View Archive</button>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { pos: 'Senior Frontend dev', date: 'Oct 2023', status: 'ACTIVE', color: 'bg-[#DAE2FF] text-[#0040A1]' },
                                    { pos: 'UI/UX Designer', date: 'Sept 2023', status: 'WITHDRAWN', color: 'bg-[#FFDAD6] text-[#BA1A1A]' }
                                ].map((job, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-white border border-[#F1F5F9] rounded-2xl hover:border-[#E2E8F0] transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#A1A5B7]">
                                                <Briefcase size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[14px] font-bold text-[#191C1D]">{job.pos}</p>
                                                <p className="text-[12px] text-[#737785]">{job.date}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${job.color}`}>{job.status}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                );
            case 'Resume':
                return (
                    <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-500">
                        <section className="bg-white rounded-[12px] border border-[#E2E8F0] shadow-sm overflow-hidden">
                            <div className="p-6 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center text-[#0040A1] shadow-sm">
                                        <FileText size={16} />
                                    </div>
                                    <h3 className="text-[14px] font-bold text-[#191C1D]">{candidate.cv_filename || `${candidate.first_name}_CV_2024.pdf`}</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                     <button className="p-2 text-[#737785] hover:text-[#191C1D] transition-colors"><Download size={18} /></button>
                                     <button className="p-2 text-[#737785] hover:text-[#191C1D] transition-colors"><Maximize2 size={18} /></button>
                                </div>
                            </div>
                            <div className="aspect-[4/5] bg-[#F1F5F9] relative overflow-hidden group">
                                {candidate.resume_url || candidate.cv_filename ? (
                                    <iframe 
                                        src={`${(candidate.resume_url || candidate.cv_filename)?.startsWith('http') 
                                            ? (candidate.resume_url || candidate.cv_filename) 
                                            : `https://mdvyvqphumrciekgjlfb.supabase.co/storage/v1/object/public/resumes/${encodeURIComponent(candidate.resume_url || candidate.cv_filename || '')}`
                                        }#toolbar=0&navpanes=0`}
                                        className="w-full h-full border-none"
                                        title="Candidate Resume"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-20 text-center h-full">
                                        <div className="w-20 h-20 rounded-xl bg-white flex items-center justify-center mb-6 shadow-xl shadow-slate-200">
                                            <FileText size={32} className="text-[#0040A1]" />
                                        </div>
                                        <h4 className="text-lg font-bold mb-2">Resume Preview</h4>
                                        <p className="text-[13px] text-[#737785] max-w-sm mx-auto mb-8 font-medium">Document verified and processed correctly.</p>
                                    </div>
                                )}
                                
                                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
                                    <a 
                                        href={(candidate.resume_url || candidate.cv_filename)?.startsWith('http') 
                                            ? (candidate.resume_url || candidate.cv_filename) 
                                            : `https://mdvyvqphumrciekgjlfb.supabase.co/storage/v1/object/public/resumes/${encodeURIComponent(candidate.resume_url || candidate.cv_filename || '')}`
                                        }
                                        target="_blank" 
                                        className="px-8 py-3 bg-[#0040A1] text-white rounded-xl text-[13px] font-bold hover:bg-[#003380] transition-all shadow-xl"
                                    >
                                        View Full Screen
                                    </a>
                                </div>
                            </div>
                        </section>
                    </div>
                );
            case 'Notes':
                return (
                    <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-500">
                        <RecruiterNotes applicationId={candidate.id} initialNotes={logs} />
                    </div>
                );
            case 'History':
                return (
                    <div className="bg-white rounded-xl p-8 border border-[#E2E8F0] text-center py-20 animate-in fade-in slide-in-from-left-4 duration-500">
                        <Star size={40} className="mx-auto text-[#E2E8F0] mb-4" />
                        <h3 className="text-lg font-bold text-[#191C1D]">Candidate History</h3>
                        <p className="text-[#737785] text-[13px]">Full history of interactions and evaluations for this talent.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex gap-10">
            {/* SideNav (Tabs) */}
            <div className="w-20 flex flex-col items-center gap-8 pt-4 sticky top-24 self-start">
                {tabs.map((tab) => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex flex-col items-center gap-1.5 group transition-all ${
                            activeTab === tab.id ? 'text-[#0040A1]' : 'text-[#A1A5B7] hover:text-[#0040A1]'
                        }`}
                    >
                        <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${
                            activeTab === tab.id 
                                ? 'bg-[#0040A1] text-white border-[#0040A1] shadow-lg shadow-blue-200 scale-105' 
                                : 'bg-white border-[#E2E8F0] group-hover:border-[#0040A1]'
                        }`}>
                            <tab.icon size={20} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
                    </button>
                ))}
                
                <div className="mt-8 pt-8 border-t border-[#E2E8F0] w-full flex justify-center">
                    <button className="w-12 h-12 rounded-xl bg-[#0040A1] text-white flex items-center justify-center shadow-lg shadow-blue-200 hover:bg-[#003380] hover:scale-105 transition-all" title="Hire Candidate">
                        <UserPlus size={20} />
                    </button>
                </div>
            </div>

            {/* Content Columns */}
            <div className="flex-1 grid grid-cols-12 gap-10 min-h-[600px]">
                {/* Left (Tab Content) */}
                <div className="col-span-8">
                    {renderMainContent()}
                </div>

                {/* Right (Static Components) */}
                <div className="col-span-4 space-y-10 animate-in fade-in duration-700">
                    <CandidateProcessActions 
                        candidateId={candidate.id} 
                        currentStatus={currentStatus} 
                        stages={stages} 
                    />

                    <CandidateSkills 
                        candidateId={candidate.id} 
                        initialSkills={allSkills} 
                    />

                    <div className="bg-white rounded-[12px] p-8 border border-[#E2E8F0] shadow-sm">
                        <h3 className="text-[11px] font-black text-[#6B7485] uppercase tracking-[0.2em] mb-8">Personal Detail</h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                 <Globe size={18} className="text-[#A1A5B7] mt-0.5" />
                                 <div>
                                     <p className="text-[10px] font-bold text-[#6B7485] uppercase tracking-widest mb-1">Location</p>
                                     <p className="text-[14px] font-bold text-[#191C1D]">{candidate.country}, {candidate.city || 'London'}</p>
                                 </div>
                            </div>
                            <div className="flex items-start gap-4">
                                 <Mail size={18} className="text-[#A1A5B7] mt-0.5" />
                                 <div>
                                     <p className="text-[10px] font-bold text-[#6B7485] uppercase tracking-widest mb-1">Email</p>
                                     <p className="text-[14px] font-bold text-[#191C1D]">{candidate.email}</p>
                                 </div>
                            </div>
                            <div className="flex items-start gap-4">
                                 <Phone size={18} className="text-[#A1A5B7] mt-0.5" />
                                 <div>
                                     <p className="text-[10px] font-bold text-[#6B7485] uppercase tracking-widest mb-1">Phone</p>
                                     <p className="text-[14px] font-bold text-[#191C1D]">{candidate.phone || '+44 7911 123456'}</p>
                                 </div>
                            </div>
                            {candidate.linkedin_url && (
                                <div className="flex items-start gap-4">
                                     <Linkedin size={18} className="text-[#A1A5B7] mt-0.5" />
                                     <div>
                                         <p className="text-[10px] font-bold text-[#6B7485] uppercase tracking-widest mb-1">LinkedIn</p>
                                         <a href={candidate.linkedin_url} target="_blank" className="text-[14px] font-bold text-[#0040A1] hover:underline break-all">
                                             {candidate.linkedin_url.split('in/')[1] || 'View Profile'}
                                         </a>
                                     </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
