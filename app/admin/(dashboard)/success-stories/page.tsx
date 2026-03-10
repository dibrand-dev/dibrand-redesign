import React from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { getSuccessStories, deleteSuccessStory } from './actions';
import { revalidatePath } from 'next/cache';

const INDUSTRY_LABELS: Record<string, string> = {
    media: 'Media', fintech: 'Fintech', ecommerce: 'E-commerce',
    gov: 'Gov', saas: 'SaaS', healthcare: 'Healthcare',
    FoodBeverage: 'Food & Beverage', 'Food & Beverage': 'Food & Beverage',
    SportsRetail: 'Sports & Retail', 'Sports & Retail': 'Sports & Retail',
    Web3NFT: 'Web3 & NFT', 'Web3 & NFT': 'Web3 & NFT'
};
const TYPE_LABELS: Record<string, string> = {
    webapp: 'Web App', mobileapp: 'Mobile App', plataforma: 'Plataforma',
    migracion: 'Migración', otro: 'Otro',
    'Branding & Identity': 'Branding & Identity',
    'E-commerce Platform': 'E-commerce Platform',
    '3D Animation & Motion Graphics': '3D Animation & Motion Graphics',
    'Staff Augmentation': 'Staff Augmentation'
};

// Server actions for toggle/delete (inline form actions)

import DraggableStoriesList from './DraggableStoriesList';

async function handleDelete(id: string) {
    'use server';
    await deleteSuccessStory(id);
    revalidatePath('/admin/success-stories');
}

export default async function SuccessStoriesPage() {
    const stories = await getSuccessStories();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-admin-text-primary tracking-tight">Success Stories</h2>
                    <p className="text-admin-text-secondary text-sm mt-1 font-medium italic">Gestioná los casos de éxito del portfolio con Drag & Drop.</p>
                </div>
                <Link
                    href="/admin/success-stories/new"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-admin-accent text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-admin-accent/25 hover:-translate-y-0.5"
                >
                    <Plus size={18} /> Crear Nuevo Caso
                </Link>
            </div>

            {/* Table */}
            <div className="bg-admin-card-bg rounded-2xl shadow-sm border border-admin-border overflow-hidden">
                {stories.length === 0 ? (
                    <div className="py-20 text-center text-admin-text-secondary text-sm italic font-medium">
                        No hay casos de éxito aún. ¡Crea el primero!
                    </div>
                ) : (
                    <DraggableStoriesList
                        initialStories={stories}
                        industryLabels={INDUSTRY_LABELS}
                        typeLabels={TYPE_LABELS}
                        deleteAction={handleDelete}
                    />
                )}
            </div>
        </div>
    );
}
