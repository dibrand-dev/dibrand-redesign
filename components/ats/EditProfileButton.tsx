'use client'

import React, { useState, useEffect } from 'react';
import { Edit2, X, Save, Loader2, Globe, MapPin } from 'lucide-react';
import { updateCandidate } from '@/app/ats/actions';
import { useRouter } from 'next/navigation';
import { Country, State } from 'country-state-city';

export default function EditProfileButton({ candidate }: { candidate: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        full_name: candidate.full_name || '',
        first_name: candidate.first_name || '',
        last_name: candidate.last_name || '',
        position: candidate.position || candidate.job?.title || '',
        email: candidate.email || '',
        phone: candidate.phone || '',
        country: candidate.country || '',
        state_province: candidate.state_province || '',
        linkedin_url: candidate.linkedin_url || '',
        recruiter_notes: candidate.recruiter_notes || ''
    });

    const countries = Country.getAllCountries();
    const [states, setStates] = useState<any[]>([]);

    const router = useRouter();

    // Initialize states if there's a selected country
    useEffect(() => {
        if (formData.country) {
            const country = countries.find(c => c.name === formData.country);
            if (country) {
                setStates(State.getStatesOfCountry(country.isoCode));
            }
        }
    }, [formData.country]);

    const handleCountryChange = (countryName: string) => {
        const country = countries.find(c => c.name === countryName);
        setFormData({ 
            ...formData, 
            country: countryName, 
            state_province: '' // reset state
        });
        if (country) {
            setStates(State.getStatesOfCountry(country.isoCode));
        } else {
            setStates([]);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateCandidate(candidate.id, formData);
            setIsOpen(false);
            router.refresh();
        } catch (error) {
            console.error('Failed to update candidate:', error);
            alert('Error updating. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                className="px-8 py-3 rounded-xl border border-[#E1E2E5] text-[13px] font-bold text-[#191C1D] hover:bg-[#0040A1] hover:text-white hover:border-[#0040A1] transition-all bg-white shadow-sm flex items-center gap-2 group"
            >
                <Edit2 size={16} className="group-hover:scale-110 transition-transform" /> Edit Profile
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto px-4 py-8">
                    <div className="bg-white rounded-[24px] w-full max-w-2xl shadow-2xl border border-[#E1E2E5] overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-[#F1F5F9] flex items-center justify-between bg-[#F8FAFC]">
                            <h3 className="text-[20px] font-bold text-[#191C1D] flex items-center gap-3">
                                <Edit2 size={24} className="text-[#0040A1]" /> Edit Candidate Profile
                            </h3>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white rounded-lg transition-colors shadow-sm">
                                <X size={20} className="text-[#6B7485]" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-10 space-y-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
                            {/* Personal Information Group */}
                            <div className="space-y-6">
                                <h4 className="text-[12px] font-black text-[#191C1D] uppercase tracking-[0.2em] pb-3 border-b border-[#F1F5F9]">Basic Info</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-[#6B7485] uppercase tracking-widest">First Name</label>
                                        <input 
                                            value={formData.first_name}
                                            onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                                            className="w-full px-5 py-3.5 rounded-xl border border-[#E1E2E5] text-[14px] font-medium text-[#191C1D] focus:border-[#0040A1] focus:ring-4 focus:ring-[#0040A1]/5 outline-none transition-all shadow-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-[#6B7485] uppercase tracking-widest">Last Name</label>
                                        <input 
                                            value={formData.last_name}
                                            onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                            className="w-full px-5 py-3.5 rounded-xl border border-[#E1E2E5] text-[14px] font-medium text-[#191C1D] focus:border-[#0040A1] focus:ring-4 focus:ring-[#0040A1]/5 outline-none transition-all shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-[#6B7485] uppercase tracking-widest">Full Display Name</label>
                                    <input 
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                        className="w-full px-5 py-3.5 rounded-xl border border-[#E1E2E5] text-[14px] font-medium text-[#191C1D] focus:border-[#0040A1] focus:ring-4 focus:ring-[#0040A1]/5 outline-none transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Contact & Professional Group */}
                            <div className="space-y-6">
                                <h4 className="text-[12px] font-black text-[#191C1D] uppercase tracking-[0.2em] pb-3 border-b border-[#F1F5F9]">Contact & Location</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-[#6B7485] uppercase tracking-widest">Email</label>
                                        <input 
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full px-5 py-3.5 rounded-xl border border-[#E1E2E5] text-[14px] font-medium text-[#191C1D] focus:border-[#0040A1] outline-none transition-all shadow-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-[#6B7485] uppercase tracking-widest">Phone</label>
                                        <input 
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            className="w-full px-5 py-3.5 rounded-xl border border-[#E1E2E5] text-[14px] font-medium text-[#191C1D] focus:border-[#0040A1] outline-none transition-all shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-[#6B7485] uppercase tracking-widest flex items-center gap-2">
                                            <Globe size={12} className="text-[#0040A1]" /> Country
                                        </label>
                                        <select 
                                            value={formData.country}
                                            onChange={(e) => handleCountryChange(e.target.value)}
                                            className="w-full px-5 py-3.5 rounded-xl border border-[#E1E2E5] text-[14px] font-medium text-[#191C1D] focus:border-[#0040A1] outline-none transition-all appearance-none cursor-pointer bg-white"
                                        >
                                            <option value="">Select Country</option>
                                            {countries.map(c => (
                                                <option key={c.isoCode} value={c.name}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-[#6B7485] uppercase tracking-widest flex items-center gap-2">
                                            <MapPin size={12} className="text-[#0040A1]" /> State / Province
                                        </label>
                                        <select 
                                            disabled={!states.length}
                                            value={formData.state_province}
                                            onChange={(e) => setFormData({...formData, state_province: e.target.value})}
                                            className="w-full px-5 py-3.5 rounded-xl border border-[#E1E2E5] text-[14px] font-medium text-[#191C1D] focus:border-[#0040A1] outline-none transition-all appearance-none cursor-pointer bg-white disabled:bg-[#F8FAFC]"
                                        >
                                            <option value="">Select State / Province</option>
                                            {states.map(s => (
                                                <option key={s.isoCode} value={s.name}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-[#6B7485] uppercase tracking-widest">LinkedIn URL</label>
                                    <input 
                                        value={formData.linkedin_url}
                                        onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                                        className="w-full px-5 py-3.5 rounded-xl border border-[#E1E2E5] text-[14px] font-medium text-[#191C1D] focus:border-[#0040A1] outline-none transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-[#6B7485] uppercase tracking-widest">Internal Recruiter Notes</label>
                                <textarea 
                                    rows={4}
                                    value={formData.recruiter_notes}
                                    onChange={(e) => setFormData({...formData, recruiter_notes: e.target.value})}
                                    placeholder="Add background info, interview outcomes, etc..."
                                    className="w-full px-5 py-4 rounded-xl border border-[#E1E2E5] text-[14px] font-medium text-[#191C1D] focus:border-[#0040A1] outline-none transition-all resize-none leading-relaxed"
                                />
                            </div>
                        </form>

                        <div className="p-8 border-t border-[#F1F5F9] flex items-center justify-end gap-5 bg-[#F8FAFC]">
                            <button 
                                type="button" 
                                onClick={() => setIsOpen(false)}
                                className="text-[13px] font-bold text-[#6B7485] hover:text-[#191C1D] transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-10 py-3.5 bg-[#0040A1] text-white rounded-xl text-[13px] font-bold flex items-center gap-2 hover:bg-[#003380] transition-all shadow-lg shadow-[#0040A1]/20 disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
                                {isSaving ? 'Syncing...' : 'Update Profile'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
