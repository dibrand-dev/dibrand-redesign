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
    const stage = ATS_STAGES.find(s => s.value.toLowerCase() === status?.toLowerCase());
    return stage || { color: '#191C1D', bg: '#E1E2E5', label: status };
}
