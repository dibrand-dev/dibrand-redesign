import React from 'react';
import { getRecruiterStats, getRecentCandidates } from '../actions';
import { Users, Briefcase, TrendingUp, Calendar, Filter, MoreHorizontal, ArrowRight, AlertTriangle, Clock, LayoutGrid } from 'lucide-react';
import Link from 'next/link';

export default async function AtsDashboard() {
    const statsData = await getRecruiterStats();
    const recentCandidatesData = await getRecentCandidates();
    
    // Fallback if null (e.g. database not migrated yet or unauth)
    const counts = statsData?.counts || { Total: 0 };
    const staleCount = statsData?.staleCount || 0;

    const stats = [
        { label: 'Mis Candidatos', count: counts.Total || 0, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Screening / Entrevistas', count: (counts.Screening || 0) + (counts.Interview || 0), icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Ofertas / Cierres', count: counts.Offered || 0, icon: LayoutGrid, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Descartados', count: counts.Rejected || 0, icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-50' }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header / Stale Alert */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none mb-3">ATS <span className="text-indigo-600">Recruiter</span></h2>
                    <p className="text-slate-500 font-medium italic text-sm">Resumen dinámico de tu pipeline de talento.</p>
                </div>
                
                {staleCount > 0 && (
                    <div className="flex items-center gap-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl animate-pulse shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Stale Candidates</p>
                            <p className="text-sm font-bold text-amber-900">Tienes {staleCount} candidatos estancados (+5 días)</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all group hover:border-indigo-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h4 className="text-4xl font-black text-slate-900 tracking-tight">{stat.count}</h4>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Recent Candidates List */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-fit">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] font-inter">Candidatos Recientes</h3>
                        <Link href="/ats/candidates" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                            Ver todos <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100 italic">
                        {recentCandidatesData.length > 0 ? recentCandidatesData.map((candidate) => {
                            const isStale = (new Date().getTime() - new Date(candidate.updated_at).getTime()) > 5 * 24 * 60 * 60 * 1000 && !['Rejected', 'Offered'].includes(candidate.status);
                            
                            return (
                                <div key={candidate.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-xs text-indigo-600">
                                            {candidate.first_name?.charAt(0) || 'C'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 uppercase not-italic">{candidate.first_name} {candidate.last_name}</p>
                                            <p className="text-[10px] text-slate-500 font-medium italic">{candidate.job?.title || 'General App.'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 px-6">
                                        {isStale && (
                                            <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-600 rounded-md border border-amber-100 animate-pulse">
                                                <Clock size={12} />
                                                <span className="text-[9px] font-black uppercase tracking-tight">Estancado</span>
                                            </div>
                                        )}
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-black tracking-widest shadow-sm ${
                                            candidate.status === 'New' ? 'bg-blue-50 text-blue-600' :
                                            candidate.status === 'Screening' ? 'bg-indigo-50 text-indigo-600' :
                                            candidate.status === 'Interview' ? 'bg-emerald-50 text-emerald-600' :
                                            candidate.status === 'Offered' ? 'bg-purple-100 text-purple-700' :
                                            'bg-rose-50 text-rose-600'
                                        }`}>
                                            {candidate.status}
                                        </span>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="p-12 text-center text-slate-400 italic text-sm font-medium">No se encontraron aplicaciones recientes.</div>
                        )}
                    </div>
                </div>

                {/* Quick Positions Summary */}
                <div className="lg:col-span-4 bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden h-fit">
                    <h4 className="text-lg font-bold mb-6 uppercase tracking-tight relative z-10">Búsquedas Críticas</h4>
                    <div className="space-y-4 relative z-10">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Dibrand Tech</p>
                            <p className="text-sm font-bold uppercase tracking-tight">Cloud Architect</p>
                            <div className="mt-3 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-3/4"></div>
                            </div>
                        </div>
                    </div>
                    <Link href="/ats/jobs" className="mt-8 flex items-center justify-center gap-2 w-full py-4 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">
                        Ver Vacantes Activas
                    </Link>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 -mr-16 -mt-16 rounded-full blur-2xl"></div>
                </div>
            </div>
        </div>
    );
}
