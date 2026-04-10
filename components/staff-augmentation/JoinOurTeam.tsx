'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Building2, Clock, Bookmark, Filter, ChevronDown, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import SpontaneousApplicationCard from '../jobs/SpontaneousApplicationCard';

interface JobOpening {
    id: string;
    title: string;
    title_es?: string;
    title_en?: string;
    location: string;
    location_es?: string;
    location_en?: string;
    industry: string;
    employment_type: string;
    is_active: boolean;
    description: string;
    description_es?: string;
    description_en?: string;
    requirements: string;
    requirements_es?: string;
    requirements_en?: string;
    seniority?: string;
    modality?: string;
    created_at?: string;
    salary_range?: string;
}

interface JoinOurTeamProps {
    jobs: JobOpening[];
    lang: string;
    dict?: any;
}

export default function JoinOurTeam({ jobs, lang, dict }: JoinOurTeamProps) {
    const activeJobs = jobs || [];
    const isEn = lang === 'en';
    const [bookmarked, setBookmarked] = React.useState<Record<string, boolean>>({});

    // Helper to format relative time
    const getRelativeTime = (dateString?: string) => {
        if (!dateString) return isEn ? 'Recently' : 'Reciente';
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return isEn ? 'Just now' : 'Ahora mismo';
        if (diffInHours < 24) return isEn ? `${diffInHours}h ago` : `hace ${diffInHours}h`;
        const diffInDays = Math.floor(diffInHours / 24);
        return isEn ? `${diffInDays}d ago` : `hace ${diffInDays}d`;
    };

    const toggleBookmark = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setBookmarked(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <section className="bg-[#F9FAFB] py-24 overflow-hidden min-h-screen font-inter">
            <div className="container mx-auto px-6 max-w-7xl">
                
                {/* Search / Filter Bar (UI Mockup Header) */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                    <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2.5 px-5 py-2.5 bg-white border border-[#EAECF0] rounded-xl text-sm font-semibold text-[#344054] shadow-sm hover:bg-gray-50 transition-all hover:border-[#D0D5DD]">
                            <Filter size={18} className="text-[#344054]" />
                            {isEn ? 'Filter' : 'Filtrar'}
                        </button>
                        <span className="text-sm font-medium text-[#667085]">
                            <strong className="text-[#101828] font-bold">{activeJobs.length}</strong> {isEn ? 'jobs' : 'vacantes'}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#EAECF0] rounded-xl text-sm font-medium text-[#344054] shadow-sm cursor-pointer hover:bg-gray-50 hover:border-[#D0D5DD] transition-all">
                            {isEn ? 'Sort by (default)' : 'Ordenar por'}
                            <ChevronDown size={14} className="text-[#667085]" />
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#EAECF0] rounded-xl text-sm font-medium text-[#344054] shadow-sm cursor-pointer hover:bg-gray-50 hover:border-[#D0D5DD] transition-all">
                            {isEn ? 'All' : 'Todo'}
                            <ChevronDown size={14} className="text-[#667085]" />
                        </div>
                    </div>
                </div>

                {/* Openings Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {activeJobs.map((job, index) => {
                        const jobTitle = isEn ? (job.title_en || job.title) : (job.title_es || job.title);
                        const jobLocation = isEn ? (job.location_en || job.location) : (job.location_es || job.location);
                        const isBookmarked = bookmarked[job.id];
                        
                        // Urgency logic: if it's new (last 48h), it's urgent
                        const isUrgent = job.created_at && (new Date().getTime() - new Date(job.created_at).getTime()) < 172800000;

                        return (
                            <motion.div 
                                key={job.id}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                className="group relative bg-white border border-[#EAECF0] rounded-[16px] p-8 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-500 cursor-pointer"
                            >
                                <div className="flex gap-6">
                                    {/* Left Slot: Tech Logo / Dibrand Logo placeholder */}
                                    <div className="shrink-0 w-14 h-14 bg-[#101828] rounded-xl flex items-center justify-center text-white overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-500">
                                        <div className="font-black text-2xl italic tracking-tighter opacity-90">di</div>
                                    </div>

                                    {/* Content */}
                                     <div className="flex-1 min-w-0">
                                         <div className="flex justify-between items-start mb-2">
                                             <Link href={`/${lang}/join-us/${job.id}`} className="min-w-0">
                                                 <h3 className="text-xl font-bold text-[#101828] font-inter truncate pr-2 group-hover:text-brand transition-colors leading-snug uppercase">
                                                     {jobTitle}
                                                 </h3>
                                             </Link>
                                             <button 
                                                 onClick={(e) => toggleBookmark(job.id, e)}
                                                 className={`transition-all p-1.5 rounded-lg ${isBookmarked ? 'text-brand bg-brand/5' : 'text-[#667085] hover:text-brand hover:bg-zinc-50'}`}
                                             >
                                                 <Bookmark size={22} fill={isBookmarked ? "currentColor" : "none"} strokeWidth={1.5} />
                                             </button>
                                         </div>

                                         {/* Meta Row (Icons) - Whitelisted 5 keys */}
                                         <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-6">
                                             {/* Industry */}
                                             <div className="flex items-center gap-2 text-sm text-[#475467] font-medium">
                                                 <Building2 size={16} className="text-zinc-400" />
                                                 <span className="truncate">{job.industry}</span>
                                             </div>
                                             {/* Location */}
                                             <div className="flex items-center gap-2 text-sm text-[#475467] font-medium">
                                                 <MapPin size={16} className="text-zinc-400" />
                                                 <span className="truncate">{jobLocation}</span>
                                             </div>
                                             {/* Seniority - CRITICAL VISIBILITY */}
                                             <div className="flex items-center gap-2 text-sm text-brand font-bold bg-brand/5 px-2 py-0.5 rounded-md">
                                                 <Clock size={16} />
                                                 <span className="uppercase tracking-wider text-[10px]">{job.seniority || 'Senior'}</span>
                                             </div>
                                         </div>

                                         {/* Badges Row - Restricted to Modality & Contract */}
                                         <div className="flex flex-wrap gap-2.5">
                                             {job.modality && (
                                                 <span className="px-3.5 py-1.5 bg-[#F9F5FF] text-brand text-[10px] font-black rounded-full border border-brand/20 uppercase tracking-widest">
                                                     {job.modality}
                                                 </span>
                                             )}
                                             <span className="px-3.5 py-1.5 bg-zinc-100 text-zinc-600 text-[10px] font-black rounded-full border border-zinc-200 uppercase tracking-widest">
                                                 {job.employment_type?.replace('_', ' ') || 'Full Time'}
                                             </span>
                                         </div>
                                     </div>
                                </div>
                            </motion.div>
                        );
                    })}

                    {/* Spontaneous Application Card at the end of the grid */}
                    <SpontaneousApplicationCard lang={lang} dict={dict} />
                </div>

                {activeJobs.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center mt-12 border-t border-slate-100">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <Clock size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {isEn ? 'No positions found' : 'No se encontraron posiciones'}
                        </h3>
                        <p className="text-gray-500">
                            {isEn ? 'Try adjusting your filters or check back later.' : 'Prueba ajustando los filtros o vuelve más tarde.'}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
