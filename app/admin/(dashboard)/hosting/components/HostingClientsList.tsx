'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Globe, Calendar, CreditCard } from 'lucide-react';
import ClientFormModal from './ClientFormModal';
import { deleteHostingClient } from '../actions';
import { format, isBefore, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

interface HostingClientsListProps {
    clients: any[];
    plans: any[];
}

export default function HostingClientsList({ clients, plans }: HostingClientsListProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<any>(null);

    const handleEdit = (client: any) => {
        setSelectedClient(client);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedClient(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de que deseas eliminar este cliente? Se perderá también su historial de pagos.')) {
            try {
                const result = await deleteHostingClient(id);
                if (result?.error) {
                    alert('Error de base de datos: ' + result.error);
                }
            } catch (error: any) {
                alert('Error al procesar: ' + error.message);
            }
        }
    };

    const getStatusIndicator = (expirationDate: string) => {
        const date = new Date(expirationDate);
        const now = new Date();
        const warningDate = addDays(now, 15);

        if (isBefore(date, now)) {
            return <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-md text-[10px] font-bold bg-red-100 text-red-700 uppercase tracking-widest">Vencido</span>;
        } else if (isBefore(date, warningDate)) {
            return <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-md text-[10px] font-bold bg-orange-100 text-orange-700 uppercase tracking-widest">Por vencer</span>;
        }
        return <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-md text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-widest">Al día</span>;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Clientes activos</h2>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-[#9e4d97] hover:bg-[#864080] text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors shadow-sm"
                >
                    <Plus size={16} />
                    Nuevo cliente
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="border-b border-slate-200">
                            <th className="py-4 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Cliente</th>
                            <th className="py-4 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Dominio</th>
                            <th className="py-4 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Plan</th>
                            <th className="py-4 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Vencimiento</th>
                            <th className="py-4 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Estado</th>
                            <th className="py-4 px-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">
                                    No hay clientes registrados.
                                </td>
                            </tr>
                        ) : (
                            clients.map(client => (
                                <tr key={client.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                                    <td className="py-4 px-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-900">{client.first_name} {client.last_name}</span>
                                            {client.email && <span className="text-xs text-slate-500">{client.email}</span>}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2 text-sm text-[#9e4d97] font-medium">
                                            <Globe size={14} />
                                            {client.domain}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900">{client.hosting_plans?.name || 'Sin plan'}</span>
                                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                                                {client.currency} {client.custom_price_override ? `(${client.custom_price_override})` : ''}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                            <Calendar size={14} />
                                            {format(new Date(client.expiration_date), "dd MMM yyyy", { locale: es })}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        {getStatusIndicator(client.expiration_date)}
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleEdit(client)}
                                                className="p-2 text-slate-400 hover:text-[#9e4d97] bg-white border border-slate-200 hover:border-[#9e4d97] rounded-lg transition-all"
                                                title="Editar"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(client.id)}
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
                <ClientFormModal 
                    client={selectedClient} 
                    plans={plans}
                    onClose={() => setIsModalOpen(false)} 
                />
            )}
        </div>
    );
}
