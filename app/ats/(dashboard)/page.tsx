import { getRecruiterStats, getRecentCandidates, getRecruiterJobs } from '../actions';
import { Users, Calendar, TrendingUp, LayoutGrid, AlertTriangle, Clock, ArrowRight, Activity, Zap, Briefcase, CheckCircle2, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

export default async function AtsDashboard() {
    const statsData = await getRecruiterStats();
    const recentCandidatesData = await getRecentCandidates();
    
    const counts = statsData?.counts || { Total: 0 };
    const staleCount = statsData?.staleCount || 0;
    const activeJobsCount = statsData?.activeJobsCount || 0;
    const hiredCount = statsData?.hiredCount || 0;

    const stats = [
        { label: 'Active Jobs', count: activeJobsCount, icon: Briefcase, color: 'text-[#0040A1]', bg: 'bg-[#DAE2FF]', trend: 'Active' },
        { label: 'Total Candidates', count: counts.Total || 0, icon: Users, color: 'text-[#0040A1]', bg: 'bg-[#D6E3FB]', trend: 'All Time' },
        { label: 'Interviews', count: counts['Interview'] || 0, icon: Calendar, color: 'text-[#B3261E]', bg: 'bg-[#FFDAD6]', trend: 'Ongoing' },
        { label: 'Hired', count: hiredCount, icon: CheckCircle2, color: 'text-[#0040A1]', bg: 'bg-[#DAE2FF]', trend: 'Total' }
    ];

    const funnelStages = [
        { label: 'APPLIED', count: counts['Applied'] || 0 },
        { label: 'SCREENING', count: counts['Screening'] || 0 },
        { label: 'INTERVIEW', count: counts['Interview'] || 0 },
        { label: 'OFFER', count: counts['Offered'] || 0 },
        { label: 'HIRED', count: hiredCount }
    ];

    const jobs = await getRecruiterJobs();
    const recentJobs = jobs.slice(0, 5);

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-6">
                            <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform shadow-sm`}>
                                <stat.icon size={22} />
                            </div>
                            <span className="text-[11px] font-bold text-[#737785] flex items-center gap-1 uppercase tracking-wider">
                                {stat.trend}
                            </span>
                        </div>
                        <p className="text-[13px] font-medium text-[#737785] mb-1">{stat.label}</p>
                        <h4 className="text-3xl font-bold text-[#191C1D] tracking-tight">{stat.count.toLocaleString()}</h4>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Content Modules */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Hiring Funnel Card */}
                    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-8 group">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h3 className="text-xl font-bold text-[#191C1D] mb-1">Hiring Funnel</h3>
                                <p className="text-[13px] text-[#737785]">Real-time candidate progression</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-5 gap-4 pt-8 border-t border-[#F1F5F9]">
                            {funnelStages.map((stage) => (
                                <div key={stage.label} className="text-center group/stage">
                                    <p className="text-[11px] font-bold text-[#737785] uppercase tracking-wider mb-2">{stage.label}</p>
                                    <h5 className="text-2xl font-bold text-[#191C1D]">{stage.count}</h5>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Job Postings Table */}
                    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden group">
                        <div className="p-6 border-b border-[#F1F5F9] flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-[#191C1D] mb-0.5">Active Job Postings</h3>
                                <p className="text-[13px] text-[#737785]">Managing recruitment for your roles</p>
                            </div>
                            <Link href="/ats/jobs" className="px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-semibold text-[#191C1D] hover:bg-[#F8FAFC] transition-colors shadow-sm">
                                View All
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#F8FAFC] text-[11px] font-bold text-[#737785] uppercase tracking-wider border-b border-[#E2E8F0]">
                                    <tr>
                                        <th className="px-6 py-4">Role & Department</th>
                                        <th className="px-6 py-4">Applicants</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Target</th>
                                        <th className="px-6 py-4 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#F1F5F9]">
                                    {recentJobs.length > 0 ? recentJobs.map((job: any) => (
                                        <tr key={job.id} className="hover:bg-[#F8FAFC] transition-colors cursor-pointer group/row">
                                            <td className="px-6 py-5">
                                                <p className="text-[14px] font-semibold text-[#191C1D]">{job.title}</p>
                                                <p className="text-[12px] text-[#737785]">{job.department}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[14px] font-semibold text-[#191C1D]">{job.totalCandidatesCount}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="px-3 py-1 bg-[#D6E3FB] text-[#0040A1] text-[11px] font-bold rounded-full border border-[#E2E8F0]">
                                                    {job.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-[13px] text-[#737785]">{job.target_hires} Hires</p>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button className="text-[#C4C7CF] hover:text-[#191C1D] transition-colors"><MoreHorizontal size={20} /></button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-20 text-center text-[#737785] text-[14px]">
                                                No active job postings found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Modules */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-[13px] font-bold text-[#191C1D] uppercase tracking-wider">Today's Schedule</h4>
                        </div>
                        
                        <div className="py-20 text-center border-2 border-dashed border-[#F1F5F9] rounded-2xl">
                             <Calendar size={32} className="mx-auto text-[#E2E8F0] mb-4" strokeWidth={1.5} />
                             <p className="text-[13px] font-medium text-[#737785] px-8">No interviews scheduled in the system for today.</p>
                        </div>
                        
                        <div className="mt-6 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                             <div className="flex items-start gap-4">
                                 <div className="w-10 h-10 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center text-[#0040A1] shadow-sm">
                                      <Activity size={20} />
                                 </div>
                                 <div className="flex-1">
                                     <p className="text-[14px] font-bold text-[#191C1D]">System Sync Complete</p>
                                     <p className="text-[12px] text-[#737785] mb-2 font-medium">All talent data is up to date.</p>
                                 </div>
                             </div>
                        </div>
                    </div>

                    <div className="bg-[#191C1D] rounded-xl p-8 text-white relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#0040A1]/30 rounded-full blur-[40px] -mr-16 -mt-16"></div>
                        <div className="relative z-10">
                            <h5 className="text-xl font-bold mb-3">Talent Pool Status</h5>
                            <p className="text-[13px] text-[#E2E8F0] mb-6 leading-relaxed opacity-80">You currently have {counts.Total || 0} candidates in your database.</p>
                            <Link href="/ats/candidates" className="w-full flex items-center justify-center py-3 bg-[#0040A1] hover:bg-[#003380] text-white rounded-xl text-[13px] font-semibold transition-all shadow-lg">
                                Manage Candidates <ArrowRight size={16} className="ml-2" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


