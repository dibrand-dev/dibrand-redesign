'use client'

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Video, User, Briefcase, FileText, Loader2 } from 'lucide-react';
import { getCandidateNames, getRecruiterJobs, createInterview } from '@/app/ats/actions';

export default function ScheduleInterviewModal({ 
    isOpen, 
    onClose,
    onSuccess 
}: { 
    isOpen: boolean; 
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [candidates, setCandidates] = useState<any[]>([]);
    const [jobs, setJobs] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        candidate_id: '',
        job_id: '',
        recruiter_id: '',
        type: 'Technical',
        scheduled_at: '',
        duration_minutes: 60,
        video_url: '',
        notes: ''
    });

    useEffect(() => {
        if (isOpen) {
            async function loadData() {
                const [cands, jobList] = await Promise.all([
                    getCandidateNames(),
                    getRecruiterJobs()
                ]);
                setCandidates(cands);
                setJobs(jobList);
            }
            loadData();
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createInterview(formData);
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error scheduling interview:', error);
            alert('Failed to schedule interview');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#191C1D]/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[32px] w-full max-w-xl shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="px-8 py-6 border-b border-[#F1F5F9] flex items-center justify-between bg-[#F8FAFC]">
                    <div>
                        <h3 className="text-[20px] font-bold text-[#191C1D]">Schedule New Session</h3>
                        <p className="text-[12px] text-[#737785] font-medium mt-0.5">Define the evaluation details for this candidate.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-xl text-[#A1A5B7] transition-all border border-transparent hover:border-[#E2E8F0] shadow-sm">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        {/* Candidate Selection */}
                        <div className="col-span-2 space-y-2">
                            <label className="text-[11px] font-black text-[#6B7485] uppercase tracking-widest flex items-center gap-2">
                                <User size={14} className="text-[#0040A1]" />
                                Candidate
                            </label>
                            <select 
                                required
                                value={formData.candidate_id}
                                onChange={(e) => setFormData({...formData, candidate_id: e.target.value})}
                                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 px-4 text-[13px] font-medium outline-none focus:border-[#0040A1] transition-all"
                            >
                                <option value="">Select a candidate...</option>
                                {candidates.map(c => (
                                    <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                                ))}
                            </select>
                        </div>

                        {/* Job Position */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-[#6B7485] uppercase tracking-widest flex items-center gap-2">
                                <Briefcase size={14} className="text-[#0040A1]" />
                                Job Position
                            </label>
                            <select 
                                required
                                value={formData.job_id}
                                onChange={(e) => setFormData({...formData, job_id: e.target.value})}
                                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 px-4 text-[13px] font-medium outline-none focus:border-[#0040A1] transition-all"
                            >
                                <option value="">Select job...</option>
                                {jobs.map(j => (
                                    <option key={j.id} value={j.id}>{j.title}</option>
                                ))}
                            </select>
                        </div>

                        {/* Interview Type */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-[#6B7485] uppercase tracking-widest flex items-center gap-2">
                                <FileText size={14} className="text-[#0040A1]" />
                                Session Type
                            </label>
                            <select 
                                required
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 px-4 text-[13px] font-medium outline-none focus:border-[#0040A1] transition-all"
                            >
                                <option value="Technical">Technical</option>
                                <option value="Cultural">Cultural</option>
                                <option value="Final Review">Final Review</option>
                            </select>
                        </div>

                        {/* Date & Time */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-[#6B7485] uppercase tracking-widest flex items-center gap-2">
                                <Calendar size={14} className="text-[#0040A1]" />
                                Date & Time
                            </label>
                            <input 
                                type="datetime-local" 
                                required
                                value={formData.scheduled_at}
                                onChange={(e) => setFormData({...formData, scheduled_at: e.target.value})}
                                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 px-4 text-[13px] font-medium outline-none focus:border-[#0040A1] transition-all"
                            />
                        </div>

                        {/* Video URL */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-[#6B7485] uppercase tracking-widest flex items-center gap-2">
                                <Video size={14} className="text-[#0040A1]" />
                                Video Link
                            </label>
                            <input 
                                type="url" 
                                placeholder="Google Meet / Zoom URL"
                                value={formData.video_url}
                                onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 px-4 text-[13px] font-medium outline-none focus:border-[#0040A1] transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 text-[#737785] font-bold text-[13px] uppercase tracking-widest hover:text-[#191C1D] transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="flex-[2] py-4 bg-[#0040A1] text-white rounded-2xl text-[13px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#003380] transition-all shadow-xl shadow-blue-900/10 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Confirm Schedule'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
