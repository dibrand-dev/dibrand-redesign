'use client';

import React, { useState } from 'react';
import { updateCandidateStatus } from '@/app/ats/actions';
import { ChevronDown, Loader2, XCircle } from 'lucide-react';

interface Stage {
    label: string;
    key: string[];
}

interface CandidateProcessActionsProps {
    candidateId: string;
    currentStatus: string;
    stages: Stage[];
}

export default function CandidateProcessActions({ candidateId, currentStatus, stages }: CandidateProcessActionsProps) {
    const [status, setStatus] = useState(currentStatus);
    const [updating, setUpdating] = useState(false);
    const [rejecting, setRejecting] = useState(false);

    const handleStatusChange = async (newStatus: string) => {
        setUpdating(true);
        try {
            await updateCandidateStatus(candidateId, newStatus);
            setStatus(newStatus);
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setUpdating(false);
        }
    };

    const handleReject = async () => {
        setRejecting(true);
        try {
            await updateCandidateStatus(candidateId, 'Rejected');
            setStatus('Rejected');
        } catch (error) {
            console.error('Error rejecting candidate:', error);
        } finally {
            setRejecting(false);
        }
    };

    return (
        <section className="bg-white rounded-[12px] p-8 border border-[#E2E8F0] shadow-sm">
            <h3 className="text-[11px] font-black text-[#6B7485] uppercase tracking-[0.2em] mb-8">Process Actions</h3>
            <div className="space-y-4">
                {/* Status Dropdown */}
                <div className="relative">
                    <label className="text-[10px] font-bold text-[#A1A5B7] uppercase tracking-widest mb-1.5 block">Pipeline Stage</label>
                    <div className="relative">
                        <select 
                            value={status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            disabled={updating || rejecting}
                            className="w-full h-[56px] pl-5 pr-12 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl text-[14px] font-bold text-[#191C1D] appearance-none focus:outline-none focus:border-[#0040A1] transition-all disabled:opacity-50"
                        >
                            {stages.map(s => (
                                <option key={s.label} value={s.key[0]}>{s.label}</option>
                            ))}
                            <option value="Rejected">REJECTED</option>
                            <option value="Withdrawn">WITHDRAWN</option>
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#737785]">
                            {updating ? <Loader2 size={18} className="animate-spin text-[#0040A1]" /> : <ChevronDown size={18} />}
                        </div>
                    </div>
                </div>

                <div className="h-px bg-[#F1F5F9] my-4" />

                {/* Reject Button (Fixed) */}
                <button 
                    onClick={handleReject}
                    disabled={updating || rejecting || status === 'Rejected'}
                    className={`w-full py-4 rounded-2xl text-[14px] font-bold transition-all flex items-center justify-center gap-3 ${
                        status === 'Rejected' 
                        ? 'bg-[#F1F5F9] text-[#737785] cursor-not-allowed' 
                        : 'bg-white text-[#BA1A1A] border-2 border-[#FFDAD6] hover:bg-[#FFF8F7] active:scale-98'
                    }`}
                >
                    {rejecting ? <Loader2 size={18} className="animate-spin" /> : <XCircle size={18} />}
                    {status === 'Rejected' ? 'Candidate Rejected' : 'Reject Candidate'}
                </button>
            </div>
        </section>
    );
}
