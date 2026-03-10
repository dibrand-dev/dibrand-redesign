'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, UploadCloud, X, Loader2, Save } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { createSuccessStory, updateSuccessStory } from './actions';

import { CASE_SERVICES, CASE_PROJECT_TYPES, CASE_INDUSTRIES, MAP_OLD_PROJECT_TYPE, MAP_OLD_INDUSTRY } from '@/lib/case-constants';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Stack { id: string; name: string; }



// ─── Field Components ─────────────────────────────────────────────────────────
function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
    return (
        <label className="block text-[11px] font-bold text-admin-text-secondary uppercase tracking-[0.1em] mb-2">
            {children}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
    );
}

const inputCls = 'w-full px-4 py-3 bg-admin-bg/50 border border-admin-border rounded-xl text-sm text-admin-text-primary focus:outline-none focus:ring-4 focus:ring-admin-accent/5 focus:border-admin-accent transition-all placeholder:text-gray-300 font-medium';
const textareaCls = `${inputCls} resize-none min-h-[120px]`;
const cardCls = 'bg-admin-card-bg rounded-2xl border border-admin-border p-6 shadow-sm hover:shadow-md transition-shadow duration-300';

// ─── Image Upload ─────────────────────────────────────────────────────────────
function ImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(value || null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPreview(URL.createObjectURL(file));
        setError(null);
        setUploading(true);

        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const filePath = `stories/${Date.now()}_${file.name}`;
            const { error: upErr } = await supabase.storage
                .from('portfolio_images')
                .upload(filePath, file, { upsert: true });

            if (upErr) throw new Error(upErr.message);
            const { data } = supabase.storage.from('portfolio_images').getPublicUrl(filePath);
            onChange(data.publicUrl);
        } catch (err: any) {
            setError(err.message || 'Error al subir imagen');
            setPreview(null);
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4">
            {preview && (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-admin-border shadow-inner bg-admin-bg group transition-colors">
                    <Image src={preview} alt="Preview" fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized={preview.startsWith('blob:')} />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            type="button"
                            onClick={() => { setPreview(null); onChange(''); }}
                            className="p-3 bg-admin-card-bg/90 backdrop-blur text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all transform scale-90 group-hover:scale-100"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            )}

            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="flex flex-col items-center justify-center gap-4 w-full py-8 border-2 border-dashed border-admin-border rounded-2xl cursor-pointer hover:border-admin-accent hover:bg-admin-accent/5 transition-all group disabled:opacity-50"
            >
                <div className="w-12 h-12 rounded-full bg-admin-bg flex items-center justify-center group-hover:bg-admin-accent/10 transition-colors">
                    {uploading
                        ? <Loader2 size={24} className="animate-spin text-admin-accent" />
                        : <UploadCloud size={24} className="text-gray-400 group-hover:text-admin-accent transition-colors" />}
                </div>
                <div className="text-center">
                    <span className="block text-sm font-bold text-admin-text-primary mb-1">
                        {uploading ? 'Subiendo archivo...' : preview ? 'Cambiar imagen actual' : 'Cargar imagen del proyecto'}
                    </span>
                    <span className="block text-[11px] text-gray-400 font-medium">Recomendado: 1200x800px (JPG/PNG)</span>
                </div>
            </button>
            <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg font-bold border border-red-100">{error}</p>}
        </div>
    );
}

// ─── Stack Selector ───────────────────────────────────────────────────────────
function StackSelector({ stacks, selected, onChange }: { stacks: Stack[]; selected: string[]; onChange: (ids: string[]) => void }) {
    const toggle = (id: string) => {
        onChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
    };

    return (
        <div className="flex flex-wrap gap-2">
            {stacks.map(s => {
                const active = selected.includes(s.id);
                return (
                    <button
                        key={s.id}
                        type="button"
                        onClick={() => toggle(s.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${active
                            ? 'bg-primary text-white border-primary'
                            : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-primary hover:text-primary'
                            }`}
                    >
                        {s.name}
                    </button>
                );
            })}
        </div>
    );
}

// ─── Main Form ────────────────────────────────────────────────────────────────
export default function SuccessStoryForm({ stacks, initialData }: { stacks: Stack[], initialData?: any }) {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Normalizar valores iniciales si vienen de base de datos vieja
    const initialPType = initialData?.project_type || '';
    const cleanPType = MAP_OLD_PROJECT_TYPE[initialPType] || initialPType;

    const initialInd = initialData?.industry || '';
    const cleanInd = MAP_OLD_INDUSTRY[initialInd] || initialInd;

    // Normalize stack_ids (legacy might contain names instead of IDs)
    const normalizedStackIds = (initialData?.stack_ids || []).map((idOrName: string) => {
        const found = stacks.find(s => s.id === idOrName || s.name === idOrName);
        return found ? found.id : idOrName;
    });

    const [lang, setLang] = useState<'es' | 'en'>('es');
    const [titleEs, setTitleEs] = useState(initialData?.title_es || initialData?.title || '');
    const [titleEn, setTitleEn] = useState(initialData?.title_en || initialData?.title || '');
    const [clientCompany, setClientCompany] = useState(initialData?.client_company || '');
    const [summaryEs, setSummaryEs] = useState(initialData?.summary_es || initialData?.executive_summary || '');
    const [summaryEn, setSummaryEn] = useState(initialData?.summary_en || initialData?.executive_summary || '');
    const [heroImageUrl, setHeroImageUrl] = useState(initialData?.hero_image_url || '');
    const [projectType, setProjectType] = useState(cleanPType);
    const [industry, setIndustry] = useState(cleanInd);
    const [services, setServices] = useState<string[]>(initialData?.services || []);
    const [stackIds, setStackIds] = useState<string[]>(normalizedStackIds);
    const [problemEs, setProblemEs] = useState(initialData?.problem_es || initialData?.problem_text || '');
    const [problemEn, setProblemEn] = useState(initialData?.problem_en || initialData?.problem_text || '');
    const [solutionEs, setSolutionEs] = useState(initialData?.solution_es || initialData?.solution_text || '');
    const [solutionEn, setSolutionEn] = useState(initialData?.solution_en || initialData?.solution_text || '');
    const [resultEs, setResultEs] = useState(initialData?.result_es || initialData?.result_text || '');
    const [resultEn, setResultEn] = useState(initialData?.result_en || initialData?.result_text || '');

    const toggleService = (srv: string) => {
        setServices(prev => prev.includes(srv) ? prev.filter(s => s !== srv) : [...prev, srv]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!titleEs || !titleEn || !clientCompany || !summaryEs || !summaryEn) {
            setError('Por favor completá los campos requeridos en ambos idiomas.');
            return;
        }
        setSaving(true);
        setError(null);
        try {
            const payload = {
                title_es: titleEs, title_en: titleEn,
                client_company: clientCompany,
                summary_es: summaryEs, summary_en: summaryEn,
                hero_image_url: heroImageUrl, project_type: projectType, industry,
                services,
                stack_ids: stackIds,
                problem_es: problemEs, problem_en: problemEn,
                solution_es: solutionEs, solution_en: solutionEn,
                result_es: resultEs, result_en: resultEn,
            };
            if (initialData?.id) {
                await updateSuccessStory(initialData.id, payload);
            } else {
                await createSuccessStory(payload);
            }
        } catch (err: any) {
            setError(err.message || 'Error al guardar.');
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Navigation & Language Selector */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <Link
                    href="/admin/success-stories"
                    className="flex items-center gap-2 text-[11px] font-bold text-gray-400 hover:text-admin-accent transition-colors uppercase tracking-widest"
                >
                    <ArrowLeft size={16} /> Volver al listado
                </Link>

                <div className="flex bg-admin-bg dark:bg-admin-bg/50 p-1.5 rounded-2xl w-fit shadow-inner border border-admin-border/50">
                    <button
                        type="button"
                        onClick={() => setLang('es')}
                        className={`px-8 py-2.5 rounded-xl text-[11px] font-bold tracking-widest transition-all ${lang === 'es' ? 'bg-admin-card-bg text-admin-accent shadow-lg shadow-black/5 active:scale-95' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        🇪🇸 ESPAÑOL
                    </button>
                    <button
                        type="button"
                        onClick={() => setLang('en')}
                        className={`px-8 py-2.5 rounded-xl text-[11px] font-bold tracking-widest transition-all ${lang === 'en' ? 'bg-admin-card-bg text-admin-accent shadow-lg shadow-black/5 active:scale-95' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        🇺🇸 ENGLISH
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                    {error}
                </div>
            )}

            {/* ── Col 2/3 + 1/3 layout ── */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* LEFT: main fields */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Basic Info */}
                    <div className={cardCls}>
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8 pb-4 border-b border-admin-border/50 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-admin-accent"></div>
                            Información General
                        </h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <Label required>Título del Proyecto ({lang.toUpperCase()})</Label>
                                {lang === 'es' ? (
                                    <input value={titleEs} onChange={e => setTitleEs(e.target.value)} required placeholder="e.g. Plataforma de Salud con IA" className={inputCls} />
                                ) : (
                                    <input value={titleEn} onChange={e => setTitleEn(e.target.value)} required placeholder="e.g. AI-Powered Healthcare Platform" className={inputCls} />
                                )}
                            </div>
                            <div className="space-y-1">
                                <Label required>Cliente / Empresa</Label>
                                <input value={clientCompany} onChange={e => setClientCompany(e.target.value)} required placeholder="e.g. HealthTech Global" className={inputCls} />
                            </div>
                        </div>

                        <div className="pt-4 space-y-1">
                            <Label required>Resumen Ejecutivo ({lang.toUpperCase()})</Label>
                            {lang === 'es' ? (
                                <textarea value={summaryEs} onChange={e => setSummaryEs(e.target.value)} required placeholder="Resumen breve para la card..." className={textareaCls} />
                            ) : (
                                <textarea value={summaryEn} onChange={e => setSummaryEn(e.target.value)} required placeholder="Brief summary for the card..." className={textareaCls} />
                            )}
                        </div>
                    </div>

                    {/* Narrative */}
                    <div className={cardCls}>
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8 pb-4 border-b border-admin-border/50 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-admin-accent"></div>
                            Narrativa del Caso
                        </h3>

                        <div className="space-y-6">
                            <div className="space-y-1">
                                <Label>El Problema ({lang.toUpperCase()})</Label>
                                {lang === 'es' ? (
                                    <textarea value={problemEs} onChange={e => setProblemEs(e.target.value)} placeholder="¿Cuál era el desafío?" className={textareaCls} />
                                ) : (
                                    <textarea value={problemEn} onChange={e => setProblemEn(e.target.value)} placeholder="What was the challenge?" className={textareaCls} />
                                )}
                            </div>
                            <div className="space-y-1">
                                <Label>La Solución ({lang.toUpperCase()})</Label>
                                {lang === 'es' ? (
                                    <textarea value={solutionEs} onChange={e => setSolutionEs(e.target.value)} placeholder="¿Cómo lo abordamos?" className={textareaCls} />
                                ) : (
                                    <textarea value={solutionEn} onChange={e => setSolutionEn(e.target.value)} placeholder="How did we solve it?" className={textareaCls} />
                                )}
                            </div>
                            <div className="space-y-1">
                                <Label>Los Resultados ({lang.toUpperCase()})</Label>
                                {lang === 'es' ? (
                                    <textarea value={resultEs} onChange={e => setResultEs(e.target.value)} placeholder="Métricas e impacto..." className={textareaCls} />
                                ) : (
                                    <textarea value={resultEn} onChange={e => setResultEn(e.target.value)} placeholder="Metrics and impact..." className={textareaCls} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: meta fields */}
                <div className="space-y-6">

                    {/* Hero Image */}
                    <div className="bg-admin-card-bg rounded-2xl border border-admin-border p-6 shadow-sm space-y-3">
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-admin-accent"></div>
                            Imagen Principal
                        </h3>
                        <ImageUpload value={heroImageUrl} onChange={setHeroImageUrl} />
                    </div>

                    {/* Dropdowns */}
                    <div className={cardCls}>
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8 pb-4 border-b border-admin-border/50 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-admin-accent"></div>
                            Clasificación
                        </h3>

                        <div className="space-y-6">
                            <div className="space-y-1">
                                <Label>Tipo de Proyecto</Label>
                                <div className="relative">
                                    <select value={projectType} onChange={e => setProjectType(e.target.value)} className={`${inputCls} appearance-none`}>
                                        <option value="">Seleccionar...</option>
                                        {CASE_PROJECT_TYPES.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <ArrowLeft className="-rotate-90 text-gray-400" size={12} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label>Industria</Label>
                                <div className="relative">
                                    <select value={industry} onChange={e => setIndustry(e.target.value)} className={`${inputCls} appearance-none`}>
                                        <option value="">Seleccionar...</option>
                                        {CASE_INDUSTRIES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <ArrowLeft className="-rotate-90 text-gray-400" size={12} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Services */}
                    <div className={cardCls}>
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8 pb-4 border-b border-admin-border/50 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-admin-accent"></div>
                            Servicios Prestados
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {CASE_SERVICES.map(srv => {
                                const active = services.includes(srv);
                                const isSpecial = srv === 'Staff Augmentation' || srv === 'Outsourcing';
                                return (
                                    <button
                                        key={srv}
                                        type="button"
                                        onClick={() => toggleService(srv)}
                                        className={`px-3 py-2 rounded-xl text-[10px] font-bold tracking-wider transition-all border ${active
                                            ? isSpecial ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-600/20' : 'bg-admin-accent border-admin-accent text-white shadow-lg shadow-admin-accent/20'
                                            : 'bg-gray-50 text-gray-400 border-transparent hover:border-gray-200'
                                            }`}
                                    >
                                        {isSpecial && '✺ '}{srv}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tech Stacks */}
                    <div className={cardCls}>
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8 pb-4 border-b border-admin-border/50 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-admin-accent"></div>
                            Tech Stack
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {stacks.length > 0 ? (
                                stacks.map(stack => {
                                    const isActive = stackIds.includes(stack.id);
                                    return (
                                        <button
                                            key={stack.id}
                                            type="button"
                                            onClick={() => {
                                                setStackIds(prev =>
                                                    prev.includes(stack.id)
                                                        ? prev.filter(id => id !== stack.id)
                                                        : [...prev, stack.id]
                                                );
                                            }}
                                            className={`px-3 py-2 rounded-xl text-[10px] font-bold tracking-wider transition-all border ${isActive
                                                ? 'bg-admin-accent border-admin-accent text-white shadow-lg shadow-admin-accent/20'
                                                : 'bg-gray-50 text-gray-400 border-transparent hover:border-gray-200'
                                                }`}
                                        >
                                            {stack.name}
                                        </button>
                                    );
                                })
                            ) : (
                                <p className="text-[10px] text-gray-400 italic">No hay tecnologías registradas.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit bar */}
            <div className="sticky bottom-8 h-20 bg-admin-card-bg/80 backdrop-blur-md border border-admin-border rounded-2xl px-8 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-10 transition-colors duration-300">
                <div className="hidden md:flex flex-col">
                    <span className="text-xs font-bold text-admin-text-primary capitalize">{initialData ? 'Editando Caso' : 'Nuevo proyecto'}</span>
                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-[0.1em]">Los cambios se sincronizarán con el sitio público</span>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Link href="/admin/success-stories" className="flex-1 md:flex-none text-center px-6 py-3 border border-admin-border text-admin-text-secondary rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-admin-bg transition-colors">
                        Descartar
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-10 py-3 bg-admin-accent text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-admin-accent/20 active:scale-95"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {saving ? 'Guardando...' : 'Confirmar y Guardar'}
                    </button>
                </div>
            </div>
        </form>
    );
}
