'use client'

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface FilterOption {
    id: string;
    label: string;
}

interface CandidateFiltersProps {
    jobs: FilterOption[];
    countries: string[];
    statuses: string[];
}

export default function CandidateFilters({ jobs, countries, statuses }: CandidateFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Dropdown states
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Current values from URL
    const currentJob = searchParams.get('jobId') || '';
    const currentCountry = searchParams.get('country') || '';
    const currentStatus = searchParams.get('status') || '';

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set('page', '1'); // Reset to page 1 on filter
        router.push(`/ats/candidates?${params.toString()}`);
        setOpenDropdown(null);
    };

    const clearFilters = () => {
        router.push('/ats/candidates');
        setOpenDropdown(null);
    };

    const Dropdown = ({ label, current, options, filterKey, type = 'list' }: any) => {
        const isOpen = openDropdown === filterKey;
        const displayLabel = current ? (type === 'jobs' ? options.find((o: any) => o.id === current)?.label : current) : 'All';

        return (
            <div className="relative">
                <div className="flex flex-col gap-1.5 min-w-[120px]">
                    <label className="text-[10px] font-bold text-[#6B7485] uppercase tracking-widest pl-0.5">{label}</label>
                    <button 
                        onClick={() => setOpenDropdown(isOpen ? null : filterKey)}
                        className={`flex items-center justify-between gap-4 py-2 px-0 text-[13px] font-bold transition-all border-b-2 ${isOpen || current ? 'text-[#0040A1] border-[#0040A1]' : 'text-[#010101] border-transparent hover:border-slate-200'}`}
                    >
                        <span className="truncate">{displayLabel}</span>
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {isOpen && (
                    <div className="absolute top-full left-0 z-50 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-2 animate-in fade-in zoom-in-95 duration-200 origin-top-left">
                        <div className="max-h-64 overflow-y-auto custom-scrollbar">
                            <button 
                                onClick={() => updateFilter(filterKey, '')}
                                className="w-full flex items-center justify-between px-3 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors group"
                            >
                                All {filterKey === 'status' ? 'Stages' : ''}
                                {!current && <Check size={14} className="text-[#0040A1]" />}
                            </button>
                            {options.map((opt: any) => {
                                const id = typeof opt === 'string' ? opt : opt.id;
                                const label = typeof opt === 'string' ? opt : opt.label;
                                const isSelected = current === id;
                                
                                return (
                                    <button 
                                        key={id}
                                        onClick={() => updateFilter(filterKey, id)}
                                        className="w-full flex items-center justify-between px-3 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors group"
                                    >
                                        <span className={isSelected ? 'text-[#0040A1] font-bold' : ''}>{label}</span>
                                        {isSelected && <Check size={14} className="text-[#0040A1]" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-wrap items-center justify-between gap-8 mb-12 py-6 border-y border-[#F1F5F9]" ref={dropdownRef}>
            <div className="flex flex-wrap items-center gap-10">
                <Dropdown 
                    label="Job Role" 
                    current={currentJob} 
                    options={jobs} 
                    filterKey="jobId" 
                    type="jobs"
                />
                
                <Dropdown 
                    label="Location" 
                    current={currentCountry} 
                    options={countries} 
                    filterKey="country" 
                />
                
                <Dropdown 
                    label="Application Stage" 
                    current={currentStatus} 
                    options={statuses} 
                    filterKey="status" 
                />
            </div>
            
            {(currentJob || currentCountry || currentStatus) && (
                <button 
                    onClick={clearFilters}
                    className="flex items-center gap-1.5 text-[11px] font-black text-[#6B7485] hover:text-red-500 transition-colors uppercase tracking-widest py-2"
                >
                    <X size={14} strokeWidth={3} /> Clear filters
                </button>
            )}
        </div>
    );
}
