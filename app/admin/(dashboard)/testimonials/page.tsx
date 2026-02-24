'use client'

import React, { useState, useEffect } from 'react';
import { getTestimonials, deleteTestimonial } from './actions';
import TestimonialForm from './TestimonialForm';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import Image from 'next/image';

export default function TestimonialsAdminPage() {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<any>(null);

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

    const openEdit = (testimonial: any) => {
        setEditingTestimonial(testimonial);
        setShowForm(true);
    };

    const openNew = () => {
        setEditingTestimonial(null);
        setShowForm(true);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-corporate-grey tracking-tight">Testimonios</h1>
                    <p className="text-gray-500 mt-1 text-sm">Gestiona lo que los clientes dicen sobre Dibrand.</p>
                </div>
                <button
                    onClick={openNew}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus size={20} />
                    Nuevo Testimonio
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Cliente</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Empresa</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Contenido</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Estado</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">Cargando...</td>
                                </tr>
                            ) : testimonials.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium">No hay testimonios registrados.</td>
                                </tr>
                            ) : (
                                testimonials.map((t) => (
                                    <tr key={t.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 relative overflow-hidden ring-2 ring-gray-50">
                                                    {t.avatar_url ? (
                                                        <Image src={t.avatar_url} alt={t.name} fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xs uppercase">
                                                            {t.name ? t.name.substring(0, 2) : '??'}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-corporate-grey">{t.name}</div>
                                                    <div className="text-xs text-gray-500 font-medium">{t.role}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded uppercase tracking-wider">
                                                {t.company}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm text-gray-600 line-clamp-2 max-w-md">{t.content}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-center">
                                                {t.is_visible ? (
                                                    <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold uppercase tracking-wider">
                                                        <CheckCircle2 size={14} /> Visible
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold uppercase tracking-wider">
                                                        <XCircle size={14} /> Oculto
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => openEdit(t)}
                                                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                                                    title="Editar"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(t.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showForm && (
                <TestimonialForm
                    testimonial={editingTestimonial}
                    onClose={() => {
                        setShowForm(false);
                        loadTestimonials();
                    }}
                />
            )}
        </div>
    );
}
