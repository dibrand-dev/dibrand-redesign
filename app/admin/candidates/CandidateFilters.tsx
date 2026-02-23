'use client'

import { Search, Filter } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CandidateFilters({ search, status }: { search: string, status: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newParams = new URLSearchParams(searchParams.toString());
        const val = formData.get('search') as string;
        if (val) newParams.set('search', val);
        else newParams.delete('search');
        router.push(`?${newParams.toString()}`);
    };

    const handleStatusChange = (val: string) => {
        const newParams = new URLSearchParams(searchParams.toString());
        if (val !== 'all') newParams.set('status', val);
        else newParams.delete('status');
        router.push(`?${newParams.toString()}`);
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <form onSubmit={handleSearch}>
                    <input
                        name="search"
                        defaultValue={search}
                        type="text"
                        placeholder="Buscar por nombre o email..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                </form>
            </div>
            <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-400" />
                <select
                    value={status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
                >
                    <option value="all">Todos los estados</option>
                    <option value="New">Nuevo</option>
                    <option value="Screening">Screening</option>
                    <option value="Interview">Entrevista</option>
                    <option value="Offered">Ofertado</option>
                    <option value="Rejected">Rechazado</option>
                </select>
            </div>
        </div>
    );
}
