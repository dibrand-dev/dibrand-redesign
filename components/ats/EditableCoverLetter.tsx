'use client';

import React, { useState } from 'react';
import { updateCandidate } from '@/app/ats/actions';
import { Loader2, Save, X } from 'lucide-react';

interface EditableCoverLetterProps {
    candidateId: string;
    initialContent: string;
}

export default function EditableCoverLetter({ candidateId, initialContent }: EditableCoverLetterProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(initialContent);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateCandidate(candidateId, { cover_letter: content });
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving cover letter:', error);
            alert('Failed to save cover letter.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <section className="bg-white rounded-[12px] p-8 border border-[#E2E8F0] shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col gap-1">
                    <h3 className="text-[11px] font-black text-[#6B7485] uppercase tracking-[0.2em]">Cover Letter</h3>
                    <div className="flex items-center gap-4 text-[#A1A5B7] mt-2">
                        <button className="hover:text-[#191C1D] transition-colors font-serif font-bold italic">B</button>
                        <button className="hover:text-[#191C1D] transition-colors italic">I</button>
                        <button className="hover:text-[#191C1D] transition-colors underline">U</button>
                        <div className="w-px h-4 bg-[#E1E2E5]" />
                        <button className="hover:text-[#191C1D] transition-colors text-[10px]">LIST</button>
                    </div>
                </div>
                {!isEditing ? (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="text-[11px] font-bold text-[#0040A1] hover:underline uppercase tracking-widest"
                    >
                        Edit
                    </button>
                ) : (
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => { setIsEditing(false); setContent(initialContent); }}
                            className="text-[11px] font-bold text-[#BA1A1A] hover:underline uppercase tracking-widest flex items-center gap-1"
                        >
                            <X size={14} /> Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className="text-[11px] font-bold text-[#0040A1] hover:underline uppercase tracking-widest flex items-center gap-1 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={14} />} 
                            Save
                        </button>
                    </div>
                )}
            </div>

            {isEditing ? (
                <textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-8 bg-[#F8FAFC] border border-[#0040A1] rounded-2xl min-h-[300px] text-[14px] leading-relaxed text-[#424654] font-medium focus:outline-none transition-all shadow-inner"
                    placeholder="Write the cover letter here..."
                />
            ) : (
                <div className="p-8 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl min-h-[200px] text-[14px] leading-relaxed text-[#424654] font-medium whitespace-pre-wrap">
                    {content || "No cover letter provided."}
                </div>
            )}
        </section>
    );
}
