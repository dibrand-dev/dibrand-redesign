import AtsSidebar from './Sidebar';
import { createClient } from '@/lib/supabase-server-client';
import { redirect } from 'next/navigation';
import { Bell, Search, HelpCircle } from 'lucide-react';
import LogoutButton from '@/app/admin/(dashboard)/LogoutButton';
import { syncRecruiterProfile } from '../actions';
import ProfileMenu from '@/components/ats/ProfileMenu';

export default async function AtsDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    try {
        await syncRecruiterProfile();
    } catch (e) {
        console.error('Error syncing recruiter profile:', e);
    }
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/ats/login');
    }

    const role = user?.user_metadata?.role;
    // Authorized roles for ATS
    const isAuthorized = role === 'recruiter' || role === 'admin' || role === 'SuperAdmin';
    
    if (!isAuthorized) {
        redirect('/ats/login');
    }

    const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Recruiter';
    const initials = name[0].toUpperCase();
    const avatarUrl = user?.user_metadata?.avatar_url;

    return (
        <div className="min-h-screen bg-[#E5E5E5] flex font-inter text-[#191C1D] antialiased overflow-hidden h-screen">
            {/* Sidebar */}
            <AtsSidebar />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">

                {/* Header - Refined for Pixel Perfect search and profile area */}
                <header className="h-20 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-10 shrink-0 z-20">
                    <div className="flex-1">
                        {/* Title area can be empty here if page handles it, or used for shared elements */}
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Search Bar - Moved to the right to match image */}
                        <div className="relative group w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737785] group-focus-within:text-[#0040A1] transition-colors" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search roles..." 
                                className="w-full bg-[#F1F5F9] border border-transparent focus:bg-white focus:border-[#0040A1] rounded-xl py-2.5 pl-11 pr-4 text-[13px] font-medium transition-all outline-none text-[#191C1D]"
                            />
                        </div>

                        <div className="flex items-center gap-4 text-[#737785]">
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#F1F5F9] hover:text-[#191C1D] transition-all relative">
                                <Bell size={20} />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#B3261E] rounded-full border-2 border-white"></span>
                            </button>
                        </div>

                        {/* Profile Section */}
                        <ProfileMenu 
                            name={name} 
                            role={role || 'Recruiter'} 
                            initials={initials} 
                            avatarUrl={avatarUrl} 
                            isAdmin={false}
                        />
                    </div>
                </header>

                {/* Main Content with Scrollbar */}
                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar relative">
                    {children}
                </div>
            </main>
        </div>
    );
}

