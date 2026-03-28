'use client';

import React, { useState, useTransition } from 'react';
import { ChevronDown, Check, Loader2 } from 'lucide-react';
import { ATS_STAGES } from '@/lib/ats-constants';
import { updateCandidateStatus } from '@/app/ats/actions';
import { useRouter } from 'next/navigation';

interface Props {
    candidateId: string;
    currentStatus: string;
}

export default function ProcessActionsWidget({ candidateId, currentStatus }: Props) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(currentStatus);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const currentStage = ATS_STAGES.find(s => s.value.toLowerCase() === selected?.toLowerCase()) || ATS_STAGES[1];

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

    return (
        <div className="bg-white rounded-[20px] shadow-sm border border-slate-200/60 p-6">
            <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-5">
                Process Actions
            </h3>

            {/* Current Stage Display */}
            <div className="mb-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Current Stage</p>
                <div
                    className="flex items-center gap-2 px-3 py-2 rounded-lg w-fit"
                    style={{ backgroundColor: currentStage.bg, color: currentStage.color }}
                >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentStage.color }} />
                    <span className="text-[12px] font-black uppercase tracking-widest">{currentStage.label}</span>
                </div>
            </div>

            {/* Stage Selector */}
            <div className="relative mb-3">
                <button
                    onClick={() => setOpen(!open)}
                    disabled={isPending}
                    className="w-full flex items-center justify-between px-4 py-3 bg-[#EEF2FF] hover:bg-blue-100 border border-blue-100 text-[#0040A1] rounded-xl font-extrabold text-[13px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <span className="flex items-center gap-2">
                        {isPending ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : null}
                        Move to Stage
                    </span>
                    <ChevronDown size={16} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                </button>

                {open && (
                    <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
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
                                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: stage.color }}
                                        />
                                        <span
                                            className="text-[13px] font-bold"
                                            style={{ color: isActive ? stage.color : '#191C1D' }}
                                        >
                                            {stage.label}
                                        </span>
                                    </div>
                                    {isActive && (
                                        <Check size={14} style={{ color: stage.color }} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Backdrop to close dropdown */}
            {open && (
                <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            )}
        </div>
    );
}
