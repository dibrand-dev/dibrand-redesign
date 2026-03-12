
'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { getJob, updateJob, deleteJob } from '@/app/actions/jobs';
import JobOpeningForm from '../JobOpeningForm';

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchJob() {
            try {
                const data = await getJob(id);
                setJob(data);
            } catch (error) {
                console.error('Error fetching job:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchJob();
    }, [id]);

    if (loading) return (
        <div className="p-20 text-center animate-pulse">
            <div className="w-12 h-12 border-4 border-admin-accent/20 border-t-admin-accent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-admin-text-secondary font-bold text-xs uppercase tracking-widest">Cargando vacante...</p>
        </div>
    );

    return <JobOpeningForm initialData={job} />;
}
