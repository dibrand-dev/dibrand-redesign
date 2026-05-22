'use client'

import React, { useState, useEffect } from 'react';
import { Send, AtSign, Paperclip, MessageSquare, Loader2 } from 'lucide-react';
import { addApplicationLog, getRecruiters } from '@/app/ats/actions';
import { useRouter, useSearchParams } from 'next/navigation';
import RichTextEditor from './RichTextEditor';

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

/** Detect if a string is HTML (saved with the rich editor) vs plain text */
function isHTML(str: string) {
    return /<[a-z][\s\S]*>/i.test(str);
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
    const [isMounted, setIsMounted] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        setIsMounted(true);
        const fetchRecruiters = async () => {
            try {
                const data = await getRecruiters();
                setRecruiters(data || []);
            } catch (err) {
                console.error('Error fetching recruiters:', err);
            }
        };
        fetchRecruiters();
    }, [searchParams]);

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
            <div className="bg-white rounded-[12px] border border-[#E2E8F0] shadow-sm overflow-hidden focus-within:border-[#0040A1] transition-all">
                <RichTextEditor
                    content={noteText}
                    onChange={setNoteText}
                    placeholder="Add a private note for the team..."
                    disabled={sending}
                    minHeight="100px"
                />

                <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#F1F5F9] flex items-center justify-between">
                    <div className="flex items-center gap-4 text-[#A1A5B7]">
                        <button className="hover:text-[#0040A1] transition-colors"><Paperclip size={18} /></button>
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
                                {isHTML(note.note_text) ? (
                                    <div
                                        className="ats-note-content text-[13px] text-[#424654] leading-relaxed font-medium"
                                        dangerouslySetInnerHTML={{ __html: note.note_text }}
                                    />
                                ) : (
                                    <p className="text-[13px] text-[#424654] leading-relaxed whitespace-pre-wrap font-medium">
                                        {note.note_text.split(' ').map((word, i) => (
                                            word.startsWith('@') ? (
                                                <span key={i} className="text-[#0040A1] font-black bg-[#DAE2FF] px-1.5 py-0.5 rounded text-[11px]">{word} </span>
                                            ) : `${word} `
                                        ))}
                                    </p>
                                )}
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
