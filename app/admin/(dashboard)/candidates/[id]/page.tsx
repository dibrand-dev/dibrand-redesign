import React from 'react';
import Link from 'next/link';
import { getCandidateById } from '../actions';
import StatusSelector from '../StatusSelector';
import CandidateContent from '../CandidateContent';
import DeleteCandidateButton from '../DeleteCandidateButton';
import { ArrowLeft, Trash2 } from 'lucide-react';

export default async function CandidateDetailPage(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params;
    const candidate = await getCandidateById(id);

    if (!candidate) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 animate-in fade-in duration-700">
                <div className="w-20 h-20 rounded-full bg-admin-card-bg border border-admin-border flex items-center justify-center shadow-xl">
                    <ArrowLeft size={32} className="text-admin-text-secondary opacity-20" />
                </div>
                <h2 className="text-2xl font-black text-admin-text-primary uppercase tracking-tight">Candidato no encontrado</h2>
                <Link href="/admin/candidates" className="px-6 py-2 bg-admin-accent text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-admin-accent/20">
                    Volver al listado
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-admin-bg min-h-screen -m-8 animate-in fade-in duration-700">
            <div className="flex flex-col lg:flex-row min-h-screen">

                {/* COLUMNA IZQUIERDA (65%) — Client Interactive */}
                <div className="lg:w-[65%] border-r border-admin-border p-8 lg:p-12">
                    <CandidateContent candidate={candidate} />
                </div>

                {/* COLUMNA DERECHA (35%) — Static sidebar */}
                <div className="lg:w-[35%] bg-admin-card-bg/30 p-8 lg:p-12 space-y-12">

                    {/* Pipeline Status */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Active Pipeline</span>
                            <h2 className="text-3xl font-black text-admin-text-primary leading-tight tracking-tight uppercase">
                                {candidate.job?.title || 'General Application'}
                            </h2>
                        </div>

                        <div className="p-8 bg-admin-card-bg rounded-2xl border border-admin-border space-y-6 shadow-xl shadow-black/5">
                            <div className="text-[11px] font-black text-admin-text-primary uppercase tracking-widest flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-admin-accent animate-pulse"></div>
                                Candidate Status
                            </div>
                            <StatusSelector candidateId={candidate.id} currentStatus={candidate.status} />
                            <p className="text-[10px] text-admin-text-secondary/60 leading-relaxed italic font-medium">
                                Updating the status will notify the hiring team and update the CRM records.
                            </p>
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="pt-8 space-y-6 border-t border-admin-border/50">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Applied On</span>
                            <span className="text-xs font-bold text-admin-text-primary uppercase" suppressHydrationWarning>
                                {new Date(candidate.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Source</span>
                            <span className="text-xs font-bold text-admin-text-primary uppercase">{candidate.source}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ID Reference</span>
                            <span className="text-[10px] text-admin-text-secondary/50 uppercase font-mono bg-admin-bg px-2 py-1 rounded border border-admin-border/50 font-bold">#{candidate.id.split('-')[0]}</span>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="pt-8 space-y-6 border-t border-red-500/20">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-red-500/60 uppercase tracking-widest flex items-center gap-2">
                                <Trash2 size={10} />
                                Danger Zone
                            </span>
                            <p className="text-[10px] text-admin-text-secondary/40 font-medium italic">
                                Permanent candidate deletion
                            </p>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-red-500/5 rounded-xl border border-red-500/10 transition-all hover:bg-red-500/10">
                            <span className="text-[11px] font-bold text-admin-text-primary uppercase tracking-tight">Delete Profile</span>
                            <DeleteCandidateButton candidateId={candidate.id} candidateName={candidate.full_name} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
