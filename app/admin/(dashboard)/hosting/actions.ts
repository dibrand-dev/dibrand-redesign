'use server'

import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

// --- PLANS ---
export async function getHostingPlans() {
    const { data, error } = await supabase
        .from('hosting_plans')
        .select('*')
        .order('name', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
}

export async function saveHostingPlan(plan: any) {
    const { id, name, price_ars, price_usd, billing_cycle } = plan;

    const dbData = {
        name,
        price_ars: Number(price_ars),
        price_usd: Number(price_usd),
        billing_cycle,
        updated_at: new Date().toISOString()
    };

    if (id) {
        const { error } = await supabase
            .from('hosting_plans')
            .update(dbData)
            .eq('id', id);
        if (error) return { error: error.message };
    } else {
        const { error } = await supabase
            .from('hosting_plans')
            .insert([dbData]);
        if (error) return { error: error.message };
    }

    revalidatePath('/admin/hosting');
    return { success: true };
}

export async function deleteHostingPlan(id: string) {
    const { error } = await supabase
        .from('hosting_plans')
        .delete()
        .eq('id', id);

    if (error) return { error: error.message };

    revalidatePath('/admin/hosting');
    return { success: true };
}

// --- CLIENTS ---
export async function getHostingClients() {
    const { data, error } = await supabase
        .from('hosting_clients')
        .select(`
            *,
            hosting_plans (
                name,
                price_ars,
                price_usd,
                billing_cycle
            )
        `)
        .order('expiration_date', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
}

export async function saveHostingClient(client: any) {
    const { id, first_name, last_name, email, domain, plan_id, custom_price_override, currency, start_date, expiration_date } = client;

    const dbData = {
        first_name,
        last_name,
        email: email || null,
        domain,
        plan_id,
        custom_price_override: custom_price_override ? Number(custom_price_override) : null,
        currency,
        start_date: start_date || new Date().toISOString(),
        expiration_date,
        updated_at: new Date().toISOString()
    };

    if (id) {
        const { error } = await supabase
            .from('hosting_clients')
            .update(dbData)
            .eq('id', id);
        if (error) return { error: error.message };
    } else {
        const { error } = await supabase
            .from('hosting_clients')
            .insert([dbData]);
        if (error) return { error: error.message };
    }

    revalidatePath('/admin/hosting');
    return { success: true };
}

export async function deleteHostingClient(id: string) {
    const { error } = await supabase
        .from('hosting_clients')
        .delete()
        .eq('id', id);

    if (error) return { error: error.message };

    revalidatePath('/admin/hosting');
    return { success: true };
}

// --- PAYMENT HISTORY ---
export async function getPaymentHistory(clientId: string) {
    const { data, error } = await supabase
        .from('payment_history')
        .select('*')
        .eq('client_id', clientId)
        .order('payment_date', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
}

export async function savePayment(payment: any) {
    const { id, client_id, amount, currency, payment_date } = payment;

    const dbData = {
        client_id,
        amount,
        currency,
        payment_date: payment_date || new Date().toISOString()
    };

    if (id) {
        const { error } = await supabase
            .from('payment_history')
            .update(dbData)
            .eq('id', id);
        if (error) return { error: error.message };
    } else {
        const { error } = await supabase
            .from('payment_history')
            .insert([dbData]);
        if (error) return { error: error.message };
    }

    revalidatePath('/admin/hosting');
    return { success: true };
}
