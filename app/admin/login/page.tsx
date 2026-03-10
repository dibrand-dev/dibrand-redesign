'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, Mail, Lock, LogIn, Chrome, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
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
            console.log("Intentando login para:", email);
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                console.error("Error de Supabase:", signInError);
                throw new Error(signInError.message);
            }

            console.log("Login exitoso, redirigiendo...");
            router.push('/admin');
            router.refresh();
        } catch (err: any) {
            console.error("Error de Login capturado:", err);
            setError(err.message || 'Credenciales inválidas o error de conexión.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/admin`,
                },
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen flex bg-white font-sans overflow-hidden">
            {/* Left Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 animate-in fade-in duration-700">
                <div className="max-w-md w-full space-y-10">
                    {/* Logo & Header */}
                    <div className="space-y-6">
                        <div className="flex justify-center lg:justify-start">
                            <div className="relative h-7 w-auto transition-all duration-300 hover:opacity-80">
                                <Image
                                    src="/admin/dibrand_200x28.png"
                                    alt="Dibrand Logo"
                                    width={200}
                                    height={28}
                                    className="object-contain dark:invert"
                                    priority
                                />
                            </div>
                        </div>
                        <div className="text-center lg:text-left space-y-2">
                            <h2 className="text-4xl font-black text-admin-text-primary tracking-tight">Bienvenido a Dibrand</h2>
                            <p className="text-admin-text-secondary text-sm font-medium">Ingresá tus credenciales para acceder al panel de administracion.</p>
                        </div>
                    </div>

                    {/* Login Form */}
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-admin-text-secondary uppercase tracking-wider ml-1">E-mail</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-admin-accent transition-colors" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-admin-border focus:ring-4 focus:ring-admin-accent/5 focus:border-admin-accent outline-none transition-all font-medium text-admin-text-primary placeholder:text-gray-300"
                                        placeholder="tu@email.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-[11px] font-bold text-admin-text-secondary uppercase tracking-wider">Contraseña</label>
                                    <button type="button" className="text-[11px] font-bold text-admin-accent uppercase tracking-wider hover:opacity-70">¿Olvidaste la contraseña?</button>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-admin-accent transition-colors" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-12 py-4 rounded-2xl border border-admin-border focus:ring-4 focus:ring-admin-accent/5 focus:border-admin-accent outline-none transition-all font-medium text-admin-text-primary placeholder:text-gray-300"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-admin-text-primary transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center gap-3 ml-1">
                            <input type="checkbox" id="remember" className="w-5 h-5 border-admin-border rounded-lg text-admin-accent focus:ring-admin-accent/20 cursor-pointer" />
                            <label htmlFor="remember" className="text-sm font-medium text-admin-text-secondary cursor-pointer">Recordarme en este equipo</label>
                        </div>

                        {error && (
                            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-2xl border border-red-100 text-red-600 text-sm font-medium animate-in slide-in-from-top-2">
                                <ShieldCheck size={18} />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-admin-accent text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-admin-accent/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? 'Iniciando sesión...' : 'Ingresar al Panel'}
                            {!isLoading && <ArrowRight size={18} />}
                        </button>
                    </form>

                    <p className="text-center text-sm font-medium text-admin-text-secondary">
                        ¿No tenés acceso? <button className="text-admin-accent font-bold hover:underline">Contactá a Soporte</button>
                    </p>
                </div>
            </div>

            {/* Right Side: Illustration & Branding */}
            <div className="hidden lg:flex w-1/2 bg-[#F9FAFB] items-center justify-center relative p-16">
                <div className="max-w-lg w-full relative z-10 animate-in fade-in slide-in-from-right-8 duration-1000">
                    <div className="relative aspect-square w-full rounded-[40px] overflow-hidden shadow-2xl">
                        <Image
                            src="/admin/login-illustration.png"
                            alt="Admin Illustration"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-admin-accent/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-admin-accent/5 rounded-full blur-3xl -ml-48 -mb-48"></div>
            </div>
        </div>
    );
}
