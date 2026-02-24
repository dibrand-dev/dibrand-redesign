'use client'

import React, { useState, useEffect } from 'react';
import { getBrands, deleteBrand } from './actions';
import BrandsForm from './BrandsForm';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import Image from 'next/image';

export default function BrandsAdminPage() {
    const [brands, setBrands] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingBrand, setEditingBrand] = useState<any>(null);

    const loadBrands = async () => {
        setIsLoading(true);
        try {
            const data = await getBrands();
            setBrands(data);
        } catch (error) {
            console.error('Error loading brands:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadBrands();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
            try {
                await deleteBrand(id);
                loadBrands();
            } catch (error) {
                console.error('Error deleting brand:', error);
                alert('Error al eliminar');
            }
        }
    };

    const openEdit = (brand: any) => {
        setEditingBrand(brand);
        setShowForm(true);
    };

    const openNew = () => {
        setEditingBrand(null);
        setShowForm(true);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-corporate-grey tracking-tight">Clientes / Marcas</h1>
                    <p className="text-gray-500 mt-1 text-sm">Gestiona los logos de las empresas que confían en Dibrand.</p>
                </div>
                <button
                    onClick={openNew}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#D83484] to-[#A3369D] text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus size={20} />
                    Nuevo Cliente
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Empresa</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Logo</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Visible</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">Cargando...</td>
                                </tr>
                            ) : brands.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-medium">No hay marcas registradas.</td>
                                </tr>
                            ) : (
                                brands.map((b) => (
                                    <tr key={b.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-corporate-grey">{b.name}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="relative h-12 w-24 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 p-2 flex items-center justify-center">
                                                <Image src={b.logo_url} alt={b.name} fill className="object-contain p-2" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-center">
                                                {b.is_visible ? (
                                                    <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold uppercase tracking-wider">
                                                        <CheckCircle2 size={14} /> Sí
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold uppercase tracking-wider">
                                                        <XCircle size={14} /> No
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => openEdit(b)}
                                                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                                                    title="Editar"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(b.id)}
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
                <BrandsForm
                    brand={editingBrand}
                    onClose={() => {
                        setShowForm(false);
                        loadBrands();
                    }}
                />
            )}
        </div>
    );
}
