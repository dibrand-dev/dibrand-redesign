import { Network, Sparkles, DraftingCompass, Award } from 'lucide-react';

interface ServicesGridProps {
    dict: {
        services: {
            title: string;
            subtitle: string;
            items: { title: string; desc: string }[];
        };
    };
    lang: string;
}

const iconMap = [
    Network,          // Software Development
    Sparkles,         // IA & Custom Workflows
    DraftingCompass,  // Strategic Architecture
    Award            // Talent IT Senior
];

export default function ServicesGrid({ dict, lang }: ServicesGridProps) {
    const { title, subtitle, items } = dict.services;

    return (
        <section className="bg-zinc-50 py-12 md:py-16 overflow-hidden" id="ecosystem">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Header Section - Standardized */}
                <div className="mb-8 md:mb-10">
                    <h2 className="text-3xl md:text-5xl font-bold font-outfit text-zinc-900 tracking-tight leading-tight">
                        {title}
                    </h2>
                    <div className="mt-6 h-1 w-24 bg-brand mb-4" />
                    <p className="text-base md:text-lg text-zinc-500 font-outfit font-light leading-relaxed max-w-2xl">
                        {subtitle}
                    </p>
                </div>

                {/* 4 Pillars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {items.map((item, index) => {
                        const Icon = iconMap[index] || Network;

                        return (
                            <div
                                key={index}
                                className="group p-8 rounded-[2rem] bg-white border border-zinc-100/80 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-500 flex flex-col items-center text-center"
                            >
                                {/* Icon Circle */}
                                <div className="mb-6 h-16 w-16 rounded-full bg-brand/5 flex items-center justify-center text-brand group-hover:bg-brand/10 transition-all duration-500">
                                    <Icon className="h-7 w-7" strokeWidth={1.5} />
                                </div>

                                <h3 className="text-xl font-bold font-outfit text-zinc-900 tracking-tight mb-3 leading-snug">
                                    {item.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-zinc-500 font-outfit font-light">
                                    {item.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
