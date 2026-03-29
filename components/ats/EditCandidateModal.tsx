'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    X, User, Mail, Phone, MapPin, Linkedin, Briefcase, 
    ChevronDown, Save, Loader2, Camera, Upload
} from 'lucide-react';
import { updateCandidate, getRecruiters } from '@/app/ats/actions';
import { createBrowserClient } from '@supabase/ssr';
import { capitalizeName } from '@/lib/utils';

interface Recruiter {
    id: string;
    full_name: string;
}

export default function EditCandidateModal({ candidate }: { candidate: any }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    
    const [formData, setFormData] = useState({
        first_name: candidate.first_name || '',
        last_name: candidate.last_name || '',
        full_name: candidate.full_name || '',
        email: candidate.email || '',
        phone: candidate.phone || '',
        country: candidate.country || '',
        linkedin_url: candidate.linkedin_url || '',
        recruiter_id: candidate.recruiter_id || '',
        skills: candidate.skills?.join(', ') || '',
        avatar_url: candidate.avatar_url || ''
    });

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No authenticated user');

            const fileExt = file.name.split('.').pop();
            const fileName = `${candidate.id}-${Math.random()}.${fileExt}`;
            // Use user.id as the first folder to satisfy existing RLS policy
            const filePath = `${user.id}/candidates/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error al subir la imagen. Verifica los permisos de storage.');
        } finally {
            setIsUploading(false);
        }
    };

    useEffect(() => {
        async function fetchRecruiters() {
            const data = await getRecruiters();
            setRecruiters(data as Recruiter[]);
        }
        fetchRecruiters();
    }, []);

    const closeModal = () => {
        router.push(`/ats/candidates/${candidate.id}`);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Ensure fields are properly formatted for Supabase
            const updatePayload = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                full_name: `${formData.first_name} ${formData.last_name}`.trim(),
                email: formData.email,
                phone: formData.phone || null,
                country: formData.country || null,
                linkedin_url: formData.linkedin_url || null,
                recruiter_id: formData.recruiter_id === '' ? null : formData.recruiter_id,
                avatar_url: formData.avatar_url || null,
                skills: formData.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s !== '')
            };

            await updateCandidate(candidate.id, updatePayload);
            closeModal();
            router.refresh();
        } catch (error) {
            console.error('Failed to update candidate:', error);
            alert('Error al actualizar el candidato. Verifica los campos.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[24px] w-full max-w-[560px] shadow-2xl flex flex-col font-inter max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex justify-between items-center px-8 py-6 border-b border-slate-100 shrink-0">
                    <div>
                        <h2 className="text-[20px] font-black text-slate-900 leading-none mb-1.5 text-blue-700">Editar Candidato</h2>
                        <p className="text-[12px] font-semibold text-slate-400">Actualiza la información del perfil</p>
                    </div>
                    <button onClick={closeModal} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all">
                        <X size={20} />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <form onSubmit={handleSubmit} className="overflow-y-auto custom-scrollbar flex-1 p-8 space-y-6">
                    {/* AVATAR UPLOAD */}
                    <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-dashed border-slate-200 rounded-3xl mb-8 group relative overflow-hidden transition-all hover:bg-slate-100/80">
                         <div className="relative group/avatar">
                            <div className="w-24 h-24 rounded-2xl bg-white shadow-xl overflow-hidden border-4 border-white transition-all group-hover/avatar:scale-105">
                                <img 
                                    src={formData.avatar_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} 
                                    className={`w-full h-full object-cover transition-opacity ${isUploading ? 'opacity-40' : 'opacity-100'}`}
                                    alt="Preview" 
                                />
                                {isUploading && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Loader2 size={24} className="animate-spin text-blue-600" />
                                    </div>
                                )}
                            </div>
                            <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#0B4FEA] text-white rounded-xl flex items-center justify-center shadow-lg cursor-pointer hover:bg-blue-700 hover:scale-110 transition-all border-4 border-white">
                                <Camera size={18} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                         </div>
                         <div className="text-center mt-5">
                             <p className="text-[14px] font-black text-slate-900 mb-1">Foto de Perfil</p>
                             <p className="text-[11px] font-semibold text-slate-500">JPG, PNG o WEBP. Máx 5MB.</p>
                         </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1">Nombre</label>
                            <input 
                                type="text"
                                value={formData.first_name}
                                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1">Apellido</label>
                            <input 
                                type="text"
                                value={formData.last_name}
                                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1">Email</label>
                        <div className="relative group">
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            <input 
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-[14px] font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1">Teléfono</label>
                            <div className="relative group">
                                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-[14px] font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1">Ubicación (País)</label>
                            <div className="relative group">
                                <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="text"
                                    value={formData.country}
                                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-[14px] font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1">LinkedIn URL</label>
                        <div className="relative group">
                            <Linkedin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="url"
                                value={formData.linkedin_url}
                                onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-[14px] font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all"
                                placeholder="https://linkedin.com/in/username"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1">Habilidades (separadas por coma)</label>
                        <div className="relative group">
                            <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text"
                                value={formData.skills}
                                onChange={(e) => setFormData({...formData, skills: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-[14px] font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all"
                                placeholder="Ej: React, Figma, Product Strategy"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1">Reclutador Asignado</label>
                        <div className="relative group">
                            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <select 
                                value={formData.recruiter_id}
                                onChange={(e) => setFormData({...formData, recruiter_id: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-10 py-3 text-[14px] font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 appearance-none transition-all"
                            >
                                <option value="">Sin asignar</option>
                                {recruiters.map(r => (
                                    <option key={r.id} value={r.id}>{capitalizeName(r.full_name)}</option>
                                ))}
                            </select>
                            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-4 shrink-0">
                    <button 
                        onClick={closeModal}
                        className="px-6 py-2.5 text-[14px] font-black text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-[#0B4FEA] text-white rounded-xl text-[14px] font-black shadow-lg shadow-blue-600/20 hover:bg-blue-800 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
}
