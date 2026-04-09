/**
 * ATS candidate pipeline stages — single source of truth for the entire ATS.
 * Used in candidate profile, filters, pipeline boards, and status badges.
 */
export const STAGE_CONFIG = {
    'Nuevo': { label: 'Nuevo', twBg: 'bg-slate-100', twText: 'text-slate-700' },
    'Screening': { label: 'Screening', twBg: 'bg-amber-100', twText: 'text-amber-700' },
    'Phone Screen': { label: 'Entrevista Telefónica', twBg: 'bg-amber-100', twText: 'text-amber-700' },
    'Entrevista RRHH': { label: 'Entrevista RRHH', twBg: 'bg-purple-50', twText: 'text-[#A3369D]' },
    'Entrevista Técnica': { label: 'Entrevista Técnica', twBg: 'bg-indigo-100', twText: 'text-indigo-700' },
    'Prueba Técnica': { label: 'Prueba Técnica', twBg: 'bg-indigo-100', twText: 'text-indigo-700' },
    'Entrevista Cliente': { label: 'Entrevista Cliente', twBg: 'bg-blue-100', twText: 'text-blue-700' },
    'Oferta': { label: 'Oferta', twBg: 'bg-pink-50', twText: 'text-[#D83484]' },
    'Contratado': { label: 'Contratado', twBg: 'bg-emerald-100', twText: 'text-emerald-700' },
    'Desestimado': { label: 'Desestimado', twBg: 'bg-rose-50', twText: 'text-rose-700' },
    'No cumple perfil': { label: 'No cumple perfil', twBg: 'bg-rose-50', twText: 'text-rose-700' },
    'Pretensión alta': { label: 'Pretensión alta', twBg: 'bg-rose-50', twText: 'text-rose-700' },
    'Poca exp': { label: 'Poca experiencia', twBg: 'bg-rose-50', twText: 'text-rose-700' },
    'Otro': { label: 'Otro', twBg: 'bg-rose-50', twText: 'text-rose-700' },
    'Talent Pool': { label: 'Talent Pool', twBg: 'bg-stone-100', twText: 'text-stone-700' },
} as const;

export const MACRO_STAGES = [
    {
        id: 'sourcing',
        label: 'Sourcing',
        color: '#64748B', // Slate 500
        stages: ['Nuevo', 'Screening', 'Phone Screen']
    },
    {
        id: 'evaluacion',
        label: 'Evaluación',
        color: '#A3369D', // Dibrand Purple
        stages: ['Entrevista RRHH', 'Entrevista Técnica', 'Prueba Técnica', 'Entrevista Cliente']
    },
    {
        id: 'cierre',
        label: 'Cierre',
        color: '#D83484', // Dibrand Magenta
        stages: ['Oferta', 'Contratado']
    },
    {
        id: 'fuera',
        label: 'Pool de Talento',
        color: '#64748B', // Slate 500
        stages: ['Talent Pool']
    },
    {
        id: 'rechazados',
        label: 'Rechazados',
        color: '#BE123C', // Rose 700
        stages: ['Desestimado', 'No cumple perfil', 'Pretensión alta', 'Poca exp', 'Otro']
    }
] as const;

export const ATS_STAGES = Object.keys(STAGE_CONFIG).map(key => ({
    value: key,
    label: (STAGE_CONFIG as any)[key].label,
    twBg: (STAGE_CONFIG as any)[key].twBg,
    twText: (STAGE_CONFIG as any)[key].twText,
}));

export type ATSStageValue = keyof typeof STAGE_CONFIG;

export function getStageConfig(status: string) {
    const s = status || '';
    
    // Exact match from the new config
    if (STAGE_CONFIG[s as keyof typeof STAGE_CONFIG]) {
        return { value: s, ...(STAGE_CONFIG as any)[s] };
    }

    // Normalizations for legacy data
    const lower = s.toLowerCase();
    if (lower === 'applied' || lower === 'nuevo' || lower === 'sourced' || lower === 'new') return { value: 'Nuevo', ...STAGE_CONFIG['Nuevo'] };
    if (lower === 'screening' || lower === 'phone screening' || lower === 'phone screen') return { value: 'Screening', ...STAGE_CONFIG['Screening'] };
    if (lower === 'interview' || lower === 'entrevista rrhh' || lower === 'entrevista') return { value: 'Entrevista RRHH', ...STAGE_CONFIG['Entrevista RRHH'] };
    if (lower === 'technical' || lower === 'prueba técnica' || lower === 'entrevista técnica') return { value: 'Entrevista Técnica', ...STAGE_CONFIG['Entrevista Técnica'] };
    if (lower === 'offer' || lower === 'oferta') return { value: 'Oferta', ...STAGE_CONFIG['Oferta'] };
    if (lower === 'hired' || lower === 'contratado') return { value: 'Contratado', ...STAGE_CONFIG['Contratado'] };
    if (lower === 'rejected' || lower === 'desestimado' || lower === 'rechazado' || lower === 'withdrawn' || lower === 'desestimado') return { value: 'Desestimado', ...STAGE_CONFIG['Desestimado'] };
    
    // Default fallback
    return { 
        value: status, 
        label: status, 
        twBg: 'bg-slate-100',   
        twText: 'text-slate-600' 
    };
}

// Macro Stage Finder helper
export function getMacroConfig(status: string) {
    const config = getStageConfig(status);
    const s = config.value;
    
    const macro = MACRO_STAGES.find(m => (m.stages as readonly string[]).includes(s));
    
    if (macro) return macro;

    // Default fallback
    return {
        id: 'other',
        label: 'Otros',
        color: '#64748B',
        stages: []
    };
}

export const DEFAULT_QUESTIONNAIRE = [
    {
        id: 'contact',
        title: 'INFORMACIÓN DE CONTACTO',
        questions: [
            { id: 'q_name', label: 'Nombre Completo', type: 'text' },
            { id: 'q_email', label: 'Correo Personal', type: 'text' },
            { id: 'q_phone', label: 'Teléfono / WhatsApp', type: 'text' },
            { id: 'q_linkedin', label: 'Perfil de LinkedIn', type: 'text' },
            { id: 'q_country', label: 'País de Residencia', type: 'text' }
        ]
    },
    {
        id: 'experience',
        title: 'SOBRE TU EXPERIENCIA',
        questions: [
            { id: 'q1', label: '1. ¿Cuántos años de experiencia tienes en Desarrollo .NET (C#, ASP.NET, .NET Core)?', type: 'text' },
            { 
                id: 'q2', 
                label: '2. ¿Cuántos años de experiencia tienes con las siguientes tecnologías?', 
                type: 'sublist',
                subquestions: [
                    'SQL Server (Queries Avanzados, optimización)',
                    'Arquitectura de Microservicios',
                    'Frameworks Frontend (React, Angular o similar)',
                    'Plataformas Cloud (Azure/AWS)'
                ]
            },
            { id: 'q3', label: '3. ¿Has trabajado como contractor de forma remota para clientes internacionales?', type: 'yesno' },
            { id: 'q4', label: '4. ¿Estás trabajando actualmente? Si es así, por favor describe tu rol actual.', type: 'textarea' },
            { id: 'q5', label: '5. ¿Tienes experiencia diseñando o manteniendo Microservicios?', type: 'textarea', helper: 'Explica tu rol y herramientas usadas (ej: Docker, Kubernetes, Service Bus).' },
            { id: 'q6', label: '6. ¿Cuentas con un nivel avanzado de inglés hablado (B2 o superior)?', type: 'yesno', note: 'NOTA: SE REQUERIRÁ UNA ENTREVISTA TÉCNICA EN INGLÉS.' },
            { id: 'q7', label: '7. El cliente requiere un background check (Certificado de Antecedentes) y un test de drogas. ¿Estás dispuesto a realizarlos?', type: 'yesno' },
            { id: 'q8', label: '8. ¿Tienes planes de vacaciones o tiempo fuera en los próximos 6 meses?', type: 'text' }
        ]
    }
];
