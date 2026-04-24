import { createAdminClient } from './lib/supabase-server';

async function findSuperAdmin() {
    const supabase = createAdminClient();
    const { data: users, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
        console.error('Error listing users:', error);
        return;
    }

    const superAdmin = users.users.find(u => u.user_metadata?.role === 'SuperAdmin');
    if (superAdmin) {
        console.log('SuperAdmin found:', superAdmin.id, superAdmin.email);
    } else {
        console.log('No SuperAdmin found');
    }
}

findSuperAdmin();
