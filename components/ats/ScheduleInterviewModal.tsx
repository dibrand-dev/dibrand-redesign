'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
    X, Phone, Video, Users, Lock, Calendar, Clock, ChevronDown, 
    Plus, Bold, Italic, List, Link as LinkIcon, Paperclip 
} from 'lucide-react';
import { createInterview } from '@/app/ats/actions';

interface Candidate {
    id: string;
    full_name?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    avatar_url?: string;
    job_id?: string;
}

export default function ScheduleInterviewModal({ candidate, recruiterId }: { candidate: Candidate, recruiterId: string | null }) {
    const router = useRouter();
    const [eventType, setEventType] = useState('Call');
    
    const candidateName = candidate.full_name || `${candidate.first_name} ${candidate.last_name}`;
    const [title, setTitle] = useState(`Call with ${candidateName} - Senior Product Designer`);
    const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState('14:00');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const closeModal = () => {
        router.push(`/ats/candidates/${candidate.id}`);
    };

    const handleCreate = async () => {
        setIsSubmitting(true);
        try {
            const scheduledAt = new Date(`${date}T${time}:00`).toISOString();
            
            // Map the UI categories to the DB CHECK constraint valid enumerations
            const typeMapping: Record<string, string> = {
                'Call': 'Cultural',
                'Interview': 'Technical',
                'Meeting': 'Final Review',
                'Internal': 'Case Study'
            };
            
            await createInterview({
                candidate_id: candidate.id,
                recruiter_id: recruiterId,
                job_id: candidate.job_id,
                scheduled_at: scheduledAt,
                duration_minutes: 60,
                type: typeMapping[eventType] || 'Technical',
                notes: notes
            });

            closeModal();
            router.refresh(); // Refresh the calendar UI context
        } catch (error) {
            console.error('Failed to create interview:', error);
            alert('Failed to schedule interview. Please ensure you are logged in and connected.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 backdrop-blur-sm px-4 animate-in fade-in duration-200">
            {/* Modal Container */}
            <div className="bg-white rounded-[16px] w-full max-w-[640px] shadow-2xl flex flex-col font-inter max-h-[95vh] animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
                    <h2 className="text-[18px] font-extrabold text-slate-900">Schedule Interview</h2>
                    <button onClick={closeModal} className="text-slate-400 hover:text-slate-700 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                    
                    {/* EVENT TYPE */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Event Type</label>
                        <div className="flex gap-2 p-1.5 bg-slate-50/80 rounded-[12px] border border-slate-100">
                            <button 
                                onClick={() => setEventType('Call')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-bold transition-all shadow-sm ${eventType === 'Call' ? 'bg-[#0B4FEA] text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                            >
                                <Phone size={16} fill={eventType === 'Call' ? 'currentColor' : 'none'} /> Call
                            </button>
                            <button 
                                onClick={() => setEventType('Interview')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-bold transition-all shadow-sm ${eventType === 'Interview' ? 'bg-[#0B4FEA] text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                            >
                                <Video size={16} fill={eventType === 'Interview' ? 'currentColor' : 'none'} /> Interview
                            </button>
                            <button 
                                onClick={() => setEventType('Meeting')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-bold transition-all shadow-sm ${eventType === 'Meeting' ? 'bg-[#0B4FEA] text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                            >
                                <Users size={16} fill={eventType === 'Meeting' ? 'currentColor' : 'none'} /> Meeting
                            </button>
                            <button 
                                onClick={() => setEventType('Internal')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-bold transition-all shadow-sm ${eventType === 'Internal' ? 'bg-[#0B4FEA] text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                            >
                                <Lock size={16} fill={eventType === 'Internal' ? 'currentColor' : 'none'} /> Internal
                            </button>
                        </div>
                    </div>

                    {/* EVENT TITLE */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Event Title</label>
                        <input 
                            type="text" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-[14px] font-semibold rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow"
                        />
                    </div>

                    {/* DATE & TIME */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Date</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B4FEA] pointer-events-none">
                                    <Calendar size={18} />
                                </div>
                                <style dangerouslySetInnerHTML={{__html: `
                                    input[type="date"]::-webkit-calendar-picker-indicator, input[type="time"]::-webkit-calendar-picker-indicator {
                                        opacity: 0;
                                        position: absolute;
                                        right: 10px;
                                        cursor: pointer;
                                        width: 100%;
                                        height: 100%;
                                    }
                                `}} />
                                <input 
                                    type="date" 
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 text-slate-900 text-[13px] font-bold rounded-lg pl-11 pr-4 py-3 outline-none cursor-pointer focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Time</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B4FEA] pointer-events-none">
                                    <Clock size={18} />
                                </div>
                                <input 
                                    type="time" 
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 text-slate-900 text-[13px] font-bold rounded-lg pl-11 pr-10 py-3 outline-none cursor-pointer focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                    <ChevronDown size={16} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ATTENDEES */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Attendees</label>
                            <button className="flex items-center gap-1.5 text-[12px] font-bold text-[#0B4FEA] hover:text-blue-800 transition-colors">
                                <Plus size={14} strokeWidth={3} /> Add attendee
                            </button>
                        </div>
                        <div className="space-y-2">
                            {/* Candidate Attendee */}
                            <div className="flex justify-between items-center p-3 border border-slate-200 rounded-[12px] shadow-sm bg-white">
                                <div className="flex items-center gap-3">
                                    <img src={candidate.avatar_url || 'https://i.pravatar.cc/150'} alt="Candidate" className="w-9 h-9 rounded-full object-cover" />
                                    <div>
                                        <p className="text-[13px] font-bold text-slate-900 leading-tight">{candidateName}</p>
                                        <p className="text-[11px] font-medium text-slate-500">Candidate • {candidate.email || 'eleanor.v@design.com'}</p>
                                    </div>
                                </div>
                                <button className="text-slate-400 hover:text-slate-700 transition-colors p-1">
                                    <X size={16} />
                                </button>
                            </div>
                            
                            {/* Organizer Attendee */}
                            <div className="flex justify-between items-center p-3 border border-slate-200 rounded-[12px] shadow-sm bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-blue-100 text-[#0B4FEA] flex items-center justify-center font-bold text-[13px]">
                                        JD
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-bold text-slate-900 leading-tight">James Miller</p>
                                        <p className="text-[11px] font-medium text-slate-500">Organizer • james.m@nexustalent.com</p>
                                    </div>
                                </div>
                                <span className="px-2.5 py-1 bg-slate-200 text-slate-600 text-[10px] font-bold rounded uppercase tracking-wider">
                                    YOU
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Description</label>
                        <div className="border border-slate-200 rounded-[12px] overflow-hidden focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent transition-shadow">
                            {/* Toolbar */}
                            <div className="flex items-center gap-3 px-3 py-2.5 bg-slate-50 border-b border-slate-100">
                                <button className="p-1 hover:bg-slate-200 rounded text-slate-700 transition-colors"><Bold size={14} strokeWidth={3} /></button>
                                <button className="p-1 hover:bg-slate-200 rounded text-slate-700 transition-colors"><Italic size={14} /></button>
                                <button className="p-1 hover:bg-slate-200 rounded text-slate-700 transition-colors"><List size={14} /></button>
                                <div className="flex-1"></div>
                                <button className="p-1 hover:bg-slate-200 rounded text-slate-700 transition-colors"><LinkIcon size={14} /></button>
                            </div>
                            {/* Textarea */}
                            <textarea 
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add meeting notes, agenda, or dial-in instructions..."
                                className="w-full h-24 p-4 text-[13px] text-slate-700 resize-none outline-none font-medium placeholder:text-slate-400"
                            ></textarea>
                            {/* Resize handle visual hint */}
                            <div className="h-4 bg-white flex justify-end px-1 pb-1">
                                <div className="w-3 h-3 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cGF0aCBkPSJNOS42IDBMNiAwTDEuMiAxLjdMNCA0LjVMNiA2LjVMOS42IDBaIiBmaWxsPSIjQzRDMEMwIiAvPgo8L3N2Zz4=')] bg-no-repeat bg-right-bottom opacity-50 cursor-se-resize"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.02)] z-10">
                    <button className="flex items-center gap-2 text-[13px] font-bold text-slate-600 hover:text-slate-900 transition-colors">
                        <Paperclip size={16} /> Upload a file
                    </button>
                    <div className="flex gap-4 items-center">
                        <button onClick={closeModal} className="text-[13px] font-bold text-slate-600 hover:text-slate-900 transition-colors">
                            Cancel
                        </button>
                        <button 
                            onClick={handleCreate}
                            disabled={isSubmitting}
                            className="px-6 py-2.5 bg-[#0B4FEA] text-white text-[13px] font-bold rounded-xl shadow-md shadow-blue-600/20 hover:bg-blue-800 transition-all flex items-center justify-center min-w-[120px]"
                        >
                            {isSubmitting ? 'Scheduling...' : 'Create event'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
