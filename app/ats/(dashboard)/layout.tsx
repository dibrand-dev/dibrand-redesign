import AtsSidebar from './Sidebar';
import { createClient } from '@/lib/supabase-server-client';
import { User, Bell, LayoutGrid, Calendar, LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import LogoutButton from '@/app/admin/(dashboard)/LogoutButton';

import { syncRecruiterProfile } from '../actions';

export default async function AtsDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await syncRecruiterProfile();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Recruiter';
    const initials = name[0].toUpperCase();

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 antialiased overflow-hidden h-screen">
            {/* Sidebar */}
            <AtsSidebar />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-20">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Panel de Reclutador</h1>
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-full">Recruitment Mode</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 border-r border-slate-100 pr-6 mr-6">
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400 relative">
                                <Bell size={20} />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400">
                                <LayoutGrid size={20} />
                            </button>
                        </div>

                        {/* Profile Pill */}
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">{name}</p>
                                <p className="text-[10px] text-slate-400 font-medium">Reclutador Externo</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-indigo-600/20">
                                {initials}
                            </div>
                            <LogoutButton isCollapsed={false} />
                        </div>
                    </div>
                </header>

                {/* Main Content with Scrollbar */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {children}
                </div>
            </main>
        </div>
    );
}
