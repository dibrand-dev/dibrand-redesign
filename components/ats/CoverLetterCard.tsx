'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Pencil, Loader2, Check, X } from 'lucide-react';
import { updateCoverLetter } from '@/app/ats/actions';
import { useRouter } from 'next/navigation';
import RichTextEditor from './RichTextEditor';

interface Props {
    candidateId: string;
    initialContent: string | null;
}

function hasHtmlTags(str: string): boolean {
    return /<[a-z][\s\S]*>/i.test(str);
}

export default function CoverLetterCard({ candidateId, initialContent }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(initialContent || '');
    const [draftContent, setDraftContent] = useState(initialContent || '');
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    useEffect(() => {
        setContent(initialContent || '');
        setDraftContent(initialContent || '');
    }, [initialContent]);

    const handleSave = () => {
        startTransition(async () => {
            try {
                await updateCoverLetter(candidateId, draftContent);
                setContent(draftContent);
                setIsEditing(false);
                router.refresh();
            } catch (error) {
                console.error('Failed to update cover letter:', error);
            }
        });
    };

    const handleCancel = () => {
        setDraftContent(content);
        setIsEditing(false);
    };

    const handleStartEdit = () => {
        setDraftContent(content);
        setIsEditing(true);
    };

    const isHtml = hasHtmlTags(content);

    return (
        <div 
            className="bg-white rounded-[20px] shadow-sm border border-slate-200/60 p-6 md:p-8 font-outfit"
            style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-[18px] font-bold text-slate-900 leading-tight">Cover letter</h3>
                    <p className="text-[12px] text-slate-500 font-medium mt-0.5">
                        Perfil profesional y carta de presentación del candidato
                    </p>
                </div>

                {!isEditing ? (
                    <button 
                        onClick={handleStartEdit}
                        className="flex items-center gap-1.5 text-[#9e4d97] text-[13px] font-bold hover:text-[#7d3b77] transition-colors shrink-0 px-3 py-1.5 rounded-lg hover:bg-[#9e4d97]/10"
                    >
                        <Pencil size={14} /> Editar
                    </button>
                ) : (
                    <div className="flex items-center gap-3 shrink-0">
                        <button 
                            onClick={handleCancel}
                            disabled={isPending}
                            className="flex items-center gap-1 text-slate-500 text-[13px] font-bold hover:text-slate-700 transition-colors disabled:opacity-50 px-3 py-1.5 rounded-lg hover:bg-slate-100"
                        >
                            <X size={14} /> Cancelar
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={isPending}
                            className="flex items-center gap-1.5 bg-[#9e4d97] text-white text-[13px] font-bold hover:bg-[#7d3b77] transition-all disabled:opacity-50 px-4 py-1.5 rounded-lg shadow-sm"
                        >
                            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                            Guardar
                        </button>
                    </div>
                )}
            </div>

            {/* Content Area */}
            {isEditing ? (
                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                    <RichTextEditor 
                        content={draftContent}
                        onChange={(html) => setDraftContent(html)}
                        minHeight="220px"
                        placeholder="Escribe o edita la carta de presentación aquí..."
                        autoFocus
                    />
                </div>
            ) : (
                <div 
                    className="p-6 md:p-8 bg-slate-50/70 border border-slate-200/80 rounded-2xl min-h-[120px] transition-all"
                    style={{ 
                        width: '100%', 
                        maxWidth: '100%', 
                        overflowX: 'hidden'
                    }}
                >
                    {content ? (
                        isHtml ? (
                            <div 
                                className="font-outfit text-[14px] text-slate-700 leading-relaxed
                                           [&_h3]:text-[12px] [&_h3]:font-black [&_h3]:text-[#9e4d97] [&_h3]:uppercase [&_h3]:tracking-wider [&_h3]:mt-6 [&_h3]:mb-2 [&_h3:first-child]:mt-0
                                           [&_p]:mb-2 [&_p]:leading-relaxed
                                           [&_strong]:font-bold [&_strong]:text-slate-900
                                           [&_a]:text-[#0040A1] [&_a]:underline [&_a]:font-medium hover:[&_a]:text-[#003380] [&_a]:break-all
                                           [&_hr]:my-5 [&_hr]:border-slate-200
                                           [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3
                                           [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3
                                           [&_li]:mb-1"
                                dangerouslySetInnerHTML={{ __html: content }}
                            />
                        ) : (
                            <div className="font-outfit text-[14px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                                {content}
                            </div>
                        )
                    ) : (
                        <div className="text-slate-400 italic font-outfit text-[14px] py-4 text-center">
                            No se ha registrado una carta de presentación para este candidato.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
