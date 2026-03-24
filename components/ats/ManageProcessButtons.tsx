'use client'

import React, { useState } from 'react';
import { UserPlus, XCircle, MoreVertical, Loader2, CheckCircle2 } from 'lucide-react';
import { updateCandidateStatus } from '@/app/ats/actions';
import { useRouter } from 'next/navigation';

export default function ManageProcessButtons({ candidateId, currentStatus }: { candidateId: string, currentStatus: string }) {
    const [isUpdating, setIsUpdating] = useState<'advance' | 'reject' | null>(null);
    const router = useRouter();

    const stages = ['New', 'Applied', 'Screening', 'Interview', 'Cultural Fit', 'Final Round', 'Offered', 'Hired'];
    const currentIndex = stages.indexOf(currentStatus);
    const nextStatus = currentIndex < stages.length - 1 ? stages[currentIndex + 1] : null;

    const handleUpdate = async (type: 'advance' | 'reject') => {
        setIsUpdating(type);
        try {
            const statusToSet = type === 'reject' ? 'Rejected' : (nextStatus || 'Hired');
            await updateCandidateStatus(candidateId, statusToSet);
            router.refresh();
        } catch (error) {
            console.error('Failed to update stage:', error);
            alert('Error updating stage. Please try again.');
        } finally {
            setIsUpdating(null);
        }
    };

    const isHired = currentStatus === 'Hired';
    const isRejected = currentStatus === 'Rejected';

    return (
        <div className="bg-white rounded-[16px] p-8 border border-[#E1E2E5] shadow-sm space-y-4">
            <h4 className="text-[11px] font-black text-[#6B7485] uppercase tracking-[0.2em] mb-4">Manage Process</h4>
            
            {!isHired && !isRejected && nextStatus && (
                <button 
                    onClick={() => handleUpdate('advance')}
                    disabled={isUpdating !== null}
                    className="w-full py-4 bg-[#DAE2FF] text-[#001D49] rounded-xl text-[13px] font-bold flex items-center justify-center gap-3 hover:bg-[#C9D6FF] transition-all disabled:opacity-50 group"
                >
                    {isUpdating === 'advance' ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} className="group-hover:scale-110 transition-transform" />} 
                    Advance to {nextStatus}
                </button>
            )}

            {!isRejected && (
                <button 
                    onClick={() => handleUpdate('reject')}
                    disabled={isUpdating !== null}
                    className="w-full py-4 bg-[#FFDAD6] text-[#BA1A1A] rounded-xl text-[13px] font-bold flex items-center justify-center gap-3 hover:bg-[#FFC9C4] transition-all disabled:opacity-50 group"
                >
                    {isUpdating === 'reject' ? <Loader2 size={18} className="animate-spin" /> : <XCircle size={18} className="group-hover:scale-110 transition-transform" />} 
                    Reject Candidate
                </button>
            )}

            {(isHired || isRejected) && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${isHired ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {isHired ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    <span className="text-[13px] font-bold">Candidate is {currentStatus}</span>
                </div>
            )}

            <button className="w-full py-4 bg-white border border-[#E1E2E5] text-[#191C1D] rounded-xl text-[13px] font-bold flex items-center justify-center gap-3 hover:bg-[#F8FAFC] transition-all active:scale-[0.98]">
                <MoreVertical size={18} /> Other Actions
            </button>
        </div>
    );
}
