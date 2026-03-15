'use client'

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { createStack } from './actions';
import { useRouter } from 'next/navigation';

export default function StackForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        
        try {
            await createStack(formData);
            // Reset form
            (e.target as HTMLFormElement).reset();
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Error al agregar la tecnología');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-admin-card-bg p-6 rounded-2xl border border-admin-border shadow-sm sticky top-24">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Plus size={16} className="text-admin-accent" />
                Nueva Tecnología
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-admin-text-secondary uppercase tracking-wider ml-1">Nombre</label>
                    <input
                        name="name"
                        type="text"
                        required
                        disabled={isLoading}
                        className="w-full px-4 py-2.5 rounded-xl border border-admin-border focus:ring-4 focus:ring-admin-accent/5 focus:border-admin-accent outline-none transition-all font-medium text-sm bg-admin-bg/50 disabled:opacity-50"
                        placeholder="Ej. React, Node.js, Python"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-admin-text-secondary uppercase tracking-wider ml-1">Icon URL (Opcional)</label>
                    <input
                        name="icon_url"
                        type="text"
                        disabled={isLoading}
                        className="w-full px-4 py-2.5 rounded-xl border border-admin-border focus:ring-4 focus:ring-admin-accent/5 focus:border-admin-accent outline-none transition-all font-medium text-sm bg-admin-bg/50 disabled:opacity-50"
                        placeholder="https://..."
                    />
                </div>

                {error && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold animate-in fade-in slide-in-from-top-1">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-admin-accent text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-admin-accent/20 active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
                >
                    {isLoading ? 'Cargando...' : 'Agregar Stack'}
                </button>
            </form>
        </div>
    );
}
