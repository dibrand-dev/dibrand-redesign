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
                first_name: formData.get('first_name'),
                last_name: formData.get('last_name'),
                full_name: `${formData.get('first_name')} ${formData.get('last_name')}`,
                email: formData.get('email'),
                phone: formData.get('phone'),
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
            <div className="text-center py-12 px-6">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send size={32} />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 mb-4 font-outfit">
                    {lang === 'es' ? '¡Postulación recibida!' : 'Application received!'}
                </h3>
                <p className="text-zinc-600 font-outfit leading-relaxed max-w-lg mx-auto">
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
            borderColor: state.isFocused ? '#D83484' : '#d4d4d8',
            padding: '4px 8px',
            boxShadow: state.isFocused ? '0 0 0 4px rgba(216, 52, 132, 0.1)' : 'none',
            '&:hover': {
                borderColor: '#D83484'
            }
        }),
        option: (base: any, state: any) => ({
            ...base,
            backgroundColor: state.isSelected ? '#D83484' : state.isFocused ? '#fce7f3' : 'white',
            color: state.isSelected ? 'white' : '#18181b',
            '&:active': {
                backgroundColor: '#D83484'
            }
        })
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
                <h3 className="text-2xl font-bold text-zinc-900 font-outfit">{dict.applyNow}</h3>
                <p className="text-zinc-500 font-outfit leading-relaxed">
                    {lang === 'es'
                        ? 'Completa tus datos para postularte a esta posición.'
                        : 'Please fill in your details to apply for this position.'}
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="text-xs font-bold text-zinc-700 uppercase tracking-widest font-outfit">{dict.firstName} *</label>
                    <input
                        name="first_name"
                        required
                        placeholder="John"
                        className="w-full px-5 py-4 bg-white border border-zinc-300 rounded-xl focus:ring-4 focus:ring-[#D83484]/10 focus:border-[#D83484] outline-none transition-all font-outfit text-zinc-900"
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-xs font-bold text-zinc-700 uppercase tracking-widest font-outfit">{dict.lastName} *</label>
                    <input
                        name="last_name"
                        required
                        placeholder="Doe"
                        className="w-full px-5 py-4 bg-white border border-zinc-300 rounded-xl focus:ring-4 focus:ring-[#D83484]/10 focus:border-[#D83484] outline-none transition-all font-outfit text-zinc-900"
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="text-xs font-bold text-zinc-700 uppercase tracking-widest font-outfit">{dict.email} *</label>
                    <input
                        name="email"
                        type="email"
                        required
                        placeholder="john@example.com"
                        className="w-full px-5 py-4 bg-white border border-zinc-300 rounded-xl focus:ring-4 focus:ring-[#D83484]/10 focus:border-[#D83484] outline-none transition-all font-outfit text-zinc-900"
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-xs font-bold text-zinc-700 uppercase tracking-widest font-outfit">{dict.phone} *</label>
                    <input
                        name="phone"
                        required
                        placeholder="+1 234 567 890"
                        className="w-full px-5 py-4 bg-white border border-zinc-300 rounded-xl focus:ring-4 focus:ring-[#D83484]/10 focus:border-[#D83484] outline-none transition-all font-outfit text-zinc-900"
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="text-xs font-bold text-zinc-700 uppercase tracking-widest font-outfit">{dict.country} *</label>
                    <Select
                        options={countries}
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        styles={selectStyles}
                        className="font-outfit"
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-xs font-bold text-zinc-700 uppercase tracking-widest font-outfit">{dict.stateProvince} *</label>
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

            <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-widest font-outfit">{dict.techStacks} *</label>
                <Select
                    isMulti
                    options={stacks}
                    value={selectedStacks}
                    onChange={(s) => setSelectedStacks(s)}
                    styles={selectStyles}
                    className="font-outfit"
                />
            </div>

            <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-widest font-outfit">{dict.linkedin} *</label>
                <input
                    name="linkedin_url"
                    type="url"
                    required
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-5 py-4 bg-white border border-zinc-300 rounded-xl focus:ring-4 focus:ring-[#D83484]/10 focus:border-[#D83484] outline-none transition-all font-outfit text-zinc-900"
                />
            </div>

            <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-widest font-outfit">{dict.attachResume} *</label>
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
                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-zinc-200 rounded-2xl cursor-pointer bg-white group-hover:bg-zinc-50 group-hover:border-[#D83484] transition-all"
                    >
                        {resumeFile ? (
                            <div className="flex flex-col items-center gap-3 text-[#D83484]">
                                <CheckCircle2 size={40} />
                                <span className="font-bold font-outfit text-center px-4 truncate max-w-full italic">{resumeFile.name}</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-zinc-400 group-hover:text-[#D83484] transition-colors">
                                <UploadCloud size={40} className="mb-3" />
                                <span className="text-sm font-bold font-outfit">{dict.clickToUpload}</span>
                                <span className="text-xs font-outfit">{dict.pdfOnly}</span>
                            </div>
                        )}
                    </label>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-[#D83484] text-white font-bold rounded-xl hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3 group text-lg shadow-lg shadow-[#D83484]/20"
            >
                {loading ? (
                    <span className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        <span>{dict.sendApplication}</span>
                        <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                )}
            </button>
        </form>
    );
}
