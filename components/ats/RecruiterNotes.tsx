'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Send, AtSign, Paperclip, MoreHorizontal, MessageSquare, Loader2, User } from 'lucide-react';
import { addApplicationLog, getRecruiters } from '@/app/ats/actions';
import { useRouter } from 'next/navigation';

interface Recruiter {
    id: string;
    full_name: string;
    avatar_url?: string;
}

interface Note {
    id: string;
    author_name: string;
    author_avatar_url?: string;
    note_text: string;
    created_at: string;
}

export default function RecruiterNotes({ 
    applicationId, 
    initialNotes 
}: { 
    applicationId: string; 
    initialNotes: Note[] 
}) {
    const [noteText, setNoteText] = useState('');
    const [sending, setSending] = useState(false);
    const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
    const [showMentions, setShowMentions] = useState(false);
    const [mentionSearch, setMentionSearch] = useState('');
    const [isMounted, setIsMounted] = useState(false);
    
    const router = useRouter();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        setIsMounted(true);
        const fetchRecruiters = async () => {
            const data = await getRecruiters();
            setRecruiters(data);
        };
        fetchRecruiters();
    }, []);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setNoteText(value);

        // Simple mention trigger logic
        const lastAt = value.lastIndexOf('@');
        if (lastAt !== -1 && (lastAt === 0 || value[lastAt - 1] === ' ')) {
            const query = value.slice(lastAt + 1);
            if (!query.includes(' ')) {
                setMentionSearch(query);
                setShowMentions(true);
                return;
            }
        }
        setShowMentions(false);
    };

    const insertMention = (recruiter: Recruiter) => {
        const lastAt = noteText.lastIndexOf('@');
        const before = noteText.slice(0, lastAt);
        const after = noteText.slice(lastAt + mentionSearch.length + 1);
        setNoteText(`${before}@${recruiter.full_name} ${after}`);
        setShowMentions(false);
        textareaRef.current?.focus();
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!noteText.trim() || sending) return;

        setSending(true);
        try {
            await addApplicationLog(applicationId, noteText);
            setNoteText('');
            router.refresh();
        } catch (error) {
            console.error('Error adding note:', error);
            alert('Failed to add note');
        } finally {
            setSending(false);
        }
    };

    const filteredRecruiters = recruiters.filter(r => 
        r.full_name.toLowerCase().includes(mentionSearch.toLowerCase())
    ).slice(0, 5);

    const formatTimeAgo = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m ago";
        return Math.floor(seconds) + "s ago";
    };

    if (!isMounted) return null;

    return (
        <section id="recruiter-notes" className="space-y-8 scroll-mt-32">
            <h4 className="text-[11px] font-black text-[#6B7485] uppercase tracking-[0.2em]">Recruiter Notes</h4>
            
            {/* Drafting Card */}
            <div className="bg-white rounded-[24px] border border-[#E2E8F0] shadow-sm overflow-hidden focus-within:border-[#0040A1] transition-all">
                <div className="relative">
                    <textarea 
                        ref={textareaRef}
                        value={noteText}
                        onChange={handleTextChange}
                        placeholder="Add a private note for the team..."
                        className="w-full h-32 p-6 text-[14px] text-[#191C1D] placeholder:text-[#A1A5B7] resize-none outline-none focus:ring-0 font-medium"
                    />
                    
                    {/* Mentions Dropdown */}
                    {showMentions && filteredRecruiters.length > 0 && (
                        <div className="absolute bottom-full left-6 mb-2 w-64 bg-white border border-[#E2E8F0] rounded-xl shadow-2xl z-20 py-2 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                             <div className="px-4 py-2 text-[10px] font-bold text-[#A1A5B7] uppercase tracking-widest border-b border-[#F1F5F9] mb-1">Mention Recruiter</div>
                             {filteredRecruiters.map(r => (
                                 <button 
                                     key={r.id}
                                     onClick={() => insertMention(r)}
                                     className="w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-[#F1F5F9] transition-colors group"
                                 >
                                     <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-[#0040A1]">
                                         {r.full_name.charAt(0)}
                                     </div>
                                     <span className="text-[12px] font-semibold text-[#191C1D]">{r.full_name}</span>
                                 </button>
                             ))}
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#F1F5F9] flex items-center justify-between">
                    <div className="flex items-center gap-4 text-[#A1A5B7]">
                        <button className="hover:text-[#0040A1] transition-colors"><Paperclip size={18} /></button>
                        <button 
                            onClick={() => {
                                setNoteText(prev => prev + '@');
                                setShowMentions(true);
                                textareaRef.current?.focus();
                            }}
                            className="hover:text-[#0040A1] transition-colors"
                        >
                            <AtSign size={18} />
                        </button>
                    </div>
                    <button 
                        onClick={() => handleSubmit()}
                        disabled={sending || !noteText.trim()}
                        className="px-10 py-2.5 bg-[#0040A1] text-white rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#003380] transition-all disabled:opacity-50"
                    >
                        {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={14} />} 
                        POST
                    </button>
                </div>
            </div>

            {/* History Thread */}
            <div className="space-y-6">
                <h4 className="text-[11px] font-black text-[#6B7485] uppercase tracking-[0.2em] mb-4">Latest Updates</h4>
                {initialNotes.map((note) => (
                    <div key={note.id} className="flex gap-4 group animate-in slide-in-from-left-2 duration-300">
                        <div className="w-10 h-10 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#0040A1] font-bold text-[12px] shrink-0 overflow-hidden shadow-sm">
                            {note.author_avatar_url ? (
                                <img src={note.author_avatar_url} alt={note.author_name} className="object-cover w-full h-full" />
                            ) : note.author_name?.charAt(0)}
                        </div>
                        <div className="flex-1 space-y-1.5 min-w-0">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-[14px] font-bold text-[#191C1D]">{note.author_name}</span>
                                    <span className="text-[11px] font-black text-[#A1A5B7] uppercase tracking-widest">{formatTimeAgo(note.created_at)}</span>
                                </div>
                            </div>
                            <div className="bg-white border border-[#E2E8F0] hover:border-[#0040A1]/30 p-5 rounded-2xl rounded-tl-none shadow-sm transition-all group-hover:shadow-md">
                                <p className="text-[13px] text-[#424654] leading-relaxed whitespace-pre-wrap font-medium">
                                    {note.note_text.split(' ').map((word, i) => (
                                        word.startsWith('@') ? (
                                            <span key={i} className="text-[#0040A1] font-black bg-[#DAE2FF] px-1.5 py-0.5 rounded text-[11px]">{word} </span>
                                        ) : `${word} `
                                    ))}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
                {initialNotes.length === 0 && (
                    <div className="text-center py-16 bg-[#F8FAFC] rounded-2xl border-2 border-dashed border-[#E1E2E5]">
                         <MessageSquare size={32} className="mx-auto mb-3 text-[#A1A5B7] opacity-20" />
                         <p className="text-[13px] text-[#A1A5B7] font-medium">No internal messages or notes yet.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
