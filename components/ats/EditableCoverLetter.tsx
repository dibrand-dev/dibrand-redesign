'use client';

import React, { useState, useEffect } from 'react';
import { updateCandidate } from '@/app/ats/actions';
import { Loader2, Save, X, Bold, Italic, List, Underline as UnderlineIcon } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import BulletList from '@tiptap/extension-bullet-list';

interface EditableCoverLetterProps {
    candidateId: string;
    initialContent: string;
}

export default function EditableCoverLetter({ candidateId, initialContent }: EditableCoverLetterProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Underline,
        ],
        content: initialContent || '<p>Dynamic professional with a proven track record. Passionate about creating impact through high-performance engineering.</p>',
        editorProps: {
            attributes: {
                class: 'prose prose-sm focus:outline-none max-w-none min-h-[300px] p-8 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl text-[15px] leading-relaxed text-[#424654] font-medium whitespace-pre-wrap',
            },
        },
    });

    // Update editor content if initialContent changes
    useEffect(() => {
        if (editor && initialContent && !isEditing) {
            editor.commands.setContent(initialContent);
        }
    }, [initialContent, editor, isEditing]);

    if (!editor) return null;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const html = editor.getHTML();
            // We'll try to save to cover_letter, but if it fails, the user might need to add the column
            await updateCandidate(candidateId, { cover_letter: html });
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving cover letter:', error);
            alert('Failed to save cover letter. Ensure the "cover_letter" column exists in the "job_applications" table.');
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
                        <button 
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={`hover:text-[#191C1D] transition-colors ${editor.isActive('bold') ? 'text-[#0040A1]' : ''}`}
                        >
                            <Bold size={18} />
                        </button>
                        <button 
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={`hover:text-[#191C1D] transition-colors ${editor.isActive('italic') ? 'text-[#0040A1]' : ''}`}
                        >
                            <Italic size={18} />
                        </button>
                        <button 
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            className={`hover:text-[#191C1D] transition-colors ${editor.isActive('underline') ? 'text-[#0040A1]' : ''}`}
                        >
                            <UnderlineIcon size={18} />
                        </button>
                        <div className="w-px h-4 bg-[#E1E2E5]" />
                        <button 
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            className={`hover:text-[#191C1D] transition-colors ${editor.isActive('bulletList') ? 'text-[#0040A1]' : ''}`}
                        >
                            <List size={18} />
                        </button>
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
                            onClick={() => { setIsEditing(false); editor.commands.setContent(initialContent); }}
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
                <EditorContent editor={editor} className="editor-container" />
            ) : (
                <div className="p-8 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl min-h-[150px] text-[15px] leading-relaxed text-[#424654] font-medium prose prose-sm max-w-none whitespace-pre-wrap">
                    <div dangerouslySetInnerHTML={{ __html: initialContent || "No cover letter provided." }} />
                </div>
            )}
        </section>
    );
}
