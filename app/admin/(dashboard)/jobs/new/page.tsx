
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { createJob } from '@/app/actions/jobs';
import RichMarkdownEditor from '@/components/admin/RichMarkdownEditor';

export default function NewJobPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        industry: 'SaaS',
        location: '',
        employment_type: 'Full-time',
        description: '',
        requirements: '',
        seniority: 'Senior',
        modality: 'Remoto',
        salary_range: '',
        is_active: true,
    });

    const modalities = ['Remoto', 'Híbrido', 'Presencial'];

    const industries = [
        'Fintech', 'Pharma', 'eCommerce', 'Big Tech', 'Automotive',
        'Energy', 'SaaS', 'Retail', 'Entertainment & Media', 'Other'
    ];

    const seniorities = ['Trainee', 'Junior', 'Semi Senior', 'Senior'];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as any;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createJob(formData);
            router.push('/admin/jobs');
            router.refresh();
        } catch (error: any) {
            alert('Error creating job opening: ' + (error.message || 'Unknown error'));
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <div className="flex items-center gap-4">
                <Link href="/admin/jobs" className="p-2 hover:bg-admin-card-bg rounded-full transition-colors text-admin-text-secondary shadow-sm border border-transparent hover:border-admin-border">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h2 className="text-3xl font-black text-admin-text-primary tracking-tight uppercase">New Job Opening</h2>
                    <p className="text-admin-text-secondary text-sm font-medium italic">Post a new career opportunity at Dibrand.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-admin-card-bg rounded-2xl shadow-sm border border-admin-border p-8 space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Job Title</label>
                            <input
                                required
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Senior React Developer"
                                className="w-full px-4 py-3 bg-admin-bg border border-admin-border rounded-xl focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent outline-none transition-all shadow-sm text-admin-text-primary font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Seniority</label>
                            <select
                                name="seniority"
                                value={formData.seniority}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-admin-bg border border-admin-border rounded-xl focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent outline-none transition-all shadow-sm text-admin-text-primary font-bold appearance-none"
                            >
                                {seniorities.map(s => <option key={s} value={s} className="bg-admin-card-bg">{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Industry</label>
                            <select
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-admin-bg border border-admin-border rounded-xl focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent outline-none transition-all shadow-sm text-admin-text-primary font-bold appearance-none"
                            >
                                {industries.map(i => <option key={i} value={i} className="bg-admin-card-bg">{i}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Location</label>
                            <input
                                required
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g. Remote - LatAm"
                                className="w-full px-4 py-3 bg-admin-bg border border-admin-border rounded-xl focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent outline-none transition-all shadow-sm text-admin-text-primary font-medium"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Employment Type</label>
                            <select
                                name="employment_type"
                                value={formData.employment_type}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-admin-bg border border-admin-border rounded-xl focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent outline-none transition-all shadow-sm text-admin-text-primary font-bold appearance-none"
                            >
                                <option value="Full-time" className="bg-admin-card-bg">Full-time</option>
                                <option value="Part-time" className="bg-admin-card-bg">Part-time</option>
                                <option value="Contractor" className="bg-admin-card-bg">Contractor</option>
                                <option value="Freelance" className="bg-admin-card-bg">Freelance</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Modality</label>
                            <select
                                name="modality"
                                value={formData.modality}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-admin-bg border border-admin-border rounded-xl focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent outline-none transition-all shadow-sm text-admin-text-primary font-bold appearance-none"
                            >
                                {modalities.map(m => <option key={m} value={m} className="bg-admin-card-bg">{m}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Salary Range <span className="text-[8px] opacity-60">(Internal Only)</span></label>
                                <span className="text-[8px] text-admin-accent font-black uppercase tracking-[0.2em] bg-admin-accent/10 px-2 py-0.5 rounded">Confidential</span>
                            </div>
                            <input
                                type="text"
                                name="salary_range"
                                value={formData.salary_range}
                                onChange={handleChange}
                                placeholder="e.g. $4000 - $6000 USD"
                                className="w-full px-4 py-3 bg-admin-bg border border-admin-accent/20 rounded-xl focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent outline-none transition-all shadow-sm text-admin-text-primary font-bold placeholder:text-gray-500/30"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <RichMarkdownEditor
                            label="Job Description"
                            value={formData.description}
                            onChange={(val) => setFormData(prev => ({ ...prev, description: val }))}
                            placeholder="Describe the role... Use the toolbar for bold, lists, and alignment."
                        />
                    </div>

                    <div className="space-y-4">
                        <RichMarkdownEditor
                            label="Requirements"
                            value={formData.requirements}
                            onChange={(val) => setFormData(prev => ({ ...prev, requirements: val }))}
                            placeholder="List the required skills... Use the toolbar for lists."
                        />
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-admin-bg rounded-xl border border-admin-border">
                        <input
                            type="checkbox"
                            id="is_active"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleChange}
                            className="w-5 h-5 text-admin-accent border-admin-border rounded focus:ring-admin-accent transition-all cursor-pointer"
                        />
                        <label htmlFor="is_active" className="text-sm font-bold text-admin-text-primary select-none cursor-pointer">
                            Active (Search published)
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pb-12">
                    <Link
                        href="/admin/jobs"
                        className="px-6 py-3 border border-admin-border text-admin-text-secondary rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-admin-card-bg transition-all shadow-sm"
                    >
                        Cancel
                    </Link>
                    <button
                        disabled={loading}
                        type="submit"
                        className="inline-flex items-center gap-2 px-10 py-3 bg-admin-accent text-white rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-admin-accent/25 transform active:scale-95"
                    >
                        {loading ? (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save size={16} />
                        )}
                        <span>{loading ? 'Posting...' : 'Post Job Opening'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
