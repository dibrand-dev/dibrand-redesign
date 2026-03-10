import React from 'react';
import { createClient } from '@/lib/supabase-server-client';
import AvatarUpload from './AvatarUpload';
import { UserCircle } from 'lucide-react';

export default async function SettingsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const meta = user?.user_metadata || {};
    const displayName = meta.full_name || meta.name ||
        (meta.first_name ? `${meta.first_name} ${meta.last_name || ''}`.trim() : null) ||
        user?.email || 'Admin';

    const avatarUrl = meta.avatar_url || null;

    return (
        <div className="space-y-8 max-w-2xl">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-black text-admin-text-primary tracking-tight uppercase">Settings</h2>
                <p className="text-admin-text-secondary text-sm font-medium italic mt-1">Gestiona tu perfil y preferencias de la cuenta.</p>
            </div>

            {/* Profile Card */}
            <div className="bg-admin-card-bg rounded-2xl shadow-sm border border-admin-border p-8">
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-admin-border/50">
                    <UserCircle size={22} className="text-admin-accent" />
                    <h3 className="text-sm font-black text-admin-text-primary uppercase tracking-[0.2em]">Mi Perfil</h3>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-10">
                    {/* Avatar upload widget */}
                    {user && (
                        <AvatarUpload
                            userId={user.id}
                            currentAvatarUrl={avatarUrl}
                            displayName={displayName}
                        />
                    )}

                    {/* User info */}
                    <div className="flex-1 space-y-6 text-center sm:text-left">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Nombre</p>
                            <p className="text-xl font-black text-admin-text-primary tracking-tight">{displayName}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Email</p>
                            <p className="text-sm font-bold text-admin-text-secondary">{user?.email}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">User ID</p>
                            <p className="text-[10px] text-admin-text-secondary/50 font-mono bg-admin-bg px-2 py-1 rounded-md inline-block border border-admin-border/50">{user?.id}</p>
                        </div>
                        <p className="text-[11px] text-admin-text-secondary/60 mt-6 pt-6 border-t border-admin-border/50 italic font-medium">
                            Tu foto de perfil se mostrará en las notas internas de los candidatos.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
