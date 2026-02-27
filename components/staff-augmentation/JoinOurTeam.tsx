import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface JobOpening {
    id: string;
    title: string;
    location: string;
    employment_type: string;
    is_active: boolean;
}

interface JoinOurTeamProps {
    jobs: JobOpening[];
    lang: string;
}

export default function JoinOurTeam({ jobs, lang }: JoinOurTeamProps) {
    const activeJobs = jobs || [];

    return (
        <section className="bg-white py-16 border-t border-zinc-100">
            <div className="container mx-auto px-6">
                {/* Header Section - Compact & Shared Style */}
                <div className="max-w-4xl mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-4 font-outfit tracking-tight leading-tight">
                        We are excited to hear from you
                    </h2>
                    <p className="text-lg md:text-xl text-zinc-600 font-outfit font-light leading-relaxed">
                        Join our team and be part of a community where innovation and collaboration thrive.
                    </p>
                </div>

                {/* Openings Grid - Flat & Clean */}
                <div className="max-w-6xl">
                    {activeJobs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                            {activeJobs.map((job) => (
                                <div key={job.id} className="flex flex-col group">
                                    <div className="flex flex-col mb-4">
                                        <h3 className="text-xl font-bold text-[#D83484] font-outfit mb-1">
                                            {job.title}
                                        </h3>
                                        <p className="text-sm text-zinc-500 font-outfit font-light">
                                            {job.location} • {job.employment_type.replace('_', ' ')}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/${lang}/careers/${job.id}`}
                                        className="inline-flex items-center gap-2 text-zinc-900 font-bold text-sm hover:gap-3 transition-all duration-300"
                                    >
                                        <span>View opening</span>
                                        <ArrowRight size={16} className="text-[#D83484]" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 bg-zinc-50 rounded-2xl border border-zinc-100">
                            <p className="text-lg text-zinc-600 font-outfit">
                                No open positions at the moment, but we are always looking for talent. {' '}
                                <Link href={`/${lang}/contact`} className="text-[#D83484] font-bold underline">
                                    Send us your CV!
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
