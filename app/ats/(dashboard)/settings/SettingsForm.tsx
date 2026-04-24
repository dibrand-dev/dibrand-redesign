'use client';

import React, { useState, useRef } from 'react';
import { updateRecruiterProfile } from '@/app/ats/actions';
import { Loader2, Camera, User } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';

interface SettingsFormProps {
    initialData: {
        fullName: string;
        jobTitle: string;
        email: string;
        phone: string;
        avatarUrl: string;
    }
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: initialData.fullName,
        jobTitle: initialData.jobTitle,
        phone: initialData.phone,
        avatarUrl: initialData.avatarUrl
    });
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecciona una imagen válida.');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert('La imagen es demasiado grande. El límite es 2MB.');
            return;
        }

        setIsUploading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No se encontró el usuario');

            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `recruiter-avatars/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, avatarUrl: publicUrl }));
            
            // Auto-save just the avatar if desired, or let the user click "Save"
            // For now, let's just update the state and show the preview.
            
        } catch (error: any) {
            console.error('Error uploading avatar:', error);
            alert('Error al subir la imagen: ' + (error.message || 'Error desconocido'));
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = await updateRecruiterProfile(formData);
            if (result.success) {
                alert('Perfil actualizado con éxito');
            }
        } catch (error: any) {
            console.error('CRITICAL ERROR UPDATING PROFILE:', error);
            const errorMessage = error.message || 'Error desconocido';
            alert('Error al actualizar el perfil: ' + errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Page Header */}
            <div className="flex justify-between items-start mb-10 w-full">
                <div>
                    <h2 className="text-[26px] font-black text-slate-900 leading-tight mb-1 tracking-tight">Perfil de Usuario</h2>
                    <p className="text-[14px] text-slate-500 font-medium">Actualiza tu información personal y de contacto.</p>
                </div>
                <button 
                    type="submit"
                    disabled={isLoading || isUploading}
                    className="px-6 py-2.5 bg-[#0B4FEA] text-white rounded-xl text-[14px] font-bold hover:bg-blue-800 shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Guardar Cambios'}
                </button>
            </div>

            {/* 1. Profile Card */}
            <div className="bg-white rounded-[24px] shadow-sm border border-slate-200/60 p-8 mb-8 flex flex-col md:flex-row gap-12">
                {/* Avatar Column */}
                <div className="flex flex-col items-center justify-center shrink-0 w-[180px]">
                    <div 
                        onClick={handleAvatarClick}
                        className="relative w-[120px] h-[120px] rounded-[32px] bg-slate-100 overflow-hidden shadow-inner mb-4 ring-4 ring-slate-50 flex items-center justify-center cursor-pointer group hover:ring-[#0B4FEA]/20 transition-all"
                    >
                        {formData.avatarUrl ? (
                            <img src={formData.avatarUrl} alt={formData.fullName} className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" />
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-1">
                                <User size={40} className="text-slate-300" />
                                <span className="text-[10px] font-black text-slate-400 uppercase">Sin Foto</span>
                            </div>
                        )}
                        
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 bg-black/10 transition-all">
                            <Camera size={24} className="text-white drop-shadow-md" />
                            <span className="text-[10px] font-black text-white uppercase mt-1 drop-shadow-md">Cambiar</span>
                        </div>

                        {/* Loading spinner */}
                        {isUploading && (
                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                                <Loader2 size={24} className="text-[#0B4FEA] animate-spin" />
                            </div>
                        )}
                    </div>
                    
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept="image/*"
                    />

                    <h3 className="text-[15px] font-black text-slate-900 text-center leading-tight mb-0.5">{formData.fullName || 'Reclutador'}</h3>
                    <p className="text-[11px] font-medium text-slate-500 text-center mb-4">{formData.jobTitle || 'Equipo Dibrand'}</p>
                    
                    <button 
                        type="button" 
                        onClick={handleAvatarClick}
                        className="text-[11px] font-extrabold text-[#0B4FEA] hover:underline hover:text-blue-800 transition-colors tracking-wide uppercase"
                    >
                        Subir Nueva Foto
                    </button>
                </div>

                {/* Inputs Grid */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 content-center">
                    <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest pl-3 mb-2">Nombre Completo</label>
                        <div className="w-full bg-[#f4f6fa] rounded-t-lg border-b-2 border-slate-300 px-4 py-3 group focus-within:border-[#0B4FEA] transition-colors">
                            <input 
                                type="text" 
                                value={formData.fullName} 
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full bg-transparent outline-none text-[14px] font-bold text-slate-900 placeholder:text-slate-400" 
                                required
                                placeholder="Ingresa tu nombre completo"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest pl-3 mb-2">Cargo / Puesto</label>
                        <div className="w-full bg-[#f4f6fa] rounded-t-lg border-b-2 border-slate-300 px-4 py-3 group focus-within:border-[#0B4FEA] transition-colors">
                            <input 
                                type="text" 
                                value={formData.jobTitle} 
                                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                className="w-full bg-transparent outline-none text-[14px] font-bold text-slate-900 placeholder:text-slate-400" 
                                required
                                placeholder="Ej: Senior Talent Acquisition"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest pl-3 mb-2">Correo Electrónico</label>
                        <div className="w-full bg-slate-50 rounded-t-lg border-b-2 border-slate-200 px-4 py-3">
                            <input type="email" value={initialData.email} className="w-full bg-transparent outline-none text-[14px] font-bold text-slate-400 cursor-not-allowed" disabled />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest pl-3 mb-2">Teléfono de Contacto</label>
                        <div className="w-full bg-[#f4f6fa] rounded-t-lg border-b-2 border-slate-300 px-4 py-3 group focus-within:border-[#0B4FEA] transition-colors">
                            <input 
                                type="tel" 
                                value={formData.phone} 
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full bg-transparent outline-none text-[14px] font-bold text-slate-900 placeholder:text-slate-400" 
                                placeholder="+1 234 567 890"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
