import Image from 'next/image';

interface EliteTalentProps {
    dict: {
        title: string;
        desc: string;
    };
    imagePath: string;
}

export default function EliteTalent({ dict, imagePath }: EliteTalentProps) {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    {/* Image Side */}
                    <div className="w-full lg:w-1/2 relative aspect-square max-w-xl mx-auto lg:mx-0">
                        <div className="absolute inset-0 bg-brand/5 rounded-[3rem] -rotate-6 scale-105" />
                        <div className="relative h-full w-full rounded-[3rem] overflow-hidden shadow-2xl">
                            <Image
                                src={imagePath}
                                alt="Elite Talent Selection"
                                fill
                                className="object-cover"
                            />
                        </div>
                        {/* Decorative Badge */}
                        <div className="absolute -bottom-6 -right-6 bg-zinc-950 text-white p-8 rounded-full w-32 h-32 flex items-center justify-center text-center leading-tight font-bold font-outfit text-sm rotate-12 shadow-xl border border-white/10">
                            THE ELITE<br/>3%
                        </div>
                    </div>
                    
                    {/* Content Side */}
                    <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
                        <h2 className="text-3xl md:text-5xl font-bold font-outfit text-zinc-900 tracking-tight mb-8 uppercase leading-tight">
                            {dict.title}
                        </h2>
                        <div className="w-20 h-1.5 bg-brand mb-10" />
                        <p className="text-lg md:text-xl text-zinc-500 font-outfit font-light leading-relaxed">
                            {dict.desc}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
