'use client';

import React from 'react';
import { getStageConfig } from '@/lib/ats-constants';

interface StageBadgeProps {
    status: string;
    className?: string;
}

/**
 * Reusable Badge component for ATS Candidate Stages.
 * Ensures consistent visual hierarchy across the platform.
 * Uses Outfit font and Tailwind color mapping from ats-constants.
 */
export default function StageBadge({ status, className = "" }: StageBadgeProps) {
    const config = getStageConfig(status);
    
    return (
        <span className={`
            inline-flex items-center justify-center 
            px-3 py-1 
            rounded-full 
            text-[10px] sm:text-[11px] 
            font-bold font-sans
            uppercase tracking-widest
            border border-current/20
            ${config.twBg} 
            ${config.twText} 
            ${className}
            transition-all duration-200
        `}>
            {config.label}
        </span>
    );
}
