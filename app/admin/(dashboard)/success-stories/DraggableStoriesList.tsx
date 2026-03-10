'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, GripVertical, MoreHorizontal, ArrowUpDown, Search, Filter } from 'lucide-react';
import { updateSuccessStoriesOrder } from './actions';

interface Story {
    id: string;
    title: string;
    client_company: string;
    industry: string;
    project_type: string;
    created_at: string;
    sort_order?: number;
    is_published?: boolean; // Added for status badges
}

interface DraggableStoriesListProps {
    initialStories: Story[];
    industryLabels: Record<string, string>;
    typeLabels: Record<string, string>;
    deleteAction: (id: string) => Promise<void>;
}

function DateDisplay({ dateString }: { dateString: string }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return <span className="opacity-0">—</span>;
    return <span>{new Date(dateString).toLocaleDateString('en-GB')}</span>;
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
    const [searchTerm, setSearchTerm] = useState('');
    const [filterIndustry, setFilterIndustry] = useState('all');
    const router = useRouter();

    const filteredStories = stories.filter((s: Story) => {
        const matchesSearch = (s.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.client_company || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesIndustry = filterIndustry === 'all' || s.industry === filterIndustry;
        return matchesSearch && matchesIndustry;
    });

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
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-admin-card-bg p-4 rounded-xl border border-admin-border shadow-sm">
                <div className="flex items-center gap-4 flex-1 w-full">
                    <div className="relative flex-1 max-w-sm group">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-admin-accent" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar por título o cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-admin-bg border border-transparent rounded-lg text-sm focus:outline-none focus:bg-admin-card-bg focus:border-admin-accent/30 transition-all font-medium"
                        />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-admin-bg border border-transparent rounded-lg text-xs font-bold text-admin-text-secondary uppercase tracking-wider group focus-within:border-admin-border cursor-pointer">
                        <Filter size={14} className="text-gray-400" />
                        <select
                            value={filterIndustry}
                            onChange={(e) => setFilterIndustry(e.target.value)}
                            className="bg-transparent outline-none cursor-pointer"
                        >
                            <option value="all" className="bg-admin-card-bg">Industrias</option>
                            {Object.entries(industryLabels).map(([val, label]) => (
                                <option key={val} value={val} className="bg-admin-card-bg">{label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{filteredStories.length} Casos Encontrados</span>
                </div>
            </div>

            <div className="bg-admin-card-bg rounded-xl border border-admin-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-admin-bg/50 border-b border-admin-border">
                                <th className="pl-6 py-4 w-12"></th>
                                <th className="px-4 py-4">
                                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                        Título y Proyecto
                                        <ArrowUpDown size={12} />
                                    </div>
                                </th>
                                <th className="px-4 py-4">
                                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                        Industria
                                    </div>
                                </th>
                                <th className="px-4 py-4">
                                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                        Status
                                    </div>
                                </th>
                                <th className="px-4 py-4">
                                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                        Fecha
                                    </div>
                                </th>
                                <th className="pr-6 py-4 text-right">
                                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                        Acciones
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-admin-border">
                            {filteredStories.map((story, index) => (
                                <tr
                                    key={story.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDragEnd={handleDragEnd}
                                    className={`group transition-all duration-200 ${draggingIndex === index
                                        ? 'bg-admin-accent/5 ring-2 ring-admin-accent/20 opacity-50'
                                        : 'hover:bg-admin-bg/30'
                                        }`}
                                >
                                    <td className="pl-6 py-5 cursor-grab active:cursor-grabbing">
                                        <div className="p-1.5 rounded-md hover:bg-admin-bg transition-colors">
                                            <GripVertical size={16} className="text-gray-300 group-hover:text-gray-400" />
                                        </div>
                                    </td>
                                    <td className="px-4 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-admin-text-primary group-hover:text-admin-accent transition-colors">
                                                {story.title}
                                            </span>
                                            <span className="text-[11px] text-gray-400 font-medium tracking-tight">
                                                {story.client_company}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-5">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[11px] font-bold text-gray-500">
                                                {industryLabels[story.industry] ?? story.industry ?? '—'}
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-medium">
                                                {typeLabels[story.project_type] ?? story.project_type ?? '—'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-5">
                                        {story.is_published !== false ? (
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                <span className="text-[10px] font-bold uppercase tracking-wider">Publicado</span>
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20 shadow-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                                                <span className="text-[10px] font-bold uppercase tracking-wider">Borrador</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-semibold text-gray-500">
                                                <DateDisplay dateString={story.created_at} />
                                            </span>
                                        </div>
                                    </td>
                                    <td className="pr-6 py-5 text-right">
                                        <div className="flex justify-end items-center gap-2">
                                            <Link
                                                href={`/admin/success-stories/${story.id}`}
                                                className="p-2 text-gray-400 hover:text-admin-accent transition-all rounded-lg hover:bg-admin-accent/5"
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
                                                className="p-2 text-gray-400 hover:text-red-500 transition-all rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <button className="p-2 text-gray-300 hover:text-gray-500 transition-all">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isSaving && (
                <div className="fixed bottom-8 right-8 bg-zinc-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-bounce">
                    <span className="text-xs font-bold uppercase tracking-widest">Saving order...</span>
                </div>
            )}
        </div>
    );
}
