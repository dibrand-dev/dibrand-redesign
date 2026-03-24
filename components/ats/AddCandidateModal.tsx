'use client'

import React, { useState, useEffect } from 'react';
import { X, UserPlus, Loader2, Save, Globe, Briefcase, Mail, Phone, Link as LinkIcon, FileText, MapPin } from 'lucide-react';
import { createCandidate, getRecruiterJobs } from '@/app/ats/actions';
import { useRouter } from 'next/navigation';
import { Country, State } from 'country-state-city';
import { toast } from 'react-hot-toast';

interface AddCandidateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddCandidateModal({ isOpen, onClose }: AddCandidateModalProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [jobs, setJobs] = useState<any[]>([]);
    const [countries] = useState(Country.getAllCountries());
    const [states, setStates] = useState<any[]>([]);
    
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
        if (isOpen) {
            fetchJobs();
            // Reset form when opening
            setFormData({
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
        }
    }, [isOpen]);

    const fetchJobs = async () => {
        try {
            const data = await getRecruiterJobs();
            setJobs(data || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
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
            const result = await createCandidate(formData);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success('¡Candidato creado con éxito!');
                onClose();
                router.refresh();
            }
        } catch (error) {
            console.error('Failed to create candidate:', error);
            toast.error('Error al crear el candidato. Intenta de nuevo.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#191C1D]/60 backdrop-blur-md animate-in fade-in duration-300 p-4 sm:p-6 text-inter">
            <div className="bg-white rounded-[24px] w-full max-w-4xl shadow-2xl border border-[#E1E2E5] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                {/* Header - Figma Style */}
                <div className="p-8 border-b border-[#F1F5F9] flex items-center justify-between bg-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#F0F4FF] flex items-center justify-center text-[#0040A1]">
                            <UserPlus size={24} />
                        </div>
                        <div>
                            <h3 className="text-[22px] font-bold text-[#191C1D] leading-tight">Add New Candidate</h3>
                            <p className="text-[13px] text-[#737785] font-medium">Manually add a high-priority candidate to the pool.</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2.5 hover:bg-[#F1F5F9] rounded-xl transition-all text-[#737785] hover:text-[#191C1D]"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Left Column: Personal Info */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#F1F5F9]">
                                <Globe size={16} className="text-[#0040A1]" />
                                <h4 className="text-[11px] font-black text-[#191C1D] uppercase tracking-[0.15em]">Personal Information</h4>
                            </div>

                            <div className="space-y-6">
                                {/* Name */}
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-[#737785] uppercase tracking-widest flex items-center gap-2">
                                        Full Name <span className="text-[#B3261E]">*</span>
                                    </label>
                                    <div className="relative">
                                        <input 
                                            required
                                            placeholder="e.g. Julian Vance"
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                            className="w-full pl-4 pr-4 py-3.5 rounded-xl border border-[#E1E2E5] text-[14px] font-medium text-[#191C1D] placeholder:text-[#A1A5B7] focus:border-[#0040A1] focus:ring-4 focus:ring-[#E0E7FF]/50 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Email & Phone Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-[#737785] uppercase tracking-widest flex items-center gap-2">
                                            Email <span className="text-[#B3261E]">*</span>
                                        </label>
                                        <div className="relative">
                                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A5B7]" />
                                            <input 
                                                type="email"
                                                required
                                                placeholder="julian.v@example.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#E1E2E5] text-[14px] font-medium text-[#191C1D] placeholder:text-[#A1A5B7] focus:border-[#0040A1] focus:ring-4 focus:ring-[#E0E7FF]/50 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-[#737785] uppercase tracking-widest">Phone</label>
                                        <div className="relative">
                                            <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A5B7]" />
                                            <input 
                                                placeholder="+1 (555) 000-0000"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#E1E2E5] text-[14px] font-medium text-[#191C1D] placeholder:text-[#A1A5B7] focus:border-[#0040A1] focus:ring-4 focus:ring-[#E0E7FF]/50 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Location Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-[#737785] uppercase tracking-widest flex items-center gap-2">
                                            Country <span className="text-[#B3261E]">*</span>
                                        </label>
                                        <select 
                                            required
                                            onChange={(e) => handleCountryChange(e.target.value)}
                                            className="w-full px-4 py-3.5 rounded-xl border border-[#E1E2E5] text-[14px] font-medium text-[#191C1D] bg-white focus:border-[#0040A1] outline-none transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">Select Country</option>
                                            {countries.map(c => (
                                                <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-[#737785] uppercase tracking-widest flex items-center gap-2">
                                            State/Province <span className="text-[#B3261E]">*</span>
                                        </label>
                                        <select 
                                            required
                                            disabled={!states.length}
                                            value={states.find(s => s.name === formData.state_province)?.isoCode || ''}
                                            onChange={(e) => {
                                                const s = states.find(st => st.isoCode === e.target.value);
                                                setFormData({...formData, state_province: s?.name || ''});
                                            }}
                                            className="w-full px-4 py-3.5 rounded-xl border border-[#E1E2E5] text-[14px] font-medium text-[#191C1D] bg-white focus:border-[#0040A1] outline-none transition-all appearance-none cursor-pointer disabled:bg-[#F8FAFC] disabled:cursor-not-allowed"
                                        >
                                            <option value="">Select State</option>
                                            {states.map(s => (
                                                <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* LinkedIn */}
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-[#737785] uppercase tracking-widest">LinkedIn Profile</label>
                                    <div className="relative">
                                        <LinkIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A5B7]" />
                                        <input 
                                            placeholder="linkedin.com/in/username"
                                            value={formData.linkedin_url}
                                            onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                                            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#E1E2E5] text-[14px] font-medium text-[#191C1D] placeholder:text-[#A1A5B7] focus:border-[#0040A1] focus:ring-4 focus:ring-[#E0E7FF]/50 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Professional Details */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#F1F5F9]">
                                <Briefcase size={16} className="text-[#0040A1]" />
                                <h4 className="text-[11px] font-black text-[#191C1D] uppercase tracking-[0.15em]">Professional Details</h4>
                            </div>

                            <div className="space-y-6">
                                {/* Vacancy Dropdown */}
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-[#737785] uppercase tracking-widest flex items-center gap-2">
                                        Target Position / Vacancy <span className="text-[#B3261E]">*</span>
                                    </label>
                                    <select 
                                        required
                                        value={formData.job_id}
                                        onChange={(e) => setFormData({...formData, job_id: e.target.value})}
                                        className="w-full px-4 py-3.5 rounded-xl border border-[#E1E2E5] text-[14px] font-medium text-[#191C1D] bg-white focus:border-[#0040A1] outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Select Vacancy</option>
                                        {jobs.map(j => (
                                            <option key={j.id} value={j.id}>{j.title} ({j.department})</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Resume Link */}
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-[#737785] uppercase tracking-widest flex items-center gap-2">
                                        Resume URL (PDF/DOCX) <span className="text-[#B3261E]">*</span>
                                    </label>
                                    <div className="relative">
                                        <FileText size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A5B7]" />
                                        <input 
                                            required
                                            placeholder="https://example.com/resume.pdf"
                                            value={formData.resume_url}
                                            onChange={(e) => setFormData({...formData, resume_url: e.target.value})}
                                            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#E1E2E5] text-[14px] font-medium text-[#191C1D] placeholder:text-[#A1A5B7] focus:border-[#0040A1] focus:ring-4 focus:ring-[#E0E7FF]/50 outline-none transition-all"
                                        />
                                    </div>
                                    <p className="text-[11px] text-[#A1A5B7] font-medium italic">Make sure the link is public or accessible.</p>
                                </div>

                                {/* Summary / Cover Letter */}
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-[#737785] uppercase tracking-widest">Cover Letter / Summary</label>
                                    <textarea 
                                        rows={8}
                                        placeholder="Type or paste the candidate's professional summary or cover letter here..."
                                        value={formData.candidate_summary}
                                        onChange={(e) => setFormData({...formData, candidate_summary: e.target.value})}
                                        className="w-full px-4 py-4 rounded-xl border border-[#E1E2E5] text-[14px] font-medium text-[#191C1D] placeholder:text-[#A1A5B7] focus:border-[#0040A1] outline-none transition-all resize-none leading-relaxed whitespace-pre-wrap"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Footer Actions */}
                <div className="p-8 border-t border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-end gap-4">
                    <button 
                        type="button"
                        onClick={onClose}
                        className="px-8 py-3.5 rounded-xl text-[13px] font-bold text-[#737785] hover:bg-[#F1F5F9] hover:text-[#191C1D] transition-all"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="px-10 py-3.5 rounded-xl bg-[#0040A1] text-white text-[13px] font-bold hover:bg-[#003380] transition-all shadow-lg shadow-[#0040A1]/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 size={18} className="animate-spin" /> Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} /> Create Candidate
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
