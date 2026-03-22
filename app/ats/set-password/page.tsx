'use client'

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';

export default function SetPasswordPage() {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [sessionReady, setSessionReady] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Explicitly listen for the invitation session processing
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
                setSessionReady(true);
                setInitialLoading(false);
                setError(null);
            } else if (!window.location.hash.includes('access_token')) {
                // Only show error if there's no token in the hash and no session
                setError('No se detectó una invitación válida o el link expiró.');
                setInitialLoading(false);
            }
        });

        // Safety timeout for cases where hash processing takes too long or fails
        const timer = setTimeout(() => {
            if (initialLoading) {
                setInitialLoading(false);
                // Check if session became ready in the meantime
            }
        }, 5000);

        return () => {
            subscription.unsubscribe();
            clearTimeout(timer);
        };
    }, [supabase, initialLoading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sessionReady) {
            setError('Esperando validación de sesión...');
            return;
        }
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password
            });

            if (updateError) throw updateError;

            setSuccess(true);
            setTimeout(() => {
                router.push('/ats');
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Error al establecer la contraseña.');
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-8">
                <div className="max-w-md w-full text-center space-y-6 animate-pulse">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto border border-slate-200">
                        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Validando Invitación</h2>
                        <p className="text-slate-400 text-sm font-medium italic">Espera un momento...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-8">
                <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-100/50">
                        <CheckCircle size={40} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">¡Contraseña Lista!</h2>
                        <p className="text-slate-500 font-medium italic">Acceso configurado correctamente. Redirigiendo al Dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 font-sans">
            <div className="max-w-md w-full bg-white p-12 rounded-[40px] shadow-2xl shadow-slate-200 border border-slate-100 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="space-y-6">
                    <div className="flex justify-center">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black italic text-2xl">di</div>
                    </div>
                    <div className="text-center space-y-2">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Bienvenido</h2>
                        <p className="text-slate-500 text-sm font-medium italic">Por seguridad, establece tu contraseña de acceso.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Nueva Contraseña</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all font-bold text-slate-900"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirmar Contraseña</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all font-bold text-slate-900"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-[11px] font-bold uppercase tracking-widest">
                            <ShieldCheck size={18} className="inline mr-2" />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-16 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-indigo-600/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                        {loading ? 'Configurando...' : 'Finalizar y Entrar'}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>
            </div>
        </div>
    );
}
