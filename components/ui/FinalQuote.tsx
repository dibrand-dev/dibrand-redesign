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

const FinalQuote: React.FC<FinalQuoteProps> = ({ text, text2, variant = 'default' }) => {
    if (variant === 'about' && text2) {
        return (
            <section className="w-full py-32 bg-gradient-to-b from-[#7e3b75] to-[#101010] flex items-center justify-center overflow-hidden border-t border-white/5">
                <div className="container mx-auto px-6 flex flex-col items-center justify-center">
                    {/* Line 1 - Subtle and Light - No Stars version */}
                    <div className="mb-2">
                        <h3 className="text-white text-center font-outfit font-extralight text-lg md:text-xl lg:text-2xl opacity-90 tracking-wide">
                            {text}
                        </h3>
                    </div>
                    
                    {/* Line 2 - Impactful and Bold - Refined Proportions */}
                    <h2 className="text-white text-center font-outfit font-bold text-xl md:text-4xl lg:text-5xl leading-snug md:leading-relaxed max-w-5xl mt-8 md:mt-10 drop-shadow-2xl">
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
                
                <h2 className="text-white text-center font-outfit font-semibold text-2xl md:text-4xl lg:text-5xl leading-tight tracking-tight max-w-5xl uppercase px-4 drop-shadow-2xl">
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
