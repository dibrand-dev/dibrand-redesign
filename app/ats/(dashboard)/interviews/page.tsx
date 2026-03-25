'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
    ChevronLeft, ChevronRight, Search, Plus, 
    Video, Users, Info, ArrowUpRight, Loader2, Check, ExternalLink, Calendar,
    X
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
    const [successData, setSuccessData] = useState<any | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString();
            const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0, 23, 59, 59).toISOString();
            
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

    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const days = Array.from({ length: 42 }, (_, i) => i - startOffset + 1);

    const nextInterview = upcomingInterviews[0];

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-700 font-inter max-w-[1600px] mx-auto pb-20 relative">
            {/* Success Modal Overlay */}
            {successData && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#191C1D]/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[40px] shadow-2xl max-w-[500px] w-full p-10 text-center relative overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Decorative background blobs */}
                        <div className="absolute top-0 left-0 w-32 h-32 bg-[#0040A1]/5 rounded-full -ml-16 -mt-16 blur-2xl"></div>
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mb-16 blur-2xl"></div>
                        
                        <div className="w-20 h-20 bg-emerald-500 rounded-[28px] flex items-center justify-center text-white mx-auto shadow-xl shadow-emerald-500/20 mb-8 relative">
                             <Check size={40} strokeWidth={3} />
                        </div>

                        <h3 className="text-[28px] font-bold text-[#191C1D] mb-4 tracking-tight">Interview Scheduled!</h3>
                        <p className="text-[#737785] text-[15px] leading-relaxed mb-8">
                            A Google Calendar event has been created for <span className="text-[#191C1D] font-bold">{successData.candidateName}</span>.
                        </p>

                        <div className="space-y-4 mb-10">
                            {successData.meetLink && (
                                <a 
                                    href={successData.meetLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3 w-full py-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl text-[14px] font-bold text-[#0040A1] hover:bg-white hover:border-[#0040A1] transition-all group"
                                >
                                    <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                                    Launch Google Meet
                                    <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            )}
                            <button 
                                onClick={() => setSuccessData(null)}
                                className="w-full py-4 bg-[#0040A1] text-white rounded-2xl text-[14px] font-bold tracking-widest uppercase shadow-xl shadow-blue-900/10 hover:bg-[#003380] transition-all"
                            >
                                Nice! Continue
                            </button>
                        </div>
                        
                        <button 
                            onClick={() => setSuccessData(null)}
                            className="absolute top-6 right-6 p-2 text-[#A1A5B7] hover:text-[#191C1D] transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-[28px] font-bold text-[#191C1D] tracking-tight">Interview Schedule</h1>
                    <p className="text-[#737785] text-[13px] font-medium mt-1">Manage and sync all candidate evaluations.</p>
                </div>
                
                <div className="flex items-center gap-6">
                    <div className="flex p-1 bg-[#F1F5F9] rounded-xl border border-[#E2E8F0]">
                        {['Day', 'Week', 'Month'].map((view) => (
                            <button 
                                key={view}
                                className={`px-6 py-2 rounded-lg text-[13px] font-bold transition-all ${
                                    view === 'Month' ? 'bg-white text-[#0040A1] shadow-sm' : 'text-[#737785] hover:text-[#191C1D]'
                                }`}
                            >
                                {view}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex w-full gap-8 items-start">
                {/* Left Side: Scheduling Form */}
                <div className="w-[30%] min-w-[30%] space-y-8 sticky top-8">
                    <div className="bg-white rounded-[32px] border border-[#E2E8F0] shadow-xl shadow-black/[0.02] overflow-hidden text-[#191C1D]">
                        <div className="p-8 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                            <h3 className="text-[18px] font-bold">Quick Schedule</h3>
                            <p className="text-[12px] text-[#737785] font-medium mt-1.5">Set up a new session instantly.</p>
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
                                const result = await createInterview({
                                    candidate_id: cId,
                                    job_id: cand?.job_id || (jobs.length > 0 ? jobs[0]?.id : null),
                                    recruiter_id: currentRecruiterId || (recruiters.length > 0 ? recruiters[0]?.id : null),
                                    type,
                                    scheduled_at: new Date(date).toISOString(),
                                });
                                
                                setSuccessData({
                                    candidateName: candidates.find(c => c.id === cId)?.name || 'Candidate',
                                    meetLink: (result as any)?.video_url
                                });
                                
                                loadData();
                            } catch (err) {
                                console.error(err);
                                alert('Failed to schedule interview.');
                            } finally {
                                setLoading(false);
                            }
                        }} className="p-8 flex flex-col gap-y-6">
                            <div className="flex flex-col gap-y-2">
                                <label className="text-[10px] font-black text-[#6B7485] uppercase tracking-widest pl-1">Candidate</label>
                                <select 
                                    name="candidate_id"
                                    required
                                    defaultValue={preSelectedCandidate || ""}
                                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl py-4 px-5 text-[13px] font-bold outline-none focus:border-[#0040A1] focus:ring-4 focus:ring-[#0040A1]/5 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="">Select candidate...</option>
                                    {candidates.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-y-2">
                                <label className="text-[10px] font-black text-[#6B7485] uppercase tracking-widest pl-1">Session Type</label>
                                <select 
                                    name="type"
                                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl py-4 px-5 text-[13px] font-bold outline-none focus:border-[#0040A1] focus:ring-4 focus:ring-[#0040A1]/5 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="Technical Interview">Technical Interview</option>
                                    <option value="Cultural Fit">Cultural Fit</option>
                                    <option value="Final Review">Final Review</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-y-2">
                                <label className="text-[10px] font-black text-[#6B7485] uppercase tracking-widest pl-1">Date & Time</label>
                                <input 
                                    name="scheduled_at" 
                                    type="datetime-local" 
                                    required 
                                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl py-4 px-5 text-[13px] font-bold outline-none focus:border-[#0040A1] focus:ring-4 focus:ring-[#0040A1]/5 transition-all" 
                                />
                            </div>

                            <button type="submit" disabled={loading} className="w-full py-3 bg-[#0040A1] text-white rounded-lg text-[14px] font-semibold flex items-center justify-center gap-2 mt-2 hover:bg-[#003380] transition-colors">
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Calendar size={18} />}
                                Schedule Event
                            </button>

                            <div className="pt-6 mt-2 border-t border-[#F1F5F9]">
                                <a href="/api/auth/google" className="w-full py-4 border-2 border-[#E2E8F0] text-[#191C1D] rounded-2xl text-[13px] font-bold flex items-center justify-center gap-3 hover:bg-[#F8FAFC] hover:border-[#0040A1]/20 transition-all group">
                                    <img src="https://www.google.com/favicon.ico" className="w-4 h-4 grayscale group-hover:grayscale-0 transition-all" alt="Google" />
                                    Sync Google Calendar
                                </a>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Side: Calendar & Dashboard */}
                <div className="w-[70%] space-y-10">
                    <div className="flex items-center justify-between bg-white p-6 rounded-[32px] border border-[#E2E8F0] shadow-sm">
                        <span className="text-2xl font-bold text-[#191C1D] text-left px-2">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                        
                        <div className="flex justify-end items-center gap-2 ml-auto">
                            <div className="relative mr-2">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A5B7]" size={18} />
                                <input type="text" placeholder="Search sessions..." className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl py-3 pl-12 pr-6 text-[14px] font-medium outline-none focus:border-[#0040A1] transition-all w-64 shadow-inner" />
                            </div>
                            <button onClick={() => setCurrentMonth(new Date())} className="px-5 py-2.5 text-[14px] font-bold text-[#191C1D] border border-[#E2E8F0] hover:bg-[#F8FAFC] rounded-xl transition-all">Today</button>
                            <div className="flex items-center gap-1 bg-[#F8FAFC] rounded-xl p-1 border border-[#E2E8F0]">
                                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-[#737785] transition-all"><ChevronLeft size={18}/></button>
                                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-[#737785] transition-all"><ChevronRight size={18}/></button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[32px] border border-[#E2E8F0] shadow-xl shadow-black/[0.02] overflow-hidden">
                        <div className="grid grid-cols-7 border-b border-[#E2E8F0] bg-[#F8FAFC]/50">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                <div key={day} className="py-5 text-center">
                                    <span className="text-[11px] font-black text-[#6B7485] uppercase tracking-[0.2em]">{day}</span>
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
                                    <div key={i} className={`min-h-[160px] p-3 border-r border-b border-[#F1F5F9] last:border-r-0 relative group transition-colors hover:bg-[#FBFCFD]/80 ${!isCurrentMonth ? 'bg-[#FDFDFD]/50 opacity-40' : ''}`}>
                                        <div className="flex justify-between items-start mb-4 px-1 pt-1">
                                            <span className={`text-[13px] font-bold h-8 w-8 flex items-center justify-center transition-all ${
                                                isToday && isCurrentMonth
                                                    ? 'bg-[#0040A1] text-white rounded-xl shadow-lg shadow-blue-900/20' 
                                                    : isCurrentMonth ? 'text-[#191C1D]' : 'text-[#A1A5B7]'
                                            }`}>
                                                {isCurrentMonth ? d : d <= 0 ? new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0).getDate() + d : d - daysInMonth}
                                            </span>
                                        </div>
                                        <div className="space-y-3">
                                            {dayEvents.map((ev: any, idx: number) => (
                                                <div 
                                                    key={idx} 
                                                    className={`p-3 rounded-r-lg bg-blue-50 border-l-4 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 flex flex-col gap-1 ${
                                                        ev.isExternal ? 'border-[#A1A5B7]' :
                                                        ev.type?.includes('Technical') ? 'border-blue-500' :
                                                        ev.type?.includes('Cultural') ? 'border-emerald-500' :
                                                        'border-rose-500'
                                                    }`}
                                                >
                                                    <span className={`font-semibold text-[10px] uppercase tracking-wider ${
                                                        ev.isExternal ? 'text-[#A1A5B7]' :
                                                        ev.type?.includes('Technical') ? 'text-[#0040A1]' :
                                                        ev.type?.includes('Cultural') ? 'text-emerald-700' :
                                                        'text-rose-700'
                                                    }`}>{ev.type}</span>
                                                    <p className="font-bold truncate text-[13px] leading-tight text-[#191C1D]">{ev.candidate?.full_name || ev.candidate?.first_name || 'Event'}</p>
                                                    <span className="font-medium text-[11px] text-[#737785]">{new Date(ev.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-8 items-stretch pt-2">
                        <div className="col-span-8 bg-[#0040A1] p-12 rounded-[40px] shadow-2xl shadow-blue-900/30 relative overflow-hidden flex flex-col justify-between min-h-[320px] group">
                            <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse"></div>
                            <div className="absolute bottom-0 left-0 p-32 bg-blue-400/10 rounded-full -ml-28 -mb-28 blur-3xl"></div>
                            
                            {nextInterview ? (
                                <>
                                    <div className="relative z-10">
                                        <span className="px-5 py-2 bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] border border-white/20 backdrop-blur-md">Next Perspective Session</span>
                                        <h3 className="text-[38px] font-bold text-white mt-8 tracking-tight">{nextInterview.candidate?.full_name}</h3>
                                        <div className="flex items-center gap-4 text-white/70 text-[15px] font-medium mt-3">
                                            <span>{nextInterview.job?.title}</span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-300 opacity-40"></span>
                                            <span className="text-white font-bold">{nextInterview.type}</span>
                                            <span className="text-[#0040A1] font-black bg-white px-3 py-1 rounded-xl text-[11px] ml-2 shadow-lg shadow-white/10">
                                                {new Date(nextInterview.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="relative z-10 flex gap-5 mt-14">
                                        <a href={nextInterview.video_url || '#'} target="_blank" rel="noopener noreferrer" className="flex-1 py-5 bg-white text-[#0040A1] rounded-[24px] text-[15px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-3 hover:bg-[#F8FAFC] transition-all shadow-xl shadow-black/20 group-hover:scale-[1.01]">
                                            <Video size={22} fill="currentColor" />
                                            Launch Video Call
                                        </a>
                                        <button className="w-16 h-16 bg-white/10 hover:bg-white/20 text-white rounded-[24px] flex items-center justify-center border border-white/20 backdrop-blur-md transition-all">
                                            <Info size={28} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-white/40 border-2 border-dashed border-white/10 rounded-[32px] p-10 backdrop-blur-sm">
                                    <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6">
                                        <Video size={40} className="opacity-40" />
                                    </div>
                                    <p className="font-bold text-[18px]">No sessions found for today</p>
                                    <p className="text-[13px] opacity-60 mt-2">Check the calendar or schedule a new one.</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="col-span-4 bg-white p-10 rounded-[40px] border border-[#E2E8F0] shadow-xl shadow-black/[0.02] flex flex-col justify-between">
                            <div>
                                <p className="text-[11px] font-black text-[#6B7485] uppercase tracking-[0.25em] mb-12 pl-1">Recruiter Focus</p>
                                <div className="space-y-9">
                                    {recruiters.slice(0, 3).map((r) => {
                                        const count = interviews.filter(int => int.recruiter_id === r.id).length;
                                        const percentage = Math.min((count / 10) * 100, 100);
                                        return (
                                            <div key={r.id} className="space-y-4">
                                                <div className="flex justify-between items-center px-1">
                                                    <span className="font-bold text-[#191C1D] text-[14px]">{r.full_name}</span>
                                                    <span className="font-black text-[#0040A1] text-[12px] bg-[#0040A1]/5 px-3 py-1 rounded-lg">{count} sess.</span>
                                                </div>
                                                <div className="h-3 w-full bg-[#F1F5F9] rounded-full overflow-hidden p-0.5 border border-[#E2E8F0]/30 shadow-inner">
                                                    <div className="h-full bg-gradient-to-r from-[#0040A1] to-[#0040A1]/80 rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="pt-10">
                                <button className="w-full py-4 text-[13px] font-bold text-[#737785] hover:text-[#0040A1] border border-[#E2E8F0] rounded-2xl transition-all">
                                    View Detailed Analytics
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {loading && interviews.length === 0 && (
                <div className="fixed inset-0 bg-white/80 backdrop-blur-xl z-[200] flex flex-col items-center justify-center">
                    <div className="relative">
                        <div className="w-24 h-24 border-8 border-[#F1F5F9] border-t-[#0040A1] rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-6 bg-[#0040A1] rounded-full animate-ping"></div>
                        </div>
                    </div>
                    <p className="mt-8 text-[13px] font-black uppercase tracking-[0.2em] text-[#0040A1]">Syncing Calendar Space...</p>
                </div>
            )}
        </div>
    );
}
