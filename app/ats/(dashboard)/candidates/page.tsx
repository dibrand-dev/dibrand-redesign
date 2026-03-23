import React from 'react';
import { getAllCandidates, getRecruiters } from '../../actions';
import { Users, Filter, Search, MoreVertical, ExternalLink, Calendar, MapPin, Building2, Briefcase } from 'lucide-react';
import { createClient } from '@/lib/supabase-server-client';
import Link from 'next/link';
import CandidateActionMenu from './CandidateActionMenu';

export default async function AtsCandidatesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const resolvedParams = await searchParams;
    const status = resolvedParams.status as string || undefined;
    const search = resolvedParams.search as string || undefined;

    const supabaseAuth = await createClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();
    const userRole = user?.user_metadata?.role || 'recruiter';

    const [candidates, recruiters] = await Promise.all([
        getAllCandidates({ status, search }),
        getRecruiters()
    ]);

    const pipelineStages = ['New', 'Screening', 'Interview', 'Offered', 'Rejected'];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Context Heading */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none mb-3">
                        {userRole === 'admin' || userRole === 'SuperAdmin' ? 'Todos los ' : 'Mis '}
                        <span className="text-indigo-600">Candidatos</span>
                    </h2>
                    <p className="text-slate-500 font-medium italic text-sm">
                        {userRole === 'admin' || userRole === 'SuperAdmin' ? 'Supervisión global del pipeline de talentos.' : 'Gestiona el pipeline de tus talentos presentados.'}
                    </p>
                </div>
                <form className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input
                        name="search"
                        type="text"
                        defaultValue={search}
                        placeholder="Buscar candidatos..."
                        className="pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all w-72"
                    />
                </form>
            </div>

            {/* Pipeline Tabs Summary */}
            <div className="flex flex-wrap items-center gap-3">
                <Link 
                    href="/ats/candidates"
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${!status ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >
                    Todos ({candidates.length})
                </Link>
                {pipelineStages.map(stage => (
                    <Link 
                        key={stage} 
                        href={`/ats/candidates?status=${stage}`}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${status === stage ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                    >
                        {stage}
                    </Link>
                ))}
            </div>

            {/* Candidates Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-inter">Candidato</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-inter">Posición</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-inter text-center">Estado</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-inter">Contacto</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-inter text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 italic">
                            {candidates.length > 0 ? candidates.map((candidate) => (
                                <tr key={candidate.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-xs text-indigo-600 border border-slate-200">
                                                {candidate.first_name?.charAt(0) || 'C'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 uppercase not-italic">{candidate.first_name} {candidate.last_name}</p>
                                                <p className="text-[10px] text-slate-500 font-medium italic">{new Date(candidate.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700 not-italic">
                                            <Briefcase size={16} className="text-slate-300" />
                                            {candidate.job?.title || 'General App.'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-black tracking-widest shadow-sm ${
                                            candidate.status === 'New' ? 'bg-blue-50 text-blue-600 shadow-blue-100/50' :
                                            candidate.status === 'Screening' ? 'bg-indigo-50 text-indigo-600 shadow-indigo-100/50' :
                                            candidate.status === 'Interview' ? 'bg-emerald-50 text-emerald-600 shadow-emerald-100/50' :
                                            candidate.status === 'Offered' ? 'bg-purple-100 text-purple-700 shadow-purple-100/50' :
                                            'bg-rose-50 text-rose-600 shadow-rose-100/50'
                                        }`}>
                                            {candidate.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1 text-[10px] text-slate-500 font-medium uppercase tracking-tight">
                                            <span className="truncate max-w-[150px]">{candidate.email}</span>
                                            {candidate.phone && <span className="text-slate-400">{candidate.phone}</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <CandidateActionMenu 
                                            candidateId={candidate.id} 
                                            currentStatus={candidate.status}
                                            recruiters={recruiters}
                                            userRole={userRole}
                                        />
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-slate-400 font-medium italic">No se encontraron candidatos con los filtros actuales.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

