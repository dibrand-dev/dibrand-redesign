'use client';

import React, { useState, useTransition } from 'react';
import { Link as LinkIcon } from 'lucide-react';
import { addApplicationLog } from '@/app/ats/actions';

interface Note {
    id: string;
    author_name: string;
    author_avatar_url: string | null;
    note_text: string;
    created_at: string;
}

interface Props {
    candidateId: string;
    initialLogs: Note[];
}

export default function RecruiterNotesWidget({ candidateId, initialLogs }: Props) {
    const [note, setNote] = useState('');
    const [isPending, startTransition] = useTransition();

    // Filter out systemic logs like rejection reasons, showing only real notes
    const manualNotes = initialLogs.filter(log => !log.note_text.startsWith('RECHAZADO: '));

    const handlePost = () => {
        if (!note.trim()) return;
        
        startTransition(async () => {
            try {
                await addApplicationLog(candidateId, note);
                setNote('');
            } catch (error) {
                console.error('Error posting note:', error);
                alert('Hubo un error al publicar la nota.');
            }
        });
    };

    return (
        <div className="bg-white rounded-[20px] shadow-sm border border-slate-200/60 p-6">
            <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-5">Recruiter Notes</h3>
            
            <div className={`bg-white border border-slate-200 rounded-xl p-4 mb-6 focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-500 transition-all shadow-sm ${isPending ? 'opacity-70 pointer-events-none' : ''}`}>
                <textarea 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a private note..." 
                    className="w-full text-[14px] text-slate-700 resize-none outline-none placeholder:text-slate-400 min-h-[80px]"
                    disabled={isPending}
                ></textarea>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                    <div className="flex gap-4 text-slate-400">
                        <button className="hover:text-slate-700 transition-colors"><LinkIcon size={16} /></button>
                        <button className="hover:text-slate-700 transition-colors"><span className="font-extrabold font-serif text-[16px]">@</span></button>
                    </div>
                    <button 
                        onClick={handlePost}
                        disabled={isPending || !note.trim()}
                        className="px-6 py-2 bg-[#0B4FEA] text-white rounded-lg text-[12px] font-bold shadow-sm hover:bg-blue-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isPending ? (
                            <>
                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                POSTING...
                            </>
                        ) : 'POST'}
                    </button>
                </div>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {manualNotes.length > 0 ? (
                    manualNotes.map((log) => (
                        <div key={log.id} className="bg-slate-50 p-5 rounded-xl flex gap-3.5 border border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="w-8 h-8 rounded-full shrink-0 shadow-sm ring-2 ring-white bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden flex items-center justify-center font-bold text-[10px] text-slate-500">
                                {log.author_avatar_url ? (
                                    <img src={log.author_avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    log.author_name ? log.author_name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'R'
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1.5 gap-2">
                                    <span className="text-[13px] font-extrabold text-slate-900 truncate">
                                        {log.author_name}
                                    </span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight whitespace-nowrap">
                                        {new Date(log.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                    </span>
                                </div>
                                <p className="text-[13px] text-slate-600 font-medium leading-relaxed whitespace-pre-wrap break-words">
                                    {log.note_text}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-[13px] text-slate-400 font-semibold italic">No hay notas todavía.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
