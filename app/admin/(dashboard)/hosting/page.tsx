import { getHostingClients, getHostingPlans } from './actions';
import HostingDashboard from './components/HostingDashboard';

export const metadata = {
    title: 'Gestión de hosting | Dibrand Admin',
    description: 'Sistema de control de hosting bimoneda',
};

export default async function HostingPage() {
    const [clients, plans] = await Promise.all([
        getHostingClients(),
        getHostingPlans()
    ]);

    return (
        <div className="font-sans">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestión de hosting</h1>
                <p className="text-slate-500 text-sm font-medium italic mt-1">
                    Control bimoneda de planes, clientes y vencimientos.
                </p>
            </div>

            <HostingDashboard initialClients={clients} initialPlans={plans} />
        </div>
    );
}
