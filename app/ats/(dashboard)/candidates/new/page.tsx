'use client'

import React, { useState, useEffect } from 'react';
import { UserPlus, Loader2, Save, Globe, Briefcase, Mail, Phone, Link as LinkIcon, FileText, Star, X, ChevronLeft } from 'lucide-react';
import { createCandidate, getRecruiterJobs, getAllTechStacks } from '@/app/ats/actions';
import { useRouter } from 'next/navigation';
import { Country, State } from 'country-state-city';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function NewCandidatePage() {
    const [isSaving, setIsSaving] = useState(false);
    const [jobs, setJobs] = useState<any[]>([]);
    const [techStacks, setTechStacks] = useState<any[]>([]);
    const [countries] = useState(Country.getAllCountries());
    const [states, setStates] = useState<any[]>([]);
    const [skills, setSkills] = useState<string[]>([]);
    
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        candidate_summary: '',
        resume_url: '',
        country: '',
        state_province: '',
        job_id: '',
        linkedin_url: ''
    });

    const router = useRouter();

    useEffect(() => {
        fetchJobs();
        fetchTechStacks();
    }, []);

    const fetchJobs = async () => {
        try {
            const data = await getRecruiterJobs();
            setJobs(data || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const fetchTechStacks = async () => {
        try {
            const data = await getAllTechStacks();
            setTechStacks(data || []);
        } catch (error) {
            console.error('Error fetching tech stacks:', error);
        }
    };

    const handleCountryChange = (countryCode: string) => {
        const country = countries.find(c => c.isoCode === countryCode);
        setFormData({ 
            ...formData, 
            country: country?.name || '', 
            state_province: '' 
        });
        if (countryCode) {
            setStates(State.getStatesOfCountry(countryCode));
        } else {
            setStates([]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!formData.full_name || !formData.email || !formData.resume_url || !formData.country || !formData.state_province || !formData.job_id) {
            toast.error('Por favor completa todos los campos obligatorios.');
            return;
        }

        setIsSaving(true);
        try {
            const result = await createCandidate({ ...formData, skills });
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success('¡Candidato creado con éxito!');
                router.push('/ats/candidates');
                router.refresh();
            }
        } catch (error) {
            console.error('Failed to create candidate:', error);
            toast.error('Error al crear el candidato. Intenta de nuevo.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-[1104px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 font-inter">
            {/* Navigation Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link 
                    href="/ats/candidates" 
                    className="w-10 h-10 rounded-xl bg-white border border-[#E1E2E5] flex items-center justify-center text-[#737785] hover:text-[#0040A1] hover:border-[#0040A1] transition-all shadow-sm group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                </Link>
                <div>
                    <h1 className="text-[28px] font-bold text-[#191C1D] leading-tight flex items-center gap-3">
                        <UserPlus size={28} className="text-[#0040A1]" /> Add New Candidate
                    </h1>
                    <p className="text-[13px] text-[#737785] font-medium mt-1">Direct manual entry for high-priority talent profiles.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-[24px] shadow-sm border border-[#E1E2E5] overflow-hidden">
                {/* Form Body */}
                <div className="p-10 lg:p-12 space-y-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                        
                        {/* Left Column: Personal Info */}
                        <div className="space-y-10">
                            <div className="flex items-center gap-3 pb-3 border-b border-[#F1F5F9]">
                                <Globe size={18} className="text-[#0040A1]" />
                                <h4 className="text-[12px] font-black text-[#191C1D] uppercase tracking-[0.2em]">Personal Information</h4>
                            </div>

                            <div className="space-y-7">
                                {/* Name */}
                                <div className="space-y-2.5">
                                    <label className="text-[11px] font-bold text-[#737785] uppercase tracking-widest flex items-center gap-2">
                                        Full Name <span className="text-[#B3261E]">*</span>
                                    </label>
                                    <input 
                                        required
                                        placeholder="e.g. Julian Vance"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                        className="w-full px-5 py-3.5 rounded-xl border border-[#E1E2E5] text-[14px] font-medium text-[#191C1D] placeholder:text-[#A1A5B7] focus:border-[#0040A1] focus:ring-4 focus:ring-[#0040A1]/5 outline-none transition-all shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
                                    />
                                </div>

                                {/* Email & Phone Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2.5">
                                        <label className="text-[11px] font-bold text-[#737785] uppercase tracking-widest flex items-center gap-2">
                                            Email Address <span className="text-[#B3261E]">*</span>
                                        </label>
                                        <div className="relative">
                                            <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A1A5B7]" />
                                            <input 
                                                type="email"
                                                required
                                                placeholder="julian.v@example.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                className="w-full pl-12 pr-5 py-3.5 rounded-xl border border-[#E1E2E5] text-[14px] font-medium text-[#191C1D] focus:border-[#0040A1] focus:ring-4 focus:ring-[#0040A1]/5 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2.5">
                                        <label className="text-[11px] font-bold text-[#737785] uppercase tracking-widest">Phone Number</label>
                                        <div className="relative">
                                            <Phone size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A1A5B7]" />
                                            <input 
                                                placeholder="+1 (555) 000-0000"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                className="w-full pl-12 pr-5 py-3.5 rounded-xl border border-[#E1E2E5] text-[14px] font-medium text-[#191C1D] focus:border-[#0040A1] focus:ring-4 focus:ring-[#0040A1]/5 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Location Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2.5">
                                        <label className="text-[11px] font-bold text-[#737785] uppercase tracking-widest flex items-center gap-2">
                                            Country <span className="text-[#B3261E]">*</span>
                                        </label>
                                        <select 
                                            required
                                            onChange={(e) => handleCountryChange(e.target.value)}
                                            className="w-full px-5 py-3.5 rounded-xl border border-[#E1E2E5] text-[14px] font-medium text-[#191C1D] bg-white focus:border-[#0040A1] outline-none transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">Select Country</option>
                                            {countries.map(c => (
                                                <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2.5">
                                        <label className="text-[11px] font-bold text-[#737785] uppercase tracking-widest flex items-center gap-2">
                                            State / Province <span className="text-[#B3261E]">*</span>
                                        </label>
                                        <select 
                                            required
                                            disabled={!states.length}
                                            value={states.find(s => s.name === formData.state_province)?.isoCode || ''}
                                            onChange={(e) => {
                                                const s = states.find(st => st.isoCode === e.target.value);
                                                setFormData({...formData, state_province: s?.name || ''});
                                            }}
                                            className="w-full px-5 py-3.5 rounded-xl border border-[#E1E2E5] text-[14px] font-medium text-[#191C1D] bg-white focus:border-[#0040A1] outline-none transition-all appearance-none cursor-pointer disabled:bg-[#F8FAFC] disabled:cursor-not-allowed"
                                        >
                                            <option value="">Select State</option>
                                            {states.map(s => (
                                                <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* LinkedIn */}
                                <div className="space-y-2.5">
                                    <label className="text-[11px] font-bold text-[#737785] uppercase tracking-widest">LinkedIn Profile URL</label>
                                    <div className="relative">
                                        <LinkIcon size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A1A5B7]" />
                                        <input 
                                            placeholder="https://linkedin.com/in/username"
                                            value={formData.linkedin_url}
                                            onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                                            className="w-full pl-12 pr-5 py-3.5 rounded-xl border border-[#E1E2E5] text-[14px] font-medium text-[#191C1D] focus:border-[#0040A1] focus:ring-4 focus:ring-[#0040A1]/5 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Professional Details */}
                        <div className="space-y-10">
                            <div className="flex items-center gap-3 pb-3 border-b border-[#F1F5F9]">
                                <Briefcase size={18} className="text-[#0040A1]" />
                                <h4 className="text-[12px] font-black text-[#191C1D] uppercase tracking-[0.2em]">Professional Details</h4>
                            </div>

                            <div className="space-y-7">
                                {/* Vacancy Dropdown */}
                                <div className="space-y-2.5">
                                    <label className="text-[11px] font-bold text-[#737785] uppercase tracking-widest flex items-center gap-2">
                                        Target Role / Open Vacancy <span className="text-[#B3261E]">*</span>
                                    </label>
                                    <select 
                                        required
                                        value={formData.job_id}
                                        onChange={(e) => setFormData({...formData, job_id: e.target.value})}
                                        className="w-full px-5 py-3.5 rounded-xl border border-[#E1E2E5] text-[14px] font-medium text-[#191C1D] bg-white focus:border-[#0040A1] outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Select an active vacancy</option>
                                        {jobs.map(j => (
                                            <option key={j.id} value={j.id}>{j.title} — {j.department}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Skills Tags */}
                                <div className="space-y-3.5">
                                    <label className="text-[11px] font-bold text-[#737785] uppercase tracking-widest">Skills / Proficiency</label>
                                    <div className="flex flex-wrap gap-2.5 mb-3.5">
                                        {skills.map(skill => (
                                            <span key={skill} className="px-3.5 py-1.5 bg-[#F0F4FF] text-[#0040A1] text-[12px] font-bold rounded-lg flex items-center gap-2 group animate-in zoom-in-90 duration-200">
                                                {skill}
                                                <button 
                                                    type="button" 
                                                    onClick={() => setSkills(skills.filter(s => s !== skill))}
                                                    className="hover:text-red-500 transition-colors"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ))}
                                        {skills.length === 0 && <span className="text-[12px] text-[#A1A5B7] italic">No skills added yet...</span>}
                                    </div>
                                    <div className="relative">
                                        <Star size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A1A5B7]" />
                                        <input 
                                            list="tech-stacks"
                                            placeholder="Type skill and press Enter (e.g. React, UX Writing)"
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
                                            className="w-full pl-12 pr-5 py-3.5 rounded-xl border border-[#E1E2E5] text-[14px] font-medium text-[#191C1D] focus:border-[#0040A1] focus:ring-4 focus:ring-[#0040A1]/5 outline-none transition-all"
                                        />
                                        <datalist id="tech-stacks">
                                            {techStacks.map(stack => (
                                                <option key={stack.id} value={stack.name} />
                                            ))}
                                        </datalist>
                                    </div>
                                    <p className="text-[11px] text-[#A1A5B7] font-medium italic">Sugerencias cargadas automáticamente desde el catálogo de Tech Stack.</p>
                                </div>

                                {/* Resume Link */}
                                <div className="space-y-2.5">
                                    <label className="text-[11px] font-bold text-[#737785] uppercase tracking-widest flex items-center gap-2">
                                        Resume URL (Public Link) <span className="text-[#B3261E]">*</span>
                                    </label>
                                    <div className="relative">
                                        <FileText size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A1A5B7]" />
                                        <input 
                                            required
                                            placeholder="https://drive.google.com/file/..."
                                            value={formData.resume_url}
                                            onChange={(e) => setFormData({...formData, resume_url: e.target.value})}
                                            className="w-full pl-12 pr-5 py-3.5 rounded-xl border border-[#E1E2E5] text-[14px] font-medium text-[#191C1D] focus:border-[#0040A1] focus:ring-4 focus:ring-[#0040A1]/5 outline-none transition-all"
                                        />
                                    </div>
                                    <p className="text-[11px] text-[#A1A5B7] font-medium italic">Supports PDF or DOCX formats up to 10MB.</p>
                                </div>

                                {/* Summary */}
                                <div className="space-y-2.5">
                                    <label className="text-[11px] font-bold text-[#737785] uppercase tracking-widest">Cover Letter / Professional Summary</label>
                                    <textarea 
                                        rows={6}
                                        placeholder="Type or paste the candidate's professional profile here..."
                                        value={formData.candidate_summary}
                                        onChange={(e) => setFormData({...formData, candidate_summary: e.target.value})}
                                        className="w-full px-5 py-4 rounded-xl border border-[#E1E2E5] text-[14px] font-medium text-[#191C1D] focus:border-[#0040A1] outline-none transition-all resize-none leading-relaxed whitespace-pre-wrap"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Sticky/Static Action Bar */}
                <div className="px-10 py-8 bg-[#F8FAFC] border-t border-[#F1F5F9] flex items-center justify-between">
                    <p className="text-[12px] text-[#737785] font-medium italic">
                        All information will be stored securely and linked to your recruiter profile.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link 
                            href="/ats/candidates"
                            className="px-8 py-3.5 rounded-xl text-[13px] font-bold text-[#737785] hover:bg-white hover:text-[#191C1D] transition-all"
                        >
                            Cancel
                        </Link>
                        <button 
                            type="submit"
                            disabled={isSaving}
                            className="px-10 py-3.5 rounded-xl bg-[#0040A1] text-white text-[13px] font-bold hover:bg-[#003380] transition-all shadow-xl shadow-[#0040A1]/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" /> Finalizing...
                                </>
                            ) : (
                                <>
                                    <Save size={18} /> Create Candidate Profile
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
