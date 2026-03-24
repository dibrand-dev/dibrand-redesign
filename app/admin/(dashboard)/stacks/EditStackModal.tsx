'use client'

import React, { useState } from 'react';
import { X, Save, Edit2, Loader2 } from 'lucide-react';
import { updateStack } from './actions';
import { useRouter } from 'next/navigation';

interface Props {
    stack: {
        id: string;
        name: string;
        icon_url?: string;
    };
}

export default function EditStackModal({ stack }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState(stack.name);
    const [iconUrl, setIconUrl] = useState(stack.icon_url || '');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await updateStack(stack.id, name, iconUrl);
            setIsOpen(false);
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Error al actualizar');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2.5 text-gray-400 hover:text-[#0040A1] hover:bg-[#F1F5F9] rounded-xl transition-all"
                title="Editar"
            >
                <Edit2 size={18} />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[24px] w-full max-w-md shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-[#F1F5F9] flex items-center justify-between bg-[#F8FAFC]">
                            <h3 className="text-[16px] font-bold text-[#191C1D] flex items-center gap-2">
                                <Edit2 size={20} className="text-[#0040A1]" /> Editar Tecnología
                            </h3>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white rounded-lg transition-colors shadow-sm">
                                <X size={18} className="text-[#737785]" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-[#737785] uppercase tracking-widest">Nombre</label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-[14px] font-medium focus:border-[#0040A1] focus:ring-4 focus:ring-[#0040A1]/5 outline-none transition-all shadow-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-[#737785] uppercase tracking-widest">Icon URL (Opcional)</label>
                                <input
                                    value={iconUrl}
                                    onChange={(e) => setIconUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-[14px] font-medium focus:border-[#0040A1] outline-none transition-all shadow-sm"
                                />
                                <p className="text-[10px] text-[#737785] font-medium">Si se deja vacío, se usará automáticamente Simple Icons.</p>
                            </div>

                            {error && (
                                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[11px] font-bold">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 px-6 py-3 text-[13px] font-bold text-[#737785] hover:text-[#191C1D] transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-[2] bg-[#0040A1] text-white py-3 rounded-xl font-bold text-[13px] hover:bg-[#003380] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    {isLoading ? 'Guardando...' : 'Actualizar Stack'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
