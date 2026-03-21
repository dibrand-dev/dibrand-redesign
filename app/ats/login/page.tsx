'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, Mail, Lock, LogIn, ArrowRight, ShieldCheck, Briefcase } from 'lucide-react';

export default function AtsLoginPage() {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) throw new Error(signInError.message);

            router.push('/ats');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Credenciales inválidas o error de conexión.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen flex bg-slate-50 font-sans overflow-hidden">
            {/* Left Side: Illustration & Branding */}
            <div className="hidden lg:flex w-1/2 bg-indigo-900 items-center justify-center relative p-16">
                <div className="max-w-lg w-full relative z-10 animate-in fade-in slide-in-from-left-8 duration-1000">
                    <div className="space-y-8">
                        <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-white backdrop-blur-xl border border-white/20">
                            <Briefcase size={40} />
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-5xl font-black text-white leading-tight tracking-tight uppercase">Talent <br /><span className="text-indigo-400">Pipeline</span> Manager</h1>
                            <p className="text-indigo-200 text-lg font-medium max-w-sm">Accede a la red de talentos élite de Dibrand y gestiona tus vacantes activas en tiempo real.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-8">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                <p className="text-2xl font-black text-white">450+</p>
                                <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Candidatos Élite</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                <p className="text-2xl font-black text-white">Top 3%</p>
                                <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">LATAM Talent</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -ml-32 -mt-32"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-48 -mb-48"></div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 animate-in fade-in duration-700">
                <div className="max-w-md w-full space-y-10">
                    <div className="space-y-6">
                        <div className="flex justify-center lg:justify-start">
                             <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black italic text-xl">di</div>
                        </div>
                        <div className="text-center lg:text-left space-y-2">
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Recruiter Login</h2>
                            <p className="text-slate-500 text-sm font-medium italic">Ingresa a tu cuenta de reclutador para empezar.</p>
                        </div>
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">E-mail Corporativo</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-200"
                                        placeholder="reclutador@agencia.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Contraseña</label>
                                    <button type="button" className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest hover:opacity-70">¿Ayuda?</button>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-12 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-200"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-3 p-4 bg-rose-50 rounded-2xl border border-rose-100 text-rose-600 text-sm font-medium animate-in slide-in-from-top-2">
                                <ShieldCheck size={18} />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? 'Autenticando...' : 'Entrar al ATS'}
                            {!isLoading && <ArrowRight size={18} />}
                        </button>
                    </form>

                    <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Dibrand Recruitment Network &copy; 2026
                    </p>
                </div>
            </div>
        </div>
    );
}
