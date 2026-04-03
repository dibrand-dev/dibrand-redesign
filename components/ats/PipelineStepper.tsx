'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, Check } from 'lucide-react';
import { MACRO_STAGES, STAGE_CONFIG } from '@/lib/ats-constants';
import { cn } from '@/lib/utils';

interface PipelineStepperProps {
    counts: Record<string, number>;
    activeFilter: string | null;
    onFilterChange: (stage: string | null) => void;
}

const PipelineStepper: React.FC<PipelineStepperProps> = ({ counts, activeFilter, onFilterChange }) => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Calculate total for each macro stage
    const macroTotals = MACRO_STAGES.map(macro => {
        const total = (macro.stages as readonly string[]).reduce((acc, stage) => acc + (counts[stage] || 0), 0);
        return { ...macro, total };
    });

    // Check if the current filter belongs to a macro stage
    const getActiveMacroId = () => {
        if (!activeFilter) return null;
        for (const macro of MACRO_STAGES) {
            if ((macro.stages as readonly string[]).includes(activeFilter)) return macro.id;
        }
        return null;
    };

    const activeMacroId = getActiveMacroId();

    return (
        <div className="w-full font-outfit mb-12" ref={dropdownRef}>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-[14px] font-black text-[#191C1D] uppercase tracking-widest flex items-center gap-2">
                    <Sparkles size={18} className="text-[#0040A1]" />
                    Dashboard de Pipeline de Selección
                </h3>
                {activeFilter && (
                    <button 
                        onClick={() => onFilterChange(null)}
                        className="text-[11px] font-bold text-[#0040A1] hover:underline uppercase tracking-widest"
                    >
                        Limpiar Filtro
                    </button>
                )}
            </div>

            {/* Chevron Stepper Container - Horizontal Slider on mobile */}
            <div className="relative flex items-stretch overflow-visible pb-4 md:pb-0">
                {macroTotals.map((macro, index) => {
                    const isRechazados = macro.id === 'rechazados';
                    const isActiveMacro = activeMacroId === macro.id;
                    const isLast = index === macroTotals.length - 1;
                    const macroColor = (macro as any).color || '#64748B';
                    
                    // Special case for "Contratado" in Cierre
                    const isHiredActive = activeFilter === 'Contratado';
                    const activeColor = (isHiredActive && macro.id === 'cierre') ? '#10B981' : macroColor;

                    // Custom background/text for Rechazados when NOT active
                    let bgStyle = isActiveMacro ? activeColor : `${activeColor}15`;
                    let textStyle = isActiveMacro ? 'white' : activeColor;

                    if (isRechazados && !isActiveMacro) {
                        bgStyle = '#FFF1F2'; // bg-rose-50
                        textStyle = '#BE123C'; // text-rose-700
                    }

                    return (
                        <div key={macro.id} className="relative flex-1 min-w-[150px] md:min-w-0">
                            <button
                                onClick={() => {
                                    // Filter by the entire Macro stage ID
                                    onFilterChange(macro.id);
                                    setOpenDropdown(openDropdown === macro.id ? null : macro.id);
                                }}
                                className={cn(
                                    "relative w-full h-24 flex flex-col items-center justify-center transition-all duration-300 group",
                                    index !== 0 && "md:-ml-4",
                                    isActiveMacro ? "z-30 shadow-[0_10px_30px_rgba(0,0,0,0.15)] scale-[1.03] ring-2 ring-white/50" : "z-10 hover:z-20 hover:scale-[1.01]"
                                )}
                                style={{
                                    backgroundColor: bgStyle,
                                    color: textStyle,
                                    clipPath: index === 0 
                                        ? 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)'
                                        : isLast
                                            ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 10% 50%)'
                                            : 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%, 10% 50%)',
                                    borderRight: (!isActiveMacro && !isLast) || (isRechazados && !isActiveMacro) ? `2px solid ${isRechazados ? '#BE123C40' : activeColor + '30'}` : 'none',
                                    borderTop: isRechazados && !isActiveMacro ? '1px solid #BE123C40' : 'none',
                                    borderBottom: isRechazados && !isActiveMacro ? '1px solid #BE123C40' : 'none',
                                    borderLeft: isRechazados && !isActiveMacro ? '1px solid #BE123C40' : 'none'
                                }}
                            >
                                {/* Active Macro Indicator Label */}
                                {isActiveMacro && (
                                    <span className="absolute top-2.5 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-tighter shadow-sm animate-in fade-in zoom-in duration-300">
                                        {activeFilter === macro.id ? 'CATEGORÍA COMPLETA' : 'ETAPA ACTIVA'}
                                    </span>
                                )}

                                <span className={cn(
                                    "text-[10px] font-black uppercase tracking-widest mb-1 mt-2",
                                    isActiveMacro ? "text-white" : ""
                                )}>
                                    {macro.label}
                                </span>

                                <div className="flex items-center gap-2">
                                    <span className="text-[28px] font-black leading-none tracking-tighter">
                                        {macro.total}
                                    </span>
                                    <div 
                                        onClick={(e) => {
                                            // Optional: click only on icon for dropdown? No, the user wants the whole arrow to filter.
                                            // But they ALSO want the dropdown. To avoid double trigger, we don't need to stopPropagation because 
                                            // the button already toggles it.
                                        }}
                                        className={cn(
                                            "w-5 h-5 rounded-full flex items-center justify-center transition-all",
                                            isActiveMacro ? "bg-white/20" : "bg-white shadow-sm border border-slate-100"
                                        )}
                                    >
                                        <ChevronDown 
                                            size={12} 
                                            className={cn(
                                                "transition-transform duration-300",
                                                openDropdown === macro.id && "rotate-180"
                                            )} 
                                        />
                                    </div>
                                </div>
                                
                                {/* Bottom Accent line for inactive */}
                                {!isActiveMacro && (
                                    <div 
                                        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full opacity-40 group-hover:opacity-100 transition-opacity"
                                        style={{ backgroundColor: activeColor }}
                                    />
                                )}
                            </button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {openDropdown === macro.id && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-[85%] left-4 right-4 md:left-2 md:right-8 mt-2 z-50 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-100 p-2 min-w-[200px]"
                                    >
                                        <div className="space-y-1">
                                            {macro.stages.map((stage) => {
                                                const config = (STAGE_CONFIG as any)[stage];
                                                const count = counts[stage] || 0;
                                                const isStageActive = activeFilter === stage;

                                                return (
                                                    <button
                                                        key={stage}
                                                        onClick={() => {
                                                            onFilterChange(stage);
                                                            setOpenDropdown(null);
                                                        }}
                                                        className={cn(
                                                            "w-full flex items-center justify-between p-3 rounded-xl transition-all group/item",
                                                            isStageActive 
                                                                ? "bg-slate-50 shadow-inner" 
                                                                : "hover:bg-slate-50"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div 
                                                                className={cn(
                                                                    "w-2 h-2 rounded-full transition-transform group-hover/item:scale-125",
                                                                    isStageActive ? "" : "opacity-60"
                                                                )}
                                                                style={{ backgroundColor: activeColor }}
                                                            />
                                                            <span className={cn(
                                                                "text-[13px] font-bold transition-colors",
                                                                isStageActive ? "text-slate-900" : "text-slate-600 group-hover/item:text-slate-900"
                                                            )}>
                                                                {stage}
                                                            </span>
                                                            {isStageActive && <Check size={12} className="text-emerald-500" strokeWidth={3} />}
                                                        </div>
                                                        <span className={cn(
                                                            "text-[12px] font-black px-2 py-0.5 rounded-full transition-all",
                                                            count > 0 
                                                                ? isStageActive ? "bg-white text-slate-900 shadow-sm" : "bg-slate-100 text-slate-900"
                                                                : "text-slate-300"
                                                        )}>
                                                            {count}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PipelineStepper;
