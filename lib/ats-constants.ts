/**
 * ATS candidate pipeline stages — single source of truth for the entire ATS.
 * Used in candidate profile, filters, pipeline boards, and status badges.
 */
export const STAGE_CONFIG = {
    'Nuevo': { label: 'Nuevo', twBg: 'bg-slate-100', twText: 'text-slate-700' },
    'Screening': { label: 'Screening', twBg: 'bg-amber-100', twText: 'text-amber-700' },
    'Phone Screen': { label: 'Phone Screen', twBg: 'bg-amber-100', twText: 'text-amber-700' },
    'Entrevista RRHH': { label: 'Entrevista RRHH', twBg: 'bg-purple-50', twText: 'text-[#A3369D]' },
    'Entrevista Técnica': { label: 'Entrevista Técnica', twBg: 'bg-indigo-100', twText: 'text-indigo-700' },
    'Prueba Técnica': { label: 'Prueba Técnica', twBg: 'bg-indigo-100', twText: 'text-indigo-700' },
    'Entrevista Cliente': { label: 'Entrevista Cliente', twBg: 'bg-blue-100', twText: 'text-blue-700' },
    'Oferta': { label: 'Oferta', twBg: 'bg-pink-50', twText: 'text-[#D83484]' },
    'Contratado': { label: 'Contratado', twBg: 'bg-emerald-100', twText: 'text-emerald-700' },
    'Desestimado': { label: 'Desestimado', twBg: 'bg-rose-50', twText: 'text-rose-700' },
    'No cumple perfil': { label: 'No cumple perfil', twBg: 'bg-rose-50', twText: 'text-rose-700' },
    'Pretensión alta': { label: 'Pretensión alta', twBg: 'bg-rose-50', twText: 'text-rose-700' },
    'Poca exp': { label: 'Poca exp', twBg: 'bg-rose-50', twText: 'text-rose-700' },
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
        label: 'Talent Pool',
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
    if (lower === 'applied' || lower === 'nuevo' || lower === 'sourced') return { value: 'Nuevo', ...STAGE_CONFIG['Nuevo'] };
    if (lower === 'screening' || lower === 'phone screening' || lower === 'phone screen') return { value: 'Screening', ...STAGE_CONFIG['Screening'] };
    if (lower === 'interview' || lower === 'entrevista rrhh' || lower === 'entrevista') return { value: 'Entrevista RRHH', ...STAGE_CONFIG['Entrevista RRHH'] };
    if (lower === 'technical' || lower === 'prueba técnica' || lower === 'entrevista técnica') return { value: 'Entrevista Técnica', ...STAGE_CONFIG['Entrevista Técnica'] };
    if (lower === 'offer' || lower === 'oferta') return { value: 'Oferta', ...STAGE_CONFIG['Oferta'] };
    if (lower === 'hired' || lower === 'contratado') return { value: 'Contratado', ...STAGE_CONFIG['Contratado'] };
    if (lower === 'rejected' || lower === 'desestimado' || lower === 'rechazado' || lower === 'withdrawn') return { value: 'Desestimado', ...STAGE_CONFIG['Desestimado'] };
    
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
        title: 'CONTACT INFORMATION',
        questions: [
            { id: 'q_name', label: 'Name', type: 'text' },
            { id: 'q_email', label: 'Personal email', type: 'text' },
            { id: 'q_phone', label: 'Phone', type: 'text' },
            { id: 'q_linkedin', label: 'LinkedIn', type: 'text' },
            { id: 'q_country', label: 'Country', type: 'text' }
        ]
    },
    {
        id: 'experience',
        title: 'ABOUT YOUR EXPERIENCE',
        questions: [
            { id: 'q1', label: '1. How many years of experience do you have with .NET Development (C#, ASP.NET, .NET Core)?', type: 'text' },
            { 
                id: 'q2', 
                label: '2. How many years of experience do you have with the following technologies?', 
                type: 'sublist',
                subquestions: [
                    'SQL Server (Advanced queries, optimization)',
                    'Microservices Architecture',
                    'Frontend Frameworks (React, Angular or similar)',
                    'Cloud Platforms (Azure/Azure)'
                ]
            },
            { id: 'q3', label: '3. Have you worked as a contractor remotely for international clients?', type: 'yesno' },
            { id: 'q4', label: '4. Are you currently working? If yes, please describe your current role.', type: 'textarea' },
            { id: 'q5', label: '5. Do you have experience designing or maintaining Microservices?', type: 'textarea', helper: 'Please elaborate on your role and the tools used (e.g., Docker, Kubernetes, Service Bus).' },
            { id: 'q6', label: '6. Do you have an advanced level of spoken English (B2 or higher)?', type: 'yesno', note: 'NOTE: A TECHNICAL INTERVIEW IN ENGLISH WILL BE REQUIRED.' },
            { id: 'q7', label: '7. The client requires a background check (Criminal Records Certificate) and a drug test. Are you willing to provide/undergo these?', type: 'yesno' },
            { id: 'q8', label: '8. Do you have any planned vacations or time off in the next 6 months?', type: 'text' }
        ]
    }
];
