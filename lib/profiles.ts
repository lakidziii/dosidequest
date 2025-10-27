import { supabase } from './supabase';

export async function searchProfiles(query: string) {
  if (!query.trim()) return { data: [], error: null };
  const { data, error } = await supabase
    .from('profiles')
    .select('id, nickname, bio, avatar_url')
    .ilike('nickname', `%${query}%`)
    .limit(20);

  return { data, error };
}

export async function fetchProfileById(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
}

export async function getUserStats(userId: string) {
  const { count: followersCount, error: followersError } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', userId);

  const { count: followingCount, error: followingError } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', userId);

  if (followersError || followingError) {
    return { error: followersError || followingError, data: null };
  }

  return { data: { followers: followersCount || 0, following: followingCount || 0 }, error: null };
}