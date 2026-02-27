
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { createJob } from '@/app/actions/jobs';

export default function NewJobPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        department: '',
        location: '',
        employment_type: 'Full-time',
        description: '',
        requirements: '',
        seniority: '',
        is_active: true,
    });

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
                <Link href="/admin/jobs" className="p-2 hover:bg-white rounded-full transition-colors text-gray-500 shadow-sm border border-transparent hover:border-gray-300">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-corporate-grey">New Job Opening</h2>
                    <p className="text-gray-500">Post a new career opportunity at Dibrand.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Seniority</label>
                            <input
                                required
                                type="text"
                                name="seniority"
                                value={formData.seniority || ''}
                                onChange={handleChange}
                                placeholder="e.g. Senior / Lead"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Job Title</label>
                            <input
                                required
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Senior React Developer"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Department</label>
                            <input
                                required
                                type="text"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                placeholder="e.g. Engineering"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Location</label>
                            <input
                                required
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g. Remote - LatAm"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                            />
                        </div>
                    </div>

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
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-semibold text-gray-700">Job Description</label>
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Markdown Supported</span>
                        </div>
                        <textarea
                            required
                            name="description"
                            rows={8}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the role... Use **bold** and *italics*. Use - for lists."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm font-mono text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-semibold text-gray-700">Requirements</label>
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Markdown Supported</span>
                        </div>
                        <textarea
                            required
                            name="requirements"
                            rows={8}
                            value={formData.requirements}
                            onChange={handleChange}
                            placeholder="List the required skills... Use - for lists."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm font-mono text-sm"
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
                        disabled={loading}
                        type="submit"
                        className="inline-flex items-center gap-2 px-8 py-2.5 bg-gradient-to-r from-[#D83484] to-[#A3369D] text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition-all shadow-md transform active:scale-95"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save size={18} />
                        )}
                        <span>{loading ? 'Posting...' : 'Post Job Opening'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
