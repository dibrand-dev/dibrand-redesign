'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Building2, Clock, Bookmark, Filter, ChevronDown, DollarSign, Search, X } from 'lucide-react';
import { motion } from 'framer-motion';
import SpontaneousApplicationCard from '../jobs/SpontaneousApplicationCard';

interface JobOpening {
    id: string;
    slug?: string;
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
    job_opening_stacks?: {
        sort_order: number;
        tech_stacks: {
            id: string;
            name: string;
            icon_url: string;
        };
    }[];
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
    
    // Filter states
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedLocation, setSelectedLocation] = React.useState('all');
    const [selectedIndustry, setSelectedIndustry] = React.useState('all');
    const [selectedType, setSelectedType] = React.useState('all');

    // Get unique options for filters
    const locations = Array.from(new Set(activeJobs.map(j => isEn ? (j.location_en || j.location) : (j.location_es || j.location)).filter(Boolean))).sort();
    const industries = Array.from(new Set(activeJobs.map(j => j.industry).filter(Boolean))).sort();
    const types = Array.from(new Set(activeJobs.map(j => j.employment_type).filter(Boolean))).sort();

    // Filter logic
    const filteredJobs = activeJobs.filter(job => {
        const title = isEn ? (job.title_en || job.title) : (job.title_es || job.title);
        const location = isEn ? (job.location_en || job.location) : (job.location_es || job.location);
        
        const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLocation = selectedLocation === 'all' || location === selectedLocation;
        const matchesIndustry = selectedIndustry === 'all' || job.industry === selectedIndustry;
        const matchesType = selectedType === 'all' || job.employment_type === selectedType;

        return matchesSearch && matchesLocation && matchesIndustry && matchesType;
    });

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
                
                {/* Search / Filter Bar */}
                <div className="flex flex-col gap-6 mb-12">
                    {/* Search Row */}
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-brand transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder={isEn ? "Search by job title..." : "Buscar por título de vacante..."}
                            className="w-full bg-white border border-[#EAECF0] rounded-2xl py-4 pl-12 pr-4 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button 
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>

                    {/* Filter Row */}
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex flex-col gap-1.5 min-w-[200px] flex-1 md:flex-none">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">{isEn ? 'Location' : 'Ubicación'}</label>
                            <select 
                                className="bg-white border border-[#EAECF0] rounded-xl px-4 py-2.5 text-sm font-medium text-[#344054] shadow-sm hover:border-[#D0D5DD] transition-all focus:outline-none focus:ring-2 focus:ring-brand/20"
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                            >
                                <option value="all">{isEn ? 'All Locations' : 'Todas las ubicaciones'}</option>
                                {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5 min-w-[200px] flex-1 md:flex-none">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">{isEn ? 'Department' : 'Departamento'}</label>
                            <select 
                                className="bg-white border border-[#EAECF0] rounded-xl px-4 py-2.5 text-sm font-medium text-[#344054] shadow-sm hover:border-[#D0D5DD] transition-all focus:outline-none focus:ring-2 focus:ring-brand/20"
                                value={selectedIndustry}
                                onChange={(e) => setSelectedIndustry(e.target.value)}
                            >
                                <option value="all">{isEn ? 'All Departments' : 'Todos los departamentos'}</option>
                                {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5 min-w-[200px] flex-1 md:flex-none">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">{isEn ? 'Contract Type' : 'Tipo de Contrato'}</label>
                            <select 
                                className="bg-white border border-[#EAECF0] rounded-xl px-4 py-2.5 text-sm font-medium text-[#344054] shadow-sm hover:border-[#D0D5DD] transition-all focus:outline-none focus:ring-2 focus:ring-brand/20"
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                            >
                                <option value="all">{isEn ? 'All Types' : 'Todos los tipos'}</option>
                                {types.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                            </select>
                        </div>

                        <div className="md:ml-auto pt-5">
                            <span className="text-sm font-medium text-[#667085]">
                                <strong className="text-[#101828] font-bold">{filteredJobs.length}</strong> {isEn ? 'jobs found' : 'vacantes encontradas'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {filteredJobs.map((job, index) => {
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
                                    <div className="shrink-0 w-14 h-14 bg-white rounded-full flex items-center justify-center border border-[#EAECF0] overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-500 p-2">
                                        {(() => {
                                            const stacks = job.job_opening_stacks || [];
                                            const firstStackLink = [...stacks].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))[0];
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

                                    {/* Content */}
                                     <div className="flex-1 min-w-0">
                                         <div className="flex justify-between items-start mb-2">
                                             <Link href={`/${lang}/join-us/${job.slug || job.id}`} className="min-w-0">
                                                 <h3 className="text-[18px] font-bold text-[#101828] font-inter truncate pr-2 group-hover:text-brand transition-colors leading-snug uppercase">
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

                {filteredJobs.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center mt-12 bg-white rounded-3xl border border-dashed border-[#EAECF0]">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <Search size={32} className="text-zinc-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {isEn ? 'No positions match your filters' : 'No se encontraron vacantes con estos filtros'}
                        </h3>
                        <p className="text-slate-500 max-w-sm mx-auto">
                            {isEn ? 'Try adjusting your search query or filters to find what you are looking for.' : 'Prueba ajustando los términos de búsqueda o los filtros para encontrar lo que buscas.'}
                        </p>
                        <button 
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedLocation('all');
                                setSelectedIndustry('all');
                                setSelectedType('all');
                            }}
                            className="mt-6 text-brand font-bold hover:underline"
                        >
                            {isEn ? 'Clear all filters' : 'Limpiar todos los filtros'}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
