import React from 'react';
import { getAllCandidates } from '../../actions';
import { ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase-server-client';
import Link from 'next/link';
import SearchTalentPredictive from '@/components/ats/SearchTalentPredictive';
import { getCandidateNames } from '@/app/ats/actions';
import CandidatesView from '@/components/ats/CandidatesView';

export default async function AtsCandidatesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const resolvedParams = await searchParams;
    const status = resolvedParams.status as string || undefined;
    const search = resolvedParams.search as string || undefined;
    const jobId = resolvedParams.jobId as string || undefined;
    const page = parseInt(resolvedParams.page as string || '1');
    const limit = 9;
    const offset = (page - 1) * limit;

    const { data: candidates, count: totalCount } = await getAllCandidates({ 
        status, 
        search, 
        jobId, 
        limit, 
        offset 
    });
    
    const candidateNames = await getCandidateNames();
    const totalPages = Math.ceil(totalCount / limit);

    const getPageUrl = (p: number) => {
        const params = new URLSearchParams();
        if (status) params.set('status', status);
        if (search) params.set('search', search);
        if (jobId) params.set('jobId', jobId);
        params.set('page', p.toString());
        return `/ats/candidates?${params.toString()}`;
    };

    return (
        <div className="max-w-[1104px] mx-auto bg-white min-h-screen p-10 shadow-sm border-x border-[#E1E2E5] font-inter">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-[34px] font-bold text-[#010101] leading-tight mb-2 tracking-tight">Talent Pool</h1>
                    <p className="text-[13px] text-[#6B7485] font-medium">Curating the next generation of industry leaders.</p>
                </div>

                <div className="flex items-center gap-3">
                    <SearchTalentPredictive 
                        candidates={candidateNames} 
                        initialQuery={search} 
                    />
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-12 py-6 border-y border-[#F1F5F9]">
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-[#6B7485] uppercase tracking-widest">Job Role</label>
                        <button className="flex items-center gap-8 py-2 px-0 text-[13px] font-bold text-[#010101] border-b-2 border-transparent hover:border-[#0040A1] transition-all">
                            All <ChevronRight size={14} className="rotate-90" />
                        </button>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-[#6B7485] uppercase tracking-widest">Location</label>
                        <button className="flex items-center gap-8 py-2 px-0 text-[13px] font-bold text-[#010101] border-b-2 border-transparent hover:border-[#0040A1] transition-all">
                            All <ChevronRight size={14} className="rotate-90" />
                        </button>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-[#6B7485] uppercase tracking-widest">Application Stage</label>
                        <button className="flex items-center gap-8 py-2 px-0 text-[13px] font-bold text-[#010101] border-b-2 border-transparent hover:border-[#0040A1] transition-all">
                            Any Stage <ChevronRight size={14} className="rotate-90" />
                        </button>
                    </div>
                </div>
                
                <Link href="/ats/candidates" className="text-[11px] font-bold text-[#0040A1] hover:underline uppercase tracking-tight">
                    Clear all filters
                </Link>
            </div>

            <CandidatesView 
                candidates={candidates}
                totalCount={totalCount}
                page={page}
                totalPages={totalPages}
                getPageUrl={getPageUrl}
            />
        </div>
    );
}
