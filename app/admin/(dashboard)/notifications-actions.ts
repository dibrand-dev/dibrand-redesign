'use server';

import { createAdminClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

export async function getNotifications() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
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
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id);

  if (error) {
    console.error('Error marking notification as read:', error);
    return { success: false };
  }
  
  return { success: true };
}

export async function markAllAsRead() {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('is_read', false);

  if (error) {
    console.error('Error marking all notifications as read:', error);
    return { success: false };
  }

  return { success: true };
}

export async function createNotification(payload: {
  type: 'candidate' | 'lead' | 'system';
  title: string;
  description?: string;
  link?: string;
  metadata?: any;
}) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('notifications')
    .insert([payload]);

  if (error) {
    console.error('Error creating notification:', error);
    return { success: false };
  }

  return { success: true };
}
