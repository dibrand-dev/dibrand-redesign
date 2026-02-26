import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface StaffAugmentationTeaserProps {
    dict: {
        staffAugmentationTeaser: {
            title: string;
            description: string;
            cta: string;
        };
    };
}

export default function StaffAugmentationTeaser({ dict }: StaffAugmentationTeaserProps) {
    const { title, description, cta } = dict.staffAugmentationTeaser;

    return (
        <section className="bg-black py-20 border-y border-white/5">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-zinc-900/50 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12">
                    <div className="max-w-2xl text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-outfit">
                            {title}
                        </h2>
                        <p className="text-lg md:text-xl text-gray-400 font-outfit leading-relaxed">
                            {description}
                        </p>
                    </div>

                    <div className="flex-shrink-0">
                        <Link
                            href="/staff-augmentation"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white hover:text-black hover:border-white transition-all duration-300 group"
                        >
                            {cta}
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
