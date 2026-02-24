import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, FileText, Settings, Briefcase, Users, Code, Trophy, MessageSquare, Building2 } from 'lucide-react';
import LogoutButton from './LogoutButton';
import { createClient } from '@/lib/supabase-server-client';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const meta = user?.user_metadata || {};
    const avatarUrl = meta.avatar_url || null;
    const initials = (
        (meta.first_name?.[0] || '') + (meta.last_name?.[0] || '')
    ).toUpperCase() || user?.email?.[0].toUpperCase() || 'A';
    return (
        <div className="min-h-screen bg-background-alt flex">
            {/* Sidebar */}
            <aside className="w-64 bg-corporate-grey text-white hidden md:flex flex-col shadow-xl">
                <div className="p-6">
                    <Link href="/admin" className="text-2xl font-bold font-heading bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Dibrand Admin
                    </Link>
                </div>


                <nav className="flex-1 px-4 py-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white">
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link href="/admin/brands" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white">
                        <Building2 size={20} />
                        <span>Clientes</span>
                    </Link>
                    <Link href="/admin/success-stories" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white">
                        <Trophy size={20} />
                        <span>Success Stories</span>
                    </Link>
                    <Link href="/admin/testimonials" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white">
                        <MessageSquare size={20} />
                        <span>Testimonials</span>
                    </Link>
                    <Link href="/admin/jobs" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white">
                        <Briefcase size={20} />
                        <span>Job Openings</span>
                    </Link>
                    <Link href="/admin/candidates" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white">
                        <Users size={20} />
                        <span>Candidates</span>
                    </Link>
                    <Link href="/admin/stacks" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white">
                        <Code size={20} />
                        <span>Tech Stacks</span>
                    </Link>
                    <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white">
                        <Settings size={20} />
                        <span>Administradores</span>
                    </Link>
                    <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white">
                        <Settings size={20} />
                        <span>Settings</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <LogoutButton />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm">
                    <h1 className="text-xl font-semibold text-corporate-grey">Control Panel</h1>
                    <div className="flex items-center gap-4">
                        <Link href="/admin/settings" title="Mi Perfil">
                            <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm ring-2 ring-white shadow hover:ring-primary/40 transition-all">
                                {avatarUrl ? (
                                    <Image
                                        src={avatarUrl}
                                        alt={initials}
                                        width={36}
                                        height={36}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <span>{initials}</span>
                                )}
                            </div>
                        </Link>
                    </div>
                </header>

                <div className="p-8 overflow-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
