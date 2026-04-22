'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getCompany } from '../actions';
import CompanyForm from '../CompanyForm';
import { Loader2, Briefcase, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function CompanyDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [company, setCompany] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const data = await getCompany(id);
                setCompany(data);
            } catch (error) {
                console.error('Error fetching company:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchCompany();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-brand" size={32} />
            </div>
        );
    }

    if (!company) {
        return <div>Empresa no encontrada</div>;
    }

    return (
        <div className="space-y-12 pb-20">
            <div className="container mx-auto">
                <CompanyForm initialData={company} isEditing={true} />
            </div>

            {/* Optional: List of active jobs for this company */}
            <div className="bg-white p-8 rounded-3xl border border-[#E2E8F0] space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                            <Briefcase size={18} />
                        </div>
                        <h2 className="text-[14px] font-black text-[#191C1D] tracking-widest uppercase">VACANTES VINCULADAS</h2>
                    </div>
                    <span className="text-[12px] font-bold text-[#737785] bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
                        {company.job_openings?.length || 0} Vacantes totales
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {company.job_openings && company.job_openings.length > 0 ? (
                        company.job_openings.map((job: any) => (
                            <div key={job.id} className="border border-[#F1F5F9] rounded-2xl p-5 hover:shadow-md transition-all group">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-[15px] font-bold text-[#191C1D] leading-tight group-hover:text-brand transition-colors">
                                        {job.title}
                                    </h3>
                                    <Link href={`/admin/jobs/${job.id}`} className="text-[#737785] hover:text-brand">
                                        <ExternalLink size={14} />
                                    </Link>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${job.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                    <span className="text-[12px] font-medium text-[#737785]">
                                        {job.is_active ? 'Activa' : 'Pausada'}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-10 text-center text-[#737785] italic">
                            Esta empresa aún no tiene vacantes publicadas.
                        </div>
                    )}
                </div>
                
                <div className="pt-4 flex justify-center">
                    <Link 
                        href={`/admin/jobs/new?company_id=${company.id}`}
                        className="text-[#0040A1] text-[13px] font-bold hover:underline"
                    >
                        + Crear nueva vacante para esta empresa
                    </Link>
                </div>
            </div>
        </div>
    );
}
