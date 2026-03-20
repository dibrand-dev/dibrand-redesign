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
                    {/* Image Side - Flat Portrait Panel (Design System V3) */}
                    <div className="w-full lg:w-1/2 relative aspect-square max-w-xl mx-auto lg:mx-0">
                        <div className="relative h-full w-full rounded-[2rem] overflow-hidden shadow-none border border-zinc-100">
                            <Image
                                src={imagePath}
                                alt="Elite Talent Selection"
                                fill
                                className="object-cover"
                            />
                            
                            {/* Decorative Badge - Solid Black Circle (Flat Design) */}
                            <div className="absolute bottom-8 right-8 bg-black text-white w-28 h-28 rounded-full flex flex-col items-center justify-center text-center border border-white/10 shadow-none z-10">
                                <span className="font-outfit text-[10px] font-normal mb-1 opacity-80">The elite</span>
                                <span className="font-outfit font-bold text-3xl">3%</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Content Side */}
                    <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
                        <h2 className="text-3xl md:text-5xl font-bold font-outfit text-zinc-900 tracking-tight mb-8 leading-tight">
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
