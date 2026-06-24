'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import PlanFormModal from './PlanFormModal';
import { deleteHostingPlan } from '../actions';

interface HostingPlansListProps {
    plans: any[];
}

export default function HostingPlansList({ plans }: HostingPlansListProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);

    const handleEdit = (plan: any) => {
        setSelectedPlan(plan);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedPlan(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de que deseas eliminar este plan? No podrás hacerlo si tiene clientes asociados.')) {
            try {
                await deleteHostingPlan(id);
            } catch (error: any) {
                alert('Error al eliminar el plan: ' + error.message);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Planes de hosting</h2>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-[#9e4d97] hover:bg-[#864080] text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors shadow-sm"
                >
                    <Plus size={16} />
                    Nuevo plan
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-200">
                            <th className="py-4 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Nombre</th>
                            <th className="py-4 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Ciclo</th>
                            <th className="py-4 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Precio (ARS)</th>
                            <th className="py-4 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Precio (USD)</th>
                            <th className="py-4 px-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plans.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-slate-500 font-medium">
                                    No hay planes registrados.
                                </td>
                            </tr>
                        ) : (
                            plans.map(plan => (
                                <tr key={plan.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                                    <td className="py-4 px-4 font-bold text-slate-900">{plan.name}</td>
                                    <td className="py-4 px-4 text-sm font-medium text-slate-600 capitalize">{plan.billing_cycle}</td>
                                    <td className="py-4 px-4 text-sm font-bold text-slate-900">${Number(plan.price_ars).toLocaleString('es-AR')}</td>
                                    <td className="py-4 px-4 text-sm font-bold text-slate-900">U$D {Number(plan.price_usd).toLocaleString('en-US')}</td>
                                    <td className="py-4 px-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleEdit(plan)}
                                                className="p-2 text-slate-400 hover:text-[#9e4d97] bg-white border border-slate-200 hover:border-[#9e4d97] rounded-lg transition-all"
                                                title="Editar"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(plan.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 bg-white border border-slate-200 hover:border-red-200 rounded-lg transition-all"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <PlanFormModal 
                    plan={selectedPlan} 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}
        </div>
    );
}
