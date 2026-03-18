interface SoftwareDevAdvantageProps {
    dict: {
        title: string;
        items: Array<{ title: string; desc?: string }>;
    };
}


export default function SoftwareDevAdvantage({ dict }: SoftwareDevAdvantageProps) {
    return (
        <section className="py-16 md:py-20 bg-white border-t border-zinc-100">
            <div className="container mx-auto px-6 max-w-5xl">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-4 font-outfit tracking-tight">
                        {dict.title}
                    </h2>
                </div>

                {/* Advantage Pills cloud */}
                <div className="flex flex-wrap justify-center gap-4">
                    {dict.items.map((item, idx) => (
                        <div 
                            key={idx} 
                            className="px-6 py-3 rounded-full bg-zinc-50/50 border border-zinc-100 text-zinc-800 font-outfit font-bold text-xs md:text-sm tracking-wide shadow-sm hover:shadow-md hover:bg-white hover:border-brand/30 transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                            {item.title}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
