import Image from 'next/image';

interface AiNativeCultureProps {
    dict: {
        title: string;
        desc: string;
    };
    imagePath: string;
}

export default function AiNativeCulture({ dict, imagePath }: AiNativeCultureProps) {
    return (
        <section className="py-24 bg-zinc-50 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row-reverse items-center gap-16 lg:gap-24">
                    {/* Image Side */}
                    <div className="w-full lg:w-1/2 relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl group">
                        <Image
                            src={imagePath}
                            alt="AI Native Engineering Culture"
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent" />
                    </div>
                    
                    {/* Content Side */}
                    <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
                        <span className="text-brand font-bold tracking-[0.2em] uppercase text-sm mb-4">Advantage</span>
                        <h2 className="text-3xl md:text-5xl font-bold font-outfit text-zinc-900 tracking-tight mb-8 uppercase leading-tight">
                            {dict.title}
                        </h2>
                        <p className="text-lg md:text-xl text-zinc-500 font-outfit font-light leading-relaxed mb-10">
                            {dict.desc}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-8 w-full border-t border-zinc-200 pt-10">
                            <div>
                                <h4 className="font-bold text-zinc-900 mb-2 uppercase text-xs tracking-widest">Precision</h4>
                                <p className="text-sm text-zinc-500 font-light">AI-augmented code reviews and architecture analysis.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-zinc-900 mb-2 uppercase text-xs tracking-widest">Velocity</h4>
                                <p className="text-sm text-zinc-500 font-light">Accelerated development cycles without quality loss.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
