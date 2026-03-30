/**
 * ATS candidate pipeline stages — single source of truth for the entire ATS.
 * Used in candidate profile, filters, pipeline boards, and status badges.
 */
export const ATS_STAGES = [
    { value: 'Applied',     label: 'Nuevo',          twBg: 'bg-slate-100',   twText: 'text-slate-700' },
    { value: 'Sourced',     label: 'Sourced',        twBg: 'bg-blue-100',    twText: 'text-blue-700' },
    { value: 'Screening',   label: 'Screening',      twBg: 'bg-amber-100',   twText: 'text-amber-700' },
    { value: 'Interview',   label: 'Entrevista',     twBg: 'bg-purple-100',  twText: 'text-purple-700' },
    { value: 'Technical',   label: 'Prueba Técnica', twBg: 'bg-indigo-100',  twText: 'text-indigo-700' },
    { value: 'Offer',       label: 'Oferta',         twBg: 'bg-pink-100',    twText: 'text-pink-700' },
    { value: 'Hired',       label: 'Contratado',     twBg: 'bg-emerald-100', twText: 'text-emerald-700' },
    { value: 'Rejected',    label: 'Rechazado',      twBg: 'bg-rose-100',    twText: 'text-rose-700' },
    { value: 'Withdrawn',   label: 'Retirado',       twBg: 'bg-slate-100',   twText: 'text-slate-500' }
] as const;

export type ATSStageValue = typeof ATS_STAGES[number]['value'];

export function getStageConfig(status: string) {
    const s = status?.toLowerCase() || '';
    
    // Normalize and match
    if (s === 'applied' || s === 'nuevo') return ATS_STAGES[0];
    if (s === 'sourced') return ATS_STAGES[1];
    if (s === 'screening' || s === 'screen') return ATS_STAGES[2];
    if (s === 'interview' || s === 'interviewing' || s === 'entrevista') return ATS_STAGES[3];
    if (s.includes('technical') || s.includes('técnica') || s.includes('tecnica')) return ATS_STAGES[4];
    if (s === 'offer' || s === 'offered' || s === 'oferta') return ATS_STAGES[5];
    if (s === 'hired' || s === 'contratado') return ATS_STAGES[6];
    if (s === 'rejected' || s === 'rechazado') return ATS_STAGES[7];
    if (s === 'withdrawn' || s === 'retirado') return ATS_STAGES[8];
    
    // Default fallback
    return { 
        value: status, 
        label: status, 
        twBg: 'bg-slate-100',   
        twText: 'text-slate-600' 
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
