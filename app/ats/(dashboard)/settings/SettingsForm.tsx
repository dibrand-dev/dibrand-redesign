'use client';

import React, { useState } from 'react';
import { updateRecruiterProfile } from '@/app/ats/actions';
import { Loader2 } from 'lucide-react';

interface SettingsFormProps {
    initialData: {
        fullName: string;
        jobTitle: string;
        email: string;
        phone: string;
        avatarUrl: string;
    }
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: initialData.fullName,
        jobTitle: initialData.jobTitle,
        phone: initialData.phone,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await updateRecruiterProfile(formData);
            alert('Perfil actualizado con éxito');
        } catch (error: any) {
            console.error('CRITICAL ERROR UPDATING PROFILE:', error);
            const errorMessage = error.message || JSON.stringify(error);
            alert('Error al actualizar el perfil: ' + errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Page Header */}
            <div className="flex justify-between items-start mb-10 w-full">
                <div>
                    <h1 className="text-[26px] font-black text-slate-900 leading-tight mb-1 tracking-tight">User Profile</h1>
                    <p className="text-[14px] text-slate-500 font-medium">Update your personal information and public profile</p>
                </div>
                <button 
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-[#0B4FEA] text-white rounded-xl text-[14px] font-bold hover:bg-blue-800 shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isLoading && <Loader2 size={16} className="animate-spin" />}
                    Save Changes
                </button>
            </div>

            {/* 1. Profile Card */}
            <div className="bg-white rounded-[24px] shadow-sm border border-slate-200/60 p-8 mb-8 flex flex-col md:flex-row gap-12">
                {/* Avatar Column */}
                <div className="flex flex-col items-center justify-center shrink-0 w-[180px]">
                    <div className="w-[100px] h-[100px] rounded-2xl bg-slate-100 overflow-hidden shadow-inner mb-4 ring-4 ring-slate-50 flex items-center justify-center">
                        {initialData.avatarUrl ? (
                            <img src={initialData.avatarUrl} alt={formData.fullName} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-2xl font-black text-[#0B4FEA]">{formData.fullName[0]?.toUpperCase()}</span>
                        )}
                    </div>
                    <h3 className="text-[15px] font-black text-slate-900 text-center leading-tight">{formData.fullName}</h3>
                    <p className="text-[11px] font-medium text-slate-500 text-center mb-4">{formData.jobTitle}</p>
                    <button type="button" className="text-[11px] font-extrabold text-[#0B4FEA] hover:underline hover:text-blue-800 transition-colors tracking-wide">
                        Change Avatar
                    </button>
                </div>

                {/* Inputs Grid */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 content-center">
                    <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest pl-3 mb-2">Full Name</label>
                        <div className="w-full bg-[#f4f6fa] rounded-t-lg border-b-2 border-slate-300 px-4 py-3 group focus-within:border-[#0B4FEA] transition-colors">
                            <input 
                                type="text" 
                                value={formData.fullName} 
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full bg-transparent outline-none text-[14px] font-bold text-slate-900 placeholder:text-slate-400" 
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest pl-3 mb-2">Job Title</label>
                        <div className="w-full bg-[#f4f6fa] rounded-t-lg border-b-2 border-slate-300 px-4 py-3 group focus-within:border-[#0B4FEA] transition-colors">
                            <input 
                                type="text" 
                                value={formData.jobTitle} 
                                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                className="w-full bg-transparent outline-none text-[14px] font-bold text-slate-900 placeholder:text-slate-400" 
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest pl-3 mb-2">Email Address</label>
                        <div className="w-full bg-slate-50 rounded-t-lg border-b-2 border-slate-200 px-4 py-3">
                            <input type="email" value={initialData.email} className="w-full bg-transparent outline-none text-[14px] font-bold text-slate-400 cursor-not-allowed" disabled />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest pl-3 mb-2">Phone Number</label>
                        <div className="w-full bg-[#f4f6fa] rounded-t-lg border-b-2 border-slate-300 px-4 py-3 group focus-within:border-[#0B4FEA] transition-colors">
                            <input 
                                type="tel" 
                                value={formData.phone} 
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full bg-transparent outline-none text-[14px] font-bold text-slate-900 placeholder:text-slate-400" 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
