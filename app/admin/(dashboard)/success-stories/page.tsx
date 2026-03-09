import React from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { getSuccessStories, deleteSuccessStory } from './actions';
import { revalidatePath } from 'next/cache';

const INDUSTRY_LABELS: Record<string, string> = {
    media: 'Media', fintech: 'Fintech', ecommerce: 'E-commerce',
    gov: 'Gov', saas: 'SaaS', healthcare: 'Healthcare',
    FoodBeverage: 'Food & Beverage', 'Food & Beverage': 'Food & Beverage',
    SportsRetail: 'Sports & Retail', 'Sports & Retail': 'Sports & Retail'
};
const TYPE_LABELS: Record<string, string> = {
    webapp: 'Web App', mobileapp: 'Mobile App', plataforma: 'Plataforma',
    migracion: 'Migración', otro: 'Otro',
    'Branding & Identity': 'Branding & Identity',
    'E-commerce Platform': 'E-commerce Platform',
    '3D Animation & Motion Graphics': '3D Animation & Motion Graphics'
};

// Server actions for toggle/delete (inline form actions)

async function handleDelete(id: string) {
    'use server';
    await deleteSuccessStory(id);
    revalidatePath('/admin/success-stories');
}

export default async function SuccessStoriesPage() {
    const stories = await getSuccessStories();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-corporate-grey">Success Stories</h2>
                    <p className="text-gray-500 mt-1">Gestioná los casos de éxito del portfolio.</p>
                </div>
                <Link
                    href="/admin/success-stories/new"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-sm"
                >
                    <Plus size={16} /> Crear Nuevo Caso
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {stories.length === 0 ? (
                    <div className="py-20 text-center text-gray-400 text-sm italic">
                        No hay casos de éxito aún. ¡Crea el primero!
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Título / Cliente</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Industria</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tipo</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Creado</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {stories.map((story) => (
                                    <tr key={story.id} className="hover:bg-gray-50/60 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-corporate-grey">{story.title}</div>
                                            <div className="text-sm text-gray-400">{story.client_company}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                                {INDUSTRY_LABELS[story.industry] ?? story.industry ?? '—'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                                {TYPE_LABELS[story.project_type] ?? story.project_type ?? '—'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400" suppressHydrationWarning>
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
                                                <form action={handleDelete.bind(null, story.id)}>
                                                    <button
                                                        type="submit"
                                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
