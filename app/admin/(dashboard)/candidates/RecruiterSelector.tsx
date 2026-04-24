'use client';

import React, { useState, useEffect } from 'react';
import { User, Loader2, Check } from 'lucide-react';
import { getRecruiters } from '../users/actions';
import { updateCandidateRecruiter } from './actions';

interface RecruiterSelectorProps {
    candidateId: string;
    currentRecruiterId?: string;
}

export default function RecruiterSelector({ candidateId, currentRecruiterId }: RecruiterSelectorProps) {
    const [recruiters, setRecruiters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedId, setSelectedId] = useState(currentRecruiterId || '');

    useEffect(() => {
        async function fetchRecruiters() {
            try {
                const data = await getRecruiters();
                setRecruiters(data);
            } catch (err) {
                console.error('Error fetching recruiters:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchRecruiters();
    }, []);

    const handleChange = async (newId: string) => {
        setSaving(true);
        setSelectedId(newId);
        try {
            await updateCandidateRecruiter(candidateId, newId || null);
        } catch (err) {
            console.error('Error updating recruiter:', err);
            setSelectedId(currentRecruiterId || '');
            alert('Error al asignar el reclutador.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="animate-pulse h-10 bg-slate-100 rounded-xl w-full"></div>;

    return (
        <div className="space-y-3">
            <div className="text-[11px] font-black text-admin-text-primary uppercase tracking-widest flex items-center gap-2">
                <User size={14} className="text-admin-accent" />
                Reclutador Asignado
            </div>
            
            <div className="relative">
                <select
                    value={selectedId}
                    onChange={(e) => handleChange(e.target.value)}
                    disabled={saving}
                    className="w-full px-4 py-3 bg-admin-bg border border-admin-border rounded-xl focus:ring-4 focus:ring-admin-accent/5 focus:border-admin-accent outline-none text-[13px] font-bold transition-all appearance-none cursor-pointer disabled:opacity-50"
                >
                    <option value="">-- Sin Asignar --</option>
                    {recruiters.map(r => (
                        <option key={r.id} value={r.id}>
                            {r.full_name}
                        </option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    {saving ? (
                        <Loader2 size={14} className="animate-spin text-admin-accent" />
                    ) : (
                        <div className="flex flex-col gap-0.5">
                            <div className="w-1.5 h-1.5 border-r-2 border-b-2 border-slate-400 rotate-45"></div>
                        </div>
                    )}
                </div>
            </div>
            
            <p className="text-[10px] text-admin-text-secondary/60 italic font-medium">
                El reclutador asignado recibirá alertas sobre notas y cambios de estado.
            </p>
        </div>
    );
}
