'use client';

import React, { useState, useTransition } from 'react';
import { Link as LinkIcon, Edit2, Trash2, Check, X } from 'lucide-react';
import { addApplicationLog, updateApplicationLog, deleteApplicationLog } from '@/app/ats/actions';

interface Note {
    id: string;
    author_name: string;
    author_avatar_url: string | null;
    note_text: string;
    created_at: string;
    author_id?: string;
}

interface Props {
    candidateId: string;
    initialLogs: Note[];
}

export default function RecruiterNotesWidget({ candidateId, initialLogs }: Props) {
    const [note, setNote] = useState('');
    const [isPending, startTransition] = useTransition();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

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

    const handleEditStart = (note_id: string, text: string) => {
        setEditingId(note_id);
        setEditValue(text);
    };

    const handleEditSave = () => {
        if (!editingId || !editValue.trim()) return;
        
        startTransition(async () => {
            try {
                await updateApplicationLog(editingId, candidateId, editValue);
                setEditingId(null);
                setEditValue('');
            } catch (error: any) {
                console.error('Error saving updated note:', error);
                alert(`Hubo un error al guardar los cambios: ${error.message || 'Error desconocido'}`);
            }
        });
    };

    const handleDelete = (note_id: string) => {
        if (!confirm('¿Seguro quieres eliminar esta nota?')) return;
        
        startTransition(async () => {
            try {
                await deleteApplicationLog(note_id, candidateId);
            } catch (error) {
                console.error('Error deleting note:', error);
                alert('Hubo un error al eliminar la nota.');
            }
        });
    };

    return (
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-200/60 p-8 font-outfit">
            <h3 className="text-[11px] font-black tracking-widest text-slate-400 uppercase mb-6">Recruiter Insights & Notes</h3>
            
            <div className={`bg-white border border-slate-200 rounded-2xl p-5 mb-8 focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-500 transition-all shadow-sm ${isPending ? 'opacity-70 pointer-events-none' : ''}`}>
                <textarea 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Escribe una nota privada..." 
                    className="w-full text-[14px] text-slate-700 resize-none outline-none placeholder:text-slate-400 min-h-[100px] font-medium leading-relaxed"
                    disabled={isPending}
                ></textarea>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                    <div className="flex gap-5 text-slate-400">
                        <button className="hover:text-blue-600 transition-colors" title="Attach Link"><LinkIcon size={18} /></button>
                        <button className="hover:text-blue-600 transition-colors" title="Mention Recruiter"><span className="font-extrabold text-[18px]">@</span></button>
                    </div>
                    <button 
                        onClick={handlePost}
                        disabled={isPending || !note.trim()}
                        className="px-6 py-2.5 bg-[#0B4FEA] text-white rounded-xl text-[13px] font-bold shadow-md hover:bg-blue-800 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isPending && !editingId ? (
                            <>
                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                MOVING...
                            </>
                        ) : 'PUBLICAR NOTA'}
                    </button>
                </div>
            </div>

            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-3 custom-scrollbar">
                {manualNotes.length > 0 ? (
                    manualNotes.map((log) => (
                        <div key={log.id} className="bg-slate-50/70 p-6 rounded-2xl flex gap-4 border border-slate-100/80 animate-in fade-in slide-in-from-bottom-2 duration-300 relative group">
                            <div className="w-10 h-10 rounded-full shrink-0 shadow-sm ring-4 ring-white bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden flex items-center justify-center font-bold text-[12px] text-slate-500">
                                {log.author_avatar_url ? (
                                    <img src={log.author_avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    log.author_name ? log.author_name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'R'
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-2 gap-2">
                                    <div className="min-w-0">
                                        <h4 className="text-[14px] font-extrabold text-slate-900 truncate tracking-tight">
                                            {log.author_name}
                                        </h4>
                                        <p 
                                            suppressHydrationWarning
                                            className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5"
                                        >
                                            {new Date(log.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {editingId === log.id ? (
                                            <>
                                                <button 
                                                    onClick={handleEditSave}
                                                    title="Guardar"
                                                    disabled={isPending}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                                                >
                                                    <Check size={14} />
                                                </button>
                                                <button 
                                                    onClick={() => setEditingId(null)}
                                                    title="Cancelar"
                                                    disabled={isPending}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button 
                                                    onClick={() => handleEditStart(log.id, log.note_text)}
                                                    title="Editar nota"
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-slate-400 hover:text-blue-600 transition-all shadow-sm border border-transparent hover:border-slate-100"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(log.id)}
                                                    title="Eliminar nota"
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-slate-400 hover:text-red-500 transition-all shadow-sm border border-transparent hover:border-slate-100"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                                
                                {editingId === log.id ? (
                                    <textarea 
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="w-full text-[13px] text-slate-600 font-medium p-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none min-h-[100px] mt-2"
                                        autoFocus
                                    />
                                ) : (
                                    <div className="text-[13px] text-slate-600 font-medium leading-relaxed whitespace-pre-wrap break-words mt-1">
                                        {log.note_text}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-16 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LinkIcon size={20} className="text-slate-300 rotate-45" />
                        </div>
                        <p className="text-[14px] text-slate-400 font-bold italic tracking-tight">Todavía no hay notas aquí.</p>
                        <p className="text-[12px] text-slate-300 mt-1">Sé el primero en dejar una nota para este candidato.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
