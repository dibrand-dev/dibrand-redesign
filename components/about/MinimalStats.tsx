interface MinimalStatsProps {
    dict: {
        trustLabel: string;
        items: { label: string; value: string }[];
    };
}

export default function MinimalStats({ dict }: MinimalStatsProps) {
    return (
        <section className="py-20 bg-white border-b border-zinc-100">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                    {dict.items.map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center justify-center text-center p-8 group">
                            <span className="text-4xl md:text-6xl font-black font-outfit text-zinc-900 tracking-tighter mb-4 group-hover:text-brand transition-colors duration-500 leading-none">
                                {item.value}
                            </span>
                            <div className="h-0.5 w-12 bg-zinc-200 group-hover:w-20 group-hover:bg-brand transition-all duration-500 mb-6" />
                            <span className="text-sm md:text-base font-bold font-outfit text-zinc-400 leading-none">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
