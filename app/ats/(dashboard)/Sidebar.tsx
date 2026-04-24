'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Calendar,
    Settings,
    X
} from 'lucide-react';
import { useSidebar } from '@/components/ats/SidebarContext';

const MENU_ITEMS = [
    { label: 'Dashboard', href: '/ats', icon: LayoutDashboard },
    { label: 'Candidatos', href: '/ats/candidates', icon: Users },
    { label: 'Vacantes', href: '/ats/jobs', icon: Briefcase },
    { label: 'Calendario', href: '/ats/interviews', icon: Calendar },
    { label: 'Configuración', href: '/ats/settings', icon: Settings },
];

export default function AtsSidebar() {
    const pathname = usePathname();
    const { isOpen, close } = useSidebar();

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300" 
                    onClick={close}
                />
            )}

            <aside className={`
                fixed inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-zinc-100 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 h-screen
                ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
            `}>
                {/* Logo Section */}
                <div className="pt-10 pb-12 px-10 flex items-center justify-between">
                    <Link href="/ats" onClick={close} className="flex items-center">
                        <Image 
                            src="/logo_dibrand.svg" 
                            alt="Dibrand Logo" 
                            width={160} 
                            height={36} 
                            className="object-contain h-9 w-auto"
                        />
                    </Link>
                    <button 
                        onClick={close}
                        className="lg:hidden p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    {MENU_ITEMS.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/ats' && pathname.startsWith(item.href));
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={close}
                                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 group relative ${
                                    isActive
                                        ? 'bg-blue-50/40 text-[#0040A1]'
                                        : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                                }`}
                            >
                                <Icon 
                                    size={20} 
                                    className={`${isActive ? 'text-[#0040A1]' : 'text-zinc-400 group-hover:text-zinc-600'} transition-colors shrink-0`} 
                                />
                                <span className={`text-[14px] ${isActive ? 'font-bold' : 'font-medium'} tracking-tight`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="pb-10 px-6">
                    {/* Space for future user toggle or similar */}
                </div>
            </aside>
        </>
    );
}
