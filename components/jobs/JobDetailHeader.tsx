'use client';

import React, { useState } from 'react';
import { MapPin, Building2, Clock, DollarSign, Bookmark } from 'lucide-react';

interface JobDetailHeaderProps {
    job: any;
    jobTitle: string;
    jobLocation: string;
    isEn: boolean;
}

export default function JobDetailHeader({ job, jobTitle, jobLocation, isEn }: JobDetailHeaderProps) {
    const [isBookmarked, setIsBookmarked] = useState(false);

    const handleApplyClick = () => {
        const form = document.getElementById('application-form');
        if (form) {
            form.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header className="mb-12 bg-zinc-50 border border-zinc-200 rounded-[24px] p-8 md:p-12 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                
                {/* Left Content Block */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 flex-1">
                    {/* Logo Slot */}
                    <div className="shrink-0 w-20 h-20 bg-[#101828] rounded-[18px] flex items-center justify-center text-white shadow-lg shadow-zinc-200">
                        <div className="font-black text-3xl italic tracking-tighter opacity-90">di</div>
                    </div>

                    {/* Info Block */}
                    <div className="flex-1 text-center md:text-left min-w-0">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 font-inter tracking-tight leading-tight mb-4 truncate">
                            {jobTitle}
                        </h1>

                        {/* Meta Icons Row */}
                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-6 gap-y-3 mb-6 opacity-70">
                            <div className="flex items-center gap-2 text-sm text-zinc-700 font-medium">
                                <Building2 size={18} strokeWidth={2} />
                                <span>{job.industry}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-zinc-700 font-medium">
                                <MapPin size={18} strokeWidth={2} />
                                <span>{jobLocation}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-zinc-700 font-medium">
                                <Clock size={18} strokeWidth={2} />
                                <span>{isEn ? 'Posted recently' : 'Publicado recientemente'}</span>
                            </div>
                            {job.salary_range && (
                                <div className="flex items-center gap-2 text-sm text-zinc-700 font-medium">
                                    <DollarSign size={18} strokeWidth={2} />
                                    <span>{job.salary_range}</span>
                                </div>
                            )}
                        </div>

                        {/* Badges Row */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            <span className="px-4 py-1.5 bg-[#EFF8FF] text-[#175CD3] text-xs font-bold rounded-full border border-[#B2DDFF] uppercase tracking-wider">
                                {job.employment_type?.replace('_', ' ') || 'Full Time'}
                            </span>
                            <span className="px-4 py-1.5 bg-[#ECFDF3] text-[#027A48] text-xs font-bold rounded-full border border-[#ABEFC6] uppercase tracking-wider">
                                {isEn ? 'Public' : 'Público'}
                            </span>
                            <span className="px-4 py-1.5 bg-[#FFFAEB] text-[#B54708] text-xs font-bold rounded-full border border-[#FEDF89] uppercase tracking-wider">
                                {isEn ? 'Urgent' : 'Urgente'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Action Block */}
                <div className="flex items-center justify-center lg:justify-end gap-4 shrink-0">
                    <button 
                        onClick={handleApplyClick}
                        className="px-10 py-5 bg-brand text-white font-bold rounded-[14px] hover:bg-brand/90 hover:scale-[1.02] transition-all shadow-xl shadow-brand/20 active:scale-95 font-inter text-base flex-1 md:flex-none text-center"
                    >
                        {isEn ? 'Apply For Job' : 'Postularme Ahora'}
                    </button>
                    <button 
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        className={`w-16 h-16 flex items-center justify-center border rounded-[14px] transition-all shadow-sm ${
                            isBookmarked 
                            ? 'bg-brand/5 border-brand text-brand' 
                            : 'bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50 hover:border-zinc-300'
                        }`}
                    >
                        <Bookmark size={24} fill={isBookmarked ? "currentColor" : "none"} strokeWidth={isBookmarked ? 1.5 : 2} />
                    </button>
                </div>
            </div>
        </header>
    );
}
