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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-corporate-grey">Success Stories</h2>
                    <p className="text-gray-500 mt-1">Gestioná los casos de éxito del portfolio con Drag & Drop.</p>
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
