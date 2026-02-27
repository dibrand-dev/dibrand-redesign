
'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { getJob, updateJob, deleteJob } from '@/app/actions/jobs';
import RichMarkdownEditor from '@/components/admin/RichMarkdownEditor';

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        industry: '',
        location: '',
        employment_type: 'Full-time',
        description: '',
        requirements: '',
        seniority: '',
        modality: '',
        salary_range: '',
        is_active: true,
    });

    const modalities = ['Remoto', 'Híbrido', 'Presencial'];

    const industries = [
        'Fintech', 'Pharma', 'eCommerce', 'Big Tech', 'Automotive',
        'Energy', 'SaaS', 'Retail', 'Entertainment & Media', 'Other'
    ];

    const seniorities = ['Trainee', 'Junior', 'Semi Senior', 'Senior'];

    useEffect(() => {
        fetchJob();
    }, [id]);

    async function fetchJob() {
        try {
            const data = await getJob(id);
            if (data) {
                setFormData({
                    title: data.title,
                    industry: data.industry || data.department || '',
                    location: data.location,
                    employment_type: data.employment_type,
                    description: data.description,
                    requirements: data.requirements,
                    seniority: data.seniority || '',
                    modality: data.modality || 'Remoto',
                    salary_range: data.salary_range || '',
                    is_active: data.is_active,
                });
            }
        } catch (error: any) {
            alert('Error fetching job opening: ' + (error.message || 'Unknown error'));
            router.push('/admin/jobs');
        }
        setLoading(false);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as any;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            await updateJob(id, formData);
            router.push('/admin/jobs');
            router.refresh();
        } catch (error: any) {
            alert('Error updating job opening: ' + (error.message || 'Unknown error'));
            setSaving(false);
        }
    };

    const handleDeleteJob = async () => {
        if (!confirm('Are you sure you want to delete this job opening?')) return;

        setSaving(true);
        try {
            await deleteJob(id);
            router.push('/admin/jobs');
            router.refresh();
        } catch (error: any) {
            alert('Error deleting job opening: ' + (error.message || 'Unknown error'));
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading job opening...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/jobs" className="p-2 hover:bg-white rounded-full transition-colors text-gray-500 shadow-sm border border-transparent hover:border-gray-300">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-corporate-grey">Edit Job Opening</h2>
                        <p className="text-gray-500">Update the career opportunity details.</p>
                    </div>
                </div>
                <button
                    onClick={handleDeleteJob}
                    className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100 flex items-center gap-2"
                >
                    <Trash2 size={18} />
                    <span className="font-semibold text-sm">Delete Job</span>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Job Title</label>
                            <input
                                required
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Seniority</label>
                            <select
                                name="seniority"
                                value={formData.seniority}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm bg-white"
                            >
                                {seniorities.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Industry</label>
                            <select
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm bg-white"
                            >
                                {industries.map(i => <option key={i} value={i}>{i}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Location</label>
                            <input
                                required
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Employment Type</label>
                            <select
                                name="employment_type"
                                value={formData.employment_type}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm bg-white"
                            >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contractor">Contractor</option>
                                <option value="Freelance">Freelance</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Modality</label>
                            <select
                                name="modality"
                                value={formData.modality}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm bg-white"
                            >
                                {modalities.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-semibold text-gray-700 font-outfit">Salary Range (Internal Only)</label>
                                <span className="text-[10px] text-fuchsia-500 font-bold uppercase tracking-widest">Confidential</span>
                            </div>
                            <input
                                type="text"
                                name="salary_range"
                                value={formData.salary_range}
                                onChange={handleChange}
                                placeholder="e.g. $4000 - $6000 USD"
                                className="w-full px-4 py-2 border border-fuchsia-100 bg-fuchsia-50/30 rounded-lg focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 outline-none transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <RichMarkdownEditor
                            label="Job Description"
                            value={formData.description}
                            onChange={(val) => setFormData(prev => ({ ...prev, description: val }))}
                            placeholder="Update the job description... Use the toolbar for formatting."
                        />
                    </div>

                    <div className="space-y-4">
                        <RichMarkdownEditor
                            label="Requirements"
                            value={formData.requirements}
                            onChange={(val) => setFormData(prev => ({ ...prev, requirements: val }))}
                            placeholder="Update the requirements..."
                        />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleChange}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <label htmlFor="is_active" className="text-sm font-medium text-gray-700 select-none">
                            Active (Search published)
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Link
                        href="/admin/jobs"
                        className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        Cancel
                    </Link>
                    <button
                        disabled={saving}
                        type="submit"
                        className="inline-flex items-center gap-2 px-8 py-2.5 bg-gradient-to-r from-[#D83484] to-[#A3369D] text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition-all shadow-md transform active:scale-95"
                    >
                        {saving ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save size={18} />
                        )}
                        <span>{saving ? 'Updating...' : 'Update Job Opening'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
