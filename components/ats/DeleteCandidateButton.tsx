'use client';

import React, { useState } from 'react';
import { Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { deleteCandidate } from '@/app/ats/actions';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface Props {
    candidateId: string;
    candidateName: string;
    variant?: 'header' | 'form';
}

export default function DeleteCandidateButton({ candidateId, candidateName, variant = 'header' }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteCandidate(candidateId);
            toast.success('Candidato eliminado permanentemente');
            setIsOpen(false);
            router.push('/ats/candidates');
            router.refresh();
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Error al eliminar el candidato');
            setIsDeleting(false);
        }
    };

    if (variant === 'form') {
        return (
            <>
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="px-8 py-3 bg-red-600 text-white rounded-xl text-[13px] font-black shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all flex items-center gap-2"
                >
                    <Trash2 size={16} /> Eliminar Candidato
                </button>

                {isOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-[24px] w-full max-w-[400px] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
                            <div className="flex items-center gap-3 text-red-600 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                                    <AlertCircle size={24} />
                                </div>
                                <div>
                                    <h4 className="text-[18px] font-black leading-none mb-1">¿Eliminar Candidato?</h4>
                                    <p className="text-[12px] font-bold text-red-400">Esta acción es irreversible</p>
                                </div>
                            </div>

                            <p className="text-[14px] font-medium text-slate-600 mb-8 leading-relaxed">
                                ¿Estás seguro de que deseas eliminar permanentemente a <span className="font-bold text-slate-900">{candidateName}</span>? Se borrarán todos sus datos y notas del sistema.
                            </p>

                            <div className="flex justify-end gap-3">
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    disabled={isDeleting}
                                    className="px-6 py-2.5 text-[14px] font-black text-slate-500 hover:text-slate-900 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="px-8 py-2.5 bg-red-600 text-white rounded-xl text-[14px] font-black shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all flex items-center gap-2"
                                >
                                    {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                    Confirmar Eliminación
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                className="h-[42px] px-4 border border-red-100 bg-white rounded-xl text-[13px] font-bold text-red-500 hover:bg-red-50 shadow-sm transition-all flex items-center gap-2"
                title="Eliminar Candidato"
            >
                <Trash2 size={16} />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[24px] w-full max-w-[400px] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 text-red-600 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                                <AlertCircle size={24} />
                            </div>
                            <div>
                                <h4 className="text-[18px] font-black leading-none mb-1">¿Eliminar Candidato?</h4>
                                <p className="text-[12px] font-bold text-red-400">Esta acción es irreversible</p>
                            </div>
                        </div>

                        <p className="text-[14px] font-medium text-slate-600 mb-8 leading-relaxed">
                            ¿Estás seguro de que deseas eliminar permanentemente a <span className="font-bold text-slate-900">{candidateName}</span>? Se borrarán todos sus datos y notas del sistema.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setIsOpen(false)}
                                disabled={isDeleting}
                                className="px-6 py-2.5 text-[14px] font-black text-slate-500 hover:text-slate-900 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-8 py-2.5 bg-red-600 text-white rounded-xl text-[14px] font-black shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all flex items-center gap-2"
                            >
                                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                Confirmar Eliminación
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
