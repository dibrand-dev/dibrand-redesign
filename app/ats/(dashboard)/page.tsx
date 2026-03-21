import React from 'react';
import { createClient } from '@/lib/supabase-server-client';
import { Users, Briefcase, TrendingUp, Calendar, Filter, MoreHorizontal, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function AtsDashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // In a real app, we'd fetch candidates where recruiter_id = user.id
    // For now, mockup of the recruiter's specific dashboard
    
    const stats = [
        { label: 'Mis Candidatos', count: 12, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Entrevistas Hoy', count: 3, icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Vacantes Activas', count: 8, icon: Briefcase, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Ratio de Cierre', count: '18%', icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-50' }
    ];

    const recentCandidates = [
        { id: '1', name: 'Alvaro Sanchez', position: 'Senior Backend Engineer', status: 'Screening', date: 'Hace 2h' },
        { id: '2', name: 'Maria Fernandez', position: 'Product Designer', status: 'Interview', date: 'Hace 5h' },
        { id: '3', name: 'Lucas Rossi', position: 'Fullstack Dev', status: 'New', date: 'Hoy' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Context Heading */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none mb-3">ATS <span className="text-indigo-600">Recruiter</span></h2>
                    <p className="text-slate-500 font-medium italic text-sm">Gestiona tus procesos de selección y candidatos asignados.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                        <Filter size={14} /> Filtros
                    </button>
                    <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-indigo-600/20">
                        Presentar Candidato
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                <stat.icon size={24} />
                            </div>
                            <button className="text-slate-300 hover:text-slate-500">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h4 className="text-4xl font-black text-slate-900 tracking-tight">{stat.count}</h4>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Recent Candidates */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-fit">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Candidatos Recientes</h3>
                        <Link href="/ats/candidates" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                            Ver todos <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {recentCandidates.map((candidate) => (
                            <div key={candidate.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-xs text-indigo-600">
                                        {candidate.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 uppercase">{candidate.name}</p>
                                        <p className="text-[10px] text-slate-500 font-medium italic">{candidate.position}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8 px-6">
                                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] uppercase font-black tracking-widest">
                                        {candidate.status}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-medium font-mono lowercase">{candidate.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Shared Positions / Quick Links */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-xl shadow-indigo-900/10">
                        <h4 className="text-lg font-bold mb-4 uppercase tracking-tight">Active Search Highlights</h4>
                        <div className="space-y-4">
                            <div className="p-4 bg-white/10 rounded-xl border border-white/10 hover:bg-white/15 transition-all cursor-pointer">
                                <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">Dibrand Staffing</p>
                                <p className="text-sm font-bold">AWS Cloud Architect</p>
                            </div>
                            <div className="p-4 bg-white/10 rounded-xl border border-white/10 hover:bg-white/15 transition-all cursor-pointer">
                                <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">Client Search</p>
                                <p className="text-sm font-bold">Mobile React Native Lead</p>
                            </div>
                        </div>
                        <button className="w-full mt-6 py-3 border border-white/20 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all">
                            Explorar Todas las Vacantes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
