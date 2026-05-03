'use client';

import React, { useState, useTransition } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Trash2, Building2, Mail, Loader2, Search } from 'lucide-react';
import { deleteLead } from './actions';

interface Lead {
    id: string;
    name: string;
    email: string;
    company: string | null;
    service_interest: string | null;
    message: string | null;
    created_at: string;
}

interface Props {
    initialLeads: Lead[];
}

export default function LeadsList({ initialLeads }: Props) {
    const [leads, setLeads] = useState<Lead[]>(initialLeads);
    const [isPending, startTransition] = useTransition();
    const [searchTerm, setSearchTerm] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const filteredLeads = leads.filter(lead => 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (lead.service_interest && lead.service_interest.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleDelete = (id: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este lead? Esta acción no se puede deshacer.')) return;
        
        setDeletingId(id);
        startTransition(async () => {
            const result = await deleteLead(id);
            if (result.success) {
                setLeads(prev => prev.filter(l => l.id !== id));
            } else {
                alert('Error al eliminar el lead.');
            }
            setDeletingId(null);
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text"
                        placeholder="Buscar por nombre, email o empresa..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-700"
                    />
                </div>
                <div className="text-sm font-bold text-slate-500 shrink-0">
                    {filteredLeads.length} {filteredLeads.length === 1 ? 'Lead' : 'Leads'}
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {filteredLeads.map((lead) => (
                    <div key={lead.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold text-slate-900 text-base">{lead.name}</h3>
                                <div className="text-xs text-slate-500 font-medium">
                                    {format(new Date(lead.created_at), "d 'de' MMMM, yyyy", { locale: es })}
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(lead.id)}
                                disabled={isPending && deletingId === lead.id}
                                className="text-red-400 hover:text-red-600 p-2 -mr-2 -mt-2 transition-colors disabled:opacity-50"
                                title="Eliminar lead"
                            >
                                {isPending && deletingId === lead.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                            </button>
                        </div>
                        
                        <div className="space-y-2 mt-4 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                                <Mail size={14} className="text-slate-400" />
                                <a href={`mailto:${lead.email}`} className="text-blue-600 font-medium truncate">{lead.email}</a>
                            </div>
                            {lead.company && (
                                <div className="flex items-center gap-2">
                                    <Building2 size={14} className="text-slate-400" />
                                    <span className="truncate">{lead.company}</span>
                                </div>
                            )}
                        </div>

                        {lead.service_interest && (
                            <div className="mt-4">
                                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg uppercase tracking-wider">
                                    {lead.service_interest}
                                </span>
                            </div>
                        )}

                        {lead.message && (
                            <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-500 border border-slate-100 whitespace-pre-wrap break-words">
                                {lead.message}
                            </div>
                        )}
                    </div>
                ))}
                {filteredLeads.length === 0 && (
                    <div className="text-center py-10 bg-white rounded-2xl border border-slate-200">
                        <p className="text-slate-500 font-medium">No se encontraron leads.</p>
                    </div>
                )}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-500 uppercase tracking-widest">
                                <th className="py-4 px-6 font-semibold">Fecha</th>
                                <th className="py-4 px-6 font-semibold">Contacto</th>
                                <th className="py-4 px-6 font-semibold">Interés</th>
                                <th className="py-4 px-6 font-semibold">Mensaje</th>
                                <th className="py-4 px-6 font-semibold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-sm">
                            {filteredLeads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 px-6 text-slate-500 font-medium whitespace-nowrap">
                                        {format(new Date(lead.created_at), "dd/MM/yyyy HH:mm")}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="font-bold text-slate-900 mb-0.5">{lead.name}</div>
                                        <a href={`mailto:${lead.email}`} className="text-blue-600 font-medium block text-xs">{lead.email}</a>
                                        {lead.company && <div className="text-slate-500 text-xs flex items-center gap-1 mt-1"><Building2 size={12} /> {lead.company}</div>}
                                    </td>
                                    <td className="py-4 px-6">
                                        {lead.service_interest ? (
                                            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded-lg uppercase tracking-wider whitespace-nowrap">
                                                {lead.service_interest}
                                            </span>
                                        ) : <span className="text-slate-400">-</span>}
                                    </td>
                                    <td className="py-4 px-6 max-w-xs">
                                        {lead.message ? (
                                            <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed" title={lead.message}>
                                                {lead.message}
                                            </p>
                                        ) : <span className="text-slate-400 italic text-xs">Sin mensaje</span>}
                                    </td>
                                    <td className="py-4 px-6 text-right whitespace-nowrap">
                                        <button
                                            onClick={() => handleDelete(lead.id)}
                                            disabled={isPending && deletingId === lead.id}
                                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                                            title="Eliminar lead"
                                        >
                                            {isPending && deletingId === lead.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredLeads.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-slate-500 font-medium">
                                        No se encontraron leads.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
