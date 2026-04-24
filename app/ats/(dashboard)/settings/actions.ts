'use server';

import { createClient } from '@/lib/supabase-server-client';
import { cookies } from 'next/headers';

export async function getRecruiterAuth() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}
