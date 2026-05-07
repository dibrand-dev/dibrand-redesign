'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    X, Phone, Video, Users, Lock, Calendar, Clock, ChevronDown,
    Bold, Italic, List, Link as LinkIcon, Search, Check, Loader2,
    UserPlus, VideoIcon
} from 'lucide-react';
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
    const initials = name
        .split(' ')
        .map(w => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    return (
        <div className={`flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-[12px] ${className}`}>
            {initials}
        </div>
    );
}

export default function ScheduleInterviewModal({
    candidate,
    recruiterId,
}: {
    candidate: Candidate;
    recruiterId: string | null;
}) {
    const router = useRouter();

    const candidateName = candidate.full_name ||
        [candidate.first_name, candidate.last_name].filter(Boolean).join(' ') ||
        'Candidate';

    // Form state
    const [eventType, setEventType] = useState('Interview');
    const [title, setTitle] = useState(`${TYPE_MAP['Interview']} Interview – ${candidateName}`);
    const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState('14:00');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<{ meetLink?: string; error?: string } | null>(null);

    // Attendees state
    const [availableRecruiters, setAvailableRecruiters] = useState<Attendee[]>([]);
    const [selectedAttendees, setSelectedAttendees] = useState<Attendee[]>([]);
    const [recruiterSearch, setRecruiterSearch] = useState('');
    const [showRecruiterPicker, setShowRecruiterPicker] = useState(false);
    const [loadingRecruiters, setLoadingRecruiters] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);

    // Update title when event type changes
    useEffect(() => {
        setTitle(`${TYPE_MAP[eventType] || eventType} Interview – ${candidateName}`);
    }, [eventType, candidateName]);

    // Load real recruiters from Supabase
    useEffect(() => {
        setLoadingRecruiters(true);
        getRecruitersForScheduling().then(data => {
            setAvailableRecruiters(data);
            setLoadingRecruiters(false);
        });
    }, []);

    // Close picker on outside click
    useEffect(() => {
        function handleOutside(e: MouseEvent) {
            if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
                setShowRecruiterPicker(false);
            }
        }
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, []);

    const closeModal = () => router.push(`/ats/candidates/${candidate.id}`);

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
            // Stay on success screen for a moment so user sees the Meet link
            if (!res.video_url) {
                closeModal();
            }
        } catch (error: any) {
            console.error('Failed to create interview:', error);
            setResult({ error: error?.message || 'Failed to schedule interview.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Success screen ─────────────────────────────────────────────────────────
    if (result?.meetLink) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 backdrop-blur-sm px-4">
                <div className="bg-white rounded-[20px] w-full max-w-[480px] shadow-2xl p-10 flex flex-col items-center gap-6 text-center animate-in zoom-in-95 duration-200">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                        <Check size={32} className="text-emerald-600" strokeWidth={3} />
                    </div>
                    <div>
                        <h2 className="text-[20px] font-black text-slate-900">¡Entrevista agendada!</h2>
                        <p className="text-[13px] text-slate-500 mt-2 font-medium">
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
                    <button onClick={closeModal} className="text-[12px] text-slate-400 hover:text-slate-700 font-medium underline">
                        Volver al candidato
                    </button>
                </div>
            </div>
        );
    }

    // ── Main modal ─────────────────────────────────────────────────────────────
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 backdrop-blur-sm px-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[16px] w-full max-w-[640px] shadow-2xl flex flex-col font-inter max-h-[95vh] animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
                    <h2 className="text-[18px] font-extrabold text-slate-900">Schedule Interview</h2>
                    <button onClick={closeModal} className="text-slate-400 hover:text-slate-700 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">

                    {/* EVENT TYPE */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Event Type</label>
                        <div className="flex gap-2 p-1.5 bg-slate-50/80 rounded-[12px] border border-slate-100">
                            {(['Call', 'Interview', 'Meeting', 'Internal'] as const).map(type => {
                                const Icon = type === 'Call' ? Phone : type === 'Interview' ? Video : type === 'Meeting' ? Users : Lock;
                                const active = eventType === type;
                                return (
                                    <button
                                        key={type}
                                        onClick={() => setEventType(type)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-bold transition-all shadow-sm ${active ? 'bg-[#0B4FEA] text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                                    >
                                        <Icon size={16} fill={active ? 'currentColor' : 'none'} /> {type}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* EVENT TITLE */}
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
                                    className="w-full bg-slate-50 border border-slate-100 text-slate-900 text-[13px] font-bold rounded-lg pl-11 pr-4 py-3 outline-none cursor-pointer focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow"
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
                                    className="w-full bg-slate-50 border border-slate-100 text-slate-900 text-[13px] font-bold rounded-lg pl-11 pr-10 py-3 outline-none cursor-pointer focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow"
                                />
                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* ATTENDEES */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                Attendees
                            </label>
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
                                        {/* Search */}
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
                                        {/* List */}
                                        <div className="max-h-[220px] overflow-y-auto">
                                            {loadingRecruiters ? (
                                                <div className="p-6 flex justify-center">
                                                    <Loader2 size={20} className="animate-spin text-blue-600" />
                                                </div>
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

                        {/* Attendee chips list */}
                        <div className="space-y-2">
                            {/* Candidate — always present, not removable */}
                            <div className="flex justify-between items-center p-3 border border-slate-200 rounded-[12px] shadow-sm bg-white">
                                <div className="flex items-center gap-3">
                                    {candidate.avatar_url ? (
                                        <img src={candidate.avatar_url} alt={candidateName} className="w-9 h-9 rounded-full object-cover" />
                                    ) : (
                                        <InitialAvatar name={candidateName} className="w-9 h-9" />
                                    )}
                                    <div>
                                        <p className="text-[13px] font-bold text-slate-900 leading-tight">{candidateName}</p>
                                        <p className="text-[11px] font-medium text-slate-500">
                                            Candidate • {candidate.email || '—'}
                                        </p>
                                    </div>
                                </div>
                                <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[9px] font-bold rounded uppercase tracking-wider">
                                    INVITADO
                                </span>
                            </div>

                            {/* Selected team members */}
                            {selectedAttendees.map(attendee => (
                                <div key={attendee.id} className="flex justify-between items-center p-3 border border-blue-100 rounded-[12px] shadow-sm bg-blue-50/40">
                                    <div className="flex items-center gap-3">
                                        {attendee.avatar_url ? (
                                            <img src={attendee.avatar_url} alt={attendee.full_name} className="w-9 h-9 rounded-full object-cover" />
                                        ) : (
                                            <InitialAvatar name={attendee.full_name} className="w-9 h-9" />
                                        )}
                                        <div>
                                            <p className="text-[13px] font-bold text-slate-900 leading-tight">{attendee.full_name}</p>
                                            <p className="text-[11px] font-medium text-slate-400">{attendee.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => toggleAttendee(attendee)}
                                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                        title="Remove attendee"
                                    >
                                        <X size={15} />
                                    </button>
                                </div>
                            ))}

                            {selectedAttendees.length === 0 && (
                                <p className="text-[11px] text-slate-400 italic py-1 pl-1">
                                    No team members added yet. Click "Add team member" to invite recruiters or the SuperAdmin.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Notes / Agenda</label>
                        <div className="border border-slate-200 rounded-[12px] overflow-hidden focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent transition-shadow">
                            <div className="flex items-center gap-3 px-3 py-2.5 bg-slate-50 border-b border-slate-100">
                                <button type="button" className="p-1 hover:bg-slate-200 rounded text-slate-700 transition-colors"><Bold size={14} strokeWidth={3} /></button>
                                <button type="button" className="p-1 hover:bg-slate-200 rounded text-slate-700 transition-colors"><Italic size={14} /></button>
                                <button type="button" className="p-1 hover:bg-slate-200 rounded text-slate-700 transition-colors"><List size={14} /></button>
                                <div className="flex-1" />
                                <button type="button" className="p-1 hover:bg-slate-200 rounded text-slate-700 transition-colors"><LinkIcon size={14} /></button>
                            </div>
                            <textarea
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                placeholder="Add meeting agenda, topics, or dial-in instructions..."
                                className="w-full h-24 p-4 text-[13px] text-slate-700 resize-none outline-none font-medium placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    {/* Google Meet notice */}
                    <div className="flex items-start gap-3 px-4 py-3 bg-blue-50 rounded-xl border border-blue-100 text-[12px] text-blue-700 font-medium">
                        <VideoIcon size={16} className="shrink-0 mt-0.5 text-blue-600" />
                        <span>
                            Un link de <strong>Google Meet</strong> se generará automáticamente y se incluirá en la invitación de calendario de todos los asistentes.
                        </span>
                    </div>

                    {/* Error */}
                    {result?.error && (
                        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-[12px] text-red-700 font-medium">
                            ⚠️ {result.error}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 flex justify-end items-center gap-4 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.02)] z-10">
                    <button
                        type="button"
                        onClick={closeModal}
                        className="text-[13px] font-bold text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleCreate}
                        disabled={isSubmitting || !date || !time}
                        className="px-6 py-2.5 bg-[#0B4FEA] text-white text-[13px] font-bold rounded-xl shadow-md shadow-blue-600/20 hover:bg-blue-800 transition-all flex items-center justify-center gap-2 min-w-[140px] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <><Loader2 size={15} className="animate-spin" /> Scheduling...</>
                        ) : (
                            'Create event'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
