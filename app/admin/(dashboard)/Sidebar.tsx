'use client';

import React from 'react';
import Link from 'next/link';
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
    LogOut
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
        <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-admin-card-bg border-r border-admin-border flex flex-col transition-all duration-300 z-30 relative shadow-[4px_0_24px_rgba(0,0,0,0.02)]`}>
            {/* Logo Section */}
            <div className="p-6 flex items-center justify-between border-b border-admin-border/50 h-20">
                {!isCollapsed && (
                    <Link href="/admin" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-admin-accent rounded-lg flex items-center justify-center text-white font-bold text-lg">
                            D
                        </div>
                        <span className="text-xl font-bold text-admin-text-primary tracking-tight">Dibrand</span>
                    </Link>
                )}
                {isCollapsed && (
                    <div className="w-8 h-8 bg-admin-accent rounded-lg flex items-center justify-center mx-auto text-white font-bold text-lg">
                        D
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
                {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group relative ${isActive
                                ? 'bg-admin-accent text-white shadow-lg shadow-admin-accent/20'
                                : 'text-admin-text-secondary hover:bg-admin-accent/5 hover:text-admin-accent dark:hover:bg-admin-accent/10'
                                }`}
                        >
                            <Icon size={20} className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-admin-accent'} transition-colors duration-200 shrink-0`} />
                            {!isCollapsed && (
                                <span className={`text-[13px] font-semibold tracking-tight ${isActive ? 'text-white' : 'text-admin-text-secondary'}`}>
                                    {item.label}
                                </span>
                            )}

                            {/* Hover tooltip for collapsed state */}
                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-24 w-6 h-6 bg-admin-card-bg border border-admin-border rounded-full flex items-center justify-center text-gray-400 hover:text-admin-accent shadow-sm hover:shadow transition-all"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Support / Bottom Menu */}
            <div className="p-4 border-t border-admin-border/50 space-y-2">
                <Link
                    href="/admin/docs"
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${pathname === '/admin/docs'
                            ? 'bg-admin-accent/10 border border-admin-accent/20'
                            : 'bg-gray-50/50 dark:bg-admin-bg/50 border border-transparent hover:border-admin-border'
                        } ${isCollapsed ? 'justify-center px-0' : ''}`}
                >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${pathname === '/admin/docs' ? 'bg-admin-accent text-white' : 'bg-admin-accent/10 text-admin-accent group-hover:bg-admin-accent group-hover:text-white'
                        }`}>
                        <BookOpen size={16} />
                    </div>
                    {!isCollapsed && (
                        <div>
                            <p className="text-[11px] font-bold text-admin-text-primary uppercase tracking-wider">Docs</p>
                            <p className="text-[10px] text-admin-text-secondary">Guía de usuario</p>
                        </div>
                    )}
                </Link>

                <div className="pt-2">
                    <LogoutButton isCollapsed={isCollapsed} />
                </div>
            </div>
        </aside>
    );
}
