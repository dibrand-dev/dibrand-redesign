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
        <div className="min-h-screen bg-[#F8FAFC] flex font-inter text-[#191C1D] antialiased overflow-hidden h-screen">
            {/* Sidebar */}
            <AtsSidebar />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">

                {/* Header - Minimalist, as shown in screenshot */}
                <header className="h-20 bg-transparent flex items-center justify-between px-10 shrink-0 z-20">
                    <div className="flex-1 flex items-center gap-2 text-[13px] font-medium text-slate-400">
                         {/* Breadcrumbs moved here for consistency with designs if needed, or kept in page */}
                    </div>

                    <div className="flex items-center gap-8">
                        {/* Notify and Profile */}
                        <div className="flex items-center gap-6">
                            <button className="text-slate-400 hover:text-slate-900 transition-colors relative">
                                <Bell size={20} />
                                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#0040A1] rounded-full border-2 border-[#F8FAFC]"></span>
                            </button>
                            
                            <ProfileMenu 
                                name={name} 
                                role={role || 'Recruiter'} 
                                initials={initials} 
                                avatarUrl={avatarUrl} 
                                isAdmin={false}
                            />
                        </div>
                    </div>
                </header>

                {/* Main Content with Scrollbar */}
                <div className="flex-1 overflow-y-auto px-10 pb-10 custom-scrollbar relative">
                    {children}
                </div>
            </main>
        </div>
    );
}

