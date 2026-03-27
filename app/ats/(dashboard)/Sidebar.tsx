'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Settings,
    ChevronLeft,
    ChevronRight,
    Search,
    Calendar
} from 'lucide-react';

const MENU_ITEMS = [
    { label: 'Dashboard', href: '/ats', icon: LayoutDashboard },
    { label: 'Candidatos', href: '/ats/candidates', icon: Users },
    { label: 'Vacantes', href: '/ats/jobs', icon: Briefcase },
    { label: 'Calendario', href: '/ats/interviews', icon: Calendar },
    { label: 'Configuración', href: '/ats/settings', icon: Settings },
];

export default function AtsSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    return (
        <aside className={`${isCollapsed ? 'w-20' : 'w-[280px]'} bg-white border-r border-[#E2E8F0] flex flex-col transition-all duration-300 z-30 relative h-screen`}>
            {/* Logo Section */}
            <div className={`p-8 flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} h-24`}>
                <Link href="/ats" className="flex items-center">
                    {isCollapsed ? (
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-brand font-black italic text-xl">
                            di
                        </div>
                    ) : (
                        <Image 
                            src="/logo_dibrand.svg" 
                            alt="Dibrand Logo" 
                            width={160} 
                            height={24} 
                            priority
                            className="object-contain"
                        />
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
                {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/ats' && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative ${isActive
                                ? 'bg-white text-[#0040A1] shadow-xl shadow-slate-100/50'
                                : 'text-[#737785] hover:bg-slate-50 hover:text-[#191C1D]'
                                }`}
                        >
                            <Icon size={20} className={`${isActive ? 'text-[#0040A1]' : 'text-[#737785] group-hover:text-[#0040A1]'} transition-colors shrink-0`} />
                            {!isCollapsed && (
                                <span className={`text-[15px] ${isActive ? 'font-bold' : 'font-semibold'} tracking-tight`}>
                                    {item.label === 'Vacantes' ? 'Jobs' : item.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section - Floating Post Job Button like in image */}
            <div className="p-6 relative">
                 <button className={`w-full ${isCollapsed ? 'h-12 w-12 rounded-2xl' : 'py-4 px-6 rounded-xl'} bg-[#0040A1] hover:bg-[#003380] text-white font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-[#0040A1]/30 active:scale-95 group`}>
                     <div className="bg-white/20 p-1 rounded-lg">
                        <Briefcase size={18} className="text-white" />
                     </div>
                     {!isCollapsed && <span className="text-[14px]">Post New Job</span>}
                     {isCollapsed && <Briefcase size={22} />}
                 </button>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-4 top-28 w-8 h-8 bg-white border border-[#E2E8F0] rounded-full flex items-center justify-center text-[#737785] hover:text-[#0040A1] shadow-xl transition-all hover:scale-110 z-50"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
        </aside>
    );
}


