'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Users, 
  Eye, 
  TrendingUp, 
  PlusCircle, 
  MessageSquare, 
  Briefcase,
  Bell,
  ArrowUpRight,
  MousePointerClick,
  Clock,
  ExternalLink,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { getDashboardStats, DateRange } from '@/app/admin/(dashboard)/dashboard-actions';
import ConversionChart from './ConversionChart';

export default function DashboardV2() {
  const [range, setRange] = useState<DateRange>('last30');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [range]);

  const fetchStats = async () => {
    setLoading(true);
    const stats = await getDashboardStats(range);
    setData(stats);
    setLoading(false);
  };

  const kpis = [
    { 
      label: 'Consultas de Contacto', 
      value: data?.kpis.contactLeads.value ?? '...', 
      icon: MessageSquare, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50', 
      trend: data?.kpis.contactLeads.trend ?? '',
      isPositive: true 
    },
    { 
      label: 'Clicks en Turnos', 
      value: data?.kpis.appointmentClicks.value ?? '...', 
      icon: MousePointerClick, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50', 
      trend: data?.kpis.appointmentClicks.trend ?? '',
      isPositive: true 
    },
    { 
      label: 'Nuevos Candidatos', 
      value: data?.kpis.newCandidates.value ?? '...', 
      icon: Users, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50', 
      trend: data?.kpis.newCandidates.trend ?? '',
      isPositive: true 
    },
    { 
      label: 'Tráfico Portfolio', 
      value: data?.kpis.portfolioTraffic.value ?? '...', 
      icon: Eye, 
      color: 'text-brand-fuchsia', 
      bg: 'bg-brand-fuchsia/5', 
      trend: data?.kpis.portfolioTraffic.trend ?? '',
      isPositive: true 
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-admin-text-primary tracking-tight">Vista General</h2>
          <p className="text-admin-text-secondary text-sm mt-1 font-medium italic">Estado actual de Dibrand Digital.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={range}
            onChange={(e) => setRange(e.target.value as DateRange)}
            className="bg-admin-card-bg border border-admin-border text-admin-text-primary rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-admin-accent outline-none shadow-sm cursor-pointer"
          >
            <option value="today">Hoy</option>
            <option value="last10">Últimos 10 días</option>
            <option value="last30">Últimos 30 días</option>
            <option value="month">Este mes</option>
            <option value="year">Este año</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-admin-card-bg p-6 rounded-2xl border border-admin-border shadow-sm flex flex-col gap-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color} transition-colors group-hover:scale-110 duration-300`}>
                <kpi.icon size={22} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${kpi.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {kpi.trend}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">{kpi.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black text-admin-text-primary">
                  {loading ? <Loader2 size={24} className="animate-spin text-gray-200" /> : kpi.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Chart Card */}
          <div className="bg-admin-card-bg p-8 rounded-2xl border border-admin-border shadow-sm space-y-6">
             <div className="flex items-center justify-between border-b border-admin-border/50 pb-4">
               <div>
                <h3 className="text-sm font-black text-admin-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  Tendencia de Conversión
                </h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Últimos 7 días</p>
               </div>
            </div>
            {loading ? (
              <div className="h-[300px] flex items-center justify-center">
                 <Loader2 size={40} className="animate-spin text-admin-accent opacity-20" />
              </div>
            ) : (
              <ConversionChart data={data?.chartData || []} />
            )}
          </div>

        </div>

        {/* Sidebar Activity & Actions */}
        <div className="space-y-8">
            {/* Recent Activity */}
            <div className="bg-admin-card-bg p-8 rounded-2xl border border-admin-border shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-admin-border/50 pb-4">
                    <h3 className="text-sm font-black text-admin-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                        <Clock size={16} /> Actividad
                    </h3>
                </div>
                <div className="space-y-6">
                    {loading ? [1,2,3].map(i => <div key={i} className="h-10 bg-gray-50 animate-pulse rounded-lg"/>) : 
                        data?.activity.length > 0 ? data.activity.map((item: any, i: number) => (
                        <div key={i} className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-admin-accent/10 flex items-center justify-center text-[10px] font-black text-admin-accent shrink-0 uppercase">
                                {item.admin_email?.[0] || 'A'}
                            </div>
                            <div className="space-y-1">
                                <p className="text-[11px] text-admin-text-primary leading-relaxed font-medium">
                                    <span className="font-bold text-gray-500">{item.admin_email?.split('@')[0]}</span> {item.action} <span className="font-bold text-admin-accent">{item.target_name}</span>
                                </p>
                                <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">
                                    {new Date(item.created_at).toLocaleDateString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    )) : (
                        <p className="text-[10px] text-gray-400 italic">Sin actividad reciente.</p>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-admin-card-bg p-8 rounded-2xl border border-admin-border shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-admin-border/50 pb-4">
                    <h3 className="text-sm font-black text-admin-text-primary uppercase tracking-[0.2em]">Accesos</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <Link
                        href="/admin/success-stories/new"
                        className="p-5 border border-admin-border rounded-2xl hover:border-admin-accent/30 hover:bg-admin-accent/5 transition-all group flex items-center gap-4"
                    >
                        <div className="w-10 h-10 rounded-xl bg-admin-bg flex items-center justify-center text-gray-400 group-hover:bg-admin-accent/10 group-hover:text-admin-accent transition-colors">
                            <PlusCircle size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-sm text-admin-text-primary">Crear Caso</p>
                            <p className="text-[10px] text-gray-400 font-medium">Nuevo caso de éxito</p>
                        </div>
                    </Link>

                    <Link
                        href="/admin/jobs/new"
                        className="p-5 border border-admin-border rounded-2xl hover:border-admin-accent/30 hover:bg-admin-accent/5 transition-all group flex items-center gap-4"
                    >
                        <div className="w-10 h-10 rounded-xl bg-admin-bg flex items-center justify-center text-gray-400 group-hover:bg-admin-accent/10 group-hover:text-admin-accent transition-colors">
                            <Briefcase size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-sm text-admin-text-primary">Publicar Job</p>
                            <p className="text-[10px] text-gray-400 font-medium">Búsqueda laboral</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Help / Docs Section */}
            <div className="bg-admin-card-bg p-8 rounded-2xl border border-admin-border shadow-sm">
                <h4 className="text-[11px] font-black text-admin-text-primary uppercase tracking-[0.2em] mb-4">Soporte y Ayuda</h4>
                <div className="space-y-4">
                  <Link href="/admin/docs" className="flex items-center justify-between p-4 bg-admin-bg rounded-xl hover:bg-admin-border transition-colors group">
                    <span className="text-xs font-bold text-admin-text-primary">Guía de Administrador</span>
                    <ExternalLink size={14} className="text-gray-400 group-hover:text-admin-accent" />
                  </Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
