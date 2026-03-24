'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Trophy,
    MessageSquare,
    Briefcase,
    Users,
    Code,
    Settings,
    Building2,
    ChevronLeft,
    ChevronRight,
    Search,
    BookOpen,
    LayoutGrid,
    LogOut,
    HelpCircle
} from 'lucide-react';
import LogoutButton from './LogoutButton';

const MENU_ITEMS = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Clientes', href: '/admin/brands', icon: Building2 },
    { label: 'Casos de Éxito', href: '/admin/success-stories', icon: Trophy },
    { label: 'Testimonios', href: '/admin/testimonials', icon: MessageSquare },
    { label: 'Búsquedas Laborales', href: '/admin/jobs', icon: Briefcase },
    { label: 'Candidatos', href: '/admin/candidates', icon: Users },
    { label: 'Tech Stacks', href: '/admin/stacks', icon: Code },
    { label: 'Administradores', href: '/admin/users', icon: Settings },
    { label: 'Configuración', href: '/admin/settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    return (
        <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-admin-sidebar-bg border-r border-admin-border flex flex-col transition-all duration-300 z-30 relative h-screen shadow-[4px_0_24px_rgba(0,0,0,0.02)]`}>
            {/* Logo Section - ATS Style */}
            <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} h-24`}>
                {!isCollapsed && (
                    <Link href="/admin" className="flex items-center gap-3">
                        <Image 
                            src="/logo_dibrand.png" 
                            alt="Dibrand Logo" 
                            width={140} 
                            height={35} 
                            className="h-7 w-auto object-contain"
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

            {/* Navigation - ATS Style */}
            <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar pt-4">
                {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${isActive
                                ? 'bg-[#F1F5F9] text-admin-accent font-semibold'
                                : 'text-admin-text-secondary hover:bg-slate-50 hover:text-admin-text-primary font-medium'
                                }`}
                        >
                            {isActive && (
                                <span className="absolute left-0 top-3 bottom-3 w-1 bg-admin-accent rounded-full"></span>
                            )}
                            <Icon size={20} className={`${isActive ? 'text-admin-accent' : 'text-admin-text-secondary group-hover:text-admin-accent'} transition-colors shrink-0`} />
                            {!isCollapsed && (
                                <span className="text-[13px] tracking-tight">
                                    {item.label}
                                </span>
                            )}
                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 font-bold uppercase tracking-widest">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Support / Bottom Menu - ATS Style */}
            <div className="p-4 border-t border-admin-border">
                <Link
                    href="/admin/docs"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${pathname === '/admin/docs'
                            ? 'bg-admin-accent/5 font-semibold'
                            : 'hover:bg-slate-50'
                        } ${isCollapsed ? 'justify-center px-0' : ''}`}
                >
                    <HelpCircle size={20} className={`${pathname === '/admin/docs' ? 'text-admin-accent' : 'text-admin-text-secondary group-hover:text-admin-accent'}`} />
                    {!isCollapsed && (
                        <span className={`text-[13px] tracking-tight ${pathname === '/admin/docs' ? 'text-admin-accent' : 'text-admin-text-primary font-medium'}`}>
                            Help & Docs
                        </span>
                    )}
                </Link>

                <div className="pt-2">
                    <LogoutButton isCollapsed={isCollapsed} />
                </div>
            </div>

            {/* Toggle Button - Figma Style */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-4 top-28 w-8 h-8 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-admin-accent shadow-xl shadow-slate-200/50 transition-all hover:scale-110 z-40 group"
            >
                {isCollapsed ? <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" /> : <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />}
            </button>
        </aside>
    );
}
