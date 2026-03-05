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
                "inline-flex items-center gap-3 px-10 py-5 bg-brand text-white font-bold rounded-full hover:bg-brand/90 hover:scale-[1.02] transition-all group font-outfit",
                className
            )}
        >
            {text}
            {showIcon && <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
        </a>
    );
}
