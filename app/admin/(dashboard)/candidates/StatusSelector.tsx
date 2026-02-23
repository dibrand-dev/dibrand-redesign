'use client'

import { useState } from 'react';
import { updateCandidateStatus } from './actions';
import { RefreshCcw } from 'lucide-react';

export default function StatusSelector({ candidateId, currentStatus }: { candidateId: string, currentStatus: string }) {
    const [loading, setLoading] = useState(false);

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        if (newStatus === currentStatus) return;

        setLoading(true);
        try {
            await updateCandidateStatus(candidateId, newStatus);
        } catch (error) {
            alert('Error actualizando estado');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative w-full">
            <select
                defaultValue={currentStatus}
                onChange={handleChange}
                disabled={loading}
                className="w-full text-sm font-bold border-gray-200 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 bg-white cursor-pointer disabled:opacity-50 appearance-none pr-10 text-corporate-grey transition-all"
            >
                <option value="New">New</option>
                <option value="Screening">Screening</option>
                <option value="Interview">Interview</option>
                <option value="Offered">Offered</option>
                <option value="Rejected">Rejected</option>
            </select>
            {loading ? (
                <RefreshCcw size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-primary animate-spin" />
            ) : (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            )}
        </div>
    );
}
