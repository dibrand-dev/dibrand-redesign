import React from 'react';
import { createAdminClient } from '@/lib/supabase-server';
import { getDictionary } from '@/lib/dictionaries';
import Link from 'next/link';
import { ChevronRight, MapPin, Clock, Briefcase } from 'lucide-react';

interface JobOpening {
    id: string;
    title: string;
    department: string;
    location: string;
    employment_type: string;
    description: string;
    requirements: string;
    is_active: boolean;
    created_at: string;
}

export default async function CareersPage(props: { params: Promise<{ lang: "en" | "es" }> }) {
    const params = await props.params;
    const dict = await getDictionary(params.lang);
    const supabase = createAdminClient();

    const { data: jobs, error } = await supabase
        .from('job_openings')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    return (
        <main className="min-h-screen bg-white pt-24">
            {/* Hero Section */}
            <section className="bg-gray-50 py-20 lg:py-32">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl lg:text-7xl font-bold text-corporate-grey font-heading mb-6">
                            Join the Dibrand Team
                        </h1>
                        <p className="text-xl text-corporate-grey/60 leading-relaxed">
                            Shape the future of digital products with a world-class team. We are looking for passionate individuals to help us build amazing things.
                        </p>
                    </div>
                </div>
            </section>

            {/* Jobs List Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto space-y-4">
                        {error || !jobs || jobs.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed">
                                <p className="text-corporate-grey/40 text-lg">No open positions at the moment. Check back later!</p>
                            </div>
                        ) : (
                            jobs.map((job: JobOpening) => (
                                <div
                                    key={job.id}
                                    className="group bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
                                >
                                    <div className="space-y-2 flex-1">
                                        <h3 className="text-xl font-bold text-corporate-grey group-hover:text-primary transition-colors">
                                            {job.title}
                                        </h3>
                                        <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                            <Briefcase size={14} className="text-gray-400" />
                                            {job.department}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                            <MapPin size={14} className="text-gray-400" />
                                            {job.location}
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                            <Clock size={14} className="text-gray-400" />
                                            {job.employment_type}
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <Link
                                            href={`/${params.lang}/careers/${job.id}`}
                                            className="inline-flex items-center gap-2 text-[#D83484] font-bold py-2 px-4 rounded-lg border border-[#D83484]/20 hover:bg-[#D83484]/5 transition-colors group/btn"
                                        >
                                            <span>View Details</span>
                                            <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Culture/Perks Section (Extra Touch) */}
            <section className="bg-corporate-grey py-24 text-white overflow-hidden relative">
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl font-bold mb-8">Why work with us?</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <h4 className="font-bold text-xl text-primary">Remote First</h4>
                                    <p className="text-white/60">Work from anywhere in the world with a flexible schedule.</p>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="font-bold text-xl text-primary">Grow Fast</h4>
                                    <p className="text-white/60">Opportunity to work with leading tech startups and scale-ups.</p>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="font-bold text-xl text-primary">Top Tech</h4>
                                    <p className="text-white/60">Modern stacks and innovative projects that push boundaries.</p>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="font-bold text-xl text-primary">Great Culture</h4>
                                    <p className="text-white/60">A collaborative team that values excellence and ownership.</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative aspect-square md:aspect-video rounded-3xl overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                                alt="Team collaboration"
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
