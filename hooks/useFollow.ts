import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { followUserIdempotent, unfollowUser, checkMutualFollow } from '../lib/follows';
import { getUserStats as fetchUserStats } from '../lib/profiles';

export function useFollow() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [followingUsers, setFollowingUsers] = useState<Set<string>>(new Set());
  const [followerUsers, setFollowerUsers] = useState<Set<string>>(new Set());
  const [friendUsers, setFriendUsers] = useState<Set<string>>(new Set());
  const [userStats, setUserStats] = useState<Record<string, { followers: number; following: number }>>({});

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) {
        setCurrentUserId(user.id);
        await loadFollowingStatus(user.id);
      }
    };
    init();
  }, []);

  const loadFollowingStatus = useCallback(async (userId?: string) => {
    const uid = userId || currentUserId;
    if (!uid) return;

    try {
      // Load who I'm following
      const { data: followingData, error: followingError } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', uid);

      if (followingError) return;

      const followingSet = new Set(followingData?.map(f => f.following_id) || []);
      setFollowingUsers(followingSet);

      // Load who is following me
      const { data: followersData, error: followersError } = await supabase
        .from('follows')
        .select('follower_id')
        .eq('following_id', uid);

      if (followersError) return;

      const followersSet = new Set(followersData?.map(f => f.follower_id) || []);
      setFollowerUsers(followersSet);

      // Find mutual follows (friends)
      const { data: mutualFollowsData, error: mutualError } = await supabase
        .from('follows')
        .select('follower_id')
        .in('follower_id', Array.from(followingSet))
        .eq('following_id', uid);

      if (mutualError) return;
      const friendsSet = new Set(mutualFollowsData?.map(f => f.follower_id) || []);
      setFriendUsers(friendsSet);
    } catch (e) {
      // ignore
    }
  }, [currentUserId]);

  const loadUserStats = useCallback(async (userId: string) => {
    const { data, error } = await fetchUserStats(userId);
    if (error || !data) return;
    setUserStats(prev => ({
      ...prev,
      [userId]: { followers: data.followers, following: data.following },
    }));
  }, []);

  const toggleFollow = useCallback(async (targetUserId: string) => {
    if (!currentUserId) return;
    const isFollowing = followingUsers.has(targetUserId);

    if (isFollowing) {
      const { error } = await unfollowUser(currentUserId, targetUserId);
      if (error) return;
      setFollowingUsers(prev => {
        const ns = new Set(prev);
        ns.delete(targetUserId);
        return ns;
      });
      setFriendUsers(prev => {
        const ns = new Set(prev);
        ns.delete(targetUserId);
        return ns;
      });
    } else {
      const { created, error } = await followUserIdempotent(currentUserId, targetUserId);
      if (error) return;
      setFollowingUsers(prev => new Set(prev).add(targetUserId));
      const { isMutual } = await checkMutualFollow(currentUserId, targetUserId);
      if (isMutual) {
        setFriendUsers(prev => new Set(prev).add(targetUserId));
      }
    }

    await loadFollowingStatus();
  }, [currentUserId, followingUsers, loadFollowingStatus]);

  return {
    currentUserId,
    followingUsers,
    followerUsers,
    friendUsers,
    userStats,
    loadFollowingStatus,
    loadUserStats,
    toggleFollow,
  };
}