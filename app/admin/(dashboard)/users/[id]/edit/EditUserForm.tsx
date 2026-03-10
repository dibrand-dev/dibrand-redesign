'use client'

import { useRouter } from 'next/navigation';
import { updateUser } from '../../actions';
import { useState } from 'react';

export default function EditUserForm({ user }: { user: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);
        try {
            await updateUser(user.id, formData);
            router.push('/admin/users');
        } catch (err: any) {
            setError(err.message || 'Error al actualizar el usuario');
            setLoading(false);
        }
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-corporate-grey">Nombre</label>
                    <input
                        name="firstName"
                        type="text"
                        defaultValue={user.user_metadata?.firstName || ''}
                        required
                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-corporate-grey">Apellido</label>
                    <input
                        name="lastName"
                        type="text"
                        defaultValue={user.user_metadata?.lastName || ''}
                        required
                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-corporate-grey text-corporate-grey/50">Email (No se puede cambiar)</label>
                <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-2 rounded-lg border bg-corporate-grey/5 text-corporate-grey/50 cursor-not-allowed"
                />
            </div>

            <div className="p-4 bg-corporate-grey/5 rounded-lg border border-dashed text-sm text-corporate-grey/60">
                Deja la contraseña en blanco si no deseas cambiarla.
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-corporate-grey">Nueva Contraseña (Opcional)</label>
                <input
                    name="password"
                    type="password"
                    minLength={6}
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="••••••••"
                />
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-admin-accent text-white py-3 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {loading ? 'Actualizando...' : 'Guardar Cambios'}
                </button>
            </div>
        </form>
    );
}
