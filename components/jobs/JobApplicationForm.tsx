'use client'

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Country, State } from 'country-state-city';
import { getTechStacks, uploadResume, submitApplication } from '@/app/actions/applications';
import { CheckCircle2, Loader2, UploadCloud } from 'lucide-react';

interface JobApplicationFormProps {
    jobId: string;
    lang: string;
}

export default function JobApplicationForm({ jobId, lang }: JobApplicationFormProps) {
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
            const dbStacks = await getTechStacks();
            setStacks(dbStacks.map(s => ({ value: s.id, label: s.name })));

            const allCountries = Country.getAllCountries();
            setCountries(allCountries.map(c => ({ value: c.isoCode, label: c.name })));
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
        const form = e.currentTarget; // Capture form reference immediately

        if (!resumeFile) {
            alert('Please upload your resume');
            return;
        }

        if (!selectedCountry || !selectedState) {
            alert('Please select your Country and State/Province');
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
            console.error('FULL SUBMISSION ERROR:', error);
            const msg = error.message || error.details || JSON.stringify(error);
            alert('Error submitting application: ' + msg);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="p-12 text-center space-y-6 flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={48} className="text-green-600" />
                </div>
                <h3 className="text-3xl font-bold text-corporate-grey">¡Postulación enviada con éxito!</h3>
                <p className="text-corporate-grey/60 text-lg max-w-sm mx-auto">
                    Nuestro equipo revisará tu perfil y nos pondremos en contacto contigo a la brevedad. ¡Gracias por querer ser parte de Dibrand!
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <h3 className="text-2xl font-bold text-corporate-grey mb-6">Apply for this position</h3>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">First Name *</label>
                    <input
                        name="first_name"
                        required
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Last Name *</label>
                    <input
                        name="last_name"
                        required
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Email *</label>
                    <input
                        name="email"
                        type="email"
                        required
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Phone</label>
                    <input
                        name="phone"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Country *</label>
                    <Select
                        options={countries}
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        className="text-sm"
                        styles={{
                            control: (base) => ({
                                ...base,
                                borderRadius: '0.75rem',
                                backgroundColor: '#F9FAFB',
                                borderColor: '#E5E7EB',
                                padding: '2px'
                            })
                        }}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">State / Province *</label>
                    <Select
                        options={states}
                        value={selectedState}
                        onChange={(s) => setSelectedState(s)}
                        isDisabled={!selectedCountry}
                        className="text-sm"
                        styles={{
                            control: (base) => ({
                                ...base,
                                borderRadius: '0.75rem',
                                backgroundColor: '#F9FAFB',
                                borderColor: '#E5E7EB',
                                padding: '2px'
                            })
                        }}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Your Tech Stack *</label>
                <Select
                    isMulti
                    options={stacks}
                    value={selectedStacks}
                    onChange={(s) => setSelectedStacks(s)}
                    className="text-sm"
                    styles={{
                        control: (base) => ({
                            ...base,
                            borderRadius: '0.75rem',
                            backgroundColor: '#F9FAFB',
                            borderColor: '#E5E7EB',
                            padding: '2px'
                        })
                    }}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">LinkedIn URL</label>
                <input
                    name="linkedin_url"
                    type="url"
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Resume (PDF) *</label>
                <div className="relative group">
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id="resume-upload"
                        required
                    />
                    <label
                        htmlFor="resume-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer bg-gray-50 group-hover:bg-gray-100 group-hover:border-primary transition-all"
                    >
                        {resumeFile ? (
                            <div className="flex items-center gap-2 text-primary font-bold">
                                <CheckCircle2 size={24} />
                                <span className="truncate max-w-[200px]">{resumeFile.name}</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-gray-400 group-hover:text-primary transition-colors">
                                <UploadCloud size={32} className="mb-2" />
                                <span className="text-sm font-medium">Click to upload or drag & drop</span>
                                <span className="text-xs">PDF only (Max 5MB)</span>
                            </div>
                        )}
                    </label>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:scale-100"
            >
                {loading ? (
                    <>
                        <Loader2 className="animate-spin" />
                        <span>Submitting Application...</span>
                    </>
                ) : (
                    <span>Submit Application</span>
                )}
            </button>
        </form>
    );
}
