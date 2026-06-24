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

async function migrateHosting() {
    const migrationPath = 'hosting_migration.sql';
    const query = fs.readFileSync(migrationPath, 'utf8');
    console.log('Running migration for hosting module...');

    try {
        await sql.unsafe(query);
        console.log('Migration completed successfully.');

        // Test the connection by selecting from hosting_plans
        const result = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'hosting_%'`;
        console.log('Tables created:', result.map(r => r.table_name));

    } catch (err) {
        console.error('Error during migration:', err);
    } finally {
        await sql.end();
    }
}

migrateHosting();
