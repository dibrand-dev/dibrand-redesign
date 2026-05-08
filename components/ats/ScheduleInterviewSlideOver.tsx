'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    Phone, Video, Users, Lock, Calendar, Clock, ChevronDown,
    Search, Check, Loader2, UserPlus, VideoIcon, X
} from 'lucide-react';
import SlideOver from '@/components/ui/SlideOver';
import { createInterview, getRecruitersForScheduling, type Attendee } from '@/app/ats/(dashboard)/interviews/actions';

interface Candidate {
    id: string;
    full_name?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    avatar_url?: string;
    job_id?: string;
}

const TYPE_MAP: Record<string, string> = {
    'Call': 'Cultural',
    'Interview': 'Technical',
    'Meeting': 'Final Review',
    'Internal': 'Case Study',
};

function InitialAvatar({ name, className }: { name: string; className?: string }) {
    const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    return (
        <div className={`flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-[12px] ${className}`}>
            {initials}
        </div>
    );
}

export default function ScheduleInterviewSlideOver({
    candidate,
    recruiterId,
    open,
    onClose,
}: {
    candidate: Candidate;
    recruiterId: string | null;
    open: boolean;
    onClose: () => void;
}) {
    const router = useRouter();
    const candidateName = candidate.full_name ||
        [candidate.first_name, candidate.last_name].filter(Boolean).join(' ') || 'Candidate';

    // Form state
    const [eventType, setEventType] = useState('Interview');
    const [title, setTitle] = useState(`${TYPE_MAP['Interview']} Interview – ${candidateName}`);
    const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState('14:00');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<{ meetLink?: string; error?: string } | null>(null);

    // Attendees
    const [availableRecruiters, setAvailableRecruiters] = useState<Attendee[]>([]);
    const [selectedAttendees, setSelectedAttendees] = useState<Attendee[]>([]);
    const [recruiterSearch, setRecruiterSearch] = useState('');
    const [showRecruiterPicker, setShowRecruiterPicker] = useState(false);
    const [loadingRecruiters, setLoadingRecruiters] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTitle(`${TYPE_MAP[eventType] || eventType} Interview – ${candidateName}`);
    }, [eventType, candidateName]);

    useEffect(() => {
        if (open) {
            setLoadingRecruiters(true);
            getRecruitersForScheduling().then(data => {
                setAvailableRecruiters(data);
                setLoadingRecruiters(false);
            });
        }
    }, [open]);

    useEffect(() => {
        function handleOutside(e: MouseEvent) {
            if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
                setShowRecruiterPicker(false);
            }
        }
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, []);

    // Reset state when closed
    useEffect(() => {
        if (!open) {
            setResult(null);
            setSelectedAttendees([]);
            setNotes('');
            setRecruiterSearch('');
        }
    }, [open]);

    const toggleAttendee = (recruiter: Attendee) => {
        setSelectedAttendees(prev =>
            prev.some(a => a.id === recruiter.id)
                ? prev.filter(a => a.id !== recruiter.id)
                : [...prev, recruiter]
        );
    };

    const filteredRecruiters = availableRecruiters.filter(r =>
        r.full_name.toLowerCase().includes(recruiterSearch.toLowerCase()) ||
        r.email.toLowerCase().includes(recruiterSearch.toLowerCase())
    );

    const handleCreate = async () => {
        if (!date || !time) return;
        setIsSubmitting(true);
        setResult(null);
        try {
            const scheduledAt = new Date(`${date}T${time}:00`).toISOString();
            const res = await createInterview({
                candidate_id: candidate.id,
                recruiter_id: recruiterId,
                job_id: candidate.job_id,
                scheduled_at: scheduledAt,
                duration_minutes: 60,
                type: TYPE_MAP[eventType] || 'Technical',
                notes,
                additional_attendees: selectedAttendees.map(a => ({
                    email: a.email,
                    name: a.full_name,
                })),
            });
            setResult({ meetLink: res.video_url || undefined });
            router.refresh();
            if (!res.video_url) {
                onClose();
            }
        } catch (error: any) {
            console.error('Failed to create interview:', error);
            setResult({ error: error?.message || 'Failed to schedule interview.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Success screen ─────────────────────────────────────────────────────────
    if (result?.meetLink && open) {
        return (
            <SlideOver open={open} onClose={onClose} title="¡Entrevista agendada!">
                <div className="flex flex-col items-center justify-center gap-6 text-center p-10 min-h-[60vh]">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                        <Check size={32} className="text-emerald-600" strokeWidth={3} />
                    </div>
                    <div>
                        <h2 className="text-[20px] font-black text-slate-900">¡Listo!</h2>
                        <p className="text-[13px] text-slate-500 mt-2 font-medium max-w-[320px] mx-auto">
                            Los asistentes recibirán una invitación de Google Calendar con el link de reunión.
                        </p>
                    </div>
                    <a
                        href={result.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-[#0B4FEA] text-white rounded-xl text-[13px] font-bold shadow-md shadow-blue-600/20 hover:bg-blue-800 transition-all"
                    >
                        <VideoIcon size={16} /> Abrir Google Meet
                    </a>
                    <button onClick={onClose} className="text-[12px] text-slate-400 hover:text-slate-700 font-medium underline">
                        Cerrar panel
                    </button>
                </div>
            </SlideOver>
        );
    }

    return (
        <SlideOver open={open} onClose={onClose} title="Schedule Interview" subtitle={candidateName}>
            <div className="p-6 space-y-6">
                {/* EVENT TYPE */}
                <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Event Type</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {(['Call', 'Interview', 'Meeting', 'Internal'] as const).map(type => {
                            const Icon = type === 'Call' ? Phone : type === 'Interview' ? Video : type === 'Meeting' ? Users : Lock;
                            const active = eventType === type;
                            return (
                                <button
                                    key={type}
                                    onClick={() => setEventType(type)}
                                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-bold transition-all shadow-sm ${active ? 'bg-[#0B4FEA] text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'}`}
                                >
                                    <Icon size={15} fill={active ? 'currentColor' : 'none'} /> {type}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* TITLE */}
                <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Event Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-[14px] font-semibold rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow"
                    />
                </div>

                {/* DATE & TIME */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Date</label>
                        <div className="relative">
                            <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B4FEA] pointer-events-none" />
                            <input
                                type="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 text-slate-900 text-[13px] font-bold rounded-lg pl-11 pr-4 py-3 outline-none cursor-pointer focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Time</label>
                        <div className="relative">
                            <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B4FEA] pointer-events-none" />
                            <input
                                type="time"
                                value={time}
                                onChange={e => setTime(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 text-slate-900 text-[13px] font-bold rounded-lg pl-11 pr-10 py-3 outline-none cursor-pointer focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            />
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* ATTENDEES */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Attendees</label>
                        <div className="relative" ref={pickerRef}>
                            <button
                                type="button"
                                onClick={() => setShowRecruiterPicker(p => !p)}
                                className="flex items-center gap-1.5 text-[12px] font-bold text-[#0B4FEA] hover:text-blue-800 transition-colors"
                            >
                                <UserPlus size={14} strokeWidth={3} /> Add team member
                            </button>
                            {showRecruiterPicker && (
                                <div className="absolute right-0 top-8 w-[280px] bg-white rounded-[14px] shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                                    <div className="p-3 border-b border-slate-100">
                                        <div className="relative">
                                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                autoFocus
                                                type="text"
                                                placeholder="Search by name or email..."
                                                value={recruiterSearch}
                                                onChange={e => setRecruiterSearch(e.target.value)}
                                                className="w-full pl-9 pr-3 py-2 text-[12px] bg-slate-50 rounded-lg outline-none border border-slate-100 focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="max-h-[220px] overflow-y-auto">
                                        {loadingRecruiters ? (
                                            <div className="p-6 flex justify-center"><Loader2 size={20} className="animate-spin text-blue-600" /></div>
                                        ) : filteredRecruiters.length === 0 ? (
                                            <p className="p-4 text-[12px] text-slate-400 text-center">No team members found</p>
                                        ) : (
                                            filteredRecruiters.map(r => {
                                                const isSelected = selectedAttendees.some(a => a.id === r.id);
                                                return (
                                                    <button
                                                        key={r.id}
                                                        type="button"
                                                        onClick={() => toggleAttendee(r)}
                                                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}
                                                    >
                                                        {r.avatar_url ? (
                                                            <img src={r.avatar_url} alt={r.full_name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                                                        ) : (
                                                            <InitialAvatar name={r.full_name} className="w-8 h-8 shrink-0" />
                                                        )}
                                                        <div className="flex-1 text-left min-w-0">
                                                            <p className="text-[12px] font-bold text-slate-900 truncate">{r.full_name}</p>
                                                            <p className="text-[10px] text-slate-400 truncate">{r.email}</p>
                                                        </div>
                                                        {isSelected && <Check size={14} className="text-blue-600 shrink-0" strokeWidth={3} />}
                                                    </button>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        {/* Candidate — fixed */}
                        <div className="flex justify-between items-center p-3 border border-slate-200 rounded-[12px] shadow-sm bg-white">
                            <div className="flex items-center gap-3">
                                {candidate.avatar_url ? (
                                    <img src={candidate.avatar_url} alt={candidateName} className="w-9 h-9 rounded-full object-cover" />
                                ) : (
                                    <InitialAvatar name={candidateName} className="w-9 h-9" />
                                )}
                                <div>
                                    <p className="text-[13px] font-bold text-slate-900 leading-tight">{candidateName}</p>
                                    <p className="text-[11px] font-medium text-slate-500">Candidate • {candidate.email || '—'}</p>
                                </div>
                            </div>
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[9px] font-bold rounded uppercase tracking-wider">INVITADO</span>
                        </div>

                        {/* Selected team members */}
                        {selectedAttendees.map(att => (
                            <div key={att.id} className="flex justify-between items-center p-3 border border-blue-100 rounded-[12px] shadow-sm bg-blue-50/40">
                                <div className="flex items-center gap-3">
                                    {att.avatar_url ? (
                                        <img src={att.avatar_url} alt={att.full_name} className="w-9 h-9 rounded-full object-cover" />
                                    ) : (
                                        <InitialAvatar name={att.full_name} className="w-9 h-9" />
                                    )}
                                    <div>
                                        <p className="text-[13px] font-bold text-slate-900 leading-tight">{att.full_name}</p>
                                        <p className="text-[11px] font-medium text-slate-400">{att.email}</p>
                                    </div>
                                </div>
                                <button type="button" onClick={() => toggleAttendee(att)} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                                    <X size={15} />
                                </button>
                            </div>
                        ))}

                        {selectedAttendees.length === 0 && (
                            <p className="text-[11px] text-slate-400 italic py-1 pl-1">
                                Click "Add team member" to invite recruiters or the SuperAdmin.
                            </p>
                        )}
                    </div>
                </div>

                {/* NOTES */}
                <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Notes / Agenda</label>
                    <textarea
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Add meeting agenda, topics, or dial-in instructions..."
                        className="w-full h-28 p-4 text-[13px] text-slate-700 resize-none outline-none font-medium placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                </div>

                {/* Google Meet notice */}
                <div className="flex items-start gap-3 px-4 py-3 bg-blue-50 rounded-xl border border-blue-100 text-[12px] text-blue-700 font-medium">
                    <VideoIcon size={16} className="shrink-0 mt-0.5 text-blue-600" />
                    <span>Un link de <strong>Google Meet</strong> se generará automáticamente y se incluirá en la invitación de calendario de todos los asistentes.</span>
                </div>

                {result?.error && (
                    <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-[12px] text-red-700 font-medium">
                        ⚠️ {result.error}
                    </div>
                )}
            </div>

            {/* Sticky footer */}
            <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex justify-end items-center gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
                <button type="button" onClick={onClose} className="text-[13px] font-bold text-slate-600 hover:text-slate-900 transition-colors">
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleCreate}
                    disabled={isSubmitting || !date || !time}
                    className="px-6 py-2.5 bg-[#0B4FEA] text-white text-[13px] font-bold rounded-xl shadow-md shadow-blue-600/20 hover:bg-blue-800 transition-all flex items-center justify-center gap-2 min-w-[140px] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? <><Loader2 size={15} className="animate-spin" /> Scheduling...</> : 'Create event'}
                </button>
            </div>
        </SlideOver>
    );
}
