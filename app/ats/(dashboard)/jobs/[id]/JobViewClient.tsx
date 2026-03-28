'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
    ArrowLeft, 
    Share2, 
    Edit2, 
    MapPin, 
    Calendar as CalendarIcon, 
    CornerUpRight,
    Bold, Italic, List, Link as LinkIcon, Heading1, Heading2,
    CheckCircle2, Globe, Plus, Clock, MessageSquare,
    Link2, Eye, Save, Settings2, Sparkles, RefreshCcw
} from 'lucide-react';
import { createClient } from '@/lib/supabase-client';

interface JobData {
    id: string;
    title: string;
    location: string;
    is_active: boolean;
    description?: string;
    requirements?: string;
    salary_range?: string;
    employment_type?: string;
    seniority?: string;
    stats?: {
        totalApplicants: number;
        newCount: number;
        screenedCount: number;
        interviewingCount: number;
        offerCount: number;
        hiredCount: number;
        daysOpen: number;
    };
    recentActivity?: any[];
    team?: any[];
}

export default function JobViewClient({ job }: { job: JobData | null }) {
    const [activeTab, setActiveTab] = useState('Candidates');
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    // Fetch user role
    React.useEffect(() => {
        const fetchRole = async () => {
            const supabaseAuth = await createClient();
            const { data: { user } } = await supabaseAuth.auth.getUser();
            const role = user?.user_metadata?.role || user?.role;
            setIsSuperAdmin(role === 'SuperAdmin');
        };
        fetchRole();
    }, []);
    
    // Default mock info to match the design precisely
    const title = job?.title || 'Senior Product Designer';
    const location = job?.location || 'London, UK / Remote';
    const isActive = job?.is_active ?? true;
    const employmentType = job?.employment_type || 'Full-time';
    const seniority = job?.seniority || 'Senior';

    return (
        <div className="flex-1 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Top Header */}
            <div className="flex items-center justify-between mb-8">
                <Link href="/ats/jobs" className="flex items-center gap-2 text-[13px] font-semibold text-[#737785] hover:text-[#191C1D] transition-colors">
                    <ArrowLeft size={16} />
                    Back to Jobs
                </Link>
            </div>

            {/* Job Title Region */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
                <div>
                    <div className="flex items-center gap-4 mb-3">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
                            isActive ? 'bg-[#D6E3FB] text-[#0040A1]' : 'bg-[#E2E8F0] text-[#737785]'
                        }`}>
                            {isActive ? 'ACTIVE' : 'PAUSED'}
                        </span>
                        <div className="flex items-center gap-1.5 text-[#737785] text-[13px] font-semibold">
                            <MapPin size={14} />
                            {location}
                        </div>
                    </div>
                    <h1 className="text-[36px] font-bold text-[#191C1D] tracking-tight leading-none mb-2">
                        {title}
                    </h1>
                    {activeTab === 'Job Description' && (
                        <p className="text-[13px] font-semibold text-[#737785] mt-2">ID: #{job?.id?.slice(0, 6) || '8829'}-UX</p>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {activeTab === 'Job Description' ? (
                        <>
                            <button className="px-5 py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0040A1] text-[13px] font-bold rounded-xl transition-all h-10 flex items-center">
                                Preview Public Page
                            </button>
                            <button className="px-5 py-2.5 bg-[#0040A1] hover:bg-[#003380] text-white text-[13px] font-bold rounded-xl transition-all shadow-lg shadow-[#0040A1]/10 h-10 flex items-center">
                                Save Changes
                            </button>
                        </>
                    ) : (
                        <>
                            {isSuperAdmin && (
                                <button className="px-5 py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0040A1] text-[13px] font-bold rounded-xl transition-all flex items-center gap-2">
                                    <Edit2 size={16} /> Edit
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Key Stats Cards - Present on Candidates tab */}
            {activeTab === 'Candidates' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="bg-[#F8FAFC] rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                            <span className="text-[42px] font-black text-[#0040A1] leading-none mb-3">{job?.stats?.daysOpen || 15}</span>
                            <span className="text-[11px] font-bold text-[#737785] tracking-widest uppercase">DAYS OPEN</span>
                        </div>
                        <div className="bg-[#F8FAFC] rounded-2xl p-8 flex flex-col items-center justify-center text-center border-x border-[#F1F5F9] md:border-x-0">
                            <span className="text-[42px] font-black text-[#0040A1] leading-none mb-3">{job?.stats?.totalApplicants || 0}</span>
                            <span className="text-[11px] font-bold text-[#737785] tracking-widest uppercase">TOTAL APPLICANTS</span>
                        </div>
                        <div className="bg-[#F8FAFC] rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                            <span className="text-[42px] font-black text-[#0040A1] leading-none mb-3">{job?.stats?.hiredCount || 0}</span>
                            <span className="text-[11px] font-bold text-[#737785] tracking-widest uppercase">HIRED</span>
                        </div>
                    </div>

                    <div className="mb-10">
                        <h3 className="text-[16px] font-bold text-[#191C1D] mb-4">Recruitment Pipeline</h3>
                        <div className="grid grid-cols-4 w-full rounded-2xl overflow-hidden h-24 shadow-sm border border-[#E2E8F0]">
                            <div className="bg-[#0040A1] p-4 flex flex-col justify-between relative">
                                <span className="text-[10px] font-bold text-white/80 tracking-widest uppercase">NEW</span>
                                <span className="text-[28px] font-bold text-white leading-none">{job?.stats?.newCount || 0}</span>
                            </div>
                            <div className="bg-[#0060F0] p-4 flex flex-col justify-between -ml-2 skew-x-[-10deg] border-l border-[#0040A1]/20 z-10">
                                <div className="skew-x-[10deg] flex flex-col h-full justify-between">
                                    <span className="text-[10px] font-bold text-white/80 tracking-widest uppercase">SCREENED</span>
                                    <span className="text-[28px] font-bold text-white leading-none">{job?.stats?.screenedCount || 0}</span>
                                </div>
                            </div>
                            <div className="bg-[#5A6376] p-4 flex flex-col justify-between -ml-4 skew-x-[-10deg] border-l border-[#0040A1]/20 z-20">
                                <div className="skew-x-[10deg] flex flex-col h-full justify-between pl-2">
                                    <span className="text-[10px] font-bold text-white/80 tracking-widest uppercase">INTERVIEWING</span>
                                    <span className="text-[28px] font-bold text-white leading-none">{job?.stats?.interviewingCount || 0}</span>
                                </div>
                            </div>
                            <div className="bg-[#191C1D] p-4 flex flex-col justify-between -ml-4 z-30">
                                <span className="text-[10px] font-bold text-white/80 tracking-widest uppercase">OFFER</span>
                                <span className="text-[28px] font-bold text-white leading-none">{job?.stats?.offerCount || 0}</span>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Tabs Row */}
            <div className="flex items-center gap-8 border-b border-[#E2E8F0] mb-8">
                {['Candidates', 'Job Description', 'Team', 'Questionnaire'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-[14px] font-bold pb-4 transition-all relative ${
                            activeTab === tab ? 'text-[#0040A1]' : 'text-[#737785] hover:text-[#191C1D]'
                        }`}
                    >
                        {tab === 'Team' ? 'Hiring Team' : tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#0040A1] rounded-full z-10"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Content Switcher */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* CANDIDATES TAB (Mock Layout) */}
                {activeTab === 'Candidates' && (
                    <>
                        <div className="lg:col-span-8 space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[11px] font-bold text-[#737785] tracking-widest uppercase">RECENT ACTIVITY</h3>
                                <button className="text-[12px] font-bold text-[#0040A1] flex items-center gap-1">
                                    View All Candidates <ArrowLeft size={12} className="rotate-180" />
                                </button>
                            </div>
                            
                             {job?.recentActivity && job.recentActivity.length > 0 ? (
                                job.recentActivity.map((candidate: any, idx: number) => {
                                    const timeAgo = Math.floor((Date.now() - new Date(candidate.created_at).getTime()) / (1000 * 60 * 60)) + 'h ago';
                                    const shortName = `${candidate.first_name} ${candidate.last_name?.charAt(0) || ''}.`;
                                    const recruiterData = Array.isArray(candidate.recruiter) ? candidate.recruiter[0] : candidate.recruiter;
                                    const recruiterName = recruiterData?.full_name || 'Unassigned';
                                    return (
                                        <div key={candidate.id} className="group/card relative bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#0040A1]/30 transition-all flex items-center justify-between mb-4">
                                            <Link href={`/ats/candidates/${candidate.id}`} className="absolute inset-0 z-10" />
                                            <div className="flex items-center gap-4 relative z-20 pointer-events-none">
                                                {candidate.avatar_url ? (
                                                    <img src={candidate.avatar_url} alt="Avatar" className="w-12 h-12 rounded-xl object-cover" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-xl bg-[#0040A1] flex items-center justify-center text-white font-bold text-[18px]">
                                                        {candidate.first_name.charAt(0)}{candidate.last_name?.charAt(0)}
                                                    </div>
                                                )}
                                                <div>
                                                    <h4 className="text-[15px] font-bold text-[#191C1D] mb-1">{shortName}</h4>
                                                    <p className="text-[13px] text-[#737785]">Applied {timeAgo} • {recruiterName}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 relative z-30">
                                                <span className="px-3 py-1 bg-[#E2E8F0] text-[#0040A1] text-[9px] font-black tracking-widest rounded-full uppercase">
                                                    {candidate.status || 'Applied'}
                                                </span>
                                                <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#F8FAFC] text-[#0040A1] hover:bg-[#E2E8F0] transition-colors pointer-events-auto">
                                                    <CalendarIcon size={16} />
                                                </button>
                                                <Link href={`/ats/candidates/${candidate.id}`} className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#F8FAFC] text-[#0040A1] hover:bg-[#E2E8F0] transition-colors pointer-events-auto">
                                                    <CornerUpRight size={16} />
                                                </Link>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="bg-[#F8FAFC] rounded-2xl p-12 text-center border-2 border-dashed border-[#E2E8F0]">
                                    <p className="text-[14px] font-bold text-[#191C1D] mb-2">No active candidates</p>
                                    <p className="text-[12px] text-[#737785]">When people start applying, they will arrive here.</p>
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-4 space-y-6">
                            {/* Hiring Team summary snippet */}
                            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
                                <h3 className="text-[11px] font-bold text-[#737785] tracking-widest uppercase mb-4">HIRING TEAM</h3>
                                <div className="space-y-4">
                                    {job?.team && job.team.length > 0 ? (
                                        job.team.slice(0, 3).map((member: any) => (
                                            <div key={member.id} className="flex items-center gap-3">
                                                {member.avatar_url ? (
                                                    <img src={member.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-[#0040A1] flex items-center justify-center text-white font-bold text-[12px]">
                                                        {member.full_name?.charAt(0) || 'U'}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-[13px] font-bold text-[#191C1D]">{member.full_name || 'Unknown'}</p>
                                                    <p className="text-[11px] text-[#737785]">{member.role || 'Recruiter'}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-[12px] text-[#737785] italic">No active recruiters</p>
                                    )}
                                </div>
                            </div>

                            {/* Top Sources */}
                            <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-[#E2E8F0]">
                                <h3 className="text-[11px] font-bold text-[#737785] tracking-widest uppercase mb-4">TOP SOURCES</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-[11px] font-bold mb-1">
                                            <span className="text-[#191C1D]">LinkedIn</span>
                                            <span className="text-[#191C1D]">62%</span>
                                        </div>
                                        <div className="h-2 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
                                            <div className="h-full bg-[#0040A1]" style={{ width: '62%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-[11px] font-bold mb-1">
                                            <span className="text-[#191C1D]">Referrals</span>
                                            <span className="text-[#191C1D]">24%</span>
                                        </div>
                                        <div className="h-2 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
                                            <div className="h-full bg-[#0060F0]" style={{ width: '24%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-[11px] font-bold mb-1">
                                            <span className="text-[#191C1D]">Indeed</span>
                                            <span className="text-[#191C1D]">14%</span>
                                        </div>
                                        <div className="h-2 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
                                            <div className="h-full bg-[#5A6376]" style={{ width: '14%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#F1F5F9] rounded-2xl p-6 border border-[#E2E8F0]">
                                <h3 className="text-[11px] font-bold text-[#0040A1] tracking-widest uppercase mb-2">QUICK NOTE</h3>
                                <p className="text-[13px] text-[#737785] italic font-semibold leading-relaxed">
                                    "The candidate pool is exceptionally strong this week. Focus on portfolios with complex design system work."
                                </p>
                            </div>
                        </div>
                    </>
                )}


                {/* JOB DESCRIPTION TAB */}
                {activeTab === 'Job Description' && (
                    <>
                        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                            {/* Editor Toolbar */}
                          {isSuperAdmin && (
                            <div className="flex items-center gap-6 px-6 py-4 border-b border-[#E2E8F0] text-[#191C1D]">
                                <button className="hover:text-[#0040A1] transition-colors"><Bold size={16} /></button>
                                <button className="hover:text-[#0040A1] transition-colors"><Italic size={16} /></button>
                                <button className="hover:text-[#0040A1] transition-colors"><List size={16} /></button>
                                <button className="hover:text-[#0040A1] transition-colors"><LinkIcon size={16} /></button>
                                <div className="w-[1px] h-4 bg-[#E2E8F0]"></div>
                                <button className="text-[13px] font-bold hover:text-[#0040A1] transition-colors">H1</button>
                                <button className="text-[13px] font-bold hover:text-[#0040A1] transition-colors">H2</button>
                            </div>
                          )}
                            
                            <div className="p-8">
                                {job?.description ? (
                                    <>
                                        <div 
                                            className="job-content"
                                            dangerouslySetInnerHTML={{ __html: job.description }}
                                        />
                                        {job.requirements && (
                                            <div className="mt-8 pt-6 border-t border-[#E2E8F0]">
                                                <h2 className="text-2xl font-bold text-[#191C1D] mb-4 font-heading uppercase tracking-tight">Requirements</h2>
                                                <div 
                                                    className="job-content"
                                                    dangerouslySetInnerHTML={{ __html: job.requirements }}
                                                />
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="prose prose-zinc max-w-none text-[#475569] text-[14px] leading-[1.8] font-medium">
                                        <h2 className="text-[20px] font-bold text-[#191C1D] mb-4">About the Role</h2>
                                        <p className="mb-8">
                                            We are seeking a visionary Senior Product Designer to lead the evolution of our core talent ecosystem. In this role, you will be the bridge between complex data architectures and human-centric experiences. You'll work closely with product managers and engineers to craft a platform that feels intuitive, powerful, and exceptionally refined.
                                        </p>

                                        <h2 className="text-[20px] font-bold text-[#191C1D] mb-4">Responsibilities</h2>
                                        <ul className="list-disc pl-5 mb-8 space-y-2">
                                            <li>Define the visual and interaction patterns for our next-generation applicant tracking system.</li>
                                            <li>Conduct deep user research with recruiters and hiring managers to identify friction points.</li>
                                            <li>Create high-fidelity prototypes that demonstrate complex logic and seamless transitions.</li>
                                            <li>Mentor junior designers and contribute to our growing design system library.</li>
                                        </ul>

                                        <h2 className="text-[20px] font-bold text-[#191C1D] mb-4">Requirements</h2>
                                        <ul className="list-disc pl-5 mb-8 space-y-2">
                                            <li>5+ years of experience in product design, preferably in SaaS or enterprise tools.</li>
                                            <li>A portfolio demonstrating expertise in layout, typography, and systemic thinking.</li>
                                            <li>Proficiency in Figma and modern prototyping tools.</li>
                                            <li>Strong communication skills and the ability to articulate design decisions to stakeholders.</li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="lg:col-span-4 space-y-6">
                            {/* Job Details Card */}
                            <div className="bg-[#F8FAFC] rounded-2xl p-8 border border-[#E2E8F0]">
                                <h3 className="text-[11px] font-bold text-[#737785] tracking-widest uppercase mb-6">JOB DETAILS</h3>
                                
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[9px] font-black text-[#737785] tracking-widest uppercase mb-1">SALARY RANGE</p>
                                        <p className="text-[15px] font-bold text-[#191C1D]">{job?.salary_range || '$120k - $160k'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-[#737785] tracking-widest uppercase mb-1">EMPLOYMENT TYPE</p>
                                        <p className="text-[15px] font-bold text-[#191C1D]">{employmentType}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-[#737785] tracking-widest uppercase mb-1">LOCATION</p>
                                        <p className="text-[15px] font-bold text-[#191C1D] flex items-center gap-1.5"><Globe size={14} className="text-[#0040A1]" /> {location}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-[#737785] tracking-widest uppercase mb-1">EXPERIENCE LEVEL</p>
                                        <p className="text-[15px] font-bold text-[#191C1D]">{seniority}</p>
                                    </div>
                                </div>
                            </div>

                             {/* Visibility Card */}
                             <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
                                 <div className="flex items-center justify-between mb-2">
                                     <h3 className="text-[11px] font-bold text-[#737785] tracking-widest uppercase">VISIBILITY</h3>
                                     <span className="px-2 py-0.5 bg-[#F1F5F9] text-[#737785] text-[10px] font-bold rounded uppercase">OFFLINE</span>
                                 </div>
                                 <p className="text-[12px] text-[#737785] italic">This job listing is currently hidden from external boards.</p>
                             </div>

                            {/* AI Tip Block */}
                            <div className="bg-[#0040A1] rounded-2xl p-6 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[40px] -mr-16 -mt-16 pointer-events-none"></div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Globe size={16} /> <span className="text-[15px] font-bold tracking-tight">Nexus AI Tip</span>
                                </div>
                                <p className="text-[12px] text-white/80 leading-relaxed font-medium">
                                    Highlighting specific software like 'Figma' and 'React' in your requirements increases matching scores by 24%.
                                </p>
                            </div>
                        </div>
                    </>
                )}


                {/* TEAM TAB */}
                {activeTab === 'Team' && (
                    <>
                        <div className="col-span-full space-y-10">
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-[20px] font-bold text-[#191C1D]">Hiring Team Members</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {job?.team && job.team.length > 0 ? (
                                        job.team.map((member: any) => (
                                            <div key={member.id} className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
                                                <div className="flex items-start justify-between mb-6">
                                                    <div className="flex items-center gap-3">
                                                        {member.avatar_url ? (
                                                            <img src={member.avatar_url} alt="Avatar" className="w-12 h-12 rounded-xl object-cover" />
                                                        ) : (
                                                            <div className="w-12 h-12 rounded-xl bg-[#0040A1] flex items-center justify-center text-white font-bold text-[18px]">
                                                                {member.full_name?.charAt(0) || 'U'}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <h4 className="text-[16px] font-bold text-[#191C1D]">{member.full_name || 'Unknown'}</h4>
                                                            <p className="text-[12px] text-[#737785]">{member.role || 'Recruiter'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4">
                                                    <span className="text-[9px] font-black tracking-widest text-[#737785] uppercase block mb-2">ACTIVE STATUS</span>
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="px-2 py-1 bg-[#F1F5F9] text-[#475569] text-[10px] font-bold rounded">Evaluating Candidates</span>
                                                        <span className="px-2 py-1 bg-[#F1F5F9] text-[#475569] text-[10px] font-bold rounded">Reviewing</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full rounded-2xl p-12 text-center border-2 border-dashed border-[#E2E8F0] bg-[#F8FAFC]">
                                            <p className="text-[14px] font-bold text-[#191C1D] mb-2">No team members assigned</p>
                                            <p className="text-[12px] text-[#737785]">As candidates are evaluated, their assigned recruiters will appear here.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* QUESTIONNAIRE TAB */}
                {activeTab === 'Questionnaire' && (
                    <div className="col-span-full">
                        {/* Tab Header specific to Questionnaire */}
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 pt-2">
                            <div>
                                <h2 className="text-[28px] font-bold text-[#191C1D] mb-1 tracking-tight">Job Questionnaire</h2>
                                <p className="text-[14px] text-[#475569] font-medium">Standard vetting form for {title} applicants.</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button className="flex items-center gap-2 text-[#0040A1] font-bold text-[13px] hover:bg-[#F8FAFC] px-4 py-2 rounded-lg transition-colors">
                                    <Link2 size={16} /> Copy Link to Questionnaire
                                </button>
                                <button className="flex items-center gap-2 text-[#0040A1] font-bold text-[13px] hover:bg-[#F8FAFC] px-4 py-2 rounded-lg transition-colors">
                                    <Eye size={16} /> Preview Form
                                </button>
                                {isSuperAdmin && (
                                    <button className="flex items-center gap-2 bg-[#0040A1] hover:bg-[#003380] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold shadow-sm transition-colors">
                                        <Edit2 size={16} /> Edit Questionnaire
                                    </button>
                                )}
                                <button className="flex items-center gap-2 bg-[#0040A1] hover:bg-[#003380] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold shadow-sm transition-colors">
                                    <Save size={16} /> Save Questionnaire
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Editor Area (Left 8 cols) */}
                            <div className="lg:col-span-8">
                                <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
                                    {/* Toolbar */}
                                    <div className="flex items-center justify-between px-8 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0]">
                                        <div className="flex items-center gap-6 text-[#191C1D]">
                                            <button className="hover:text-[#0040A1] transition-colors"><Bold size={16} /></button>
                                            <button className="hover:text-[#0040A1] transition-colors"><Italic size={16} /></button>
                                            <button className="hover:text-[#0040A1] transition-colors"><List size={16} /></button>
                                            <button className="hover:text-[#0040A1] transition-colors"><LinkIcon size={16} /></button>
                                        </div>
                                        <span className="text-[10px] font-black text-[#737785] tracking-widest uppercase">EDITING MODE</span>
                                    </div>
                                    
                                    {/* Editor Content Area */}
                                    <div className="p-10 font-serif text-[#191C1D]">
                                        {/* Intro Section */}
                                        <div className="mb-10">
                                            <h3 className="text-[13px] font-black tracking-widest uppercase mb-6 font-sans border-b border-[#E2E8F0] pb-2 text-[#191C1D]">CONTACT INFORMATION</h3>
                                            
                                            <div className="space-y-6">
                                                <div className="flex items-baseline gap-4">
                                                    <span className="font-bold whitespace-nowrap text-[15px]">Name:</span>
                                                    <div className="flex-1 border-b border-[#E2E8F0] h-5"></div>
                                                </div>
                                                <div className="flex items-baseline gap-4">
                                                    <span className="font-bold whitespace-nowrap text-[15px]">Personal email:</span>
                                                    <div className="flex-1 border-b border-[#E2E8F0] h-5"></div>
                                                </div>
                                                <div className="flex items-baseline gap-4">
                                                    <span className="font-bold whitespace-nowrap text-[15px]">Phone:</span>
                                                    <div className="flex-1 border-b border-[#E2E8F0] h-5"></div>
                                                </div>
                                                <div className="flex items-baseline gap-4">
                                                    <span className="font-bold whitespace-nowrap text-[15px]">LinkedIn:</span>
                                                    <div className="flex-1 border-b border-[#E2E8F0] h-5"></div>
                                                </div>
                                                <div className="flex items-baseline gap-4">
                                                    <span className="font-bold whitespace-nowrap text-[15px]">Country:</span>
                                                    <div className="flex-1 border-b border-[#E2E8F0] h-5"></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Questions Section */}
                                        <div>
                                            <h3 className="text-[13px] font-black tracking-widest uppercase mb-6 font-sans border-b border-[#E2E8F0] pb-2 text-[#191C1D]">ABOUT YOUR EXPERIENCE</h3>
                                            
                                            <div className="space-y-10">
                                                {/* Q1 */}
                                                <div>
                                                    <p className="font-bold text-[15px] mb-4 leading-relaxed tracking-tight">
                                                        1. How many years of experience do you have with .NET Development (C#, ASP.NET, .NET Core)? *
                                                    </p>
                                                    <div className="flex items-baseline gap-4">
                                                        <span className="text-[15px]">Answer:</span>
                                                        <div className="flex-1 border-b border-[#E2E8F0]"></div>
                                                    </div>
                                                </div>

                                                {/* Q2 */}
                                                <div className="pt-2">
                                                    <p className="font-bold text-[15px] mb-4 leading-relaxed tracking-tight">
                                                        2. How many years of experience do you have with the following technologies?
                                                    </p>
                                                    <div className="space-y-4 pl-4 text-[15px]">
                                                        <div className="flex items-baseline gap-3">
                                                            <span className="text-[#64748B]">•</span>
                                                            <span className="whitespace-nowrap">SQL Server (Advanced queries, optimization):</span>
                                                            <div className="flex-1 border-b border-[#E2E8F0]"></div>
                                                        </div>
                                                        <div className="flex items-baseline gap-3">
                                                            <span className="text-[#64748B]">•</span>
                                                            <span className="whitespace-nowrap">Microservices Architecture:</span>
                                                            <div className="flex-1 border-b border-[#E2E8F0]"></div>
                                                        </div>
                                                        <div className="flex items-baseline gap-3">
                                                            <span className="text-[#64748B]">•</span>
                                                            <span className="whitespace-nowrap">Frontend Frameworks (React, Angular or similar):</span>
                                                            <div className="flex-1 border-b border-[#E2E8F0]"></div>
                                                        </div>
                                                        <div className="flex items-baseline gap-3">
                                                            <span className="text-[#64748B]">•</span>
                                                            <span className="whitespace-nowrap">Cloud Platforms (Azure/AWS):</span>
                                                            <div className="flex-1 border-b border-[#E2E8F0]"></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Q3 */}
                                                <div className="pt-2">
                                                    <p className="font-bold text-[15px] mb-3 leading-relaxed tracking-tight">
                                                        3. Have you worked as a contractor remotely for international clients? *
                                                    </p>
                                                    <div className="flex items-center gap-6 font-sans text-[14px]">
                                                        <label className="flex items-center gap-2 cursor-pointer"><div className="w-4 h-4 rounded-full border-2 border-[#E2E8F0]"></div> Yes</label>
                                                        <label className="flex items-center gap-2 cursor-pointer"><div className="w-4 h-4 rounded-full border-2 border-[#E2E8F0]"></div> No</label>
                                                    </div>
                                                </div>

                                                {/* Q4 */}
                                                <div className="pt-2">
                                                    <p className="font-bold text-[15px] mb-4 leading-relaxed tracking-tight">
                                                        4. Are you currently working? If yes, please describe your current role. *
                                                    </p>
                                                    <div className="w-full border-b border-dashed border-[#E2E8F0] mt-8"></div>
                                                    <div className="w-full border-b border-dashed border-[#E2E8F0] mt-8"></div>
                                                </div>

                                                {/* Q5 */}
                                                <div className="pt-2">
                                                    <p className="font-bold text-[15px] mb-2 leading-relaxed tracking-tight">
                                                        5. Do you have experience designing or maintaining Microservices?
                                                    </p>
                                                    <p className="text-[13px] text-[#64748B] italic mb-4">
                                                        Please elaborate on your role and the tools used (e.g., Docker, Kubernetes, Service Bus).
                                                    </p>
                                                    <div className="w-full border-b border-dashed border-[#E2E8F0] mt-8"></div>
                                                    <div className="w-full border-b border-dashed border-[#E2E8F0] mt-8"></div>
                                                </div>

                                                {/* Q6 */}
                                                <div className="pt-2">
                                                    <p className="font-bold text-[15px] mb-1 leading-relaxed tracking-tight">
                                                        6. Do you have an advanced level of spoken English (B2 or higher)? *
                                                    </p>
                                                    <p className="text-[9px] font-sans font-black tracking-widest text-[#737785] uppercase mb-4">
                                                        NOTE: A TECHNICAL INTERVIEW IN ENGLISH WILL BE REQUIRED.
                                                    </p>
                                                    <div className="flex items-center gap-6 font-sans text-[14px]">
                                                        <label className="flex items-center gap-2 cursor-pointer"><div className="w-4 h-4 rounded-full border-2 border-[#E2E8F0]"></div> Yes</label>
                                                        <label className="flex items-center gap-2 cursor-pointer"><div className="w-4 h-4 rounded-full border-2 border-[#E2E8F0]"></div> No</label>
                                                    </div>
                                                </div>

                                                {/* Q7 - Box */}
                                                <div className="border border-[#CBD5E1] rounded-lg p-6 my-6 bg-white shadow-sm">
                                                    <p className="font-bold text-[15px] mb-4 leading-relaxed tracking-tight">
                                                        7. The client requires a background check (Criminal Records Certificate) and a drug test. Are you willing to provide/undergo these? *
                                                    </p>
                                                    <div className="flex items-center gap-6 font-sans text-[14px]">
                                                        <label className="flex items-center gap-2 cursor-pointer"><div className="w-4 h-4 rounded-full border-2 border-[#E2E8F0]"></div> Yes</label>
                                                        <label className="flex items-center gap-2 cursor-pointer"><div className="w-4 h-4 rounded-full border-2 border-[#E2E8F0]"></div> No</label>
                                                    </div>
                                                </div>

                                                {/* Q8 */}
                                                <div className="pt-2">
                                                    <p className="font-bold text-[15px] mb-4 leading-relaxed tracking-tight">
                                                        8. Do you have any planned vacations or time off in the next 6 months? *
                                                    </p>
                                                    <div className="flex items-baseline gap-4">
                                                        <span className="text-[15px]">Answer:</span>
                                                        <div className="flex-1 border-b border-[#E2E8F0]"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Area (Right 4 cols) */}
                            <div className="lg:col-span-4 space-y-6">
                                {/* Settings Card */}
                                <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
                                    <div className="flex items-center gap-2 mb-6 text-[#191C1D] font-bold text-[15px]">
                                        <Settings2 size={18} className="text-[#0040A1]" /> Questionnaire Settings
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-[13px] border-b border-[#F1F5F9] pb-4">
                                            <span className="text-[#737785]">Estimated Time</span>
                                            <span className="font-bold text-[#191C1D]">12-15 mins</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[13px] border-b border-[#F1F5F9] pb-4">
                                            <span className="text-[#737785]">Required Questions</span>
                                            <span className="font-bold text-[#191C1D]">8 of 14</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[13px] pt-1">
                                            <span className="text-[#737785]">Language</span>
                                            <span className="font-bold text-[#191C1D] flex items-center gap-1.5"><Globe size={14} /> English (US)</span>
                                        </div>
                                    </div>
                                </div>

                                {/* AI Vetting Card */}
                                <div className="bg-[#0060F0] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
                                    {/* background glow */}
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 blur-3xl rounded-full"></div>
                                    <div className="relative z-10">
                                        <Sparkles size={24} className="mb-4" />
                                        <h3 className="text-[16px] font-bold mb-2">AI-Powered Vetting</h3>
                                        <p className="text-[13px] font-medium leading-relaxed max-w-[90%] text-white/90 mb-6 font-sans">
                                            Let our system automatically rank candidates based on these questionnaire answers to save your team 15+ hours per week.
                                        </p>
                                        <button className="bg-white hover:bg-[#F8FAFC] text-[#0040A1] text-[12px] font-black uppercase tracking-widest px-5 py-3 rounded-lg w-full transition-colors shadow-sm">
                                            ENABLE AUTO-VETTING
                                        </button>
                                    </div>
                                </div>

                                {/* Status Card */}
                                <div className="bg-[#E8F0FF] rounded-2xl p-5 border border-[#D6E3FB] shadow-sm flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#0040A1] shadow-sm shrink-0">
                                        <RefreshCcw size={18} />
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-[#737785] block mb-0.5">STATUS</span>
                                        <span className="text-[14px] font-bold text-[#191C1D]">Draft - Not Live</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
