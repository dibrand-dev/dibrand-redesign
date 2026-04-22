'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { capitalizeName } from '@/lib/utils';
import { 
    ArrowLeft, 
    Share2, 
    Edit2, 
    MapPin, 
    Calendar as CalendarIcon, 
    CornerUpRight,
    Bold, Italic, List, Link as LinkIcon, Heading1, Heading2,
    CheckCircle2, Globe, Plus, Clock, MessageSquare,
    Link2, Eye, Save, Settings2, Sparkles, RefreshCcw, Trash2, Users, Award, Languages
} from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import { updateJobQuestionnaire, updateJobDescription } from '@/app/ats/actions';
import StagePill from '@/components/ats/StagePill';
import PipelineStepper from '@/components/ats/PipelineStepper';
import { getStageConfig, STAGE_CONFIG, MACRO_STAGES } from '@/lib/ats-constants';

interface Question {
    id: string;
    label: string;
    type: string;
    subquestions?: string[];
    helper?: string;
    note?: string;
}

interface QuestionnaireSection {
    id: string;
    title: string;
    questions: Question[];
}

interface JobData {
    id: string;
    title: string;
    title_es?: string;
    title_en?: string;
    location: string;
    is_active: boolean;
    description?: string;
    description_es?: string;
    description_en?: string;
    requirements?: string;
    requirements_es?: string;
    requirements_en?: string;
    salary_range?: string;
    employment_type?: string;
    seniority?: string;
    stats?: {
        totalApplicants: number;
        daysOpen: number;
        [key: string]: number; // Allow dynamic stage keys
    };
    recentActivity?: any[];
    team?: any[];
    questionnaire?: any[];
    allCandidates?: any[];
    required_language?: string;
    years_of_experience?: string;
    positions_count?: number;
    location_es?: string;
    location_en?: string;
    industry?: string;
}

export default function JobViewClient({ job, userRole }: { job: JobData | null; userRole?: string }) {
    const [activeTab, setActiveTab] = useState<string>('Candidatos');
    const [showAllCandidates, setShowAllCandidates] = useState(false);
    const [activeStageFilter, setActiveStageFilter] = useState<string | null>(null);
    
    // Parse role from prop safely
    const roleStr = (userRole || '').toString().toLowerCase();
    const [isSuperAdmin, setIsSuperAdmin] = useState(roleStr === 'superadmin' || roleStr === 'admin');
    
    const [copied, setCopied] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // questionnaire edit
    const [isEditingDesc, setIsEditingDesc] = useState(false); // job description edit
    const [isSaving, setIsSaving] = useState(false);
    
    const [descContent, setDescContent] = useState(job?.description_es || job?.description || '');
    const [reqContent, setReqContent] = useState(job?.requirements_es || job?.requirements || '');
    // Provide a default that matches DB convention if it was mapped via job.industry or just 'Engineering'
    const [industryContent, setIndustryContent] = useState(job?.industry || 'Engineering');

    const DEFAULT_QUESTIONNAIRE: QuestionnaireSection[] = [
        {
            id: 'contact',
            title: 'INFORMACIÓN DE CONTACTO',
            questions: [
                { id: 'q_name', label: 'Nombre Completo', type: 'text' },
                { id: 'q_email', label: 'Correo electrónico personal', type: 'text' },
                { id: 'q_phone', label: 'Teléfono', type: 'text' },
                { id: 'q_linkedin', label: 'Link a perfil de LinkedIn', type: 'text' },
                { id: 'q_country', label: 'País de residencia', type: 'text' }
            ]
        },
        {
            id: 'experience',
            title: 'SOBRE TU EXPERIENCIA',
            questions: [
                { id: 'q1', label: '1. ¿Cuántos años de experiencia tienes con Desarrollo .NET (C#, ASP.NET, .NET Core)?', type: 'text' },
                { 
                    id: 'q2', 
                    label: '2. ¿Cuántos años de experiencia tienes con las siguientes tecnologías?', 
                    type: 'sublist',
                    subquestions: [
                        'SQL Server (Consultas avanzadas, optimización)',
                        'Arquitectura de Microservicios',
                        'Frameworks de Frontend (React, Angular o similar)',
                        'Plataformas Cloud (Azure/AWS)'
                    ]
                },
                { id: 'q3', label: '3. ¿Has trabajado como contractor de forma remota para clientes internacionales?', type: 'yesno' },
                { id: 'q4', label: '4. ¿Te encuentras trabajando actualmente? Si es así, por favor describe tu rol actual.', type: 'textarea' },
                { id: 'q5', label: '5. ¿Tienes experiencia diseñando o manteniendo Microservicios?', type: 'textarea', helper: 'Por favor, detalla tu rol y las herramientas utilizadas (ej. Docker, Kubernetes, Service Bus).' },
                { id: 'q6', label: '6. ¿Tienes un nivel avanzado de inglés hablado (B2 o superior)?', type: 'yesno', note: 'NOTA: SE REQUERIRÁ UNA ENTREVISTA TÉCNICA EN INGLÉS.' },
                { id: 'q7', label: '7. El cliente requiere una verificación de antecedentes y un test de drogas. ¿Estás dispuesto a realizarlos?', type: 'yesno' },
                { id: 'q8', label: '8. ¿Tienes vacaciones planeadas en los próximos 6 meses?', type: 'text' }
            ]
        }
    ];

    const [questionnaire, setQuestionnaire] = useState<QuestionnaireSection[]>((job as any)?.questionnaire || DEFAULT_QUESTIONNAIRE);

    // Sync user role from prop if it changes
    React.useEffect(() => {
        const str = (userRole || '').toString().toLowerCase();
        setIsSuperAdmin(str === 'superadmin' || str === 'admin');
    }, [userRole]);

    const handleCopyQuestionnaire = () => {
        const content = `CUESTIONARIO DE LA VACANTE: ${title}
        
${questionnaire.map(section => {
    const sectionText = `${section.title}\n${section.questions.map(q => {
        let qText = `- ${q.label}`;
        if (q.subquestions) {
            qText += `\n${q.subquestions.map(sq => `  • ${sq}`).join('\n')}`;
        }
        if (q.type === 'yesno') qText += ' (Sí/No)';
        return qText;
    }).join('\n')}`;
    return sectionText;
}).join('\n\n')}
        `;
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSaveQuestionnaire = async () => {
        if (!job?.id) return;
        setIsSaving(true);
        try {
            await updateJobQuestionnaire(job.id, questionnaire);
            setIsEditing(false);
        } catch (error: any) {
            console.error('Failed to save questionnaire', error);
            if (error.message?.includes('column "questionnaire" of relation "job_openings" does not exist')) {
                alert('MIGRACIÓN REQUERIDA: Debes ejecutar el script SQL de la columna "questionnaire" en tu panel de Supabase.');
            } else {
                alert('No se pudo guardar: ' + error.message);
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveDescription = async () => {
        if (!job?.id) return;
        setIsSaving(true);
        try {
            await updateJobDescription(job.id, descContent, reqContent, industryContent);
            setIsEditingDesc(false);
        } catch (error: any) {
            console.error('Failed to save description', error);
            alert('No se pudo guardar: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const updateQuestion = (sectionIdx: number, qIdx: number, value: string) => {
        const newQuestionnaire = JSON.parse(JSON.stringify(questionnaire));
        newQuestionnaire[sectionIdx].questions[qIdx].label = value;
        setQuestionnaire(newQuestionnaire);
    };

    const updateSectionTitle = (sectionIdx: number, value: string) => {
        const newQuestionnaire = JSON.parse(JSON.stringify(questionnaire));
        newQuestionnaire[sectionIdx].title = value;
        setQuestionnaire(newQuestionnaire);
    };

    const addQuestion = (sectionIdx: number) => {
        const newQuestionnaire = JSON.parse(JSON.stringify(questionnaire));
        newQuestionnaire[sectionIdx].questions.push({
            id: `q_new_${Date.now()}`,
            label: 'New Question',
            type: 'text'
        });
        setQuestionnaire(newQuestionnaire);
    };

    const removeQuestion = (sectionIdx: number, qIdx: number) => {
        const newQuestionnaire = JSON.parse(JSON.stringify(questionnaire));
        newQuestionnaire[sectionIdx].questions.splice(qIdx, 1);
        setQuestionnaire(newQuestionnaire);
    };
    
    // Use real data from database
    const title = job?.title_es || job?.title || 'Sin Título';
    const location = job?.location_es || job?.location || 'No especificado';
    const isActive = job?.is_active ?? true;
    const employmentType = job?.employment_type || 'No especificado';
    const seniority = job?.seniority || 'No especificado';

    return (
        <div className="flex-1 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Top Header */}
            <div className="flex items-center justify-between mb-8">
                <Link href="/ats/jobs" className="flex items-center gap-2 text-[13px] font-semibold text-[#737785] hover:text-[#191C1D] transition-colors">
                    <ArrowLeft size={16} />
                    Volver a Vacantes
                </Link>
            </div>

            {/* Job Title Region */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
                <div>
                    <div className="flex items-center gap-4 mb-3">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
                            isActive ? 'bg-[#D6E3FB] text-[#0040A1]' : 'bg-[#E2E8F0] text-[#737785]'
                        }`}>
                            {isActive ? 'ACTIVA' : 'PAUSADA'}
                        </span>
                        <div className="flex items-center gap-1.5 text-[#737785] text-[13px] font-semibold">
                            <MapPin size={14} />
                            {location}
                        </div>
                    </div>
                    <h1 className="text-[36px] font-bold text-[#191C1D] tracking-tight leading-none mb-2">
                        {title}
                    </h1>
                    {activeTab === 'Job Description' && (
                        <p className="text-[13px] font-semibold text-[#737785] mt-2">ID: #{job?.id?.slice(0, 6) || '8829'}-UX</p>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {activeTab === 'Job Description' ? (
                        <>
                            {isSuperAdmin && !isEditingDesc && (
                                <button 
                                    onClick={() => setIsEditingDesc(true)}
                                    className="px-5 py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0040A1] text-[13px] font-bold rounded-xl transition-all flex items-center gap-2"
                                >
                                    <Edit2 size={16} /> Editar Vacante
                                </button>
                            )}
                            {isEditingDesc && (
                                <>
                                    <button 
                                        onClick={() => {
                                            setIsEditingDesc(false);
                                            setDescContent(job?.description || '');
                                            setReqContent(job?.requirements || '');
                                            setIndustryContent((job as any)?.industry || 'Engineering');
                                        }}
                                        className="px-5 py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#191C1D] text-[13px] font-bold rounded-xl transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        onClick={handleSaveDescription}
                                        disabled={isSaving}
                                        className="px-5 py-2.5 bg-[#0040A1] hover:bg-[#003380] text-white text-[13px] font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
                                    >
                                        {isSaving ? <RefreshCcw size={16} className="animate-spin" /> : <Save size={16} />} 
                                        {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                                    </button>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            {isSuperAdmin && activeTab !== 'Questionnaire' && activeTab !== 'Candidates' && (
                                <button className="px-5 py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0040A1] text-[13px] font-bold rounded-xl transition-all flex items-center gap-2">
                                    <Edit2 size={16} /> Editar
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Tabs Row - Now centered below title */}
            <div className="flex items-center gap-8 border-b border-[#E2E8F0] mb-8">
                {['Candidatos', 'Descripción', 'Equipo', 'Cuestionario'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => {
                            setActiveTab(tab);
                            if (tab !== 'Candidatos') setActiveStageFilter(null);
                        }}
                        className={`text-[14px] font-bold pb-4 transition-all relative ${
                            activeTab === tab ? 'text-[#0040A1]' : 'text-[#737785] hover:text-[#191C1D]'
                        }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#0040A1] rounded-full z-10"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Content Switcher */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* CANDIDATES TAB */}
                {activeTab === 'Candidatos' && (
                    <div className="col-span-full">
                        <PipelineStepper 
                            counts={job?.stats || {}} 
                            activeFilter={activeStageFilter}
                            onFilterChange={setActiveStageFilter}
                        />
                        
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
                            <div className="lg:col-span-8 space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[11px] font-bold text-[#737785] tracking-widest uppercase">
                                    {showAllCandidates ? 'TODOS LOS CANDIDATOS' : 'ACTIVIDAD RECIENTE'}
                                </h3>
                                {!showAllCandidates ? (
                                    <button 
                                        onClick={() => setShowAllCandidates(true)}
                                        className="text-[12px] font-bold text-[#0040A1] flex items-center gap-1 hover:underline"
                                    >
                                        Ver Todos <ArrowLeft size={12} className="rotate-180" />
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => setShowAllCandidates(false)}
                                        className="text-[12px] font-bold text-[#0040A1] flex items-center gap-1 hover:underline"
                                    >
                                        <ArrowLeft size={12} /> Volver al Resumen
                                    </button>
                                )}
                            </div>
                            
                             {(() => {
                                let listToShow = showAllCandidates ? (job?.allCandidates || []) : (job?.recentActivity || []);
                                
                                // Apply Stage Filter if active
                                if (activeStageFilter) {
                                    listToShow = (job?.allCandidates || []).filter((c: any) => {
                                        // If filtering by a macro stage, check if candidate's status belongs to it
                                        const macro = MACRO_STAGES.find(m => m.id === activeStageFilter);
                                        if (macro) {
                                            return (macro.stages as readonly string[]).includes(c.status);
                                        }

                                        const config = getStageConfig(c.status);
                                        return config.value === activeStageFilter;
                                    });
                                }

                                if (listToShow.length > 0) {
                                    return listToShow.map((candidate: any, idx: number) => {
                                        const timeAgo = Math.floor((Date.now() - new Date(candidate.created_at).getTime()) / (1000 * 60 * 60)) + 'h ago';
                                        const rawName = `${candidate.first_name} ${candidate.last_name}`;
                                        const capitalizedFullName = capitalizeName(rawName);
                                        const names = capitalizedFullName.split(' ');
                                        const shortName = names.length >= 2 ? `${names[0]} ${names[1].charAt(0)}.` : capitalizedFullName;
                                        const recruiterData = Array.isArray(candidate.recruiter) ? candidate.recruiter[0] : candidate.recruiter;
                                        const recruiterName = recruiterData?.full_name ? capitalizeName(recruiterData.full_name) : 'Sin asignar';
                                        return (
                                            <div key={candidate.id} className="group/card relative bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#0040A1]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                                <Link href={`/ats/candidates/${candidate.id}`} className="absolute inset-0 z-10" />
                                                <div className="flex items-center gap-4 relative z-20 pointer-events-none">
                                                    {candidate.avatar_url ? (
                                                        <img src={candidate.avatar_url} alt="Avatar" className="w-12 h-12 rounded-xl object-cover" />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-xl bg-[#0040A1] flex items-center justify-center text-white font-bold text-[18px]">
                                                            {candidate.first_name.charAt(0)}{candidate.last_name?.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <h4 className="text-[15px] font-bold text-[#191C1D] mb-1 truncate">{shortName}</h4>
                                                        <p className="text-[13px] text-[#737785] truncate">Postulado hace {timeAgo} • {recruiterName}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 relative z-30">
                                                    <StagePill status={candidate.status || 'Nuevo'} />
                                                    <div className="flex items-center gap-2">
                                                        <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#F8FAFC] text-[#0040A1] hover:bg-[#E2E8F0] transition-colors pointer-events-auto">
                                                            <CalendarIcon size={16} />
                                                        </button>
                                                        <Link href={`/ats/candidates/${candidate.id}`} className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#F8FAFC] text-[#0040A1] hover:bg-[#E2E8F0] transition-colors pointer-events-auto">
                                                            <CornerUpRight size={16} />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    });
                                } else {
                                    return (
                                        <div className="bg-[#F8FAFC] rounded-2xl p-12 text-center border-2 border-dashed border-[#E2E8F0]">
                                            <p className="text-[14px] font-bold text-[#191C1D] mb-2">{showAllCandidates ? 'No se encontraron candidatos comunes' : 'Sin candidatos activos'}</p>
                                            <p className="text-[12px] text-[#737785]">Cuando la gente comience a postularse, aparecerán aquí.</p>
                                        </div>
                                    );
                                }
                             })()}
                        </div>

                        <div className="lg:col-span-4 space-y-6">
                            {/* Hiring Team summary snippet */}
                            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
                                <h3 className="text-[11px] font-bold text-[#737785] tracking-widest uppercase mb-4">EQUIPO DE SELECCIÓN</h3>
                                <div className="space-y-4">
                                    {job?.team && job.team.length > 0 ? (
                                        job.team.slice(0, 3).map((member: any) => (
                                            <div key={member.id} className="flex items-center gap-3">
                                                {member.avatar_url ? (
                                                    <img src={member.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-[#0040A1] flex items-center justify-center text-white font-bold text-[12px]">
                                                        {member.full_name?.charAt(0) || 'U'}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-[13px] font-bold text-[#191C1D]">{member.full_name ? capitalizeName(member.full_name) : 'Unknown'}</p>
                                                    <p className="text-[11px] text-[#737785]">{member.role || 'Reclutador'}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-[12px] text-[#737785] italic">Sin reclutadores activos</p>
                                    )}
                                </div>
                            </div>

                            {/* Top Sources */}
                            <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-[#E2E8F0]">
                                <h3 className="text-[11px] font-bold text-[#737785] tracking-widest uppercase mb-4">PRINCIPALES FUENTES</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-[11px] font-bold mb-1">
                                            <span className="text-[#191C1D]">LinkedIn</span>
                                            <span className="text-[#191C1D]">62%</span>
                                        </div>
                                        <div className="h-2 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
                                            <div className="h-full bg-[#0040A1]" style={{ width: '62%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-[11px] font-bold mb-1">
                                            <span className="text-[#191C1D]">Referidos</span>
                                            <span className="text-[#191C1D]">24%</span>
                                        </div>
                                        <div className="h-2 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
                                            <div className="h-full bg-[#0060F0]" style={{ width: '24%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-[11px] font-bold mb-1">
                                            <span className="text-[#191C1D]">Indeed</span>
                                            <span className="text-[#191C1D]">14%</span>
                                        </div>
                                        <div className="h-2 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
                                            <div className="h-full bg-[#5A6376]" style={{ width: '14%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#F1F5F9] rounded-2xl p-6 border border-[#E2E8F0]">
                                <h3 className="text-[11px] font-bold text-[#0040A1] tracking-widest uppercase mb-2">NOTA RÁPIDA</h3>
                                <p className="text-[13px] text-[#737785] italic font-semibold leading-relaxed">
                                    "The candidate pool is exceptionally strong this week. Focus on portfolios with complex design system work."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}


                {/* JOB DESCRIPTION TAB */}
                {activeTab === 'Descripción' && (
                    <>
                        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden min-h-[600px]">
                            {/* Editor Toolbar */}
                          {isSuperAdmin && isEditingDesc && (
                            <div className="flex items-center gap-6 px-6 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#191C1D]">
                                <button className="hover:text-[#0040A1] transition-colors"><Bold size={16} /></button>
                                <button className="hover:text-[#0040A1] transition-colors"><Italic size={16} /></button>
                                <button className="hover:text-[#0040A1] transition-colors"><List size={16} /></button>
                                <button className="hover:text-[#0040A1] transition-colors"><LinkIcon size={16} /></button>
                                <div className="w-[1px] h-4 bg-[#E2E8F0]"></div>
                                <button className="text-[13px] font-bold hover:text-[#0040A1] transition-colors">H1</button>
                                <button className="text-[13px] font-bold hover:text-[#0040A1] transition-colors">H2</button>
                            </div>
                          )}
                            
                            <div className="p-8">
                                {isEditingDesc ? (
                                    <div className="space-y-10">
                                        <div>
                                            <label className="text-[10px] font-black tracking-widest uppercase text-[#737785] block mb-4">Mapeo de Departamento</label>
                                            <select 
                                                value={industryContent}
                                                onChange={(e) => setIndustryContent(e.target.value)}
                                                className="w-full text-[15px] p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#0040A1] transition-colors font-sans mb-10 text-[#191C1D] appearance-none cursor-pointer"
                                            >
                                                <option value="Engineering">Engineering</option>
                                                <option value="Product & Design">Product & Design</option>
                                                <option value="Sales & Marketing">Sales & Marketing</option>
                                                <option value="Administration">Administration</option>
                                                <option value="People & Culture">People & Culture</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black tracking-widest uppercase text-[#737785] block mb-4">Sobre el Rol</label>
                                            <textarea 
                                                value={descContent}
                                                onChange={(e) => setDescContent(e.target.value)}
                                                className="w-full min-h-[300px] text-[15px] p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#0040A1] transition-colors font-serif leading-relaxed"
                                                placeholder="Escribe la descripción del puesto aquí (soporta HTML)..."
                                            />
                                        </div>
                                        <div className="pt-8 border-t border-[#E2E8F0]">
                                            <label className="text-[10px] font-black tracking-widest uppercase text-[#737785] block mb-4">Requisitos</label>
                                            <textarea 
                                                value={reqContent}
                                                onChange={(e) => setReqContent(e.target.value)}
                                                className="w-full min-h-[300px] text-[15px] p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#0040A1] transition-colors font-serif leading-relaxed"
                                                placeholder="Lista aquí los requisitos del puesto..."
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {descContent ? (
                                            <>
                                                <div 
                                                    className="job-content prose prose-zinc max-w-none text-[#191C1D] text-[15px] leading-relaxed font-serif"
                                                    dangerouslySetInnerHTML={{ __html: descContent }}
                                                />
                                                {reqContent && (
                                                    <div className="mt-8 pt-6 border-t border-[#E2E8F0]">
                                                        <h2 className="text-[20px] font-bold text-[#191C1D] mb-4 uppercase tracking-tight font-sans">Requisitos</h2>
                                                        <div 
                                                            className="job-content prose prose-zinc max-w-none text-[#191C1D] text-[15px] leading-relaxed font-serif"
                                                            dangerouslySetInnerHTML={{ __html: reqContent }}
                                                        />
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="prose prose-zinc max-w-none text-[#475569] text-[14px] leading-[1.8] font-medium">
                                                <h2 className="text-[20px] font-bold text-[#191C1D] mb-4">Sobre el Rol</h2>
                                                <p className="mb-8">
                                                    We are seeking a visionary Senior Product Designer to lead the evolution of our core talent ecosystem. In this role, you will be the bridge between complex data architectures and human-centric experiences. You'll work closely with product managers and engineers to craft a platform that feels intuitive, powerful, and exceptionally refined.
                                                </p>
    
                                                <h2 className="text-[20px] font-bold text-[#191C1D] mb-4">Responsabilidades</h2>
                                                <ul className="list-disc pl-5 mb-8 space-y-2">
                                                    <li>Define the visual and interaction patterns for our next-generation applicant tracking system.</li>
                                                    <li>Conduct deep user research with recruiters and hiring managers to identify friction points.</li>
                                                    <li>Create high-fidelity prototypes that demonstrate complex logic and seamless transitions.</li>
                                                    <li>Mentor junior designers and contribute to our growing design system library.</li>
                                                </ul>
    
                                                <h2 className="text-[20px] font-bold text-[#191C1D] mb-4">Requisitos</h2>
                                                <ul className="list-disc pl-5 mb-8 space-y-2">
                                                    <li>5+ years of experience in product design, preferably in SaaS or enterprise tools.</li>
                                                    <li>A portfolio demonstrating expertise in layout, typography, and systemic thinking.</li>
                                                    <li>Proficiency in Figma and modern prototyping tools.</li>
                                                    <li>Strong communication skills and the ability to articulate design decisions to stakeholders.</li>
                                                </ul>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="lg:col-span-4 space-y-6">
                            {/* Job Details Card */}
                            <div className="bg-[#F8FAFC] rounded-2xl p-8 border border-[#E2E8F0]">
                                <h3 className="text-[11px] font-bold text-[#737785] tracking-widest uppercase mb-6">DETALLES DEL PUESTO</h3>
                                
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[9px] font-black text-[#737785] tracking-widest uppercase mb-1">DEPARTAMENTO</p>
                                        <p className="text-[15px] font-bold text-[#191C1D] uppercase">{industryContent}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-[#737785] tracking-widest uppercase mb-1">UBICACIÓN</p>
                                        <p className="text-[15px] font-bold text-[#191C1D] flex items-center gap-2">
                                            <Globe size={16} className="text-[#0040A1]" /> 
                                            {location}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-[#737785] tracking-widest uppercase mb-1">TIPO DE CONTRATACIÓN</p>
                                        <p className="text-[15px] font-bold text-[#191C1D] flex items-center gap-2">
                                            <Clock size={16} className="text-[#0040A1]" /> 
                                            {employmentType}
                                        </p>
                                    </div>
                                    {job?.required_language && (
                                        <div>
                                            <p className="text-[9px] font-black text-[#737785] tracking-widest uppercase mb-1">IDIOMA REQUERIDO</p>
                                            <p className="text-[15px] font-bold text-[#191C1D] flex items-center gap-2">
                                                <Languages size={16} className="text-[#0040A1]" /> 
                                                {job.required_language}
                                            </p>
                                        </div>
                                    )}
                                    {job?.years_of_experience && (
                                        <div>
                                            <p className="text-[9px] font-black text-[#737785] tracking-widest uppercase mb-1">AÑOS DE EXPERIENCIA</p>
                                            <p className="text-[15px] font-bold text-[#191C1D] flex items-center gap-2">
                                                <Award size={16} className="text-[#0040A1]" /> 
                                                {job.years_of_experience} años
                                            </p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-[9px] font-black text-[#737785] tracking-widest uppercase mb-1">VACANTES DISPONIBLES</p>
                                        <p className="text-[15px] font-bold text-[#191C1D] flex items-center gap-2">
                                            <Users size={16} className="text-[#0040A1]" /> 
                                            {job?.positions_count || 1}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-[#737785] tracking-widest uppercase mb-1">RANGO SALARIAL</p>
                                        <p className="text-[15px] font-bold text-[#191C1D]">{job?.salary_range || '$120k - $160k'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-[#737785] tracking-widest uppercase mb-1">NIVEL DE EXPERIENCIA</p>
                                        <p className="text-[15px] font-bold text-[#191C1D]">{seniority}</p>
                                    </div>
                                </div>
                            </div>

                             {/* Visibility Card */}
                             <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
                                 <div className="flex items-center justify-between mb-2">
                                     <h3 className="text-[11px] font-bold text-[#737785] tracking-widest uppercase">VISIBILIDAD</h3>
                                     <span className="px-2 py-0.5 bg-[#F1F5F9] text-[#737785] text-[10px] font-bold rounded uppercase">OFFLINE</span>
                                 </div>
                                 <p className="text-[12px] text-[#737785] italic">Esta oferta está actualmente oculta de los tableros externos.</p>
                             </div>

                            {/* AI Tip Block */}
                            <div className="bg-[#0040A1] rounded-2xl p-6 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[40px] -mr-16 -mt-16 pointer-events-none"></div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Globe size={16} /> <span className="text-[15px] font-bold tracking-tight">Consejo de Nexus AI</span>
                                </div>
                                <p className="text-[12px] text-white/80 leading-relaxed font-medium">
                                    Resaltar software específico como 'Figma' y 'React' en tus requisitos aumenta las tasas de coincidencia en un 24%.
                                </p>
                            </div>
                        </div>
                    </>
                )}


                {/* TEAM TAB */}
                {activeTab === 'Equipo' && (
                    <>
                        <div className="col-span-full space-y-10">
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-[20px] font-bold text-[#191C1D]">Miembros del Equipo de Selección</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {job?.team && job.team.length > 0 ? (
                                        job.team.map((member: any) => (
                                            <div key={member.id} className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
                                                <div className="flex items-start justify-between mb-6">
                                                    <div className="flex items-center gap-3">
                                                        {member.avatar_url ? (
                                                            <img src={member.avatar_url} alt="Avatar" className="w-12 h-12 rounded-xl object-cover" />
                                                        ) : (
                                                            <div className="w-12 h-12 rounded-xl bg-[#0040A1] flex items-center justify-center text-white font-bold text-[18px]">
                                                                {member.full_name?.charAt(0) || 'U'}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <h4 className="text-[16px] font-bold text-[#191C1D]">{member.full_name || 'Unknown'}</h4>
                                                            <p className="text-[12px] text-[#737785]">{member.role || 'Reclutador'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4">
                                                    <span className="text-[9px] font-black tracking-widest text-[#737785] uppercase block mb-2">ESTADO ACTIVO</span>
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="px-2 py-1 bg-[#F1F5F9] text-[#475569] text-[10px] font-bold rounded">Evaluando Candidatos</span>
                                                        <span className="px-2 py-1 bg-[#F1F5F9] text-[#475569] text-[10px] font-bold rounded">Revisando</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full rounded-2xl p-12 text-center border-2 border-dashed border-[#E2E8F0] bg-[#F8FAFC]">
                                            <p className="text-[14px] font-bold text-[#191C1D] mb-2">Sin miembros asignados</p>
                                            <p className="text-[12px] text-[#737785]">A medida que se evalúen los candidatos, sus reclutadores asignados aparecerán aquí.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* QUESTIONNAIRE TAB */}
                {activeTab === 'Cuestionario' && (
                    <div className="col-span-full">
                        {/* Tab Header specific to Questionnaire */}
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 pt-2">
                            <div>
                                <h2 className="text-[28px] font-bold text-[#191C1D] mb-1 tracking-tight">Cuestionario de la Vacante</h2>
                                <p className="text-[14px] text-[#475569] font-medium">Formulario de evaluación estándar para candidatos de {title}.</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <button 
                                        onClick={handleCopyQuestionnaire}
                                        className="flex items-center gap-2 text-[#0040A1] font-bold text-[13px] hover:bg-[#F8FAFC] px-4 py-2 rounded-lg transition-colors"
                                    >
                                        <Link2 size={16} /> Copiar Cuestionario
                                    </button>
                                    {copied && (
                                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#191C1D] text-white text-[12px] font-bold rounded-xl shadow-2xl animate-in fade-in zoom-in slide-in-from-bottom-2 duration-300 z-[100] whitespace-nowrap">
                                            ¡Contenido copiado al portapapeles!
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#191C1D] rotate-45"></div>
                                        </div>
                                    )}
                                </div>
                                {isSuperAdmin && (
                                    <>
                                        <button 
                                            onClick={() => setIsEditing(!isEditing)}
                                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold shadow-sm transition-colors ${
                                                isEditing ? 'bg-[#F1F5F9] text-[#191C1D] hover:bg-[#E2E8F0]' : 'bg-[#0040A1] hover:bg-[#003380] text-white'
                                            }`}
                                        >
                                            <Edit2 size={16} /> {isEditing ? 'Cancelar Edición' : 'Editar Cuestionario'}
                                        </button>
                                        <button 
                                            onClick={handleSaveQuestionnaire}
                                            disabled={isSaving}
                                            className="flex items-center gap-2 bg-[#0040A1] hover:bg-[#003380] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold shadow-sm transition-colors disabled:opacity-50"
                                        >
                                            <Save size={16} /> {isSaving ? 'Guardando...' : 'Guardar Cuestionario'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Editor Area (Left 8 cols) */}
                            <div className="lg:col-span-8">
                                <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
                                    {/* Toolbar */}
                                    <div className="flex items-center justify-between px-8 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0]">
                                        <div className="flex items-center gap-6 text-[#191C1D]">
                                            <button className="hover:text-[#0040A1] transition-colors"><Bold size={16} /></button>
                                            <button className="hover:text-[#0040A1] transition-colors"><Italic size={16} /></button>
                                            <button className="hover:text-[#0040A1] transition-colors"><List size={16} /></button>
                                            <button className="hover:text-[#0040A1] transition-colors"><LinkIcon size={16} /></button>
                                        </div>
                                        <span className="text-[10px] font-black text-[#737785] tracking-widest uppercase">MODO EDICIÓN</span>
                                    </div>
                                    
                                    {/* Editor Content Area */}
                                    <div className="p-10 font-serif text-[#191C1D]">
                                        {questionnaire.map((section, sIdx) => (
                                            <div key={section.id} className="mb-10 last:mb-0">
                                                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2 mb-6">
                                                    {isEditing ? (
                                                        <input 
                                                            value={section.title}
                                                            onChange={(e) => updateSectionTitle(sIdx, e.target.value)}
                                                            className="text-[13px] font-black tracking-widest uppercase font-sans bg-transparent border-none focus:outline-none focus:ring-0 w-full text-[#0040A1]"
                                                        />
                                                    ) : (
                                                        <h3 className="text-[13px] font-black tracking-widest uppercase font-sans text-[#191C1D]">{section.title}</h3>
                                                    )}
                                                    {isEditing && (
                                                        <button 
                                                            onClick={() => addQuestion(sIdx)}
                                                            className="text-[10px] font-bold text-[#0040A1] hover:underline"
                                                        >
                                                            + AGREGAR PREGUNTA
                                                        </button>
                                                    )}
                                                </div>
                                                
                                                <div className="space-y-6">
                                                    {section.questions.map((q, qIdx) => (
                                                        <div key={q.id} className="group relative">
                                                            <div className="flex items-start gap-4">
                                                                <div className="flex-1">
                                                                    {isEditing ? (
                                                                        <textarea 
                                                                            value={q.label}
                                                                            onChange={(e) => updateQuestion(sIdx, qIdx, e.target.value)}
                                                                            className="w-full font-bold text-[15px] p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#0040A1] transition-colors resize-none"
                                                                            rows={q.label.length > 80 ? 3 : 1}
                                                                            placeholder="Nueva pregunta..."
                                                                        />
                                                                    ) : (
                                                                        <p className="font-bold text-[15px] leading-relaxed tracking-tight">{q.label}</p>
                                                                    )}
                                                                    
                                                                    {!isEditing && (
                                                                        <>
                                                                            {q.helper && (
                                                                                <p className="text-[13px] text-[#64748B] italic mt-1">{q.helper}</p>
                                                                            )}
                                                                            {q.note && (
                                                                                <p className="text-[9px] font-sans font-black tracking-widest text-[#737785] uppercase mt-2">{q.note}</p>
                                                                            )}
                                                                            {q.subquestions && (
                                                                                <div className="space-y-4 pl-4 text-[15px] mt-4">
                                                                                    {q.subquestions.map((sq, si) => (
                                                                                        <div key={si} className="flex items-baseline gap-3">
                                                                                            <span className="text-[#64748B]">•</span>
                                                                                            <span className="whitespace-nowrap">{sq}</span>
                                                                                            <div className="flex-1 border-b border-[#E2E8F0]"></div>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                            {!q.subquestions && (
                                                                                <div className="flex items-baseline gap-4 mt-2">
                                                                                    <span className="text-[15px] opacity-60">Respuesta{q.type === 'yesno' ? ' (Sí/No)' : ''}:</span>
                                                                                    <div className={`flex-1 ${q.type === 'textarea' ? 'border-b border-dashed border-[#E2E8F0] mt-8 block w-full h-8' : 'border-b border-[#E2E8F0] h-5'}`}></div>
                                                                                </div>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </div>
                                                                {isEditing && (
                                                                    <button 
                                                                        onClick={() => removeQuestion(sIdx, qIdx)}
                                                                        className="text-[#EF4444] opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-[#FEE2E2] rounded-lg"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Area (Right 4 cols) */}
                            <div className="lg:col-span-4 space-y-6">
                                {/* Settings Card */}
                                <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
                                    <div className="flex items-center gap-2 mb-6 text-[#191C1D] font-bold text-[15px]">
                                        <Settings2 size={18} className="text-[#0040A1]" /> Questionnaire Settings
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-[13px] border-b border-[#F1F5F9] pb-4">
                                            <span className="text-[#737785]">Estimated Time</span>
                                            <span className="font-bold text-[#191C1D]">12-15 mins</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[13px] border-b border-[#F1F5F9] pb-4">
                                            <span className="text-[#737785]">Required Questions</span>
                                            <span className="font-bold text-[#191C1D]">8 Questions</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[13px] pt-1">
                                            <span className="text-[#737785]">Language</span>
                                            <span className="font-bold text-[#191C1D] flex items-center gap-1.5"><Globe size={14} /> English (US)</span>
                                        </div>
                                    </div>
                                </div>

                                {/* AI Vetting Card */}
                                <div className="bg-[#0060F0] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
                                    {/* background glow */}
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 blur-3xl rounded-full"></div>
                                    <div className="relative z-10">
                                        <Sparkles size={24} className="mb-4" />
                                        <h3 className="text-[16px] font-bold mb-2">AI-Powered Vetting</h3>
                                        <p className="text-[13px] font-medium leading-relaxed max-w-[90%] text-white/90 mb-6 font-sans">
                                            Let our system automatically rank candidates based on these questionnaire answers to save your team 15+ hours per week.
                                        </p>
                                        <button className="bg-white hover:bg-[#F8FAFC] text-[#0040A1] text-[12px] font-black uppercase tracking-widest px-5 py-3 rounded-lg w-full transition-colors shadow-sm">
                                            ENABLE AUTO-VETTING
                                        </button>
                                    </div>
                                </div>

                                {/* Status Card */}
                                <div className="bg-[#E8F0FF] rounded-2xl p-5 border border-[#D6E3FB] shadow-sm flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#0040A1] shadow-sm shrink-0">
                                        <RefreshCcw size={18} />
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-[#737785] block mb-0.5">STATUS</span>
                                        <span className="text-[14px] font-bold text-[#191C1D]">Draft - Not Live</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
