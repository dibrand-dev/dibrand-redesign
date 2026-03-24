import Sidebar from './Sidebar';
import { Search, Bell, Calendar, User, ChevronDown, LayoutGrid, HelpCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase-server-client';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';
import NotificationDropdown from '@/components/admin/NotificationDropdown';
import { startOfDay } from 'date-fns';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch daily leads count for the badge
    let todayLeads = 0;
    try {
        const todayIso = startOfDay(new Date()).toISOString();
        const { count, error } = await supabase
            .from('leads')
            .select('id', { count: 'exact', head: true })
            .gte('created_at', todayIso);
        
        if (!error) {
          todayLeads = count || 0;
        }
    } catch (e) {
        console.error('Error in today leads fetch:', e);
    }

    const meta = user?.user_metadata || {};
    const avatarUrl = meta.avatar_url || null;
    const name = meta.full_name || meta.first_name ? `${meta.first_name} ${meta.last_name || ''}` : user?.email?.split('@')[0] || 'Admin';
    const role = meta.role || 'Administrator';
    const initials = name[0].toUpperCase();

    return (
        <div className="min-h-screen bg-admin-bg flex font-inter text-admin-text-primary antialiased h-screen overflow-hidden">
            {/* Sidebar component - ATS Style */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
                
                {/* Header - Exact ATS / Figma Specs */}
                <header className="h-20 bg-admin-card-bg border-b border-admin-border flex items-center justify-between px-10 shrink-0 z-20">
                    {/* Search Bar - Figma Style */}
                    <div className="flex-1 max-w-2xl">
                        <div className="relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-admin-text-secondary group-focus-within:text-admin-accent transition-colors" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search everything..." 
                                className="w-full bg-[#F1F5F9] border border-transparent focus:bg-white focus:border-admin-accent/30 rounded-xl py-3 pl-14 pr-6 text-[13px] font-medium transition-all outline-none text-admin-text-primary"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-8 ml-8">
                        <div className="flex items-center gap-4 text-admin-text-secondary border-r border-admin-border pr-8">
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#F1F5F9] hover:text-admin-text-primary transition-all relative">
                                <Bell size={20} />
                                {todayLeads > 0 && (
                                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#B3261E] rounded-full border-2 border-white"></span>
                                )}
                            </button>
                            <ThemeToggle />
                            <NotificationDropdown />
                        </div>

                        {/* Profile Section */}
                        <div className="flex items-center gap-4 group cursor-pointer">
                            <div className="text-right hidden xl:block">
                                <p className="text-[13px] font-bold text-admin-text-primary leading-none mb-1">{name}</p>
                                <p className="text-[11px] font-medium text-admin-text-secondary leading-none">{role}</p>
                            </div>
                            <div className="relative">
                                <div className="w-10 h-10 rounded-xl bg-admin-accent text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                     {initials}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content with Scrollbar */}
                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar relative bg-admin-bg">
                    {children}
                </div>
            </main>
        </div>
    );
}
