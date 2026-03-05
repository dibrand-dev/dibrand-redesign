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
    { value: 'media', label: 'Media & Entertainment' },
    { value: 'fintech', label: 'Fintech' },
    { value: 'ecommerce', label: 'E-commerce & Retail' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'edtech', label: 'EdTech' },
    { value: 'logistics', label: 'Logistics & Supply Chain' },
    { value: 'realestate', label: 'Real Estate' },
    { value: 'saas', label: 'SaaS / Enterprise Software' },
    { value: 'gov', label: 'Gov' }
];

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

