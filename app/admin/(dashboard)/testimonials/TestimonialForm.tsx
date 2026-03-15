'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveTestimonial, uploadTestimonialAvatar } from './actions';
import { Loader2, ArrowLeft, Save, Upload, ImageIcon, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface TestimonialFormProps {
    testimonial?: any;
}

export default function TestimonialForm({ testimonial }: TestimonialFormProps) {
    const router = useRouter();
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
            router.push('/admin/testimonials');
            router.refresh();
        } catch (error) {
            console.error('Error saving testimonial:', error);
            alert('Error al guardar el testimonio: ' + (error as any).message);
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
                        href="/admin/testimonials" 
                        className="p-3 hover:bg-admin-card-bg rounded-2xl transition-all text-admin-text-secondary border border-transparent hover:border-admin-border group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <h2 className="text-3xl font-black text-admin-text-primary tracking-tight uppercase">
                            {formData.id ? 'Editar Testimonio' : 'Nuevo Testimonio'}
                        </h2>
                        <p className="text-admin-text-secondary text-sm font-medium italic">
                            Gestión de la voz del cliente.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Card */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-admin-card-bg rounded-3xl border border-admin-border p-8 shadow-sm space-y-8">
                        <div className="flex items-center gap-3 border-b border-admin-border pb-4">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Información del Cliente</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block">Nombre Completo</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-5 py-4 bg-admin-bg/50 border border-admin-border rounded-2xl focus:ring-4 focus:ring-admin-accent/5 focus:border-admin-accent outline-none text-admin-text-primary text-base font-bold transition-all"
                                    placeholder="Ej: John Doe"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block">Empresa / Institución</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    className="w-full px-5 py-4 bg-admin-bg/50 border border-admin-border rounded-2xl focus:ring-4 focus:ring-admin-accent/5 focus:border-admin-accent outline-none text-admin-text-primary text-base font-bold transition-all"
                                    placeholder="Ej: Tech Solutions Inc"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block">Cargo (ES)</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.role_es}
                                    onChange={(e) => setFormData({ ...formData, role_es: e.target.value })}
                                    className="w-full px-5 py-4 bg-admin-bg/50 border border-admin-border rounded-2xl focus:ring-4 focus:ring-admin-accent/5 focus:border-admin-accent outline-none text-admin-text-primary font-medium transition-all"
                                    placeholder="Ej: CEO & Founder"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block">Cargo (EN)</label>
                                <input
                                    type="text"
                                    value={formData.role_en}
                                    onChange={(e) => setFormData({ ...formData, role_en: e.target.value })}
                                    className="w-full px-5 py-4 bg-admin-bg/50 border border-admin-border rounded-2xl focus:ring-4 focus:ring-admin-accent/5 focus:border-admin-accent outline-none text-admin-text-primary font-medium transition-all"
                                    placeholder="e.g. CEO & Founder"
                                />
                            </div>
                        </div>

                        <div className="space-y-6 pt-4">
                            <div className="flex items-center gap-3 border-b border-admin-border pb-4">
                                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Testimonio</h3>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block">Contenido (ES)</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.content_es}
                                    onChange={(e) => setFormData({ ...formData, content_es: e.target.value })}
                                    className="w-full px-5 py-4 bg-admin-bg/50 border border-admin-border rounded-2xl focus:ring-4 focus:ring-admin-accent/5 focus:border-admin-accent outline-none text-admin-text-primary font-medium transition-all resize-none"
                                    placeholder="Escribe el testimonio en español aquí..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block">Contenido (EN)</label>
                                <textarea
                                    rows={5}
                                    value={formData.content_en}
                                    onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                                    className="w-full px-5 py-4 bg-admin-bg/50 border border-admin-border rounded-2xl focus:ring-4 focus:ring-admin-accent/5 focus:border-admin-accent outline-none text-admin-text-primary font-medium transition-all resize-none"
                                    placeholder="Write the testimonial in English here..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar / Options */}
                <div className="space-y-8">
                    {/* Avatar Upload Card */}
                    <div className="bg-admin-card-bg rounded-3xl border border-admin-border p-8 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 border-b border-admin-border pb-4">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Avatar / Imagen</h3>
                        </div>

                        <div className="flex flex-col items-center gap-6">
                            <div className="relative h-32 w-32 rounded-3xl overflow-hidden bg-admin-bg flex-shrink-0 border-2 border-admin-border shadow-inner group">
                                {previewUrl ? (
                                    <Image
                                        src={previewUrl}
                                        alt="Preview"
                                        fill
                                        unoptimized
                                        className="object-cover transition-transform group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <ImageIcon size={48} />
                                    </div>
                                )}
                            </div>
                            <div className="w-full h-px bg-admin-border/50" />
                            <div className="w-full">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="avatar-upload-full"
                                />
                                <label
                                    htmlFor="avatar-upload-full"
                                    className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-admin-bg border-2 border-dashed border-admin-border rounded-2xl cursor-pointer hover:bg-admin-card-bg hover:border-admin-accent/50 transition-all text-sm font-black text-admin-text-secondary uppercase tracking-widest group"
                                >
                                    <Upload size={18} className="text-gray-400 group-hover:text-admin-accent transition-colors" />
                                    <span>{selectedFile ? 'Cambiar imagen' : 'Subir Avatar'}</span>
                                </label>
                                <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">
                                    JPG, PNG or GIF. Max 2MB.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Visibility Card */}
                    <div className="bg-admin-card-bg rounded-3xl border border-admin-border p-8 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 border-b border-admin-border pb-4">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Publicación</h3>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-admin-bg/40 rounded-2xl border border-admin-border hover:border-admin-accent/30 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${formData.is_visible ? 'bg-green-500/10 text-green-500' : 'bg-gray-100 text-gray-400'}`}>
                                    <CheckCircle2 size={20} className={formData.is_visible ? 'animate-pulse' : ''} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-admin-text-primary uppercase tracking-tight">Activo</span>
                                    <span className="text-[9px] text-admin-text-secondary font-bold uppercase tracking-widest">Visible en el sitio</span>
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
                        {formData.id ? 'Editando Testimonio' : 'Nuevo Testimonio'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">
                        Los cambios se reflejarán instantáneamente.
                    </span>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <Link 
                        href="/admin/testimonials" 
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
