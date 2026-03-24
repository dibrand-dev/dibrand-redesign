'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronRight, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface CandidateName {
    id: string;
    name: string;
    email: string;
}

interface SearchTalentPredictiveProps {
    candidates: CandidateName[];
    initialQuery?: string;
}

export default function SearchTalentPredictive({ candidates, initialQuery = '' }: SearchTalentPredictiveProps) {
    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<CandidateName[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (query.trim().length > 1) {
            const filtered = candidates.filter(c => 
                c.name.toLowerCase().includes(query.toLowerCase()) ||
                c.email.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 8);
            setResults(filtered);
            setIsOpen(true);
        } else {
            setResults([]);
            setIsOpen(false);
        }
    }, [query, candidates]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (candidateId: string) => {
        router.push(`/ats/candidates/${candidateId}`);
        setIsOpen(false);
        setQuery('');
    };

    return (
        <div className="relative group w-full md:w-80" ref={containerRef}>
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7485] group-focus-within:text-[#0040A1] transition-colors" size={18} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search talent..."
                    className="w-full pl-12 pr-4 py-3 bg-[#F8FAFC] border border-[#E1E2E5] rounded-xl text-[13px] font-medium focus:outline-none focus:border-[#0040A1] focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-[#A1A5B7]"
                    onFocus={() => query.trim().length > 1 && setIsOpen(true)}
                />
            </div>

            <AnimatePresence>
                {isOpen && results.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-md border border-[#E2E8F0] rounded-2xl shadow-2xl p-3 z-50 overflow-hidden"
                    >
                        <div className="text-[10px] font-bold text-[#A1A5B7] uppercase tracking-widest px-3 py-2 border-b border-[#F1F5F9] mb-2">
                            Suggested Candidates
                        </div>
                        <div className="space-y-1 max-h-[320px] overflow-y-auto custom-scrollbar">
                            {results.map((candidate) => (
                                <button
                                    key={candidate.id}
                                    onClick={() => handleSelect(candidate.id)}
                                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#F8FAFC] transition-all group/item text-left border border-transparent hover:border-[#E2E8F0]"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0040A1] flex items-center justify-center border border-blue-100 group-hover/item:bg-[#0040A1] group-hover/item:text-white transition-colors">
                                            <User size={14} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[13px] font-bold text-[#191C1D] group-hover/item:text-[#0040A1] transition-colors">{candidate.name}</span>
                                            <span className="text-[11px] text-[#6B7485]">{candidate.email}</span>
                                        </div>
                                    </div>
                                    <ChevronRight size={14} className="text-[#A1A5B7] group-hover/item:text-[#0040A1] transition-all transform translate-x-0 group-hover/item:translate-x-1" />
                                </button>
                            ))}
                        </div>
                        {results.length === 8 && (
                           <div className="mt-2 pt-2 border-t border-[#F1F5F9] text-center">
                               <span className="text-[10px] text-[#A1A5B7] font-medium italic">Keep typing to refine search...</span>
                           </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
