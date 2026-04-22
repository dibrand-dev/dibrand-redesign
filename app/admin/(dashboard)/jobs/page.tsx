'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, MapPin, Globe, Loader2, Search, Filter } from 'lucide-react';
import { getJobs, toggleJobStatus, deleteJob } from '@/app/actions/jobs';

interface JobOpening {
    id: string;
    title: string;
    title_es?: string;
    industry: string;
    location: string;
    location_es?: string;
    employment_type: string;
    modality: string;
    is_active: boolean;
    created_at: string;
    required_language?: string;
    years_of_experience?: string;
    positions_count?: number;
}

export default function JobsPage() {
    const [jobs, setJobs] = useState<JobOpening[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchJobs();
    }, []);

    async function fetchJobs() {
        setLoading(true);
        try {
            const data = await getJobs();
            setJobs(data || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
        setLoading(false);
    }

    async function handleToggle(id: string, currentStatus: boolean) {
        try {
            await toggleJobStatus(id, currentStatus);
            setJobs(prev => prev.map(job => 
                job.id === id ? { ...job, is_active: !currentStatus } : job
            ));
        } catch (error) {
            console.error('Error updating status:', error);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('¿Estás seguro de que quieres eliminar esta vacante?')) return;
        try {
            await deleteJob(id);
            setJobs(prev => prev.filter(job => job.id !== id));
        } catch (error) {
            console.error('Error deleting job:', error);
        }
    }

    const filteredJobs = jobs.filter(job => 
        (job.title_es || job.title).toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.industry.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 font-inter pb-20 animate-in fade-in duration-700">
            {/* SaaS Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-admin-text-primary tracking-tight uppercase">Vacantes Activas</h2>
                    <p className="text-admin-text-secondary text-sm mt-1 font-medium italic">Gestión de talento y procesos de selección.</p>
                </div>
                <Link
                    href="/admin/jobs/new"
                    className="inline-flex items-center gap-3 px-8 py-3.5 bg-admin-accent text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-admin-accent/20 active:scale-95 group"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span>Nueva Búsqueda</span>
                </Link>
            </div>

            {/* Stats / Quick Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-admin-card-bg p-6 rounded-3xl border border-admin-border shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Vacantes</p>
                        <p className="text-3xl font-black text-admin-text-primary mt-1">{jobs.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-admin-accent/5 rounded-2xl flex items-center justify-center text-admin-accent">
                        <Globe size={24} />
                    </div>
                </div>
                <div className="bg-admin-card-bg p-6 rounded-3xl border border-admin-border shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Búsquedas Activas</p>
                        <p className="text-3xl font-black text-green-500 mt-1">{jobs.filter(j => j.is_active).length}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Main Table Content */}
            <div className="bg-admin-card-bg rounded-3xl shadow-xl shadow-black/5 border border-admin-border overflow-hidden">
                {/* Table Header / Filters */}
                <div className="p-6 border-b border-admin-border flex flex-col md:flex-row gap-4 justify-between bg-admin-bg/10 backdrop-blur-sm">
                    <div className="relative group flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-admin-accent transition-colors" size={18} />
                        <input 
                            type="text"
                            placeholder="Buscar por cargo o industria..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-admin-bg/50 border border-admin-border rounded-xl focus:ring-4 focus:ring-admin-accent/5 focus:border-admin-accent outline-none text-sm transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-3 text-gray-400 hover:text-admin-text-primary hover:bg-admin-bg rounded-xl border border-admin-border transition-all">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="p-20 text-center animate-pulse">
                        <Loader2 className="w-10 h-10 text-admin-accent animate-spin mx-auto mb-4" />
                        <p className="text-admin-text-secondary font-bold text-xs uppercase tracking-widest">Cargando Búsquedas...</p>
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="w-20 h-20 bg-admin-bg rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                            <Globe size={40} />
                        </div>
                        <h3 className="text-lg font-black text-admin-text-primary uppercase tracking-tight">Sin resultados</h3>
                        <p className="text-admin-text-secondary text-sm mt-1 max-w-xs mx-auto">No encontramos vacantes que coincidan con tu búsqueda.</p>
                        <button 
                            onClick={() => setSearchTerm('')}
                            className="mt-6 px-6 py-2 bg-admin-bg text-admin-text-primary rounded-xl text-[10px] font-black uppercase tracking-widest border border-admin-border hover:bg-admin-card-bg transition-colors"
                        >
                            Limpiar Filtros
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-admin-bg/5">
                                <tr>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Posición / Industria</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Ubicación / Modalidad</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Estado</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Controles</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-admin-border/50">
                                {filteredJobs.map((job) => (
                                    <tr key={job.id} className="hover:bg-admin-bg/30 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="font-black text-admin-text-primary group-hover:text-admin-accent transition-colors text-base uppercase tracking-tight">
                                                {job.title_es || job.title}
                                            </div>
                                            <div className="text-[10px] text-admin-text-secondary font-bold mt-1 uppercase tracking-widest bg-admin-bg/50 px-2.5 py-1 rounded-md inline-block border border-admin-border/30">
                                                {job.industry}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-sm text-admin-text-primary font-bold">
                                                <MapPin size={16} className="text-admin-accent" />
                                                {job.location_es || job.location}
                                            </div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-wider opacity-60">
                                                {job.modality} • {job.employment_type}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <button
                                                onClick={() => handleToggle(job.id, job.is_active)}
                                                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${job.is_active
                                                    ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                                                    : 'bg-orange-500/10 text-orange-600 border border-orange-500/20'
                                                    }`}
                                            >
                                                <div className={`w-1.5 h-1.5 rounded-full ${job.is_active ? 'bg-green-500' : 'bg-orange-500'}`} />
                                                {job.is_active ? 'Publicado' : 'Pausado'}
                                            </button>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/admin/jobs/${job.id}`}
                                                    className="p-3 text-gray-400 hover:text-admin-accent hover:bg-admin-accent/10 rounded-2xl border border-transparent hover:border-admin-accent/20 transition-all active:scale-90"
                                                    title="Edit"
                                                >
                                                    <Edit size={20} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(job.id)}
                                                    className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-2xl border border-transparent hover:border-red-500/20 transition-all active:scale-90"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
