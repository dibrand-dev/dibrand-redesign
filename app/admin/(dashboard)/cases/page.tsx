
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { getCaseStudies, toggleCaseStatus, deleteCaseStudy } from '@/app/actions/cases';

interface CaseStudy {
    id: string;
    title: string;
    client_name: string;
    is_published: boolean;
    created_at: string;
}

export default function CasesPage() {
    const [cases, setCases] = useState<CaseStudy[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCases();
    }, []);

    async function fetchCases() {
        setLoading(true);
        try {
            const data = await getCaseStudies();
            setCases(data || []);
        } catch (error) {
            console.error('Error fetching cases:', error);
        }
        setLoading(false);
    }

    async function handleToggle(id: string, currentStatus: boolean) {
        try {
            await toggleCaseStatus(id, currentStatus);
            fetchCases();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this case study?')) return;
        try {
            await deleteCaseStudy(id);
            fetchCases();
        } catch (error) {
            console.error('Error deleting case:', error);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-admin-text-primary tracking-tight">Success Stories</h2>
                    <p className="text-admin-text-secondary text-sm mt-1 font-medium italic">Manage your portfolio projects and case studies.</p>
                </div>
                <Link
                    href="/admin/cases/new"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-admin-accent text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-admin-accent/20 active:scale-95"
                >
                    <Plus size={18} />
                    <span>New Case Study</span>
                </Link>
            </div>

            <div className="bg-admin-card-bg rounded-xl shadow-sm border border-admin-border overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-admin-text-secondary italic">Loading cases...</div>
                ) : cases.length === 0 ? (
                    <div className="p-12 text-center text-admin-text-secondary italic">
                        No case studies found. Create your first one!
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-admin-bg/50 border-b border-admin-border">
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Project / Client</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Created</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {cases.map((item) => (
                                    <tr key={item.id} className="hover:bg-admin-bg/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-admin-text-primary group-hover:text-admin-accent transition-colors">{item.title}</div>
                                            <div className="text-[11px] text-admin-text-secondary font-medium">{item.client_name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggle(item.id, item.is_published)}
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${item.is_published
                                                    ? 'bg-emerald-100 text-emerald-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                {item.is_published ? 'Published' : 'Draft'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 text-right">
                                                <Link
                                                    href={`/admin/cases/${item.id}`}
                                                    className="p-2 text-gray-400 hover:text-admin-accent hover:bg-admin-accent/5 rounded-xl transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
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
