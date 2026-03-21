import React from 'react';
import { createClient } from '@/lib/supabase-server-client';
import { Users, Filter, Search, MoreVertical, ExternalLink, Calendar, MapPin, Building2, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default async function AtsCandidatesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Mock data for "My Candidates"
    const myCandidates = [
        { id: '1', name: 'Alvaro Sanchez', position: 'Senior Backend Engineer', status: 'Screening', date: 'Hace 2h', location: 'Argentina', salary: '6k' },
        { id: '2', name: 'Maria Fernandez', position: 'Product Designer', status: 'Interview', date: 'Hace 5h', location: 'Spain', salary: '5k' },
        { id: '3', name: 'Lucas Rossi', position: 'Fullstack Dev', status: 'New', date: 'Hoy', location: 'Uruguay', salary: '4.5k' },
        { id: '4', name: 'Sofia Mendez', position: 'React Native Lead', status: 'Rejected', date: 'Ayer', location: 'Mexico', salary: '7k' },
        { id: '5', name: 'Julian Blanco', position: 'DevOps Architect', status: 'Offered', date: '2 días', location: 'Colombia', salary: '8k' },
    ];

    const pipelineStages = ['New', 'Screening', 'Interview', 'Offered', 'Rejected'];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Context Heading */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none mb-3">Mis <span className="text-indigo-600">Candidatos</span></h2>
                    <p className="text-slate-500 font-medium italic text-sm">Gestiona el pipeline de tus talentos presentados.</p>
                </div>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar candidatos..."
                        className="pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all w-72"
                    />
                </div>
            </div>

            {/* Pipeline Tabs Summary */}
            <div className="flex flex-wrap items-center gap-3">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-indigo-600/20">Todos (12)</button>
                {pipelineStages.map(stage => (
                    <button key={stage} className="px-4 py-2 bg-white border border-slate-200 text-slate-500 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all">
                        {stage} ({(Math.random()*4).toFixed(0)})
                    </button>
                ))}
            </div>

            {/* Candidates Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-inter">Candidato</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-inter">Posición</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-inter text-center">Estado</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-inter">Ubicación</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-inter">Salario</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-inter text-right line-clamp-1">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 italic">
                        {myCandidates.map((candidate) => (
                            <tr key={candidate.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-xs text-indigo-600 border border-slate-200">
                                            {candidate.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 uppercase not-italic">{candidate.name}</p>
                                            <p className="text-[10px] text-slate-500 font-medium italic">{candidate.date}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700 not-italic">
                                        <Briefcase size={16} className="text-slate-300" />
                                        {candidate.position}
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-black tracking-widest shadow-sm ${
                                        candidate.status === 'New' ? 'bg-blue-50 text-blue-600' :
                                        candidate.status === 'Screening' ? 'bg-indigo-50 text-indigo-600' :
                                        candidate.status === 'Interview' ? 'bg-emerald-50 text-emerald-600' :
                                        candidate.status === 'Offered' ? 'bg-purple-100 text-purple-700' :
                                        'bg-rose-50 text-rose-600'
                                    }`}>
                                        {candidate.status}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium uppercase tracking-tight">
                                        <MapPin size={14} className="text-slate-300" />
                                        {candidate.location}
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-xs font-bold text-slate-800 tracking-tight not-italic">U$S {candidate.salary}</span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                            <ExternalLink size={18} />
                                        </button>
                                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                                            <MoreVertical size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

