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
    statuses: { id: string, label: string }[];
    recruiters: any[];
    currentUser?: any;
}

export default function CandidateFilters({ jobs, countries, statuses, recruiters, currentUser }: CandidateFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Dropdown states
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Current values from URL
    const currentJob = searchParams.get('jobId') || '';
    const currentCountry = searchParams.get('country') || '';
    const currentStatus = searchParams.get('status') || '';
    const currentRecruiter = searchParams.get('recruiterId') || '';

    const isAdmin = currentUser?.user_metadata?.role === 'admin' || currentUser?.user_metadata?.role === 'SuperAdmin';

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
        
        // Complex label logic for Recruiter Initialization
        let displayLabel = 'Todos';
        if (current) {
            if (type === 'jobs' || type === 'status') {
                displayLabel = options.find((o: any) => o.id === current)?.label || current || 'Todos';
            } else if (type === 'recruiters') {
                displayLabel = options.find((o: any) => o.id === current)?.full_name || 'Todos';
            } else {
                displayLabel = current;
            }
        } else if (type === 'recruiters' && !isAdmin && currentUser) {
            // Default to current recruiter name if not admin and no filter set
            displayLabel = currentUser.user_metadata?.full_name || currentUser.email;
        }

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
                                {filterKey === 'status' ? 'Todas las Etapas' : (filterKey === 'jobId' ? 'Todas las Vacantes' : (filterKey === 'recruiterId' ? 'Todos los Reclutadores' : 'Todos'))}
                                {!current && <Check size={14} className="text-[#0040A1]" />}
                            </button>
                            {options.map((opt: any) => {
                                const id = typeof opt === 'string' ? opt : (opt.id || opt.user_id);
                                const label = typeof opt === 'string' ? opt : (opt.label || opt.full_name);
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
                    label="Vacante" 
                    current={currentJob} 
                    options={jobs} 
                    filterKey="jobId" 
                    type="jobs"
                />
                
                <Dropdown 
                    label="Ubicación" 
                    current={currentCountry} 
                    options={countries} 
                    filterKey="country" 
                />
                
                <Dropdown 
                    label="Etapa del Proceso" 
                    current={currentStatus} 
                    options={statuses} 
                    filterKey="status" 
                    type="status"
                />

                <Dropdown 
                    label="Reclutador" 
                    current={currentRecruiter} 
                    options={recruiters} 
                    filterKey="recruiterId"
                    type="recruiters"
                />
            </div>
            
            {(currentJob || currentCountry || currentStatus || currentRecruiter) && (
                <button 
                    onClick={clearFilters}
                    className="flex items-center gap-1.5 text-[11px] font-black text-[#6B7485] hover:text-red-500 transition-colors uppercase tracking-widest py-2"
                >
                    <X size={14} strokeWidth={3} /> Limpiar Filtros
                </button>
            )}
        </div>
    );
}
