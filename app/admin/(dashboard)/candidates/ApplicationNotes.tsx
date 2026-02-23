'use client'

import { useState, useEffect, useRef } from 'react';
import { addApplicationNote, deleteNote, updateNote } from './actions';
import { Send, MoreHorizontal, Pencil, Trash2, X, Check } from 'lucide-react';
import Image from 'next/image';

interface Note {
    id: string;
    author_name: string;
    author_avatar_url?: string;
    note_text: string;
    created_at: string;
}

// ─── Note Action Menu ────────────────────────────────────────────────────────
function NoteMenu({
    noteId,
    applicationId,
    noteText,
    onEdit,
}: {
    noteId: string;
    applicationId: string;
    noteText: string;
    onEdit: () => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleDelete = async () => {
        setOpen(false);
        if (!window.confirm('¿Estás seguro de borrar esta nota?')) return;
        try {
            await deleteNote(noteId, applicationId);
        } catch {
            alert('Error al eliminar la nota.');
        }
    };

    const handleEdit = () => {
        setOpen(false);
        onEdit();
    };

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(p => !p)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                title="Acciones"
            >
                <MoreHorizontal size={15} />
            </button>

            {open && (
                <div className="absolute right-0 top-8 z-50 w-40 bg-white border border-gray-100 rounded-xl shadow-lg py-1 text-sm animate-in fade-in slide-in-from-top-1 duration-100">
                    <button
                        onClick={handleEdit}
                        className="flex items-center gap-2.5 w-full px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <Pencil size={13} className="text-gray-400" />
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2.5 w-full px-3 py-2 text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <Trash2 size={13} />
                        Remove
                    </button>
                </div>
            )}
        </div>
    );
}

// ─── Single Note ─────────────────────────────────────────────────────────────
function NoteItem({
    note,
    applicationId,
    isMounted,
}: {
    note: Note;
    applicationId: string;
    isMounted: boolean;
}) {
    const [editing, setEditing] = useState(false);
    const [editText, setEditText] = useState(note.note_text);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!editText.trim() || editText === note.note_text) {
            setEditing(false);
            return;
        }
        setSaving(true);
        try {
            await updateNote(note.id, editText, applicationId);
            setEditing(false);
        } catch {
            alert('Error al guardar la nota.');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditText(note.note_text);
        setEditing(false);
    };

    const initials = (note.author_name || 'AU')
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

    return (
        <div className="flex gap-3 group">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shrink-0 border border-gray-100">
                {note.author_avatar_url ? (
                    <Image
                        src={note.author_avatar_url}
                        alt={note.author_name}
                        width={36}
                        height={36}
                        className="object-cover"
                    />
                ) : (
                    <span className="text-[10px] font-bold text-gray-500">{initials}</span>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-1">
                {/* Header row */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-bold text-corporate-grey truncate">
                            {note.author_name}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium shrink-0">
                            {isMounted
                                ? `${new Date(note.created_at).toLocaleDateString()} ${new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                : ''}
                        </span>
                    </div>
                    {!editing && (
                        <NoteMenu
                            noteId={note.id}
                            applicationId={applicationId}
                            noteText={note.note_text}
                            onEdit={() => setEditing(true)}
                        />
                    )}
                </div>

                {/* Body */}
                {editing ? (
                    <div className="space-y-2">
                        <textarea
                            value={editText}
                            onChange={e => setEditText(e.target.value)}
                            autoFocus
                            rows={3}
                            className="w-full p-3 text-sm bg-white border border-primary/40 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-corporate-grey resize-none transition-all"
                        />
                        <div className="flex items-center gap-2 justify-end">
                            <button
                                onClick={handleCancel}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <X size={12} /> Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !editText.trim()}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-primary to-secondary rounded-lg hover:opacity-90 disabled:opacity-40 transition-all"
                            >
                                <Check size={12} />
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-50 p-3 rounded-2xl rounded-tl-none border border-transparent group-hover:border-gray-100 transition-all">
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {note.note_text}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ApplicationNotes({
    applicationId,
    notes,
}: {
    applicationId: string;
    notes: Note[];
}) {
    const [noteText, setNoteText] = useState('');
    const [sending, setSending] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => { setIsMounted(true); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!noteText.trim() || sending) return;
        setSending(true);
        try {
            await addApplicationNote(applicationId, noteText);
            setNoteText('');
        } catch {
            alert('Error adding note');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="space-y-8">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Internal Notes</h3>

            {/* New note form */}
            <form onSubmit={handleSubmit} className="space-y-3">
                <textarea
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                    placeholder="Start a new thread..."
                    className="w-full h-24 p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-corporate-grey resize-none transition-all"
                />
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={sending || !noteText.trim()}
                        className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-lg text-sm hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {sending ? 'Sending...' : (
                            <>
                                <Send size={14} />
                                Send
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Notes thread */}
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {notes.map(note => (
                    <NoteItem
                        key={note.id}
                        note={note}
                        applicationId={applicationId}
                        isMounted={isMounted}
                    />
                ))}
                {notes.length === 0 && (
                    <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-gray-400 text-sm italic">
                        No internal notes yet. Use the field above to start the conversation.
                    </div>
                )}
            </div>
        </div>
    );
}
