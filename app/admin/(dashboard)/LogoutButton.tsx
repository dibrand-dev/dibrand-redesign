'use client'

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        if (loading) return;
        setLoading(true);

        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // 1. Destruye la sesión (borra la cookie)
        await supabase.auth.signOut();

        // 2. Fuerza al navegador a recargar y pasar por el middleware sin la cookie
        window.location.href = '/admin/login';
    };

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors w-full text-left disabled:opacity-50"
        >
            <LogOut size={20} />
            <span>{loading ? 'Cerrando...' : 'Logout'}</span>
        </button>
    );
}
