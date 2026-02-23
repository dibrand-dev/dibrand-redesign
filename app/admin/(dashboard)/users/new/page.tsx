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
                <Link href="/admin/users" className="p-2 hover:bg-corporate-grey/5 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-corporate-grey font-heading">Nuevo Administrador</h2>
                    <p className="text-corporate-grey/60">Crea un nuevo usuario para el equipo</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border">
                <form action={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-corporate-grey">Nombre</label>
                            <input
                                name="firstName"
                                type="text"
                                required
                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                placeholder="Ej. Juan"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-corporate-grey">Apellido</label>
                            <input
                                name="lastName"
                                type="text"
                                required
                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                placeholder="Ej. Pérez"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-corporate-grey">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="email@dibrand.co"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-corporate-grey">Contraseña</label>
                        <input
                            name="password"
                            type="password"
                            required
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
                            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {loading ? 'Creando...' : 'Crear Administrador'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
