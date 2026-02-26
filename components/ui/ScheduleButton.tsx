import React from 'react';
import { CONTACT_CALENDAR_URL } from '@/lib/constants';
import { ArrowUpRight } from 'lucide-react';
import clsx from 'clsx';

interface ScheduleButtonProps {
    text: string;
    className?: string;
    showIcon?: boolean;
}

export default function ScheduleButton({ text, className, showIcon = true }: ScheduleButtonProps) {
    return (
        <a
            href={CONTACT_CALENDAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(
                "inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#D83484] to-[#A3369D] text-white font-bold rounded-full hover:scale-105 transition-all shadow-xl shadow-[#D83484]/20 group font-outfit",
                className
            )}
        >
            {text}
            {showIcon && <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
        </a>
    );
}
