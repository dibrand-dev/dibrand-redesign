'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Loader2 } from 'lucide-react';
import { MACRO_STAGES, getStageConfig } from '@/lib/ats-constants';
import { cn } from '@/lib/utils';
import { updateCandidateStatus } from '@/app/ats/actions';

interface Props {
    candidateId: string;
    currentStatus: string;
}

export default function CandidatePipelineTracker({ candidateId, currentStatus }: Props) {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
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

    const config = getStageConfig(currentStatus);
    const activeStage = config.value;

    // Check which macro stage contains the current active stage
    const getActiveMacroId = () => {
        for (const macro of MACRO_STAGES) {
            if ((macro.stages as readonly string[]).includes(activeStage)) return macro.id;
        }
        return null;
    };

    const activeMacroId = getActiveMacroId();

    const handleStatusChange = async (newStatus: string) => {
        if (newStatus === currentStatus) return;
        
        setIsUpdating(true);
        setOpenDropdown(null);
        try {
            await updateCandidateStatus(candidateId, newStatus);
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error al actualizar el estado del candidato.');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="w-full font-outfit" ref={dropdownRef}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Proceso de Reclutamiento
                </h3>
                {isUpdating && (
                    <div className="flex items-center gap-2 text-[#0040A1] text-[10px] font-bold uppercase tracking-wider animate-pulse">
                        <Loader2 size={12} className="animate-spin" /> Actualizando...
                    </div>
                )}
            </div>

            <div className="relative flex items-stretch overflow-visible gap-1 pb-4">
                {MACRO_STAGES.map((macro, index) => {
                    const isActiveMacro = activeMacroId === macro.id;
                    const isLast = index === MACRO_STAGES.length - 1;
                    const color = macro.color;
                    
                    // Inactive styling: Pastel version of the color or Slate 100
                    const bgStyle = isActiveMacro ? color : `${color}15`;
                    const textStyle = isActiveMacro ? 'white' : color;
                    
                    return (
                        <div key={macro.id} className="relative flex-1">
                            <button
                                onClick={() => setOpenDropdown(openDropdown === macro.id ? null : macro.id)}
                                className={cn(
                                    "relative w-full h-16 flex flex-col items-center justify-center transition-all duration-300 group",
                                    index !== 0 && "md:-ml-4",
                                    isActiveMacro ? "z-30 shadow-lg scale-[1.02]" : "z-10 hover:z-20 hover:scale-[1.01]"
                                )}
                                style={{
                                    backgroundColor: bgStyle,
                                    color: textStyle,
                                    clipPath: index === 0 
                                        ? 'polygon(0% 0%, 92% 0%, 100% 50%, 92% 100%, 0% 100%)'
                                        : isLast
                                            ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 8% 50%)'
                                            : 'polygon(0% 0%, 92% 0%, 100% 50%, 92% 100%, 0% 100%, 8% 50%)',
                                    border: isActiveMacro ? `1.5px solid white` : 'none'
                                }}
                            >
                                <span className={cn(
                                    "text-[9px] font-black uppercase tracking-widest",
                                    isActiveMacro ? "text-white" : ""
                                )}>
                                    {macro.label}
                                </span>
                                
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-[14px] font-black">
                                        {isActiveMacro ? activeStage : 'Seleccionar'}
                                    </span>
                                    <ChevronDown 
                                        size={12} 
                                        className={cn(
                                            "transition-transform",
                                            openDropdown === macro.id && "rotate-180"
                                        )} 
                                    />
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {openDropdown === macro.id && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-full left-0 right-0 mt-3 z-50 bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 p-1.5 min-w-[180px]"
                                    >
                                        <div className="space-y-1">
                                            {macro.stages.map((stage) => {
                                                const isThisStageActive = currentStatus === stage;
                                                return (
                                                    <button
                                                        key={stage}
                                                        onClick={() => handleStatusChange(stage)}
                                                        className={cn(
                                                            "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-left",
                                                            isThisStageActive ? "bg-slate-50" : "hover:bg-slate-50"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <div 
                                                                className="w-2 h-2 rounded-full"
                                                                style={{ backgroundColor: color }}
                                                            />
                                                            <span className={cn(
                                                                "text-[12px] font-bold",
                                                                isThisStageActive ? "text-slate-900" : "text-slate-600"
                                                            )}>
                                                                {stage}
                                                            </span>
                                                        </div>
                                                        {isThisStageActive && <Check size={14} className="text-[#0040A1]" />}
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
}
