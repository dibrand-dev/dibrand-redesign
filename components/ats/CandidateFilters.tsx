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
    allSkills: string[];
    currentUser?: any;
}

export default function CandidateFilters({ jobs, countries, statuses, recruiters, allSkills, currentUser }: CandidateFiltersProps) {
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
    const currentSkills = searchParams.get('skills')?.split(',').filter(Boolean) || [];

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

    const toggleSkill = (skill: string) => {
        const params = new URLSearchParams(searchParams.toString());
        let newSkills;
        if (currentSkills.includes(skill)) {
            newSkills = currentSkills.filter(s => s !== skill);
        } else {
            newSkills = [...currentSkills, skill];
        }
        
        if (newSkills.length > 0) {
            params.set('skills', newSkills.join(','));
        } else {
            params.delete('skills');
        }
        params.set('page', '1');
        router.push(`/ats/candidates?${params.toString()}`);
    };

    const clearFilters = () => {
        router.push('/ats/candidates');
        setOpenDropdown(null);
    };

    const Dropdown = ({ label, current, options, filterKey, type = 'list' }: any) => {
        const isOpen = openDropdown === filterKey;
        const isMulti = filterKey === 'skills';
        const [searchTerm, setSearchTerm] = useState('');
        
        const filteredOptions = options.filter((opt: any) => {
            const label = typeof opt === 'string' ? opt : (opt.label || opt.full_name);
            return label.toLowerCase().includes(searchTerm.toLowerCase());
        });
        
        // Complex label logic for Recruiter Initialization
        let displayLabel = 'Todos';
        if (isMulti && currentSkills.length > 0) {
            displayLabel = `${currentSkills.length} seleccionados`;
        } else if (current) {
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
                        className={`flex items-center justify-between gap-4 py-2 px-0 text-[13px] font-bold transition-all border-b-2 ${isOpen || (isMulti ? currentSkills.length > 0 : current) ? 'text-[#0040A1] border-[#0040A1]' : 'text-[#010101] border-transparent hover:border-slate-200'}`}
                    >
                        <span className="truncate">{displayLabel}</span>
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {isOpen && (
                    <div className="absolute top-full left-0 z-50 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-2 animate-in fade-in zoom-in-95 duration-200 origin-top-left">
                        {isMulti && (
                            <div className="px-2 py-2 mb-2 border-b border-slate-100">
                                <input 
                                    type="text"
                                    placeholder="Buscar tecnología..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[12px] focus:outline-none focus:border-[#0040A1] transition-all"
                                />
                            </div>
                        )}
                        <div className="max-h-64 overflow-y-auto custom-scrollbar">
                            {!isMulti && (
                                <button 
                                    onClick={() => updateFilter(filterKey, '')}
                                    className="w-full flex items-center justify-between px-3 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors group"
                                >
                                    {filterKey === 'status' ? 'Todas las Etapas' : (filterKey === 'jobId' ? 'Todas las Vacantes' : (filterKey === 'recruiterId' ? 'Todos los Reclutadores' : 'Todos'))}
                                    {!current && <Check size={14} className="text-[#0040A1]" />}
                                </button>
                            )}
                            {filteredOptions.map((opt: any) => {
                                const id = typeof opt === 'string' ? opt : (opt.id || opt.user_id);
                                const label = typeof opt === 'string' ? opt : (opt.label || opt.full_name);
                                const isSelected = isMulti ? currentSkills.includes(id) : current === id;
                                
                                return (
                                    <button 
                                        key={id}
                                        onClick={() => isMulti ? toggleSkill(id) : updateFilter(filterKey, id)}
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
        <div className="flex flex-col mb-12">
            <div className="flex flex-wrap items-center justify-between gap-8 py-6 border-y border-[#F1F5F9]" ref={dropdownRef}>
                <div className="flex flex-wrap items-center gap-10">
                    <Dropdown 
                        label="Vacante" 
                        current={currentJob} 
                        options={jobs} 
                        filterKey="jobId" 
                        type="jobs"
                    />
                    
                    <Dropdown 
                        label="Tech Stack" 
                        current={currentSkills} 
                        options={allSkills} 
                        filterKey="skills" 
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
                
                {(currentJob || currentCountry || currentStatus || currentRecruiter || currentSkills.length > 0) && (
                    <button 
                        onClick={clearFilters}
                        className="flex items-center gap-1.5 text-[11px] font-black text-[#6B7485] hover:text-red-500 transition-colors uppercase tracking-widest py-2"
                    >
                        <X size={14} strokeWidth={3} /> Limpiar Filtros
                    </button>
                )}
            </div>

            {/* Active Skill Chips */}
            {currentSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                    {currentSkills.map(skill => (
                        <div 
                            key={skill}
                            className="flex items-center gap-2 px-3 py-1 bg-[#EBF1FF] text-[#0040A1] text-[11px] font-bold rounded-full border border-[#D0DFFF]"
                        >
                            {skill}
                            <button onClick={() => toggleSkill(skill)} className="hover:text-red-500 transition-colors">
                                <X size={12} strokeWidth={3} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
