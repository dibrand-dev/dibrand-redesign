import { 
    Code2, 
    Layers, 
    Globe, 
    ShieldCheck, 
    History, 
    Headphones, 
    Cloud, 
    Zap, 
    Database,
    Binary,
    TestTube2,
    LayoutPanelLeft,
    ShoppingCart,
    Rocket,
    Server,
    Building2,
    Lock,
    GitBranch,
    Lightbulb,
    ScanEye,
    Cpu,
    MonitorSmartphone,
    Eye
} from 'lucide-react';

interface SolutionsByCategoryProps {
    categories: Array<{
        title: string;
        items: Array<{ title: string; desc: string }>;
    }>;
}

const iconMap: Record<string, any> = {
    // Group 1
    "Desarrollo de Software a Medida": Code2,
    "Custom Software Development": Code2,
    "Desarrollo de E-commerce": ShoppingCart,
    "E-commerce Development": ShoppingCart,
    "Desarrollo de MVP": Rocket,
    "MVP Development": Rocket,
    "Desarrollo de Apps Web y Móviles (iOS/Android)": MonitorSmartphone,
    "Web & Mobile App Development (iOS/Android)": MonitorSmartphone,
    "Diseño UX/UI": LayoutPanelLeft,
    "UX/UI Design": LayoutPanelLeft,
    "Aplicaciones SaaS y Cloud": Cloud,
    "SaaS & Cloud Applications": Cloud,
    "Desarrollo Back-End y Front-End": Server,
    "Back-End & Front-End Development": Server,
    "Desarrollo de Software Empresarial": Building2,
    "Enterprise Software Development": Building2,
    "Desarrollo de dApps y Blockchain": Binary,
    "dApp Development": Binary,

    // Group 2
    "Migración de Aplicaciones Legacy": History,
    "Legacy Application Migration": History,
    "QA y Testing de Software": ShieldCheck,
    "Software Testing & QA": ShieldCheck,
    "Testing Manual y Automatizado": TestTube2,
    "Manual & Automation Testing": TestTube2,
    "Ciberseguridad y Pentesting": Lock,
    "Cybersecurity & Penetration Testing": Lock,
    "DevOps y Automatización de Despliegues": GitBranch,
    "DevOps & CI/CD": GitBranch,
    "Transformación Digital": Lightbulb,
    "Digital Transformation": Lightbulb,

    // Group 3
    "Inteligencia Artificial y Machine Learning": Zap,
    "Machine Learning & AI": Zap,
    "Computación y Migración a la Nube": Cloud,
    "Cloud Computing & Migration": Cloud,
    "Big Data y Almacenamiento de Datos": Database,
    "Big Data & Data Warehouse": Database,
    "Deep Learning y Visión Artificial": ScanEye,
    "Deep Learning & Computer Vision": ScanEye,
    "Automatización Robótica de Procesos (RPA)": Cpu,
    "RPA": Cpu,
    "Realidad Aumentada, Virtual y Metaverso": Eye,
    "AR/VR & Metaverse": Eye
};

export default function SolutionsByCategory({ categories }: SolutionsByCategoryProps) {
    return (
        <section className="py-24 bg-zinc-50 border-t border-zinc-100">
            <div className="container mx-auto px-6 max-w-7xl">
                {categories.map((category, catIdx) => (
                    <div key={catIdx} className="mb-24 last:mb-0">
                        {/* Category Header */}
                        <div className="mb-12">
                            <h2 className="text-2xl md:text-4xl font-bold text-zinc-900 font-outfit tracking-tight mb-4 uppercase">
                                {category.title}
                            </h2>
                            <div className="h-1 w-20 bg-brand" />
                        </div>

                        {/* Items Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {category.items.map((item, itemIdx) => {
                                const Icon = iconMap[item.title] || Code2;
                                return (
                                    <div 
                                        key={itemIdx}
                                        className="group p-10 rounded-[2rem] bg-white border border-zinc-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-400 flex flex-col items-start"
                                    >
                                        <div className="w-14 h-14 rounded-full bg-brand/5 flex items-center justify-center mb-8 group-hover:bg-brand transition-colors duration-400">
                                            <Icon size={26} className="text-brand group-hover:text-white transition-colors duration-400" strokeWidth={1.5} />
                                        </div>
                                        <h3 className="text-xl font-bold text-zinc-900 mb-4 font-outfit tracking-tight leading-tight">
                                            {item.title}
                                        </h3>
                                        <p className="text-zinc-500 font-outfit font-light leading-relaxed text-sm">
                                            {item.desc}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
