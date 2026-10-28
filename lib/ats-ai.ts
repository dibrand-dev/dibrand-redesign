import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabaseAdmin } from './supabase-admin';
import { ensureSkillsInTechStacks, normalizeSkillsList } from './skills-normalizer';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fduftfijlyqyzfbvbtmo.supabase.co';

/**
 * Normaliza y resuelve la URL pública de un currículum en Supabase Storage.
 */
export function resolveResumeUrl(rawUrl?: string, rawFilename?: string): string | null {
    if (!rawUrl && !rawFilename) return null;
    let path = rawUrl || rawFilename || '';

    // Reemplaza dominios heredados por el dominio activo
    if (path.startsWith('http')) {
        return path.replace('https://mdvyvqphumrciekgjlfb.supabase.co', supabaseUrl);
    }

    // Path relativo desde el dominio
    if (path.startsWith('/storage')) return `${supabaseUrl}${path}`;

    // Quita prefijos duplicados del bucket
    if (path.startsWith('resumes/')) path = path.replace(/^resumes\//, '');

    return `${supabaseUrl}/storage/v1/object/public/resumes/${path}`;
}

/**
 * Limpia y extrae el texto JSON de la respuesta de Gemini (removiendo backticks si los hay).
 */
function extractJsonFromText(rawText: string): any {
    let clean = rawText.trim();
    if (clean.startsWith('```json')) {
        clean = clean.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
    } else if (clean.startsWith('```')) {
        clean = clean.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    return JSON.parse(clean.trim());
}

/**
 * Extrae habilidades técnicas de un currículum utilizando Gemini AI
 * y las guarda directamente en el perfil del candidato.
 */
export async function extractSkillsWithGemini(
    candidateId: string,
    client?: any
): Promise<{
    success: boolean;
    skills?: string[];
    addedCount?: number;
    totalCount?: number;
    error?: string;
}> {
    try {
        const db = client || supabaseAdmin;
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return {
                success: false,
                error: 'No se encontró la clave de API de Gemini (falta GOOGLE_GENERATIVE_AI_API_KEY en las variables de entorno).'
            };
        }

        // 1. Obtener datos del candidato
        const { data: candidate, error: candError } = await db
            .from('job_applications')
            .select('id, full_name, first_name, last_name, resume_url, cv_filename, skills')
            .eq('id', candidateId)
            .single();

        if (candError || !candidate) {
            console.error('[ats-ai] Error fetching candidate:', candError);
            return { success: false, error: 'Candidato no encontrado.' };
        }

        if (!candidate.resume_url && !candidate.cv_filename) {
            return {
                success: false,
                error: 'El candidato no tiene ningún currículum cargado en su perfil.'
            };
        }

        // 2. Descargar el archivo del currículum
        const resolvedUrl = resolveResumeUrl(candidate.resume_url, candidate.cv_filename);
        let fileBuffer: Buffer | null = null;
        let mimeType = 'application/pdf';

        if (resolvedUrl) {
            try {
                const response = await fetch(resolvedUrl);
                if (response.ok) {
                    const arrayBuffer = await response.arrayBuffer();
                    fileBuffer = Buffer.from(arrayBuffer);
                    const contentType = response.headers.get('content-type');
                    if (contentType && (contentType.includes('pdf') || contentType.includes('image'))) {
                        mimeType = contentType.split(';')[0].trim();
                    }
                }
            } catch (fetchErr) {
                console.warn('[ats-ai] Falló la descarga directa por URL, intentando desde storage admin:', fetchErr);
            }
        }

        // Fallback a descarga directa de Supabase Storage si la descarga HTTP no funcionó
        if (!fileBuffer) {
            const rawPath = candidate.resume_url || candidate.cv_filename || '';
            let storagePath = rawPath;
            if (storagePath.includes('/resumes/')) {
                storagePath = storagePath.split('/resumes/')[1];
            } else if (storagePath.startsWith('resumes/')) {
                storagePath = storagePath.replace(/^resumes\//, '');
            }

            if (storagePath) {
                const { data: storageFile, error: downloadError } = await supabaseAdmin.storage
                    .from('resumes')
                    .download(storagePath);

                if (storageFile && !downloadError) {
                    const arrayBuffer = await storageFile.arrayBuffer();
                    fileBuffer = Buffer.from(arrayBuffer);
                } else if (downloadError) {
                    console.error('[ats-ai] Storage download error:', downloadError);
                }
            }
        }

        if (!fileBuffer || fileBuffer.length === 0) {
            return {
                success: false,
                error: 'No se pudo acceder al archivo del currículum. Asegúrate de que el archivo esté cargado en el sistema.'
            };
        }

        // 3. Validar formato del archivo
        const isPdf = fileBuffer.slice(0, 4).toString('ascii') === '%PDF';
        const isPng = fileBuffer.slice(0, 4).toString('hex') === '89504e47';
        const isJpg = fileBuffer.slice(0, 2).toString('hex') === 'ffd8';

        if (isPdf) {
            mimeType = 'application/pdf';
        } else if (isPng) {
            mimeType = 'image/png';
        } else if (isJpg) {
            mimeType = 'image/jpeg';
        } else {
            // Verificar si es Word u otro formato no soportado
            const filename = (candidate.cv_filename || candidate.resume_url || '').toLowerCase();
            if (filename.endsWith('.docx') || filename.endsWith('.doc')) {
                return {
                    success: false,
                    error: 'El archivo está en formato Word (.doc/.docx). Por favor, sube el currículum en formato PDF para poder extraer los skills con IA.'
                };
            }
            return {
                success: false,
                error: 'El formato del currículum no es compatible con el análisis directo. Por favor, asegúrate de que sea un archivo PDF.'
            };
        }

        // 4. Obtener catálogo oficial de tecnologías de tech_stacks
        let officialStacks: string[] = [];
        try {
            const { data: stacksData } = await db.from('tech_stacks').select('name').order('name');
            officialStacks = (stacksData || []).map((s: { name: string }) => s.name);
        } catch (e) {
            console.warn('[ats-ai] Error al obtener catálogo de tech_stacks:', e);
        }

        const sampleSkills = officialStacks.join(', ');

        // 5. Configurar Gemini
        const genAI = new GoogleGenerativeAI(apiKey);
        const modelsToTry = [
            'gemini-2.0-flash',
            'gemini-1.5-flash',
            'gemini-2.5-flash',
            'gemini-2.0-flash-lite'
        ];

        const systemInstruction = `Sos un reclutador técnico senior y tech lead de una boutique de ingeniería de software de clase mundial (Dibrand).
Tu tarea es leer detenidamente el currículum vitae adjunto del candidato y extraer exhaustivamente todas sus habilidades técnicas comprobadas.

INSTRUCCIONES CLAVE:
1. Extrae:
   - Lenguajes de programación (ej. TypeScript, JavaScript, Python, Java, Go, C#, PHP, Swift, Kotlin, Ruby).
   - Frameworks y librerías (ej. React, Next.js, Node.js, Express, Angular, Vue, FastAPI, Django, NestJS, Spring Boot, React Native, Flutter).
   - Bases de datos (ej. PostgreSQL, MongoDB, Redis, MySQL, DynamoDB, Oracle, Elasticsearch, Supabase).
   - Cloud y DevOps (ej. AWS, GCP, Azure, Docker, Kubernetes, CI/CD, Terraform, Linux).
   - Herramientas y metodologías técnicas (ej. Git, GraphQL, REST API, Microservicios, Agile/Scrum, Jest, Cypress).
2. NORMALIZACIÓN DE NOMBRES:
   - Usa los estándares oficiales de la industria (ej: "Node.js" y NO "node" o "nodejs"; "PostgreSQL" y NO "postgres"; "React" y NO "reactjs"; "TypeScript" y NO "ts").
3. CATÁLOGO DE REFERENCIA DE DIBRAND:
   Si la habilidad coincide con una del catálogo estándar de la empresa, usa EXACTAMENTE esa nomenclatura:
   ${sampleSkills}
4. NO INVENTES habilidades que no aparezcan expresamente en el currículum. Tampoco incluyas habilidades blandas generales (como "proactivo" o "liderazgo"), solo competencias y tecnologías de ingeniería / producto.
5. Devuelve ÚNICAMENTE un objeto JSON válido con la propiedad "skills" conteniendo el array de strings.
Ejemplo:
{"skills": ["React", "TypeScript", "Node.js", "Docker", "PostgreSQL", "AWS"]}`;

        const filePart = {
            inlineData: {
                data: fileBuffer.toString('base64'),
                mimeType
            }
        };

        let parsedResponse: any = null;
        let lastError: any = null;

        for (const modelName of modelsToTry) {
            try {
                console.log(`[ats-ai] Procesando CV con modelo: ${modelName}`);
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    generationConfig: {
                        responseMimeType: 'application/json',
                        temperature: 0.1
                    }
                });

                const result = await model.generateContent([
                    { text: systemInstruction },
                    filePart
                ]);

                const responseText = result.response.text();
                parsedResponse = extractJsonFromText(responseText);
                if (parsedResponse) break;
            } catch (err: any) {
                console.warn(`[ats-ai] Falló con ${modelName}:`, err.message || err);
                lastError = err;
            }
        }

        if (!parsedResponse) {
            throw new Error(lastError?.message || 'Gemini no pudo procesar el archivo del currículum.');
        }

        // 6. Extraer y sanitizar las skills obtenidas
        let extractedSkills: string[] = [];
        if (Array.isArray(parsedResponse)) {
            extractedSkills = parsedResponse;
        } else if (parsedResponse && Array.isArray(parsedResponse.skills)) {
            extractedSkills = parsedResponse.skills;
        } else if (parsedResponse && typeof parsedResponse === 'object') {
            const firstArray = Object.values(parsedResponse).find(v => Array.isArray(v));
            if (firstArray && Array.isArray(firstArray)) {
                extractedSkills = firstArray as string[];
            }
        }

        // Sanitizar y limpiar skills
        const cleanedExtracted = extractedSkills
            .map(s => (typeof s === 'string' ? s.trim() : ''))
            .filter(s => s.length > 1 && s.length <= 40 && !/^(skills?|tecnologías?|herramientas?)$/i.test(s));

        if (cleanedExtracted.length === 0) {
            return {
                success: false,
                error: 'No se detectaron habilidades técnicas claras en el documento.'
            };
        }

        // 7. Normalizar exhaustivamente contra tech_stacks y registrar tecnologías nuevas si no existen
        const canonicalExtracted = await ensureSkillsInTechStacks(cleanedExtracted, db);

        // Normalizar también las skills preexistentes del candidato por si tenían formatos antiguos no canónicos
        const currentSkills: string[] = candidate.skills || [];
        const normalizedCurrent = normalizeSkillsList(currentSkills, officialStacks);

        // Fusionar sin duplicados
        const existingLower = new Set(normalizedCurrent.map((s: string) => s.toLowerCase().trim()));
        const newlyAddedSkills: string[] = [];

        for (const skill of canonicalExtracted) {
            if (!existingLower.has(skill.toLowerCase().trim())) {
                newlyAddedSkills.push(skill);
                existingLower.add(skill.toLowerCase().trim());
            }
        }

        const mergedSkills = [...normalizedCurrent, ...newlyAddedSkills];

        // 8. Actualizar base de datos
        const { error: updateError } = await db
            .from('job_applications')
            .update({
                skills: mergedSkills,
                updated_at: new Date().toISOString()
            })
            .eq('id', candidateId);

        if (updateError) {
            console.error('[ats-ai] Error updating candidate skills in DB:', updateError);
            throw updateError;
        }

        // 9. Registrar nota en el historial del candidato
        try {
            const logNote = newlyAddedSkills.length > 0
                ? `✨ IA (Gemini): Se extrajeron y normalizaron ${newlyAddedSkills.length} habilidades del CV: ${newlyAddedSkills.join(', ')}.`
                : `✨ IA (Gemini): Se analizó el CV. Todas las habilidades identificadas ya estaban registradas y normalizadas.`;

            await db
                .from('application_notes')
                .insert([{
                    application_id: candidateId,
                    author_name: 'Gemini AI',
                    note_text: logNote
                }]);
        } catch (logErr) {
            console.warn('[ats-ai] Error registrando nota de historial:', logErr);
        }

        return {
            success: true,
            skills: mergedSkills,
            addedCount: newlyAddedSkills.length,
            totalCount: mergedSkills.length
        };
    } catch (err: any) {
        console.error('[ats-ai] extractSkillsWithGemini failed:', err);
        return {
            success: false,
            error: err.message || 'Ocurrió un error inesperado al analizar el currículum con IA.'
        };
    }
}
