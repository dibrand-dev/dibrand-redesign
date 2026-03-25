'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
    ChevronLeft, ChevronRight, Search, Plus, 
    Video, Users, Info, ArrowUpRight, Loader2
} from 'lucide-react';
import { 
    getUpcomingInterviews, getRecruiters, createInterview, 
    getCandidateNames, getRecruiterJobs, getCombinedInterviews, syncRecruiterProfile 
} from '@/app/ats/actions';

export default function InterviewSchedulePage() {
    const searchParams = useSearchParams();
    const preSelectedCandidate = searchParams.get('candidateId');
    
    const [interviews, setInterviews] = useState<any[]>([]);
    const [upcomingInterviews, setUpcomingInterviews] = useState<any[]>([]);
    const [recruiters, setRecruiters] = useState<any[]>([]);
    const [candidates, setCandidates] = useState<any[]>([]);
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [currentRecruiterId, setCurrentRecruiterId] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString();
            const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0, 23, 59, 59).toISOString();
            
            // Sync/Get profile first
            const rId = await syncRecruiterProfile() || '';
            setCurrentRecruiterId(rId);

            const [intData, upcomingData, recruiterData, candData, jobData] = await Promise.all([
                getCombinedInterviews(rId, startOfMonth, endOfMonth),
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

    // Simple day grid logic
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Adjust for Monday start
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const days = Array.from({ length: 42 }, (_, i) => i - startOffset + 1);

    const nextInterview = upcomingInterviews[0];

    if (loading && interviews.length === 0) {
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
                    <div className="bg-white rounded-[32px] border border-[#E2E8F0] shadow-sm overflow-hidden text-[#191C1D]">
                        <div className="p-8 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                            <h3 className="text-[18px] font-bold">Quick Schedule</h3>
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
                                    recruiter_id: currentRecruiterId || recruiters[0]?.id,
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
                                    defaultValue={preSelectedCandidate || ""}
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
                                    <option value="Technical Interview">Technical Interview</option>
                                    <option value="Cultural Fit">Cultural Fit</option>
                                    <option value="Final Review">Final Review</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#6B7485] uppercase tracking-widest">Date & Time</label>
                                <input name="scheduled_at" type="datetime-local" required className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 px-4 text-[13px] font-medium outline-none focus:border-[#0040A1] transition-all" />
                            </div>

                            <button type="submit" disabled={loading} className="w-full py-4 bg-[#0040A1] text-white rounded-2xl text-[13px] font-bold uppercase tracking-widest hover:bg-[#003380] transition-all shadow-lg shadow-blue-900/10 mt-4 flex items-center justify-center gap-2">
                                {loading && <Loader2 className="animate-spin" size={16} />}
                                Schedule Event
                            </button>

                            <div className="pt-4 border-t border-[#F1F5F9]">
                                <a href="/api/auth/google" className="w-full py-3 border border-[#E2E8F0] text-[#191C1D] rounded-xl text-[12px] font-bold flex items-center justify-center gap-2 hover:bg-[#F8FAFC] transition-all">
                                    <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                                    Sync Google Calendar
                                </a>
                            </div>
                        </form>
                    </div>

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

                {/* Right Side: Calendar Section */}
                <div className="col-span-9 space-y-8">
                    <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="p-2 hover:bg-[#F1F5F9] rounded-lg text-[#737785] transition-colors"><ChevronLeft size={20}/></button>
                            <span className="text-[15px] font-bold text-[#191C1D] min-w-[140px] text-center">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="p-2 hover:bg-[#F1F5F9] rounded-lg text-[#737785] transition-colors"><ChevronRight size={20}/></button>
                        </div>
                        <div className="h-6 w-px bg-[#E2E8F0]"></div>
                        <button onClick={() => setCurrentMonth(new Date())} className="px-4 py-2 text-[13px] font-bold text-[#0040A1] hover:bg-[#F1F5F9] rounded-lg transition-all">Today</button>
                        <div className="flex items-center gap-3 ml-auto">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A5B7]" size={16} />
                                <input type="text" placeholder="Filter by recruiter..." className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 pl-10 pr-4 text-[13px] font-medium outline-none focus:border-[#0040A1] transition-all w-64 shadow-inner" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                        <div className="grid grid-cols-7 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                <div key={day} className="py-4 text-center">
                                    <span className="text-[11px] font-black text-[#6B7485] uppercase tracking-[0.15em]">{day}</span>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7">
                            {days.map((d, i) => {
                                const isCurrentMonth = d > 0 && d <= daysInMonth;
                                const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
                                const isToday = new Date().toDateString() === dateObj.toDateString();
                                const dayEvents = interviews.filter(e => {
                                    const date = new Date(e.scheduled_at);
                                    return date.getDate() === d && date.getMonth() === currentMonth.getMonth() && date.getFullYear() === currentMonth.getFullYear();
                                });

                                return (
                                    <div key={i} className={`min-h-[140px] p-2 border-r border-b border-[#F1F5F9] last:border-r-0 relative group transition-colors hover:bg-[#FBFCFD] ${!isCurrentMonth ? 'bg-[#FDFDFD]/50 opacity-40' : ''}`}>
                                        <div className="flex justify-between items-start mb-2 px-2 pt-1 font-inter">
                                            <span className={`text-[12px] font-bold h-7 w-7 flex items-center justify-center transition-all ${
                                                isToday && isCurrentMonth
                                                    ? 'bg-[#0040A1] text-white rounded-lg shadow-lg' 
                                                    : isCurrentMonth ? 'text-[#191C1D]' : 'text-[#A1A5B7]'
                                            }`}>
                                                {isCurrentMonth ? d : d <= 0 ? new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0).getDate() + d : d - daysInMonth}
                                            </span>
                                        </div>
                                        <div className="space-y-1.5 px-1">
                                            {dayEvents.map((ev: any, idx: number) => (
                                                <div 
                                                    key={idx} 
                                                    className={`p-2 rounded-xl border text-[11px] cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm ${
                                                        ev.type?.includes('Technical') ? 'bg-[#DAE2FF] border-[#0040A1]/10 text-[#0040A1]' :
                                                        ev.type?.includes('Cultural') ? 'bg-[#E7F5E8] border-[#0A6624]/10 text-[#0A6624]' :
                                                        'bg-[#FFDAD6] border-[#93001C]/10 text-[#93001C]'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between mb-0.5">
                                                        <span className="font-extrabold uppercase text-[7px] tracking-wider opacity-80">{ev.type}</span>
                                                        <span className="font-medium text-[9px]">{new Date(ev.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                    <p className="font-bold truncate text-[11px]">{ev.candidate?.full_name || ev.candidate?.first_name || 'Event'}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-8 items-stretch">
                        <div className="col-span-8 bg-[#0040A1] p-10 rounded-[32px] shadow-2xl shadow-blue-900/20 relative overflow-hidden flex flex-col justify-between min-h-[280px]">
                            <div className="absolute top-0 right-0 p-24 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl animate-pulse"></div>
                            {nextInterview ? (
                                <>
                                    <div className="relative z-10">
                                        <span className="px-4 py-1.5 bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/20">Next Session</span>
                                        <h3 className="text-[32px] font-bold text-white mt-6">{nextInterview.candidate?.full_name}</h3>
                                        <div className="flex items-center gap-3 text-blue-100/80 text-[14px] font-medium mt-2">
                                            <span>{nextInterview.job?.title}</span>
                                            <span className="w-1 h-1 rounded-full bg-blue-300 opacity-40"></span>
                                            <span>{nextInterview.type}</span>
                                            <span className="text-white font-bold bg-[#B3261E] px-2 py-0.5 rounded-lg text-[10px] ml-2">
                                                {new Date(nextInterview.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="relative z-10 flex gap-4 mt-12">
                                        <a href={nextInterview.video_url || '#'} target="_blank" rel="noopener noreferrer" className="flex-1 py-4 bg-white text-[#0040A1] rounded-2xl text-[14px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#F8FAFC] transition-all shadow-xl shadow-black/10">
                                            <Video size={20} fill="currentColor" />
                                            Launch Video Call
                                        </a>
                                        <button className="w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-md">
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
                                                <div className="h-full bg-[#0040A1] rounded-full transition-all" style={{ width: `${Math.min((count / 10) * 100, 100)}%` }}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
