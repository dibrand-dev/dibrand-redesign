'use client';

import React, { useState, useEffect, useRef } from 'react';
import { updateCandidateSkills, getGlobalSkills } from '@/app/ats/actions';
import { X, Plus, Loader2 } from 'lucide-react';

interface CandidateSkillsProps {
    candidateId: string;
    initialSkills: string[];
}

export default function CandidateSkills({ candidateId, initialSkills }: CandidateSkillsProps) {
    const [skills, setSkills] = useState(initialSkills || []);
    const [globalSkills, setGlobalSkills] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchGlobal = async () => {
            const result = await getGlobalSkills();
            setGlobalSkills(result);
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
        const trimmed = skill.trim().toUpperCase();
        if (trimmed && !skills.includes(trimmed)) {
            const nextSkills = [...skills, trimmed];
            setIsSaving(true);
            try {
                await updateCandidateSkills(candidateId, nextSkills);
                setSkills(nextSkills);
                setInputValue('');
                setShowSuggestions(false);
            } catch (error) {
                console.error('Error adding skill:', error);
                alert('Failed to update skills.');
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleRemoveSkill = async (skillToRemove: string) => {
        const nextSkills = skills.filter(s => s !== skillToRemove);
        setIsSaving(true);
        try {
            await updateCandidateSkills(candidateId, nextSkills);
            setSkills(nextSkills);
        } catch (error) {
            console.error('Error removing skill:', error);
            alert('Failed to update skills.');
        } finally {
            setIsSaving(false);
        }
    };

    const suggestions = globalSkills
        .filter(s => !skills.includes(s.toUpperCase()))
        .filter(s => s.toLowerCase().includes(inputValue.toLowerCase()))
        .slice(0, 5);

    return (
        <section className="bg-white rounded-[12px] p-8 border border-[#E2E8F0] shadow-sm relative">
            <h3 className="text-[11px] font-black text-[#6B7485] uppercase tracking-[0.2em] mb-8">Core Competencies</h3>
            
            <div className="flex flex-wrap gap-2 mb-6">
                {skills.map((skill) => (
                    <span 
                        key={skill} 
                        className="px-4 py-2 bg-[#0040A1] text-white text-[10px] font-black rounded-lg uppercase tracking-widest shadow-sm flex items-center gap-2 group animate-in zoom-in-90 duration-200"
                    >
                        {skill}
                        <button 
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-[#A1C5FF] hover:text-white transition-colors"
                        >
                            <X size={12} />
                        </button>
                    </span>
                ))}
            </div>

            {/* Add New Skill Input */}
            <div className="relative">
                <div className="relative">
                    <input 
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleAddSkill(inputValue);
                            }
                        }}
                        disabled={isSaving}
                        className="w-full h-[56px] pl-12 pr-12 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl text-[14px] font-medium text-[#191C1D] focus:outline-none focus:border-[#0040A1] transition-all disabled:opacity-50"
                        placeholder="Add Tech Stack (e.g. REACT)..."
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A5B7]">
                        {isSaving ? <Loader2 size={18} className="animate-spin text-[#0040A1]" /> : <Plus size={20} />}
                    </div>
                </div>

                {/* Suggestions List */}
                {showSuggestions && (inputValue.length > 0 || suggestions.length > 0) && (
                    <div 
                        ref={suggestionsRef}
                        className="absolute left-0 right-0 top-full mt-2 bg-white border border-[#E1E2E5] rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                        {suggestions.map((s) => (
                            <button
                                key={s}
                                onClick={() => handleAddSkill(s)}
                                className="w-full px-5 py-3 text-left text-[13px] font-bold text-[#191C1D] hover:bg-[#F1F5F9] transition-colors flex items-center justify-between group"
                            >
                                {s.toUpperCase()}
                                <Plus size={14} className="text-[#A1A5B7] group-hover:text-[#0040A1]" />
                            </button>
                        ))}
                        {inputValue && !suggestions.some(s => s.toUpperCase() === inputValue.toUpperCase()) && (
                            <button
                                onClick={() => handleAddSkill(inputValue)}
                                className="w-full px-5 py-3 text-left text-[13px] font-bold text-[#0040A1] bg-[#DAE2FF]/20 hover:bg-[#DAE2FF]/40 border-t border-[#F1F5F9] transition-colors flex items-center justify-between"
                            >
                                CREATE "{inputValue.toUpperCase()}"
                                <Plus size={14} />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
