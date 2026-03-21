'use client';

import { useState } from 'react';
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';
import { deleteCandidate } from './actions';
import { toast } from 'react-hot-toast';

interface DeleteCandidateButtonProps {
    candidateId: string;
    candidateName: string;
}

export default function DeleteCandidateButton({ candidateId, candidateName }: DeleteCandidateButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteCandidate(candidateId);
            toast.success('Candidato eliminado correctamente');
            setIsOpen(false);
        } catch (error) {
            console.error('Error deleting candidate:', error);
            toast.error('Error al eliminar el candidato');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Eliminar Candidato"
            >
                <Trash2 size={18} />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
                        onClick={() => !isDeleting && setIsOpen(false)}
                    />
                    
                    {/* Modal */}
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                                    <AlertTriangle size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-zinc-900">¿Eliminar candidato?</h3>
                                    <p className="text-sm text-zinc-500 font-medium">Delete candidate?</p>
                                </div>
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    disabled={isDeleting}
                                    className="p-2 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <p className="text-sm text-zinc-600 leading-relaxed">
                                    ¿Estás seguro de que deseas eliminar a <span className="font-bold text-zinc-900">{candidateName}</span>? Esta acción no se puede deshacer.
                                </p>
                                <p className="text-sm text-zinc-500 italic border-l-2 border-zinc-100 pl-4 py-1">
                                    Are you sure you want to delete this candidate? This action cannot be undone.
                                </p>
                            </div>

                            <div className="mt-8 flex items-center gap-3">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl font-bold text-sm transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        'Eliminar'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
