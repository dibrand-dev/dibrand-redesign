'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveTestimonial, uploadTestimonialAvatar } from './actions';
import { Loader2, X, Upload, ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface TestimonialFormProps {
    testimonial?: any;
    onClose: () => void;
}

export default function TestimonialForm({ testimonial, onClose }: TestimonialFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>(testimonial?.avatar_url || '');
    const [formData, setFormData] = useState({
        id: testimonial?.id || null,
        name: testimonial?.name || '',
        role_es: testimonial?.role_es || '',
        role_en: testimonial?.role_en || '',
        company: testimonial?.company || '',
        content_es: testimonial?.content_es || '',
        content_en: testimonial?.content_en || '',
        avatar_url: testimonial?.avatar_url || '',
        is_visible: testimonial?.is_visible !== undefined ? testimonial.is_visible : true,
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
            let finalAvatarUrl = formData.avatar_url;

            if (selectedFile) {
                const uploadData = new FormData();
                uploadData.append('file', selectedFile);
                finalAvatarUrl = await uploadTestimonialAvatar(uploadData);
            }

            await saveTestimonial({
                ...formData,
                avatar_url: finalAvatarUrl
            });
            onClose();
        } catch (error) {
            console.error('Error saving testimonial:', error);
            alert('Error al guardar el testimonio: ' + (error as any).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-admin-card-bg rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[90vh] border border-admin-border">
                <div className="flex items-center justify-between p-6 border-b border-admin-border/50">
                    <h3 className="text-xl font-bold text-admin-text-primary">
                        {formData.id ? 'Editar Testimonio' : 'Nuevo Testimonio'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-admin-bg rounded-full transition-colors">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="p-8 space-y-6 overflow-y-auto flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nombre del Cliente</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                    placeholder="Ej: John Doe"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Cargo (ES)</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.role_es}
                                    onChange={(e) => setFormData({ ...formData, role_es: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-admin-border focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent transition-all outline-none bg-admin-bg/50"
                                    placeholder="Ej: CEO"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest">Cargo (EN)</label>
                                <input
                                    type="text"
                                    value={formData.role_en}
                                    onChange={(e) => setFormData({ ...formData, role_en: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-admin-border focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent transition-all outline-none bg-admin-bg/50"
                                    placeholder="Ej: CEO"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Empresa</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                    placeholder="Ej: Tech Solutions Inc"
                                />
                            </div>

                            <div className="space-y-4 md:col-span-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Avatar del Cliente</label>
                                <div className="flex items-center gap-6">
                                    <div className="relative h-20 w-20 rounded-full overflow-hidden bg-admin-bg flex-shrink-0 border-2 border-admin-border">
                                        {previewUrl ? (
                                            <Image
                                                src={previewUrl}
                                                alt="Preview"
                                                fill
                                                unoptimized
                                                className="object-cover"
                                            />
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
                                                id="avatar-upload"
                                            />
                                            <label
                                                htmlFor="avatar-upload"
                                                className="flex items-center gap-2 px-4 py-2 bg-admin-bg border border-dashed border-admin-border rounded-xl cursor-pointer hover:bg-admin-bg transition-colors text-sm font-medium text-admin-text-secondary"
                                            >
                                                <Upload size={16} />
                                                {selectedFile ? 'Cambiar imagen' : 'Subir foto de perfil'}
                                            </label>
                                            <p className="mt-1 text-[10px] text-gray-400">
                                                JPG, PNG or GIF. Máximo 2MB.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contenido (ES)</label>
                            <textarea
                                required
                                rows={3}
                                value={formData.content_es}
                                onChange={(e) => setFormData({ ...formData, content_es: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                                placeholder="Testimonio en español..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contenido (EN)</label>
                            <textarea
                                rows={3}
                                value={formData.content_en}
                                onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                                placeholder="Testimonial in english..."
                            />
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
                                Visible en el sitio web
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 p-6 border-t border-admin-border/50 bg-admin-bg/30 flex-shrink-0 sticky bottom-0">
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
                            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-admin-accent text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-admin-accent/20 disabled:opacity-50"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {formData.id ? 'Guardar Cambios' : 'Crear Testimonio'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
