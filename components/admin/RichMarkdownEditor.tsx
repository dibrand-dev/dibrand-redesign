'use client';

import React, { useRef } from 'react';
import {
    Bold,
    Italic,
    Link as LinkIcon,
    List,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify
} from 'lucide-react';

interface RichMarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
}

export default function RichMarkdownEditor({ value, onChange, label, placeholder }: RichMarkdownEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const insertText = (before: string, after: string = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);
        const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);

        onChange(newText);

        // Reset cursor position after state update
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + before.length + selectedText.length + after.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    const handleBold = () => insertText('**', '**');
    const handleItalic = () => insertText('*', '*');
    const handleLink = () => {
        const url = prompt('Enter URL:');
        if (url) insertText('[', `](${url})`);
    };
    const handleList = () => insertText('\n- ', '');

    // Alignment using HTML tags for Markdown rendering
    const handleAlign = (align: 'left' | 'center' | 'right' | 'justify') => {
        if (align === 'left') {
            insertText('<div align="left">\n', '\n</div>');
        } else if (align === 'center') {
            insertText('<div align="center">\n', '\n</div>');
        } else if (align === 'right') {
            insertText('<div align="right">\n', '\n</div>');
        } else if (align === 'justify') {
            insertText('<div style="text-align: justify">\n', '\n</div>');
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                {label && <label className="text-sm font-semibold text-gray-700">{label}</label>}
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Rich Text / Markdown</span>
            </div>

            <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-sm">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
                    <ToolbarButton onClick={handleBold} title="Bold"><Bold size={16} /></ToolbarButton>
                    <ToolbarButton onClick={handleItalic} title="Italic"><Italic size={16} /></ToolbarButton>
                    <div className="w-px h-6 bg-gray-300 mx-1" />
                    <ToolbarButton onClick={handleLink} title="Link"><LinkIcon size={16} /></ToolbarButton>
                    <ToolbarButton onClick={handleList} title="Bullet List"><List size={16} /></ToolbarButton>
                    <div className="w-px h-6 bg-gray-300 mx-1" />
                    <ToolbarButton onClick={() => handleAlign('left')} title="Align Left"><AlignLeft size={16} /></ToolbarButton>
                    <ToolbarButton onClick={() => handleAlign('center')} title="Align Center"><AlignCenter size={16} /></ToolbarButton>
                    <ToolbarButton onClick={() => handleAlign('right')} title="Align Right"><AlignRight size={16} /></ToolbarButton>
                    <ToolbarButton onClick={() => handleAlign('justify')} title="Align Justify"><AlignJustify size={16} /></ToolbarButton>
                </div>

                {/* Editor Area */}
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={10}
                    className="w-full px-4 py-3 outline-none font-mono text-sm resize-y min-h-[200px]"
                />
            </div>
        </div>
    );
}

function ToolbarButton({ onClick, children, title }: { onClick: () => void; children: React.ReactNode; title: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className="p-1.5 hover:bg-white hover:shadow-sm rounded text-gray-600 hover:text-primary transition-all"
        >
            {children}
        </button>
    );
}
