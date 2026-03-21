import React from 'react';
import { createClient } from '@/lib/supabase-server-client';
import { Briefcase, MapPin, Building2, Clock, DollarSign, Filter, Search, ChevronRight, Globe, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default async function AtsJobsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Mock data for open positions
    const openPositions = [
        { id: '1', title: 'Senior Backend Engineer', location: 'Remote (LATAM)', industry: 'FinTech', seniority: 'Senior', salary: '6k - 8k', candidates: 4 },
        { id: '2', title: 'Product Designer', location: 'Spain / Remote', industry: 'E-commerce', seniority: 'Semi-Senior', salary: '4k - 6k', candidates: 2 },
        { id: '3', title: 'Fullstack Developer', location: 'Uruguay / Remote', industry: 'SaaS', seniority: 'Junior/Mid', salary: '3k - 4.5k', candidates: 1 },
        { id: '4', title: 'React Native Lead', location: 'Mexico / Hybrid', industry: 'HealthTech', seniority: 'Lead', salary: '7k - 9k', candidates: 6 },
        { id: '5', title: 'AWS Cloud Architect', location: 'Global Remote', industry: 'Infrastructure', seniority: 'Senior', salary: '8k - 10k', candidates: 3 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Context Heading */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none mb-3">Vacantes <span className="text-indigo-600">Disponibles</span></h2>
                    <p className="text-slate-500 font-medium italic text-sm">Explora las posiciones abiertas y asigna tus mejores candidatos.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar vacantes..."
                            className="pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all w-72"
                        />
                    </div>
                </div>
            </div>

            {/* Jobs Cards Feed */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {openPositions.map((job) => (
                    <div key={job.id} className="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group cursor-pointer relative overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black italic text-2xl shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-500">
                                di
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-3.5 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100`}>
                                    {job.seniority}
                                </span>
                                <div className="p-2 text-slate-300 group-hover:text-indigo-600 transition-colors">
                                    <ChevronRight size={20} />
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight group-hover:text-indigo-600 transition-colors mb-2">{job.title}</h3>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                    <MapPin size={14} className="text-slate-400" />
                                    {job.location}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                    <Building2 size={14} className="text-slate-400" />
                                    {job.industry}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                                    <Globe size={14} />
                                    U$S {job.salary}
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    {[1,2,3].map(i => (
                                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                            {i}
                                        </div>
                                    ))}
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 italic">{job.candidates} presentados</span>
                            </div>
                            <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                                Postular Candidato
                            </button>
                        </div>

                        {/* Decor */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 -mr-16 -mt-16 rounded-full group-hover:bg-indigo-600/10 transition-colors"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
