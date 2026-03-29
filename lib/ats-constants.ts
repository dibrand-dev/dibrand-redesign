/**
 * ATS candidate pipeline stages — single source of truth for the entire ATS.
 * Used in candidate profile, filters, pipeline boards, and status badges.
 */
export const ATS_STAGES = [
    { value: 'Sourced',     label: 'Sourced',      color: '#6B7485', bg: '#F1F5F9' },
    { value: 'Applied',     label: 'Applied',      color: '#191C1D', bg: '#E1E2E5' },
    { value: 'Screen',      label: 'Screen',       color: '#0040A1', bg: '#DAE2FF' },
    { value: 'Interview',   label: 'Interview',    color: '#21005D', bg: '#EADDFF' },
    { value: 'Interview 2', label: 'Interview 2',  color: '#1A3A00', bg: '#C4EFAD' },
    { value: 'Offer',       label: 'Offer',        color: '#7A2900', bg: '#FFE0CC' },
    { value: 'Hired',       label: 'Hired',        color: '#003823', bg: '#B8F0D6' },
] as const;

export type ATSStageValue = typeof ATS_STAGES[number]['value'];

export function getStageStyle(status: string) {
    if (status?.toLowerCase() === 'rejected') {
        return { value: 'Rejected', label: 'Rejected', color: '#dc2626', bg: '#fef2f2' };
    }
    const stage = ATS_STAGES.find(s => s.value.toLowerCase() === status?.toLowerCase());
    return stage || { color: '#191C1D', bg: '#E1E2E5', label: status };
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
