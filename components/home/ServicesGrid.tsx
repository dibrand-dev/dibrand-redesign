import { Users, Rocket, Brain, Landmark, ArrowRight } from 'lucide-react';

import Link from 'next/link';

interface ServicesGridProps {
    dict: {
        services: {
            title: string;
            items: { title: string; desc: string }[];
        };
    };
    lang: string;
}

const iconMap = [
    Rocket,              // Software Outsourcing
    Users,               // Staff Augmentation
    Brain,               // AI & Custom Workflows
    Landmark             // Strategic Architecture
];

export default function ServicesGrid({ dict, lang }: ServicesGridProps) {
    return (
        <section className="bg-zinc-800 flex flex-col justify-start pt-32 pb-40" id="services">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-24 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl font-outfit">
                        {dict.services.title}
                    </h2>
                    <div className="mt-4 h-1 w-20 bg-gradient-to-r from-brand to-brand mx-auto" />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {dict.services.items.map((item, index) => {
                        const Icon = iconMap[index] || Rocket;

                        let href = `/${lang}`;
                        if (item.title.includes("Outsourcing")) href = `/${lang}/software-outsourcing`;
                        if (item.title.includes("Staff Augmentation")) href = `/${lang}/staff-augmentation`;
                        if (item.title.includes("AI & Custom Workflows")) href = `/${lang}/ai-workflows`;
                        if (item.title.includes("Strategic Architecture")) href = `/${lang}/strategic-architecture`;

                        return (
                            <Link
                                key={index}
                                href={href}
                                className="group flex flex-col justify-between rounded-xl bg-white/5 backdrop-blur-sm p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border border-white/10 hover:border-brand/30"
                            >
                                <article>
                                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white/5 text-brand group-hover:bg-brand group-hover:text-white transition-all duration-300">
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="mb-3 text-lg font-bold text-white font-outfit">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-gray-400 font-outfit">
                                        {item.desc}
                                    </p>
                                </article>

                                <div className="mt-6 flex items-center text-xs font-bold uppercase tracking-wider text-gray-400 group-hover:text-brand transition-colors">
                                    <span>Learn More</span>
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
