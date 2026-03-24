'use client'

import React, { useState } from 'react';
import { Edit2, X, Save, Loader2 } from 'lucide-react';
import { updateCandidate } from '@/app/ats/actions';
import { Candidate } from '@/app/ats/types';
import { useRouter } from 'next/navigation';

import { Country } from 'country-state-city';

export default function EditProfileButton({ candidate }: { candidate: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        full_name: candidate.full_name || '',
        first_name: candidate.first_name || '',
        last_name: candidate.last_name || '',
        position: candidate.position || candidate.job?.title || '',
        email: candidate.email || '',
        phone: candidate.phone || '',
        country: candidate.country || '',
        linkedin_url: candidate.linkedin_url || '',
        recruiter_notes: candidate.recruiter_notes || ''
    });

    const countries = Country.getAllCountries();
    const [filteredCountries, setFilteredCountries] = useState<any[]>([]);
    const [showPreview, setShowPreview] = useState(false);

    const router = useRouter();

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setFormData({...formData, country: val});
        if (val.length > 1) {
            const filtered = countries.filter(c => 
                c.name.toLowerCase().includes(val.toLowerCase())
            ).slice(0, 5);
            setFilteredCountries(filtered);
            setShowPreview(true);
        } else {
            setShowPreview(false);
        }
    };

    const selectCountry = (name: string) => {
        setFormData({...formData, country: name});
        setShowPreview(false);
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
                <Edit2 size={16} className="group-hover:scale-110 transition-transform" /> Edit
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-[#E1E2E5] overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-[#F1F5F9] flex items-center justify-between bg-[#F8FAFC]">
                            <h3 className="text-xl font-bold text-[#191C1D]">Edit Candidate Profile</h3>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white rounded-lg transition-colors">
                                <X size={20} className="text-[#6B7485]" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-[#6B7485] uppercase tracking-widest">First Name</label>
                                    <input 
                                        value={formData.first_name}
                                        onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl border border-[#E1E2E5] text-[14px] focus:border-[#0040A1] outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-[#6B7485] uppercase tracking-widest">Last Name</label>
                                    <input 
                                        value={formData.last_name}
                                        onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl border border-[#E1E2E5] text-[14px] focus:border-[#0040A1] outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-[#6B7485] uppercase tracking-widest">Full Name (Display)</label>
                                <input 
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl border border-[#E1E2E5] text-[14px] focus:border-[#0040A1] outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-[#6B7485] uppercase tracking-widest">Position / Target Hire</label>
                                <input 
                                    value={formData.position}
                                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl border border-[#E1E2E5] text-[14px] focus:border-[#0040A1] outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-[#6B7485] uppercase tracking-widest">Email</label>
                                    <input 
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl border border-[#E1E2E5] text-[14px] focus:border-[#0040A1] outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-[#6B7485] uppercase tracking-widest">Phone</label>
                                    <input 
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl border border-[#E1E2E5] text-[14px] focus:border-[#0040A1] outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-[#6B7485] uppercase tracking-widest">LinkedIn URL</label>
                                <input 
                                    value={formData.linkedin_url}
                                    onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                                    placeholder="https://www.linkedin.com/in/..."
                                    className="w-full px-4 py-3 rounded-xl border border-[#E1E2E5] text-[14px] focus:border-[#0040A1] outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2 relative">
                                <label className="text-[11px] font-bold text-[#6B7485] uppercase tracking-widest">Location</label>
                                <input 
                                    value={formData.country}
                                    onChange={handleLocationChange}
                                    placeholder="e.g. United Kingdom"
                                    autoComplete="off"
                                    className="w-full px-4 py-3 rounded-xl border border-[#E1E2E5] text-[14px] focus:border-[#0040A1] outline-none transition-all"
                                />
                                {showPreview && filteredCountries.length > 0 && (
                                    <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-[#E1E2E5] rounded-xl shadow-xl z-10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                        {filteredCountries.map((country: any) => (
                                            <button
                                                key={country.isoCode}
                                                type="button"
                                                onClick={() => selectCountry(country.name)}
                                                className="w-full px-4 py-3 text-left text-[13px] hover:bg-[#F1F5F9] transition-colors flex items-center justify-between group"
                                            >
                                                <span className="font-medium text-[#191C1D]">{country.name}</span>
                                                <span className="text-[10px] text-[#A1A5B7] font-bold group-hover:text-[#0040A1]">{country.isoCode}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-[#6B7485] uppercase tracking-widest">Recruiter Notes</label>
                                <textarea 
                                    rows={4}
                                    value={formData.recruiter_notes}
                                    onChange={(e) => setFormData({...formData, recruiter_notes: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl border border-[#E1E2E5] text-[14px] focus:border-[#0040A1] outline-none transition-all resize-none"
                                />
                            </div>
                        </form>

                        <div className="p-6 border-t border-[#F1F5F9] flex items-center justify-end gap-3 bg-[#F8FAFC]">
                            <button 
                                type="button" 
                                onClick={() => setIsOpen(false)}
                                className="px-6 py-2.5 text-[13px] font-bold text-[#6B7485] hover:text-[#191C1D] transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-8 py-2.5 bg-[#0040A1] text-white rounded-xl text-[13px] font-bold flex items-center gap-2 hover:bg-[#003380] transition-all disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
