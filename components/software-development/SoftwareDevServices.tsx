import { Code2, Cpu, DraftingCompass, LayoutPanelLeft } from 'lucide-react';

interface SoftwareDevServicesProps {
    dict: {
        title: string;
        items: Array<{ title: string; desc: string }>;
    };
}

const icons = [Code2, Cpu, DraftingCompass, LayoutPanelLeft];

export default function SoftwareDevServices({ dict }: SoftwareDevServicesProps) {
    return (
        <section className="py-16 md:py-24 bg-zinc-50">
            <div className="container mx-auto px-6 max-w-7xl">
                <header className="mb-16 md:mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 font-outfit uppercase tracking-tighter mb-6">
                        {dict.title}
                    </h2>
                    <div className="h-1 w-24 bg-brand" />
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                    {dict.items.map((service, idx) => {
                        const Icon = icons[idx] || Code2;
                        return (
                            <div 
                                key={idx} 
                                className="group p-10 md:p-12 rounded-[2rem] bg-white border border-zinc-100/80 hover:-translate-y-1 transition-all duration-400 hover:shadow-xl hover:shadow-zinc-200/50 flex flex-col items-center text-center"
                            >
                                <div className="w-16 h-16 rounded-full bg-brand/5 flex items-center justify-center mb-8 group-hover:bg-brand/10 transition-colors duration-400">
                                    <Icon size={32} className="text-brand transition-colors duration-400" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-2xl font-bold text-zinc-900 mb-4 font-outfit uppercase tracking-tight leading-tight">
                                    {service.title}
                                </h3>
                                <p className="text-zinc-500 font-outfit font-light leading-relaxed max-w-sm">
                                    {service.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
