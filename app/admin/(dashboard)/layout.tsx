import Sidebar from './Sidebar';
import { Search, Bell, HelpCircle, Menu } from 'lucide-react';
import { createClient } from '@/lib/supabase-server-client';
import { redirect } from 'next/navigation';
import ProfileMenu from '@/components/ats/ProfileMenu';
import { SidebarProvider } from '@/components/ats/SidebarContext';
import MobileMenuButton from '@/components/ats/MobileMenuButton';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const meta = user?.user_metadata || {};
    const role = meta.role;

    // Strict Security: ONLY SuperAdmin can access Admin Dashboard
    if (role !== 'SuperAdmin') {
        redirect('/ats');
    }

    const name = meta.full_name || (meta.first_name ? `${meta.first_name} ${meta.last_name || ''}` : null) || user?.email?.split('@')[0] || 'Admin';
    const initials = name[0].toUpperCase();

    return (
        <SidebarProvider>
            <div className="min-h-screen bg-[#E5E5E5] flex font-inter text-[#191C1D] antialiased overflow-hidden h-screen relative">
                {/* Sidebar - EXACT ATS SYNC */}
                <Sidebar />

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
                    
                    {/* Header - EXACT ATS / FIGMA SPECS */}
                    <header className="h-16 lg:h-20 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 lg:px-10 shrink-0 z-20">
                        <div className="flex items-center gap-4 flex-1">
                            <MobileMenuButton />
                            {/* Search Bar - Figma Style */}
                            <div className="flex-1 max-w-2xl hidden md:block">
                                <div className="relative group">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#737785] group-focus-within:text-[#0040A1] transition-colors" size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="Search everything..." 
                                        className="w-full bg-[#F1F5F9] border border-transparent focus:bg-white focus:border-[#0040A1] rounded-xl py-3 pl-14 pr-6 text-[13px] font-medium transition-all outline-none text-[#191C1D]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 lg:gap-8 ml-4">
                            <div className="hidden sm:flex items-center gap-4 text-[#737785] border-r border-[#E2E8F0] pr-4 lg:pr-8">
                                <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#F1F5F9] hover:text-[#191C1D] transition-all relative">
                                    <Bell size={20} />
                                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#B3261E] rounded-full border-2 border-white"></span>
                                </button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#F1F5F9] hover:text-[#191C1D] transition-all">
                                    <HelpCircle size={20} />
                                </button>
                            </div>

                            {/* Profile Section - Integrated with Menu */}
                            <ProfileMenu 
                                name={name} 
                                role={role || 'SuperAdmin'} 
                                initials={initials} 
                                avatarUrl={meta.avatar_url} 
                                isAdmin={true}
                            />
                        </div>
                    </header>

                    {/* Main Content with Scrollbar - EXACT ATS SPECS */}
                    <div className="flex-1 overflow-y-auto p-4 lg:p-10 custom-scrollbar relative bg-[#E5E5E5]">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}
