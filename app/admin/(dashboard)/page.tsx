import { FileText, Users, Eye, TrendingUp, PlusCircle, Settings, MessageSquare, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const stats = [
        { label: 'Proyectos Activos', value: '12', icon: Briefcase, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10', trend: '+2 this month' },
        { label: 'Clientes Totales', value: '48', icon: Users, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/10', trend: '+5 this year' },
        { label: 'Visitas Portfolio', value: '2.4k', icon: Eye, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', trend: '+12% vs last month' },
        { label: 'Tasa Conversión', value: '4.2%', icon: TrendingUp, color: 'text-brand-fuchsia dark:text-pink-400', bg: 'bg-brand-fuchsia/5 dark:bg-brand-fuchsia/10', trend: '+0.5% growth' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-admin-text-primary tracking-tight">Dashboard Overview</h2>
                    <p className="text-admin-text-secondary text-sm mt-1 font-medium italic">Bienvenido de nuevo al panel de control de Dibrand.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-admin-card-bg border border-admin-border text-admin-text-primary rounded-xl text-xs font-bold hover:bg-admin-bg transition-all shadow-sm">
                        Exportar Reporte
                    </button>
                    <Link
                        href="/admin/success-stories/new"
                        className="px-4 py-2 bg-admin-accent text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all shadow-lg shadow-admin-accent/20"
                    >
                        + Nuevo Caso
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-admin-card-bg p-6 rounded-2xl border border-admin-border shadow-sm flex flex-col gap-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                        <div className="flex justify-between items-start">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-colors group-hover:scale-110 duration-300`}>
                                <stat.icon size={22} />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.trend}</span>
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-3xl font-black text-admin-text-primary">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Quick Actions */}
                <div className="lg:col-span-2 bg-admin-card-bg p-8 rounded-2xl border border-admin-border shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-admin-border/50 pb-4">
                        <h3 className="text-sm font-black text-admin-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-admin-accent animate-pulse"></div>
                            Accesos Directos
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Link
                            href="/admin/success-stories/new"
                            className="p-5 border border-admin-border rounded-2xl hover:border-admin-accent/30 hover:bg-admin-accent/5 transition-all group flex flex-col gap-3"
                        >
                            <div className="w-10 h-10 rounded-xl bg-admin-bg flex items-center justify-center text-gray-400 group-hover:bg-admin-accent/10 group-hover:text-admin-accent transition-colors">
                                <PlusCircle size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-sm text-admin-text-primary">Crear Caso</p>
                                <p className="text-[10px] text-gray-400 font-medium">Publicar un nuevo caso de éxito</p>
                            </div>
                        </Link>

                        <div className="p-5 border border-admin-border rounded-2xl opacity-60 flex flex-col gap-3">
                            <div className="w-10 h-10 rounded-xl bg-admin-bg flex items-center justify-center text-gray-400">
                                <MessageSquare size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-sm text-admin-text-primary">Inquiries</p>
                                <p className="text-[10px] text-gray-400 font-medium">Gestionar consultas de clientes</p>
                            </div>
                        </div>

                        <div className="p-5 border border-admin-border rounded-2xl opacity-60 flex flex-col gap-3">
                            <div className="w-10 h-10 rounded-xl bg-admin-bg flex items-center justify-center text-gray-400">
                                <Settings size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-sm text-admin-text-primary">Configuración</p>
                                <p className="text-[10px] text-gray-400 font-medium">Ajustes generales del sitio</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-admin-card-bg p-8 rounded-2xl border border-admin-border shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-admin-border/50 pb-4">
                        <h3 className="text-sm font-black text-admin-text-primary uppercase tracking-[0.2em]">Actividad</h3>
                    </div>
                    <div className="space-y-6">
                        {[
                            { user: 'Admin', act: 'publicó un nuevo caso', target: 'HealthTech Inc', time: 'hace 2h' },
                            { user: 'System', act: 'detectó nueva consulta de', target: 'Sarah Connor', time: 'hace 5h' },
                            { user: 'Admin', act: 'actualizó el proyecto', target: 'Dibrand App', time: 'ayer' },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-admin-accent/10 flex items-center justify-center text-[10px] font-black text-admin-accent shrink-0">
                                    {item.user[0]}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-admin-text-primary leading-relaxed font-medium">
                                        <span className="font-bold">{item.user}</span> {item.act} <span className="font-bold text-admin-accent">{item.target}</span>
                                    </p>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
