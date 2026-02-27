'use client'

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Country, State } from 'country-state-city';
import { getTechStacks, uploadResume, submitApplication } from '@/app/actions/applications';
import { CheckCircle2, Loader2, UploadCloud, Send } from 'lucide-react';

interface JobApplicationFormProps {
    jobId: string;
    lang: string;
    dict: any;
}

export default function JobApplicationForm({ jobId, lang, dict }: JobApplicationFormProps) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [stacks, setStacks] = useState<{ value: string, label: string }[]>([]);
    const [selectedStacks, setSelectedStacks] = useState<any>([]);
    const [countries, setCountries] = useState<{ value: string, label: string }[]>([]);
    const [states, setStates] = useState<{ value: string, label: string }[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<any>(null);
    const [selectedState, setSelectedState] = useState<any>(null);
    const [resumeFile, setResumeFile] = useState<File | null>(null);

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (!resumeFile) {
            alert(dict.attachResume || 'Please upload your resume');
            return;
        }

        if (!selectedCountry || !selectedState) {
            alert(dict.stateProvince || 'Please select your Country and State/Province');
            return;
        }

        setLoading(true);
        try {
            const resumeUrl = await uploadResume(resumeFile);

            const formData = new FormData(form);
            const data = {
                job_id: jobId,
                full_name: formData.get('full_name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                mobile_phone: formData.get('mobile_phone'),
                country: selectedCountry?.label,
                state_province: selectedState?.label,
                linkedin_url: formData.get('linkedin_url'),
                resume_url: resumeUrl,
                stack_ids: selectedStacks.map((s: any) => s.value)
            };

            await submitApplication(data);
            setSuccess(true);
        } catch (error: any) {
            console.error('SUBMISSION ERROR:', error);
            alert('Error: ' + (error.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center py-12 px-4 shadow-none border-none">
                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-4 font-outfit leading-tight">
                    {lang === 'es' ? '¡Postulación recibida!' : 'Application received!'}
                </h3>
                <p className="text-zinc-500 font-outfit text-sm leading-relaxed max-w-xs mx-auto text-center">
                    {dict.success}
                </p>
            </div>
        );
    }

    const selectStyles = {
        control: (base: any, state: any) => ({
            ...base,
            borderRadius: '0.75rem',
            backgroundColor: 'white',
            borderColor: state.isFocused ? '#D83484' : '#e4e4e7',
            padding: '2px 4px',
            boxShadow: 'none',
            '&:hover': {
                borderColor: '#D83484'
            },
            fontSize: '0.875rem'
        }),
        option: (base: any, state: any) => ({
            ...base,
            backgroundColor: state.isSelected ? '#D83484' : state.isFocused ? '#fce7f3' : 'white',
            color: state.isSelected ? 'white' : '#27272a',
            fontSize: '0.875rem',
            padding: '10px 16px',
            '&:active': {
                backgroundColor: '#D83484'
            }
        })
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
                <h3 className="text-xl font-bold text-zinc-900 font-outfit">{dict.applyNow}</h3>
                <p className="text-xs text-zinc-500 font-outfit">
                    {lang === 'es'
                        ? 'Completa tus datos para postularte.'
                        : 'Complete your details to apply.'}
                </p>
            </div>

            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-outfit">{dict.fullName || 'Full Name'} *</label>
                <input
                    name="full_name"
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#D83484]/10 focus:border-[#D83484] outline-none transition-all font-outfit text-zinc-900 text-sm"
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-outfit">{dict.email} *</label>
                <input
                    name="email"
                    type="email"
                    required
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#D83484]/10 focus:border-[#D83484] outline-none transition-all font-outfit text-zinc-900 text-sm"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-outfit">{dict.phone || 'Phone'} *</label>
                    <input
                        name="phone"
                        required
                        placeholder="+1..."
                        className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#D83484]/10 focus:border-[#D83484] outline-none transition-all font-outfit text-zinc-900 text-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-outfit">{dict.mobilePhone || 'Mobile Phone'} *</label>
                    <input
                        name="mobile_phone"
                        required
                        placeholder="+1..."
                        className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#D83484]/10 focus:border-[#D83484] outline-none transition-all font-outfit text-zinc-900 text-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-outfit">{dict.country} *</label>
                    <Select
                        options={countries}
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        styles={selectStyles}
                        className="font-outfit"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-outfit">{dict.stateProvince} *</label>
                    <Select
                        options={states}
                        value={selectedState}
                        onChange={(s) => setSelectedState(s)}
                        isDisabled={!selectedCountry}
                        styles={selectStyles}
                        className="font-outfit"
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-outfit">{dict.techStacks} *</label>
                <Select
                    isMulti
                    options={stacks}
                    value={selectedStacks}
                    onChange={(s) => setSelectedStacks(s)}
                    styles={selectStyles}
                    className="font-outfit"
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-outfit">{dict.linkedin} *</label>
                <input
                    name="linkedin_url"
                    type="url"
                    required
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#D83484]/10 focus:border-[#D83484] outline-none transition-all font-outfit text-zinc-900 text-sm"
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-outfit">{dict.attachResume} *</label>
                <div className="relative group">
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id="resume-upload"
                    />
                    <label
                        htmlFor="resume-upload"
                        className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-zinc-100 rounded-2xl cursor-pointer bg-zinc-50 transition-all hover:bg-zinc-100/50 hover:border-[#D83484]"
                    >
                        {resumeFile ? (
                            <div className="flex items-center gap-2 text-[#D83484]">
                                <CheckCircle2 size={20} />
                                <span className="font-bold font-outfit text-xs truncate max-w-[180px] italic">{resumeFile.name}</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-zinc-400">
                                <UploadCloud size={24} className="mb-1" />
                                <span className="text-[10px] font-bold font-outfit">{dict.clickToUpload}</span>
                            </div>
                        )}
                    </label>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#D83484] text-white font-bold rounded-xl hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 group text-base shadow-lg shadow-[#D83484]/10 active:scale-[0.98]"
            >
                {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        <span>{dict.sendApplication}</span>
                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                )}
            </button>
        </form>
    );
}
