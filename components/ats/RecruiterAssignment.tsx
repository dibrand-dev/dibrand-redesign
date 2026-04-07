'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { assignRecruiter } from '@/app/ats/actions';
import { Check, ChevronDown, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { capitalizeName } from '@/lib/utils';
import clsx from 'clsx';

interface Recruiter {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string | null;
}

interface RecruiterAssignmentProps {
    candidateId: string;
    currentRecruiterId: string | null;
    currentRecruiterName: string | null;
    currentRecruiterAvatar: string | null;
    allRecruiters: Recruiter[];
    isAdmin: boolean;
}

export default function RecruiterAssignment({
    candidateId,
    currentRecruiterId,
    currentRecruiterName,
    currentRecruiterAvatar,
    allRecruiters,
    isAdmin
}: RecruiterAssignmentProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleAssign = async (recruiterId: string, recruiterName: string) => {
        if (recruiterId === currentRecruiterId) {
            setIsOpen(false);
            return;
        }

        setIsSaving(true);
        try {
            await assignRecruiter(candidateId, recruiterId);
            toast.success(`Candidato reasignado a ${capitalizeName(recruiterName)}`);
            setIsOpen(false);
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || 'Error al reasignar reclutador');
        } finally {
            setIsSaving(false);
        }
    };

    const getInitials = (name: string) => {
        if (!name || name === 'Sin asignar') return 'SA';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    // Soft random bg colors based on name length/chars for consistent UI layout
    const getAvatarColor = (name: string) => {
        if (!name || name === 'Sin asignar') return 'bg-slate-300 text-slate-600';
        const colors = [
            'bg-blue-100 text-blue-700',
            'bg-emerald-100 text-emerald-700',
            'bg-purple-100 text-purple-700',
            'bg-amber-100 text-amber-700',
            'bg-rose-100 text-rose-700',
            'bg-cyan-100 text-cyan-700'
        ];
        const index = name.length % colors.length;
        return colors[index];
    };

    const displayName = currentRecruiterName ? capitalizeName(currentRecruiterName) : 'Sin asignar';
    const initAvatarCol = currentRecruiterAvatar ? '' : getAvatarColor(displayName);

    return (
        <div className="bg-white rounded-[20px] shadow-sm border border-slate-200/60 p-6 font-outfit relative">
            <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-5">
                Reclutador Asignado
            </h3>

            {isAdmin ? (
                <div className="relative">
                    <button 
                        onClick={() => setIsOpen(!isOpen)}
                        disabled={isSaving}
                        className="w-full flex items-center justify-between gap-4 bg-[#F8FAFC] hover:bg-slate-100 p-2 pl-3 pr-4 rounded-full border border-slate-200 transition-colors text-left group"
                    >
                        <div className="flex items-center gap-3">
                            {currentRecruiterAvatar ? (
                                <img src={currentRecruiterAvatar} alt={displayName} className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
                            ) : (
                                <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] ring-2 ring-white shadow-sm", initAvatarCol)}>
                                    {getInitials(displayName)}
                                </div>
                            )}
                            <div className="min-w-0">
                                <p className="text-[13px] font-bold text-slate-900 leading-tight truncate">
                                    {displayName}
                                </p>
                            </div>
                        </div>
                        {isSaving ? (
                            <Loader2 size={14} className="text-slate-400 animate-spin shrink-0" />
                        ) : (
                            <ChevronDown size={14} className={clsx("text-slate-400 shrink-0 transition-transform", isOpen && "rotate-180")} />
                        )}
                    </button>

                    {isOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto custom-scrollbar p-2">
                            <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase p-3 pb-2">
                                Reasignar a...
                            </div>
                            {allRecruiters.map(recruiter => (
                                <button
                                    key={recruiter.id}
                                    onClick={() => handleAssign(recruiter.id, recruiter.full_name)}
                                    className="w-full flex items-center justify-between gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        {recruiter.avatar_url ? (
                                            <img src={recruiter.avatar_url} alt={recruiter.full_name} className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                                        ) : (
                                            <div className={clsx("w-7 h-7 rounded-full flex items-center justify-center font-bold text-[9px]", getAvatarColor(recruiter.full_name))}>
                                                {getInitials(recruiter.full_name)}
                                            </div>
                                        )}
                                        <p className="text-[12px] font-bold text-slate-700">
                                            {capitalizeName(recruiter.full_name)}
                                        </p>
                                    </div>
                                    {recruiter.id === currentRecruiterId && (
                                        <Check size={14} className="text-[#0B4FEA] mr-2 shrink-0" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex items-center gap-3 bg-[#F8FAFC] p-2 pl-3 pr-4 rounded-full border border-slate-100 w-full">
                    {currentRecruiterAvatar ? (
                        <img src={currentRecruiterAvatar} alt={displayName} className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
                    ) : (
                        <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] ring-2 ring-white shadow-sm", initAvatarCol)}>
                            {getInitials(displayName)}
                        </div>
                    )}
                    <div className="min-w-0">
                        <p className="text-[13px] font-bold text-slate-900 leading-tight truncate">
                            {displayName}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
