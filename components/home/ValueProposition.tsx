import { Zap, ShieldCheck, Users } from 'lucide-react';

interface ValuePropositionProps {
    dict: {
        whyUs: {
            title: string;
            items: { title: string; desc: string }[];
        };
    };
}

export default function ValueProposition({ dict }: ValuePropositionProps) {
    const icons = [Zap, ShieldCheck, Users]; // Speed, Quality, Talent

    return (
        <section className="bg-white py-20 lg:py-28">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        {dict.whyUs.title}
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                    {dict.whyUs.items.map((item, index) => {
                        const Icon = icons[index] || Zap;
                        return (
                            <div key={index} className="flex flex-col items-center text-center">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-50 text-[#D83484]">
                                    <Icon className="h-8 w-8" />
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-gray-900">
                                    {item.title}
                                </h3>
                                <p className="text-base leading-relaxed text-gray-600">
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
