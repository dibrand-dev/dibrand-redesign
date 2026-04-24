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
    HelpCircle,
    PlusCircle,
    X
} from 'lucide-react';
import LogoutButton from './LogoutButton';
import { useSidebar } from '@/components/ats/SidebarContext';

const MENU_ITEMS = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Empresas', href: '/admin/companies', icon: Building2 },
    { label: 'Portfolio Logos', href: '/admin/brands', icon: LayoutGrid },
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
                fixed inset-y-0 left-0 z-50 ${isCollapsed ? 'w-20' : 'w-64'} bg-[#F8FAFC] border-r border-[#E2E8F0] flex flex-col transition-all duration-300 lg:static lg:translate-x-0 h-screen shadow-sm
                ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
            `}>
                {/* Logo Section - EXACT ATS STYLE */}
                <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} h-24`}>
                    {!isCollapsed && (
                        <Link href="/admin" className="flex items-center gap-3" onClick={close}>
                            <Image 
                                src="/logo_dibrand.png" 
                                alt="Dibrand Logo" 
                                width={200} 
                                height={56} 
                                className="h-14 w-auto object-contain"
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
                    <button 
                        onClick={close}
                        className="lg:hidden p-2 text-slate-400 hover:text-slate-900 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation - EXACT ATS STYLE */}
                <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar pt-2">
                    {MENU_ITEMS.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={close}
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
                                {isCollapsed && (
                                    <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 font-bold uppercase tracking-widest">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section - ATS STYLE */}
                <div className="p-4 border-t border-[#E2E8F0]">
                    {!isCollapsed && (
                        <Link 
                            href="/admin/cases/new"
                            onClick={close}
                            className="w-full py-3 bg-[#0040A1] hover:bg-[#003380] text-white rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
                        >
                            <PlusCircle size={18} />
                            Nuevo Caso
                        </Link>
                    )}
                    {isCollapsed && (
                        <Link 
                            href="/admin/cases/new"
                            onClick={close}
                            className="w-10 h-10 mx-auto bg-[#0040A1] text-white rounded-xl flex items-center justify-center hover:bg-[#003380] transition-all"
                        >
                            <PlusCircle size={20} />
                        </Link>
                    )}
                    <div className="mt-4">
                        <LogoutButton isCollapsed={isCollapsed} />
                    </div>
                </div>

                {/* Toggle Button - EXACT ATS STYLE */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-4 top-28 w-8 h-8 bg-white border border-slate-100 rounded-2xl hidden lg:flex items-center justify-center text-slate-400 hover:text-[#0040A1] shadow-xl shadow-slate-200/50 transition-all hover:scale-110 z-40 group"
                >
                    {isCollapsed ? <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" /> : <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />}
                </button>
            </aside>
        </>
    );
}
