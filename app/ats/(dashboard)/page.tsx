import React from 'react';
import { getRecruiterStats, getRecentCandidates } from '../actions';
import { Users, Calendar, TrendingUp, LayoutGrid, AlertTriangle, Clock, ArrowRight, Activity, Zap, Briefcase, CheckCircle2, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

export default async function AtsDashboard() {
    const statsData = await getRecruiterStats();
    const recentCandidatesData = await getRecentCandidates();
    
    // Fallback if null (e.g. database not migrated yet or unauth)
    const counts = statsData?.counts || { Total: 0 };
    const staleCount = statsData?.staleCount || 0;

    const stats = [
        { label: 'Active Jobs', count: 24, icon: Briefcase, color: 'text-[#0040A1]', bg: 'bg-[#DAE2FF]', trend: '+12%' },
        { label: 'Total Candidates', count: 1284, icon: Users, color: 'text-[#0040A1]', bg: 'bg-[#D6E3FB]', trend: '+8%' },
        { label: 'Interviews', count: 8, icon: Calendar, color: 'text-[#B3261E]', bg: 'bg-[#FFDAD6]', trend: 'Today' },
        { label: 'Hired', count: 11, icon: CheckCircle2, color: 'text-[#0040A1]', bg: 'bg-[#DAE2FF]', trend: 'Monthly' }
    ];

    const funnelStages = [
        { label: 'APPLIED', count: 482 },
        { label: 'SCREENING', count: 312 },
        { label: 'INTERVIEW', count: 124 },
        { label: 'OFFER', count: 18 },
        { label: 'HIRED', count: 11 }
    ];

    const schedule = [
        { name: 'Alex Rivera', role: 'Senior Frontend Engineer', type: 'TECHNICAL', time: '10:30 AM', color: 'bg-[#0040A1]' },
        { name: 'Maya Thompson', role: 'Product Marketing Lead', type: 'CULTURAL', time: '01:45 PM', color: 'bg-[#6750A4]' }
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Stats Grid - Exact Figma Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} 
                         className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-6">
                            <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform shadow-sm`}>
                                <stat.icon size={22} />
                            </div>
                            <span className="text-[11px] font-bold text-[#737785] flex items-center gap-1">
                                {stat.trend} <TrendingUp size={12} />
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
                                <p className="text-[13px] text-[#737785]">Candidate progression across all active roles</p>
                            </div>
                            <div className="px-3 py-1.5 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg text-[11px] font-bold text-[#737785]">
                                Last 30 Days
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
                                <h3 className="text-lg font-bold text-[#191C1D] mb-0.5">Recent Job Postings</h3>
                                <p className="text-[13px] text-[#737785]">Managing recruitment for active departments</p>
                            </div>
                            <button className="px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-semibold text-[#191C1D] hover:bg-[#F8FAFC] transition-colors shadow-sm">
                                View Archive
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#F8FAFC] text-[11px] font-bold text-[#737785] uppercase tracking-wider border-b border-[#E2E8F0]">
                                    <tr>
                                        <th className="px-6 py-4">Role & Department</th>
                                        <th className="px-6 py-4">Applicants</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Recruiter</th>
                                        <th className="px-6 py-4">Posted</th>
                                        <th className="px-6 py-4 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#F1F5F9]">
                                    <tr className="hover:bg-[#F8FAFC] transition-colors cursor-pointer group/row">
                                        <td className="px-6 py-5">
                                            <p className="text-[14px] font-semibold text-[#191C1D]">UX Design Lead</p>
                                            <p className="text-[12px] text-[#737785]">Product & Design</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[14px] font-semibold text-[#191C1D]">42</span>
                                                <span className="px-1.5 py-0.5 bg-[#D6E3FB] text-[#0040A1] text-[10px] font-bold rounded">+4 new</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="px-3 py-1 bg-[#D6E3FB] text-[#0040A1] text-[11px] font-bold rounded-full border border-[#E2E8F0]">Interviewing</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-slate-200 text-[10px] font-bold flex items-center justify-center text-slate-600 border border-white">SJ</div>
                                                <span className="text-[13px] font-medium text-[#191C1D]">Sarah Jenkins</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-[13px] text-[#737785]">Oct 12, 2023</p>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button className="text-[#C4C7CF] hover:text-[#191C1D] transition-colors"><MoreHorizontal size={20} /></button>
                                        </td>
                                    </tr>
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
                            <button className="text-[12px] font-bold text-[#0040A1] hover:underline">View All</button>
                        </div>
                        
                        <div className="space-y-3">
                            {schedule.map((item) => (
                                <div key={item.name} className="p-4 bg-[#F8FAFC] hover:bg-white hover:shadow-md transition-all rounded-xl border border-transparent hover:border-[#E2E8F0] relative overflow-hidden">
                                     <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.color}`}></div>
                                     <div className="flex items-center justify-between mb-2">
                                         <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${item.type === 'TECHNICAL' ? 'bg-[#DAE2FF] text-[#0040A1]' : 'bg-[#EADDFF] text-[#21005D]'}`}>
                                             {item.type}
                                         </span>
                                         <span className="text-[11px] font-medium text-[#737785]">{item.time}</span>
                                     </div>
                                     <p className="text-[14px] font-bold text-[#191C1D] mb-1">{item.name}</p>
                                     <p className="text-[12px] text-[#737785] mb-3">{item.role}</p>
                                     <div className="flex items-center gap-2">
                                         <div className="w-6 h-6 rounded-full bg-slate-200 border border-white"></div>
                                         <span className="text-[11px] text-[#737785]">With Team Lead • Room 4B</span>
                                     </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-6 p-4 rounded-xl border-2 border-dashed border-[#E2E8F0] cursor-pointer hover:bg-[#F8FAFC] transition-colors">
                             <div className="flex items-start gap-3">
                                 <div className="w-10 h-10 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center text-[#737785]">
                                      <Zap size={20} />
                                 </div>
                                 <div>
                                     <p className="text-[14px] font-bold text-[#191C1D]">Review Offer: David Chen</p>
                                     <p className="text-[11px] text-[#737785] font-semibold">Priority High • Due by 5pm</p>
                                 </div>
                             </div>
                        </div>
                    </div>

                    <div className="bg-[#191C1D] rounded-xl p-8 text-white relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#0040A1]/30 rounded-full blur-[40px] -mr-16 -mt-16"></div>
                        <div className="relative z-10">
                            <h5 className="text-xl font-bold mb-3">Talent Intelligence</h5>
                            <p className="text-[13px] text-[#E2E8F0] mb-6 leading-relaxed opacity-80">Data-driven matching and AI-powered screening tools.</p>
                            <button className="w-full py-3 bg-[#0040A1] hover:bg-[#003380] text-white rounded-xl text-[13px] font-semibold transition-all shadow-lg active:scale-95">
                                Try AI Matching
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


