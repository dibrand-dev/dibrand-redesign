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
    Search
} from 'lucide-react';

const MENU_ITEMS = [
    { label: 'Dashboard', href: '/ats', icon: LayoutDashboard },
    { label: 'Candidatos', href: '/ats/candidates', icon: Users },
    { label: 'Vacantes', href: '/ats/jobs', icon: Briefcase },
    { label: 'Configuración', href: '/ats/settings', icon: Settings },
];

export default function AtsSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    return (
        <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-[#F8FAFC] border-r border-[#E2E8F0] flex flex-col transition-all duration-300 z-30 relative h-screen`}>
            {/* Logo Section */}
            <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} h-24`}>
                {!isCollapsed && (
                    <Link href="/ats" className="flex items-center gap-3">
                        <Image 
                            src="/logo_dibrand.png" 
                            alt="Dibrand Logo" 
                            width={70} 
                            height={18} 
                            className="h-3.5 w-auto object-contain"
                        />
                    </Link>
                )}
                {isCollapsed && (
                    <div className="w-10 h-10 flex items-center justify-center">
                        <Image 
                            src="/logo_dibrand.png" 
                            alt="Dibrand" 
                            width={24} 
                            height={24} 
                            className="w-6 h-6 object-contain"
                        />
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/ats' && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${isActive
                                ? 'bg-[#F1F5F9] text-[#0040A1] font-semibold'
                                : 'text-[#737785] hover:bg-slate-50 hover:text-[#191C1D] font-medium'
                                }`}
                        >
                            {isActive && (
                                <span className="absolute left-0 top-3 bottom-3 w-1 bg-[#0040A1] rounded-full"></span>
                            )}
                            <Icon size={20} className={`${isActive ? 'text-[#0040A1]' : 'text-[#737785] group-hover:text-[#0040A1]'} transition-colors shrink-0`} />
                            {!isCollapsed && (
                                <span className="text-[13px] tracking-tight">
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-[#E2E8F0]">
                {!isCollapsed && (
                    <button className="w-full py-3.5 bg-[#0040A1] hover:bg-[#003380] text-white rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 transition-all shadow-sm">
                         <Briefcase size={18} />
                         Post New Job
                    </button>
                )}
                {isCollapsed && (
                    <button className="w-10 h-10 mx-auto bg-[#0040A1] text-white rounded-xl flex items-center justify-center hover:bg-[#003380] transition-all">
                         <Briefcase size={20} />
                    </button>
                )}
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-4 top-28 w-8 h-8 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-indigo-600 shadow-xl shadow-slate-200/50 transition-all hover:scale-110 z-40 group"
            >
                {isCollapsed ? <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" /> : <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />}
            </button>
        </aside>
    );
}


