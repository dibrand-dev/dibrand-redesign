import { 
    getCandidateById, 
    updateCandidateStatus, 
    assignRecruiter, 
    getRecruiters, 
    addApplicationLog, 
    getApplicationLogs,
    getStackNames
} from '@/app/ats/actions';
import { 
    MapPin, Mail, Phone,
    CheckCircle2, 
    UserPlus
} from 'lucide-react';
import { notFound } from 'next/navigation';

// ATS Components
import EditProfileButton from '@/components/ats/EditProfileButton';
import CandidateDetailTabs from '@/components/ats/CandidateDetailTabs';

export default async function CandidateDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    console.log('--- ENTERING CANDIDATE DETAIL PAGE ---');
    console.log('ID parameter:', id);
    const candidate = await getCandidateById(id);
    const logs = await getApplicationLogs(id);

    if (!candidate) {
        notFound();
    }

    // Resolve stack names from IDs and merge with direct skills
    const resolvedStackNames = await getStackNames(candidate.stack_ids || []);
    const allSkills = Array.from(new Set([
        ...resolvedStackNames,
        ...(candidate.skills || [])
    ])).sort();

    // Map DB status to Figma Pipeline Stages (Identical to 3329-24)
    const stages = [
        { label: 'APPLIED', key: ['Applied', 'New'] },
        { label: 'PHONE SCREEN', key: ['Screening', 'Phone Screen'] },
        { label: 'TECHNICAL', key: ['Interview', 'Technical Interview'] },
        { label: 'CULTURE', key: ['Culture', 'Cultural Fit'] },
        { label: 'FINAL', key: ['Final Round'] },
        { label: 'OFFER', key: ['Offered', 'Offer'] }
    ];

    const currentStatus = candidate.status || 'Applied';
    const activeIndex = stages.findIndex(s => s.key.includes(currentStatus));
    const effectiveIndex = activeIndex === -1 ? 0 : activeIndex;

    return (
        <div className="min-h-full bg-[#E5E5E5] pb-20 font-inter">
            <div className="max-w-[1400px] mx-auto p-8 space-y-8">
                {/* Header Profile Card - Figma 3329-24 Style */}
                <div className="bg-white rounded-[12px] p-8 shadow-sm border border-[#E2E8F0]">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-10">
                        <div className="flex items-center gap-6">
                            {/* Circular Avatar */}
                            <div className="relative">
                                <div className="w-[80px] h-[80px] rounded-full bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-2xl font-bold text-[#0040A1] overflow-hidden uppercase shadow-inner">
                                     {candidate.full_name?.charAt(0) || candidate.first_name?.charAt(0) || 'C'}
                                     {candidate.last_name?.charAt(0)}
                                </div>
                            </div>
                            
                            <div>
                                <h1 className="text-[28px] font-bold text-[#191C1D] leading-tight mb-2">
                                    {candidate.full_name || `${candidate.first_name} ${candidate.last_name}`}
                                </h1>
                                <div className="flex flex-wrap items-center gap-6 text-[13px] text-[#737785] font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={16} className="text-[#A1A5B7]" />
                                        {candidate.country || 'UK'}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Mail size={16} className="text-[#A1A5B7]" />
                                        {candidate.email}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Phone size={16} className="text-[#A1A5B7]" />
                                        {candidate.phone || 'No phone'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Header Actions */}
                        <div className="flex items-center gap-3">
                            <EditProfileButton candidate={candidate} />
                            <button className="px-8 py-2.5 bg-[#0040A1] text-white rounded-xl text-[13px] font-bold hover:bg-[#003380] transition-all shadow-sm">
                                Interview
                            </button>
                            <button className="px-8 py-2.5 bg-[#F1F5F9] text-[#191C1D] rounded-xl text-[13px] font-bold border border-[#E2E8F0] hover:bg-[#E2E8F0] transition-all">
                                Message
                            </button>
                        </div>
                    </div>

                    {/* Horizontal Pipeline Stepper (Exact Figma Colors) */}
                    <div className="pt-8 border-t border-[#F1F5F9]">
                         <div className="relative flex items-center justify-between w-full px-4">
                             {/* Connecting Line Background */}
                             <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-[2px] bg-[#F1F5F9] -z-0"></div>
                             {/* Active Line Progress */}
                             <div 
                                className="absolute left-10 top-1/2 -translate-y-1/2 h-[2px] bg-[#0040A1] transition-all duration-1000 -z-0" 
                                style={{ width: `calc(${(effectiveIndex / (stages.length - 1)) * 100}% - 40px)` }}
                             ></div>

                             {/* Stepper Dots */}
                             {stages.map((step, idx) => {
                                const isDone = idx < effectiveIndex;
                                const isActive = idx === effectiveIndex;
                                return (
                                    <div key={step.label} className="relative z-10 flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-md transition-all duration-500 ${
                                            isDone || isActive ? 'bg-[#0040A1] text-white' : 'bg-[#F1F5F9] text-[#A1A5B7]'
                                        }`}>
                                            {isDone ? <CheckCircle2 size={14} strokeWidth={3} /> : 
                                             isActive ? <div className="w-2 h-2 rounded-full bg-white"></div> : 
                                             <div className="w-1.5 h-1.5 rounded-full bg-[#A1A5B7]"></div>}
                                        </div>
                                        <span className={`absolute top-12 whitespace-nowrap text-[9px] font-black uppercase tracking-[0.15em] ${
                                            isDone || isActive ? 'text-[#0040A1]' : 'text-[#A1A5B7]'
                                        }`}>{step.label}</span>
                                    </div>
                                );
                             })}
                         </div>
                    </div>
                </div>

                {/* Tabbed Content Area */}
                <CandidateDetailTabs 
                    candidate={candidate}
                    logs={logs}
                    allSkills={allSkills}
                    stages={stages}
                    currentStatus={currentStatus}
                />
            </div>
        </div>
    );
}
