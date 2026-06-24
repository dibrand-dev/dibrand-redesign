'use client';

import React, { useState } from 'react';
import { saveHostingClient } from '../actions';
import { X, Save, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface ClientFormModalProps {
    client?: any;
    plans: any[];
    onClose: () => void;
}

export default function ClientFormModal({ client, plans, onClose }: ClientFormModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    
    // Convert to simple YYYY-MM-DD for the input type="date"
    const defaultExpiration = client?.expiration_date ? new Date(client.expiration_date).toISOString().split('T')[0] : '';
    
    const [formData, setFormData] = useState({
        id: client?.id || null,
        first_name: client?.first_name || '',
        last_name: client?.last_name || '',
        email: client?.email || '',
        domain: client?.domain || '',
        plan_id: client?.plan_id || (plans.length > 0 ? plans[0].id : ''),
        custom_price_override: client?.custom_price_override || '',
        currency: client?.currency || 'ARS',
        expiration_date: defaultExpiration
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const dataToSave = {
                ...formData,
                // Ensure date is saved as full ISO string 
                expiration_date: new Date(formData.expiration_date).toISOString(),
                custom_price_override: formData.custom_price_override ? Number(formData.custom_price_override) : null
            };
            await saveHostingClient(dataToSave);
            onClose();
        } catch (error: any) {
            alert('Error al guardar: ' + error.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                        {formData.id ? 'Editar cliente' : 'Nuevo cliente'}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 custom-scrollbar">
                    <form id="client-form" onSubmit={handleSubmit} className="p-6 space-y-6">
                        
                        <div className="space-y-4">
                            <h4 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">Datos Personales</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Nombre</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.first_name}
                                        onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9e4d97]/20 focus:border-[#9e4d97] outline-none text-slate-900 font-medium transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Apellido</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.last_name}
                                        onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9e4d97]/20 focus:border-[#9e4d97] outline-none text-slate-900 font-medium transition-all"
                                    />
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9e4d97]/20 focus:border-[#9e4d97] outline-none text-slate-900 font-medium transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">Servicio</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Dominio principal</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.domain}
                                        onChange={e => setFormData({ ...formData, domain: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9e4d97]/20 focus:border-[#9e4d97] outline-none text-slate-900 font-medium transition-all"
                                        placeholder="ejemplo.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Plan asignado</label>
                                    <select
                                        required
                                        value={formData.plan_id}
                                        onChange={e => setFormData({ ...formData, plan_id: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9e4d97]/20 focus:border-[#9e4d97] outline-none text-slate-900 font-medium transition-all"
                                    >
                                        <option value="" disabled>Selecciona un plan</option>
                                        {plans.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} ({p.billing_cycle})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Moneda de pago</label>
                                    <select
                                        required
                                        value={formData.currency}
                                        onChange={e => setFormData({ ...formData, currency: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9e4d97]/20 focus:border-[#9e4d97] outline-none text-slate-900 font-medium transition-all"
                                    >
                                        <option value="ARS">ARS</option>
                                        <option value="USD">USD</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Precio personalizado (Opcional)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.custom_price_override}
                                        onChange={e => setFormData({ ...formData, custom_price_override: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9e4d97]/20 focus:border-[#9e4d97] outline-none text-slate-900 font-medium transition-all"
                                        placeholder="Dejar vacío para usar precio de plan"
                                    />
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block text-[#9e4d97]">Fecha de Vencimiento (Próximo Pago)</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.expiration_date}
                                        onChange={e => setFormData({ ...formData, expiration_date: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9e4d97]/20 focus:border-[#9e4d97] outline-none text-slate-900 font-medium transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-slate-100 flex gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        form="client-form"
                        disabled={isLoading}
                        className="flex-1 flex justify-center items-center gap-2 bg-[#9e4d97] hover:bg-[#864080] text-white px-4 py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 shadow-sm shadow-[#9e4d97]/20"
                    >
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}
