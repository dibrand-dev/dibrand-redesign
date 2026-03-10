import Sidebar from './Sidebar';
import Image from 'next/image';
import { Search, Bell, Calendar, User, ChevronDown, LayoutGrid } from 'lucide-react';
import { createClient } from '@/lib/supabase-server-client';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const meta = user?.user_metadata || {};
    const avatarUrl = meta.avatar_url || null;
    const name = meta.first_name ? `${meta.first_name} ${meta.last_name || ''}` : user?.email?.split('@')[0] || 'Admin';
    const role = meta.role || 'Administrator';
    const initials = (
        (meta.first_name?.[0] || '') + (meta.last_name?.[0] || '')
    ).toUpperCase() || user?.email?.[0].toUpperCase() || 'A';

    const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <div className="min-h-screen bg-admin-bg flex font-sans text-admin-text-primary antialiased">
            {/* Sidebar component */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Refined Header */}
                <header className="h-20 bg-admin-card-bg border-b border-admin-border flex items-center justify-between px-8 shrink-0 z-20 transition-colors duration-300">
                    <div className="flex items-center gap-8 flex-1">
                        {/* Search Bar */}
                        <div className="relative w-full max-w-md group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-admin-accent transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search anything's..."
                                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:outline-none focus:bg-white focus:border-admin-accent/30 focus:ring-4 focus:ring-admin-accent/5 transition-all"
                            />
                        </div>

                        {/* Leads Placeholder Badge from ref */}
                        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
                            <span className="text-[11px] font-bold text-admin-text-secondary uppercase tracking-wider">Today New Leads</span>
                            <span className="w-6 h-6 flex items-center justify-center bg-admin-accent/10 text-admin-accent rounded-full text-xs font-bold">27</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 pl-6">
                        {/* Working Theme Toggle */}
                        <ThemeToggle />

                        <div className="flex items-center gap-3 border-x border-admin-border/50 px-6">
                            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors text-gray-500 relative">
                                <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></div>
                                <LayoutGrid size={20} />
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors text-gray-500">
                                <Bell size={20} />
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors text-gray-500">
                                <Calendar size={20} />
                            </button>
                        </div>

                        {/* User Profile */}
                        <UserMenu
                            name={name}
                            role={role}
                            initials={initials}
                            avatarUrl={avatarUrl}
                        />
                    </div>
                </header>

                <div className="flex-1 overflow-auto bg-admin-bg p-8 custom-scrollbar">
                    {children}
                </div>
            </main>
        </div>
    );
}
