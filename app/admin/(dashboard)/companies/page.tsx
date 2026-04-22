'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Building2, User, Mail, Phone, ChevronRight, Loader2 } from 'lucide-react';
import { getCompanies } from './actions';

export default function CompaniesPage() {
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const data = await getCompanies();
                setCompanies(data);
            } catch (error) {
                console.error('Error fetching companies:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    const filteredCompanies = companies.filter(c => 
        c.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.company_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.contact_name && c.contact_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-brand" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[32px] font-bold text-[#191C1D] tracking-tight">Gestión de Empresas</h1>
                    <p className="text-[#737785] text-[15px]">Administra tus clientes y vincula sus vacantes de forma privada.</p>
                </div>
                <Link 
                    href="/admin/companies/new"
                    className="flex items-center gap-2 bg-[#0040A1] text-white px-5 py-2.5 rounded-full text-[14px] font-bold hover:bg-[#003380] transition-all shadow-lg shadow-blue-900/10 active:scale-95"
                >
                    <Plus size={18} />
                    Nueva Empresa
                </Link>
            </div>

            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#0040A1] transition-colors" size={20} />
                <input 
                    type="text" 
                    placeholder="Buscar por nombre, código o contacto..."
                    className="w-full bg-white border border-[#E2E8F0] rounded-2xl py-4 pl-12 pr-4 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0040A1]/20 focus:border-[#0040A1] transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-[#E2E8F0] bg-slate-50">
                                <th className="px-6 py-4 text-[10px] font-black text-[#737785] tracking-widest uppercase">Código</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[#737785] tracking-widest uppercase">Empresa / Contacto</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[#737785] tracking-widest uppercase">Email / Teléfono</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[#737785] tracking-widest uppercase">Vacantes</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[#737785] tracking-widest uppercase">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCompanies.length > 0 ? (
                                filteredCompanies.map((company) => (
                                    <tr key={company.id} className="border-b border-[#E2E8F0] hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="bg-[#D6E3FB] text-[#0040A1] px-3 py-1 rounded-full text-[11px] font-black tracking-widest">
                                                {company.company_code}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-[15px] font-bold text-[#191C1D]">{company.company_name}</span>
                                                <span className="text-[13px] text-[#737785] flex items-center gap-1.5">
                                                    <User size={12} /> {company.contact_name || 'N/A'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-[13px] text-[#191C1D] flex items-center gap-1.5">
                                                    <Mail size={12} className="text-[#737785]" /> {company.email || '-'}
                                                </span>
                                                <span className="text-[13px] text-[#191C1D] flex items-center gap-1.5">
                                                    <Phone size={12} className="text-[#737785]" /> {company.phone || company.mobile || '-'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[13px] font-bold text-[#191C1D]">
                                            {company.job_openings?.length || 0}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link 
                                                href={`/admin/companies/${company.id}`}
                                                className="text-[#0040A1] hover:underline flex items-center gap-1 text-[13px] font-bold"
                                            >
                                                Ver Detalles
                                                <ChevronRight size={14} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-[#737785] italic">
                                        No se encontraron empresas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
