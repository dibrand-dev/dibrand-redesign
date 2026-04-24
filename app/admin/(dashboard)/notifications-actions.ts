'use server';

import { createAdminClient } from '@/lib/supabase-server';
import { createClient } from '@/lib/supabase-server-client';
import { revalidatePath } from 'next/cache';

export async function getNotifications() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return [];

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
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

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .eq('user_id', user.id);

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

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
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
