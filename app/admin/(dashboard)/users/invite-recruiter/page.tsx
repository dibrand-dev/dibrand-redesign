'use client'

import { useRouter } from 'next/navigation';
import { inviteRecruiter } from '../actions';
import { useState } from 'react';
import { ArrowLeft, Mail, User, Send, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function InviteRecruiterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);
        try {
            await inviteRecruiter(formData);
            setSuccess(true);
            setTimeout(() => {
                router.push('/admin/users');
            }, 3000);
        } catch (err: any) {
            setError(err.message || 'Error al enviar la invitación');
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="max-w-md mx-auto mt-20 p-12 bg-white rounded-[40px] border border-slate-100 text-center space-y-6 shadow-2xl animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto">
                    <CheckCircle size={40} />
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Invitación Enviada</h2>
                    <p className="text-slate-500 font-medium italic">El reclutador recibirá un correo con el link de acceso.</p>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Redirigiendo a la lista de usuarios...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/admin/users" className="w-12 h-12 flex items-center justify-center bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all shadow-sm">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none mb-2">Invitar <span className="text-indigo-600">Reclutador</span></h2>
                        <p className="text-slate-500 font-medium italic text-sm">Envía un email de acceso para el Módulo ATS.</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-10 rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-indigo-600 group-hover:scale-110 transition-transform duration-1000">
                    <Mail size={160} />
                </div>

                <form action={handleSubmit} className="space-y-8 relative z-10">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nombre</label>
                            <div className="relative group/input">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-indigo-600 transition-colors" size={18} />
                                <input
                                    name="firstName"
                                    type="text"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all text-slate-900 font-bold placeholder:italic placeholder:font-normal"
                                    placeholder="Ej. Pedro"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Apellido</label>
                            <div className="relative group/input">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-indigo-600 transition-colors" size={18} />
                                <input
                                    name="lastName"
                                    type="text"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all text-slate-900 font-bold placeholder:italic placeholder:font-normal"
                                    placeholder="Ej. Elizalde"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email de Invitación</label>
                        <div className="relative group/input">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-indigo-600 transition-colors" size={18} />
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all text-slate-900 font-bold placeholder:italic placeholder:font-normal"
                                placeholder="reclutador@agencia.com"
                            />
                        </div>
                    </div>

                    <div className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                            <Send size={20} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-indigo-900 uppercase">Flujo de Seguridad</p>
                            <p className="text-[10px] text-indigo-700 font-medium leading-relaxed italic">
                                Al confirmar, Supabase enviará un correo de seguridad. El reclutador podrá definir su contraseña propia y acceder directamente al módulo /ats.
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-[11px] font-bold uppercase tracking-widest animate-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all disabled:opacity-50 shadow-xl shadow-slate-200 active:scale-95 flex items-center justify-center gap-3"
                    >
                        {loading ? 'Enviando invitación...' : 'Enviar Invitación de Supabase'}
                    </button>
                </form>
            </div>
        </div>
    );
}
