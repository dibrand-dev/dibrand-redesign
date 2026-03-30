import React from 'react';
import { getAllCandidates } from '../../actions';
import { ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase-server-client';
import Link from 'next/link';
import SearchTalentPredictive from '@/components/ats/SearchTalentPredictive';
import { getCandidateNames, getJobs, getCountries, getRecruiters } from '@/app/ats/actions';
import CandidatesView from '@/components/ats/CandidatesView';
import CandidateFilters from '@/components/ats/CandidateFilters';
import { ATS_STAGES } from '@/lib/ats-constants';

export default async function AtsCandidatesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const resolvedParams = await searchParams;
    const status = resolvedParams.status as string || undefined;
    const search = resolvedParams.search as string || undefined;
    const jobId = resolvedParams.jobId as string || undefined;
    const country = resolvedParams.country as string || undefined;
    const recruiterId = resolvedParams.recruiterId as string || undefined;
    const page = parseInt(resolvedParams.page as string || '1');
    const limit = 9;
    const offset = (page - 1) * limit;

    const { data: candidates, count: totalCount } = await getAllCandidates({ 
        status, 
        search, 
        jobId, 
        country,
        recruiterId,
        limit, 
        offset 
    });
    
    // Fetch filter data
    const [candidateNames, jobs, countries, recruiters] = await Promise.all([
        getCandidateNames(),
        getJobs(),
        getCountries(),
        getRecruiters()
    ]);

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const filterJobs = jobs.map(j => ({ id: j.id, label: j.title }));
    const filterStatuses = ATS_STAGES.map(s => ({ id: s.value, label: s.label }));
    const totalPages = Math.ceil(totalCount / limit);

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
            <CandidateFilters 
                jobs={filterJobs}
                countries={countries}
                statuses={filterStatuses}
                recruiters={recruiters}
                currentUser={user}
            />

            <CandidatesView 
                candidates={candidates}
                totalCount={totalCount}
                page={page}
                totalPages={totalPages}
                filters={{ status, search, jobId, country, recruiterId }}
            />
        </div>
    );
}
