import { getRecruiterStats, getRecentCandidates, getRecruiterJobs, getTodayEvents } from '../actions';
import { 
    Users, Calendar, TrendingUp, LayoutGrid, AlertTriangle, Clock, 
    ArrowRight, Activity, Zap, Briefcase, CheckCircle2, MoreHorizontal, 
    ListChecks, Video, ExternalLink 
} from 'lucide-react';
import Link from 'next/link';

export default async function AtsDashboard() {
    const [statsData, recentCandidatesData, jobs, todayEvents] = await Promise.all([
        getRecruiterStats(),
        getRecentCandidates(),
        getRecruiterJobs(),
        getTodayEvents()
    ]);
    
    const counts = statsData?.counts || { Total: 0 };
    const activeJobsCount = statsData?.activeJobsCount || 0;
    const hiredCount = statsData?.hiredCount || 0;

    const getCount = (keys: string[]) => keys.reduce((sum, key) => sum + (counts[key] || 0), 0);

    const stats = [
        { label: 'Vacantes Activas', count: activeJobsCount, icon: Briefcase, color: 'text-[#0040A1]', bg: 'bg-[#DAE2FF]', trend: 'Activas' },
        { label: 'Candidatos Totales', count: counts.Total || 0, icon: Users, color: 'text-[#0040A1]', bg: 'bg-[#D6E3FB]', trend: 'Histórico' },
        { label: 'Entrevistas', count: getCount(['Interview', 'Entrevista RRHH', 'Entrevista Técnica', 'Prueba Técnica', 'Entrevista Cliente', 'Technical']), icon: Calendar, color: 'text-[#B3261E]', bg: 'bg-[#FFDAD6]', trend: 'En Curso' },
        { label: 'Contratados', count: hiredCount, icon: CheckCircle2, color: 'text-[#0040A1]', bg: 'bg-[#DAE2FF]', trend: 'Total' }
    ];

    const funnelStages = [
        { label: 'POSTULADOS', count: getCount(['Applied', 'Nuevo']) },
        { label: 'SCREENING', count: getCount(['Screening', 'Phone Screen', 'Phone Screening']) },
        { label: 'ENTREVISTA', count: getCount(['Interview', 'Entrevista RRHH', 'Entrevista Técnica', 'Prueba Técnica', 'Entrevista Cliente', 'Technical']) },
        { label: 'OFERTA', count: getCount(['Offered', 'Oferta']) },
        { label: 'CONTRATADOS', count: hiredCount }
    ];

    const activeJobsOnly = jobs.filter((j: any) => {
        const rawStatus = (j.status || '').toLowerCase();
        return j.is_active === true || rawStatus === 'active' || rawStatus === 'open';
    });

    const recentJobs = activeJobsOnly
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

    return (
        <div className="space-y-6 animate-in fade-in duration-700 font-outfit">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-6">
                            <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform shadow-sm`}>
                                <stat.icon size={22} />
                            </div>
                            <span className="text-[11px] font-bold text-[#737785] flex items-center gap-1 uppercase tracking-wider">
                                {stat.trend}
                            </span>
                        </div>
                        <p className="text-[13px] font-medium text-[#737785] mb-1">{stat.label}</p>
                        <h4 className="text-3xl font-bold text-[#191C1D] tracking-tight">{stat.count.toLocaleString()}</h4>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Content Modules */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Hiring Funnel Card */}
                    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-8 group">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h3 className="text-xl font-bold text-[#191C1D] mb-1">Embudo de Selección</h3>
                                <p className="text-[13px] text-[#737785]">Progresión de candidatos en tiempo real</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-5 gap-4 pt-8 border-t border-[#F1F5F9]">
                            {funnelStages.map((stage) => (
                                <div key={stage.label} className="text-center group/stage">
                                    <p className="text-[11px] font-bold text-[#737785] uppercase tracking-wider mb-2">{stage.label}</p>
                                    <h5 className="text-2xl font-bold text-[#191C1D]">{stage.count}</h5>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Job Postings Table */}
                    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden group">
                        <div className="p-6 border-b border-[#F1F5F9] flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-[#191C1D] mb-0.5">Vacantes Activas</h3>
                                <p className="text-[13px] text-[#737785]">Gestionando el reclutamiento de tus vacantes</p>
                            </div>
                            <Link href="/ats/jobs" className="px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-semibold text-[#191C1D] hover:bg-[#F8FAFC] transition-colors shadow-sm">
                                Ver Todo
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#F8FAFC] text-[11px] font-bold text-[#737785] uppercase tracking-wider border-b border-[#E2E8F0]">
                                    <tr>
                                        <th className="px-6 py-4">Puesto y Departamento</th>
                                        <th className="px-6 py-4">Postulantes</th>
                                        <th className="px-6 py-4">Estado</th>
                                        <th className="px-6 py-4">Objetivo</th>
                                        <th className="px-6 py-4 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#F1F5F9]">
                                    {recentJobs.length > 0 ? recentJobs.map((job: any) => (
                                        <tr key={job.id} className="hover:bg-[#F8FAFC] transition-colors cursor-pointer group/row">
                                            <td className="px-6 py-5">
                                                <Link href={`/ats/jobs/${job.id}`}>
                                                    <p className="text-[14px] font-semibold text-[#191C1D] group-hover/row:text-[#0040A1] transition-colors flex items-center gap-2">
                                                        {job.title}
                                                        {job.questionnaire && job.questionnaire.length > 0 && (
                                                            <span className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 text-[#0040A1] text-[9px] font-black rounded border border-blue-100 uppercase tracking-tight">
                                                                <ListChecks size={10} /> Vetting
                                                            </span>
                                                        )}
                                                    </p>
                                                    <p className="text-[12px] text-[#737785]">{job.industry}</p>
                                                </Link>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[14px] font-semibold text-[#191C1D]">{job.totalCandidatesCount}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="px-3 py-1 bg-[#D6E3FB] text-[#0040A1] text-[11px] font-bold rounded-full border border-[#E2E8F0]">
                                                    {job.is_active ? 'Abierta' : 'Pausada'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-[13px] text-[#737785]">{job.target_hires} Contrataciones</p>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button className="text-[#C4C7CF] hover:text-[#191C1D] transition-colors"><MoreHorizontal size={20} /></button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-20 text-center text-[#737785] text-[14px]">
                                                No se encontraron vacantes activas.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Modules */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-[13px] font-bold text-[#191C1D] uppercase tracking-wider">Agenda de Hoy</h4>
                            {todayEvents.length > 0 && <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-black rounded-full border border-red-100 uppercase tracking-tighter animate-pulse">{todayEvents.length} {todayEvents.length === 1 ? 'EVENTO' : 'EVENTOS'}</span>}
                        </div>
                        
                        <div className="space-y-4">
                            {todayEvents.length > 0 ? (
                                todayEvents.map((event: any) => {
                                    const startTime = new Date(event.start).toLocaleTimeString('es-AR', { 
                                        hour: '2-digit', 
                                        minute: '2-digit', 
                                        hour12: false, 
                                        timeZone: 'America/Argentina/Buenos_Aires' 
                                    });
                                    
                                    return (
                                        <div key={event.id} className="p-4 rounded-xl border border-slate-100 bg-[#FAFAFA] hover:border-blue-200 hover:bg-white transition-all group/event relative">
                                            <div className="flex items-start gap-3">
                                                <div className="flex flex-col items-center shrink-0">
                                                    <span className="text-[13px] font-black text-[#0040A1]">{startTime}</span>
                                                    <div className="w-[2px] h-4 bg-blue-100 rounded-full mt-1"></div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h5 className="text-[13px] font-bold text-slate-900 truncate group-hover/event:text-[#0040A1] transition-colors">
                                                        {event.summary}
                                                    </h5>
                                                    <div className="flex flex-wrap items-center gap-3 mt-2">
                                                        {event.candidateId && (
                                                            <Link 
                                                                href={`/ats/candidates/${event.candidateId}`}
                                                                className="flex items-center gap-1 px-1.5 py-0.5 bg-[#F5E6F4] text-[#A3369D] text-[9px] font-black rounded border border-[#E9CBE7] hover:bg-[#E9CBE7] transition-colors uppercase tracking-tight"
                                                            >
                                                                <Users size={10} /> Ver Perfil
                                                            </Link>
                                                        )}
                                                        {event.hangoutLink && (
                                                            <a 
                                                                href={event.hangoutLink} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-1.5 text-[10px] font-black text-[#A3369D] hover:text-[#8e2e89] transition-colors uppercase tracking-widest px-2 py-0.5 rounded-md hover:bg-purple-50 transition-all"
                                                            >
                                                                <Video size={14} /> Unirse a Meet
                                                            </a>
                                                        )}
                                                        <a 
                                                            href={event.link} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
                                                        >
                                                            <ExternalLink size={12} /> Detalles
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="py-12 text-center border-2 border-dashed border-[#F1F5F9] rounded-2xl">
                                    <Calendar size={32} className="mx-auto text-[#E2E8F0] mb-4" strokeWidth={1.5} />
                                    <p className="text-[13px] font-medium text-[#737785] px-8">No hay entrevistas programadas en el sistema para hoy.</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-6 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                             <div className="flex items-start gap-4">
                                 <div className="w-10 h-10 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center text-[#0040A1] shadow-sm">
                                      <Activity size={20} />
                                 </div>
                                 <div className="flex-1">
                                     <p className="text-[14px] font-bold text-[#191C1D]">Sincronización Completa</p>
                                     <p className="text-[12px] text-[#737785] mb-2 font-medium">Todos los datos de talento están actualizados.</p>
                                 </div>
                             </div>
                        </div>
                    </div>

                    <div className="bg-[#191C1D] rounded-xl p-8 text-white relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#0040A1]/30 rounded-full blur-[40px] -mr-16 -mt-16"></div>
                        <div className="relative z-10">
                            <h5 className="text-xl font-bold mb-3">Estado del Pool de Talento</h5>
                            <p className="text-[13px] text-[#E2E8F0] mb-6 leading-relaxed opacity-80">Actualmente tienes {counts.Total || 0} candidatos en tu base de datos.</p>
                            <Link href="/ats/candidates" className="w-full flex items-center justify-center py-3 bg-[#0040A1] hover:bg-[#003380] text-white rounded-xl text-[13px] font-semibold transition-all shadow-lg">
                                Gestionar Candidatos <ArrowRight size={16} className="ml-2" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
