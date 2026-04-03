'use client';

import React, { useState, useTransition } from 'react';
import { ChevronDown, Check, Loader2, X, AlertCircle } from 'lucide-react';
import { ATS_STAGES, getStageConfig, STAGE_CONFIG } from '@/lib/ats-constants';
import StagePill from './StagePill';
import { updateCandidateStatus, rejectCandidate } from '@/app/ats/actions';
import { useRouter } from 'next/navigation';

interface Props {
    candidateId: string;
    currentStatus: string;
}

export default function ProcessActionsWidget({ candidateId, currentStatus }: Props) {
    const [open, setOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [selected, setSelected] = useState(currentStatus);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const currentStage = getStageConfig(selected);

    function handleSelect(stageValue: string) {
        if (stageValue === selected) {
            setOpen(false);
            return;
        }
        setOpen(false);
        startTransition(async () => {
            setSelected(stageValue);
            await updateCandidateStatus(candidateId, stageValue);
            router.refresh();
        });
    }

    const handleReject = () => {
        if (!rejectionReason.trim()) return;
        setIsRejectModalOpen(false);
        startTransition(async () => {
            setSelected('Rejected');
            await rejectCandidate(candidateId, rejectionReason);
            setRejectionReason('');
            router.refresh();
        });
    };

    return (
        <div className="bg-white rounded-[20px] shadow-sm border border-slate-200/60 p-6">
            <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-5">
                Acciones del Proceso
            </h3>

            {/* Current Stage Display */}
            <div className="mb-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Etapa Actual</p>
                <StagePill status={selected} />
            </div>

            <div className="space-y-3">
                {/* Stage Selector */}
                <div className="relative">
                    <button
                        onClick={() => setOpen(!open)}
                        disabled={isPending}
                        className="w-full flex items-center justify-between px-4 py-3 bg-[#EEF2FF] hover:bg-blue-100 border border-blue-100 text-[#0040A1] rounded-xl font-extrabold text-[13px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <span className="flex items-center gap-2">
                            {isPending && selected !== 'Rejected' ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : null}
                            Mover a Etapa
                        </span>
                        <ChevronDown size={16} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                    </button>

                    {open && (
                        <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                            {ATS_STAGES.map((stage) => {
                                const isActive = stage.value.toLowerCase() === selected?.toLowerCase();
                                return (
                                    <button
                                        key={stage.value}
                                        onClick={() => handleSelect(stage.value)}
                                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors text-left group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${stage.twText.replace('text-', 'bg-')}`}
                                            />
                                            <span
                                                className={`text-[13px] font-bold ${isActive ? stage.twText : 'text-[#191C1D]'}`}
                                            >
                                                {stage.label}
                                            </span>
                                        </div>
                                        {isActive && (
                                            <Check size={14} className={stage.twText} />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Reject Button */}
                <button 
                    onClick={() => setIsRejectModalOpen(true)}
                    disabled={isPending || selected === 'Rejected'}
                    className="w-full flex items-center justify-between px-4 py-3 border border-red-200 hover:bg-red-50 text-red-600 rounded-xl font-extrabold text-[13px] transition-colors h-[46px] disabled:opacity-50"
                >
                    <span className="flex items-center gap-2">
                        {isPending && selected === 'Rejected' && <Loader2 size={14} className="animate-spin" />}
                        Desestimar Candidato
                    </span>
                    <X size={16} />
                </button>
            </div>

            {/* Backdrop to close dropdown */}
            {open && (
                <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            )}

            {/* Reject Reason Modal */}
            {isRejectModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[24px] w-full max-w-[400px] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 text-red-600 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                                <AlertCircle size={24} />
                            </div>
                            <div>
                                <h4 className="text-[18px] font-black leading-none mb-1">Desestimar Candidato</h4>
                                <p className="text-[12px] font-bold text-red-400">Por favor, explica el motivo</p>
                            </div>
                        </div>

                        <textarea
                            autoFocus
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Ej: No cumple con el seniority técnico requerido para el rol..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-[14px] font-medium text-slate-700 focus:ring-4 focus:ring-red-100 focus:border-red-600 outline-none min-h-[120px] resize-none mb-6"
                        />

                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setIsRejectModalOpen(false)}
                                className="px-6 py-2.5 text-[14px] font-black text-slate-500 hover:text-slate-900 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleReject}
                                disabled={!rejectionReason.trim()}
                                className="px-8 py-2.5 bg-red-600 text-white rounded-xl text-[14px] font-black shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all disabled:opacity-50"
                            >
                                Confirmar Rechazo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
