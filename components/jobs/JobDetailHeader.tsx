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
        <header className="mb-12 bg-white border border-zinc-100 rounded-[24px] p-8 md:p-10 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 md:gap-10">
                
                {/* Left Content Block */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 flex-1">
                    {/* Logo Slot - Now Black per reference */}
                    <div className="shrink-0 w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center border border-zinc-100 shadow-sm p-3">
                        {(() => {
                            const stacks = job.job_opening_stacks || [];
                            const firstStackLink = [...stacks].sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))[0];
                            const firstStackData = firstStackLink?.tech_stacks;
                            
                            // Handle both object and array response from Supabase
                            const stack = Array.isArray(firstStackData) ? firstStackData[0] : firstStackData;
                            
                            if (stack?.icon_url) {
                                return (
                                    <img 
                                        src={stack.icon_url} 
                                        alt={stack.name} 
                                        className="w-full h-full object-contain"
                                    />
                                );
                            }
                            
                            return (
                                <div className="w-full h-full bg-[#101828] rounded-full flex items-center justify-center text-white p-2">
                                    <div className="font-black text-xl italic tracking-tighter opacity-90">di</div>
                                </div>
                            );
                        })()}
                    </div>

                    {/* Info Block */}
                    <div className="flex-1 text-center md:text-left min-w-0">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 font-inter tracking-tight leading-tight mb-4 pr-4">
                            {jobTitle}
                        </h1>

                        {/* Meta Icons Row (Only showing requested 5 keys) */}
                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-6 gap-y-3 mb-6">
                            {job.industry && (
                                <div className="flex items-center gap-2 text-sm text-[#667085] font-medium">
                                    <Building2 size={18} className="opacity-70" />
                                    <span>{job.industry}</span>
                                </div>
                            )}
                            {jobLocation && (
                                <div className="flex items-center gap-2 text-sm text-[#667085] font-medium">
                                    <MapPin size={18} className="opacity-70" />
                                    <span>{jobLocation}</span>
                                </div>
                            )}
                            {job.seniority && (
                                <div className="flex items-center gap-2 text-sm text-[#667085] font-medium">
                                    <Clock size={18} className="opacity-70" />
                                    <span>{job.seniority}</span>
                                </div>
                            )}
                        </div>

                        {/* Badges Row - Restricted to requested types (Contract/Modality) */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            {job.employment_type && (
                                <span className="px-4 py-1.5 bg-[#EFF8FF] text-[#175CD3] text-[11px] font-bold rounded-full border border-[#B2DDFF] uppercase tracking-wider">
                                    {job.employment_type.replace('_', ' ')}
                                </span>
                            )}
                            {job.modality && (
                                <span className="px-4 py-1.5 bg-[#ECFDF3] text-[#027A48] text-[11px] font-bold rounded-full border border-[#ABEFC6] uppercase tracking-wider">
                                    {job.modality}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Action Block */}
                <div className="flex items-center justify-center lg:justify-end gap-4 shrink-0 w-full lg:w-auto">
                    <button 
                        onClick={handleApplyClick}
                        className="px-8 md:px-10 py-4 md:py-5 bg-brand text-white font-bold rounded-[14px] hover:bg-brand/90 hover:scale-[1.02] transition-all shadow-lg md:shadow-xl shadow-brand/30 active:scale-95 font-inter text-base flex-1 md:flex-none text-center"
                    >
                        {isEn ? 'Apply Now' : 'Postularme Ahora'}
                    </button>
                    <button 
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center border rounded-[14px] transition-all shadow-sm ${
                            isBookmarked 
                            ? 'bg-brand/5 border-brand text-brand' 
                            : 'bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50 hover:border-zinc-300'
                        }`}
                        aria-label="Bookmark job"
                    >
                        <Bookmark size={24} fill={isBookmarked ? "currentColor" : "none"} strokeWidth={isBookmarked ? 1.5 : 2} />
                    </button>
                </div>
            </div>
        </header>
    );
}
