'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Filter, X, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
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
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 9; // 3x3 Grid for Desktop

    const filteredCases = useMemo(() => {
        return initialCases.filter(c => {
            const matchesSearch = (c.title || '').toLowerCase().includes(search.toLowerCase()) ||
                (c.client_name || '').toLowerCase().includes(search.toLowerCase()) ||
                (c.summary || '').toLowerCase().includes(search.toLowerCase());

            const matchesIndustry = selectedIndustry === 'all' || c.industry === selectedIndustry;

            const matchesService = selectedService === 'all' ||
                (c.services && c.services.includes(selectedService));

            return matchesSearch && matchesIndustry && matchesService;
        });
    }, [initialCases, search, selectedIndustry, selectedService]);

    // Reset pagination when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [search, selectedIndustry, selectedService]);

    const totalPages = Math.ceil(filteredCases.length / itemsPerPage);
    const paginatedCases = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredCases.slice(start, start + itemsPerPage);
    }, [filteredCases, currentPage, itemsPerPage]);

    const scrollToGrid = () => {
        const gridElement = document.getElementById('portfolio-grid');
        if (gridElement) {
            const offset = 100;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = gridElement.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        scrollToGrid();
    };

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
                <div id="portfolio-grid" className="scroll-mt-24 space-y-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {paginatedCases.map((caseStudy) => (
                        <Link
                            key={caseStudy.id}
                            href={`/${lang}/success-stories/${caseStudy.slug || caseStudy.id}`}
                            className="group flex flex-col h-full bg-[#FAFAFA] rounded-[1.25rem] border border-zinc-100/50 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-700 hover:-translate-y-1"
                        >
                            {/* Inner Content - TOP */}
                            <div className="p-10 pb-8 flex-1 flex flex-col">
                                <h3 className="text-[22px] font-bold text-zinc-900 mb-2 group-hover:text-brand transition-colors leading-tight font-outfit tracking-tight not-italic border-none">
                                    {caseStudy.title}
                                </h3>
                                <span className="text-[#9B87F5] font-black tracking-widest uppercase text-[10px] mb-5 font-outfit">
                                    {caseStudy.client_name}
                                </span>
                                <p className="text-zinc-500 font-outfit font-light leading-relaxed line-clamp-3 text-[14px]">
                                    {caseStudy.summary}
                                </p>
                            </div>

                            {/* Image Container - BOTTOM: Edge-to-edge */}
                            <div className="relative aspect-[16/11] overflow-hidden w-full">
                                <Image
                                    src={caseStudy.image_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop'}
                                    alt={caseStudy.title}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />

                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-500" />

                                {/* Centered 'Learn more' button - Hidden by default, flex on hover */}
                                <div className="absolute inset-0 hidden group-hover:flex items-center justify-center pointer-events-none">
                                    <div className="flex items-center gap-3 px-8 py-3 bg-white/10 backdrop-blur-md border border-white/40 text-white rounded-full text-[12px] font-bold font-outfit uppercase tracking-widest shadow-2xl transition-all duration-500 scale-95 group-hover:scale-100 pointer-events-auto">
                                        <span>{lang === 'en' ? 'Learn more' : 'Ver más'}</span>
                                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                                            <ArrowRight size={12} className="text-white" />
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </Link>
                    ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 pt-8 border-t border-zinc-100">
                        {/* Prev Button */}
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-3 rounded-2xl border border-zinc-200 text-zinc-400 hover:bg-zinc-50 hover:text-brand disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-zinc-400 transition-all group"
                        >
                            <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-1.5 px-4">
                            {Array.from({ length: totalPages }).map((_, i) => {
                                const pageNum = i + 1;
                                const isCurrent = currentPage === pageNum;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`w-11 h-11 flex items-center justify-center rounded-2xl font-outfit text-sm font-bold transition-all ${
                                            isCurrent
                                                ? 'bg-brand text-white shadow-lg shadow-brand/20'
                                                : 'text-zinc-500 hover:bg-zinc-50 hover:text-brand border border-transparent hover:border-zinc-100'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-3 rounded-2xl border border-zinc-200 text-zinc-400 hover:bg-zinc-50 hover:text-brand disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-zinc-400 transition-all group"
                        >
                            <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                )}
            </div>
            )}
        </div>
    );
}
