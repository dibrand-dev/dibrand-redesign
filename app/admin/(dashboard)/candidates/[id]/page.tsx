import React from 'react';
import Link from 'next/link';
import { getCandidateById } from '../actions';
import StatusSelector from '../StatusSelector';
import CandidateContent from '../CandidateContent';
import { ArrowLeft } from 'lucide-react';

export default async function CandidateDetailPage(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params;
    const candidate = await getCandidateById(id);

    if (!candidate) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <h2 className="text-2xl font-bold text-corporate-grey">Candidato no encontrado</h2>
                <Link href="/admin/candidates" className="text-primary hover:underline flex items-center gap-2">
                    <ArrowLeft size={18} /> Volver al listado
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen -m-8 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row min-h-screen">

                {/* COLUMNA IZQUIERDA (65%) — Client Interactive */}
                <div className="lg:w-[65%] border-r border-gray-100 p-8 lg:p-12">
                    <CandidateContent candidate={candidate} />
                </div>

                {/* COLUMNA DERECHA (35%) — Static sidebar */}
                <div className="lg:w-[35%] bg-gray-50/50 p-8 lg:p-12 space-y-12">

                    {/* Pipeline Status */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Pipeline</span>
                            <h2 className="text-3xl font-bold text-corporate-grey leading-tight">
                                {candidate.job?.title || 'General Application'}
                            </h2>
                        </div>

                        <div className="p-6 bg-white rounded-2xl border border-gray-100 space-y-4">
                            <div className="text-sm font-bold text-corporate-grey">Candidate Status</div>
                            <StatusSelector candidateId={candidate.id} currentStatus={candidate.status} />
                            <p className="text-[10px] text-gray-400 leading-normal">
                                Updating the status will notify the hiring team and update the CRM records.
                            </p>
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="pt-4 space-y-4">
                        <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                            <span>Applied On</span>
                            <span className="text-corporate-grey uppercase" suppressHydrationWarning>
                                {new Date(candidate.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                            <span>Application Source</span>
                            <span className="text-corporate-grey uppercase">{candidate.source}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                            <span>Candidate ID</span>
                            <span className="text-corporate-grey uppercase font-mono">#{candidate.id.split('-')[0]}</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
