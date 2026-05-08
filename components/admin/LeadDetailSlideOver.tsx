'use client';

import React, { useState, useTransition } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Mail, Building2, Calendar, MessageSquare, Tag, Trash2, Loader2, ExternalLink, Copy, Check } from 'lucide-react';
import SlideOver from '@/components/ui/SlideOver';
import { deleteLead } from '@/app/admin/(dashboard)/leads/actions';

interface Lead {
    id: string;
    name: string;
    email: string;
    company: string | null;
    service_interest: string | null;
    message: string | null;
    created_at: string;
    source?: string | null;
    status?: string | null;
    phone?: string | null;
}

interface Props {
    lead: Lead | null;
    open: boolean;
    onClose: () => void;
    onDeleted: (id: string) => void;
}

export default function LeadDetailSlideOver({ lead, open, onClose, onDeleted }: Props) {
    const [isPending, startTransition] = useTransition();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [copied, setCopied] = useState(false);

    if (!lead) return null;

    const handleDelete = () => {
        startTransition(async () => {
            const result = await deleteLead(lead.id);
            if (result.success) {
                onDeleted(lead.id);
                onClose();
            }
            setShowDeleteConfirm(false);
        });
    };

    const copyEmail = () => {
        navigator.clipboard.writeText(lead.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const initials = lead.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

    return (
        <>
            <SlideOver
                open={open}
                onClose={onClose}
                title="Detalle del Lead"
                subtitle={`Recibido ${format(new Date(lead.created_at), "d 'de' MMMM, yyyy", { locale: es })}`}
                widthClass="w-full sm:w-[440px] lg:w-[480px]"
            >
                <div className="p-6 space-y-6">
                    {/* Avatar + Name */}
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-black text-[18px] shrink-0 shadow-sm">
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-[18px] font-black text-slate-900 leading-tight truncate">{lead.name}</h3>
                            {lead.company && (
                                <div className="flex items-center gap-1.5 text-[13px] text-slate-500 font-medium mt-0.5">
                                    <Building2 size={14} className="shrink-0" /> {lead.company}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info cards */}
                    <div className="space-y-3">
                        {/* Email */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                    <Mail size={16} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                                    <a href={`mailto:${lead.email}`} className="text-[13px] font-bold text-blue-600 hover:underline truncate block">
                                        {lead.email}
                                    </a>
                                </div>
                            </div>
                            <button onClick={copyEmail} className="text-slate-400 hover:text-slate-700 transition-colors p-1.5" title="Copiar email">
                                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                            </button>
                        </div>

                        {/* Phone */}
                        {lead.phone && (
                            <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100 gap-3">
                                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                    <ExternalLink size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Teléfono</p>
                                    <p className="text-[13px] font-bold text-slate-900">{lead.phone}</p>
                                </div>
                            </div>
                        )}

                        {/* Date */}
                        <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100 gap-3">
                            <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                                <Calendar size={16} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha de contacto</p>
                                <p className="text-[13px] font-bold text-slate-900">
                                    {format(new Date(lead.created_at), "EEEE d 'de' MMMM, yyyy – HH:mm", { locale: es })}
                                </p>
                            </div>
                        </div>

                        {/* Service Interest */}
                        {lead.service_interest && (
                            <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100 gap-3">
                                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                                    <Tag size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Interés</p>
                                    <span className="inline-block px-3 py-1 bg-white text-slate-700 text-[12px] font-bold rounded-lg border border-slate-200 mt-1">
                                        {lead.service_interest}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Source */}
                        {lead.source && (
                            <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100 gap-3">
                                <div className="w-9 h-9 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center shrink-0">
                                    <ExternalLink size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Origen</p>
                                    <p className="text-[13px] font-bold text-slate-900">{lead.source}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Message */}
                    {lead.message && (
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <MessageSquare size={14} className="text-slate-400" />
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mensaje</label>
                            </div>
                            <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap break-words font-medium">
                                {lead.message}
                            </div>
                        </div>
                    )}

                    {/* Quick actions */}
                    <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
                        <a
                            href={`mailto:${lead.email}`}
                            className="flex items-center justify-center gap-2 w-full py-3 bg-[#0B4FEA] text-white rounded-xl text-[13px] font-bold shadow-md shadow-blue-600/20 hover:bg-blue-800 transition-all"
                        >
                            <Mail size={16} /> Responder por email
                        </a>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="flex items-center justify-center gap-2 w-full py-3 border border-red-200 text-red-600 rounded-xl text-[13px] font-bold hover:bg-red-50 transition-all"
                        >
                            <Trash2 size={16} /> Eliminar lead
                        </button>
                    </div>
                </div>
            </SlideOver>

            {/* Delete confirmation modal — centered, destructive */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-2xl w-full max-w-[400px] shadow-2xl p-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
                        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                            <Trash2 size={24} className="text-red-500" />
                        </div>
                        <div>
                            <h3 className="text-[18px] font-black text-slate-900">¿Eliminar este lead?</h3>
                            <p className="text-[13px] text-slate-500 mt-2 font-medium">
                                Se eliminará permanentemente el contacto de <strong>{lead.name}</strong>. Esta acción no se puede deshacer.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-[13px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isPending}
                                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-[13px] font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                {isPending ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
