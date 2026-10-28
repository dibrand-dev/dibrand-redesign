import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Diccionario de alias conocidos de la industria que mapean variantes
 * hacia la nomenclatura oficial utilizada en Dibrand (tech_stacks).
 */
export const KNOWN_ALIASES: Record<string, string> = {
    // React
    'react': 'React',
    'react.js': 'React',
    'reactjs': 'React',
    'react js': 'React',
    'react-js': 'React',
    'react framework': 'React',

    // Node.js
    'node': 'Node.js',
    'nodejs': 'Node.js',
    'node.js': 'Node.js',
    'node js': 'Node.js',
    'node-js': 'Node.js',

    // Next.js
    'next': 'Next.js',
    'nextjs': 'Next.js',
    'next.js': 'Next.js',
    'next js': 'Next.js',
    'next-js': 'Next.js',

    // Vue.js
    'vue': 'Vue.js',
    'vuejs': 'Vue.js',
    'vue.js': 'Vue.js',
    'vue js': 'Vue.js',
    'vue-js': 'Vue.js',

    // Angular
    'angular': 'Angular',
    'angularjs': 'Angular',
    'angular.js': 'Angular',
    'angular 2+': 'Angular',

    // Bases de datos
    'postgres': 'PostgreSQL',
    'postgresql': 'PostgreSQL',
    'psql': 'PostgreSQL',
    'postgres sql': 'PostgreSQL',
    'mysql': 'My SQL',
    'my sql': 'My SQL',
    'my-sql': 'My SQL',
    'mongo': 'MongoDB',
    'mongodb': 'MongoDB',
    'mssql': 'SQL Server',
    'microsoft sql server': 'SQL Server',
    'sql server': 'SQL Server',
    'elastic search': 'Elasticsearch',
    'elasticsearch': 'Elasticsearch',

    // Cloud & DevOps
    'k8s': 'Kubernetes',
    'kubernetes': 'Kubernetes',
    'docker': 'Docker',
    'docker containers': 'Docker',
    'aws': 'AWS',
    'amazon web services': 'AWS',
    'aws cloud': 'AWS',
    'gcp': 'GCP',
    'google cloud': 'GCP',
    'google cloud platform': 'GCP',
    'google cloud platform (gcp)': 'GCP',
    'azure': 'Azure',
    'microsoft azure': 'Azure',
    'azure cloud': 'Azure',
    'github': 'GitHub',
    'git hub': 'GitHub',
    'github actions': 'GitHub Actions',
    'gh actions': 'GitHub Actions',
    'ci/cd': 'CI/CD',
    'cicd': 'CI/CD',
    'ci-cd': 'CI/CD',
    'ci / cd': 'CI/CD',
    'git': 'Git',
    'gitops': 'GitOps',
    'terraform': 'Terraform',

    // Lenguajes
    'golang': 'Go',
    'go lang': 'Go',
    'go': 'Go',
    'typescript': 'TypeScript',
    'ts': 'TypeScript',
    'javascript': 'JavaScript',
    'js': 'JavaScript',
    'python': 'Python',
    'python3': 'Python',
    'py': 'Python',
    'csharp': 'C#',
    'c sharp': 'C#',
    'c#': 'C#',
    'cplusplus': 'C++',
    'c plus plus': 'C++',
    'cpp': 'C++',
    'c++': 'C++',
    'c': 'C',
    'dotnet': '.Net',
    'dot net': '.Net',
    '.net': '.Net',
    '.net core': '.NET Core',
    'dotnet core': '.NET Core',
    'php': 'PHP',
    'ruby': 'Ruby',
    'rust': 'Rust',
    'kotlin': 'Kotlin',
    'swift': 'Swift',

    // Frameworks & herramientas populares
    'nest': 'NestJS',
    'nestjs': 'NestJS',
    'nest.js': 'NestJS',
    'tailwind': 'Tailwind CSS',
    'tailwindcss': 'Tailwind CSS',
    'tailwind css': 'Tailwind CSS',
    'graphql': 'GraphQL',
    'fastapi': 'FastAPI',
    'fast api': 'FastAPI',
    'redis': 'Redis',
    'prisma': 'Prisma',
    'zod': 'Zod',
    'redux': 'Redux',
    'redux toolkit': 'Redux Toolkit',
    'rtk': 'Redux Toolkit',
    'rabbitmq': 'RabbitMQ',
    'kafka': 'Apache Kafka',
    'apache kafka': 'Apache Kafka',
    'microservicios': 'Microservices',
    'micro services': 'Microservices',
    'microservices': 'Microservices',
    'rest': 'REST API',
    'rest api': 'REST API',
    'restful': 'REST API',
    'restful api': 'REST API',
    'css': 'CSS3',
    'css3': 'CSS3',
    'html': 'HTML5',
    'html5': 'HTML5',
    'react native': 'React Native',
    'react-native': 'React Native',
    'flutter': 'Flutter',
    'express': 'Express.js',
    'expressjs': 'Express.js',
    'express.js': 'Express.js',
    'django': 'Django',
    'flask': 'Flask',
    'spring': 'Spring Framework',
    'spring boot': 'Spring Boot',
    'supabase': 'Supabase',
    'firebase': 'Firebase'
};

/**
 * Simplifica un string quitando puntos, espacios, guiones y barras
 * para hacer comparaciones tolerantes a puntuación.
 */
export function simplifyString(str: string): string {
    return (str || '').toLowerCase().replace(/[\.\s\-_/]/g, '').trim();
}

/**
 * Formatea un nombre de tecnología con estilo oficial si es nuevo (Title Case respetando acrónimos).
 */
export function formatOfficialName(raw: string): string {
    const trimmed = raw.trim();
    if (!trimmed) return '';

    // Si ya tiene un casing específico con mayúsculas intermedias (ej. Tailwind CSS, GraphQL, FastAPI, MongoDB)
    // y no es completamente mayúscula o completamente minúscula, se respeta
    if (/[a-z]/.test(trimmed) && /[A-Z]/.test(trimmed)) {
        return trimmed;
    }

    // Acrónimos comunes en mayúsculas
    const upperList = ['AWS', 'GCP', 'SQL', 'CSS', 'HTML', 'API', 'REST', 'PHP', 'XML', 'JSON', 'SDK', 'CI/CD', 'UI', 'UX', 'QA'];
    for (const upper of upperList) {
        if (trimmed.toUpperCase() === upper) return upper;
    }

    // Capitalización simple de palabras
    return trimmed
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

/**
 * Resuelve una habilidad cruda al nombre canónico oficial de la empresa.
 */
export function resolveCanonicalSkill(rawSkill: string, existingStacks: string[]): {
    name: string;
    isNew: boolean;
} {
    const trimmed = (rawSkill || '').trim();
    if (!trimmed) return { name: '', isNew: false };

    const lower = trimmed.toLowerCase();
    const simp = simplifyString(trimmed);

    // 1. Verificación directa contra el diccionario de alias conocidos
    if (KNOWN_ALIASES[lower]) {
        return { name: KNOWN_ALIASES[lower], isNew: false };
    }
    if (KNOWN_ALIASES[simp]) {
        return { name: KNOWN_ALIASES[simp], isNew: false };
    }

    // 2. Verificación contra las tecnologías existentes en la base de datos (tech_stacks)
    for (const stackName of existingStacks) {
        // Coincidencia exacta insensible a mayúsculas
        if (stackName.toLowerCase() === lower) {
            return { name: stackName, isNew: false };
        }
        // Coincidencia simplificada (ej: "NextJS" coincide con "Next.js", "MySQL" con "My SQL")
        if (simplifyString(stackName) === simp) {
            return { name: stackName, isNew: false };
        }
    }

    // 3. Si no existe en el catálogo ni en los alias, es una tecnología nueva oficial
    const formatted = formatOfficialName(trimmed);
    return { name: formatted, isNew: true };
}

/**
 * Toma una lista de skills deseadas, las normaliza y, si hay tecnologías nuevas,
 * las inserta en la tabla `tech_stacks` de Supabase con su nombre oficial.
 */
export async function ensureSkillsInTechStacks(
    skills: string[],
    client: SupabaseClient
): Promise<string[]> {
    if (!skills || skills.length === 0) return [];

    // 1. Obtener todos los nombres actuales de tech_stacks
    const { data: stacksData, error: fetchError } = await client
        .from('tech_stacks')
        .select('name');

    if (fetchError) {
        console.error('[skills-normalizer] Error fetching tech_stacks:', fetchError);
    }

    const existingNames: string[] = (stacksData || []).map((s: { name: string }) => s.name);
    const existingLower = new Set(existingNames.map(n => n.toLowerCase()));
    const existingSimple = new Set(existingNames.map(n => simplifyString(n)));

    const canonicalResults: string[] = [];
    const newStacksToInsert: string[] = [];

    for (const raw of skills) {
        if (!raw || typeof raw !== 'string') continue;
        const { name, isNew } = resolveCanonicalSkill(raw, existingNames);
        if (!name) continue;

        // Evitar duplicados en el array de salida
        if (!canonicalResults.some(s => s.toLowerCase() === name.toLowerCase())) {
            canonicalResults.push(name);
        }

        // Si es una tecnología nueva que no existe en tech_stacks, marcarla para inserción
        const lowerName = name.toLowerCase();
        const simpName = simplifyString(name);

        if (isNew || (!existingLower.has(lowerName) && !existingSimple.has(simpName))) {
            if (!newStacksToInsert.some(n => n.toLowerCase() === lowerName)) {
                newStacksToInsert.push(name);
                existingLower.add(lowerName);
                existingSimple.add(simpName);
            }
        }
    }

    // 2. Insertar las tecnologías nuevas en tech_stacks para que queden registradas oficialmente
    if (newStacksToInsert.length > 0) {
        console.log('[skills-normalizer] Registrando nuevas tecnologías en tech_stacks:', newStacksToInsert);
        for (const newName of newStacksToInsert) {
            try {
                const { error: insertError } = await client
                    .from('tech_stacks')
                    .insert([{ name: newName }]);

                if (insertError) {
                    // Si ya existía (código 23505 unique_violation), no es error grave
                    if (insertError.code !== '23505') {
                        console.warn(`[skills-normalizer] No se pudo insertar "${newName}" en tech_stacks:`, insertError.message);
                    }
                } else {
                    console.log(`[skills-normalizer] ✅ "${newName}" agregada exitosamente a la base de tech_stacks.`);
                }
            } catch (err) {
                console.warn(`[skills-normalizer] Excepción al registrar "${newName}":`, err);
            }
        }
    }

    return canonicalResults;
}

/**
 * Normaliza una lista de skills existente deduplicando y convirtiendo variantes a su nombre canónico.
 */
export function normalizeSkillsList(skills: string[], existingStacks: string[]): string[] {
    const seen = new Set<string>();
    const normalized: string[] = [];

    for (const skill of skills) {
        if (!skill || typeof skill !== 'string') continue;
        const { name } = resolveCanonicalSkill(skill, existingStacks);
        if (!name) continue;

        const lower = name.toLowerCase();
        if (!seen.has(lower)) {
            seen.add(lower);
            normalized.push(name);
        }
    }

    return normalized;
}
