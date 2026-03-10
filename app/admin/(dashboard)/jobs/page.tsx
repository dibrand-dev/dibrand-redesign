
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Briefcase, MapPin } from 'lucide-react';
import { getJobs, toggleJobStatus, deleteJob } from '@/app/actions/jobs';

interface JobOpening {
    id: string;
    title: string;
    industry: string;
    location: string;
    employment_type: string;
    modality: string;
    is_active: boolean;
    created_at: string;
}

export default function JobsPage() {
    const [jobs, setJobs] = useState<JobOpening[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
    }, []);

    async function fetchJobs() {
        setLoading(true);
        try {
            const data = await getJobs();
            setJobs(data || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
        setLoading(false);
    }

    async function handleToggle(id: string, currentStatus: boolean) {
        try {
            await toggleJobStatus(id, currentStatus);
            fetchJobs();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this job opening?')) return;
        try {
            await deleteJob(id);
            fetchJobs();
        } catch (error) {
            console.error('Error deleting job:', error);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-admin-text-primary tracking-tight">Job Openings</h2>
                    <p className="text-admin-text-secondary text-sm mt-1 font-medium italic">Manage your active recruitment searches.</p>
                </div>
                <Link
                    href="/admin/jobs/new"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-admin-accent text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-admin-accent/20 active:scale-95"
                >
                    <Plus size={18} />
                    <span>New Job Opening</span>
                </Link>
            </div>

            <div className="bg-admin-card-bg rounded-xl shadow-sm border border-admin-border overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-admin-text-secondary italic">Loading jobs...</div>
                ) : jobs.length === 0 ? (
                    <div className="p-12 text-center text-admin-text-secondary italic">
                        No job openings found. Post your first search!
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-admin-bg/50 border-b border-admin-border">
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Position / Industry</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Location / Type</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {jobs.map((job) => (
                                    <tr key={job.id} className="hover:bg-admin-bg/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-admin-text-primary group-hover:text-admin-accent transition-colors">{job.title}</div>
                                            <div className="text-[11px] text-admin-text-secondary font-medium">{job.industry}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-sm text-admin-text-secondary">
                                                <MapPin size={14} className="text-gray-400" />
                                                {job.location}
                                            </div>
                                            <div className="text-[10px] text-gray-400 font-medium uppercase mt-0.5 tracking-wider">{job.employment_type}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggle(job.id, job.is_active)}
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${job.is_active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-orange-100 text-orange-800'
                                                    }`}
                                            >
                                                {job.is_active ? 'Active' : 'Paused'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/admin/jobs/${job.id}`}
                                                    className="p-2 text-gray-400 hover:text-admin-accent hover:bg-admin-accent/5 rounded-xl transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(job.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
