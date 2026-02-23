import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getTechStacks, getSuccessStory } from '../actions';
import SuccessStoryForm from '../SuccessStoryForm';

export default async function EditSuccessStoryPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const [stacks, story] = await Promise.all([
        getTechStacks(),
        getSuccessStory(id)
    ]);

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/success-stories"
                    className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:border-primary hover:text-primary transition-all"
                >
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-corporate-grey">Editar Caso de Éxito</h2>
                    <p className="text-gray-400 text-sm mt-0.5">Modificá los detalles de este caso en el portfolio.</p>
                </div>
            </div>

            <SuccessStoryForm stacks={stacks} initialData={story} />
        </div>
    );
}
