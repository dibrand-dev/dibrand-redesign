import React from 'react';
import { 
    Code2, 
    Layers, 
    Globe, 
    ShieldCheck, 
    History, 
    Headphones, 
    Cloud, 
    Zap, 
    Database,
    Binary,
    TestTube2,
    LayoutPanelLeft
} from 'lucide-react';

interface SolutionsByCategoryProps {
    categories: Array<{
        title: string;
        items: Array<{ title: string; desc: string }>;
    }>;
}

const iconMap: Record<string, any> = {
    "Custom Software": Code2,
    "UX/UI": LayoutPanelLeft,
    "Web & Mobile Development": Globe,
    "Quality Assurance": TestTube2,
    "Legacy Migration": History,
    "Support": Headphones,
    "Cloud Infrastructure": Cloud,
    "AI Implementation": Zap,
    "Data Science": Binary
};

export default function SolutionsByCategory({ categories }: SolutionsByCategoryProps) {
    return (
        <section className="py-24 bg-zinc-50">
            <div className="container mx-auto px-6 max-w-7xl">
                {categories.map((category, catIdx) => (
                    <div key={catIdx} className="mb-24 last:mb-0">
                        {/* Category Header */}
                        <div className="mb-12">
                            <h2 className="text-2xl md:text-4xl font-bold text-zinc-900 font-outfit tracking-tight mb-4">
                                {category.title}
                            </h2>
                            <div className="h-1 w-20 bg-brand" />
                        </div>

                        {/* Items Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {category.items.map((item, itemIdx) => {
                                const Icon = iconMap[item.title] || Code2;
                                return (
                                    <div 
                                        key={itemIdx}
                                        className="group p-10 rounded-[2rem] bg-white border border-zinc-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-400 flex flex-col"
                                    >
                                        <div className="w-14 h-14 rounded-full bg-brand/5 flex items-center justify-center mb-8 group-hover:bg-brand/10 transition-colors">
                                            <Icon size={28} className="text-brand" strokeWidth={1.5} />
                                        </div>
                                        <h3 className="text-xl font-bold text-zinc-900 mb-4 font-outfit">
                                            {item.title}
                                        </h3>
                                        <p className="text-zinc-500 font-outfit font-light leading-relaxed text-sm">
                                            {item.desc}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
