import { 
    Bell, Link2, Shield, Clock, 
    Smartphone, Monitor, Mail, Video, ChevronRight
} from 'lucide-react';
import { createClient } from '@/lib/supabase-server-client';
import GoogleIntegration from './GoogleIntegration';
import SettingsForm from './SettingsForm';

export default async function SettingsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Dynamically build user profile details
    const fullName = user?.user_metadata?.full_name 
        || (user?.user_metadata?.firstName ? `${user.user_metadata.firstName} ${user.user_metadata.lastName || ''}`.trim() : null) 
        || user?.email?.split('@')[0] 
        || 'Reclutador';
    
    const email = user?.email || '';
    const phone = user?.user_metadata?.phone || '';
    const avatarUrl = user?.user_metadata?.avatar_url || '';
    const jobTitle = user?.user_metadata?.job_title || 'Senior Talent Acquisition';

    // Check Google Integration Status
    const { data: googleToken } = await supabase
        .from('recruiter_google_tokens')
        .select('recruiter_id')
        .eq('recruiter_id', user?.id)
        .single();
    
    const isGoogleConnected = !!googleToken;

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-outfit p-8 md:p-12">
            <div className="max-w-[1000px] mx-auto">
                <div className="mb-12">
                    <h1 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight mb-2">Configuración</h1>
                    <p className="text-[14px] font-medium text-slate-500">Gestiona tus preferencias y seguridad de cuenta.</p>
                </div>

                {/* Interactive Profile Form */}
                <SettingsForm 
                    initialData={{
                        fullName,
                        jobTitle,
                        email,
                        phone,
                        avatarUrl
                    }} 
                />

                {/* Split Row: Notifications & Integrations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Notifications Card */}
                    <div className="bg-white rounded-[24px] shadow-sm border border-slate-200/60 p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <Bell className="text-[#0B4FEA]" size={22} strokeWidth={2.5} />
                            <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Notificaciones</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center group">
                                <div className="pr-4">
                                    <h4 className="text-[14px] font-extrabold text-slate-900 mb-0.5 group-hover:text-[#0B4FEA] transition-colors">Nueva Postulación</h4>
                                    <p className="text-[12px] font-medium text-slate-500">Recibe avisos cuando alguien se postula a tus vacantes.</p>
                                </div>
                                <div className="w-10 h-5.5 bg-[#0B4FEA] rounded-full relative shrink-0 cursor-pointer shadow-inner">
                                    <div className="absolute right-[3px] top-[3px] w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center group">
                                <div className="pr-4">
                                    <h4 className="text-[14px] font-extrabold text-slate-900 mb-0.5 group-hover:text-[#0B4FEA] transition-colors">Recordatorios de Entrevista</h4>
                                    <p className="text-[12px] font-medium text-slate-500">Alertas 15 minutos antes de las reuniones programadas.</p>
                                </div>
                                <div className="w-10 h-5.5 bg-[#0B4FEA] rounded-full relative shrink-0 cursor-pointer shadow-inner">
                                    <div className="absolute right-[3px] top-[3px] w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center group">
                                <div className="pr-4">
                                    <h4 className="text-[14px] font-extrabold text-slate-900 mb-0.5 group-hover:text-[#0B4FEA] transition-colors">Mensajes Nuevos</h4>
                                    <p className="text-[12px] font-medium text-slate-500">Mensajes directos de candidatos o del equipo.</p>
                                </div>
                                <div className="w-10 h-5.5 bg-[#0B4FEA] rounded-full relative shrink-0 cursor-pointer shadow-inner">
                                    <div className="absolute right-[3px] top-[3px] w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center group">
                                <div className="pr-4">
                                    <h4 className="text-[14px] font-extrabold text-slate-900 mb-0.5">Actualizaciones</h4>
                                    <p className="text-[12px] font-medium text-slate-500">Nuevas funciones y anuncios de la plataforma.</p>
                                </div>
                                <div className="w-10 h-5.5 bg-slate-200 rounded-full relative shrink-0 cursor-pointer shadow-inner border border-slate-300">
                                    <div className="absolute left-[3px] top-[3px] w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Integrations Card */}
                    <div className="bg-white rounded-[24px] shadow-sm border border-slate-200/60 p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <Link2 className="text-[#0B4FEA]" size={22} strokeWidth={2.5} />
                            <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Integraciones</h3>
                        </div>
                        <div className="space-y-4">
                            <GoogleIntegration isConnected={isGoogleConnected} />
                            <div className="flex items-center p-4 bg-[#FAFAFA] border border-slate-100/80 rounded-[16px] shadow-sm opacity-60 grayscale-[0.5]">
                                <div className="w-9 h-9 flex items-center justify-center shrink-0 mr-4">
                                    <Mail size={22} className="text-[#0B4FEA]" strokeWidth={2.5} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-[13px] font-extrabold text-slate-900 leading-tight">MS Outlook</h4>
                                    <span className="text-[9px] font-black tracking-widest text-[#0B4FEA] uppercase bg-blue-50 px-2 py-0.5 rounded-md">PRÓXIMAMENTE</span>
                                </div>
                                <button disabled className="text-[11px] font-bold text-slate-400 cursor-not-allowed uppercase tracking-tight">Soon</button>
                            </div>
                            <div className="flex items-center p-4 bg-[#FAFAFA] border border-slate-100/80 rounded-[16px] shadow-sm opacity-60 grayscale-[0.5]">
                                <div className="w-9 h-9 flex items-center justify-center shrink-0 mr-4">
                                    <Video size={24} className="text-teal-500" strokeWidth={2.5} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-[13px] font-extrabold text-slate-900 leading-tight">Zoom / Meet</h4>
                                    <span className="text-[9px] font-black tracking-widest text-[#0B4FEA] uppercase bg-blue-50 px-2 py-0.5 rounded-md">PRÓXIMAMENTE</span>
                                </div>
                                <button disabled className="text-[11px] font-bold text-slate-400 cursor-not-allowed uppercase tracking-tight">Soon</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Weekly Availability Card */}
                <div className="bg-white rounded-[24px] shadow-sm border border-slate-200/60 p-8 mb-8 overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <Clock className="text-[#0B4FEA]" size={22} strokeWidth={2.5} />
                            <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Disponibilidad Semanal</h3>
                        </div>
                        <div className="flex items-center gap-4 hidden sm:flex">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-[#E0E7FF] rounded-[3px]"></div>
                                <span className="text-[10px] font-bold text-slate-500">Horarios Entrevista</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-slate-100 rounded-[3px]"></div>
                                <span className="text-[10px] font-bold text-slate-500">Fuera de Horario</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full min-w-[600px] overflow-x-auto custom-scrollbar pb-4">
                        <table className="w-full text-center border-separate border-spacing-2">
                            <thead>
                                <tr>
                                    <th className="w-16"></th>
                                    <th className="text-[10px] font-black text-slate-500 tracking-widest pb-2 uppercase">LUN</th>
                                    <th className="text-[10px] font-black text-slate-500 tracking-widest pb-2 uppercase">MAR</th>
                                    <th className="text-[10px] font-black text-slate-500 tracking-widest pb-2 uppercase">MIE</th>
                                    <th className="text-[10px] font-black text-slate-500 tracking-widest pb-2 uppercase">JUE</th>
                                    <th className="text-[10px] font-black text-slate-500 tracking-widest pb-2 uppercase">VIE</th>
                                    <th className="text-[10px] font-black text-red-500 tracking-widest pb-2 uppercase">SAB</th>
                                    <th className="text-[10px] font-black text-red-500 tracking-widest pb-2 uppercase">DOM</th>
                                </tr>
                            </thead>
                            <tbody className="text-[11px] font-bold text-slate-500">
                                <tr>
                                    <td className="pr-4 text-right align-middle">09:00</td>
                                    <td><div className="h-[28px] bg-[#E0E7FF] rounded-md w-full cursor-pointer hover:bg-blue-200 transition-colors"></div></td>
                                    <td><div className="h-[28px] bg-[#E0E7FF] rounded-md w-full cursor-pointer hover:bg-blue-200 transition-colors"></div></td>
                                    <td><div className="h-[28px] bg-[#E0E7FF] rounded-md w-full cursor-pointer hover:bg-blue-200 transition-colors"></div></td>
                                    <td><div className="h-[28px] bg-[#E0E7FF] rounded-md w-full cursor-pointer hover:bg-blue-200 transition-colors"></div></td>
                                    <td><div className="h-[28px] bg-[#E0E7FF] rounded-md w-full cursor-pointer hover:bg-blue-200 transition-colors"></div></td>
                                    <td><div className="h-[28px] bg-slate-100 rounded-md w-full opacity-60"></div></td>
                                    <td><div className="h-[28px] bg-slate-100 rounded-md w-full opacity-60"></div></td>
                                </tr>
                                <tr>
                                    <td className="pr-4 text-right align-middle">11:00</td>
                                    <td><div className="h-[28px] bg-[#E0E7FF] rounded-md w-full cursor-pointer hover:bg-blue-200 transition-colors"></div></td>
                                    <td><div className="h-[28px] bg-[#E0E7FF] rounded-md w-full cursor-pointer hover:bg-blue-200 transition-colors"></div></td>
                                    <td><div className="h-[28px] bg-slate-100 rounded-md w-full cursor-pointer hover:bg-slate-200 transition-colors"></div></td>
                                    <td><div className="h-[28px] bg-[#E0E7FF] rounded-md w-full cursor-pointer hover:bg-blue-200 transition-colors"></div></td>
                                    <td><div className="h-[28px] bg-[#E0E7FF] rounded-md w-full cursor-pointer hover:bg-blue-200 transition-colors"></div></td>
                                    <td><div className="h-[28px] bg-slate-100 rounded-md w-full opacity-60"></div></td>
                                    <td><div className="h-[28px] bg-slate-100 rounded-md w-full opacity-60"></div></td>
                                </tr>
                                <tr>
                                    <td className="pr-4 text-right align-middle">13:00</td>
                                    <td><div className="h-[28px] bg-slate-100 rounded-md w-full cursor-pointer hover:bg-slate-200 transition-colors"></div></td>
                                    <td><div className="h-[28px] bg-slate-100 rounded-md w-full cursor-pointer hover:bg-slate-200 transition-colors"></div></td>
                                    <td><div className="h-[28px] bg-slate-100 rounded-md w-full cursor-pointer hover:bg-slate-200 transition-colors"></div></td>
                                    <td><div className="h-[28px] bg-slate-100 rounded-md w-full cursor-pointer hover:bg-slate-200 transition-colors"></div></td>
                                    <td><div className="h-[28px] bg-slate-100 rounded-md w-full cursor-pointer hover:bg-slate-200 transition-colors"></div></td>
                                    <td><div className="h-[28px] bg-slate-100 rounded-md w-full opacity-60"></div></td>
                                    <td><div className="h-[28px] bg-slate-100 rounded-md w-full opacity-60"></div></td>
                                </tr>
                                <tr>
                                    <td className="pr-4 text-right align-middle">15:00</td>
                                    <td><div className="h-[28px] bg-[#E0E7FF] rounded-md w-full cursor-pointer hover:bg-blue-200 transition-colors"></div></td>
                                    <td><div className="h-[28px] bg-[#E0E7FF] rounded-md w-full cursor-pointer hover:bg-blue-200 transition-colors"></div></td>
                                    <td><div className="h-[28px] bg-[#E0E7FF] rounded-md w-full cursor-pointer hover:bg-blue-200 transition-colors"></div></td>
                                    <td><div className="h-[28px] bg-[#E0E7FF] rounded-md w-full cursor-pointer hover:bg-blue-200 transition-colors"></div></td>
                                    <td><div className="h-[28px] bg-[#E0E7FF] rounded-md w-full cursor-pointer hover:bg-blue-200 transition-colors"></div></td>
                                    <td><div className="h-[28px] bg-slate-100 rounded-md w-full opacity-60"></div></td>
                                    <td><div className="h-[28px] bg-slate-100 rounded-md w-full opacity-60"></div></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Security & Access Card */}
                <div className="bg-white rounded-[24px] shadow-sm border border-slate-200/60 p-8 mb-8">
                    <div className="flex items-center gap-3 mb-8">
                        <Shield className="text-[#0B4FEA]" size={22} strokeWidth={2.5} />
                        <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Seguridad y Acceso</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Change Password Column */}
                        <div>
                            <h4 className="text-[14px] font-extrabold text-slate-900 mb-6">Cambiar Contraseña</h4>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest pl-3 mb-2">Contraseña Actual</label>
                                    <div className="w-full bg-[#f4f6fa] rounded-t-lg border-b-2 border-slate-300 px-4 py-3">
                                        <input type="password" defaultValue="********" className="w-full bg-transparent outline-none text-[18px] font-black text-slate-800 placeholder:text-slate-400 tracking-widest h-5" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest pl-3 mb-2">Nueva Contraseña</label>
                                    <div className="w-full bg-[#f4f6fa] rounded-t-lg border-b-2 border-slate-300 px-4 py-3">
                                        <input type="password" defaultValue="********" className="w-full bg-transparent outline-none text-[18px] font-black text-slate-800 placeholder:text-slate-400 tracking-widest h-5" />
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest pl-3 mb-2">Confirmar Nueva Contraseña</label>
                                    <div className="w-full bg-[#f4f6fa] rounded-t-lg border-b-2 border-slate-300 px-4 py-3">
                                        <input type="password" defaultValue="********" className="w-full bg-transparent outline-none text-[18px] font-black text-slate-800 placeholder:text-slate-400 tracking-widest h-5" />
                                    </div>
                                </div>
                                <button className="px-5 py-2.5 bg-[#EEF2FF] text-[#0B4FEA] font-bold text-[13px] rounded-lg hover:bg-blue-100 transition-colors">
                                    Actualizar Contraseña
                                </button>
                            </div>
                        </div>

                        {/* 2FA and Active Sessions Column */}
                        <div className="flex flex-col gap-8">
                            <div>
                                <h4 className="text-[14px] font-extrabold text-slate-900 mb-6">Autenticación de Dos Factores</h4>
                                <div className="bg-[#FAFAFA] border border-[#E0E7FF] p-6 rounded-2xl shadow-sm hover:border-blue-200 transition-colors">
                                    <div className="flex justify-between items-start mb-3 group">
                                        <h5 className="text-[13px] font-extrabold text-slate-900 group-hover:text-[#0B4FEA] transition-colors">Asegura tu cuenta</h5>
                                        <div className="w-10 h-5.5 bg-[#0B4FEA] rounded-full relative shrink-0 cursor-pointer shadow-inner">
                                            <div className="absolute right-[3px] top-[3px] w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                        </div>
                                    </div>
                                    <p className="text-[11px] font-medium text-slate-500 leading-relaxed mb-5">
                                        Agrega una capa extra de seguridad a tu cuenta de reclutador requiriendo un código de verificación además de tu contraseña.
                                    </p>
                                    <div className="flex items-center gap-6">
                                        <button className="flex items-center gap-1.5 text-[11px] font-black text-[#0B4FEA] hover:underline hover:text-blue-800 transition-colors">
                                            <Smartphone size={14} /> Configurar App
                                        </button>
                                        <button className="flex items-center gap-1.5 text-[11px] font-black text-[#0B4FEA] hover:underline hover:text-blue-800 transition-colors">
                                            {"</>"} Códigos de Respaldo
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[14px] font-extrabold text-slate-900 mb-4">Sesiones Activas</h4>
                                <div className="bg-[#FAFAFA] border border-slate-100 p-4 rounded-xl flex items-center justify-between mb-3 hover:border-slate-200 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Monitor size={16} className="text-slate-400" />
                                        <div>
                                            <h5 className="text-[12px] font-bold text-slate-900">MacBook Pro · London, UK</h5>
                                            <span className="text-[10px] text-slate-400 font-medium">Activo ahora</span>
                                        </div>
                                    </div>
                                    <button className="text-[11px] font-extrabold text-[#0B4FEA] hover:text-blue-800 transition-colors">Este Dispositivo</button>
                                </div>
                                <button className="w-full text-center text-[11px] font-extrabold text-red-600 hover:text-red-700 transition-colors pt-2 hover:underline">
                                    Cerrar sesión en todos los demás dispositivos
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Archive Account Row */}
                <div className="flex justify-between items-center px-4 py-8 border-t border-slate-200/80 mb-16">
                    <div>
                        <h4 className="text-[14px] font-extrabold text-red-600 mb-1">Archivar Cuenta</h4>
                        <p className="text-[11px] font-medium text-slate-500">Desactiva temporalmente tu perfil de reclutador y vacantes activas.</p>
                    </div>
                    <button className="px-5 py-2.5 border border-red-300 text-red-600 text-[12px] font-extrabold rounded-lg hover:bg-red-50 transition-colors">
                        Archivar Cuenta
                    </button>
                </div>

                {/* Footer */}
                <div className="text-center text-[11px] font-bold text-slate-400 pb-10">
                    © 2024 Dibrand Talent ATS. Todos los derechos reservados. Edición Profesional.
                </div>
            </div>
        </div>
    );
}
