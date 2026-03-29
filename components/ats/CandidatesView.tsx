'use client'

import React from 'react';
import { Plus, Users } from 'lucide-react';
import Link from 'next/link';
import CandidateCardProMax from '@/components/ats/CandidateCardProMax';
import { Candidate } from '@/app/ats/types';

interface CandidatesViewProps {
    candidates: any[];
    totalCount: number;
    page: number;
    totalPages: number;
    // Pass filters to generate URLs locally
    filters: {
        status?: string;
        search?: string;
        jobId?: string;
        country?: string;
        recruiterId?: string;
    };
}

export default function CandidatesView({ candidates, totalCount, page, totalPages, filters }: CandidatesViewProps) {
    
    const getPageUrl = (p: number) => {
        const params = new URLSearchParams();
        if (filters.status) params.set('status', filters.status);
        if (filters.search) params.set('search', filters.search);
        if (filters.jobId) params.set('jobId', filters.jobId);
        if (filters.country) params.set('country', filters.country);
        if (filters.recruiterId) params.set('recruiterId', filters.recruiterId);
        params.set('page', p.toString());
        return `/ats/candidates?${params.toString()}`;
    };

    return (
        <>
            {/* Candidate Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12 min-h-[400px]">
                {/* New Potential Card FIRST - Link to Page */}
                <Link 
                    href="/ats/candidates/new"
                    className="bg-[#FBFCFD] border-2 border-dashed border-[#E1E2E5] rounded-[16px] flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:border-[#0040A1] hover:bg-white transition-all order-first"
                >
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#E1E2E5] flex items-center justify-center text-[#6B7485] mb-4 group-hover:scale-110 transition-transform">
                        <Plus size={24} />
                    </div>
                    <h4 className="text-[15px] font-bold text-[#010101] mb-2">New Potential</h4>
                    <p className="text-[12px] text-[#6B7485] max-w-[180px]">Manually add a high-priority candidate to the pool.</p>
                </Link>

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
                                recruiter_id: candidate.recruiter_id,
                                country: candidate.country || 'N/A',
                                avatar_url: candidate.avatar_url
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
                <Link 
                    href="/ats/candidates/new"
                    className="bg-[#0040A1] text-white px-6 py-3 rounded-lg text-[13px] font-bold hover:bg-[#003380] transition-all flex items-center gap-2 shadow-sm"
                >
                    <Plus size={18} /> Add Candidate
                </Link>

                <div className="flex items-center gap-6">
                    <Link 
                        href={getPageUrl(Math.max(1, page - 1))}
                        className={`text-[12px] font-bold text-[#6B7485] hover:text-[#010101] ${page <= 1 ? 'pointer-events-none opacity-30' : ''}`}
                    >
                        Previous
                    </Link>
                    
                    <div className="flex items-center gap-2">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
        </>
    );
}
