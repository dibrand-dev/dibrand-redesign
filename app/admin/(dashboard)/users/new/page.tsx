'use client'

import { useRouter } from 'next/navigation';
import { createUser } from '../actions';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewUserPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);
        try {
            await createUser(formData);
            router.push('/admin/users');
        } catch (err: any) {
            setError(err.message || 'Error al crear el usuario');
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/users" className="p-2 hover:bg-admin-card-bg rounded-full transition-colors text-admin-text-secondary">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h2 className="text-3xl font-black text-admin-text-primary tracking-tight uppercase">Nuevo Administrador</h2>
                    <p className="text-admin-text-secondary text-sm font-medium italic">Crea un nuevo usuario para el equipo</p>
                </div>
            </div>

            <div className="bg-admin-card-bg p-8 rounded-2xl shadow-sm border border-admin-border">
                <form action={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Nombre</label>
                            <input
                                name="firstName"
                                type="text"
                                required
                                className="w-full px-4 py-3 bg-admin-bg border border-admin-border rounded-xl focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent outline-none transition-all text-admin-text-primary font-medium"
                                placeholder="Ej. Juan"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Apellido</label>
                            <input
                                name="lastName"
                                type="text"
                                required
                                className="w-full px-4 py-3 bg-admin-bg border border-admin-border rounded-xl focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent outline-none transition-all text-admin-text-primary font-medium"
                                placeholder="Ej. Pérez"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-3 bg-admin-bg border border-admin-border rounded-xl focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent outline-none transition-all text-admin-text-primary font-medium"
                            placeholder="email@dibrand.co"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Contraseña</label>
                        <input
                            name="password"
                            type="password"
                            required
                            minLength={6}
                            className="w-full px-4 py-3 bg-admin-bg border border-admin-border rounded-xl focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent outline-none transition-all text-admin-text-primary font-medium"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 text-red-500 rounded-xl text-[11px] font-bold uppercase tracking-widest border border-red-500/20">
                            {error}
                        </div>
                    )}

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-admin-accent text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-admin-accent/20"
                        >
                            {loading ? 'Creando...' : 'Crear Administrador'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
