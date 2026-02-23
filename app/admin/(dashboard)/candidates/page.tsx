import Link from 'next/link';
import { getCandidates, updateCandidateStatus } from './actions';
import { User, Briefcase, MapPin, Tag, Search, Filter, ExternalLink } from 'lucide-react';
import StatusSelector from './StatusSelector';
import CandidateFilters from './CandidateFilters';

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
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-corporate-grey font-heading">Candidatos (Mini-ATS)</h2>
                    <p className="text-corporate-grey/60">Gestiona las aplicaciones y el pipeline de talento</p>
                </div>
            </div>

            <CandidateFilters search={search} status={status} />

            {/* Listado */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-corporate-grey/5 border-b">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-corporate-grey">Candidato</th>
                            <th className="px-6 py-4 font-semibold text-corporate-grey">Puesto / Origen</th>
                            <th className="px-6 py-4 font-semibold text-corporate-grey">Stack</th>
                            <th className="px-6 py-4 font-semibold text-corporate-grey">Estado</th>
                            <th className="px-6 py-4 font-semibold text-corporate-grey text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {candidates.map((candidate) => (
                            <tr key={candidate.id} className="hover:bg-corporate-grey/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-primary font-bold">
                                            {candidate.full_name?.charAt(0)}
                                        </div>
                                        <div>
                                            <Link href={`/admin/candidates/${candidate.id}`} className="font-bold text-corporate-grey hover:text-primary transition-colors">
                                                {candidate.full_name}
                                            </Link>
                                            <div className="text-xs text-corporate-grey/50">{candidate.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1.5 text-sm font-medium text-corporate-grey">
                                            <Briefcase size={14} className="text-gray-400" />
                                            {candidate.job?.title || 'General Application'}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-corporate-grey/50">
                                            <MapPin size={14} className="text-gray-400" />
                                            {candidate.country}, {candidate.state_province}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                                        {candidate.stack_names?.map((name: string) => (
                                            <span key={name} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase tracking-wider">
                                                {name}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={candidate.status} />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <StatusSelector candidateId={candidate.id} currentStatus={candidate.status} />
                                        <Link
                                            href={`/admin/candidates/${candidate.id}`}
                                            className="p-2 text-corporate-grey/40 hover:text-primary transition-colors"
                                            title="Ver Perfil"
                                        >
                                            <ExternalLink size={18} />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {candidates.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-corporate-grey/50">
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
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
            {status}
        </span>
    );
}
