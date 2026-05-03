'use client';

import React, { useState, useTransition } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Trash2, Building2, Mail, Loader2, Search, ChevronDown } from 'lucide-react';
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
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const filteredLeads = leads.filter(lead => 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (lead.service_interest && lead.service_interest.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const toggleExpand = (id: string) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    const handleDelete = (id: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este lead? Esta acción no se puede deshacer.')) return;
        
        setDeletingId(id);
        startTransition(async () => {
            const result = await deleteLead(id);
            if (result.success) {
                setLeads(prev => prev.filter(l => l.id !== id));
                if (expandedId === id) setExpandedId(null);
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
                {filteredLeads.map((lead) => {
                    const isExpanded = expandedId === lead.id;
                    return (
                        <div key={lead.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            {/* Clickable Header */}
                            <button
                                onClick={() => toggleExpand(lead.id)}
                                className="w-full flex justify-between items-start p-5 text-left"
                            >
                                <div>
                                    <h3 className="font-bold text-slate-900 text-base">{lead.name}</h3>
                                    <div className="text-xs text-slate-500 font-medium mt-0.5">
                                        {format(new Date(lead.created_at), "d 'de' MMMM, yyyy", { locale: es })}
                                    </div>
                                </div>
                                <ChevronDown 
                                    size={18} 
                                    className={`text-slate-400 mt-1 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                                />
                            </button>

                            {/* Expanded Content */}
                            {isExpanded && (
                                <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
                                    <div className="space-y-2 text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <Mail size={14} className="text-slate-400 shrink-0" />
                                            <a href={`mailto:${lead.email}`} className="text-blue-600 font-medium break-all">{lead.email}</a>
                                        </div>
                                        {lead.company && (
                                            <div className="flex items-center gap-2">
                                                <Building2 size={14} className="text-slate-400 shrink-0" />
                                                <span>{lead.company}</span>
                                            </div>
                                        )}
                                    </div>

                                    {lead.service_interest && (
                                        <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg uppercase tracking-wider">
                                            {lead.service_interest}
                                        </span>
                                    )}

                                    {lead.message && (
                                        <div className="p-3 bg-slate-50 rounded-xl text-sm text-slate-600 border border-slate-100 whitespace-pre-wrap break-words leading-relaxed">
                                            {lead.message}
                                        </div>
                                    )}

                                    <div className="flex justify-end pt-1">
                                        <button
                                            onClick={() => handleDelete(lead.id)}
                                            disabled={isPending && deletingId === lead.id}
                                            className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                                        >
                                            {isPending && deletingId === lead.id 
                                                ? <Loader2 size={14} className="animate-spin" /> 
                                                : <Trash2 size={14} />}
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
                {filteredLeads.length === 0 && (
                    <div className="text-center py-10 bg-white rounded-2xl border border-slate-200">
                        <p className="text-slate-500 font-medium">No se encontraron leads.</p>
                    </div>
                )}
            </div>

            {/* Desktop Table with expandable rows */}
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
                            {filteredLeads.map((lead) => {
                                const isExpanded = expandedId === lead.id;
                                return (
                                    <React.Fragment key={lead.id}>
                                        <tr 
                                            className={`transition-colors ${isExpanded ? 'bg-blue-50/40' : 'hover:bg-slate-50/50'}`}
                                        >
                                            <td className="py-4 px-6 text-slate-500 font-medium whitespace-nowrap">
                                                {format(new Date(lead.created_at), "dd/MM/yyyy HH:mm")}
                                            </td>
                                            <td className="py-4 px-6">
                                                {/* Clickable name to expand */}
                                                <button 
                                                    onClick={() => toggleExpand(lead.id)}
                                                    className="flex items-center gap-1.5 group text-left"
                                                >
                                                    <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                        {lead.name}
                                                    </span>
                                                    <ChevronDown 
                                                        size={14} 
                                                        className={`text-slate-400 group-hover:text-blue-500 transition-all duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                                                    />
                                                </button>
                                                <a href={`mailto:${lead.email}`} className="text-blue-600 font-medium block text-xs mt-0.5">{lead.email}</a>
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
                                                    <p className={`text-slate-500 text-xs leading-relaxed transition-all ${isExpanded ? '' : 'line-clamp-2'}`}>
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

                                        {/* Expanded full message row */}
                                        {isExpanded && lead.message && (
                                            <tr className="bg-blue-50/30 border-t-0">
                                                <td colSpan={5} className="px-6 pb-5 pt-0">
                                                    <div className="bg-white border border-blue-100 rounded-xl p-4 text-sm text-slate-600 whitespace-pre-wrap break-words leading-relaxed shadow-inner">
                                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Mensaje completo</p>
                                                        {lead.message}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
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
