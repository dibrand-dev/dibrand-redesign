'use client';

import React, { useState, useEffect, useRef } from 'react';
import { updateCandidateSkills, getGlobalSkills } from '@/app/ats/actions';
import { X, Plus, Search, Loader2 } from 'lucide-react';

interface CandidateSkillsProps {
    candidateId: string;
    initialSkills: string[];
}

/**
 * Intelligent Skills Component for ATS Candidate Profile.
 * Features:
 * - Smart Tag (Chip) system with Dibrand aesthetics.
 * - Predictive Autocomplete (Combobox).
 * - Immediate association (saves to DB on add/remove).
 * - Duplicate prevention.
 */
export default function CandidateSkills({ candidateId, initialSkills }: CandidateSkillsProps) {
    const [skills, setSkills] = useState<string[]>(initialSkills || []);
    const [globalSkills, setGlobalSkills] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    // Fetch master list of skills/tech stacks
    useEffect(() => {
        const fetchGlobal = async () => {
            try {
                const result = await getGlobalSkills();
                setGlobalSkills(result || []);
            } catch (err) {
                console.error('Error fetching global skills:', err);
            }
        };
        fetchGlobal();
    }, []);

    // Close suggestions when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAddSkill = async (skill: string) => {
        const normalizedSkill = skill.trim();
        if (!normalizedSkill) return;
        
        // Prevent duplicates (case-insensitive)
        if (skills.some(s => s.toLowerCase() === normalizedSkill.toLowerCase())) {
            setInputValue('');
            setShowSuggestions(false);
            return;
        }

        const nextSkills = [...skills, normalizedSkill];
        setIsSaving(true);
        try {
            await updateCandidateSkills(candidateId, nextSkills);
            setSkills(nextSkills);
            setInputValue('');
            setShowSuggestions(false);
        } catch (error: any) {
            console.error('Error adding skill:', error);
            // In a real app we might want a toast here
        } finally {
            setIsSaving(false);
        }
    };

    const handleRemoveSkill = async (skillToRemove: string) => {
        const nextSkills = skills.filter(s => s !== skillToRemove);
        setIsSaving(true);
        try {
            await updateCandidateSkills(candidateId, nextSkills);
            setSkills(nextSkills);
        } catch (error: any) {
            console.error('Error removing skill:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const filteredSuggestions = globalSkills
        .filter(s => !skills.some(selfSkill => selfSkill.toLowerCase() === s.toLowerCase()))
        .filter(s => s.toLowerCase().includes(inputValue.toLowerCase()))
        .slice(0, 8);

    return (
        <section className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-200/60 font-sans">
            <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-5">
                Core Competencies
            </h3>

            {/* Chips Container */}
            <div className="flex flex-wrap gap-2 mb-6 min-h-[40px]">
                {skills.length > 0 ? skills.map((skill) => (
                    <div 
                        key={skill}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-lg border border-slate-200 uppercase tracking-widest transition-all duration-200 animate-in zoom-in-95 group"
                    >
                        <span className="font-sans">{skill}</span>
                        <button 
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-slate-400 hover:text-[#D83484] transition-colors"
                            disabled={isSaving}
                            aria-label={`Remove ${skill}`}
                        >
                            <X size={14} strokeWidth={3} />
                        </button>
                    </div>
                )) : (
                    <p className="text-[12px] text-slate-400 italic">No skills listed yet</p>
                )}
            </div>

            {/* Predictive Search / Autocomplete */}
            <div className="relative">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#A3369D] transition-colors" size={16} strokeWidth={3} />
                    <input 
                        type="text"
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                if (inputValue.trim()) handleAddSkill(inputValue);
                            }
                        }}
                        disabled={isSaving}
                        className="w-full h-[46px] pl-12 pr-12 bg-[#F8FAFC] border border-slate-200 rounded-xl text-[13px] font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#A3369D] focus:ring-4 focus:ring-[#A3369D]/5 transition-all font-sans"
                        placeholder={isSaving ? "Updating..." : "Search or add skill..."}
                    />
                    {isSaving && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <Loader2 size={16} className="animate-spin text-[#A3369D]" />
                        </div>
                    )}
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && (inputValue.length > 0 || filteredSuggestions.length > 0) && (
                    <div 
                        ref={suggestionsRef}
                        className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-[100] max-h-[300px] overflow-y-auto animate-in fade-in zoom-in-95 duration-100"
                    >
                        {filteredSuggestions.map((s) => (
                            <button
                                key={s}
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleAddSkill(s);
                                }}
                                className="w-full px-5 py-3 text-left text-[13px] font-bold text-slate-700 hover:bg-[#F1F5F9] hover:text-[#0040A1] transition-all flex items-center justify-between border-b border-slate-50 last:border-0"
                            >
                                <span className="font-sans">{s}</span>
                                <Plus size={14} strokeWidth={3} />
                            </button>
                        ))}
                        
                        {/* Option to create new */}
                        {inputValue && !filteredSuggestions.some(s => s.toLowerCase() === inputValue.toLowerCase()) && (
                            <button
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleAddSkill(inputValue);
                                }}
                                className="w-full px-5 py-3 text-left text-[13px] font-bold text-[#A3369D] bg-purple-50 hover:bg-purple-100 transition-all flex items-center justify-between border-t border-purple-100"
                            >
                                <span className="font-sans">Add <span className="font-black">"{inputValue}"</span></span>
                                <Plus size={14} strokeWidth={3} />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
