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
    CheckCircle2, Globe, Plus, Clock, MessageSquare
} from 'lucide-react';

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
                            <button className="px-5 py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0040A1] text-[13px] font-bold rounded-xl transition-all flex items-center gap-2">
                                <Share2 size={16} /> Share Job
                            </button>
                            <button className="px-5 py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0040A1] text-[13px] font-bold rounded-xl transition-all flex items-center gap-2">
                                <Edit2 size={16} /> Edit
                            </button>
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
                            <div className="bg-[#D6E3FB] p-4 flex flex-col justify-between -ml-6 skew-x-[-10deg] border-l border-white/20 z-30">
                                <div className="skew-x-[10deg] flex flex-col h-full justify-between pl-4">
                                    <span className="text-[10px] font-bold text-[#0040A1] tracking-widest uppercase">OFFER</span>
                                    <span className="text-[28px] font-bold text-[#0040A1] leading-none">{job?.stats?.offerCount || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Tabs Row */}
            <div className="flex items-center gap-8 border-b border-[#E2E8F0] mb-8">
                {['Candidates', 'Job Description', 'Team', 'Settings'].map(tab => (
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
                                    return (
                                        <div key={candidate.id} className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-[#0040A1] flex items-center justify-center text-white font-bold text-[18px]">
                                                    {candidate.first_name.charAt(0)}{candidate.last_name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="text-[15px] font-bold text-[#191C1D] mb-1">{shortName}</h4>
                                                    <p className="text-[13px] text-[#737785]">Applied {timeAgo} • Candidate</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="px-3 py-1 bg-[#E2E8F0] text-[#0040A1] text-[9px] font-black tracking-widest rounded-full uppercase">
                                                    {candidate.status || 'NEW'}
                                                </span>
                                                <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#F8FAFC] text-[#0040A1] hover:bg-[#E2E8F0] transition-colors">
                                                    <CalendarIcon size={16} />
                                                </button>
                                                <Link href={`/ats/candidates?cv=${candidate.id}`} className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#F8FAFC] text-[#0040A1] hover:bg-[#E2E8F0] transition-colors">
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
                            <div className="flex items-center gap-6 px-6 py-4 border-b border-[#E2E8F0] text-[#191C1D]">
                                <button className="hover:text-[#0040A1] transition-colors"><Bold size={16} /></button>
                                <button className="hover:text-[#0040A1] transition-colors"><Italic size={16} /></button>
                                <button className="hover:text-[#0040A1] transition-colors"><List size={16} /></button>
                                <button className="hover:text-[#0040A1] transition-colors"><LinkIcon size={16} /></button>
                                <div className="w-[1px] h-4 bg-[#E2E8F0]"></div>
                                <button className="text-[13px] font-bold hover:text-[#0040A1] transition-colors">H1</button>
                                <button className="text-[13px] font-bold hover:text-[#0040A1] transition-colors">H2</button>
                            </div>
                            
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
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-[11px] font-bold text-[#737785] tracking-widest uppercase">VISIBILITY</h3>
                                    <Globe size={16} className="text-[#0040A1]" />
                                </div>
                                
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 bg-[#0077B5] rounded flex items-center justify-center text-white font-bold text-[10px]">in</div>
                                            <span className="text-[13px] font-bold text-[#191C1D]">LinkedIn</span>
                                        </div>
                                        <span className="px-2 py-0.5 bg-[#E8F0FF] text-[#0040A1] text-[9px] font-black tracking-widest rounded uppercase flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#0040A1]"></span> LIVE
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 bg-[#0CAA41] rounded flex items-center justify-center text-white font-bold text-[10px]">G</div>
                                            <span className="text-[13px] font-bold text-[#191C1D]">Glassdoor</span>
                                        </div>
                                        <span className="px-2 py-0.5 bg-[#E8F0FF] text-[#0040A1] text-[9px] font-black tracking-widest rounded uppercase flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#0040A1]"></span> LIVE
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 bg-[#2164F4] rounded flex items-center justify-center text-white font-bold text-[10px]">I</div>
                                            <span className="text-[13px] font-bold text-[#191C1D]">Indeed</span>
                                        </div>
                                        <span className="px-2 py-0.5 bg-[#E8F0FF] text-[#0040A1] text-[9px] font-black tracking-widest rounded uppercase flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#0040A1]"></span> LIVE
                                        </span>
                                    </div>
                                    
                                    <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[#E2E8F0] rounded-xl text-[#737785] text-[12px] font-bold hover:bg-[#F8FAFC] hover:text-[#0040A1] hover:border-[#0040A1]/30 transition-colors mt-2">
                                        <Plus size={14} /> Add More Channels
                                    </button>
                                </div>
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
            </div>
        </div>
    );
}
