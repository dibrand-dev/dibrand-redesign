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
    Settings
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

    return (
        <aside className="w-[280px] bg-white border-r border-zinc-100 flex flex-col z-30 relative h-screen">
            {/* Logo Section */}
            <div className="pt-12 pb-16 px-10">
                <Link href="/ats">
                    <Image 
                        src="/logo_dibrand.svg" 
                        alt="Dibrand Logo" 
                        width={180} 
                        height={24} 
                        className="object-contain"
                    />
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2">
                {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/ats' && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 group relative ${
                                isActive
                                    ? 'bg-blue-50/40 text-[#0040A1]'
                                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                            }`}
                        >
                            <Icon 
                                size={22} 
                                className={`${isActive ? 'text-[#0040A1]' : 'text-zinc-400 group-hover:text-zinc-600'} transition-colors shrink-0`} 
                            />
                            <span className={`text-[15px] ${isActive ? 'font-bold' : 'font-medium'} tracking-tight`}>
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
    );
}
