'use client';

import React, { useState, useRef, useEffect } from 'react';
import { LogOut, User, Settings, ChevronDown, Loader2 } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';

interface ProfileMenuProps {
    name: string;
    role: string;
    initials: string;
    avatarUrl?: string;
    isAdmin?: boolean;
}

export default function ProfileMenu({ name, role, initials, avatarUrl, isAdmin }: ProfileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleLogout = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        window.location.href = isAdmin ? '/admin/login' : '/ats/login';
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            {/* Trigger */}
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-4 group cursor-pointer hover:bg-slate-50 p-1.5 pr-3 rounded-2xl transition-all"
            >
                <div className="text-right hidden xl:block">
                    <p className="text-[13px] font-bold text-[#191C1D] leading-none mb-1">{name}</p>
                    <p className="text-[11px] font-medium text-[#737785] leading-none capitalize">{role.toLowerCase().replace('_', ' ')}</p>
                </div>
                <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-[#0040A1] text-white flex items-center justify-center font-bold text-sm shadow-sm overflow-hidden transition-transform group-hover:scale-105">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                        ) : (
                            initials
                        )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-[100] animate-in fade-in zoom-in duration-200 origin-top-right">
                    <div className="px-4 py-3 border-b border-slate-50 mb-1">
                        <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Account</p>
                        <p className="text-[14px] font-bold text-slate-900 truncate">{name}</p>
                    </div>

                    <Link 
                        href={isAdmin ? "/admin/settings" : "/ats/settings"} 
                        className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-slate-600 hover:bg-slate-50 hover:text-[#0040A1] transition-colors mx-2 rounded-xl"
                        onClick={() => setIsOpen(false)}
                    >
                        <Settings size={16} />
                        Settings
                    </Link>

                    <button 
                        onClick={handleLogout}
                        disabled={loading}
                        className="w-[calc(100%-16px)] flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-red-600 hover:bg-red-50 transition-colors mx-2 rounded-xl mt-1 disabled:opacity-50"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
                        Log out
                    </button>
                </div>
            )}
        </div>
    );
}
