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
        <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            {children}{required && <span className="text-primary ml-0.5">*</span>}
        </label>
    );
}

const inputCls = 'w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-corporate-grey focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-300';
const textareaCls = `${inputCls} resize-none`;

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
        <div className="space-y-3">
            {preview && (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-200">
                    <Image src={preview} alt="Preview" fill className="object-cover" unoptimized={preview.startsWith('blob:')} />
                    <button
                        type="button"
                        onClick={() => { setPreview(null); onChange(''); }}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>
            )}

            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="flex items-center justify-center gap-3 w-full h-28 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group disabled:opacity-50"
            >
                {uploading
                    ? <Loader2 size={20} className="animate-spin text-primary" />
                    : <UploadCloud size={20} className="text-gray-400 group-hover:text-primary transition-colors" />}
                <span className="text-sm text-gray-400 group-hover:text-primary transition-colors">
                    {uploading ? 'Subiendo...' : preview ? 'Cambiar imagen' : 'Subir imagen del proyecto'}
                </span>
            </button>
            <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
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

    const [title, setTitle] = useState(initialData?.title || '');
    const [clientCompany, setClientCompany] = useState(initialData?.client_company || '');
    const [executiveSummary, setExecutiveSummary] = useState(initialData?.executive_summary || '');
    const [heroImageUrl, setHeroImageUrl] = useState(initialData?.hero_image_url || '');
    const [projectType, setProjectType] = useState(cleanPType);
    const [industry, setIndustry] = useState(cleanInd);
    const [services, setServices] = useState<string[]>(initialData?.services || []);
    const [stackIds, setStackIds] = useState<string[]>(initialData?.stack_ids || []);
    const [problemText, setProblemText] = useState(initialData?.problem_text || '');
    const [solutionText, setSolutionText] = useState(initialData?.solution_text || '');
    const [resultText, setResultText] = useState(initialData?.result_text || '');

    const toggleService = (srv: string) => {
        setServices(prev => prev.includes(srv) ? prev.filter(s => s !== srv) : [...prev, srv]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !clientCompany || !executiveSummary) {
            setError('Por favor completá los campos requeridos.');
            return;
        }
        setSaving(true);
        setError(null);
        try {
            const payload = {
                title, client_company: clientCompany, executive_summary: executiveSummary,
                hero_image_url: heroImageUrl, project_type: projectType, industry,
                services,
                stack_ids: stackIds, problem_text: problemText, solution_text: solutionText,
                result_text: resultText,
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
        <form onSubmit={handleSubmit} className="space-y-8 pb-16">
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
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Información General</h3>

                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <Label required>Título del Proyecto</Label>
                                <input value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. AI-Powered Healthcare Platform" className={inputCls} />
                            </div>
                            <div>
                                <Label required>Cliente / Empresa</Label>
                                <input value={clientCompany} onChange={e => setClientCompany(e.target.value)} required placeholder="e.g. HealthTech Global" className={inputCls} />
                            </div>
                        </div>

                        <div>
                            <Label required>Resumen Ejecutivo</Label>
                            <textarea value={executiveSummary} onChange={e => setExecutiveSummary(e.target.value)} required rows={3} placeholder="Resumen breve de 2-3 oraciones para la card del portfolio..." className={textareaCls} />
                        </div>
                    </div>

                    {/* Narrative */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Narrativa del Caso</h3>

                        <div>
                            <Label>El Problema</Label>
                            <textarea value={problemText} onChange={e => setProblemText(e.target.value)} rows={5} placeholder="¿Cuál era el desafío o problema del cliente?" className={textareaCls} />
                        </div>
                        <div>
                            <Label>La Solución</Label>
                            <textarea value={solutionText} onChange={e => setSolutionText(e.target.value)} rows={5} placeholder="¿Cómo lo abordamos y qué construimos?" className={textareaCls} />
                        </div>
                        <div>
                            <Label>Los Resultados</Label>
                            <textarea value={resultText} onChange={e => setResultText(e.target.value)} rows={5} placeholder="Métricas, impacto, outcomes logrados..." className={textareaCls} />
                        </div>
                    </div>
                </div>

                {/* RIGHT: meta fields */}
                <div className="space-y-6">

                    {/* Hero Image */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-3">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Imagen Principal</h3>
                        <ImageUpload value={heroImageUrl} onChange={setHeroImageUrl} />
                    </div>

                    {/* Dropdowns */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Clasificación</h3>

                        <div>
                            <Label>Tipo de Proyecto</Label>
                            <select value={projectType} onChange={e => setProjectType(e.target.value)} className={inputCls}>
                                <option value="">Seleccionar...</option>
                                {CASE_PROJECT_TYPES.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        </div>

                        <div>
                            <Label>Industria</Label>
                            <select value={industry} onChange={e => setIndustry(e.target.value)} className={inputCls}>
                                <option value="">Seleccionar...</option>
                                {CASE_INDUSTRIES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Services (NEW Section) */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Servicios Prestados</h3>
                        <div className="flex flex-wrap gap-2">
                            {CASE_SERVICES.map(srv => {
                                const active = services.includes(srv);
                                const isSpecial = srv === 'Staff Augmentation' || srv === 'Outsourcing';
                                return (
                                    <button
                                        key={srv}
                                        type="button"
                                        onClick={() => toggleService(srv)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${active
                                            ? isSpecial ? 'bg-[#a04c97] border-[#a04c97] text-white' : 'bg-primary border-primary text-white'
                                            : 'bg-gray-50 text-gray-500 border-gray-200'
                                            }`}
                                    >
                                        {isSpecial && '✺ '}{srv}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tech Stacks */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Tech Stack</h3>
                        <div className="flex flex-wrap gap-2">
                            {stacks.length > 0 ? (
                                stacks.map(stack => {
                                    const isActive = stackIds.includes(stack.id) || stackIds.includes(stack.name);
                                    return (
                                        <button
                                            key={stack.id}
                                            type="button"
                                            onClick={() => {
                                                const currentId = stack.id;
                                                setStackIds(prev => {
                                                    // Buscamos si ya está por ID o por Nombre
                                                    const exists = prev.includes(currentId) || prev.includes(stack.name);
                                                    if (exists) {
                                                        return prev.filter(id => id !== currentId && id !== stack.name);
                                                    }
                                                    return [...prev, currentId];
                                                });
                                            }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${isActive
                                                ? 'bg-brand border-brand text-white shadow-md'
                                                : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-brand/30'
                                                }`}
                                        >
                                            {stack.name}
                                        </button>
                                    );
                                })
                            ) : (
                                <p className="text-xs text-gray-400 italic">No hay tecnologías registradas. Podés agregarlas en la sección de Tech Stacks.</p>
                            )}
                        </div>
                        {stackIds.length > 0 && (
                            <p className="text-xs text-gray-400">{stackIds.length} seleccionado{stackIds.length !== 1 ? 's' : ''}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Submit bar */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <Link href="/admin/success-stories" className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                    Cancelar
                </Link>
                <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-8 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-all"
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? 'Guardando...' : 'Guardar Caso'}
                </button>
            </div>
        </form>
    );
}
