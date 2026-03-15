'use client'

import React, { useState, useEffect } from 'react';
import { getTestimonials, deleteTestimonial } from './actions';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Quote, Search, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function TestimonialsAdminPage() {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const loadTestimonials = async () => {
        setIsLoading(true);
        try {
            const data = await getTestimonials();
            setTestimonials(data);
        } catch (error) {
            console.error('Error loading testimonials:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadTestimonials();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este testimonio?')) {
            try {
                await deleteTestimonial(id);
                loadTestimonials();
            } catch (error) {
                console.error('Error deleting testimonial:', error);
                alert('Error al eliminar');
            }
        }
    };

    const filteredTestimonials = testimonials.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20 font-inter">
            {/* SaaS Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-admin-text-primary tracking-tight uppercase">Testimonios</h2>
                    <p className="text-admin-text-secondary text-sm mt-1 font-medium italic">Gestiona la reputación y confianza de Dibrand.</p>
                </div>
                <Link
                    href="/admin/testimonials/new"
                    className="inline-flex items-center gap-3 px-8 py-3.5 bg-admin-accent text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-admin-accent/20 active:scale-95 group"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span>Nuevo Testimonio</span>
                </Link>
            </div>

            {/* Stats / Quick Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-admin-card-bg p-6 rounded-3xl border border-admin-border shadow-sm flex items-center justify-between transition-all hover:border-admin-accent/20">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Feedback</p>
                        <p className="text-3xl font-black text-admin-text-primary mt-1">{testimonials.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-admin-accent/5 rounded-2xl flex items-center justify-center text-admin-accent">
                        <Quote size={24} />
                    </div>
                </div>
                <div className="bg-admin-card-bg p-6 rounded-3xl border border-admin-border shadow-sm flex items-center justify-between transition-all hover:border-admin-accent/20">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Activos en Web</p>
                        <p className="text-3xl font-black text-green-500 mt-1">{testimonials.filter(t => t.is_visible).length}</p>
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
                            placeholder="Buscar por cliente o empresa..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-admin-bg/50 border border-admin-border rounded-xl focus:ring-4 focus:ring-admin-accent/5 focus:border-admin-accent outline-none text-sm transition-all"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="p-20 text-center animate-pulse">
                        <Loader2 className="w-10 h-10 text-admin-accent animate-spin mx-auto mb-4" />
                        <p className="text-admin-text-secondary font-bold text-xs uppercase tracking-widest">Cargando Testimonios...</p>
                    </div>
                ) : filteredTestimonials.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="w-20 h-20 bg-admin-bg rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                            <Quote size={40} />
                        </div>
                        <h3 className="text-lg font-black text-admin-text-primary uppercase tracking-tight">Sin resultados</h3>
                        <p className="text-admin-text-secondary text-sm mt-1 max-w-xs mx-auto">No encontramos testimonios que coincidan con tu búsqueda.</p>
                        <button 
                            onClick={() => setSearchTerm('')}
                            className="mt-6 px-6 py-2 bg-admin-bg text-admin-text-primary rounded-xl text-[10px] font-black uppercase tracking-widest border border-admin-border hover:bg-admin-card-bg transition-colors"
                        >
                            Limpiar Filtros
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-admin-bg/5">
                                <tr>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Cliente / Empresa</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Extracto del Contenido</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Estado</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Controles</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-admin-border/50">
                                {filteredTestimonials.map((t) => (
                                    <tr key={t.id} className="hover:bg-admin-bg/30 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-admin-bg flex-shrink-0 relative overflow-hidden ring-2 ring-admin-border/50 shadow-sm group-hover:ring-admin-accent/30 transition-all">
                                                    {t.avatar_url ? (
                                                        <Image src={t.avatar_url} alt={t.name} fill className="object-cover" unoptimized />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-black text-sm uppercase">
                                                            {t.name ? t.name.substring(0, 2) : '??'}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-black text-admin-text-primary group-hover:text-admin-accent transition-colors text-base uppercase tracking-tight">
                                                        {t.name}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] text-admin-text-secondary font-bold uppercase tracking-widest bg-admin-bg/50 px-2 py-0.5 rounded border border-admin-border/30">
                                                            {t.company}
                                                        </span>
                                                        <span className="text-[9px] text-gray-400 font-medium uppercase tracking-wider">
                                                            {t.role_es}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm text-admin-text-secondary line-clamp-2 max-w-md font-medium leading-relaxed italic">
                                                "{t.content_es}"
                                            </p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-center">
                                                {t.is_visible ? (
                                                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                                                        <CheckCircle2 size={12} /> Visible
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-widest border border-gray-200">
                                                        <XCircle size={12} /> Oculto
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/admin/testimonials/${t.id}`}
                                                    className="p-3 text-gray-400 hover:text-admin-accent hover:bg-admin-accent/10 rounded-2xl border border-transparent hover:border-admin-accent/20 transition-all active:scale-90"
                                                    title="Editar"
                                                >
                                                    <Edit2 size={20} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(t.id)}
                                                    className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-2xl border border-transparent hover:border-red-500/20 transition-all active:scale-90"
                                                    title="Eliminar"
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
