'use client';

import React, { useState } from 'react';
import HostingClientsList from './HostingClientsList';
import HostingPlansList from './HostingPlansList';

interface HostingDashboardProps {
    initialClients: any[];
    initialPlans: any[];
}

export default function HostingDashboard({ initialClients, initialPlans }: HostingDashboardProps) {
    const [activeTab, setActiveTab] = useState<'clients' | 'plans'>('clients');

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex items-center gap-4 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('clients')}
                    className={`pb-4 px-2 text-sm font-bold tracking-tight transition-all border-b-2 ${
                        activeTab === 'clients'
                            ? 'border-[#9e4d97] text-[#9e4d97]'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                >
                    Clientes activos
                </button>
                <button
                    onClick={() => setActiveTab('plans')}
                    className={`pb-4 px-2 text-sm font-bold tracking-tight transition-all border-b-2 ${
                        activeTab === 'plans'
                            ? 'border-[#9e4d97] text-[#9e4d97]'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                >
                    Planes de hosting
                </button>
            </div>

            {/* Content */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                {activeTab === 'clients' ? (
                    <HostingClientsList clients={initialClients} plans={initialPlans} />
                ) : (
                    <HostingPlansList plans={initialPlans} />
                )}
            </div>
        </div>
    );
}
