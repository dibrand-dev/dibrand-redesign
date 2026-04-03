'use client';

import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
    reason: string | null;
}

export default function DisqualifiedTag({ reason }: Props) {
    const [showTooltip, setShowTooltip] = useState(false);

    if (!reason) return null;

    return (
        <div className="relative inline-block mb-3">
            <div 
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 rounded-full border border-rose-100 shadow-sm cursor-help transition-all hover:bg-rose-100/50"
            >
                <AlertCircle size={14} className="shrink-0" />
                <span className="text-[10px] font-black tracking-widest uppercase">DESESTIMADO</span>
            </div>

            {showTooltip && (
                <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-slate-900 text-white text-[12px] font-medium rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="font-black text-red-400 text-[10px] uppercase tracking-widest mb-1">Motivo de rechazo</div>
                    {reason}
                    <div className="absolute top-full left-6 -mt-1 border-4 border-transparent border-t-slate-900" />
                </div>
            )}
        </div>
    );
}
