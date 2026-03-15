'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveBrand, uploadBrandLogo } from './actions';
import { Loader2, ArrowLeft, Save, Upload, ImageIcon, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Brand {
    id: string | null;
    name: string;
    logo_url: string;
    is_visible: boolean;
}

interface BrandsFormProps {
    brand?: Brand | null;
}

export default function BrandsForm({ brand }: BrandsFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>(brand?.logo_url || '');
    const [formData, setFormData] = useState({
        id: brand?.id || null,
        name: brand?.name || '',
        logo_url: brand?.logo_url || '',
        is_visible: brand?.is_visible !== undefined ? brand.is_visible : true,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            let finalLogoUrl = formData.logo_url;

            if (selectedFile) {
                const uploadData = new FormData();
                uploadData.append('file', selectedFile);
                finalLogoUrl = await uploadBrandLogo(uploadData);
            }

            if (!finalLogoUrl) {
                throw new Error('Debes subir un logo');
            }

            await saveBrand({
                ...formData,
                logo_url: finalLogoUrl
            });
            router.push('/admin/brands');
            router.refresh();
        } catch (error) {
            console.error('Error saving brand:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            alert('Error al guardar la marca: ' + errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 pb-20 font-inter animate-in fade-in duration-500">
            {/* Header / Nav */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <Link 
                        href="/admin/brands" 
                        className="p-3 hover:bg-admin-card-bg rounded-2xl transition-all text-admin-text-secondary border border-transparent hover:border-admin-border group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <h2 className="text-3xl font-black text-admin-text-primary tracking-tight uppercase">
                            {formData.id ? 'Editar Cliente' : 'Nuevo Cliente'}
                        </h2>
                        <p className="text-admin-text-secondary text-sm font-medium italic">
                            Gestión de partners y marcas.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Card */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-admin-card-bg rounded-3xl border border-admin-border p-8 shadow-sm space-y-8">
                        <div className="flex items-center gap-3 border-b border-admin-border pb-4">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Información de la Empresa</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block">Nombre Comercial</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-5 py-4 bg-admin-bg/50 border border-admin-border rounded-2xl focus:ring-4 focus:ring-admin-accent/5 focus:border-admin-accent outline-none text-admin-text-primary text-base font-bold transition-all"
                                    placeholder="Ej: Google, Amazon, Tech Solutions"
                                />
                            </div>
                        </div>

                        <div className="pt-6">
                             <div className="flex items-center gap-3 border-b border-admin-border pb-4 mb-6">
                                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Logo / Identidad Visual</h3>
                            </div>
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="relative h-32 w-48 rounded-2xl overflow-hidden bg-admin-bg flex-shrink-0 border-2 border-admin-border shadow-inner p-4 flex items-center justify-center group">
                                    {previewUrl ? (
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={previewUrl}
                                                alt="Preview"
                                                fill
                                                unoptimized
                                                className="object-contain transition-transform group-hover:scale-110"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <ImageIcon size={48} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 w-full">
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="logo-upload-full"
                                        />
                                        <label
                                            htmlFor="logo-upload-full"
                                            className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-admin-bg border-2 border-dashed border-admin-border rounded-2xl cursor-pointer hover:bg-admin-card-bg hover:border-admin-accent/50 transition-all text-sm font-black text-admin-text-secondary uppercase tracking-widest group"
                                        >
                                            <Upload size={18} className="text-gray-400 group-hover:text-admin-accent transition-colors" />
                                            <span>{selectedFile ? 'Cambiar logo' : 'Subir Logo Empresarial'}</span>
                                        </label>
                                        <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center md:text-left">
                                            Recomendado: SVG o PNG (fondo transparente). Max 2MB.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar / Options */}
                <div className="space-y-8">
                    {/* Visibility Card */}
                    <div className="bg-admin-card-bg rounded-3xl border border-admin-border p-8 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 border-b border-admin-border pb-4">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Configuración</h3>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-admin-bg/40 rounded-2xl border border-admin-border hover:border-admin-accent/30 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${formData.is_visible ? 'bg-green-500/10 text-green-500' : 'bg-gray-100 text-gray-400'}`}>
                                    <CheckCircle2 size={20} className={formData.is_visible ? 'animate-pulse' : ''} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-admin-text-primary uppercase tracking-tight">Activo</span>
                                    <span className="text-[9px] text-admin-text-secondary font-bold uppercase tracking-widest">Visible en el home</span>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                id="is_visible"
                                checked={formData.is_visible}
                                onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                                className="w-6 h-6 text-admin-accent border-admin-border rounded-lg focus:ring-admin-accent transition-all cursor-pointer accent-admin-accent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Action Bar */}
            <div className="sticky bottom-8 bg-admin-card-bg/80 backdrop-blur-md border border-admin-border rounded-3xl px-8 h-20 flex items-center justify-between shadow-2xl z-40">
                <div className="hidden md:flex flex-col">
                    <span className="text-xs font-black text-admin-text-primary uppercase tracking-tight">
                        {formData.id ? 'Editando Cliente' : 'Nuevo Cliente'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">
                        Logo cargado: {formData.name || 'Sin nombre'}
                    </span>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <Link 
                        href="/admin/brands" 
                        className="flex-1 md:flex-none text-center px-8 py-3.5 border border-admin-border text-admin-text-secondary rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-admin-bg transition-colors active:scale-95"
                    >
                        Descartar
                    </Link>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 md:flex-none inline-flex items-center justify-center gap-3 px-12 py-3.5 bg-admin-accent text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:opacity-95 disabled:opacity-50 transition-all shadow-xl shadow-admin-accent/20 active:scale-95"
                    >
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {isLoading ? 'Guardando...' : 'Confirmar y Guardar'}
                    </button>
                </div>
            </div>
        </form>
    );
}
