import React from 'react';

interface FinalQuoteProps {
    text: string;
    text2?: string;
    variant?: 'about' | 'default';
}

const TechStar = () => (
    <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 md:w-8 md:h-8 text-[#a04c97]"
    >
        <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" fill="currentColor"/>
    </svg>
);

const NetworkNode = () => (
    <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 text-zinc-300"
    >
        <circle cx="12" cy="12" r="3" fill="currentColor"/>
        <path d="M12 9V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M10 14L5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M14 14L19 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="12" cy="3" r="1.5" fill="currentColor"/>
        <circle cx="4" cy="18" r="1.5" fill="currentColor"/>
        <circle cx="20" cy="18" r="1.5" fill="currentColor"/>
    </svg>
);

const OpeningQuotes = () => (
    <svg 
        viewBox="0 0 40 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-10 h-10 md:w-12 md:h-12 text-brand opacity-60 mb-6"
    >
        <path d="M11.6364 0L14.5455 18.9091H7.27273L0 32H8.72727L16 18.9091V0H11.6364ZM35.6364 0L38.5455 18.9091H31.2727L24 32H32.7273L40 18.9091V0H35.6364Z" fill="currentColor"/>
    </svg>
);

const FinalQuote: React.FC<FinalQuoteProps> = ({ text, text2, variant = 'default' }) => {
    if (variant === 'about' && text2) {
        return (
            <section className="w-full py-28 bg-white flex items-center justify-center overflow-hidden">
                <div className="container mx-auto px-6 flex flex-col items-center justify-center">
                    {/* DS V3 Opening Quotes */}
                    <OpeningQuotes />

                    {/* Line 1 - Light/Accent Phrase */}
                    <div className="mb-6">
                        <h3 className="text-brand text-center font-outfit font-light text-xl md:text-2xl tracking-tight">
                            {text}
                        </h3>
                    </div>
                    
                    {/* Line 2 - Impact/Primary Phrase */}
                    <h2 className="text-zinc-950 text-center font-outfit font-semibold text-2xl md:text-[30px] leading-[1.2] max-w-5xl tracking-tight mb-4">
                        {text2}
                    </h2>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full py-24 bg-gradient-to-b from-[#7e3b75] to-[#101010] flex items-center justify-center overflow-hidden border-t border-white/5">
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
                <div className="flex-shrink-0 animate-pulse">
                    <TechStar />
                </div>
                
                <h2 className="text-white text-center font-outfit font-semibold text-2xl md:text-4xl lg:text-5xl leading-tight tracking-tight max-w-5xl px-4 drop-shadow-2xl">
                    {text}
                </h2>
                
                <div className="flex-shrink-0 animate-pulse [animation-delay:500ms]">
                    <TechStar />
                </div>
            </div>
        </section>
    );
};

export default FinalQuote;
