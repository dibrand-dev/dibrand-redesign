
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
                    <h2 className="text-2xl font-bold text-corporate-grey">Job Openings</h2>
                    <p className="text-gray-500">Manage your active recruitment searches.</p>
                </div>
                <Link
                    href="/admin/jobs/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#D83484] to-[#A3369D] text-white rounded-lg font-medium hover:opacity-90 transition-opacity shadow-md"
                >
                    <Plus size={18} />
                    <span>New Job Opening</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">Loading jobs...</div>
                ) : jobs.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        No job openings found. Post your first search!
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Position / Industry</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location / Type</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {jobs.map((job) => (
                                    <tr key={job.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-corporate-grey">{job.title}</div>
                                            <div className="text-sm text-gray-500">{job.industry}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                <MapPin size={14} className="text-gray-400" />
                                                {job.location}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-0.5">{job.employment_type}</div>
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
                                                    className="p-2 text-gray-400 hover:text-primary transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(job.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
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
