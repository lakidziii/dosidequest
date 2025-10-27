import { supabase } from './supabase';

export interface LeaderboardEntry {
  id: string;
  nickname: string;
  points: number;
  rank: number;
  avatar_url?: string;
  isUser?: boolean;
}

// Přidá body uživateli
export async function addPointsToUser(userId: string, points: number, reason?: string) {
  try {
    // Nejprve zkontrolujeme, zda uživatel má záznam v profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', userId)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching user profile:', profileError);
      return { error: profileError };
    }

    const currentPoints = profile?.points || 0;
    const newPoints = currentPoints + points;

    // Aktualizujeme body v profiles tabulce
    const { error: updateError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        points: newPoints,
        updated_at: new Date().toISOString()
      });

    if (updateError) {
      console.error('Error updating points:', updateError);
      return { error: updateError };
    }

    // Volitelně můžeme přidat záznam do historie bodů
    if (reason) {
      const { error: historyError } = await supabase
        .from('points_history')
        .insert({
          user_id: userId,
          points: points,
          reason: reason,
          created_at: new Date().toISOString()
        });

      if (historyError) {
        console.warn('Error adding points history:', historyError);
      }
    }

    return { data: { newPoints }, error: null };
  } catch (error) {
    console.error('Error in addPointsToUser:', error);
    return { error };
  }
}

// Získá globální leaderboard (top 100)
export async function getGlobalLeaderboard(limit: number = 100): Promise<{ data: LeaderboardEntry[] | null, error: any }> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, nickname, points, avatar_url')
      .not('points', 'is', null)
      .order('points', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching global leaderboard:', error);
      return { data: null, error };
    }

    const leaderboard: LeaderboardEntry[] = data?.map((entry, index) => ({
      id: entry.id,
      nickname: entry.nickname || 'Neznámý uživatel',
      points: entry.points || 0,
      rank: index + 1,
      avatar_url: entry.avatar_url,
      isUser: false
    })) || [];

    return { data: leaderboard, error: null };
  } catch (error) {
    console.error('Error in getGlobalLeaderboard:', error);
    return { data: null, error };
  }
}

// Získá leaderboard přátel
export async function getFriendsLeaderboard(userId: string, limit: number = 100): Promise<{ data: LeaderboardEntry[] | null, error: any }> {
  try {
    // Nejprve získáme seznam přátel (mutual follows)
    const { data: followingData, error: followingError } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', userId);

    if (followingError) {
      console.error('Error fetching following:', followingError);
      return { data: null, error: followingError };
    }

    const followingIds = followingData?.map(f => f.following_id) || [];

    if (followingIds.length === 0) {
      return { data: [], error: null };
    }

    // Najdeme mutual follows (přátele)
    const { data: mutualFollowsData, error: mutualError } = await supabase
      .from('follows')
      .select('follower_id')
      .in('follower_id', followingIds)
      .eq('following_id', userId);

    if (mutualError) {
      console.error('Error fetching mutual follows:', mutualError);
      return { data: null, error: mutualError };
    }

    const friendIds = mutualFollowsData?.map(f => f.follower_id) || [];
    
    // Přidáme také aktuálního uživatele
    friendIds.push(userId);

    if (friendIds.length === 0) {
      return { data: [], error: null };
    }

    // Získáme leaderboard pro přátele
    const { data, error } = await supabase
      .from('profiles')
      .select('id, nickname, points, avatar_url')
      .in('id', friendIds)
      .not('points', 'is', null)
      .order('points', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching friends leaderboard:', error);
      return { data: null, error };
    }

    const leaderboard: LeaderboardEntry[] = data?.map((entry, index) => ({
      id: entry.id,
      nickname: entry.nickname || 'Neznámý uživatel',
      points: entry.points || 0,
      rank: index + 1,
      avatar_url: entry.avatar_url,
      isUser: entry.id === userId
    })) || [];

    return { data: leaderboard, error: null };
  } catch (error) {
    console.error('Error in getFriendsLeaderboard:', error);
    return { data: null, error };
  }
}

// Získá pozici uživatele v globálním leaderboardu
export async function getUserRank(userId: string): Promise<{ data: { rank: number, points: number } | null, error: any }> {
  try {
    // Nejprve získáme body uživatele
    const { data: userProfile, error: userError } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user points:', userError);
      return { data: null, error: userError };
    }

    const userPoints = userProfile?.points || 0;

    // Spočítáme kolik uživatelů má více bodů
    const { count, error: countError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gt('points', userPoints);

    if (countError) {
      console.error('Error counting higher ranks:', countError);
      return { data: null, error: countError };
    }

    const rank = (count || 0) + 1;

    return { data: { rank, points: userPoints }, error: null };
  } catch (error) {
    console.error('Error in getUserRank:', error);
    return { data: null, error };
  }
}

// Inicializuje body pro nového uživatele
export async function initializeUserPoints(userId: string, initialPoints: number = 0) {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        points: initialPoints,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error initializing user points:', error);
      return { error };
    }

    return { error: null };
  } catch (error) {
    console.error('Error in initializeUserPoints:', error);
    return { error };
  }
}