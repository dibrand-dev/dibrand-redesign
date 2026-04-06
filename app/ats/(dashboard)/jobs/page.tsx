'use client';

import React from 'react';
import { 
    MapPin, 
    Clock, 
    MoreVertical, 
    Briefcase, 
    Search, 
    ChevronDown, 
    TrendingUp, 
    Play,
    Plus,
    ListChecks,
    Pause,
    Trash2,
    AlertCircle,
    X
} from 'lucide-react';
import Link from 'next/link';
import { getRecruiterJobs, toggleJobStatus, deleteJob, getAtsUserContext } from '../../actions';
import toast from 'react-hot-toast';
import { createClient } from '@/lib/supabase-client';
import { AnimatePresence, motion } from 'framer-motion';

interface Job {
    id: string;
    title: string;
    title_es?: string;
    location?: string;
    location_es?: string;
    salary_range?: string;
    seniority?: string;
    status: string; // 'Open', 'Paused', 'Closed', 'Draft'
    department?: string;
    type?: string; // 'Full-time', 'Part-time', etc.
    countsByStatus: {
        new: number;
        interviewing: number;
        offer: number;
        total: number;
    };
    posted_at?: string;
    days_open?: number;
    totalCandidatesCount: number; // total candidates assigned to this job
    avatars: { url?: string, initials: string }[];
    questionnaire?: any[];
}

export default function AtsJobsPage() {
    const [jobs, setJobs] = React.useState<Job[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [activeTab, setActiveTab] = React.useState('Todas');
    const [userRole, setUserRole] = React.useState<string>('');
    const [userEmail, setUserEmail] = React.useState<string>('');

    const [departmentFilter, setDepartmentFilter] = React.useState('all');
    const [locationFilter, setLocationFilter] = React.useState('all');
    const [statusFilter, setStatusFilter] = React.useState('Activas');

    React.useEffect(() => {
        const loadDashboardData = async () => {
            // Securely load context via Server Action to bypass any client auth state issues
            const userContext = await getAtsUserContext();
            
            setUserRole(userContext.role);
            setUserEmail(userContext.email);

            // Fetch jobs after we know who the user is to prevent visual flashing
            const data = await getRecruiterJobs();
            
            const transformed : Job[] = data.map((j: any) => {
                const rawStatus = (j.status || '').toLowerCase();
                let normalizedStatus = 'Suspended'; // Fallback
                
                if (rawStatus === 'active' || rawStatus === 'open' || (j.is_active && j.status !== 'Suspended')) {
                    normalizedStatus = 'Active';
                } else if (rawStatus === 'suspended' || rawStatus === 'paused' || (!j.is_active && !j.status)) {
                    normalizedStatus = 'Suspended';
                }

                return {
                    ...j,
                    status: normalizedStatus || 'Suspended',
                    department: j.industry || 'ENGINEERING', // Map from DB
                    type: j.employment_type?.replace('_', ' ') || 'Full-time',
                    posted_at: j.created_at,
                    days_open: Math.floor((Date.now() - new Date(j.created_at).getTime()) / (1000 * 60 * 60 * 24)) || 0,
                };
            });
            const sorted = transformed.sort((a, b) => new Date(b.posted_at!).getTime() - new Date(a.posted_at!).getTime());
            setJobs(sorted);
            setLoading(false);
        };
        
        loadDashboardData();
    }, []);

    const tabs = ['Todas', 'Borradores', 'Archivadas'];
    
    // Derived stats
    const activeSearchesCount = jobs.filter(j => j.status === 'Active').length;

    const filteredJobs = jobs.filter(job => {
        // Tab Filtering
        if (activeTab === 'Borradores' && job.status !== 'Suspended') return false;
        if (activeTab === 'Archivadas' && job.status !== 'Closed' && job.status !== 'Archived') return false; 
        
        // Dropdown Filtering
        if (departmentFilter !== 'all') {
            if ((job.department || '').toLowerCase() !== departmentFilter.toLowerCase()) return false;
        }

        if (locationFilter !== 'all') {
            const loc = (job.location_es || job.location || '').toLowerCase();
            if (locationFilter === 'remoto' && !loc.includes('remoto')) return false;
            if (locationFilter === 'oficina' && !loc.includes('oficina') && !loc.includes('presencial')) return false;
            if (locationFilter === 'híbrido' && !loc.includes('híbrido') && !loc.includes('hybrid')) return false;
        }

        if (statusFilter !== 'all') {
            if (statusFilter === 'Activas' && job.status !== 'Active') return false;
            if (statusFilter === 'Suspendidas' && job.status !== 'Suspended') return false;
        }

        return true;
    });

    return (
        <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header & Tabs Row */}
            <div className="flex flex-col gap-6 mb-8">
                <div className="flex items-end justify-between border-b border-[#E2E8F0]">
                    <div className="flex items-center gap-12">
                        <h1 className="text-[28px] font-bold text-[#191C1D] tracking-tight pb-4">Vacantes Abiertas</h1>
                        <div className="flex items-center gap-8 h-full">
                            {tabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`text-[14px] font-bold tracking-tight pb-4 transition-all relative ${
                                        activeTab === tab ? 'text-[#0040A1]' : 'text-[#737785] hover:text-[#191C1D]'
                                    }`}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <div className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#0040A1] rounded-full"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {/* Departamento Filter */}
                        <div className="flex flex-col gap-1.5 relative">
                            <span className="text-[10px] font-bold text-[#737785] tracking-widest pl-1">DEPARTAMENTO</span>
                            <select 
                                value={departmentFilter}
                                onChange={(e) => setDepartmentFilter(e.target.value)}
                                className="appearance-none flex items-center gap-6 px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[13px] font-semibold text-[#191C1D] hover:bg-[#F8FAFC] focus:outline-none focus:border-[#0040A1] transition-all min-w-[200px]"
                            >
                                <option value="all">Todos los Departamentos</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Product & Design">Product & Design</option>
                                <option value="Sales & Marketing">Sales & Marketing</option>
                                <option value="Administration">Administration</option>
                                <option value="People & Culture">People & Culture</option>
                            </select>
                            <ChevronDown size={16} className="text-[#737785] absolute right-4 bottom-3 pointer-events-none" />
                        </div>

                        {/* Ubicación Filter */}
                        <div className="flex flex-col gap-1.5 relative">
                            <span className="text-[10px] font-bold text-[#737785] tracking-widest pl-1">UBICACIÓN</span>
                            <select 
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                                className="appearance-none flex items-center gap-6 px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[13px] font-semibold text-[#191C1D] hover:bg-[#F8FAFC] focus:outline-none focus:border-[#0040A1] transition-all min-w-[200px]"
                            >
                                <option value="all">Cualquier Ubicación</option>
                                <option value="remoto">Remoto</option>
                                <option value="oficina">Oficina (Presencial)</option>
                                <option value="híbrido">Híbrido</option>
                            </select>
                            <ChevronDown size={16} className="text-[#737785] absolute right-4 bottom-3 pointer-events-none" />
                        </div>

                        {/* Estado Filter */}
                        <div className="flex flex-col gap-1.5 relative">
                            <span className="text-[10px] font-bold text-[#737785] tracking-widest pl-1">ESTADO</span>
                            <select 
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="appearance-none flex items-center gap-6 px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[13px] font-semibold text-[#191C1D] hover:bg-[#F8FAFC] focus:outline-none focus:border-[#0040A1] transition-all min-w-[200px]"
                            >
                                <option value="all">Cualquier Estado</option>
                                <option value="Activas">Activas</option>
                                <option value="Suspendidas">Suspendidas</option>
                            </select>
                            <ChevronDown size={16} className="text-[#737785] absolute right-4 bottom-3 pointer-events-none" />
                        </div>
                    </div>

                    {/* Summary Box */}
                    <div className="bg-[#F1F5F9] rounded-xl px-5 py-3 flex items-center gap-3 border border-transparent hover:border-[#E2E8F0] transition-all cursor-default">
                        <div className="w-8 h-8 bg-[#0040A1] rounded-lg flex items-center justify-center">
                            <TrendingUp size={16} className="text-white" />
                        </div>
                        <div className="flex items-center gap-2">
                             <span className="text-[13px] font-semibold text-[#737785]">Mostrando</span>
                             <span className="text-[14px] font-bold text-[#191C1D]">{activeSearchesCount} Búsquedas Activas</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
                {loading ? (
                    Array(4).fill(0).map((_, i) => <JobSkeleton key={i} />)
                ) : (
                    <>
                        {filteredJobs.map((job) => (
                            <JobCard 
                                key={job.id} 
                                job={job} 
                                userRole={userRole} 
                                userEmail={userEmail} 
                                // We can safely call our effect logic again by just hard refreshing or passing a stripped down update trigger
                                onUpdate={() => window.location.reload()} 
                            />
                        ))}
                        {/* If no jobs, show placeholder or create new */}
                        {filteredJobs.length === 0 && (
                             <div className="col-span-full py-32 flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-[#E2E8F0] text-[#737785]">
                                 <Briefcase size={48} className="mb-4 opacity-20" />
                                 <p className="font-semibold">No se encontraron vacantes coincidentes</p>
                             </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}



function JobCard({ job, userRole, userEmail, onUpdate }: { job: Job, userRole: string, userEmail: string, onUpdate: () => void }) {
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [isPausando, setIsPausando] = React.useState(false);
    const [localIsSuspended, setLocalIsSuspended] = React.useState(job.status === 'Suspended');
    
    // Comprehensive SuperAdmin check including email bypass for Norberto and Eugenia
    const isSuperAdmin = 
        userRole.toLowerCase() === 'superadmin' || 
        userRole.toLowerCase() === 'admin' ||
        ['norberto@dibrand.co', 'eugenia@dibrand.co', 'nriccitelli@dibrand.co'].includes(userEmail.toLowerCase());

    const handleToggleStatus = async () => {
        setIsPausando(true);
        // Instant visual update (optimistic UI)
        const currentActive = !localIsSuspended;
        setLocalIsSuspended(!localIsSuspended);
        const internalDbStatus = currentActive ? 'Active' : 'Suspended';
        
        try {
            await toggleJobStatus(job.id, internalDbStatus);
            toast.success('Estado de la vacante actualizado');
            // We no longer call onUpdate() to avoid the jarring page reload
        } catch (error) {
            // Revert state if failed
            setLocalIsSuspended(currentActive ? false : true);
            toast.error('Error al cambiar el estado de la vacante');
        } finally {
            setIsPausando(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteJob(job.id);
            toast.success('Vacante eliminada exitosamente');
            onUpdate();
        } catch (error) {
            toast.error('Error al eliminar la vacante');
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };
    
    return (
        <div className={`rounded-3xl p-8 transition-all duration-300 relative group overflow-hidden h-fit font-outfit ${
            localIsSuspended 
            ? 'bg-[#F8FAFC] border-2 border-dashed border-slate-200 opacity-60' 
            : 'bg-white border-2 border-[#0040A1]/10 hover:border-[#0040A1]/30 hover:shadow-2xl hover:shadow-[#0040A1]/5 hover:-translate-y-1'
        }`}>
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                    {localIsSuspended ? (
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black tracking-widest rounded-lg uppercase border border-amber-200">
                            Suspendida
                        </span>
                    ) : (
                        <span className="px-3 py-1 bg-[#E8F0FF] text-[#0040A1] text-[10px] font-black tracking-widest rounded-lg uppercase">
                            {job.department || 'OPERACIONES'}
                        </span>
                    )}
                    {job.questionnaire && job.questionnaire.length > 0 && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-green-50 text-[#1A3A00] text-[9px] font-black rounded-lg border border-green-100 uppercase tracking-tight">
                            <ListChecks size={12} /> Evaluación Activa
                        </span>
                    )}
                </div>
                
                {isSuperAdmin && (
                    <button 
                        onClick={() => setShowDeleteModal(true)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    >
                        <Trash2 size={18} />
                    </button>
                )}
            </div>

            <Link href={`/ats/jobs/${job.id}`}>
                <h3 className="text-[22px] font-bold text-[#191C1D] mb-4 group-hover:text-[#0040A1] transition-colors leading-tight">
                    {(() => {
                        const fullTitle = job.title_es || job.title || '';
                        const maxChars = 40;
                        return fullTitle.length > maxChars ? `${fullTitle.slice(0, maxChars - 3)}...` : fullTitle;
                    })()}
                </h3>
            </Link>

            <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-1.5 text-[#737785]">
                    <MapPin size={16} />
                    <span className="text-[13px] font-medium">{job.location_es || job.location || 'Remoto'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#737785]">
                    <Clock size={16} />
                    <span className="text-[13px] font-medium">{job.type || 'Tiempo completo'}</span>
                </div>
            </div>

            {/* Pipeline Section - RESTORED */}
            <div className={`rounded-2xl p-6 relative ${localIsSuspended ? 'bg-slate-100/50' : 'bg-[#F8FAFC]'}`}>
                 <div className="flex items-center justify-between mb-6">
                    {/* Avatars */}
                    {job.avatars && job.avatars.length > 0 ? (
                        <div className="flex -space-x-3 overflow-hidden">
                            {job.avatars.map((av: any, idx: number) => (
                                <div key={idx} className="relative inline-block h-10 w-10">
                                    {av.url ? (
                                        <img
                                            className="h-full w-full rounded-full ring-4 ring-[#F8FAFC] object-cover"
                                            src={av.url}
                                            alt="Candidate"
                                        />
                                    ) : (
                                        <div className="h-full w-full rounded-full bg-[#0040A1] ring-4 ring-[#F8FAFC] flex items-center justify-center text-white text-[11px] font-bold">
                                            {av.initials}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {job.totalCandidatesCount > job.avatars.length && (
                                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#E2E8F0] text-[11px] font-bold text-[#737785] ring-4 ring-[#F8FAFC]">
                                    +{job.totalCandidatesCount - job.avatars.length}
                                </div>
                            )}
                        </div>
                    ) : null}
                    <span className="text-[9px] font-black tracking-widest text-[#737785] uppercase">Pipeline de Candidatos</span>
                 </div>

                 <div className="grid grid-cols-3 gap-4 border-t border-[#E2E8F0] pt-6">
                    <PipelineStat label="NUEVOS" count={job.countsByStatus.new} />
                    <PipelineStat label="ENTREVISTAS" count={job.countsByStatus.interviewing} />
                    <PipelineStat label="OFERTA" count={job.countsByStatus.offer} />
                 </div>
            </div>

            {/* Final Row with Toggle Switch (SuperAdmin Only) */}
            <div className="mt-8 pt-6 border-t border-[#F1F5F9] flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-[11px] font-medium text-[#737785]">Publicada hace {job.days_open || 0} días</span>
                </div>

                {isSuperAdmin && (
                    <div className="flex items-center gap-3 relative group/tooltip">
                        <span className={`text-[12px] font-bold transition-colors ${!localIsSuspended ? 'text-[#0040A1]' : 'text-slate-400'}`}>
                            {!localIsSuspended ? 'Suspender Vacante' : 'Activar Vacante'}
                        </span>
                        <button 
                            onClick={handleToggleStatus}
                            disabled={isPausando}
                            className={`w-12 h-6 rounded-full relative transition-colors duration-300 ease-in-out flex items-center px-1 active:scale-95 ${
                                !localIsSuspended ? 'bg-[#0040A1]' : 'bg-slate-300'
                            }`}
                        >
                            <motion.div 
                                initial={false}
                                animate={{ x: !localIsSuspended ? 24 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="w-4 h-4 bg-white rounded-full shadow-sm drop-shadow-sm"
                            />
                        </button>

                        {/* Tooltip Informativo */}
                        <div className="absolute right-0 bottom-full mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-300 z-10 pointer-events-none text-center font-medium shadow-xl">
                            Al suspender, la vacante se oculta de la web pública
                            <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Background elements to match the "Suspended" feel */}
            {localIsSuspended && (
                <div className="absolute inset-0 bg-white/10 pointer-events-none"></div>
            )}

            {/* DELETE MODAL */}
            <AnimatePresence>
                {showDeleteModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-[32px] w-full max-w-[440px] shadow-2xl overflow-hidden font-outfit"
                        >
                            <div className="p-8">
                                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-6">
                                    <AlertCircle size={32} />
                                </div>
                                <h2 className="text-[24px] font-black text-slate-900 leading-tight mb-4">¿Estás seguro de que deseas eliminar esta vacante?</h2>
                                <p className="text-[15px] font-medium text-slate-500 leading-relaxed">Esta acción es irreversible y se perderán todos los datos asociados.</p>
                            </div>

                            <div className="px-8 pb-8 flex gap-4">
                                <button 
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl text-[14px] font-black transition-all"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="flex-1 px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-[14px] font-black transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? "Eliminando..." : "Eliminar"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function PipelineStat({ label, count }: { label: string, count: number }) {
    return (
        <div className="flex flex-col items-center gap-1">
            <span className="text-[20px] font-black text-[#191C1D]">{count}</span>
            <span className="text-[9px] font-black text-[#737785] tracking-widest uppercase">{label}</span>
        </div>
    );
}

function JobSkeleton() {
    return (
        <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 animate-pulse">
            <div className="flex justify-between mb-6">
                <div className="h-6 w-20 bg-slate-100 rounded-lg"></div>
                <div className="h-6 w-6 bg-slate-100 rounded-full"></div>
            </div>
            <div className="h-8 w-64 bg-slate-100 rounded-lg mb-4"></div>
            <div className="h-5 w-40 bg-slate-100 rounded-lg mb-8"></div>
            <div className="h-32 bg-slate-50 rounded-2xl mb-8"></div>
            <div className="flex justify-between items-center">
                <div className="h-5 w-32 bg-slate-50 rounded-lg"></div>
                <div className="flex gap-3">
                    <div className="h-10 w-20 bg-slate-50 rounded-xl"></div>
                    <div className="h-10 w-32 bg-slate-100 rounded-xl"></div>
                </div>
            </div>
        </div>
    );
}
