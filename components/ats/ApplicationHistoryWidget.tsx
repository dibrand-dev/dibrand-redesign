'use client';

import React from 'react';
import { Briefcase, User, Info, FileText, CheckCircle2 } from 'lucide-react';

interface Log {
    id: string;
    author_name: string;
    author_avatar_url: string | null;
    note_text: string;
    created_at: string;
}

interface Props {
    candidate: any;
    logs: Log[];
}

export default function ApplicationHistoryWidget({ candidate, logs }: Props) {
    // Only show "system logs" like RECHAZADO:
    const systemLogs = logs.filter(log => log.note_text.startsWith('RECHAZADO: '));

    // Combine with creation event
    const events = [
        ...systemLogs.map(log => ({
            id: log.id,
            type: 'rejection',
            title: 'Candidato Rechazado',
            description: log.note_text.replace('RECHAZADO: ', ''),
            author: log.author_name,
            author_avatar: log.author_avatar_url,
            date: log.created_at
        })),
        {
            id: 'creation',
            type: 'creation',
            title: 'Candidato Creado',
            description: `Registrado en el sistema asignado a ${candidate.recruiter?.full_name || 'Recruiter'}`,
            author: candidate.recruiter?.full_name || 'System',
            author_avatar: null,
            date: candidate.created_at
        }
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="bg-white rounded-[20px] shadow-sm border border-slate-200/60 p-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-[18px] font-extrabold text-slate-900">Application History</h3>
                <span className="text-slate-400 text-[12px] font-bold">{events.length} eventos</span>
            </div>
            
            <div className="space-y-6 relative before:absolute before:left-[23px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                {events.map((event) => (
                    <div key={event.id} className="relative flex items-start gap-5 group">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm border z-10 ${
                            event.type === 'rejection' 
                                ? 'bg-red-50 border-red-100 text-red-600' 
                                : 'bg-[#EEF2FF] border-blue-100 text-blue-600'
                        }`}>
                            {event.type === 'rejection' ? <Info size={20} /> : <Briefcase size={20} />}
                        </div>
                        
                        <div className="flex-1 pt-1">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className={`text-[15px] font-extrabold leading-tight ${
                                    event.type === 'rejection' ? 'text-red-700' : 'text-slate-900'
                                }`}>
                                    {event.title}
                                </h4>
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-tighter">
                                    {new Date(event.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                </span>
                            </div>
                            <p className="text-[13px] text-slate-500 font-medium leading-relaxed mb-3">
                                {event.description}
                            </p>
                            
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden ring-2 ring-white shadow-sm">
                                    {event.author_avatar ? (
                                        <img src={event.author_avatar} alt="Author" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-[8px] font-bold text-slate-500">{event.author?.[0].toUpperCase()}</span>
                                    )}
                                </div>
                                <span className="text-[11px] font-bold text-slate-700">{event.author}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
