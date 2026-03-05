export const CASE_SERVICES = [
    "Product Discovery & Strategy",
    "UI/UX Design",
    "Web Development",
    "Mobile Development",
    "Backend Engineering",
    "Cloud & DevOps",
    "QA & Testing",
    "AI & Machine Learning Integration",
    "Staff Augmentation",
    "Outsourcing"
];

export const CASE_TECH_STACK = [
    "Python", "JavaScript", "Java", "C", "C++", "C#", "Flutter", "Kotlin",
    "TypeScript", "PHP", "SQL", "Swift", "Go", "Rust", "R", "Ruby",
    "React", "Node.js", "Next.js", ".Net", "AWS", "Azure", "GCP"
];

export const CASE_PROJECT_TYPES = [
    "Web App",
    "Mobile App",
    "Full-Stack Platform",
    "MVP",
    "AI Solution"
];

export const CASE_INDUSTRIES = [
    { value: 'Media', label: 'Media & Entertainment' },
    { value: 'Fintech', label: 'Fintech' },
    { value: 'Ecommerce', label: 'E-commerce & Retail' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'EdTech', label: 'EdTech' },
    { value: 'Logistics', label: 'Logistics & Supply Chain' },
    { value: 'Real Estate', label: 'Real Estate' },
    { value: 'SaaS', label: 'SaaS / Enterprise Software' },
    { value: 'Gov', label: 'Gov' }
];

export const MAP_OLD_INDUSTRY: Record<string, string> = {
    'media': 'Media',
    'ecommerce': 'Ecommerce',
    'healthcare': 'Healthcare',
    'edtech': 'EdTech',
    'logistics': 'Logistics',
    'realestate': 'Real Estate',
    'saas': 'SaaS',
    'gov': 'Gov'
};

export const MAP_OLD_PROJECT_TYPE: Record<string, string> = {
    'webapp': 'Web App',
    'mobileapp': 'Mobile App',
    'plataforma': 'Full-Stack Platform',
    'migracion': 'MVP',
    'mvp': 'MVP',
    'aisolution': 'AI Solution',
    'Web Development': 'Web App',
    'Mobile Development': 'Mobile App'
};

export function cleanOldServiceName(name: string): string {
    const clean = name.trim();
    if (clean.includes("Web Development")) return "Web Development";
    if (clean.includes("Mobile Development")) return "Mobile Development";
    if (clean.includes("UI/UX")) return "UI/UX Design";
    if (clean.includes("Discovery")) return "Product Discovery & Strategy";
    if (clean.includes("Staff")) return "Staff Augmentation";
    if (clean.includes("Outsource")) return "Outsourcing";
    return clean;
}

