'use client'

import React, { useState } from 'react';
import { saveBrand, uploadBrandLogo } from './actions';
import { Loader2, X, Upload, ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface Brand {
    id: string | null;
    name: string;
    logo_url: string;
    is_visible: boolean;
}

interface BrandsFormProps {
    brand?: Brand | null;
    onClose: () => void;
}

export default function BrandsForm({ brand, onClose }: BrandsFormProps) {
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
            onClose();
        } catch (error) {
            console.error('Error saving brand:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            alert('Error al guardar la marca: ' + errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-admin-card-bg rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200 border border-admin-border">
                <div className="flex items-center justify-between p-6 border-b border-admin-border/50">
                    <h3 className="text-xl font-bold text-admin-text-primary">
                        {formData.id ? 'Editar Cliente' : 'Nuevo Cliente'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-admin-bg rounded-full transition-colors font-medium">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest">Nombre de la Empresa</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-admin-border focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent transition-all outline-none bg-admin-bg/50"
                            placeholder="Ej: Google"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest block">Logo de la Marca</label>
                        <div className="flex items-center gap-6">
                            <div className="relative h-20 w-32 rounded-xl overflow-hidden bg-admin-bg flex-shrink-0 border-2 border-admin-border flex items-center justify-center p-2">
                                {previewUrl ? (
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={previewUrl}
                                            alt="Preview"
                                            fill
                                            unoptimized
                                            className="object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <ImageIcon size={32} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="logo-upload"
                                    />
                                    <label
                                        htmlFor="logo-upload"
                                        className="flex items-center gap-2 px-4 py-2 bg-admin-bg border border-dashed border-admin-border rounded-xl cursor-pointer hover:bg-admin-bg transition-colors text-sm font-medium text-admin-text-secondary"
                                    >
                                        <Upload size={16} />
                                        {selectedFile ? 'Cambiar logo' : 'Subir logo'}
                                    </label>
                                    <p className="mt-1 text-[10px] text-gray-400">
                                        Recomendado: Archivo SVG o PNG con fondo transparente. Altura ideal: 60px.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="is_visible"
                            checked={formData.is_visible}
                            onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor="is_visible" className="text-sm font-medium text-gray-700">
                            Visible en el carrusel
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-admin-border/50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl font-bold text-admin-text-secondary hover:bg-admin-bg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-admin-accent text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-admin-accent/20 active:scale-95 disabled:opacity-50"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {formData.id ? 'Guardar Cambios' : 'Agregar Cliente'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
