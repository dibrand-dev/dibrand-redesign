import React from 'react';
import { getJob } from '@/app/actions/jobs';
import { getDictionary } from '@/lib/dictionaries';
import JobApplicationForm from '@/components/jobs/JobApplicationForm';
import { MapPin, Clock, Briefcase, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function JobDetailPage(props: { params: Promise<{ id: string, lang: string }> }) {
    const { id, lang } = await props.params;
    const dict = await getDictionary(lang as any);
    const job = await getJob(id);

    if (!job) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Job not found</h2>
                    <Link href={`/${lang}/careers`} className="text-primary hover:underline mt-4 block">
                        Back to Careers
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white pt-24">
            {/* Header / Breadcrumb */}
            <div className="bg-gray-50 border-b border-gray-100 py-6">
                <div className="container mx-auto px-4">
                    <Link
                        href={`/${lang}/careers`}
                        className="inline-flex items-center gap-2 text-corporate-grey/60 hover:text-primary transition-colors text-sm font-medium"
                    >
                        <ArrowLeft size={16} />
                        Back to Careers
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 lg:py-20">
                <div className="grid lg:grid-cols-5 gap-12 lg:gap-20">

                    {/* Job Details Content */}
                    <div className="lg:col-span-3 space-y-12">
                        <div>
                            <div className="flex flex-wrap gap-3 mb-6">
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                    <MapPin size={14} className="text-gray-400" />
                                    {job.location}
                                </span>
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                    <Clock size={14} className="text-gray-400" />
                                    {job.employment_type}
                                </span>
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                    <Briefcase size={14} className="text-gray-400" />
                                    {job.department}
                                </span>
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-bold text-corporate-grey leading-tight mb-8">
                                {job.title}
                            </h1>
                        </div>

                        <section className="prose prose-lg max-w-none">
                            <h3 className="text-2xl font-bold text-corporate-grey mb-4">About the role</h3>
                            <div className="text-corporate-grey/70 leading-relaxed whitespace-pre-wrap">
                                {job.description}
                            </div>
                        </section>

                        <section className="prose prose-lg max-w-none">
                            <h3 className="text-2xl font-bold text-corporate-grey mb-4">Requirements</h3>
                            <div className="text-corporate-grey/70 leading-relaxed whitespace-pre-wrap">
                                {job.requirements}
                            </div>
                        </section>
                    </div>

                    {/* Sticky Application Form Container */}
                    <div className="lg:col-span-2">
                        <div className="sticky top-32 bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200 overflow-hidden">
                            <JobApplicationForm jobId={id} lang={lang} />
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
