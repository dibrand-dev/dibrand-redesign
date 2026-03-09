'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Edit, Trash2, GripVertical } from 'lucide-react';
import { updateSuccessStoriesOrder } from './actions';
import { useRouter } from 'next/navigation';

interface Story {
    id: string;
    title: string;
    client_company: string;
    industry: string;
    project_type: string;
    created_at: string;
    sort_order: number;
}

interface DraggableStoriesListProps {
    initialStories: Story[];
    industryLabels: Record<string, string>;
    typeLabels: Record<string, string>;
    deleteAction: (id: string) => Promise<void>;
}

export default function DraggableStoriesList({
    initialStories,
    industryLabels,
    typeLabels,
    deleteAction
}: DraggableStoriesListProps) {
    const [stories, setStories] = useState(initialStories);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggingIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        // Add a class for styling if needed
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggingIndex === null || draggingIndex === index) return;

        const newStories = [...stories];
        const draggedItem = newStories[draggingIndex];
        newStories.splice(draggingIndex, 1);
        newStories.splice(index, 0, draggedItem);

        setDraggingIndex(index);
        setStories(newStories);
    };

    const handleDragEnd = async () => {
        setDraggingIndex(null);
        setIsSaving(true);

        try {
            const newOrder = stories.map((s, idx) => ({
                id: s.id,
                sort_order: idx
            }));

            await updateSuccessStoriesOrder(newOrder);
            router.refresh();
        } catch (error) {
            console.error('Failed to save order:', error);
            alert('Error saving order');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-6 py-4 w-10"></th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Título / Cliente</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Industria</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tipo</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Creado</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {stories.map((story, index) => (
                        <tr
                            key={story.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                            className={`transition-colors border-l-2 ${draggingIndex === index ? 'bg-zinc-50 border-brand opacity-50' : 'hover:bg-gray-50/60 border-transparent'
                                }`}
                        >
                            <td className="px-6 py-4 cursor-grab active:cursor-grabbing">
                                <GripVertical size={16} className="text-gray-300" />
                            </td>
                            <td className="px-6 py-4">
                                <div className="font-semibold text-corporate-grey">{story.title}</div>
                                <div className="text-sm text-gray-400">{story.client_company}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                    {industryLabels[story.industry] ?? story.industry ?? '—'}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                    {typeLabels[story.project_type] ?? story.project_type ?? '—'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-400">
                                {new Date(story.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end items-center gap-1">
                                    <Link
                                        href={`/admin/success-stories/${story.id}`}
                                        className="p-2 text-gray-400 hover:text-primary transition-colors rounded-lg hover:bg-gray-100"
                                        title="Editar"
                                    >
                                        <Edit size={16} />
                                    </Link>
                                    <button
                                        onClick={() => {
                                            if (confirm('¿Estás seguro de eliminar este caso?')) {
                                                deleteAction(story.id);
                                            }
                                        }}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                                        title="Eliminar"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isSaving && (
                <div className="fixed bottom-8 right-8 bg-zinc-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-bounce">
                    <span className="text-xs font-bold uppercase tracking-widest">Saving order...</span>
                </div>
            )}
        </div>
    );
}
