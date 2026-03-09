export interface ServiceDefinition {
    slug: string;
    title: Record<'es' | 'en', string>;
    definition: Record<'es' | 'en', string>;
    benefits: Record<'es' | 'en', string[]>;
    technicalProcess: Record<'es' | 'en', string[]>;
    keywords: string[];
    serviceType?: string;
    offerCatalog?: string[];
}

export const SERVICES_HUB: ServiceDefinition[] = [
    {
        slug: 'it-staff-augmentation-ingenieria',
        serviceType: 'IT Staff Augmentation',
        offerCatalog: ['Software Development', 'Team Scaling', 'Technical Vetting'],
        title: {
            es: 'IT Staff Augmentation e Ingeniería de Equipos',
            en: 'IT Staff Augmentation & Team Engineering',
        },
        definition: {
            es: 'Modelo de escalado de equipos de ingeniería mediante la integración de desarrolladores senior validados. Dibrand permite a las compañías tecnológicas ampliar su capacidad productiva con talento de élite en LATAM, asegurando integración cultural y técnica inmediata.',
            en: 'Engineering team scaling model through the integration of validated senior developers. Dibrand allows tech companies to expand their productive capacity with elite talent in LATAM, ensuring immediate cultural and technical integration.',
        },
        benefits: {
            es: [
                'Escalado ágil sin fricción administrativa.',
                'Validación técnica rigurosa (Top 3% Talent).',
                'Alineación total con zona horaria (Nearshore).',
                'Transferencia total de IP y conocimiento.',
            ],
            en: [
                'Agile scaling without administrative friction.',
                'Rigorous technical validation (Top 3% Talent).',
                'Total timezone alignment (Nearshore).',
                'Full IP and knowledge transfer.',
            ],
        },
        technicalProcess: {
            es: [
                'Profiling técnico y cultural del squad.',
                'Sourcing dinámico en nuestra red de expertos.',
                'Technical Vetting con Live Coding.',
                'Integración asistida y Continuous Monitoring.',
            ],
            en: [
                'Technical and cultural profiling of the squad.',
                'Dynamic sourcing in our expert network.',
                'Technical Vetting with Live Coding.',
                'Assisted integration and Continuous Monitoring.',
            ],
        },
        keywords: ['IT Staff Augmentation', 'Engineering Scaling', 'Technical Vetting', 'Nearshore Developers'],
    },
    {
        slug: 'staff-augmentation-ingenieria',
        title: {
            es: 'Staff Augmentation e Ingeniería de Software',
            en: 'Staff Augmentation & Software Engineering',
        },
        definition: {
            es: 'El Staff Augmentation es un modelo estratégico de subcontratación que permite a las empresas integrar ingenieros de software senior directamente en sus equipos internos. A diferencia del outsourcing tradicional, el equipo aumentado trabaja bajo la cultura y procesos del cliente, eliminando silos de comunicación y acelerando el roadmap técnico con talento validado.',
            en: 'Staff Augmentation is a strategic outsourcing model that allows companies to integrate senior software engineers directly into their internal teams. Unlike traditional outsourcing, the augmented team works under the client\'s culture and processes, eliminating communication silos and accelerating the technical roadmap with validated talent.',
        },
        benefits: {
            es: [
                'Escalabilidad inmediata en menos de 72 horas.',
                'Reducción de costos operativos y de reclutamiento.',
                'Acceso al top 3% de talento senior en LATAM.',
                'Integración total con metodologías ágiles (Scrum/Kanban).',
            ],
            en: [
                'Immediate scalability in less than 72 hours.',
                'Reduction of recruitment and operational costs.',
                'Access to the top 3% of senior talent in LATAM.',
                'Full integration with agile methodologies (Scrum/Kanban).',
            ],
        },
        technicalProcess: {
            es: [
                'Discovery técnico de necesidades de arquitectura.',
                'Vetting rigoroso con pruebas de Live Coding.',
                'Onboarding cultural y técnico asistido.',
                'Seguimiento de performance y Continuous Feedback.',
            ],
            en: [
                'Technical discovery of architectural needs.',
                'Rigorous vetting with Live Coding tests.',
                'Assisted cultural and technical onboarding.',
                'Performance tracking and Continuous Feedback.',
            ],
        },
        keywords: ['Staff Augmentation', 'Software Engineering', 'Nearshore', 'Developers', 'Agile Teams'],
    },
    {
        slug: 'desarrollo-software-ia',
        title: {
            es: 'Desarrollo de Software Aumentado por IA',
            en: 'AI-Augmented Software Development',
        },
        definition: {
            es: 'La ingeniería de software moderna requiere la integración de Inteligencia Artificial en todo el SDLC (Software Development Life Cycle). Desarrollamos aplicaciones Web & Mobile utilizando herramientas de IA para optimizar la calidad del código, automatizar pruebas unitarias y acelerar el tiempo de comercialización (Time-To-Market).',
            en: 'Modern software engineering requires the integration of Artificial Intelligence throughout the SDLC (Software Development Life Cycle). We develop Web & Mobile applications using AI tools to optimize code quality, automate unit testing and accelerate time-to-market.',
        },
        benefits: {
            es: [
                'Desarrollo un 40% más rápido con copilotos de IA.',
                'Arquitecturas escalables y preparadas para el futuro.',
                'Optimización de costos en mantenimiento preventivo.',
                'Interfaces UX/UI orientadas a la conversión de negocio.',
            ],
            en: [
                '40% faster development with AI copilots.',
                'Scalable and future-proof architectures.',
                'Cost optimization in preventive maintenance.',
                'UX/UI interfaces oriented to business conversion.',
            ],
        },
        technicalProcess: {
            es: [
                'Arquitectura de microservicios y Serverless.',
                'Implementación de pipelines CI/CD automatizados.',
                'Integración de Modelos de Lenguaje (LLMs).',
                'Auditoría continua de seguridad y performance.',
            ],
            en: [
                'Microservices and Serverless architecture.',
                'Implementation of automated CI/CD pipelines.',
                'Integration of Large Language Models (LLMs).',
                'Continuous security and performance audit.',
            ],
        },
        keywords: ['AI Development', 'SaaS', 'Web Apps', 'Mobile Apps', 'LLM Integration'],
    },
    {
        slug: 'agentes-ia-automatizacion-cognitiva',
        title: {
            es: 'Agentes de IA y Automatización Cognitiva',
            en: 'AI Agents & Cognitive Automation',
        },
        definition: {
            es: 'Diseñamos y desplegamos Agentes de IA autónomos que ejecutan procesos complejos, desde atención al cliente inteligente hasta análisis predictivo de datos. No son simples bots; son sistemas racionales integrados con tus bases de datos y flujos operativos para reducir costos y eliminar errores humanos.',
            en: 'We design and deploy autonomous AI Agents that execute complex processes, from intelligent customer service to predictive data analysis. They are not just bots; they are rational systems integrated with your databases and operational flows to reduce costs and eliminate human errors.',
        },
        benefits: {
            es: [
                'Disponibilidad 24/7 sin incremento de headcount.',
                'Procesamiento de grandes volúmenes de datos en tiempo real.',
                'Integración nativa con LLMs (GPT-4, Claude, Gemini).',
                'Automatización de tareas repetitivas de alto valor.',
            ],
            en: [
                '24/7 availability without increasing headcount.',
                'Real-time processing of large volumes of data.',
                'Native integration with LLMs (GPT-4, Claude, Gemini).',
                'Automation of high-value repetitive tasks.',
            ],
        },
        technicalProcess: {
            es: [
                'Diseño de RAG (Retrieval-Augmented Generation).',
                'Orquestación de agentes con LangChain/AutoGPT.',
                'Fine-tuning de modelos para dominios específicos.',
                'Monitoreo de latencia y precisión de respuestas.',
            ],
            en: [
                'RAG (Retrieval-Augmented Generation) design.',
                'Agent orchestration with LangChain/AutoGPT.',
                'Model fine-tuning for specific domains.',
                'Latency and response accuracy monitoring.',
            ],
        },
        keywords: ['AI Agents', 'Automation', 'RAG', 'LLM', 'Cognitive Computing'],
    },
    {
        slug: 'estrategia-producto-descubrimiento-tecnico',
        title: {
            es: 'Estrategia de Producto y Descubrimiento Técnico',
            en: 'Product Strategy & Technical Discovery',
        },
        definition: {
            es: 'Reducimos la incertidumbre tecnológica mediante un proceso de descubrimiento de producto que alinea los objetivos de negocio con la viabilidad técnica. Validamos arquitecturas, definimos MVPs y construimos roadmaps ejecutables que minimizan el riesgo de inversión.',
            en: 'We reduce technological uncertainty through a product discovery process that aligns business goals with technical feasibility. We validate architectures, define MVPs and build executable roadmaps that minimize investment risk.',
        },
        benefits: {
            es: [
                'Validación de hipótesis de negocio antes de codear.',
                'Arquitectura pensada para escalar desde el día 1.',
                'Alineación total entre stakeholders y equipo técnico.',
                'Definición clara de backlog y prioridades de impacto.',
            ],
            en: [
                'Business hypothesis validation before coding.',
                'Architecture designed to scale from day 1.',
                'Total alignment between stakeholders and technical team.',
                'Clear definition of backlog and impact priorities.',
            ],
        },
        technicalProcess: {
            es: [
                'Discovery Workshops con expertos técnicos.',
                'Prototipado rápido y validación de usuario.',
                'Definición de Technical Stack y Escalabilidad.',
                'Planificación de roadmaps y estimación de costos.',
            ],
            en: [
                'Discovery Workshops with technical experts.',
                'Rapid prototyping and user validation.',
                'Technical Stack and Scalability definition.',
                'Roadmap planning and cost estimation.',
            ],
        },
        keywords: ['Product Strategy', 'Discovery', 'MVP', 'Technical Validation', 'Agile'],
    },
    {
        slug: 'desarrollo-mvp-startups-escalables',
        title: {
            es: 'Desarrollo de MVP para Startups Escalables',
            en: 'MVP Development for Scalable Startups',
        },
        definition: {
            es: 'Proceso técnico y estratégico para la creación de productos mínimos viables que permiten a las startups validar hipótesis de mercado con arquitecturas robustas. En Dibrand no solo construimos código; diseñamos productos escalables desde el día cero.',
            en: 'Technical and strategic process for creating minimum viable products that allow startups to validate market hypotheses with robust architectures. At Dibrand, we don\'t just build code; we design scalable products from day zero.',
        },
        benefits: {
            es: [
                'Time-to-market acelerado (MVP en 6-8 semanas).',
                'Arquitectura serverless de bajo costo operacional.',
                'UX/UI optimizado para la retención inicial.',
                'Código limpio y documentado listo para escalado Serie A.',
            ],
            en: [
                'Accelerated time-to-market (MVP in 6-8 weeks).',
                'Low operational cost serverless architecture.',
                'UX/UI optimized for initial retention.',
                'Clean, documented code ready for Series A scaling.',
            ],
        },
        technicalProcess: {
            es: [
                'Product Discovery: Definición de funcionalidades críticas.',
                'Architecture Design: Selección de stack (React/Node.js).',
                'Agile Development: Sprints de 2 semanas con despliegue continuo.',
                'Launch & Analytics: Salida a producción y monitoreo de KPIs.',
            ],
            en: [
                'Product Discovery: Definition of critical functionalities.',
                'Architecture Design: Stack selection (React/Node.js).',
                'Agile Development: 2-week sprints with continuous deployment.',
                'Launch & Analytics: Production release and KPI monitoring.',
            ],
        },
        keywords: ['MVP Development', 'Startup Scaling', 'Rapid Prototyping', 'Product Discovery', 'Venture Hub'],
    }
];
