import { supabase } from './supabase';

export async function followUserIdempotent(currentUserId: string, targetUserId: string) {
  const { data: existing, error: existingError } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', currentUserId)
    .eq('following_id', targetUserId)
    .maybeSingle();

  if (existingError) {
    return { created: false, error: existingError };
  }

  if (existing) {
    return { created: false };
  }

  const { error } = await supabase
    .from('follows')
    .insert({ follower_id: currentUserId, following_id: targetUserId });

  if (error && (error as any).code !== '23505') {
    return { created: false, error };
  }

  return { created: true };
}

export async function unfollowUser(currentUserId: string, targetUserId: string) {
  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', currentUserId)
    .eq('following_id', targetUserId);
  return { error };
}

export async function checkMutualFollow(currentUserId: string, targetUserId: string) {
  const { data, error } = await supabase
    .from('follows')
    .select('*')
    .eq('follower_id', targetUserId)
    .eq('following_id', currentUserId)
    .single();

  if (error) return { isMutual: false };
  return { isMutual: !!data };
}

export async function createFollowNotificationIfNew(currentUserId: string, targetUserId: string, fromNickname?: string) {
  const { error } = await supabase
    .from('notifications')
    .insert({
      type: 'follow',
      from_user_id: currentUserId,
      from_user_nickname: fromNickname || 'Neznámý uživatel',
      to_user_id: targetUserId,
      read: false,
    });
  return { error };
}