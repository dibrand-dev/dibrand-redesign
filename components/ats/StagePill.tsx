'use client';

import React from 'react';
import { getStageConfig } from '@/lib/ats-constants';

interface StagePillProps {
    status: string;
    className?: string;
}

/**
 * StagePill Component
 * Specialized pill for professional candidate flow.
 * Uses Outfit font and semantic coloring defined in STAGE_CONFIG.
 */
export default function StagePill({ status, className = "" }: StagePillProps) {
    const config = getStageConfig(status);
    
    return (
        <span className={`
            inline-flex items-center justify-center 
            px-3 py-1 
            rounded-full 
            text-[10px] sm:text-[11px] 
            font-bold font-outfit
            uppercase tracking-[0.1em]
            border border-current/10
            ${config.twBg} 
            ${config.twText} 
            ${className}
            transition-all duration-200
            shadow-sm
        `}>
            {config.label}
        </span>
    );
}
