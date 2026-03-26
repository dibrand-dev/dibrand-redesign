import AtsSidebar from './Sidebar';
import { createClient } from '@/lib/supabase-server-client';
import { Bell, Search, HelpCircle } from 'lucide-react';
import LogoutButton from '@/app/admin/(dashboard)/LogoutButton';
import { syncRecruiterProfile } from '../actions';

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

    const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Recruiter';
    const initials = name[0].toUpperCase();
    const avatarUrl = user?.user_metadata?.avatar_url;

    return (
        <div className="min-h-screen bg-[#E5E5E5] flex font-inter text-[#191C1D] antialiased overflow-hidden h-screen">
            {/* Sidebar */}
            <AtsSidebar />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">

                {/* Header - Exact Figma Specs */}
                <header className="h-20 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-10 shrink-0 z-20">
                    {/* Search Bar - Figma Style */}
                    <div className="flex-1 max-w-2xl">
                        <div className="relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#737785] group-focus-within:text-[#0040A1] transition-colors" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search candidates, jobs, or tasks..." 
                                className="w-full bg-[#F1F5F9] border border-transparent focus:bg-white focus:border-[#0040A1] rounded-xl py-3 pl-14 pr-6 text-[13px] font-medium transition-all outline-none text-[#191C1D]"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-8 ml-8">
                        <div className="flex items-center gap-4 text-[#737785] border-r border-[#E2E8F0] pr-8">
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#F1F5F9] hover:text-[#191C1D] transition-all relative">
                                <Bell size={20} />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#B3261E] rounded-full border-2 border-white"></span>
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#F1F5F9] hover:text-[#191C1D] transition-all">
                                <HelpCircle size={20} />
                            </button>
                        </div>

                        {/* Profile Section */}
                        <div className="flex items-center gap-4 group cursor-pointer">
                            <div className="text-right hidden xl:block">
                                <p className="text-[13px] font-bold text-[#191C1D] leading-none mb-1">{name}</p>
                                <p className="text-[11px] font-medium text-[#737785] leading-none">Senior Recruiter</p>
                            </div>
                            <div className="relative">
                                <div className="w-10 h-10 rounded-xl bg-[#0040A1] text-white flex items-center justify-center font-bold text-sm shadow-sm overflow-hidden">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                                    ) : (
                                        initials
                                    )}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                            </div>
                        </div>
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

