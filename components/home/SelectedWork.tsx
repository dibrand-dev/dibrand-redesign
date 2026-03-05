import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface CaseStudy {
    id: string;
    slug: string;
    title: string;
    summary: string;
    image_url: string;
}

interface SelectedWorkProps {
    dict: any;
    lang: string;
    cases: CaseStudy[];
}

export default function SelectedWork({ dict, lang, cases }: SelectedWorkProps) {
    if (!cases || cases.length === 0) return null;

    return (
        <section className="bg-white py-24 md:py-32">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold font-outfit text-zinc-900 not-italic tracking-tight">
                            {dict.selectedWork.title}
                        </h2>
                        <div className="mt-6 h-1 w-24 bg-brand" />
                    </div>

                    <Link
                        href={`/${lang}/success-stories`}
                        className="inline-flex items-center gap-2 text-brand font-bold font-outfit uppercase tracking-widest text-xs hover:opacity-80 transition-opacity"
                    >
                        {dict.selectedWork.cta}
                        <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {cases.map((project) => (
                        <div key={project.id} className="group cursor-pointer">
                            <Link href={`/${lang}/success-stories/${project.slug}`} className="block">
                                {/* Image Container */}
                                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-100 mb-6 border border-zinc-100">
                                    <Image
                                        src={project.image_url || '/placeholder-case.jpg'}
                                        alt={project.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                    {/* Subtle overlay on hover */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                                </div>

                                {/* Content */}
                                <h3 className="text-2xl font-bold font-outfit text-zinc-900 not-italic mb-3 group-hover:text-brand transition-colors">
                                    {project.title}
                                </h3>

                                <span className="inline-flex items-center gap-2 text-brand font-bold font-outfit text-sm">
                                    {dict.selectedWork.viewCase}
                                </span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
