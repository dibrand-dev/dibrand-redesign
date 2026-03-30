'use client';

import React from 'react';
import { Check, Star } from 'lucide-react';
import { ATS_STAGES, getStageConfig } from '@/lib/ats-constants';

interface Props {
    currentStatus: string;
    hasVetting?: boolean;
}

export default function CandidatePipelineTracker({ currentStatus, hasVetting }: Props) {
    const config = getStageConfig(currentStatus);
    const currentIndex = ATS_STAGES.findIndex(s => s.value === config.value);
    
    // Default to "Applied" (index 0) if not found
    const activeIndex = currentIndex >= 0 ? currentIndex : 0;

    // Calculate progress line width %
    const progressPct = ATS_STAGES.length > 1
        ? (activeIndex / (ATS_STAGES.length - 1)) * 100
        : 0;

    return (
        <div className="bg-white rounded-[20px] p-10 shadow-sm border border-slate-200/60 mb-8 relative overflow-hidden">
            {/* Background track */}
            <div className="absolute left-16 right-16 top-[54px] h-[3px] bg-slate-100 rounded-full" />
            {/* Active progress line */}
            <div
                className="absolute left-16 top-[54px] h-[3px] bg-[#0B4FEA] rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(11,79,234,0.4)]"
                style={{ width: `calc((100% - 8rem) * ${progressPct / 100})` }}
            />

            <div className="relative z-10 flex justify-between">
                {ATS_STAGES.map((stage, idx) => {
                    const isDone = idx < activeIndex;
                    const isActive = idx === activeIndex;
                    const isPending = idx > activeIndex;

                    return (
                        <div key={stage.value} className="flex flex-col items-center gap-4" style={{ minWidth: 56 }}>
                            {isDone && (
                                <div className="w-8 h-8 bg-[#0B4FEA] rounded-full flex items-center justify-center text-white ring-8 ring-white shadow-sm">
                                    <Check size={14} strokeWidth={3} />
                                </div>
                            )}
                            {isActive && (
                                <div className="w-10 h-10 bg-[#0B4FEA] rounded-xl flex items-center justify-center text-white ring-8 ring-white shadow-lg -translate-y-1 transition-all">
                                    <div className="w-4 h-4 border-[2.5px] border-white rounded-sm" />
                                </div>
                            )}
                            {isPending && (
                                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center ring-8 ring-white text-slate-400">
                                    <div className="w-2 h-2 bg-slate-300 rounded-full" />
                                </div>
                            )}
                            <span
                                className="text-[9px] font-black tracking-widest uppercase text-center leading-tight"
                                style={{
                                    color: isActive ? '#191C1D' : isDone ? '#0B4FEA' : '#94a3b8',
                                    marginTop: isActive ? '-4px' : '0',
                                }}
                            >
                                {stage.label}
                            </span>
                            {idx === 1 && (
                                <div className={`flex items-center gap-1 mt-1 transition-all duration-500 ${hasVetting ? 'opacity-100' : 'opacity-0 h-0 pointer-events-none'}`}>
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-[7px] font-black text-green-600 uppercase tracking-tighter">Vetting Comp.</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
