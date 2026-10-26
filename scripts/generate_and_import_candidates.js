const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { createClient } = require('@supabase/supabase-js');

const CSV_PATH = path.join(__dirname, '../data/importar_candidatos_final.csv');
const OUTPUT_SQL = path.join(__dirname, '../import_candidates.sql');

const statusMapping = {
    'Sourced': 'Nuevo',
    'Pre Screening': 'Screening',
    'Contacted': 'Screening',
    'Replied': 'Screening',
    'Client interview': 'Entrevista Cliente',
    '2nd interview': 'Entrevista Técnica',
    'Interview': 'Entrevista RRHH',
    'No Califica': 'Desestimado',
    'Rejected': 'Desestimado'
};

function inferLocation(phone, notes) {
    const p = (phone || '').replace(/[\s\-\(\)]+/g, '');
    const n = (notes || '').toLowerCase();
    
    if (n.includes('buenos aires') || n.includes('argentina') || p.startsWith('+54') || p.startsWith('54') || p.startsWith('11') || p.startsWith('341') || p.startsWith('342') || p.startsWith('2281') || p.startsWith('261')) {
        return { country: 'Argentina', state_province: n.includes('buenos aires') ? 'Buenos Aires' : 'N/A' };
    }
    if (n.includes('mexico') || n.includes('méxico') || p.startsWith('+52') || p.startsWith('52') || p.startsWith('55') || p.startsWith('317')) {
        return { country: 'México', state_province: 'N/A' };
    }
    if (n.includes('colombia') || p.startsWith('+57') || p.startsWith('57') || p.startsWith('305') || p.startsWith('350')) {
        return { country: 'Colombia', state_province: 'N/A' };
    }
    if (n.includes('bolivia') || p.startsWith('+591') || p.startsWith('591') || p.startsWith('704')) {
        return { country: 'Bolivia', state_province: 'N/A' };
    }
    if (n.includes('honduras') || p.startsWith('+504') || p.startsWith('504')) {
        return { country: 'Honduras', state_province: 'N/A' };
    }
    if (n.includes('brasil') || n.includes('brazil') || p.startsWith('+55') || p.startsWith('55')) {
        return { country: 'Brasil', state_province: 'N/A' };
    }
    if (n.includes('chile') || p.startsWith('+56') || p.startsWith('56')) {
        return { country: 'Chile', state_province: 'N/A' };
    }
    if (n.includes('venezuela') || p.startsWith('+58') || p.startsWith('58')) {
        return { country: 'Venezuela', state_province: 'N/A' };
    }
    if (n.includes('ireland') || p.startsWith('083')) {
        return { country: 'Irlanda', state_province: 'N/A' };
    }
    if (p.startsWith('809')) {
        return { country: 'República Dominicana', state_province: 'N/A' };
    }
    return { country: 'N/A', state_province: 'N/A' };
}

function escapeSql(str) {
    if (str === null || str === undefined) return 'NULL';
    return "'" + String(str).replace(/'/g, "''") + "'";
}

async function main() {
    console.log('--- Generando script de importación de candidatos ---');
    const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
    const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
    });

    console.log(`Leídos ${records.length} candidatos de ${CSV_PATH}`);

    const sqlStatements = [
        '-- Script de Importación de Candidatos Reales Dibrand',
        '-- Generado automáticamente desde data/importar_candidatos_final.csv\n',
        'BEGIN;\n'
    ];

    const candidatesData = [];

    for (const r of records) {
        const full_name = (r.full_name_raw || '').trim();
        const parts = full_name.split(' ');
        const first_name = parts[0] || '';
        const last_name = parts.slice(1).join(' ') || '';
        const email = (r.email || '').trim().toLowerCase();
        const phone = (r.phone || '').trim();
        const linkedin_url = (r.linkedin_url || '').trim();
        const position = (r.job_position || '').trim();
        const rawStatus = (r.status || '').trim();
        const status = statusMapping[rawStatus] || 'Nuevo';
        const expected_salary = (r.salary_expectation || '').trim();
        const recruiter_notes = (r.notes || '').trim();
        const cv_filename = (r.cv_filename || '').trim();
        const resume_url = cv_filename || 'resume.pdf';
        const loc = inferLocation(phone, recruiter_notes);

        if (!email) continue;

        candidatesData.push({
            full_name,
            first_name,
            last_name,
            email,
            phone,
            linkedin_url,
            position,
            status,
            expected_salary,
            recruiter_notes,
            cv_filename,
            resume_url,
            country: loc.country,
            state_province: loc.state_province,
            source: 'Importación CSV Final',
            is_deleted: false
        });

        const sql = `INSERT INTO public.job_applications (
    full_name, first_name, last_name, email, phone, linkedin_url,
    position, status, expected_salary, recruiter_notes, cv_filename,
    resume_url, country, state_province, source, is_deleted, created_at, updated_at
) VALUES (
    ${escapeSql(full_name)},
    ${escapeSql(first_name)},
    ${escapeSql(last_name)},
    ${escapeSql(email)},
    ${escapeSql(phone)},
    ${escapeSql(linkedin_url)},
    ${escapeSql(position)},
    ${escapeSql(status)},
    ${escapeSql(expected_salary)},
    ${escapeSql(recruiter_notes)},
    ${escapeSql(cv_filename)},
    ${escapeSql(resume_url)},
    ${escapeSql(loc.country)},
    ${escapeSql(loc.state_province)},
    'Importación CSV Final',
    false,
    NOW(),
    NOW()
)
ON CONFLICT (email) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    phone = COALESCE(NULLIF(EXCLUDED.phone, ''), public.job_applications.phone),
    linkedin_url = COALESCE(NULLIF(EXCLUDED.linkedin_url, ''), public.job_applications.linkedin_url),
    position = COALESCE(NULLIF(EXCLUDED.position, ''), public.job_applications.position),
    expected_salary = COALESCE(NULLIF(EXCLUDED.expected_salary, ''), public.job_applications.expected_salary),
    recruiter_notes = COALESCE(NULLIF(EXCLUDED.recruiter_notes, ''), public.job_applications.recruiter_notes),
    country = COALESCE(public.job_applications.country, EXCLUDED.country),
    state_province = COALESCE(public.job_applications.state_province, EXCLUDED.state_province),
    source = COALESCE(public.job_applications.source, EXCLUDED.source),
    status = EXCLUDED.status,
    is_deleted = false,
    updated_at = NOW();`;

        sqlStatements.push(sql);
    }

    // Vincular todos los candidatos a Norberto Riccitelli si es el administrador
    sqlStatements.push(`
-- Asignar los candidatos que no tienen reclutador asignado a Norberto Riccitelli
UPDATE public.job_applications 
SET recruiter_id = 'f4cc5a2c-2b78-4b82-b990-83286548aefb'
WHERE recruiter_id IS NULL;
`);

    // Incluir enriquecimiento de perfiles desde patch_candidates.sql
    const patchPath = path.join(__dirname, '../patch_candidates.sql');
    if (fs.existsSync(patchPath)) {
        const patchContent = fs.readFileSync(patchPath, 'utf-8');
        sqlStatements.push('\n-- Enriquecimiento detallado de cover_letter y perfiles (patch_candidates.sql)\n');
        sqlStatements.push(patchContent);
    }

    sqlStatements.push('\nCOMMIT;\n');

    fs.writeFileSync(OUTPUT_SQL, sqlStatements.join('\n\n'), 'utf-8');
    console.log(`✅ Archivo SQL generado exitosamente en: ${OUTPUT_SQL} (${candidatesData.length} candidatos)`);

    // Comprobar si existe service_role key para inserción directa vía API
    const envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf-8');
    let url = '', serviceKey = '';
    for (const line of envContent.split('\n')) {
        if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = line.split('=')[1].trim();
        if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) serviceKey = line.split('=')[1].trim();
    }

    let isServiceKeyValid = false;
    try {
        const parts = serviceKey.split('.');
        if (parts.length === 3) {
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
            if (payload.ref && url.includes(payload.ref) && payload.role === 'service_role') {
                isServiceKeyValid = true;
            }
        }
    } catch {}

    if (isServiceKeyValid) {
        console.log('Intentando importación directa con SUPABASE_SERVICE_ROLE_KEY...');
        const sb = createClient(url, serviceKey);
        const { error } = await sb.from('job_applications').upsert(candidatesData, { onConflict: 'email' });
        if (error) {
            console.error('Error insertando candidatos con API:', error);
        } else {
            console.log(`🎉 ¡Éxito! Se insertaron los ${candidatesData.length} candidatos directamente en Supabase.`);
        }
    } else {
        console.log('ℹ️  Nota: SUPABASE_SERVICE_ROLE_KEY en .env.local es inválida o no corresponde a este proyecto.');
        console.log('ℹ️  Puedes ejecutar import_candidates.sql en el SQL Editor de Supabase para poblar los candidatos inmediatamente.');
    }
}

main().catch(console.error);
