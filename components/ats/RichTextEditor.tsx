'use client'

import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import { Bold, Italic, List, Underline as UnderlineIcon, ListOrdered } from 'lucide-react'

interface RichTextEditorProps {
    content: string
    onChange: (html: string) => void
    placeholder?: string
    disabled?: boolean
    minHeight?: string
    autoFocus?: boolean
}

export default function RichTextEditor({
    content,
    onChange,
    placeholder = 'Escribe una nota privada...',
    disabled = false,
    minHeight = '100px',
    autoFocus = false,
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                // Keep defaults: bold, italic, bulletList, orderedList, etc.
            }),
            Underline,
            Placeholder.configure({
                placeholder,
                emptyEditorClass: 'is-editor-empty',
            }),
        ],
        content,
        editable: !disabled,
        autofocus: autoFocus ? 'end' : false,
        onUpdate({ editor }) {
            // Return empty string if only whitespace/empty paragraphs
            const html = editor.getHTML()
            const isEmpty = editor.isEmpty
            onChange(isEmpty ? '' : html)
        },
        editorProps: {
            attributes: {
                class: 'ats-rich-editor focus:outline-none',
                style: `min-height: ${minHeight}`,
            },
        },
        immediatelyRender: false,
    })

    // Sync external content resets (e.g. after submit)
    React.useEffect(() => {
        if (!editor) return
        // Only reset if editor is empty and content prop is also empty/different
        if (content === '' && !editor.isEmpty) {
            editor.commands.clearContent(true)
        }
    }, [content, editor])

    const ToolbarButton = ({
        onClick,
        active,
        title,
        children,
    }: {
        onClick: () => void
        active: boolean
        title: string
        children: React.ReactNode
    }) => (
        <button
            type="button"
            onMouseDown={(e) => {
                e.preventDefault() // prevent blur
                onClick()
            }}
            title={title}
            className={`w-7 h-7 rounded-md flex items-center justify-center transition-all text-[13px] ${
                active
                    ? 'bg-[#0040A1] text-white shadow-sm'
                    : 'text-slate-400 hover:text-[#0040A1] hover:bg-blue-50'
            }`}
        >
            {children}
        </button>
    )

    if (!editor) return null

    return (
        <div className="ats-rich-editor-wrapper">
            {/* Toolbar */}
            <div className="flex items-center gap-1 px-4 py-2 border-b border-slate-100 bg-slate-50/60 rounded-t-2xl">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive('bold')}
                    title="Negrita (Ctrl+B)"
                >
                    <Bold size={13} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive('italic')}
                    title="Itálica (Ctrl+I)"
                >
                    <Italic size={13} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    active={editor.isActive('underline')}
                    title="Subrayado (Ctrl+U)"
                >
                    <UnderlineIcon size={13} />
                </ToolbarButton>

                <div className="w-px h-4 bg-slate-200 mx-1" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive('bulletList')}
                    title="Lista con viñetas"
                >
                    <List size={13} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    active={editor.isActive('orderedList')}
                    title="Lista numerada"
                >
                    <ListOrdered size={13} />
                </ToolbarButton>
            </div>

            {/* Editor area */}
            <EditorContent editor={editor} className={disabled ? 'opacity-60 pointer-events-none' : ''} />
        </div>
    )
}
