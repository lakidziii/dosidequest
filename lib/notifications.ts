import { supabase } from './supabase';

export async function getNotificationsForUser(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('to_user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function markNotificationRead(notificationId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
    .select();
  return { data, error };
}