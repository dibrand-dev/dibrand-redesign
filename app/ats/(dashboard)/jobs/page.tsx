import React from 'react';
import { getRecruiterJobs } from '../../actions';

interface Job {
    id: string;
    title: string;
    title_es?: string;
    location?: string;
    location_es?: string;
    salary_range?: string;
    seniority?: string;
    myCandidatesCount: number;
    totalCandidatesCount: number;
    targetHires: number;
}
import { Briefcase, MapPin, Building2, Globe, ChevronRight, TrendingUp, Users, Target } from 'lucide-react';
import Link from 'next/link';

export default async function AtsJobsPage() {
    const jobs = await getRecruiterJobs();

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="pb-6 border-b border-slate-200">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none mb-3">Vacantes <span className="text-indigo-600">Disponibles</span></h2>
                <p className="text-slate-500 font-medium italic text-sm">Explora las posiciones abiertas y el progreso hacia el objetivo de contratación.</p>
            </div>

            {/* Jobs Cards Feed */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {jobs.length > 0 ? jobs.map((job: Job) => {
                    const progress = Math.min((job.totalCandidatesCount / (job.targetHires * 5)) * 100, 100); // 5 is arbitrary for visualization
                    
                    return (
                        <div key={job.id} className="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group cursor-pointer relative overflow-hidden h-fit">
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black italic text-2xl shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-500">
                                    di
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 mb-1">
                                            <Target size={12} />
                                            {job.myCandidatesCount} / {job.targetHires} Hires
                                        </div>
                                        <span className={`px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-100`}>
                                            {job.seniority}
                                        </span>
                                    </div>
                                    <div className="p-2 text-slate-300 group-hover:text-indigo-600 transition-colors">
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight group-hover:text-indigo-600 transition-colors mb-2">{job.title_es || job.title}</h3>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium italic">
                                        <MapPin size={14} className="text-slate-400" />
                                        {job.location_es || job.location || 'Remoto'}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100 text-xs">
                                        <Globe size={14} />
                                        U$S {job.salary_range}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex flex-col gap-2 w-full">
                                    <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                                        <span>Candidatos Presentados</span>
                                        <span>{job.totalCandidatesCount} Total</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Decor */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 -mr-16 -mt-16 rounded-full group-hover:bg-indigo-600/10 transition-colors"></div>
                        </div>
                    );
                }) : (
                    <div className="col-span-full p-20 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 italic font-medium uppercase text-sm">
                        No hay vacantes activas en este momento.
                    </div>
                )}
            </div>
        </div>
    );
}
