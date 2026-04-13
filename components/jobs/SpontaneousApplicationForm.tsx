'use client'

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Country, State } from 'country-state-city';
import { getTechStacks, uploadResume, submitApplication, getTalentPoolJobId } from '@/app/actions/applications';
import { CheckCircle2, Loader2, UploadCloud, Send, Heart } from 'lucide-react';
import { trackJoinUsFormSuccess } from '@/lib/gtm';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

interface SpontaneousApplicationFormProps {
    lang: string;
    dict: any;
    onSuccess?: () => void;
}

export default function SpontaneousApplicationForm({ lang, dict, onSuccess }: SpontaneousApplicationFormProps) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [stacks, setStacks] = useState<{ value: string, label: string }[]>([]);
    const [selectedStacks, setSelectedStacks] = useState<any>([]);
    const [countries, setCountries] = useState<{ value: string, label: string }[]>([]);
    const [states, setStates] = useState<{ value: string, label: string }[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<any>(null);
    const [selectedState, setSelectedState] = useState<any>(null);
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const { executeRecaptcha } = useGoogleReCaptcha();

    const [selectedArea, setSelectedArea] = useState<any>(null);
    const [selectedSeniority, setSelectedSeniority] = useState<any>(null);

    const isEn = lang === 'en';

    const areas = [
        { value: 'IT', label: 'IT / Engineering' },
        { value: 'Sales', label: 'Sales / Commercial' },
        { value: 'Marketing', label: 'Marketing' },
        { value: 'Recruitment', label: 'Recruitment / HR' },
        { value: 'Admin', label: 'Administration / Finance' },
        { value: 'Otros', label: isEn ? 'Other' : 'Otros' }
    ];

    const seniorities = [
        { value: 'Trainee', label: 'Trainee' },
        { value: 'Junior', label: 'Junior' },
        { value: 'SSR', label: 'SSR / Mid-level' },
        { value: 'Senior', label: 'Senior' },
        { value: 'Lead', label: 'Lead / Principal' }
    ];

    useEffect(() => {
        async function init() {
            try {
                const dbStacks = await getTechStacks();
                setStacks(dbStacks.map(s => ({ value: s.id, label: s.name })));

                const allCountries = Country.getAllCountries();
                setCountries(allCountries.map(c => ({ value: c.isoCode, label: c.name })));
            } catch (error) {
                console.error("Error initializing form data:", error);
            }
        }
        init();
    }, []);

    const handleCountryChange = (selected: any) => {
        setSelectedCountry(selected);
        const countryStates = State.getStatesOfCountry(selected.value);
        setStates(countryStates.map(s => ({ value: s.isoCode, label: s.name })));
        setSelectedState(null);
    };

    const [formError, setFormError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError(null);
        const form = e.currentTarget;

        if (!resumeFile) {
            setFormError(isEn ? 'Please upload your CV' : 'Por favor sube tu currículum');
            return;
        }

        if (!selectedArea || !selectedSeniority) {
            setFormError(isEn ? 'Please select your Area and Seniority' : 'Por favor selecciona tu Área y Seniority');
            return;
        }

        setLoading(true);
        
        const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
        let captchaToken: string | null = null;
        
        if (siteKey && siteKey.length > 5 && siteKey !== 'DUMMY_KEY_FOR_CONTEXT_ONLY' && executeRecaptcha) {
            try {
                const tokenPromise = executeRecaptcha('spontaneous_apply');
                const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000));
                captchaToken = await (Promise.race([tokenPromise, timeoutPromise]) as Promise<string>);
            } catch (e) {
                console.warn('[SpontaneousForm] reCAPTCHA bypass or failure.', e);
                // We keep going as some environments might block it
            }
        }

        try {
            // 1. Find or Ensure Talent Pool Job ID
            const jobId = await getTalentPoolJobId();
            if (!jobId) {
                throw new Error(isEn 
                    ? 'Internal configuration error: Talent Pool not available. Please try again later.' 
                    : 'Error de configuración interna: El Talent Pool no está disponible. Por favor intenta más tarde.');
            }

            // 2. Upload Resume
            const resumeUrl = await uploadResume(resumeFile);
            const formData = new FormData(form);

            // 3. Prepare Submission Data
            const data = {
                job_id: jobId,
                full_name: formData.get('full_name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                country: selectedCountry?.label,
                state_province: selectedState?.label,
                linkedin_url: formData.get('linkedin_url'),
                resume_url: resumeUrl,
                stack_ids: selectedStacks.map((s: any) => s.value),
                captchaToken: captchaToken,
                website_secondary: formData.get('website_secondary'), // Honeypot
                source: 'Web / Spontaneous',
                metadata: {
                    area_of_interest: selectedArea.value,
                    seniority_pref: selectedSeniority.value
                }
            };

            // 4. Submit to Server Action
            const result = await submitApplication(data);
            
            if (result.success) {
                trackJoinUsFormSuccess();
                setSuccess(true);
                if (onSuccess) onSuccess();
            } else {
                setFormError(result.error || (isEn ? 'Submission failed. Please try again.' : 'La postulación falló. Intenta de nuevo.'));
            }
        } catch (error: any) {
            console.error('SUBMISSION ERROR:', error);
            setFormError(error.message || (isEn ? 'An unexpected error occurred.' : 'Ocurrió un error inesperado.'));
        } finally {
            setLoading(false);
        }
    };

    const title = dict?.spontaneousTitle || (isEn ? 'Spontaneous Application' : 'Postulación Espontánea');
    const welcomeTitle = dict?.welcomeTeam || (isEn ? 'Welcome to the Team!' : '¡Bienvenido al Equipo!');
    const successMsg = dict?.talentPoolSuccess || (isEn 
                      ? 'Your profile has been added to our Talent Pool. We will contact you soon for future opportunities.' 
                      : 'Tu perfil ha sido añadido a nuestro Talent Pool. Te contactaremos pronto para futuras oportunidades.');

    const areaLabel = dict?.areaOfInterest || (isEn ? 'Area of Interest' : 'Área de Interés');
    const seniorityLabel = dict?.seniority || (isEn ? 'Seniority' : 'Seniority');

    if (success) {
        return (
            <div className="text-center py-12 px-4">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <Heart size={40} fill="currentColor" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 font-inter uppercase tracking-tight italic">
                    {welcomeTitle}
                </h3>
                <p className="text-slate-600 font-inter text-sm leading-relaxed max-w-sm mx-auto text-center">
                    {successMsg}
                </p>
            </div>
        );
    }

    const selectStyles = {
        control: (base: any, state: any) => ({
            ...base,
            borderRadius: '0.75rem',
            backgroundColor: 'white',
            borderColor: state.isFocused ? '#A3369D' : '#e2e8f0',
            padding: '4px 8px',
            boxShadow: 'none',
            '&:hover': {
                borderColor: '#A3369D'
            },
            fontSize: '0.875rem',
            fontWeight: '600'
        }),
        option: (base: any, state: any) => ({
            ...base,
            backgroundColor: state.isSelected ? '#A3369D' : state.isFocused ? '#faf5ff' : 'white',
            color: state.isSelected ? 'white' : '#1e293b',
            fontSize: '0.875rem',
            fontWeight: '600',
            padding: '12px 16px',
            '&:active': {
                backgroundColor: '#A3369D'
            }
        })
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Honeypot */}
            <div className="hidden" aria-hidden="true">
                <input type="text" name="website_secondary" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{dict?.fullName || (isEn ? 'Full Name' : 'Nombre Completo')} *</label>
                    <input
                        name="full_name"
                        required
                        placeholder="e.g. John Doe"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-brand/5 focus:border-brand/30 outline-none transition-all font-inter font-bold text-slate-700 text-sm"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{dict?.email || (isEn ? 'Email' : 'Email')} *</label>
                    <input
                        name="email"
                        type="email"
                        required
                        placeholder="john@example.com"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-brand/5 focus:border-brand/30 outline-none transition-all font-inter font-bold text-slate-700 text-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{areaLabel} *</label>
                    <Select
                        instanceId="area-select"
                        options={areas}
                        value={selectedArea}
                        onChange={(s) => setSelectedArea(s)}
                        styles={selectStyles}
                        placeholder={isEn ? "Select Area..." : "Seleccionar Área..."}
                        className="font-inter"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{seniorityLabel} *</label>
                    <Select
                        instanceId="seniority-select"
                        options={seniorities}
                        value={selectedSeniority}
                        onChange={(s) => setSelectedSeniority(s)}
                        styles={selectStyles}
                        placeholder={isEn ? "Select seniority..." : "Seleccionar seniority..."}
                        className="font-inter"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{dict?.country || (isEn ? 'Country' : 'País')} *</label>
                    <Select
                        instanceId="country-select"
                        options={countries}
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        styles={selectStyles}
                        className="font-inter"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{dict?.stateProvince || (isEn ? 'State/Province' : 'Provincia/Estado')} *</label>
                    <Select
                        instanceId="state-select"
                        options={states}
                        value={selectedState}
                        onChange={(s) => setSelectedState(s)}
                        isDisabled={!selectedCountry}
                        styles={selectStyles}
                        className="font-inter"
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{dict?.linkedin || (isEn ? 'LinkedIn profile' : 'Perfil de LinkedIn')} *</label>
                <input
                    name="linkedin_url"
                    type="url"
                    required
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-brand/5 focus:border-brand/30 outline-none transition-all font-inter font-bold text-slate-700 text-sm"
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{isEn ? 'Main Technologies' : 'Tecnologías Principales'}</label>
                <Select
                    instanceId="stacks-select"
                    isMulti
                    options={stacks}
                    value={selectedStacks}
                    onChange={(s) => setSelectedStacks(s)}
                    styles={selectStyles}
                    placeholder="e.g. React, Node.js..."
                    className="font-inter"
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{isEn ? 'Upload CV (PDF)' : 'Subir CV (PDF)'} *</label>
                <div className="relative group">
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id="resume-upload-spontaneous"
                    />
                    <label
                        htmlFor="resume-upload-spontaneous"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer bg-slate-50 transition-all hover:bg-slate-100/50 hover:border-brand group"
                    >
                        {resumeFile ? (
                            <div className="flex flex-col items-center gap-1 text-brand">
                                <CheckCircle2 size={24} />
                                <span className="font-bold font-inter text-xs truncate max-w-[250px] italic">{resumeFile.name}</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-slate-400">
                                <UploadCloud size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-[11px] font-black uppercase tracking-widest">{isEn ? 'Click to select' : 'Click para seleccionar'}</span>
                            </div>
                        )}
                    </label>
                </div>
            </div>

            {formError && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3 animate-shake">
                    <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    {formError}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-gradient-to-r from-brand to-purple-600 text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3 group shadow-xl shadow-brand/20 active:scale-[0.98]"
            >
                {loading ? (
                    <span className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        <span>{isEn ? 'Send Spontaneous Application' : 'Enviar Postulación'}</span>
                        <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                )}
            </button>

            <p className="text-[10px] text-slate-400 mt-6 text-center leading-relaxed">
                This site is protected by reCAPTCHA and the Google{' '}
                <a href="https://policies.google.com/privacy" className="underline hover:text-brand font-bold">Privacy Policy</a> and{' '}
                <a href="https://policies.google.com/terms" className="underline hover:text-brand font-bold">Terms of Service</a> apply.
            </p>
        </form>
    );
}
