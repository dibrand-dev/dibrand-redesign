'use server';

import { createAdminClient } from '@/lib/supabase-server';
import { createClient } from '@/lib/supabase-server-client';
import { revalidatePath } from 'next/cache';

export async function getNotifications() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return [];

    const isAdmin = user.user_metadata?.role === 'admin' || user.user_metadata?.role === 'SuperAdmin';
    
    let query = supabase
      .from('notifications')
      .select('*');

    if (isAdmin) {
      // Admins see their own notifications AND global ones (user_id is null)
      query = query.or(`user_id.eq.${user.id},user_id.is.null`);
    } else {
      // Regular recruiters only see their own
      query = query.eq('user_id', user.id);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Database error in getNotifications:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Crashed in getNotifications:', err);
    return [];
  }
}

export async function markAsRead(id: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { success: false };

    // Use the service-role client (admin) to bypass RLS for global notifications
    // (user_id IS NULL). RLS blocks UPDATE when user_id != auth.uid().
    const adminSupabase = createAdminClient();

    // First verify the notification is accessible to this user (RLS SELECT check)
    const { data: notif, error: fetchError } = await supabase
      .from('notifications')
      .select('id, user_id')
      .eq('id', id)
      .single();

    if (fetchError || !notif) {
      console.error('Notification not found or not accessible:', fetchError);
      return { success: false };
    }

    // Perform the UPDATE using admin client to handle both personal and global notifications
    const { error } = await adminSupabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      // Only allow update if it belongs to this user OR is a global notification
      .or(`user_id.eq.${user.id},user_id.is.null`);

    if (error) {
      console.error('Error marking notification as read:', error);
      return { success: false };
    }
    
    return { success: true };
  } catch (err) {
    console.error('Error in markAsRead:', err);
    return { success: false };
  }
}

export async function markAllAsRead() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { success: false };

    // Use admin client to handle both personal (user_id = user.id)
    // and global (user_id IS NULL) notifications
    const adminSupabase = createAdminClient();

    const { error } = await adminSupabase
      .from('notifications')
      .update({ is_read: true })
      .or(`user_id.eq.${user.id},user_id.is.null`)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking all notifications as read:', error);
      return { success: false };
    }

    return { success: true };
  } catch (err) {
    console.error('Error in markAllAsRead:', err);
    return { success: false };
  }
}

/**
 * Hard Reset: marks ALL notifications as read for the current user.
 * Used for debugging "ghost" badge counts.
 */
export async function hardResetNotifications() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { success: false, count: 0 };

    const adminSupabase = createAdminClient();

    const { data, error } = await adminSupabase
      .from('notifications')
      .update({ is_read: true })
      .or(`user_id.eq.${user.id},user_id.is.null`)
      .select('id');

    if (error) {
      console.error('Error in hardResetNotifications:', error);
      return { success: false, count: 0 };
    }

    revalidatePath('/admin');
    return { success: true, count: data?.length ?? 0 };
  } catch (err) {
    console.error('Error in hardResetNotifications:', err);
    return { success: false, count: 0 };
  }
}

export async function createNotification(payload: {
  user_id?: string;
  type: 'nota' | 'estado' | 'asignación' | 'recordatorio' | 'candidato' | 'candidate' | 'lead' | 'system' | 'info';
  title: string;
  message?: string;
  description?: string; // Support old field name
  link?: string;
  metadata?: any;
}) {
  const supabase = createAdminClient();
  
  // Map description to message if provided
  const finalPayload = {
    ...payload,
    message: payload.message || payload.description
  };
  delete (finalPayload as any).description;

  const { error } = await supabase
    .from('notifications')
    .insert([finalPayload]);

  if (error) {
    console.error('Error creating notification:', error);
    return { success: false };
  }

  return { success: true };
}
