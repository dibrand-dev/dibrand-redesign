'use client';

import React, { useState } from 'react';
import { saveHostingPlan } from '../actions';
import { X, Save, Loader2 } from 'lucide-react';

interface PlanFormModalProps {
    plan?: any;
    onClose: () => void;
}

export default function PlanFormModal({ plan, onClose }: PlanFormModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        id: plan?.id || null,
        name: plan?.name || '',
        price_ars: plan?.price_ars || '',
        price_usd: plan?.price_usd || '',
        billing_cycle: plan?.billing_cycle || 'anual'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = await saveHostingPlan(formData);
            if (result?.error) {
                alert('Error de base de datos: ' + result.error);
                setIsLoading(false);
                return;
            }
            onClose();
        } catch (error: any) {
            alert('Error al procesar: ' + error.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-slate-100">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                        {formData.id ? 'Editar plan' : 'Nuevo plan'}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Nombre del plan</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9e4d97]/20 focus:border-[#9e4d97] outline-none text-slate-900 font-medium transition-all"
                            placeholder="Ej: Básico"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Precio (ARS)</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={formData.price_ars}
                                onChange={e => setFormData({ ...formData, price_ars: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9e4d97]/20 focus:border-[#9e4d97] outline-none text-slate-900 font-medium transition-all"
                                placeholder="0.00"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Precio (USD)</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={formData.price_usd}
                                onChange={e => setFormData({ ...formData, price_usd: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9e4d97]/20 focus:border-[#9e4d97] outline-none text-slate-900 font-medium transition-all"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Ciclo de facturación</label>
                        <select
                            value={formData.billing_cycle}
                            onChange={e => setFormData({ ...formData, billing_cycle: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9e4d97]/20 focus:border-[#9e4d97] outline-none text-slate-900 font-medium transition-all"
                        >
                            <option value="mensual">Mensual</option>
                            <option value="trimestral">Trimestral</option>
                            <option value="semestral">Semestral</option>
                            <option value="anual">Anual</option>
                        </select>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 flex justify-center items-center gap-2 bg-[#9e4d97] hover:bg-[#864080] text-white px-4 py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 shadow-sm shadow-[#9e4d97]/20"
                        >
                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
