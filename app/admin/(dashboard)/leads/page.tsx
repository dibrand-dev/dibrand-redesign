import { getLeads } from './actions';
import LeadsList from './LeadsList';
import { Mailbox } from 'lucide-react';

export const metadata = {
    title: 'Leads | Dibrand Admin',
};

export default async function LeadsPage() {
    const leads = await getLeads();

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 font-outfit">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                        <Mailbox size={20} />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Leads</h1>
                </div>
                <p className="text-slate-500 font-medium text-sm">
                    Gestiona los contactos entrantes de la web.
                </p>
            </div>

            <LeadsList initialLeads={leads} />
        </div>
    );
}
