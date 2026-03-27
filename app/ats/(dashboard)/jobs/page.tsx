'use client';

import React from 'react';
import { 
    MapPin, 
    Clock, 
    MoreVertical, 
    Briefcase, 
    Search, 
    ChevronDown, 
    TrendingUp, 
    Play,
    Plus
} from 'lucide-react';
import Link from 'next/link';
import { getRecruiterJobs } from '../../actions';

interface Job {
    id: string;
    title: string;
    title_es?: string;
    location?: string;
    location_es?: string;
    salary_range?: string;
    seniority?: string;
    status: string; // 'Open', 'Paused', 'Closed', 'Draft'
    department?: string;
    type?: string; // 'Full-time', 'Part-time', etc.
    countsByStatus: {
        new: number;
        interviewing: number;
        offer: number;
        total: number;
    };
    posted_at?: string;
    days_open?: number;
    totalCandidatesCount: number; // total candidates assigned to this job
    avatars: string[];
}

export default function AtsJobsPage() {
    const [jobs, setJobs] = React.useState<Job[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [activeTab, setActiveTab] = React.useState('All Jobs');

    React.useEffect(() => {
        const fetchJobs = async () => {
            const data = await getRecruiterJobs();
            // Transform data as needed to match the UI expectations
            const transformed : Job[] = data.map((j: any) => ({
                ...j,
                status: j.is_active ? 'Open' : 'Paused', // Fallback
                department: j.industry || 'ENGINEERING', // Map from DB
                type: j.employment_type?.replace('_', ' ') || 'Full-time',
                posted_at: j.created_at,
                days_open: Math.floor((Date.now() - new Date(j.created_at).getTime()) / (1000 * 60 * 60 * 24)) || 0,
            }));
            const sorted = transformed.sort((a, b) => new Date(b.posted_at!).getTime() - new Date(a.posted_at!).getTime());
            setJobs(sorted);
            setLoading(false);
        };
        fetchJobs();
    }, []);

    const tabs = ['All Jobs', 'Drafts', 'Archived'];
    
    // Derived stats
    const activeSearchesCount = jobs.filter(j => j.status === 'Open').length;

    const filteredJobs = jobs.filter(job => {
        if (activeTab === 'All Jobs') return true;
        if (activeTab === 'Drafts') return job.status === 'Paused';
        if (activeTab === 'Archived') return job.status === 'Closed' || job.status === 'Archived'; 
        return true;
    });

    return (
        <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header & Tabs Row */}
            <div className="flex flex-col gap-6 mb-8">
                <div className="flex items-end justify-between border-b border-[#E2E8F0]">
                    <div className="flex items-center gap-12">
                        <h1 className="text-[28px] font-bold text-[#191C1D] tracking-tight pb-4">Job Openings</h1>
                        <div className="flex items-center gap-8 h-full">
                            {tabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`text-[14px] font-bold tracking-tight pb-4 transition-all relative ${
                                        activeTab === tab ? 'text-[#0040A1]' : 'text-[#737785] hover:text-[#191C1D]'
                                    }`}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <div className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#0040A1] rounded-full"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <FilterButton label="DEPARTMENT" value="All Departments" />
                        <FilterButton label="LOCATION" value="Remote & Office" />
                        <FilterButton label="STATUS" value="Active" />
                    </div>

                    {/* Summary Box */}
                    <div className="bg-[#F1F5F9] rounded-xl px-5 py-3 flex items-center gap-3 border border-transparent hover:border-[#E2E8F0] transition-all cursor-default">
                        <div className="w-8 h-8 bg-[#0040A1] rounded-lg flex items-center justify-center">
                            <TrendingUp size={16} className="text-white" />
                        </div>
                        <div className="flex items-center gap-2">
                             <span className="text-[13px] font-semibold text-[#737785]">Showing</span>
                             <span className="text-[14px] font-bold text-[#191C1D]">{activeSearchesCount} Active Searches</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
                {loading ? (
                    Array(4).fill(0).map((_, i) => <JobSkeleton key={i} />)
                ) : (
                    <>
                        {filteredJobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                        {/* If no jobs, show placeholder or create new */}
                        {filteredJobs.length === 0 && (
                             <div className="col-span-full py-32 flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-[#E2E8F0] text-[#737785]">
                                 <Briefcase size={48} className="mb-4 opacity-20" />
                                 <p className="font-semibold">No jobs found matches your criteria</p>
                             </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function FilterButton({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-[#737785] tracking-widest pl-1">{label}</span>
            <button className="flex items-center gap-6 px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[13px] font-semibold text-[#191C1D] hover:bg-[#F8FAFC] transition-all min-w-[200px] justify-between group">
                {value}
                <ChevronDown size={16} className="text-[#737785] group-hover:text-[#0040A1] transition-transform group-hover:translate-y-0.5" />
            </button>
        </div>
    );
}

function JobCard({ job }: { job: Job }) {
    const isPaused = job.status === 'Paused';
    
    return (
        <div className={`rounded-3xl p-8 transition-all duration-300 relative group overflow-hidden h-fit ${
            isPaused 
            ? 'bg-[#F8FAFC] border-2 border-dashed border-[#E2E8F0] opacity-80' 
            : 'bg-white border border-[#E2E8F0] hover:shadow-2xl hover:shadow-[#0040A1]/5 hover:translate-y-[-4px]'
        }`}>
            {/* Header Content */}
            <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-[#E8F0FF] text-[#0040A1] text-[10px] font-black tracking-widest rounded-lg uppercase">
                    {job.department || 'ENGINEERING'}
                </span>
                <button className="p-1.5 text-[#737785] hover:bg-slate-50 hover:text-[#191C1D] rounded-full transition-all">
                    <MoreVertical size={20} />
                </button>
            </div>

            <Link href={`/ats/jobs/${job.id}`}>
                    <h3 className="text-[22px] font-bold text-[#191C1D] mb-4 group-hover:text-[#0040A1] transition-colors">
                        {(() => {
                            const fullTitle = job.title_es || job.title || '';
                            const maxChars = 40;
                            return fullTitle.length > maxChars ? `${fullTitle.slice(0, maxChars - 3)}...` : fullTitle;
                        })()}
                    </h3>
            </Link>

            <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-1.5 text-[#737785]">
                    <MapPin size={16} />
                    <span className="text-[13px] font-semibold">{job.location_es || job.location || 'Remote'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#737785]">
                    <Clock size={16} />
                    <span className="text-[13px] font-semibold">{job.type || 'Full-time'}</span>
                </div>
            </div>

            {/* Pipeline Section */}
            <div className="bg-[#F8FAFC] rounded-2xl p-6 relative">
                 <div className="flex items-center justify-between mb-6">
                    {/* Avatars */}
                    {job.avatars && job.avatars.length > 0 ? (
                        <div className="flex -space-x-3 overflow-hidden">
                            {job.avatars.map((url: string, idx: number) => (
                                <img
                                    key={idx}
                                    className="inline-block h-10 w-10 rounded-full ring-4 ring-[#F8FAFC] object-cover"
                                    src={url}
                                    alt="Candidate"
                                />
                            ))}
                            {job.totalCandidatesCount > job.avatars.length && (
                                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#E2E8F0] text-[11px] font-bold text-[#737785] ring-4 ring-[#F8FAFC]">
                                    +{job.totalCandidatesCount - job.avatars.length}
                                </div>
                            )}
                        </div>
                    ) : null}
                    <span className="text-[9px] font-black tracking-widest text-[#737785] uppercase">Candidate Pipeline</span>
                 </div>

                 <div className="grid grid-cols-3 gap-4 border-t border-[#E2E8F0] pt-6">
                    <PipelineStat label="NEW" count={job.countsByStatus.new} />
                    <PipelineStat label="INTERVIEWING" count={job.countsByStatus.interviewing} />
                    <PipelineStat label="OFFER" count={job.countsByStatus.offer} />
                 </div>
            </div>

            {/* Footer Row */}
            {!isPaused ? (
                 <div className="mt-8 pt-8 flex items-center justify-between border-t border-[#F1F5F9]">
                        <span className="text-[12px] font-medium text-[#737785] flex items-center gap-1.5">
                            <span>Posted {job.days_open || 0} days ago</span>
                            <span className="w-1 h-1 bg-[#E2E8F0] rounded-full" />
                            <span>Days Open: {Math.max(0, 30 - (job.days_open || 0))}</span>
                        </span>
                    <div className="flex items-center gap-3">
                        <button className="px-5 py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0040A1] text-[13px] font-bold rounded-xl transition-all">
                            Edit
                        </button>
                        <Link href={`/ats/jobs/${job.id}`} className="px-5 py-2.5 bg-[#0040A1] hover:bg-[#003380] text-white text-[13px] font-bold rounded-xl transition-all shadow-lg shadow-[#0040A1]/10">
                            View Candidates
                        </Link>
                    </div>
                 </div>
            ) : (
                <div className="mt-6 border-t border-[#E2E8F0] pt-6">
                    <div className="flex items-center gap-2 mb-4 text-[#737785]">
                         <div className="w-8 h-8 rounded-full bg-[#E2E8F0] flex items-center justify-center">
                            <Play size={14} fill="currentColor" />
                         </div>
                         <span className="text-[14px] font-bold">Status: Paused</span>
                    </div>
                    <div className="flex items-center justify-between">
                         <span className="text-[12px] font-medium text-[#737785]">Paused 1 day ago • Days Open: 45</span>
                         <button className="px-6 py-2.5 bg-[#E1E7EF] hover:bg-[#D1D5DB] text-[#475569] text-[13px] font-bold rounded-xl transition-all">
                            Resume Search
                        </button>
                    </div>
                </div>
            )}

            {/* Background elements to match the "Paused" feel */}
            {isPaused && (
                <div className="absolute inset-0 bg-white/10 pointer-events-none"></div>
            )}
        </div>
    );
}

function PipelineStat({ label, count }: { label: string, count: number }) {
    return (
        <div className="flex flex-col items-center gap-1">
            <span className="text-[20px] font-black text-[#191C1D]">{count}</span>
            <span className="text-[9px] font-black text-[#737785] tracking-widest uppercase">{label}</span>
        </div>
    );
}

function JobSkeleton() {
    return (
        <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 animate-pulse">
            <div className="flex justify-between mb-6">
                <div className="h-6 w-20 bg-slate-100 rounded-lg"></div>
                <div className="h-6 w-6 bg-slate-100 rounded-full"></div>
            </div>
            <div className="h-8 w-64 bg-slate-100 rounded-lg mb-4"></div>
            <div className="h-5 w-40 bg-slate-100 rounded-lg mb-8"></div>
            <div className="h-32 bg-slate-50 rounded-2xl mb-8"></div>
            <div className="flex justify-between items-center">
                <div className="h-5 w-32 bg-slate-50 rounded-lg"></div>
                <div className="flex gap-3">
                    <div className="h-10 w-20 bg-slate-50 rounded-xl"></div>
                    <div className="h-10 w-32 bg-slate-100 rounded-xl"></div>
                </div>
            </div>
        </div>
    );
}
