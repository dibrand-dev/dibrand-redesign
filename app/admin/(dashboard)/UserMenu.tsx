'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, Settings, LogOut, User, Bell, Shield } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

interface UserMenuProps {
    name: string;
    role: string;
    initials: string;
    avatarUrl: string | null;
}

export default function UserMenu({ name, role, initials, avatarUrl }: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        if (loading) return;
        setLoading(true);
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        await supabase.auth.signOut();
        window.location.href = '/admin/login';
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 pl-2 group outline-none"
            >
                <div className="flex flex-col items-end mr-1 hidden sm:flex">
                    <span className="text-sm font-bold text-admin-text-primary tracking-tight transition-colors group-hover:text-admin-accent">{name}</span>
                    <span className="text-[10px] text-admin-text-secondary font-semibold uppercase tracking-widest">{role}</span>
                </div>
                <div className="relative">
                    <div className="w-11 h-11 rounded-xl overflow-hidden bg-admin-accent p-[2px] shadow-lg shadow-admin-accent/10 group-hover:scale-105 transition-transform duration-300">
                        <div className="w-full h-full rounded-[9px] overflow-hidden bg-admin-card-bg flex items-center justify-center border border-white dark:border-admin-border">
                            {avatarUrl ? (
                                <Image
                                    src={avatarUrl}
                                    alt={initials}
                                    width={44}
                                    height={44}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <span className="text-admin-accent font-bold text-sm tracking-tighter">{initials}</span>
                            )}
                        </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-admin-card-bg rounded-full"></div>
                </div>
                <ChevronDown
                    size={14}
                    className={`text-gray-400 transition-all duration-300 ${isOpen ? 'rotate-180 text-admin-accent' : 'group-hover:text-admin-accent'}`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-admin-card-bg border border-admin-border rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-5 py-4 border-b border-admin-border/50 mb-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Mi Perfil</p>
                        <p className="text-sm font-bold text-admin-text-primary truncate">{name}</p>
                    </div>

                    <div className="px-2 space-y-1">
                        <Link
                            href="/admin/settings"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-admin-text-secondary hover:bg-admin-bg hover:text-admin-accent transition-all group"
                            onClick={() => setIsOpen(false)}
                        >
                            <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-admin-bg/50 flex items-center justify-center group-hover:bg-admin-accent/10 group-hover:text-admin-accent transition-colors">
                                <Settings size={18} />
                            </div>
                            Configuración
                        </Link>

                        <button
                            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-admin-text-secondary hover:bg-admin-bg hover:text-admin-accent transition-all group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-admin-bg/50 flex items-center justify-center group-hover:bg-admin-accent/10 group-hover:text-admin-accent transition-colors">
                                <Shield size={18} />
                            </div>
                            Seguridad
                        </button>
                    </div>

                    <div className="mt-2 pt-2 border-t border-admin-border/50 px-2">
                        <button
                            onClick={handleLogout}
                            disabled={loading}
                            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                                <LogOut size={18} />
                            </div>
                            {loading ? 'Saliendo...' : 'Cerrar Sesión'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
