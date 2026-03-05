'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Filter, X } from 'lucide-react';
import { CASE_INDUSTRIES, CASE_SERVICES } from '@/lib/case-constants';

interface CaseStudy {
    id: string;
    title: string;
    client_name: string;
    summary: string;
    tags: string[];
    image_url: string | null;
    is_published: boolean;
    created_at: string;
    slug: string;
    industry?: string;
    services?: string[];
}

interface Props {
    initialCases: CaseStudy[];
    lang: string;
    dict: any;
}

export default function PortfolioFilters({ initialCases, lang, dict }: Props) {
    const [search, setSearch] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
    const [selectedService, setSelectedService] = useState<string>('all');

    const filteredCases = useMemo(() => {
        return initialCases.filter(c => {
            const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                c.client_name.toLowerCase().includes(search.toLowerCase()) ||
                c.summary.toLowerCase().includes(search.toLowerCase());

            const matchesIndustry = selectedIndustry === 'all' || c.industry === selectedIndustry;

            const matchesService = selectedService === 'all' ||
                (c.services && c.services.includes(selectedService));

            return matchesSearch && matchesIndustry && matchesService;
        });
    }, [initialCases, search, selectedIndustry, selectedService]);

    return (
        <div className="space-y-12">
            {/* Filter Bar */}
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between bg-zinc-50/50 p-6 rounded-3xl border border-zinc-100">
                <div className="relative w-full lg:max-w-xs">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input
                        type="text"
                        placeholder={lang === 'en' ? "Search projects..." : "Buscar proyectos..."}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand/10 focus:border-brand transition-all font-outfit text-sm"
                    />
                </div>

                <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto">
                    {/* Industry Filter */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-2xl">
                        <Filter size={14} className="text-zinc-400" />
                        <select
                            value={selectedIndustry}
                            onChange={(e) => setSelectedIndustry(e.target.value)}
                            className="bg-transparent outline-none font-outfit text-xs font-bold uppercase tracking-widest text-zinc-600 cursor-pointer"
                        >
                            <option value="all">{lang === 'en' ? 'All Industries' : 'Todas las Industrias'}</option>
                            {CASE_INDUSTRIES.map(ind => (
                                <option key={ind.value} value={ind.value}>{ind.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Service Filter */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-2xl">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                        <select
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value)}
                            className="bg-transparent outline-none font-outfit text-xs font-bold uppercase tracking-widest text-zinc-600 cursor-pointer"
                        >
                            <option value="all">{lang === 'en' ? 'All Services' : 'Todos los Servicios'}</option>
                            {CASE_SERVICES.map(srv => (
                                <option key={srv} value={srv}>{srv}</option>
                            ))}
                        </select>
                    </div>

                    {(search || selectedIndustry !== 'all' || selectedService !== 'all') && (
                        <button
                            onClick={() => {
                                setSearch('');
                                setSelectedIndustry('all');
                                setSelectedService('all');
                            }}
                            className="p-3 text-zinc-400 hover:text-brand transition-colors"
                            title="Clear filters"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Results Grid */}
            {filteredCases.length === 0 ? (
                <div className="text-center py-32 bg-zinc-50 rounded-[3rem] border border-zinc-100 italic text-zinc-400 font-outfit">
                    {lang === 'en' ? 'No projects match your current filters.' : 'No hay proyectos que coincidan con tus filtros.'}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {filteredCases.map((caseStudy) => (
                        <Link
                            key={caseStudy.id}
                            href={`/${lang}/success-stories/${caseStudy.slug || caseStudy.id}`}
                            className="group flex flex-col h-full bg-white rounded-[2.5rem] border border-zinc-100 overflow-hidden hover:border-brand/30 transition-all duration-500"
                        >
                            <div className="relative aspect-[16/10] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                                <Image
                                    src={caseStudy.image_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop'}
                                    alt={caseStudy.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>

                            <div className="p-10 flex-1 flex flex-col">
                                <span className="text-brand font-black tracking-widest uppercase text-[10px] mb-4 font-outfit">
                                    {caseStudy.client_name}
                                </span>
                                <h3 className="text-2xl font-black text-zinc-900 mb-6 group-hover:text-brand transition-colors leading-tight font-outfit tracking-tight">
                                    {caseStudy.title}
                                </h3>
                                <p className="text-zinc-500 font-outfit font-light leading-relaxed mb-10 flex-1 line-clamp-3">
                                    {caseStudy.summary}
                                </p>

                                <div className="flex flex-wrap gap-2 pt-6 border-t border-zinc-50">
                                    {caseStudy.tags && caseStudy.tags.slice(0, 3).map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-4 py-1.5 bg-zinc-50 text-zinc-400 text-[10px] font-bold rounded-full border border-zinc-100 font-outfit"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
