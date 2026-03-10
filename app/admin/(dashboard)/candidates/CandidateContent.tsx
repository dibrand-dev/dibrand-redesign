'use client'

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Mail, Phone, ArrowLeft, User, Pencil, Trash2, MoreHorizontal, X, Check, Send } from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa6';
import { BsFiletypePdf } from 'react-icons/bs';
import CandidateSummary from './CandidateSummary';
import { addApplicationNote, deleteNote, updateNote } from './actions';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Note {
    id: string;
    author_name: string;
    author_avatar_url?: string;
    note_text: string;
    created_at: string;
}

interface Candidate {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
    state_province?: string;
    country?: string;
    linkedin_url?: string;
    resume_url?: string;
    stack_names?: string[];
    candidate_summary?: string;
    notes?: Note[];
}

// ─── Note Menu ────────────────────────────────────────────────────────────────
function NoteMenu({ noteId, applicationId, onEdit }: {
    noteId: string;
    applicationId: string;
    onEdit: () => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleDelete = async () => {
        setOpen(false);
        if (!window.confirm('¿Estás seguro de borrar esta nota?')) return;
        try { await deleteNote(noteId, applicationId); } catch { alert('Error al eliminar.'); }
    };

    return (
        <div ref={ref} className="relative shrink-0">
            <button
                onClick={() => setOpen(p => !p)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
            >
                <MoreHorizontal size={14} />
            </button>
            {open && (
                <div className="absolute right-0 top-8 z-50 w-36 bg-admin-card-bg border border-admin-border rounded-xl shadow-lg py-1 text-sm">
                    <button onClick={() => { setOpen(false); onEdit(); }} className="flex items-center gap-2 w-full px-3 py-2 text-admin-text-primary hover:bg-admin-bg/50">
                        <Pencil size={12} className="text-gray-400" /> Edit
                    </button>
                    <button onClick={handleDelete} className="flex items-center gap-2 w-full px-3 py-2 text-red-500 hover:bg-red-500/10">
                        <Trash2 size={12} /> Remove
                    </button>
                </div>
            )}
        </div>
    );
}

// ─── Timeline Note Item ───────────────────────────────────────────────────────
function TimelineNote({ note, applicationId }: { note: Note; applicationId: string }) {
    const [editing, setEditing] = useState(false);
    const [editText, setEditText] = useState(note.note_text);
    const [saving, setSaving] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => { setIsMounted(true); }, []);

    const initials = (note.author_name || 'AU')
        .trim().split(/\s+/).filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase();

    const handleSave = async () => {
        if (!editText.trim() || editText === note.note_text) { setEditing(false); return; }
        setSaving(true);
        try { await updateNote(note.id, editText, applicationId); setEditing(false); }
        catch { alert('Error al guardar.'); }
        finally { setSaving(false); }
    };

    return (
        <div className="relative pl-10 pb-8 group last:pb-0">
            {/* Timeline dot / avatar anchored to the line */}
            <div className="absolute left-0 top-0 w-8 h-8 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-sm ring-2 ring-gray-100 flex items-center justify-center shrink-0 z-10">
                {note.author_avatar_url ? (
                    <Image src={note.author_avatar_url} alt={note.author_name} width={32} height={32} className="object-cover" />
                ) : (
                    <span className="text-[10px] font-bold text-gray-500">{initials}</span>
                )}
            </div>

            {/* Note card */}
            <div className="bg-admin-card-bg border border-admin-border rounded-xl shadow-sm p-4 ml-2">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                        <span className="text-sm font-bold text-corporate-grey">{note.author_name}</span>
                        <span className="text-[10px] text-gray-400 ml-2">
                            {isMounted
                                ? `${new Date(note.created_at).toLocaleDateString()} ${new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                : ''}
                        </span>
                    </div>
                    {!editing && (
                        <NoteMenu noteId={note.id} applicationId={applicationId} onEdit={() => setEditing(true)} />
                    )}
                </div>

                {editing ? (
                    <div className="space-y-2">
                        <textarea
                            value={editText}
                            onChange={e => setEditText(e.target.value)}
                            autoFocus
                            rows={3}
                            className="w-full p-3 text-sm bg-admin-bg/50 border border-admin-accent/40 rounded-lg focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent outline-none font-medium italic resize-none transition-all text-admin-text-primary"
                        />
                        <div className="flex items-center gap-2 justify-end">
                            <button onClick={() => { setEditText(note.note_text); setEditing(false); }} className="flex items-center gap-1 px-3 py-1.5 text-xs text-admin-text-secondary hover:text-admin-text-primary rounded-lg hover:bg-admin-bg transition-colors">
                                <X size={11} /> Cancel
                            </button>
                            <button onClick={handleSave} disabled={saving || !editText.trim()} className="flex items-center gap-1 px-4 py-1.5 text-xs font-bold text-white bg-admin-accent rounded-lg hover:opacity-90 disabled:opacity-40 transition-all uppercase tracking-widest">
                                <Check size={11} /> {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-admin-text-secondary leading-relaxed whitespace-pre-wrap font-medium italic">{note.note_text}</p>
                )}
            </div>
        </div>
    );
}

// ─── Notes Tab ────────────────────────────────────────────────────────────────
function NotesTab({ applicationId, notes }: { applicationId: string; notes: Note[] }) {
    const [noteText, setNoteText] = useState('');
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!noteText.trim() || sending) return;
        setSending(true);
        try { await addApplicationNote(applicationId, noteText); setNoteText(''); }
        catch { alert('Error adding note'); }
        finally { setSending(false); }
    };

    return (
        <div className="space-y-8">
            {/* Input form */}
            <form onSubmit={handleSubmit} className="space-y-3">
                <textarea
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                    placeholder="Añade una nota interna..."
                    className="w-full h-24 p-4 bg-admin-bg/50 border border-admin-border rounded-xl focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent outline-none text-admin-text-primary placeholder:text-admin-text-secondary/50 font-medium italic resize-none transition-all"
                />
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={sending || !noteText.trim()}
                        className="px-6 py-2 bg-admin-accent text-white font-bold rounded-lg text-sm hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {sending ? 'Enviando...' : <><Send size={14} />Send</>}
                    </button>
                </div>
            </form>

            {/* Timeline */}
            {notes.length > 0 ? (
                <div className="relative border-l-2 border-admin-border/50 ml-4">
                    {notes.map(note => (
                        <TimelineNote key={note.id} note={note} applicationId={applicationId} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-admin-bg/30 rounded-2xl border border-dashed border-admin-border text-admin-text-secondary text-sm italic font-medium">
                    No hay notas internas aún. Usa el campo de arriba para iniciar el hilo.
                </div>
            )}
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
type Tab = 'info' | 'resume' | 'notes';

export default function CandidateContent({ candidate }: { candidate: Candidate }) {
    const [activeTab, setActiveTab] = useState<Tab>('info');

    const tabs: { id: Tab; label: string }[] = [
        { id: 'info', label: 'Info' },
        { id: 'resume', label: 'Resume' },
        { id: 'notes', label: `Notes${(candidate.notes?.length ?? 0) > 0 ? ` (${candidate.notes!.length})` : ''}` },
    ];

    return (
        <div className="space-y-8">
            {/* ── Header ── */}
            <div className="space-y-6">
                <Link
                    href="/admin/candidates"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-sm font-medium"
                >
                    <ArrowLeft size={16} /> Candidates List
                </Link>

                <div className="flex items-center gap-8">
                    <div className="w-24 h-24 rounded-full bg-admin-bg border border-admin-border flex items-center justify-center text-gray-400">
                        <User size={48} />
                    </div>
                    <div>
                        <h1 className="text-5xl font-black text-admin-text-primary tracking-tight">
                            {candidate.full_name}
                        </h1>
                        <div className="flex items-center gap-4 mt-2">
                            <a href={`mailto:${candidate.email}`} className="text-admin-accent hover:underline text-sm font-bold italic flex items-center gap-1.5">
                                <Mail size={14} /> {candidate.email}
                            </a>
                            {candidate.phone && (
                                <span className="text-admin-text-secondary text-sm font-medium italic flex items-center gap-1.5">
                                    <Phone size={14} /> {candidate.phone}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Tab Bar ── */}
            <div className="flex items-center gap-0 border-b border-admin-border">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-5 py-4 text-sm font-black transition-all border-b-2 -mb-px uppercase tracking-widest ${activeTab === tab.id
                            ? 'text-admin-accent border-admin-accent'
                            : 'text-gray-400 border-transparent hover:text-admin-text-primary'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Tab Content ── */}

            {/* INFO TAB */}
            {activeTab === 'info' && (
                <div className="space-y-12 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Contact Info</h3>
                            <div className="space-y-4">
                                {(candidate.state_province || candidate.country) && (
                                    <div className="flex items-center gap-3 text-corporate-grey">
                                        <MapPin size={18} className="text-gray-300" />
                                        <span className="font-medium">{[candidate.state_province, candidate.country].filter(Boolean).join(', ')}</span>
                                    </div>
                                )}
                                <div className="flex flex-wrap gap-6 mt-2">
                                    {candidate.linkedin_url && (
                                        <a href={candidate.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
                                            <FaLinkedin className="w-5 h-5" style={{ color: '#0A66C2' }} />
                                            <span className="text-sm font-medium text-gray-700 group-hover:underline">LinkedIn Profile</span>
                                        </a>
                                    )}
                                    {candidate.resume_url && (
                                        <button onClick={() => setActiveTab('resume')} className="flex items-center gap-2 group">
                                            <BsFiletypePdf className="w-5 h-5" style={{ color: '#E2574C' }} />
                                            <span className="text-sm font-medium text-gray-700 group-hover:underline">View Resume (PDF)</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tech Stacks */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tech Stacks</h3>
                            <div className="flex flex-wrap gap-2">
                                {candidate.stack_names?.map((name: string) => (
                                    <span key={name} className="px-3 py-1 bg-admin-bg text-admin-text-secondary rounded-lg text-[10px] font-bold border border-admin-border uppercase tracking-widest">
                                        {name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Candidate Summary */}
                    <div className="pt-8 border-t border-gray-50">
                        <CandidateSummary id={candidate.id} initialSummary={candidate.candidate_summary ?? ''} />
                    </div>
                </div>
            )}

            {/* RESUME TAB */}
            {activeTab === 'resume' && (
                <div className="animate-in fade-in duration-200">
                    {candidate.resume_url ? (
                        <iframe
                            src={candidate.resume_url}
                            className="w-full h-[800px] rounded-2xl border border-admin-border shadow-2xl bg-white"
                            title="Candidate Resume"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-admin-text-secondary bg-admin-bg/30 rounded-2xl border border-dashed border-admin-border">
                            <BsFiletypePdf size={40} className="mb-3 opacity-30" />
                            <p className="text-sm font-medium italic">No se adjuntó ningún CV a esta aplicación.</p>
                        </div>
                    )}
                </div>
            )}

            {/* NOTES TAB */}
            {activeTab === 'notes' && (
                <div className="animate-in fade-in duration-200">
                    <NotesTab applicationId={candidate.id} notes={candidate.notes || []} />
                </div>
            )}
        </div>
    );
}
