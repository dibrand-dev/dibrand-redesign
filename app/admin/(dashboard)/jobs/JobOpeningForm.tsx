'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Sparkles, Loader2, Trash2, Globe, ListChecks } from 'lucide-react';
import Link from 'next/link';
import { createJob, updateJob, deleteJob } from '@/app/actions/jobs';
import TiptapEditor from '@/components/admin/TiptapEditor';
import { DEFAULT_QUESTIONNAIRE } from '@/lib/ats-constants';



interface JobOpeningFormProps {
    initialData?: any;
}

export default function JobOpeningForm({ initialData }: JobOpeningFormProps) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lang, setLang] = useState<'es' | 'en'>('es');
    const [translating, setTranslating] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title_es: initialData?.title_es || initialData?.title || '',
        title_en: initialData?.title_en || '',
        industry: initialData?.industry || initialData?.department || 'Engineering',
        location_es: initialData?.location_es || initialData?.location || '',
        location_en: initialData?.location_en || '',
        employment_type: initialData?.employment_type || 'Full-time',
        description_es: initialData?.description_es || initialData?.description || '',
        description_en: initialData?.description_en || '',
        requirements_es: initialData?.requirements_es || initialData?.requirements || '',
        requirements_en: initialData?.requirements_en || '',
        seniority: initialData?.seniority || 'Senior',
        modality: initialData?.modality || 'Remoto',
        salary_range: initialData?.salary_range || '',
        is_active: initialData?.is_active ?? true,
        questionnaire: initialData?.questionnaire || DEFAULT_QUESTIONNAIRE,
    });

    const modalities = ['Remoto', 'Híbrido', 'Presencial'];
    const industries = [
        'Engineering', 
        'Product & Design', 
        'Sales & Marketing', 
        'Administration', 
        'People & Culture'
    ];
    const seniorities = ['Trainee', 'Junior', 'Semi Senior', 'Senior'];

    const handleTranslate = async (field: 'title' | 'description' | 'requirements' | 'location') => {
        const sourceText = (formData as any)[`${field}_es`];
        if (!sourceText) {
            alert('Escribe el texto en español primero para poder traducirlo.');
            return;
        }

        setTranslating(field);
        try {
            const res = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    text: sourceText, 
                    targetLang: 'en',
                    context: 'hr' // Custom recruiter persona
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Error en el servidor de traducción');
            }

            const data = await res.json();
            if (data.translatedText) {
                const key = `${field}_en` as keyof typeof formData;
                setFormData(prev => ({ ...prev, [key]: data.translatedText }));
            }
        } catch (e: any) {
            console.error('Translation error:', e);
            alert(`No se pudo traducir: ${e.message}`);
        } finally {
            setTranslating(null);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as any;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const payload = {
                ...formData,
                title: formData.title_es, // Fallback legacy
                description: formData.description_es,
                requirements: formData.requirements_es,
                location: formData.location_es
            };

            if (initialData?.id) {
                await updateJob(initialData.id, payload);
            } else {
                await createJob(payload);
            }
            router.push('/admin/jobs');
            router.refresh();
        } catch (err: any) {
            if (err.message === 'NEXT_REDIRECT') throw err;
            setError(err.message || 'Error al guardar.');
            setSaving(false);
        }
    };

    const handleDeleteJob = async () => {
        if (!confirm('¿Estás seguro de que quieres eliminar esta vacante?')) return;
        setSaving(true);
        try {
            await deleteJob(initialData.id);
            router.push('/admin/jobs');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Error al eliminar.');
            setSaving(false);
        }
    };

    const LangButton = ({ target, label, icon }: { target: 'es' | 'en', label: string, icon: string }) => (
        <button
            type="button"
            onClick={() => setLang(target)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[11px] font-black tracking-widest transition-all ${lang === target ? 'bg-admin-accent text-white shadow-lg shadow-admin-accent/20 active:scale-95' : 'text-gray-400 hover:text-gray-600'}`}
        >
            <span>{icon}</span> {label}
        </button>
    );

    const TranslateBtn = ({ field }: { field: 'title' | 'description' | 'requirements' | 'location' }) => (
        lang === 'en' && (
            <button
                type="button"
                onClick={() => handleTranslate(field)}
                disabled={translating === field}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-admin-accent/10 text-admin-accent text-[10px] font-bold hover:bg-admin-accent hover:text-white transition-all disabled:opacity-50"
            >
                {translating === field ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                TRADUCIR CON IA
            </button>
        )
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-8 pb-20 font-inter">
            {/* Nav & Language Switcher */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <Link href="/admin/jobs" className="p-2 hover:bg-admin-card-bg rounded-full transition-colors text-admin-text-secondary border border-transparent hover:border-admin-border">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex bg-admin-card-bg p-1.5 rounded-2xl shadow-sm border border-admin-border/50">
                        <LangButton target="es" label="ESPAÑOL" icon="🇪🇸" />
                        <LangButton target="en" label="ENGLISH" icon="🇺🇸" />
                    </div>
                </div>

                {initialData && (
                    <button
                        type="button"
                        onClick={handleDeleteJob}
                        className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors border border-transparent hover:border-red-500/20 flex items-center gap-2"
                    >
                        <Trash2 size={18} />
                        <span className="font-bold text-xs uppercase tracking-widest">Eliminar</span>
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl font-bold">
                    {error}
                </div>
            )}

            <div className="bg-admin-card-bg rounded-3xl border border-admin-border p-8 space-y-10 shadow-sm relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                    <Globe size={200} />
                </div>

                {/* Section: Basic Info */}
                <div className="space-y-6 relative z-10">
                    <div className="flex items-center justify-between border-b border-admin-border pb-4">
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Identidad de la Vacante</h3>
                        <TranslateBtn field="title" />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                Título ({lang.toUpperCase()})
                                {lang === 'es' && <span className="text-admin-accent">*</span>}
                            </label>
                            <input
                                required={lang === 'es'}
                                type="text"
                                name={lang === 'es' ? 'title_es' : 'title_en'}
                                value={lang === 'es' ? formData.title_es : formData.title_en}
                                onChange={(e) => {
                                    const key = lang === 'es' ? 'title_es' : 'title_en';
                                    setFormData(prev => ({ ...prev, [key]: e.target.value }));
                                }}
                                placeholder={lang === 'es' ? 'Ej: Senior React Developer' : 'e.g. Senior React Developer'}
                                className="w-full px-5 py-3.5 bg-admin-bg/50 border border-admin-border rounded-xl focus:ring-4 focus:ring-admin-accent/5 focus:border-admin-accent outline-none text-admin-text-primary text-base font-bold transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Seniority</label>
                            <select
                                name="seniority"
                                value={formData.seniority}
                                onChange={handleChange}
                                className="w-full px-5 py-3.5 bg-admin-bg/50 border border-admin-border rounded-xl focus:ring-4 focus:ring-admin-accent/5 focus:border-admin-accent outline-none text-admin-text-primary font-bold appearance-none cursor-pointer"
                            >
                                {seniorities.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 pt-4">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Departamento</label>
                            <select
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                                className="w-full px-5 py-3.5 bg-admin-bg/50 border border-admin-border rounded-xl focus:ring-4 focus:ring-admin-accent/5 focus:border-admin-accent outline-none text-admin-text-primary font-bold appearance-none cursor-pointer"
                            >
                                {industries.map(i => <option key={i} value={i}>{i}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Ubicación</label>
                                <TranslateBtn field="location" />
                            </div>
                            <input
                                required={lang === 'es'}
                                type="text"
                                name={lang === 'es' ? 'location_es' : 'location_en'}
                                value={lang === 'es' ? formData.location_es : formData.location_en}
                                onChange={(e) => {
                                    const key = lang === 'es' ? 'location_es' : 'location_en';
                                    setFormData(prev => ({ ...prev, [key]: e.target.value }));
                                }}
                                placeholder={lang === 'es' ? 'Ej: Remote - USA' : 'e.g. Remote - USA'}
                                className="w-full px-5 py-3.5 bg-admin-bg/50 border border-admin-border rounded-xl focus:ring-4 focus:ring-admin-accent/5 focus:border-admin-accent outline-none text-admin-text-primary font-medium transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Modalidad</label>
                            <select
                                name="modality"
                                value={formData.modality}
                                onChange={handleChange}
                                className="w-full px-5 py-3.5 bg-admin-bg/50 border border-admin-border rounded-xl focus:ring-4 focus:ring-admin-accent/5 focus:border-admin-accent outline-none text-admin-text-primary font-bold appearance-none cursor-pointer"
                            >
                                {modalities.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Internal Only Fields */}
                    <div className="pt-4 border-t border-admin-border/30">
                        <div className="max-w-xs space-y-2">
                            <label className="text-[11px] font-black text-brand uppercase tracking-widest flex items-center gap-2">
                                Tarifa Interna / Rate (Privado)
                            </label>
                            <input
                                type="text"
                                name="salary_range"
                                value={formData.salary_range}
                                onChange={handleChange}
                                placeholder="Ej: $3500 - $4500 USD"
                                className="w-full px-5 py-3.5 bg-brand/[0.03] border border-brand/20 rounded-xl focus:ring-4 focus:ring-brand/5 focus:border-brand outline-none text-brand font-bold transition-all"
                            />
                            <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">DATO CONFIDENCIAL: Nunca se muestra en el sitio público.</p>
                        </div>
                    </div>
                </div>

                {/* Section: Content */}
                <div className="space-y-8 pt-4">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-admin-border pb-4">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Contenido de la Búsqueda ({lang.toUpperCase()})</h3>
                            <TranslateBtn field="description" />
                        </div>
                        <TiptapEditor
                            value={lang === 'es' ? formData.description_es : formData.description_en}
                            onChange={(val: string) => setFormData(prev => ({ ...prev, [lang === 'es' ? 'description_es' : 'description_en']: val }))}
                            placeholder="Describe el rol, el impacto y las responsabilidades..."
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-admin-border pb-4">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Requisitos Técnicos ({lang.toUpperCase()})</h3>
                            <TranslateBtn field="requirements" />
                        </div>
                        <TiptapEditor
                            value={lang === 'es' ? formData.requirements_es : formData.requirements_en}
                            onChange={(val: string) => setFormData(prev => ({ ...prev, [lang === 'es' ? 'requirements_es' : 'requirements_en']: val }))}
                            placeholder="Stack tecnológico, experiencia mínima y habilidades blandas..."
                        />
                    </div>
                </div>

                {/* Section: Visibility */}
                <div className="flex items-center justify-between p-6 bg-admin-bg/40 rounded-2xl border border-admin-border mt-10 transition-colors hover:border-admin-accent/30 group">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${formData.is_active ? 'bg-green-500/10 text-green-500' : 'bg-gray-200 text-gray-400'}`}>
                            <Globe size={24} className={formData.is_active ? 'animate-pulse' : ''} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-black text-admin-text-primary uppercase tracking-tight">Publicación Inmediata</span>
                            <span className="text-[10px] text-admin-text-secondary font-medium uppercase tracking-widest">La vacante será visible en /join-us</span>
                        </div>
                    </div>
                    <input
                        type="checkbox"
                        id="is_active"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                        className="w-6 h-6 text-admin-accent border-admin-border rounded-lg focus:ring-admin-accent transition-all cursor-pointer accent-admin-accent"
                    />
                </div>

                {/* Section: Recruitment Questionnaire Indicator */}
                <div className="flex items-center justify-between p-6 bg-blue-50/30 rounded-2xl border border-blue-100 mt-6 transition-colors hover:border-admin-accent/30 group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#0040A1]/10 text-[#0040A1] flex items-center justify-center">
                            <ListChecks size={24} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-black text-admin-text-primary uppercase tracking-tight">Cuestionario de Vetting</span>
                            <span className="text-[10px] text-admin-text-secondary font-medium uppercase tracking-widest">
                                {initialData ? 'Cuestionario personalizado activo' : 'Se adjuntará la plantilla estándar automáticamente'}
                            </span>
                        </div>
                    </div>
                    <div className="text-[10px] font-black text-[#0040A1] bg-white px-3 py-1.5 rounded-lg border border-blue-100 shadow-sm uppercase tracking-widest">
                        Gestionar en ATS
                    </div>
                </div>
            </div>

            {/* Bottom Admin Bar */}
            <div className="sticky bottom-8 h-20 bg-admin-card-bg/80 backdrop-blur-md border border-admin-border rounded-3xl px-8 flex items-center justify-between shadow-2xl z-40 transition-all duration-300">
                <div className="hidden md:flex flex-col">
                    <span className="text-xs font-black text-admin-text-primary uppercase tracking-tight">{initialData ? 'Editando Posición' : 'Posteando Nueva Vacante'}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.1em] italic">Impacto directo en la sección Join Us</span>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <Link href="/admin/jobs" className="flex-1 md:flex-none text-center px-8 py-3.5 border border-admin-border text-admin-text-secondary rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-admin-bg transition-colors active:scale-95">
                        Descartar
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 md:flex-none inline-flex items-center justify-center gap-3 px-12 py-3.5 bg-admin-accent text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:opacity-95 disabled:opacity-50 transition-all shadow-xl shadow-admin-accent/20 active:scale-95"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {saving ? 'Guardando...' : 'Confirmar y Guardar'}
                    </button>
                </div>
            </div>
        </form>
    );
}
