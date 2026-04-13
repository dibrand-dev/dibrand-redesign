'use client';

import React, { useState, useEffect } from 'react';
import { 
    X, User, Mail, Phone, MapPin, Linkedin, Briefcase, 
    Save, Loader2, Upload, FileText, Bold, Italic, Underline, List, Link as LinkIcon, ChevronDown, ListChecks, CheckCircle2, ChevronRight
} from 'lucide-react';
import { createCandidate, updateCandidate, getRecruiterJobs, getAllTechStacks } from '@/app/ats/actions';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { toast } from 'react-hot-toast';
import { capitalizeName } from '@/lib/utils';
import { Country, State } from 'country-state-city';
import { ATS_STAGES } from '@/lib/ats-constants';

interface Props {
    candidate?: any;
    isEdit?: boolean;
}

export default function CandidateForm({ candidate, isEdit }: Props) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [jobs, setJobs] = useState<any[]>([]);
    const [techStacks, setTechStacks] = useState<any[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    
    const [formData, setFormData] = useState({
        first_name: candidate?.first_name ? capitalizeName(candidate.first_name) : '',
        last_name: candidate?.last_name ? capitalizeName(candidate.last_name) : '',
        email: candidate?.email || '',
        phone: candidate?.phone || '',
        country: candidate?.country || (isEdit ? '' : 'Argentina'),
        state_province: candidate?.state_province || '',
        status: candidate?.status || (isEdit ? '' : 'Nuevo'),
        linkedin_url: candidate?.linkedin_url || '',
        job_id: candidate?.job_id || '',
        cover_letter: candidate?.cover_letter || '',
        resume_url: candidate?.resume_url || '',
        cv_filename: candidate?.cv_filename || '',
        questionnaire_answers: candidate?.questionnaire_answers || []
    });

    // Location States
    const [countriesList] = useState(() => {
        const latamIsos = ['AR', 'BO', 'BR', 'CL', 'CO', 'CR', 'CU', 'EC', 'SV', 'GT', 'HN', 'MX', 'NI', 'PA', 'PY', 'PE', 'PR', 'DO', 'UY', 'VE'];
        const allCountries = Country.getAllCountries();
        
        const latam = allCountries
            .filter(c => latamIsos.includes(c.isoCode))
            .sort((a, b) => latamIsos.indexOf(a.isoCode) - latamIsos.indexOf(b.isoCode)); // Keep priority or alpha
            
        const others = allCountries
            .filter(c => !latamIsos.includes(c.isoCode))
            .sort((a, b) => a.name.localeCompare(b.name));
            
        return { latam, others };
    });

    const [statesList, setStatesList] = useState<any[]>([]);
    const [selectedCountryCode, setSelectedCountryCode] = useState(() => {
        const initialCountry = candidate?.country || (isEdit ? '' : 'Argentina');
        return Country.getAllCountries().find(c => c.name === initialCountry)?.isoCode || '';
    });

    const [questionnaire, setQuestionnaire] = useState<any[]>(candidate?.job?.questionnaire || []);

    const [skills, setSkills] = useState<string[]>(candidate?.skills || []);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const loadData = async () => {
            const [jobsData, techData] = await Promise.all([
                getRecruiterJobs(),
                getAllTechStacks()
            ]);
            setJobs(jobsData || []);
            setTechStacks(techData || []);

            // Auto-select Talent Pool if no job_id is provided and we are creating a new candidate
            if (!isEdit && !formData.job_id && jobsData) {
                const talentPool = jobsData.find((j: any) => 
                    j.id === '00000000-0000-0000-0000-000000000001' || 
                    j.title?.toLowerCase().includes('talent pool')
                );
                if (talentPool) {
                    setFormData(prev => ({ ...prev, job_id: talentPool.id }));
                }
            }
        };
        loadData();
    }, [isEdit]);

    // Load states when country changes
    useEffect(() => {
        if (selectedCountryCode) {
            const states = State.getStatesOfCountry(selectedCountryCode);
            setStatesList(states);
        } else {
            setStatesList([]);
        }
    }, [selectedCountryCode]);

    // Helper to handle blur normalization
    const handleNameBlur = (field: 'first_name' | 'last_name', value: string) => {
        setFormData(prev => ({ ...prev, [field]: capitalizeName(value) }));
    };

    // Effect to fetch questionnaire when job_id changes
    useEffect(() => {
        if (!formData.job_id) {
            setQuestionnaire([]);
            return;
        }

        const selectedJob = jobs.find(j => j.id === formData.job_id);
        if (selectedJob) {
            setQuestionnaire(selectedJob.questionnaire || []);
        }
    }, [formData.job_id, jobs]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error('El archivo es demasiado grande. Máximo 5MB.');
            return;
        }

        const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Solo se permiten archivos PDF o DOCX.');
            return;
        }

        setIsUploading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No authenticated user');

            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${user.id}/resumes/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('resumes')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('resumes')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, resume_url: publicUrl, cv_filename: file.name }));
            toast.success('CV subido correctamente.');
        } catch (error) {
            console.error('Error uploading resume:', error);
            toast.error('Error al subir el CV.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.first_name || !formData.last_name || !formData.email || !formData.job_id) {
            toast.error('Por favor completa los campos obligatorios.');
            return;
        }

        setIsSaving(true);
        try {
            const payload = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                full_name: `${formData.first_name} ${formData.last_name}`.trim(),
                email: formData.email,
                phone: formData.phone,
                country: formData.country,
                state_province: formData.state_province,
                linkedin_url: formData.linkedin_url,
                job_id: formData.job_id,
                cover_letter: formData.cover_letter,
                resume_url: formData.resume_url,
                cv_filename: formData.cv_filename,
                skills,
                status: formData.status,
                questionnaire_answers: formData.questionnaire_answers
            };

            if (isEdit) {
                await updateCandidate(candidate.id, payload);
                toast.success('Candidato actualizado con éxito');
                router.push(`/ats/candidates/${candidate.id}`);
            } else {
                const result = await createCandidate(payload);
                if (result.error) {
                    toast.error(result.error);
                } else {
                    toast.success('Candidato creado con éxito');
                    router.push('/ats/candidates');
                }
            }
            router.refresh();
        } catch (error) {
            console.error('Submit error:', error);
            toast.error('Error al guardar el candidato.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-[1240px] mx-auto py-6 font-inter">
            {/* Breadcrumbs & Header */}
            <div className="mb-10">
                <nav className="flex items-center gap-3 text-[12px] font-bold text-slate-400 mb-6 uppercase tracking-widest">
                    <button onClick={() => router.push('/ats/candidates')} className="hover:text-slate-900 transition-colors">Candidatos</button>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-900 font-black">{isEdit ? 'Editar Perfil' : 'Agregar Nuevo'}</span>
                </nav>
                <h1 className="text-[36px] font-black text-slate-900 leading-none mb-3 tracking-tight">
                    {isEdit ? 'Editar Candidato' : 'Agregar Nuevo Candidato'}
                </h1>
                <p className="text-[15px] text-slate-500 font-medium tracking-tight">Gestionando la próxima generación de talento para tu equipo.</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                
                {/* LEFT COLUMN */}
                <div className="lg:col-span-8 space-y-10">
                    {/* Personal Information */}
                    <div className="bg-white rounded-2xl p-10">
                        <div className="flex items-center gap-3 mb-10">
                            <User size={20} className="text-[#0040A1]" />
                            <h2 className="text-[15px] font-bold text-slate-900 tracking-tight">Información Personal</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Nombre</label>
                                <input 
                                    type="text"
                                    placeholder="ej. Julian"
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                                    onBlur={(e) => handleNameBlur('first_name', e.target.value)}
                                    className="w-full bg-[#F1F5F9] rounded-xl px-5 py-4 text-[14px] font-bold text-slate-900 outline-none border-none focus:ring-2 focus:ring-blue-100 transition-all font-inter"
                                    required
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Apellido</label>
                                <input 
                                    type="text"
                                    placeholder="ej. Vance"
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                    onBlur={(e) => handleNameBlur('last_name', e.target.value)}
                                    className="w-full bg-[#F1F5F9] rounded-xl px-5 py-4 text-[14px] font-bold text-slate-900 outline-none border-none focus:ring-2 focus:ring-blue-100 transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Correo Electrónico</label>
                                <input 
                                    type="email"
                                    placeholder="julian.v@ejemplo.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full bg-[#F1F5F9] rounded-xl px-5 py-4 text-[14px] font-bold text-slate-900 outline-none border-none focus:ring-2 focus:ring-blue-100 transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Número de Teléfono</label>
                                <input 
                                    type="text"
                                    placeholder="+1 (555) 000-0000"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    className="w-full bg-[#F1F5F9] rounded-xl px-5 py-4 text-[14px] font-bold text-slate-900 outline-none border-none focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-3">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Perfil de LinkedIn</label>
                                <input 
                                    type="text"
                                    placeholder="linkedin.com/in/usuario"
                                    value={formData.linkedin_url}
                                    onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                                    className="w-full bg-[#F1F5F9] rounded-xl px-5 py-4 text-[14px] font-bold text-slate-900 outline-none border-none focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">País</label>
                                <div className="relative">
                                    <select 
                                        value={formData.country}
                                        onChange={(e) => {
                                            const countryName = e.target.value;
                                            const iso = Country.getAllCountries().find(c => c.name === countryName)?.isoCode || '';
                                            setSelectedCountryCode(iso);
                                            setFormData({...formData, country: countryName, state_province: ''});
                                        }}
                                        className="w-full bg-[#F1F5F9] rounded-xl px-4 py-4 text-[14px] font-bold text-slate-900 outline-none border-none focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Seleccionar país</option>
                                        <optgroup label="Latinoamérica">
                                            {countriesList.latam.map(c => (
                                                <option key={c.isoCode} value={c.name}>{c.name}</option>
                                            ))}
                                        </optgroup>
                                        <optgroup label="Otros Países">
                                            {countriesList.others.map(c => (
                                                <option key={c.isoCode} value={c.name}>{c.name}</option>
                                            ))}
                                        </optgroup>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Provincia / Estado</label>
                                <div className="relative">
                                    <select 
                                        value={formData.state_province}
                                        onChange={(e) => setFormData({...formData, state_province: e.target.value})}
                                        disabled={!selectedCountryCode}
                                        className="w-full bg-[#F1F5F9] rounded-xl px-4 py-4 text-[14px] font-bold text-slate-900 outline-none border-none focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer disabled:opacity-50"
                                    >
                                        <option value="">Seleccionar estado</option>
                                        {statesList.map(s => (
                                            <option key={s.isoCode || s.name} value={s.name}>{s.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cover Letter */}
                    <div className="bg-white rounded-2xl p-10">
                        <div className="flex items-center gap-3 mb-10">
                            <FileText size={20} className="text-[#0040A1]" />
                            <h2 className="text-[15px] font-bold text-slate-900 tracking-tight">Carta de Presentación</h2>
                        </div>

                        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-slate-100/50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                                <div className="flex items-center gap-6 text-slate-500">
                                    <div className="flex items-center gap-4 pr-6 border-r border-slate-300">
                                        <button type="button" className="hover:text-slate-900"><Bold size={16} /></button>
                                        <button type="button" className="hover:text-slate-900"><Italic size={16} /></button>
                                        <button type="button" className="hover:text-slate-900"><Underline size={16} /></button>
                                    </div>
                                    <div className="flex items-center gap-4 pr-6 border-r border-slate-300">
                                        <button type="button" className="hover:text-slate-900"><List size={16} /></button>
                                        <button type="button" className="hover:text-slate-900 rotate-180"><List size={16} /></button>
                                    </div>
                                    <button type="button" className="hover:text-slate-900"><LinkIcon size={16} /></button>
                                </div>
                            </div>
                            <textarea 
                                rows={10}
                                placeholder="Escribe o pega aquí la carta de presentación del candidato..."
                                value={formData.cover_letter}
                                onChange={(e) => setFormData({...formData, cover_letter: e.target.value})}
                                className="w-full px-8 py-8 text-[15px] font-medium text-slate-700 outline-none resize-none leading-relaxed bg-white"
                            ></textarea>
                        </div>
                    </div>

                    {/* Vetting Questionnaire (Dynamic) */}
                    {questionnaire && questionnaire.length > 0 && (
                        <div className="bg-white rounded-2xl p-10 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="flex items-center gap-3 mb-10">
                                <ListChecks size={20} className="text-[#0040A1]" />
                                <h2 className="text-[15px] font-bold text-slate-900 tracking-tight">Cuestionario de Evaluación</h2>
                            </div>

                            <div className="space-y-10">
                                {questionnaire.map((section: any) => (
                                    <div key={section.id} className="space-y-6">
                                        <h3 className="text-[11px] font-black tracking-[0.1em] text-slate-400 uppercase border-b border-slate-100 pb-3">
                                            {section.title}
                                        </h3>
                                        
                                        <div className="space-y-8">
                                            {section.questions.map((q: any) => {
                                                const currentAnswer = (formData.questionnaire_answers || []).find((a: any) => a.question_id === q.id)?.answer;
                                                
                                                const setAnswer = (val: any) => {
                                                    const newAnswers = [...(formData.questionnaire_answers || [])];
                                                    const idx = newAnswers.findIndex((a: any) => a.question_id === q.id);
                                                    if (idx >= 0) {
                                                        newAnswers[idx] = { ...newAnswers[idx], answer: val };
                                                    } else {
                                                        newAnswers.push({ question_id: q.id, answer: val });
                                                    }
                                                    setFormData({ ...formData, questionnaire_answers: newAnswers });
                                                };

                                                return (
                                                    <div key={q.id} className="space-y-3">
                                                        <label className="text-[12px] font-black text-slate-900 leading-tight block">
                                                            {q.label}
                                                            {q.helper && <span className="block text-[11px] text-slate-400 font-medium italic mt-1">{q.helper}</span>}
                                                        </label>
                                                        
                                                        {q.type === 'yesno' ? (
                                                            <div className="flex gap-3">
                                                                {['Sí', 'No'].map((opt) => (
                                                                    <button
                                                                        key={opt}
                                                                        type="button"
                                                                        onClick={() => setAnswer(opt === 'Sí' ? 'Yes' : 'No')}
                                                                        className={`px-6 py-2.5 rounded-xl text-[13px] font-bold transition-all border ${
                                                                            (currentAnswer === 'Yes' && opt === 'Sí') || (currentAnswer === 'No' && opt === 'No')
                                                                                ? 'bg-[#0040A1] text-white border-[#0040A1] shadow-lg shadow-blue-900/10' 
                                                                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                                                        }`}
                                                                    >
                                                                        {opt}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        ) : q.type === 'textarea' ? (
                                                            <textarea 
                                                                rows={3}
                                                                value={currentAnswer || ''}
                                                                onChange={(e) => setAnswer(e.target.value)}
                                                                className="w-full bg-[#F8FAFC] rounded-xl px-5 py-4 text-[14px] font-semibold text-slate-900 border border-slate-100 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                                                                placeholder="Escribe la respuesta..."
                                                            />
                                                        ) : q.type === 'sublist' && q.subquestions ? (
                                                            <div className="space-y-3">
                                                                {q.subquestions.map((sub: string, subIdx: number) => {
                                                                    const subAnswers = Array.isArray(currentAnswer) ? [...currentAnswer] : [];
                                                                    return (
                                                                        <div key={subIdx} className="flex items-center gap-4 bg-[#F8FAFC] p-4 rounded-xl border border-slate-100">
                                                                            <span className="text-[11px] font-bold text-slate-400 w-1/3 truncate">{sub}</span>
                                                                            <input 
                                                                                type="text"
                                                                                value={subAnswers[subIdx] || ''}
                                                                                onChange={(e) => {
                                                                                    subAnswers[subIdx] = e.target.value;
                                                                                    setAnswer(subAnswers);
                                                                                }}
                                                                                className="flex-1 bg-transparent border-none text-[13px] font-bold text-[#0040A1] outline-none"
                                                                                placeholder="Años / Info..."
                                                                            />
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        ) : (
                                                            <input 
                                                                type="text"
                                                                value={currentAnswer || ''}
                                                                onChange={(e) => setAnswer(e.target.value)}
                                                                className="w-full bg-[#F8FAFC] rounded-xl px-5 py-4 text-[14px] font-semibold text-slate-900 border border-slate-100 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                                                                placeholder="Escribe la respuesta..."
                                                            />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN */}
                <div className="lg:col-span-4 space-y-10">
                    {/* Professional Details */}
                    <div className="bg-white rounded-2xl p-10">
                        <div className="flex items-center gap-3 mb-10">
                            <Briefcase size={20} className="text-[#0040A1]" />
                            <h2 className="text-[15px] font-bold text-slate-900 tracking-tight">Detalles Profesionales</h2>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Posición Deseada</label>
                                <div className="relative">
                                    <select 
                                        value={formData.job_id}
                                        onChange={(e) => setFormData({...formData, job_id: e.target.value})}
                                        className="w-full bg-[#F1F5F9] rounded-xl px-5 py-4 text-[14px] font-bold text-slate-900 outline-none border-none focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="">Selecciona un rol</option>
                                        {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                                    </select>
                                    <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                                <p className="text-[11px] text-slate-400 font-medium pl-1 italic">Puesto al que aspira el talento</p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Etapa de Selección</label>
                                <div className="relative">
                                    <select 
                                        value={formData.status}
                                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                                        className="w-full bg-[#F1F5F9] rounded-xl px-4 py-4 text-[14px] font-bold text-slate-900 outline-none border-none focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Seleccionar etapa actual...</option>
                                        {ATS_STAGES.map(stage => (
                                            <option key={stage.value} value={stage.value}>{stage.label}</option>
                                        ))}
                                        <option value="Rejected">Desestimado</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Skills (Tecnologías)</label>
                                <div className="bg-[#F8FAFC] border border-slate-100 rounded-xl p-4 min-h-[120px] focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {skills.map(skill => (
                                            <span key={skill} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg flex items-center gap-3 shadow-sm group">
                                                {skill}
                                                <button 
                                                    type="button" 
                                                    onClick={() => setSkills(skills.filter(s => s !== skill))} 
                                                    className="text-slate-300 hover:text-red-500 transition-colors"
                                                >
                                                    <X size={12} strokeWidth={3} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <input 
                                        list="tech-stacks"
                                        placeholder="Escribe una tecnología y presiona Enter..."
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const val = e.currentTarget.value.trim();
                                                if (val && !skills.includes(val)) {
                                                    setSkills([...skills, val]);
                                                    e.currentTarget.value = '';
                                                }
                                            }
                                        }}
                                        className="w-full bg-transparent py-2 text-[14px] font-bold text-[#0040A1] placeholder:text-slate-300 placeholder:font-normal outline-none"
                                    />
                                    <datalist id="tech-stacks">
                                        {techStacks.map(stack => <option key={stack.id} value={stack.name} />)}
                                    </datalist>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resume Upload */}
                    <div className="bg-white rounded-2xl p-10">
                        <div className="flex items-center gap-3 mb-10">
                            <Upload size={20} className="text-[#0040A1]" />
                            <h2 className="text-[15px] font-bold text-slate-900 tracking-tight">Subir Currículum</h2>
                        </div>

                        <label className={`flex flex-col items-center justify-center py-10 px-6 border-2 border-dashed rounded-2xl bg-white transition-all cursor-pointer hover:bg-slate-50 border-slate-200 group ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                            <input type="file" className="hidden" accept=".pdf,.docx,.doc" onChange={handleFileUpload} />
                            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-6 text-slate-400 group-hover:text-[#0040A1] transition-colors">
                                {isUploading ? <Loader2 size={28} className="animate-spin" /> : <Upload size={28} className="opacity-40" />}
                            </div>
                            <div className="text-center">
                                <p className="text-[15px] font-bold text-slate-900">{formData.cv_filename || 'Arrastra y suelta el archivo'}</p>
                                <p className="text-[12px] font-medium text-slate-400 mt-1 uppercase tracking-tight">PDF, DOCX hasta 10MB</p>
                                <p className="text-[13px] font-bold text-[#0040A1] mt-6 hover:underline">O busca en tus archivos</p>
                            </div>
                        </label>
                    </div>

                    {/* ACTIONS */}
                    <div className="space-y-4 pt-4">
                        <button 
                            type="submit"
                            disabled={isSaving || isUploading}
                            className="w-full py-5 bg-[#0040A1] text-white rounded-[16px] text-[15px] font-black shadow-2xl shadow-blue-900/20 hover:bg-blue-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 size={20} className="animate-spin" /> : null}
                            {isEdit ? 'Guardar Cambios' : 'Crear Candidato'}
                        </button>
                        <button 
                            type="button"
                            onClick={() => router.back()}
                            className="w-full py-5 bg-[#E2E8F0]/30 text-slate-600 rounded-[16px] text-[15px] font-black hover:bg-slate-200 transition-all"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
