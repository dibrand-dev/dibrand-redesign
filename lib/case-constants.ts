export const CASE_SERVICES = [
    "3D Design & Modeling",
    "AI & Machine Learning Integration",
    "Art Direction",
    "Backend Engineering",
    "Cloud & DevOps",
    "Mobile Development",
    "Motion Graphics",
    "Outsourcing",
    "Product Discovery & Strategy",
    "QA & Testing",
    "Staff Augmentation",
    "Technical Recruitment & Vetting",
    "UI/UX Design",
    "Web Development"
];

export const CASE_TECH_STACK = [
    "Python", "JavaScript", "Java", "C", "C++", "C#", "Flutter", "Kotlin",
    "TypeScript", "PHP", "SQL", "Swift", "Go", "Rust", "R", "Ruby",
    "React", "Node.js", "Next.js", ".Net", "AWS", "Azure", "GCP"
];

export const CASE_PROJECT_TYPES = [
    "3D Animation & Motion Graphics",
    "AI Solution",
    "Branding & Identity",
    "E-commerce Platform",
    "Full-Stack Platform",
    "Mobile App",
    "MVP",
    "Web App"
];

export const CASE_INDUSTRIES = [
    { value: 'Ecommerce', label: 'E-commerce & Retail' },
    { value: 'EdTech', label: 'EdTech' },
    { value: 'Fintech', label: 'Fintech' },
    { value: 'FoodBeverage', label: 'Food & Beverage' },
    { value: 'Gov', label: 'Gov' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Logistics', label: 'Logistics & Supply Chain' },
    { value: 'Media', label: 'Media & Entertainment' },
    { value: 'Real Estate', label: 'Real Estate' },
    { value: 'SaaS', label: 'SaaS / Enterprise Software' },
    { value: 'SportsRetail', label: 'Sports & Retail' },
    { value: 'Web3NFT', label: 'Web3 & NFT' }
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

