import { getCandidateById, getApplicationLogs } from '../../../actions';
import { 
    MapPin, Mail, Phone, MessageSquare, 
    ChevronRight, Briefcase, CheckCircle2, 
    Download, Maximize2, FileText, 
    UserPlus, XCircle, MoreVertical,
    Clock, Globe, Linkedin, Star,
    Edit2, User
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import EditProfileButton from '@/components/ats/EditProfileButton';
import ManageProcessButtons from '@/components/ats/ManageProcessButtons';
import RecruiterNotes from '@/components/ats/RecruiterNotes';
import MessageButton from '@/components/ats/MessageButton';

export default async function CandidateDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const candidate = await getCandidateById(id);
    const logs = await getApplicationLogs(id);

    if (!candidate) {
        notFound();
    }

    // Map DB status to Figma Pipeline Stages (Identical to 3329-24)
    const stages = [
        { label: 'APPLIED', key: ['Applied', 'New'] },
        { label: 'PHONE SCREEN', key: ['Screening', 'Phone Screen'] },
        { label: 'TECHNICAL', key: ['Interview', 'Technical Interview'] },
        { label: 'CULTURE', key: ['Culture', 'Cultural Fit'] },
        { label: 'FINAL', key: ['Final Round'] },
        { label: 'OFFER', key: ['Offered', 'Offer'] }
    ];

    const currentStatus = candidate.status || 'Applied';
    const activeIndex = stages.findIndex(s => s.key.includes(currentStatus));
    const effectiveIndex = activeIndex === -1 ? 0 : activeIndex;

    return (
        <div className="min-h-full bg-[#E5E5E5] pb-20 font-inter">
            <div className="max-w-[1400px] mx-auto p-8 space-y-8">
                {/* Header Profile Card - Figma 3329-24 Style */}
                <div className="bg-white rounded-[12px] p-8 shadow-sm border border-[#E2E8F0]">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-10">
                        <div className="flex items-center gap-6">
                            {/* Circular Avatar */}
                            <div className="relative">
                                <div className="w-[80px] h-[80px] rounded-full bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-2xl font-bold text-[#0040A1] overflow-hidden uppercase shadow-inner">
                                     {candidate.full_name?.charAt(0) || candidate.first_name?.charAt(0) || 'C'}
                                     {candidate.last_name?.charAt(0)}
                                </div>
                            </div>
                            
                            <div>
                                <h1 className="text-[28px] font-bold text-[#191C1D] leading-tight mb-2">
                                    {candidate.full_name || `${candidate.first_name} ${candidate.last_name}`}
                                </h1>
                                <div className="flex flex-wrap items-center gap-6 text-[13px] text-[#737785] font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={16} className="text-[#A1A5B7]" />
                                        {candidate.country || 'UK'}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Mail size={16} className="text-[#A1A5B7]" />
                                        {candidate.email}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Phone size={16} className="text-[#A1A5B7]" />
                                        {candidate.phone || 'No phone'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Header Actions */}
                        <div className="flex items-center gap-3">
                            <button className="px-8 py-2.5 bg-[#0040A1] text-white rounded-xl text-[13px] font-bold hover:bg-[#003380] transition-all shadow-sm">
                                Interview
                            </button>
                            <button className="px-8 py-2.5 bg-[#F1F5F9] text-[#191C1D] rounded-xl text-[13px] font-bold border border-[#E2E8F0] hover:bg-[#E2E8F0] transition-all">
                                Message
                            </button>
                        </div>
                    </div>

                    {/* Horizontal Pipeline Stepper (Exact Figma Colors) */}
                    <div className="pt-8 border-t border-[#F1F5F9]">
                         <div className="relative flex items-center justify-between w-full px-4">
                             {/* Connecting Line Background */}
                             <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-[2px] bg-[#F1F5F9] -z-0"></div>
                             {/* Active Line Progress */}
                             <div 
                                className="absolute left-10 top-1/2 -translate-y-1/2 h-[2px] bg-[#0040A1] transition-all duration-1000 -z-0" 
                                style={{ width: `calc(${(effectiveIndex / (stages.length - 1)) * 100}% - 40px)` }}
                             ></div>

                             {/* Stepper Dots */}
                             {stages.map((step, idx) => {
                                const isDone = idx < effectiveIndex;
                                const isActive = idx === effectiveIndex;
                                return (
                                    <div key={step.label} className="relative z-10 flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-md transition-all duration-500 ${
                                            isDone || isActive ? 'bg-[#0040A1] text-white' : 'bg-[#F1F5F9] text-[#A1A5B7]'
                                        }`}>
                                            {isDone ? <CheckCircle2 size={14} strokeWidth={3} /> : 
                                             isActive ? <div className="w-2 h-2 rounded-full bg-white"></div> : 
                                             <div className="w-1.5 h-1.5 rounded-full bg-[#A1A5B7]"></div>}
                                        </div>
                                        <span className={`absolute top-12 whitespace-nowrap text-[9px] font-black uppercase tracking-[0.15em] ${
                                            isDone || isActive ? 'text-[#0040A1]' : 'text-[#A1A5B7]'
                                        }`}>{step.label}</span>
                                    </div>
                                );
                             })}
                         </div>
                    </div>
                </div>

                {/* Main Content Area with Sub-Sidebar */}
                <div className="flex gap-10">
                    {/* SideNav (Local to Candidate) */}
                    <div className="w-20 flex flex-col items-center gap-8 pt-4">
                        {[
                            { icon: User, label: 'Overview' },
                            { icon: Clock, label: 'Timeline' },
                            { icon: FileText, label: 'Resume' },
                            { icon: MessageSquare, label: 'Notes' },
                            { icon: Star, label: 'History' }
                        ].map((item, id) => (
                            <button key={item.label} className={`flex flex-col items-center gap-1.5 group ${id === 0 ? 'text-[#0040A1]' : 'text-[#A1A5B7] hover:text-[#0040A1]'}`}>
                                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${id === 0 ? 'bg-[#0040A1] text-white border-[#0040A1] shadow-lg shadow-blue-200' : 'bg-white border-[#E2E8F0] group-hover:border-[#0040A1]'}`}>
                                    <item.icon size={20} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                            </button>
                        ))}
                        <div className="mt-auto pb-4">
                            <button className="w-12 h-12 rounded-xl bg-[#0040A1] text-white flex items-center justify-center shadow-lg shadow-blue-200 hover:bg-[#003380] transition-all" title="Hire Candidate">
                                <UserPlus size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Main Columns */}
                    <div className="flex-1 grid grid-cols-12 gap-10">
                        {/* Left Column (Main Context) */}
                        <div className="col-span-8 space-y-10">
                            {/* Cover Letter Module */}
                            <section className="bg-white rounded-[12px] p-8 border border-[#E2E8F0] shadow-sm">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-[11px] font-black text-[#6B7485] uppercase tracking-[0.2em]">Cover Letter</h3>
                                    <button className="text-[11px] font-bold text-[#0040A1] hover:underline uppercase tracking-widest">Edit</button>
                                </div>
                                <div className="p-8 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl min-h-[200px] text-[14px] leading-relaxed text-[#424654] font-medium">
                                    {candidate.cover_letter || "Dynamic professional with a proven track record. Passionate about creating impact through high-performance engineering."}
                                </div>
                            </section>

                            {/* Application History Module */}
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

                            {/* Resume Viewer */}
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
                                <div className="aspect-[4/5] bg-[#F1F5F9] flex flex-col items-center justify-center p-20 text-center">
                                     <div className="w-20 h-20 rounded-xl bg-white flex items-center justify-center mb-6 shadow-xl shadow-slate-200">
                                         <FileText size={32} className="text-[#0040A1]" />
                                     </div>
                                     <h4 className="text-lg font-bold mb-2">Resume Preview</h4>
                                     <p className="text-[13px] text-[#737785] max-w-sm mx-auto mb-8 font-medium">Document verified and processed correctly.</p>
                                     <a 
                                         href={candidate.resume_url || '#'} 
                                         target="_blank" 
                                         className="px-10 py-3 bg-[#0040A1] text-white rounded-xl text-[13px] font-bold hover:bg-[#003380] transition-all"
                                     >
                                         Open Interactive PDF
                                     </a>
                                </div>
                            </section>

                            {/* Recruiter Notes Section */}
                            <RecruiterNotes applicationId={candidate.id} initialNotes={logs} />
                        </div>

                        {/* Right Column (Sidebar/Actions) */}
                        <div className="col-span-4 space-y-10">
                            {/* Process Actions Module */}
                            <section className="bg-white rounded-[12px] p-8 border border-[#E2E8F0] shadow-sm">
                                <h3 className="text-[11px] font-black text-[#6B7485] uppercase tracking-[0.2em] mb-8">Process Actions</h3>
                                <div className="space-y-4">
                                    <button className="w-full py-4 bg-[#0040A1] text-white rounded-2xl text-[14px] font-bold hover:bg-[#003380] transition-all shadow-md active:scale-98">
                                        Advance Stage
                                    </button>
                                    <button className="w-full py-4 bg-white text-[#BA1A1A] border-2 border-[#FFDAD6] rounded-2xl text-[14px] font-bold hover:bg-[#FFF8F7] transition-all active:scale-98">
                                        Reject Candidate
                                    </button>
                                </div>
                            </section>

                            {/* Core Competencies Module */}
                            <section className="bg-white rounded-[12px] p-8 border border-[#E2E8F0] shadow-sm">
                                <h3 className="text-[11px] font-black text-[#6B7485] uppercase tracking-[0.2em] mb-8">Core Competencies</h3>
                                <div className="flex flex-wrap gap-2">
                                    {(candidate.skills || ['PRODUCT STRATEGY', 'DESIGN SYSTEMS', 'FIGMA', 'NEXT.JS', 'TAILWIND']).map((skill: string) => (
                                        <span key={skill} className="px-4 py-2 bg-[#0040A1] text-white text-[10px] font-black rounded-lg uppercase tracking-widest shadow-sm">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            {/* Personal Metadata */}
                            <div className="bg-white rounded-[12px] p-8 border border-[#E2E8F0] shadow-sm">
                                <h3 className="text-[11px] font-black text-[#6B7485] uppercase tracking-[0.2em] mb-8">Personal Detail</h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                         <Globe size={18} className="text-[#A1A5B7] mt-0.5" />
                                         <div>
                                             <p className="text-[10px] font-bold text-[#A1A5B7] uppercase tracking-widest mb-1">Source</p>
                                             <p className="text-[13px] font-bold text-[#191C1D]">LinkedIn Referral</p>
                                         </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                         <Linkedin size={18} className="text-[#A1A5B7] mt-0.5" />
                                         <div>
                                             <p className="text-[10px] font-bold text-[#A1A5B7] uppercase tracking-widest mb-1">LinkedIn Profile</p>
                                             <a href={candidate.linkedin_url || '#'} target="_blank" className="text-[13px] font-bold text-[#0040A1] hover:underline">View Full Profile</a>
                                         </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                         <Clock size={18} className="text-[#A1A5B7] mt-0.5" />
                                         <div>
                                             <p className="text-[10px] font-bold text-[#A1A5B7] uppercase tracking-widest mb-1">Registered</p>
                                             <p className="text-[13px] font-bold text-[#191C1D]">{new Date(candidate.created_at).toLocaleDateString()}</p>
                                         </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
