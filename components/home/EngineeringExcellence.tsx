import { Terminal, Users, Code2, Rocket } from 'lucide-react';

interface EngineeringExcellenceProps {
    dict: any;
    lang: string;
}

const iconMap = [
    Code2,               // Software Development
    Rocket,              // Software Outsourcing
    Users                // Staff Augmentation
];

export default function EngineeringExcellence({ dict, lang }: EngineeringExcellenceProps) {
    const { title, items } = dict.engineeringExcellence;

    return (
        <section className="bg-zinc-50 py-12 md:py-16">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="mb-8 md:mb-10">
                    <h2 className="text-3xl md:text-5xl font-bold font-outfit text-zinc-900 tracking-tight leading-tight">
                        {title}
                    </h2>
                    <div className="mt-6 h-1 w-24 bg-brand" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item: any, index: number) => {
                        const Icon = iconMap[index] || Terminal;
                        return (
                            <div
                                key={index}
                                className="group p-8 rounded-[2rem] bg-white border border-zinc-100/80 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-500 flex flex-col items-center text-center h-full"
                            >
                                {/* Icon Circle */}
                                <div className="mb-6 h-16 w-16 rounded-full bg-brand/5 flex items-center justify-center text-brand group-hover:bg-brand/10 transition-all duration-500">
                                    <Icon size={28} strokeWidth={1.5} />
                                </div>

                                <h3 className="text-xl font-bold font-outfit text-zinc-900 tracking-tight mb-3 leading-snug">
                                    {item.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-zinc-500 font-outfit font-light flex-grow">
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
