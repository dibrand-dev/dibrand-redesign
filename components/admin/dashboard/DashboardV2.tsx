'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Eye, 
  MessageSquare, 
  Briefcase,
  MousePointerClick,
  Clock,
  ExternalLink,
  Loader2,
  Calendar,
  Activity,
  ArrowRight
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
      color: 'text-[#0040A1]', 
      bg: 'bg-[#DAE2FF]', 
      trend: data?.kpis.contactLeads.trend ?? '',
      isPositive: true 
    },
    { 
      label: 'Clicks en Turnos', 
      value: data?.kpis.appointmentClicks.value ?? '...', 
      icon: MousePointerClick, 
      color: 'text-[#0040A1]', 
      bg: 'bg-[#DAE2FF]', 
      trend: data?.kpis.appointmentClicks.trend ?? '',
      isPositive: true 
    },
    { 
      label: 'Nuevos Candidatos', 
      value: data?.kpis.newCandidates.value ?? '...', 
      icon: Users, 
      color: 'text-[#0040A1]', 
      bg: 'bg-[#DAE2FF]', 
      trend: data?.kpis.newCandidates.trend ?? '',
      isPositive: true 
    },
    { 
      label: 'Tráfico Portfolio', 
      value: data?.kpis.portfolioTraffic.value ?? '...', 
      icon: Eye, 
      color: 'text-[#0040A1]', 
      bg: 'bg-[#DAE2FF]', 
      trend: data?.kpis.portfolioTraffic.trend ?? '',
      isPositive: true 
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700 font-inter">
      {/* Header section - ATS Sync */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#191C1D] tracking-tight">Vista General</h2>
          <p className="text-[13px] text-[#737785] mt-1 font-medium">Estado actual de Dibrand Digital.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={range}
            onChange={(e) => setRange(e.target.value as DateRange)}
            className="bg-white border border-[#E2E8F0] text-[#191C1D] rounded-xl px-4 py-2 text-[12px] font-semibold focus:border-[#0040A1] outline-none shadow-sm cursor-pointer transition-all"
          >
            <option value="today">Hoy</option>
            <option value="last10">Últimos 10 días</option>
            <option value="last30">Últimos 30 días</option>
            <option value="month">Este mes</option>
            <option value="year">Este año</option>
          </select>
        </div>
      </div>

      {/* Stats Grid - EXACT ATS STYLE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-6">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform shadow-sm group-hover:scale-105`}>
                <stat.icon size={22} />
              </div>
              <span className={`text-[11px] font-bold ${stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'} px-2 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-[11px] font-bold text-[#737785] uppercase tracking-wider mb-1">{stat.label}</p>
            <h4 className="text-3xl font-bold text-[#191C1D] tracking-tight">
              {loading ? <Loader2 size={24} className="animate-spin text-[#E2E8F0]" /> : stat.value}
            </h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-8 rounded-xl border border-[#E2E8F0] shadow-sm">
             <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#F1F5F9]">
               <div>
                <h3 className="text-lg font-bold text-[#191C1D]">Tendencia de Conversión</h3>
                <p className="text-[12px] text-[#737785] font-medium">Visualización de interacciones recientes</p>
               </div>
            </div>
            {loading ? (
              <div className="h-[300px] flex items-center justify-center">
                 <Loader2 size={40} className="animate-spin text-[#0040A1] opacity-20" />
              </div>
            ) : (
              <div className="w-full overflow-hidden">
                <ConversionChart data={data?.chartData || []} />
              </div>
            )}
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm">
                <h4 className="text-[13px] font-bold text-[#191C1D] uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Clock size={16} className="text-[#0040A1]" /> Actividad Reciente
                </h4>
                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {loading ? [1,2,3].map(i => <div key={i} className="h-10 bg-[#F8FAFC] animate-pulse rounded-lg"/>) : 
                        data?.activity.length > 0 ? data.activity.map((item: any, i: number) => (
                        <div key={i} className="flex gap-4">
                            <div className="w-8 h-8 rounded-lg bg-[#DAE2FF] flex items-center justify-center text-[10px] font-bold text-[#0040A1] shrink-0 uppercase">
                                {item.admin_email?.[0] || 'A'}
                            </div>
                            <div className="space-y-1">
                                <p className="text-[12px] text-[#191C1D] leading-relaxed font-medium">
                                    <span className="font-bold">{item.admin_email?.split('@')[0]}</span> {item.action} <span className="font-bold text-[#0040A1]">{item.target_name}</span>
                                </p>
                                <p className="text-[10px] text-[#737785] font-medium">
                                    {new Date(item.created_at).toLocaleDateString()} • {new Date(item.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                            </div>
                        </div>
                    )) : (
                        <p className="text-[12px] text-[#737785] italic">Sin actividad reciente.</p>
                    )}
                </div>
            </div>

            <div className="bg-[#191C1D] rounded-xl p-8 text-white relative overflow-hidden shadow-xl">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-[#0040A1]/30 rounded-full blur-[40px] -mr-16 -mt-16"></div>
                 <div className="relative z-10">
                     <h5 className="text-xl font-bold mb-3">Accesos Directos</h5>
                     <p className="text-[13px] text-[#E2E8F0] mb-6 leading-relaxed opacity-80">Gestiona contenidos estratégicos de forma rápida.</p>
                     <div className="grid gap-3">
                         <Link href="/admin/success-stories/new" className="flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/5 font-medium text-[13px]">
                             <span>Nuevo Caso de Éxito</span>
                             <ArrowRight size={16} />
                         </Link>
                         <Link href="/admin/jobs/new" className="flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/5 font-medium text-[13px]">
                             <span>Publicar Búsqueda Laboral</span>
                             <ArrowRight size={16} />
                         </Link>
                     </div>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
}
