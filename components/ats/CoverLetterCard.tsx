'use client';

import React, { useState, useTransition } from 'react';
import { Pencil, Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon, Loader2 } from 'lucide-react';
import { updateCoverLetter } from '@/app/ats/actions';
import { useRouter } from 'next/navigation';

interface Props {
    candidateId: string;
    initialContent: string | null;
}

export default function CoverLetterCard({ candidateId, initialContent }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(initialContent || '');
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSave = () => {
        startTransition(async () => {
            try {
                await updateCoverLetter(candidateId, content);
                setIsEditing(false);
                router.refresh();
            } catch (error) {
                console.error('Failed to update cover letter:', error);
            }
        });
    };

    const handleCancel = () => {
        setContent(initialContent || '');
        setIsEditing(false);
    };

    return (
        <div 
            className="bg-white rounded-[20px] shadow-sm border border-slate-200/60 p-4 md:p-8"
            style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}
        >
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-[18px] font-extrabold text-slate-900">Cover Letter</h3>
                {!isEditing ? (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 text-blue-600 text-[13px] font-bold hover:text-blue-800 transition-colors shrink-0"
                    >
                        <Pencil size={14} /> Edit
                    </button>
                ) : (
                    <div className="flex gap-4 shrink-0">
                        <button 
                            onClick={handleCancel}
                            disabled={isPending}
                            className="text-slate-500 text-[13px] font-bold hover:text-slate-700 transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={isPending}
                            className="flex items-center gap-2 text-blue-600 text-[13px] font-bold hover:text-blue-800 transition-colors disabled:opacity-50"
                        >
                            {isPending && <Loader2 size={14} className="animate-spin" />}
                            Guardar
                        </button>
                    </div>
                )}
            </div>

            {/* Editor Toolbar */}
            <div className="flex flex-wrap gap-2 md:gap-4 p-2.5 bg-slate-100 rounded-xl mb-6 text-slate-500 items-center">
                <button className="p-1 rounded hover:bg-slate-200 text-slate-700"><Bold size={16} /></button>
                <button className="p-1 rounded hover:bg-slate-200"><Italic size={16} /></button>
                <button className="p-1 rounded hover:bg-slate-200"><Underline size={16} /></button>
                <div className="hidden md:block w-px h-5 bg-slate-300 mx-2"></div>
                <button className="p-1 rounded hover:bg-slate-200"><List size={16} /></button>
                <button className="p-1 rounded hover:bg-slate-200"><ListOrdered size={16} /></button>
                <div className="hidden md:block w-px h-5 bg-slate-300 mx-2"></div>
                <button className="p-1 rounded hover:bg-slate-200"><LinkIcon size={16} /></button>
            </div>

            {isEditing ? (
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-4 md:p-8 bg-slate-50 rounded-2xl text-[14px] text-slate-700 leading-chill font-medium border-none focus:ring-2 focus:ring-blue-100 min-h-[300px] outline-none"
                    placeholder="Escribe la carta de presentación aquí..."
                    style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}
                />
            ) : (
                <div 
                    className="p-4 md:p-8 bg-slate-50 rounded-2xl text-[14px] text-slate-700 leading-chill font-medium min-h-[100px]"
                    style={{ 
                        width: '100%', 
                        maxWidth: '100%', 
                        overflowX: 'hidden',
                        wordBreak: 'break-all',
                        overflowWrap: 'break-word',
                        whiteSpace: 'pre-wrap'
                    }}
                >
                    {content || <span className="text-slate-400 italic">No cover letter provided.</span>}
                </div>
            )}
        </div>
    );
}
