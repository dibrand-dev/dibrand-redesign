'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    ChevronLeft, ChevronRight, Search, Plus,
    Video, Users, Info, ArrowUpRight, Loader2, Check, ExternalLink, Calendar,
    X, Bell, CalendarX, Ban, TrendingUp, LineChart
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
    const [currentView, setCurrentView] = useState<'Día'|'Semana'|'Mes'>('Mes');
    const [selectedDate, setSelectedDate] = useState(new Date());

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

            setInterviews(intData || []);
            setUpcomingInterviews(upcomingData || []);
            setRecruiters(recruiterData || []);
            setCandidates(candData || []);
            setJobs(jobData || []);
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
    // Monday as start of week: 
    // Sunday is 0 -> 6. Monday is 1 -> 0. Tuesday 2 -> 1
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    // Display full 5 or 6 weeks depending on offset (usually 6 weeks max = 42 days)
    const days = Array.from({ length: 42 }, (_, i) => i - startOffset + 1);

    const nextInterview = upcomingInterviews[0];

    return (
        <div className="bg-white font-body text-slate-900 -m-10 min-h-[calc(100vh-80px)] flex flex-col pt-0">
            {/* Page Title Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between px-10 pt-10 pb-8">
                <div>
                    <h2 className="font-headline font-extrabold text-[28px] tracking-tight text-slate-900 mb-1">Interview Schedule</h2>
                    <p className="text-[13px] text-slate-500 font-medium">Manage your talent acquisition timeline</p>
                </div>
                
                <div className="flex items-center gap-6 mt-6 md:mt-0">
                    {/* Toggle Group: Día, Semana, Mes */}
                    <div className="flex bg-slate-50 p-1 rounded-xl">
                        <button onClick={() => setCurrentView('Día')} className={`px-6 py-2 text-[13px] rounded-lg transition-colors ${currentView === 'Día' ? 'font-bold bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] text-blue-600' : 'font-semibold text-slate-500 hover:text-blue-600'}`}>Día</button>
                        <button onClick={() => setCurrentView('Semana')} className={`px-6 py-2 text-[13px] rounded-lg transition-colors ${currentView === 'Semana' ? 'font-bold bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] text-blue-600' : 'font-semibold text-slate-500 hover:text-blue-600'}`}>Semana</button>
                        <button onClick={() => setCurrentView('Mes')} className={`px-6 py-2 text-[13px] rounded-lg transition-colors ${currentView === 'Mes' ? 'font-bold bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] text-blue-600' : 'font-semibold text-slate-500 hover:text-blue-600'}`}>Mes</button>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                className="pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-blue-600 w-64 outline-none transition-all placeholder:text-slate-400 text-slate-800" 
                                placeholder="Filter by recruiter..." 
                                type="text" 
                            />
                        </div>
                    </div>
                </div>
            </div>

            {currentView === 'Mes' && (
                <section className="px-10 pb-12 flex-1 flex flex-col min-h-0">
                    <div className="grid grid-cols-7 mb-4">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                           <div key={day} className="text-center text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">{day}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 flex-1 auto-rows-[minmax(140px,1fr)] bg-slate-200 rounded-[28px] overflow-hidden gap-[1px] border border-slate-200 shadow-sm">
                        {days.map((d, i) => {
                            const isCurrentMonth = d > 0 && d <= daysInMonth;
                            const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
                            const isToday = new Date().toDateString() === dateObj.toDateString();
                            const dayEvents = interviews.filter(e => {
                                const date = new Date(e.scheduled_at);
                                return date.getDate() === d && date.getMonth() === currentMonth.getMonth() && date.getFullYear() === currentMonth.getFullYear();
                            });

                            const displayDate = isCurrentMonth 
                                ? d 
                                : d <= 0 
                                    ? new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0).getDate() + d 
                                    : d - daysInMonth;

                            if (!isCurrentMonth) {
                                return (
                                    <div key={i} className="bg-slate-50 p-4 opacity-70">
                                        <span className="text-[12px] font-medium text-slate-400">{displayDate < 10 ? `0${displayDate}` : displayDate}</span>
                                    </div>
                                );
                            }

                            const hasEvents = dayEvents.length > 0;
                            const dayTextColor = isToday || hasEvents ? 'text-blue-600 font-bold' : 'text-slate-900 font-bold';

                            return (
                                <div key={i} onClick={() => { setSelectedDate(dateObj); setCurrentView('Día'); }} className={`bg-white transition-colors p-4 hover:bg-slate-50 flex flex-col min-h-[140px] relative cursor-pointer ${isToday ? 'ring-inset ring-2 ring-blue-500/10' : ''}`}>
                                    <span className={`text-[12px] mb-3 leading-none ${dayTextColor}`}>
                                        {displayDate < 10 ? `0${displayDate}` : displayDate} {isToday && '(Today)'}
                                    </span>
                                    
                                    {hasEvents && (
                                        <div className="space-y-2 flex-1 flex flex-col">
                                            {dayEvents.slice(0, 2).map((ev: any, idx: number) => {
                                                const isTechnical = ev.type?.toLowerCase().includes('technical');
                                                const isCultural = ev.type?.toLowerCase().includes('cultural');
                                                const isFinal = ev.type?.toLowerCase().includes('final');
                                                const candidateName = ev.candidate?.full_name || ev.candidate?.first_name || 'Event';
                                                const timeString = new Date(ev.scheduled_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                                                
                                                let bgClass = "bg-emerald-50 border-emerald-500";
                                                let titleClass = "text-emerald-900";
                                                let timeClass = "text-emerald-700";

                                                if (isTechnical || ev.type === 'Google') {
                                                    bgClass = "bg-blue-50 border-blue-600";
                                                    titleClass = "text-blue-900";
                                                    timeClass = "text-blue-700";
                                                } else if (isCultural) {
                                                    bgClass = "bg-slate-100 border-slate-400";
                                                    titleClass = "text-slate-900";
                                                    timeClass = "text-slate-600";
                                                } else if (isFinal) {
                                                    bgClass = "bg-red-50 border-red-500";
                                                    titleClass = "text-red-900";
                                                    timeClass = "text-red-700";
                                                }

                                                return (
                                                    <div key={idx} className={`p-2 rounded-lg border-l-4 ${bgClass} hover:shadow-sm hover:-translate-y-[1px] transition-all`}>
                                                        <p className={`text-[11px] font-bold ${titleClass} truncate leading-tight`}>
                                                            {candidateName}
                                                        </p>
                                                        <p className={`text-[9px] font-medium mt-0.5 ${timeClass} truncate`} suppressHydrationWarning>
                                                            {timeString} • {ev.type === 'Google' ? 'Google' : ev.type?.split(' ')[0]}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                            
                                            {dayEvents.length > 2 && (
                                                <div className="mt-auto py-1.5 rounded-md bg-slate-100 text-[10px] font-bold text-center text-slate-500 hover:bg-slate-200 transition-colors">
                                                    +{dayEvents.length - 2} more events
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {currentView === 'Día' && (
                <section className="px-10 pb-12 flex-1 flex flex-col min-h-0">
                    <div className="bg-white rounded-[28px] border border-slate-200 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col flex-1">
                        {/* Day Header */}
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex flex-col items-center justify-center text-blue-600 shadow-inner">
                                    <span className="text-[10px] font-bold uppercase tracking-wider">{selectedDate.toLocaleString('en-US', { weekday: 'short' })}</span>
                                    <span className="text-xl font-black leading-none">{selectedDate.getDate()}</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-extrabold text-slate-900">{selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                                    <p className="text-[13px] font-medium text-slate-500 mt-0.5">Today's Schedule View</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); setSelectedDate(d); }} className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-white hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"><ChevronLeft size={18} /></button>
                                <button onClick={() => setSelectedDate(new Date())} className="px-5 py-2 bg-white border border-slate-200 rounded-xl text-[13px] font-bold text-slate-700 shadow-sm hover:text-blue-600 hover:border-blue-200 transition-all">Today</button>
                                <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); setSelectedDate(d); }} className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-white hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"><ChevronRight size={18} /></button>
                            </div>
                        </div>
                        
                        {/* Day Timeline */}
                        <div className="flex-1 overflow-y-auto p-2 pb-10 relative">
                            {Array.from({ length: 13 }, (_, i) => i + 7).map(hour => {
                                const ampm = hour >= 12 ? 'PM' : 'AM';
                                const displayHour = hour > 12 ? hour === 12 ? 12 : hour - 12 : hour;
                                const timeLabel = `${displayHour}:00 ${ampm}`;

                                const hourEvents = interviews.filter(e => {
                                    const evDate = new Date(e.scheduled_at);
                                    return evDate.getDate() === selectedDate.getDate() && evDate.getMonth() === selectedDate.getMonth() && evDate.getFullYear() === selectedDate.getFullYear() && evDate.getHours() === hour;
                                });

                                return (
                                    <div key={hour} className="flex min-h-[90px] group">
                                        <div className="w-24 flex flex-col items-end pr-6 text-[12px] font-bold text-slate-400 group-hover:text-blue-600 transition-colors pt-4">
                                            {timeLabel}
                                        </div>
                                        <div className="flex-1 border-t border-slate-100 relative pb-2 group-hover:border-blue-100 transition-colors">
                                            {hourEvents.length === 0 && (
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-slate-300 font-medium pt-4 pl-4">No events scheduled</div>
                                            )}
                                            
                                            {hourEvents.length > 0 && (
                                                <div className="flex flex-col gap-3 mt-4 pl-4 pr-10">
                                                    {hourEvents.map((ev: any, idx: number) => {
                                                            const isTechnical = ev.type?.toLowerCase().includes('technical');
                                                            const isCultural = ev.type?.toLowerCase().includes('cultural');
                                                            const isFinal = ev.type?.toLowerCase().includes('final');
                                                            const candidateName = ev.candidate?.full_name || ev.candidate?.first_name || 'Event';
                                                            
                                                            let bgClass = "bg-emerald-50 border-emerald-500";
                                                            let titleClass = "text-emerald-900";
                                                            let timeClass = "text-emerald-700";

                                                            if (isTechnical || ev.type === 'Google') {
                                                                bgClass = "bg-blue-50 border-blue-600";
                                                                titleClass = "text-blue-900";
                                                                timeClass = "text-blue-700";
                                                            } else if (isCultural) {
                                                                bgClass = "bg-slate-100 border-slate-400";
                                                                titleClass = "text-slate-900";
                                                                timeClass = "text-slate-600";
                                                            } else if (isFinal) {
                                                                bgClass = "bg-red-50 border-red-500";
                                                                titleClass = "text-red-900";
                                                                timeClass = "text-red-700";
                                                            }

                                                            return (
                                                                <div key={idx} className={`p-4 rounded-xl border-l-[4px] ${bgClass} hover:shadow-md hover:-translate-y-[2px] transition-all cursor-pointer flex justify-between items-center`}>
                                                                    <div>
                                                                        <p className={`text-[14px] font-extrabold ${titleClass} leading-tight`}>
                                                                            {candidateName}
                                                                        </p>
                                                                        <p className={`text-[12px] font-semibold mt-1.5 ${timeClass}`} suppressHydrationWarning>
                                                                            {new Date(ev.scheduled_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} — {new Date(new Date(ev.scheduled_at).getTime() + (ev.duration_minutes || 60) * 60000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} • {ev.type === 'Google' ? 'Google Meet Entry' : ev.type}
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        {ev.video_url && (
                                                                            <a href={ev.video_url} target="_blank" rel="noopener noreferrer" className={`w-9 h-9 rounded-full bg-white flex items-center justify-center ${titleClass} hover:scale-110 shadow-sm transition-transform`}>
                                                                                <Video size={16} />
                                                                            </a>
                                                                        )}
                                                                        <div className={`w-9 h-9 rounded-full bg-white flex items-center justify-center ${timeClass} font-black text-[11px] shadow-sm`}>
                                                                            {candidateName.charAt(0)}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {currentView === 'Semana' && (
                <section className="px-10 pb-12 flex-1 flex flex-col min-h-0">
                    <div className="bg-white rounded-[28px] border border-slate-200 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col flex-1">
                        {/* Week Header */}
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-extrabold text-slate-900">
                                        {(() => {
                                            const start = new Date(selectedDate);
                                            const day = start.getDay();
                                            start.setDate(start.getDate() - day + (day === 0 ? -6 : 1));
                                            const end = new Date(start);
                                            end.setDate(start.getDate() + 6);
                                            
                                            // Format nicely
                                            if (start.getMonth() === end.getMonth()) {
                                                return `${start.toLocaleDateString('en-US', { month: 'long' })} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`;
                                            } else {
                                                return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
                                            }
                                        })()}
                                    </h3>
                                    <p className="text-[13px] font-medium text-slate-500 mt-0.5">Week Schedule View</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() - 7); setSelectedDate(d); }} className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-white hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"><ChevronLeft size={18} /></button>
                                <button onClick={() => setSelectedDate(new Date())} className="px-5 py-2 bg-white border border-slate-200 rounded-xl text-[13px] font-bold text-slate-700 shadow-sm hover:text-blue-600 hover:border-blue-200 transition-all">Today</button>
                                <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() + 7); setSelectedDate(d); }} className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-white hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"><ChevronRight size={18} /></button>
                            </div>
                        </div>
                        
                        {/* Week Grid Header */}
                        <div className="flex border-b border-slate-200 bg-slate-50/30">
                            <div className="w-16 sm:w-20 border-r border-slate-100 flex-shrink-0"></div>
                            {Array.from({ length: 7 }).map((_, i) => {
                                const d = new Date(selectedDate);
                                const day = d.getDay();
                                const diff = d.getDate() - day + (day === 0 ? -6 : 1) + i;
                                const weekDay = new Date(d.setDate(diff));
                                const isToday = weekDay.toDateString() === new Date().toDateString();
                                
                                return (
                                    <div key={i} onClick={() => { setSelectedDate(weekDay); setCurrentView('Día'); }} className="flex-1 py-3 border-r border-slate-100 flex flex-col items-center justify-center cursor-pointer hover:bg-white transition-colors group">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isToday ? 'text-blue-600' : 'text-slate-500'}`}>{weekDay.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                        <div className={`mt-1 w-8 h-8 flex items-center justify-center rounded-full text-[15px] transition-colors ${isToday ? 'bg-blue-600 text-white font-black shadow-md' : 'text-slate-900 font-extrabold group-hover:bg-slate-200'}`}>
                                            {weekDay.getDate()}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Week Timeline */}
                        <div className="flex-1 overflow-y-auto relative bg-slate-50/10 min-h-[400px]">
                            {Array.from({ length: 12 }, (_, i) => i + 8).map(hour => {
                                const ampm = hour >= 12 ? 'PM' : 'AM';
                                const displayHour = hour > 12 ? hour === 12 ? 12 : hour - 12 : hour;
                                const timeLabel = `${displayHour}:00`;

                                return (
                                    <div key={hour} className="flex min-h-[85px] group/row">
                                        {/* Time Axis */}
                                        <div className="w-16 sm:w-20 flex-shrink-0 border-r border-b border-slate-100 flex flex-col items-center justify-start pt-2 bg-slate-50/50 group-hover/row:bg-white transition-colors">
                                            <span className="text-[11px] font-bold text-slate-400 group-hover/row:text-blue-600 transition-colors">{timeLabel}</span>
                                            <span className="text-[9px] font-bold text-slate-300">{ampm}</span>
                                        </div>
                                        
                                        {/* Week Days Grid */}
                                        {Array.from({ length: 7 }).map((_, dayIndex) => {
                                            const d = new Date(selectedDate);
                                            const day = d.getDay();
                                            const diff = d.getDate() - day + (day === 0 ? -6 : 1) + dayIndex;
                                            const weekDayDate = new Date(d.setDate(diff));

                                            const hourEvents = interviews.filter(e => {
                                                const evDate = new Date(e.scheduled_at);
                                                return evDate.getDate() === weekDayDate.getDate() && evDate.getMonth() === weekDayDate.getMonth() && evDate.getFullYear() === weekDayDate.getFullYear() && evDate.getHours() === hour;
                                            });

                                            return (
                                                <div key={dayIndex} className="flex-1 border-r border-b border-slate-100/70 relative p-1.5 hover:bg-slate-50/50 transition-colors flex flex-col gap-1.5 group/cell">
                                                    {hourEvents.map((ev: any, idx: number) => {
                                                        const isTechnical = ev.type?.toLowerCase().includes('technical');
                                                        const isCultural = ev.type?.toLowerCase().includes('cultural');
                                                        const isFinal = ev.type?.toLowerCase().includes('final');
                                                        const candidateName = ev.candidate?.first_name || ev.candidate?.full_name?.split(' ')[0] || 'Event';
                                                        
                                                        let bgClass = "bg-emerald-50 border-emerald-500 text-emerald-900";
                                                        
                                                        if (isTechnical || ev.type === 'Google') {
                                                            bgClass = "bg-blue-50 border-blue-600 text-blue-900";
                                                        } else if (isCultural) {
                                                            bgClass = "bg-slate-100 border-slate-400 text-slate-900";
                                                        } else if (isFinal) {
                                                            bgClass = "bg-red-50 border-red-500 text-red-900";
                                                        }

                                                        return (
                                                            <div key={idx} className={`p-1.5 rounded-lg border-l-[3px] ${bgClass} hover:-translate-y-[1px] hover:shadow-md shadow-sm transition-all cursor-pointer`} title={ev.candidate?.full_name}>
                                                                <p className="text-[10px] xl:text-[11px] font-bold leading-tight truncate">
                                                                    {candidateName}
                                                                </p>
                                                                <p className="text-[9px] font-semibold opacity-80 mt-0.5 truncate" suppressHydrationWarning>
                                                                    {new Date(ev.scheduled_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                                </p>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Schedule Intelligence */}
            <section className="px-10 pb-20">
                <h3 className="font-headline font-bold text-lg mb-6 flex items-center gap-2 text-slate-900">
                    <LineChart className="text-blue-600" size={24} />
                    Schedule Intelligence
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-slate-50 rounded-[24px] flex flex-col justify-between h-44">
                        <span className="text-label text-sm font-semibold text-slate-500">Total Interviews</span>
                        <div>
                            <span className="font-headline text-[52px] font-black text-blue-600 leading-none">{interviews.length}</span>
                            <p className="text-[12px] text-slate-500 mt-2 flex items-center gap-1 font-medium">
                                <TrendingUp size={14} />
                                +12% from last month
                            </p>
                        </div>
                    </div>
                    
                    <div className="p-6 bg-[#0040A1] text-white rounded-[24px] flex flex-col justify-between h-44 shadow-lg shadow-blue-900/10">
                        <span className="text-label text-sm font-semibold opacity-80">Next Session</span>
                        {nextInterview ? (
                            <>
                                <div>
                                    <p className="font-bold text-xl leading-tight">{nextInterview.candidate?.full_name}</p>
                                    <p className="text-[13px] opacity-90 mt-1" suppressHydrationWarning>
                                        {nextInterview.job?.title} • {new Date(nextInterview.scheduled_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <a 
                                    href={nextInterview.video_url || '#'} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="bg-white/20 hover:bg-white/30 transition-colors py-2 rounded-xl text-sm font-bold backdrop-blur-sm text-center block mt-2"
                                >
                                    Launch Video Call
                                </a>
                            </>
                        ) : (
                             <div>
                                <p className="font-bold text-xl">No Sessions</p>
                                <p className="text-sm opacity-90 mt-1">Take a break</p>
                             </div>
                        )}
                    </div>
                    
                    <div className="p-6 bg-slate-50 rounded-[24px] h-44 flex flex-col justify-between overflow-hidden relative">
                        <div className="relative z-10">
                            <span className="text-label text-sm font-semibold text-slate-500">Recruiter Workload</span>
                            <div className="mt-6 flex -space-x-3">
                                {recruiters.slice(0, 3).map((r, idx) => (
                                    <div key={idx} className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs ring-2 ring-white z-10 relative">
                                        {r.full_name?.charAt(0) || 'R'}
                                    </div>
                                ))}
                                {recruiters.length > 3 && (
                                     <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold ring-2 ring-white text-slate-500 relative z-0">
                                        +{recruiters.length - 3}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Floating Action Button (for Scheduling) */}
            <button className="fixed bottom-10 right-10 w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group">
                <Plus className="text-3xl group-hover:rotate-90 transition-transform duration-300" size={32} />
            </button>
        </div>
    );
}
