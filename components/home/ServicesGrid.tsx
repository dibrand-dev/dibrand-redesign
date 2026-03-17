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
        <section className="bg-zinc-50 py-24 md:py-32 overflow-hidden" id="ecosystem">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-6 font-outfit tracking-tight">
                        {title}
                    </h2>
                    <p className="text-lg text-zinc-500 font-outfit font-light leading-relaxed">
                        {subtitle}
                    </p>
                    <div className="mt-8 h-1 w-20 bg-brand/30 mx-auto" />
                </div>

                {/* 4 Pillars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {items.map((item, index) => {
                        const Icon = iconMap[index] || Network;

                        return (
                            <div
                                key={index}
                                className="group p-8 rounded-2xl bg-white border border-zinc-200 transition-all duration-300 hover:shadow-xl hover:border-brand/20 flex flex-col items-center text-center"
                            >
                                <div className="mb-6 h-14 w-14 rounded-full bg-zinc-50 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-all duration-300">
                                    <Icon className="h-7 w-7" strokeWidth={1.5} />
                                </div>
                                <h3 className="mb-4 text-xl font-bold text-zinc-900 font-outfit">
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
