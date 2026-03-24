import React from 'react';
import { getAllCandidates } from '../../actions';
import { Search, Plus, Filter, Users, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase-server-client';
import Link from 'next/link';
import CandidateCardProMax from '@/components/ats/CandidateCardProMax';
import { Candidate } from '@/app/ats/types';
import SearchTalentPredictive from '@/components/ats/SearchTalentPredictive';
import { getCandidateNames } from '@/app/ats/actions';

export default async function AtsCandidatesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const resolvedParams = await searchParams;
    const status = resolvedParams.status as string || undefined;
    const search = resolvedParams.search as string || undefined;
    const jobId = resolvedParams.jobId as string || undefined;
    const page = parseInt(resolvedParams.page as string || '1');
    const limit = 9;
    const offset = (page - 1) * limit;

    const supabaseAuth = await createClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();
    
    // Call getAllCandidates which now returns { data, count }
    const { data: candidates, count: totalCount } = await getAllCandidates({ 
        status, 
        search, 
        jobId, 
        limit, 
        offset 
    });
    
    const candidateNames = await getCandidateNames();
    const totalPages = Math.ceil(totalCount / limit);

    // Build base URL for pagination
    const getPageUrl = (p: number) => {
        const params = new URLSearchParams();
        if (status) params.set('status', status);
        if (search) params.set('search', search);
        if (jobId) params.set('jobId', jobId);
        params.set('page', p.toString());
        return `/ats/candidates?${params.toString()}`;
    };

    return (
        <div className="max-w-[1104px] mx-auto bg-white min-h-screen p-10 shadow-sm border-x border-[#E1E2E5]">
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

            {/* Candidate Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12 min-h-[400px]">
                {/* New Potential Card FIRST */}
                <div className="bg-[#FBFCFD] border-2 border-dashed border-[#E1E2E5] rounded-[16px] flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:border-[#0040A1] hover:bg-white transition-all order-first">
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#E1E2E5] flex items-center justify-center text-[#6B7485] mb-4 group-hover:scale-110 transition-transform">
                        <Plus size={24} />
                    </div>
                    <h4 className="text-[15px] font-bold text-[#010101] mb-2">New Potential</h4>
                    <p className="text-[12px] text-[#6B7485] max-w-[180px]">Manually add a high-priority candidate to the pool.</p>
                </div>

                {candidates.length > 0 ? (
                    candidates.map((candidate: any) => (
                        <CandidateCardProMax 
                            key={candidate.id} 
                            candidate={{
                                id: candidate.id,
                                full_name: candidate.full_name || `${candidate.first_name} ${candidate.last_name}`,
                                position: candidate.position || candidate.job?.title || 'General App',
                                status: candidate.status || 'Applied',
                                email: candidate.email,
                                phone: candidate.phone || 'No phone',
                                linkedin_url: candidate.linkedin_url || '#',
                                resume_url: candidate.resume_url || candidate.cv_filename || '#',
                                recruiter_id: candidate.recruiter_id
                            } as Candidate} 
                        />
                    ))
                ) : (
                    <div className="col-span-full py-24 text-center border-2 border-dashed border-[#E1E2E5] rounded-[16px] flex flex-col items-center justify-center">
                        <Users className="w-12 h-12 text-[#6B7485]/20 mb-4" />
                        <p className="text-[#6B7485] font-medium">No other candidates found matching your criteria.</p>
                    </div>
                )}
            </div>

            {/* Footer Section: Pagination */}
            <div className="flex items-center justify-between pt-12 border-t border-[#F1F5F9]">
                <button className="bg-[#0040A1] text-white px-6 py-3 rounded-lg text-[13px] font-bold hover:bg-[#003380] transition-all flex items-center gap-2 shadow-sm">
                    <Plus size={18} /> Add Candidate
                </button>

                <div className="flex items-center gap-6">
                    <Link 
                        href={getPageUrl(Math.max(1, page - 1))}
                        className={`text-[12px] font-bold text-[#6B7485] hover:text-[#010101] ${page <= 1 ? 'pointer-events-none opacity-30' : ''}`}
                    >
                        Previous
                    </Link>
                    
                    <div className="flex items-center gap-2">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            // Show pages around current page
                            let pageNum = page;
                            if (totalPages <= 5) pageNum = i + 1;
                            else if (page <= 3) pageNum = i + 1;
                            else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                            else pageNum = page - 2 + i;

                            return (
                                <Link 
                                    key={pageNum}
                                    href={getPageUrl(pageNum)}
                                    className={`w-8 h-8 rounded-lg text-[12px] font-bold flex items-center justify-center transition-all ${page === pageNum ? 'bg-[#0040A1] text-white shadow-md' : 'text-[#6B7485] hover:bg-[#F1F5F9]'}`}
                                >
                                    {pageNum}
                                </Link>
                            );
                        })}
                        {totalPages > 5 && page < totalPages - 2 && <span className="text-[#6B7485]">...</span>}
                    </div>

                    <Link 
                        href={getPageUrl(Math.min(totalPages, page + 1))}
                        className={`text-[12px] font-bold text-[#0040A1] hover:underline ${page >= totalPages ? 'pointer-events-none opacity-30' : ''}`}
                    >
                        Next
                    </Link>
                </div>
            </div>

            <div className="mt-8 text-center text-[12px] text-[#6B7485]">
                Showing <span className="font-bold text-[#010101] text-[13px]">{candidates.length}</span> of <span className="font-bold text-[#010101] text-[13px]">{totalCount}</span> specialized candidates
            </div>
        </div>
    );
}
