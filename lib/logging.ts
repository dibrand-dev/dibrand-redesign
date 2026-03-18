import { createClient } from '@/lib/supabase-server-client';
import { createNotification } from '@/app/admin/(dashboard)/notifications-actions';

/**
 * Logs an admin action to the admin_logs table
 */
export async function logAdminAction(action: string, targetType?: string, targetName?: string, metadata: any = {}) {
  try {
    const supabase = await createClient();
    
    // Get current session user
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase.from('admin_logs').insert({
      admin_email: user?.email || 'Unknown Admin',
      action,
      target_type: targetType,
      target_name: targetName,
      metadata
    });

    if (error) console.error('Error logging admin action:', error);
    
    // Create actual notification if it's a significant action
    if (action.includes('creó') || action.includes('publicó')) {
      await createNotification({
        type: 'system',
        title: 'Alerta del Sistema',
        description: `Se ha ${action} correctamente el recurso: ${targetName}`,
        link: '/admin/dashboard',
        metadata: { action, targetType, targetName }
      });
    }
  } catch (err) {
    console.error('Failed to log admin action:', err);
  }
}
