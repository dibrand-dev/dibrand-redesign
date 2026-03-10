'use client'

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { LogOut } from 'lucide-react';

export default function LogoutButton({ isCollapsed }: { isCollapsed?: boolean }) {
    const [loading, setLoading] = useState(false);

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
        <button
            onClick={handleLogout}
            disabled={loading}
            title={isCollapsed ? 'Logout' : undefined}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group relative ${isCollapsed ? 'justify-center mx-auto' : 'w-full'
                } border border-transparent hover:bg-red-50 text-red-500/80 hover:text-red-600 disabled:opacity-50`}
        >
            <LogOut size={20} className="shrink-0 transition-transform group-hover:scale-110" />
            {!isCollapsed && (
                <span className="text-[13px] font-bold tracking-tight">
                    {loading ? 'Saliendo...' : 'Cerrar Sesión'}
                </span>
            )}
        </button>
    );
}
