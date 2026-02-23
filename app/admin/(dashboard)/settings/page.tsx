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
                <h2 className="text-2xl font-bold text-corporate-grey">Settings</h2>
                <p className="text-gray-500 mt-1">Gestiona tu perfil y preferencias de la cuenta.</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
                    <UserCircle size={22} className="text-primary" />
                    <h3 className="text-lg font-bold text-corporate-grey">Mi Perfil</h3>
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
                    <div className="flex-1 space-y-4 text-center sm:text-left">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Nombre</p>
                            <p className="text-lg font-bold text-corporate-grey">{displayName}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email</p>
                            <p className="text-sm text-gray-600">{user?.email}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">User ID</p>
                            <p className="text-xs text-gray-400 font-mono">{user?.id}</p>
                        </div>
                        <p className="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-50">
                            Tu foto de perfil se mostrará en las notas internas de los candidatos.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
