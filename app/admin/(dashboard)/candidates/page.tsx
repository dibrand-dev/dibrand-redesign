import Link from 'next/link';
import { getCandidates, updateCandidateStatus } from './actions';
import { User, Briefcase, MapPin, Tag, Search, Filter, ExternalLink } from 'lucide-react';
import StatusSelector from './StatusSelector';
import CandidateFilters from './CandidateFilters';
import DeleteCandidateButton from './DeleteCandidateButton';
import AdminCandidateMobileCard from './AdminCandidateMobileCard';

export default async function CandidatesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const search = typeof params.search === 'string' ? params.search : '';
    const status = typeof params.status === 'string' ? params.status : 'all';

    const candidates = await getCandidates({ search, status });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-admin-text-primary tracking-tight uppercase">Candidatos <span className="text-admin-accent opacity-50 sm:inline hidden">(Mini-ATS)</span></h2>
                    <p className="text-admin-text-secondary text-xs sm:text-sm font-medium italic">Gestiona las aplicaciones y el pipeline de talento</p>
                </div>
            </div>

            <CandidateFilters search={search} status={status} />

            {/* Mobile View: Cards */}
            <div className="lg:hidden grid grid-cols-1 gap-4">
                {candidates.map((candidate) => (
                    <AdminCandidateMobileCard key={candidate.id} candidate={candidate} />
                ))}
                {candidates.length === 0 && (
                    <div className="bg-admin-card-bg rounded-xl p-10 text-center text-admin-text-secondary italic font-medium border border-admin-border">
                        No se encontraron candidatos
                    </div>
                )}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden lg:block bg-admin-card-bg rounded-xl shadow-sm border border-admin-border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-admin-bg/50 border-b border-admin-border">
                        <tr>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Candidato</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Puesto / Origen</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Stack</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Estado</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-admin-border">
                        {candidates.map((candidate) => (
                            <tr key={candidate.id} className="hover:bg-admin-bg/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-admin-bg border border-admin-border flex items-center justify-center text-admin-accent font-black text-sm uppercase">
                                            {candidate.full_name?.charAt(0)}
                                        </div>
                                        <div>
                                            <Link href={`/admin/candidates/${candidate.id}`} className="font-bold text-admin-text-primary hover:text-admin-accent transition-colors">
                                                {candidate.full_name}
                                            </Link>
                                            <div className="text-[10px] text-admin-text-secondary font-medium italic">{candidate.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1.5 text-sm font-bold text-admin-text-primary">
                                            <Briefcase size={14} className="text-gray-400" />
                                            {candidate.job?.title || 'General Application'}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] text-admin-text-secondary font-medium tracking-wider uppercase italic">
                                            <MapPin size={14} className="text-gray-400 font-bold" />
                                            {candidate.country}, {candidate.state_province}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                                        {candidate.stack_names?.map((name: string) => (
                                            <span key={name} className="px-2 py-0.5 bg-admin-bg text-admin-text-secondary rounded border border-admin-border text-[9px] font-black uppercase tracking-widest">
                                                {name}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={candidate.status} />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3 text-right">
                                        <StatusSelector candidateId={candidate.id} currentStatus={candidate.status} />
                                        <Link
                                            href={`/admin/candidates/${candidate.id}`}
                                            className="p-2 text-gray-400 hover:text-admin-accent hover:bg-admin-accent/5 rounded-xl transition-all"
                                            title="Ver Perfil"
                                        >
                                            <ExternalLink size={18} />
                                        </Link>
                                        <DeleteCandidateButton 
                                            candidateId={candidate.id} 
                                            candidateName={candidate.full_name} 
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {candidates.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-admin-text-secondary italic font-medium">
                                    No se encontraron candidatos
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div >
    );
}

function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        'New': 'bg-blue-100 text-blue-700',
        'Screening': 'bg-purple-100 text-purple-700',
        'Interview': 'bg-orange-100 text-orange-700',
        'Offered': 'bg-green-100 text-green-700',
        'Rejected': 'bg-red-100 text-red-700',
    };

    return (
        <span className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-black tracking-widest shadow-sm ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
}
