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

    const supabaseAuth = await createClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();
    const userRole = user?.user_metadata?.role || 'recruiter';

    const candidates = await getAllCandidates({ status, search });
    const candidateNames = await getCandidateNames();
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
                    
                    <button className="text-[11px] font-bold text-[#0040A1] hover:underline uppercase tracking-tight">
                        Clear all filters
                    </button>
                </div>

            {/* Candidate Grid */}
            {candidates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
                        {candidates.map((candidate: any) => (
                            <CandidateCardProMax 
                                key={candidate.id} 
                                candidate={{
                                    id: candidate.id,
                                    full_name: `${candidate.first_name} ${candidate.last_name}`,
                                    position: candidate.position || candidate.job?.title || 'General App',
                                    status: candidate.status || 'Applied',
                                    email: candidate.email,
                                    phone: candidate.phone || 'No phone',
                                    linkedin_url: candidate.linkedin_url || '#',
                                    resume_url: candidate.resume_url || candidate.cv_filename || '#',
                                    recruiter_id: candidate.recruiter_id
                                } as Candidate} 
                            />
                        ))}
                        
                        {/* New Potential Card placeholder */}
                        <div className="bg-[#FBFCFD] border-2 border-dashed border-[#E1E2E5] rounded-[16px] flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:border-[#0040A1] hover:bg-white transition-all">
                            <div className="w-12 h-12 rounded-xl bg-white border border-[#E1E2E5] flex items-center justify-center text-[#6B7485] mb-4 group-hover:scale-110 transition-transform">
                                <Plus size={24} />
                            </div>
                            <h4 className="text-[15px] font-bold text-[#010101] mb-2">New Potential</h4>
                            <p className="text-[12px] text-[#6B7485] max-w-[180px]">Manually add a high-priority candidate to the pool.</p>
                        </div>
                    </div>
                ) : (
                    <div className="py-24 text-center border-2 border-dashed border-[#E1E2E5] rounded-[16px]">
                        <Users className="w-12 h-12 text-[#6B7485]/20 mx-auto mb-4" />
                        <p className="text-[#6B7485] font-medium">No candidates found matching your criteria.</p>
                    </div>
                )}

                {/* Footer Section: Add Candidate + Pagination */}
                <div className="flex items-center justify-between pt-12 border-t border-[#F1F5F9]">
                    <button className="bg-[#0040A1] text-white px-6 py-3 rounded-lg text-[13px] font-bold hover:bg-[#003380] transition-all flex items-center gap-2 shadow-sm">
                        <Plus size={18} /> Add Candidate
                    </button>

                    <div className="flex items-center gap-6">
                        <button className="text-[12px] font-bold text-[#6B7485] hover:text-[#010101] disabled:opacity-30">Previous</button>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3].map(page => (
                                <button key={page} className={`w-8 h-8 rounded-lg text-[12px] font-bold transition-all ${page === 1 ? 'bg-[#0040A1] text-white' : 'text-[#6B7485] hover:bg-[#F1F5F9]'}`}>
                                    {page}
                                </button>
                            ))}
                            <span className="text-[#6B7485]">...</span>
                        </div>
                        <button className="text-[12px] font-bold text-[#0040A1] hover:underline">Next</button>
                    </div>
                </div>

                <div className="mt-8 text-center text-[12px] text-[#6B7485]">
                   Showing <span className="font-bold text-[#010101] text-[13px]">{candidates.length}</span> of <span className="font-bold text-[#010101] text-[13px]">284</span> specialized candidates
            </div>
        </div>
    );
}



