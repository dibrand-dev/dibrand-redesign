'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Trophy
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
        <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-slate-200 flex flex-col transition-all duration-300 z-30 relative h-screen`}>
            {/* Logo Section */}
            <div className="p-6 flex items-center justify-between border-b border-slate-100 h-20">
                {!isCollapsed && (
                    <Link href="/ats" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                            A
                        </div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">Dibrand <span className="text-indigo-600">ATS</span></span>
                    </Link>
                )}
                {isCollapsed && (
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mx-auto text-white font-bold text-lg">
                        A
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/ats' && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group relative ${isActive
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
                                }`}
                        >
                            <Icon size={20} className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'} transition-colors duration-200 shrink-0`} />
                            {!isCollapsed && (
                                <span className="text-sm font-semibold tracking-tight">
                                    {item.label}
                                </span>
                            )}

                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 uppercase tracking-widest font-bold">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Support section or Bottom items */}
            <div className="p-4 border-t border-slate-100 italic text-[10px] text-slate-400 text-center">
                {!isCollapsed && "Recruiter Panel v1.0"}
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-24 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 shadow-sm transition-all"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
        </aside>
    );
}
