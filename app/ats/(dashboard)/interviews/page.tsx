'use client';

import React, { useState, useEffect } from 'react';
import { 
    ChevronLeft, ChevronRight, Search, Plus, 
    Video, Users, Info, ArrowUpRight, Loader2
} from 'lucide-react';
import { getUpcomingInterviews, getRecruiters, createInterview, getCandidateNames, getRecruiterJobs, getCombinedInterviews } from '@/app/ats/actions';

export default function InterviewSchedulePage() {
    const [interviews, setInterviews] = useState<any[]>([]);
    const [upcomingInterviews, setUpcomingInterviews] = useState<any[]>([]);
    const [recruiters, setRecruiters] = useState<any[]>([]);
    const [candidates, setCandidates] = useState<any[]>([]);
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isScheduling, setIsScheduling] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const loadData = async () => {
        setLoading(true);
        try {
            const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString();
            const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0, 23, 59, 59).toISOString();
            
            // For now, get the first recruiter to sync with Google
            const [intData, upcomingData, recruiterData, candData, jobData] = await Promise.all([
                getCombinedInterviews('', startOfMonth, endOfMonth), // Hardcoded recruiterId for trial if needed or leave empty
                getUpcomingInterviews(5),
                getRecruiters(),
                getCandidateNames(),
                getRecruiterJobs()
            ]);

            setInterviews(intData);
            setUpcomingInterviews(upcomingData);
            setRecruiters(recruiterData);
            setCandidates(candData);
            setJobs(jobData);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [currentMonth]);

    // Current month view logic - Fixed for November 2024
    const startOffset = 4; // November 1st, 2024 was a Friday
    const days = Array.from({ length: 35 }, (_, i) => i - startOffset + 1);

    const nextInterview = upcomingInterviews[0];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[600px]">
                <Loader2 className="animate-spin text-[#0040A1]" size={40} />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-700 font-inter max-w-[1600px] mx-auto pb-20">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[28px] font-bold text-[#191C1D] tracking-tight">Interview Schedule</h1>
                    <p className="text-[#737785] text-[13px] font-medium mt-1">Manage and sync all candidate evaluations.</p>
                </div>
                
                <div className="flex items-center gap-4">
                    {/* View Switcher - Figma Style */}
                    <div className="flex p-1 bg-[#F1F5F9] rounded-xl border border-[#E2E8F0]">
                        {['Day', 'Week', 'Month'].map((view) => (
                            <button 
                                key={view}
                                className={`px-6 py-2 rounded-lg text-[12px] font-bold transition-all ${
                                    view === 'Month' ? 'bg-white text-[#0040A1] shadow-sm' : 'text-[#737785] hover:text-[#191C1D]'
                                }`}
                            >
                                {view}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8 items-start">
                {/* Left Side: Scheduling Form */}
                <div className="col-span-3 space-y-6 sticky top-8">
                    <div className="bg-white rounded-[32px] border border-[#E2E8F0] shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                            <h3 className="text-[18px] font-bold text-[#191C1D]">Quick Schedule</h3>
                            <p className="text-[12px] text-[#737785] font-medium mt-1">Set up a new session instantly.</p>
                        </div>
                        
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const cId = formData.get('candidate_id') as string;
                            const type = formData.get('type') as string;
                            const date = formData.get('scheduled_at') as string;
                            
                            if (!cId || !date) return;
                            
                            setLoading(true);
                            try {
                                const cand = candidates.find(c => c.id === cId);
                                await createInterview({
                                    candidate_id: cId,
                                    job_id: cand?.job_id || jobs[0]?.id,
                                    recruiter_id: recruiters[0]?.id, // Default to self in future
                                    type,
                                    scheduled_at: new Date(date).toISOString(),
                                });
                                alert('Interview scheduled successfully!');
                                loadData();
                            } catch (err) {
                                console.error(err);
                                alert('Failed to schedule interview.');
                            } finally {
                                setLoading(false);
                            }
                        }} className="p-8 space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#6B7485] uppercase tracking-widest">Candidate</label>
                                <select 
                                    name="candidate_id"
                                    required
                                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 px-4 text-[13px] font-medium outline-none focus:border-[#0040A1] transition-all"
                                >
                                    <option value="">Select candidate...</option>
                                    {candidates.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#6B7485] uppercase tracking-widest">Type</label>
                                <select 
                                    name="type"
                                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 px-4 text-[13px] font-medium outline-none focus:border-[#0040A1] transition-all"
                                >
                                    <option value="Technical">Technical Interview</option>
                                    <option value="Cultural">Cultural Fit</option>
                                    <option value="Final Review">Final Review</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#6B7485] uppercase tracking-widest">Date & Time</label>
                                <input 
                                    name="scheduled_at"
                                    type="datetime-local" 
                                    required
                                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 px-4 text-[13px] font-medium outline-none focus:border-[#0040A1] transition-all" 
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-[#0040A1] text-white rounded-2xl text-[13px] font-bold uppercase tracking-widest hover:bg-[#003380] transition-all shadow-lg shadow-blue-900/10 mt-4 flex items-center justify-center gap-2"
                            >
                                {loading && <Loader2 className="animate-spin" size={16} />}
                                Schedule Event
                            </button>

                            <div className="pt-4 border-t border-[#F1F5F9]">
                                <a 
                                    href="/api/auth/google"
                                    className="w-full py-3 border border-[#E2E8F0] text-[#191C1D] rounded-xl text-[12px] font-bold flex items-center justify-center gap-2 hover:bg-[#F8FAFC] transition-all"
                                >
                                    <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                                    Sync Google Calendar
                                </a>
                            </div>
                        </form>
                    </div>

                    {/* Total Interviews Stats moved here */}
                    <div className="bg-white p-8 rounded-[32px] border border-[#E2E8F0] shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-12 h-12 bg-[#F1F5F9] rounded-2xl flex items-center justify-center text-[#0040A1]">
                                <Users size={22} />
                            </div>
                            <span className="flex items-center gap-1 text-[11px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl uppercase tracking-widest">
                                <ArrowUpRight size={12} strokeWidth={3} />
                                +12%
                            </span>
                        </div>
                        <p className="text-[11px] font-black text-[#6B7485] uppercase tracking-[0.2em] mb-2">Total Interviews</p>
                        <h2 className="text-[42px] font-bold text-[#191C1D] leading-none mb-4">{interviews.length}</h2>
                        <div className="flex items-end gap-1.5 h-12 w-full pt-4">
                            {[4, 7, 5, 8, 5, 9, 7].map((h, i) => (
                                <div key={i} className="flex-1 bg-gradient-to-t from-[#0040A1]/20 to-[#0040A1]/5 rounded-t-lg" style={{ height: `${h * 10}%` }}></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Calendar & Dashboard */}
                <div className="col-span-9 space-y-8">
                    {/* Sub-Header / Filters */}
                    <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-4">
                                <button className="p-2 hover:bg-[#F1F5F9] rounded-lg text-[#737785] transition-colors"><ChevronLeft size={20}/></button>
                                <span className="text-[15px] font-bold text-[#191C1D]">November 2024</span>
                                <button className="p-2 hover:bg-[#F1F5F9] rounded-lg text-[#737785] transition-colors"><ChevronRight size={20}/></button>
                            </div>
                            <div className="h-6 w-px bg-[#E2E8F0]"></div>
                            <button className="px-4 py-2 text-[13px] font-bold text-[#0040A1] hover:bg-[#F1F5F9] rounded-lg transition-all">Today</button>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A5B7]" size={16} />
                                <input 
                                    type="text" 
                                    placeholder="Filter by recruiter..." 
                                    className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 pl-10 pr-4 text-[13px] font-medium outline-none focus:border-[#0040A1] transition-all w-64 shadow-inner"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                        {/* Weekdays Header */}
                        <div className="grid grid-cols-7 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                <div key={day} className="py-4 text-center">
                                    <span className="text-[11px] font-black text-[#6B7485] uppercase tracking-[0.15em]">{day}</span>
                                </div>
                            ))}
                        </div>

                        {/* Grid Cells */}
                        <div className="grid grid-cols-7">
                            {days.map((d, i) => {
                                const isToday = d === 11;
                                const isCurrentMonth = d > 0 && d <= 30;
                                const dayEvents = interviews.filter(e => {
                                    const date = new Date(e.scheduled_at);
                                    return date.getDate() === d;
                                });

                                return (
                                    <div key={i} className={`min-h-[140px] p-2 border-r border-b border-[#F1F5F9] last:border-r-0 relative group transition-colors hover:bg-[#FBFCFD] ${!isCurrentMonth ? 'bg-[#FDFDFD]/50 opacity-40' : ''}`}>
                                        <div className="flex justify-between items-start mb-2 px-2 pt-1">
                                            <span className={`text-[12px] font-bold h-7 w-7 flex items-center justify-center transition-all ${
                                                isToday 
                                                    ? 'bg-[#0040A1] text-white rounded-lg shadow-lg shadow-blue-200' 
                                                    : isCurrentMonth ? 'text-[#191C1D]' : 'text-[#A1A5B7]'
                                            }`}>
                                                {d > 0 && d <= 30 ? d : d <= 0 ? 31 + d : d - 30}
                                            </span>
                                            {isToday && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50 mt-1"></div>}
                                        </div>

                                        <div className="space-y-1.5">
                                            {dayEvents.map((ev: any, idx: number) => (
                                                <div 
                                                    key={idx} 
                                                    className={`p-2 rounded-xl border text-[11px] cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md ${
                                                        ev.type === 'Technical' ? 'bg-[#DAE2FF] border-[#0040A1]/10 text-[#0040A1]' :
                                                        ev.type === 'Cultural' ? 'bg-[#E7F5E8] border-[#0A6624]/10 text-[#0A6624]' :
                                                        'bg-[#FFDAD6] border-[#93001C]/10 text-[#93001C]'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="font-black uppercase tracking-[0.1em] text-[8px] opacity-70">{ev.type}</span>
                                                        <span className="font-bold opacity-80">{new Date(ev.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                    <p className="font-bold truncate leading-tight text-[12px]">{ev.candidate?.full_name || ev.candidate?.first_name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Bottom Intelligence Section - 100% Figma Spec */}
                    <div className="grid grid-cols-12 gap-8 items-stretch">
                        {/* Next Session Hero Card */}
                        <div className="col-span-8 bg-[#0040A1] p-10 rounded-[32px] shadow-2xl shadow-blue-900/20 relative overflow-hidden group min-h-[280px]">
                            <div className="absolute top-0 right-0 p-24 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl animate-pulse"></div>
                            <div className="absolute bottom-0 left-0 p-24 bg-blue-400/10 rounded-full -ml-24 -mb-24 blur-3xl opacity-50"></div>
                            
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                {nextInterview ? (
                                    <>
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <span className="px-4 py-1.5 bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/20 backdrop-blur-md">Next Session</span>
                                                <h3 className="text-[32px] font-bold text-white mt-6 tracking-tight">{nextInterview.candidate?.full_name}</h3>
                                                <div className="flex items-center gap-3 text-blue-100/80 text-[14px] font-medium mt-2">
                                                    <span>{nextInterview.job?.title}</span>
                                                    <span className="w-1 h-1 rounded-full bg-blue-300 opacity-40"></span>
                                                    <span>{nextInterview.type}</span>
                                                    <span className="w-1 h-1 rounded-full bg-blue-300 opacity-40"></span>
                                                    <span className="text-white font-bold bg-[#B3261E] px-2 py-0.5 rounded-lg text-[10px]">
                                                        {new Date(nextInterview.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-white/20 to-white/5 border border-white/30 backdrop-blur-2xl flex items-center justify-center text-white text-3xl font-bold shadow-2xl">
                                                {nextInterview.candidate?.full_name?.[0]}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 mt-12">
                                            <a 
                                                href={nextInterview.video_url || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 py-4 bg-white text-[#0040A1] rounded-2xl text-[14px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#F8FAFC] transition-all active:scale-[0.98] shadow-xl shadow-black/10"
                                            >
                                                <Video size={20} fill="currentColor" />
                                                Launch Video Call
                                            </a>
                                            <button className="w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-2xl flex items-center justify-center transition-all border border-white/20 backdrop-blur-md">
                                                <Info size={24} />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-white/50 border-2 border-dashed border-white/10 rounded-3xl p-8">
                                        <Video size={48} className="mb-4 opacity-20" />
                                        <p className="font-bold">No upcoming sessions</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recruiter Workload */}
                        <div className="col-span-4 bg-white p-8 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col">
                            <p className="text-[11px] font-black text-[#6B7485] uppercase tracking-[0.2em] mb-10">Recruiter Workload</p>
                            <div className="space-y-8 flex-1">
                                {recruiters.slice(0, 3).map((r, i) => {
                                    const count = interviews.filter(int => int.recruiter_id === r.id).length;
                                    return (
                                        <div key={r.id} className="space-y-3">
                                            <div className="flex justify-between items-center text-[13px]">
                                                <span className="font-bold text-[#191C1D]">{r.full_name}</span>
                                                <span className="font-bold text-[#0040A1]">{count} sessions</span>
                                            </div>
                                            <div className="h-2.5 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
                                                <div className={`h-full bg-[#0040A1] rounded-full transition-all duration-1000 ease-out`} style={{ width: `${(count / 10) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {recruiters.length === 0 && <p className="text-[#A1A5B7] text-[12px]">No active recruiters</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Action Button - Opens Modal */}
            {/* Removed as the form is now embedded */}

            {/* ScheduleInterviewModal is no longer rendered as a modal */}
        </div>
    );
}
