'use client';

import React from 'react';
import { Linkedin, FileText, Phone, Mail, MapPin, User, ChevronRight } from 'lucide-react';
import { Candidate } from '@/app/ats/types';
import Link from 'next/link';
import { capitalizeName, getInitials } from '@/lib/utils';
import { getMacroConfig } from '@/lib/ats-constants';

import StagePill from './StagePill';

interface Props {
  candidate: Candidate;
}

const CandidateCardProMax: React.FC<Props> = ({ candidate }) => {
  const macro = getMacroConfig(candidate.status);

  return (
    <div className="bg-white border border-[#E1E2E5] rounded-[12px] p-6 hover:shadow-lg transition-all flex flex-col h-full font-inter relative group">
      {/* Status Badge - Top Right - Sub Stage */}
      <div className="absolute top-6 right-6">
        <StagePill status={candidate.status} />
      </div>

      {/* Header: Avatar + Info */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-[#EBF1FF] border border-[#D0DFFF] flex items-center justify-center text-[#0040A1] font-bold text-xl shrink-0 overflow-hidden">
          {candidate.avatar_url ? (
            <img src={candidate.avatar_url} alt={candidate.full_name} className="w-full h-full object-cover" />
          ) : (
            getInitials(candidate.full_name, candidate.first_name, candidate.last_name)
          )}
        </div>
      </div>

      <div className="mb-6">
        <Link href={`/ats/candidates/${candidate.id}`}>
          <h3 className="text-[18px] font-bold text-[#010101] mb-1 leading-tight group-hover:text-[#0040A1] transition-colors cursor-pointer">
            {capitalizeName(candidate.full_name)}
          </h3>
        </Link>
        <p className="text-[13px] text-[#6B7485] font-medium leading-none mb-2">{candidate.position}</p>
        <div className="flex items-center gap-1.5 text-[11px] text-[#6B7485] font-bold uppercase tracking-widest">
            <MapPin size={12} className="shrink-0" />
            {candidate.country ? capitalizeName(candidate.country) : 'N/A'}
        </div>
      </div>

      {/* Active Application Stage Box */}
      <div className="bg-[#FBFCFD] border border-[#E1E2E5] rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-[#6B7485] uppercase tracking-widest">Active Application</span>
            <span className="text-[10px] font-bold text-[#6B7485] uppercase tracking-widest">Stage</span>
        </div>
        <div className="flex justify-between items-baseline">
            <p className="text-[12px] font-bold text-[#010101] truncate pr-2">{candidate.position}</p>
            <StagePill status={candidate.status} label={macro.label} className="!text-[8px] !px-2 !py-0" />
        </div>
      </div>

      {/* Action Bar */}
      <div className="mt-auto flex items-center justify-between pt-4 border-t border-[#F1F5F9]">
         <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#DAE2FF] flex items-center justify-center text-[#0040A1] text-[10px] font-bold">JD</div>
            <div className="w-7 h-7 rounded-lg bg-[#EADDFF] flex items-center justify-center text-[#21005D] text-[10px] font-bold">MK</div>
         </div>
         <Link href={`/ats/candidates/${candidate.id}`}>
            <span className="flex items-center gap-1.5 text-[12px] font-extrabold text-[#0040A1] hover:underline uppercase tracking-tight cursor-pointer">
                View Profile <ChevronRight size={14} className="stroke-[3px]" />
            </span>
         </Link>
      </div>
    </div>
  );
};

export default CandidateCardProMax;
