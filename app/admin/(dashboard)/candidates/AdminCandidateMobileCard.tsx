'use client';

import React from 'react';
import Link from 'next/link';
import { Briefcase, MapPin, ExternalLink, MoreVertical } from 'lucide-react';
import StatusSelector from './StatusSelector';
import DeleteCandidateButton from './DeleteCandidateButton';

export default function AdminCandidateMobileCard({ candidate }: { candidate: any }) {
    return (
        <div className="bg-white rounded-xl border border-admin-border p-4 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-admin-bg border border-admin-border flex items-center justify-center text-admin-accent font-black text-lg uppercase shadow-inner">
                        {candidate.full_name?.charAt(0)}
                    </div>
                    <div>
                        <Link href={`/admin/candidates/${candidate.id}`} className="font-bold text-admin-text-primary text-base">
                            {candidate.full_name}
                        </Link>
                        <div className="text-[11px] text-admin-text-secondary font-medium italic">{candidate.email}</div>
                    </div>
                </div>
                <div className="flex gap-1">
                    <Link
                        href={`/admin/candidates/${candidate.id}`}
                        className="p-2 text-gray-400 hover:text-admin-accent transition-all"
                    >
                        <ExternalLink size={18} />
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-2">
                <div className="flex items-start gap-2">
                    <Briefcase size={16} className="text-gray-400 mt-0.5 shrink-0" />
                    <div className="text-sm font-bold text-admin-text-primary leading-tight">
                        {candidate.job?.title || 'General Application'}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400 shrink-0" />
                    <div className="text-[11px] text-admin-text-secondary font-bold uppercase tracking-wider italic">
                        {candidate.country}, {candidate.state_province}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
                {candidate.stack_names?.map((name: string) => (
                    <span key={name} className="px-2 py-0.5 bg-admin-bg text-admin-text-secondary rounded border border-admin-border text-[10px] font-black uppercase tracking-widest">
                        {name}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-admin-border">
                <StatusSelector candidateId={candidate.id} currentStatus={candidate.status} />
                <DeleteCandidateButton 
                    candidateId={candidate.id} 
                    candidateName={candidate.full_name} 
                />
            </div>
        </div>
    );
}
