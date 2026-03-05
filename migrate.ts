import postgres from 'postgres';
import * as fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const env: Record<string, string> = {};
envFile.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key && vals.length > 0) {
        env[key.trim()] = vals.join('=').trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '');
    }
});

const sql = postgres(env['DATABASE_URL']!, { ssl: 'require' });

async function migrate() {
    const migrationPath = 'supabase/migrations/20260305100000_add_services_project_type_to_cases.sql';
    const query = fs.readFileSync(migrationPath, 'utf8');
    console.log('Running migration:');

    try {
        await sql.unsafe(query);
        console.log('Migration OK');

        // Let's check cases
        const cases = await sql`SELECT id, title, industry, tags, project_type, services FROM case_studies`;
        console.log('Got', cases.length, 'cases');

        for (const c of cases) {
            let newIndustry = c.industry;
            let newProjectType = c.project_type;
            let newServices = c.services || [];
            let updated = false;

            // Map Industry string to lower-case key if it's new-style:
            if (c.industry === 'Media & Entertainment') { newIndustry = 'media'; updated = true; }
            else if (c.industry === 'E-commerce & Retail') { newIndustry = 'ecommerce'; updated = true; }
            else if (c.industry === 'SaaS / Enterprise Software') { newIndustry = 'saas'; updated = true; }

            // Map 'Web Development' tags -> Project type 'webapp', etc
            if (c.tags && Array.isArray(c.tags)) {
                if (c.tags.includes('Web Development') && !c.project_type) {
                    newProjectType = 'webapp';
                    updated = true;
                }
            }

            if (!newProjectType && newIndustry) {
                // Assign a default if missing? 
            }

            if (updated) {
                await sql`UPDATE case_studies SET industry = ${newIndustry}, project_type = ${newProjectType} WHERE id = ${c.id}`;
                console.log(`Updated case ${c.id}: ${c.title}`);
            }
        }
    } catch (err) {
        console.error(err);
    } finally {
        await sql.end();
    }
}
migrate();
