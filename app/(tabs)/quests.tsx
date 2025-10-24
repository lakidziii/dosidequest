import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useUserStore } from '../../stores/userStore';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { FollowButton } from '../../components/FollowButton';
import { getNotificationsForUser, markNotificationRead } from '../../lib/notifications';
import { fetchProfileById, getUserStats as fetchUserStats } from '../../lib/profiles';
import { NotificationsList } from '../../components/NotificationsList';
import { SearchModal } from '../../components/SearchModal';
import { useFollow } from '../../hooks/useFollow';

interface Notification {
  id: string;
  type: 'follow';
  from_user_id: string;
  from_user_nickname: string;
  created_at: string;
  read: boolean;
}

export default function QuestsScreen() {
  const { nickname, setUser, setNickname, user } = useUserStore();
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userStats, setUserStats] = useState({ followers: 0, following: 0 });
  const [followingUsers, setFollowingUsers] = useState<Set<string>>(new Set());
  const [friendUsers, setFriendUsers] = useState<Set<string>>(new Set());

  // Načtení notifikací
  const loadNotifications = async () => {
    if (!user?.id) return;

    const { data, error } = await getNotificationsForUser(user.id);
    if (error) {
      console.error('Chyba při načítání notifikací:', error);
      return;
    }

    setNotifications(data || []);
    const unread = data?.filter(n => !n.read).length || 0;
    setUnreadCount(unread);
  };

  // Označení notifikace jako přečtené
  const markAsRead = async (notificationId: string) => {
    const { error } = await markNotificationRead(notificationId);
    if (error) {
      console.error('Chyba při označování notifikace jako přečtené:', error);
      return;
    }

    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Otevření profilu uživatele z notifikace
  const openUserProfile = async (userId: string) => {
    try {
      const { data: userData, error } = await fetchProfileById(userId);
      if (error) {
        console.error('Error loading user data:', error);
        return;
      }

      setSelectedUser(userData);
      await loadUserStats(userId);
      setNotificationModalVisible(false);
      setProfileModalVisible(true);
    } catch (error) {
      console.error('Error opening user profile:', error);
    }
  };

  const closeProfileModal = () => {
    setProfileModalVisible(false);
    setSelectedUser(null);
  };

  const loadUserStats = async (userId: string) => {
    try {
      const { data, error } = await fetchUserStats(userId);
      if (error || !data) {
        console.error('Error loading user stats:', error);
        return;
      }
      setUserStats({
        followers: data.followers,
        following: data.following
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const loadFollowingStatus = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) return;

    try {
      // Get users that current user is following
      const { data: followingData, error: followingError } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', currentUser.id);

      if (followingError) {
        console.error('Error loading following status:', followingError);
        return;
      }

      const followingSet = new Set(followingData?.map(f => f.following_id) || []);
      setFollowingUsers(followingSet);

      // Check for mutual follows (friends)
      const { data: mutualFollowsData, error: mutualError } = await supabase
        .from('follows')
        .select('follower_id')
        .in('follower_id', Array.from(followingSet))
        .eq('following_id', currentUser.id);

      if (mutualError) {
        console.error('Error loading mutual follows:', mutualError);
        return;
      }

      const friendsSet = new Set(mutualFollowsData?.map(f => f.follower_id) || []);
      setFriendUsers(friendsSet);
    } catch (error) {
      console.error('Error loading following status:', error);
    }
  };

  const toggleFollow = async (targetUserId: string) => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) return;

    const isCurrentlyFollowing = followingUsers.has(targetUserId);
    
    try {
      if (isCurrentlyFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', currentUser.id)
          .eq('following_id', targetUserId);

        if (error) {
          console.error('Error unfollowing user:', error);
          return;
        }

        setFollowingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(targetUserId);
          return newSet;
        });

        // Remove from friends if they were friends
        setFriendUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(targetUserId);
          return newSet;
        });
      } else {
        // Follow (idempotent)
        const { data: existing, error: existingError } = await supabase
          .from('follows')
          .select('id')
          .eq('follower_id', currentUser.id)
          .eq('following_id', targetUserId)
          .maybeSingle();

        if (existingError) {
          console.error('Error checking follow existence:', existingError);
          return;
        }

        if (!existing) {
          const { error } = await supabase
            .from('follows')
            .insert({
              follower_id: currentUser.id,
              following_id: targetUserId
            });

          // Treat duplicate key as already followed, no crash
          if (error && (error as any).code !== '23505') {
            console.error('Error following user:', error);
            return;
          }

          // Vytvoř notifikaci pouze při novém follow
          const { error: notificationError } = await supabase
            .from('notifications')
            .insert({
              type: 'follow',
              from_user_id: currentUser.id,
              from_user_nickname: currentUser.user_metadata?.nickname || 'Neznámý uživatel',
              to_user_id: targetUserId,
              read: false
            });

          if (notificationError) {
            console.error('Error creating notification:', notificationError);
          }
        }

        setFollowingUsers(prev => new Set(prev).add(targetUserId));

        // Check if this creates a mutual follow (friendship)
        const { data: mutualFollowData, error: mutualError } = await supabase
          .from('follows')
          .select('*')
          .eq('follower_id', targetUserId)
          .eq('following_id', currentUser.id)
          .single();

        if (!mutualError && mutualFollowData) {
          // They follow each other - they are now friends
          setFriendUsers(prev => new Set(prev).add(targetUserId));
        }
      }

      // Resync following & friends state from DB and update stats
      await loadFollowingStatus();
      await loadUserStats(targetUserId);
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  useEffect(() => {
    // Získej user data z Supabase a ulož do Zustand store
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        if (user.user_metadata?.nickname) {
          setNickname(user.user_metadata.nickname);
        }
      }
    };
    
    getUserData();
  }, [setUser, setNickname]);

  useEffect(() => {
    if (user?.id) {
      loadNotifications();
      loadFollowingStatus();
    }
  }, [user?.id]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.greetingContainer}>
            <Ionicons name="hand-right-outline" size={24} color="#1e293b" />
            <Text style={styles.greeting}>Hello, {nickname || 'User'}</Text>
          </View>
          <Text style={styles.welcomeText}>Welcome to doSidequest.</Text>
        </View>
        <TouchableOpacity 
          style={styles.notificationButton} 
          onPress={() => setNotificationModalVisible(true)}
        >
          <Ionicons name="notifications-outline" size={24} color="#667eea" />
          {unreadCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* No Quest Section */}
      <View style={styles.noQuestSection}>
        <View style={styles.clockIcon}>
          <Ionicons name="time-outline" size={60} color="#94a3b8" />
        </View>
        <Text style={styles.noQuestTitle}>Currently no quest</Text>
        <Text style={styles.noQuestSubtitle}>
          We'll notify you when{'\n'}it will be ready for you.
        </Text>
      </View>

      {/* Analytics Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Analytics</Text>
        <View style={styles.analyticsPlaceholder}>
          {/* Empty analytics area */}
        </View>
      </View>

      {/* Graphs Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Graphs</Text>
        <View style={styles.graphsPlaceholder}>
          {/* Empty graphs area */}
        </View>
      </View>

      {/* Notification Modal */}
      <Modal
        visible={notificationModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setNotificationModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setNotificationModalVisible(false)}>
              <Ionicons name="close" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Notifikace</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Notifications List */}
          <NotificationsList
            notifications={notifications}
            onOpenUser={openUserProfile}
            onMarkRead={markAsRead}
          />
        </View>
      </Modal>

      {/* Profile Modal */}
      <Modal
        visible={profileModalVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={closeProfileModal}
      >
        <View style={styles.profileModalContainer}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <TouchableOpacity style={styles.backButton} onPress={closeProfileModal}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.profileHeaderTitle}>Profil</Text>
            <View style={{ width: 24 }} />
          </View>

          {selectedUser && (
            <ScrollView style={styles.profileContent}>
              {/* Profile Info Section */}
              <View style={styles.profileInfoSection}>
                <View style={styles.profileAvatar}>
                  <Ionicons name="person-circle" size={80} color="#888888" />
                </View>
                <Text style={styles.profileName}>
                  {selectedUser.nickname || 'Neznámý uživatel'}
                </Text>
                <Text style={styles.profileHandle}>
                  @{selectedUser.nickname?.replace(/\s+/g, '').toLowerCase() || 'user'}
                </Text>
                {selectedUser.email && (
                  <Text style={styles.profileEmail}>{selectedUser.email}</Text>
                )}
              </View>

              {/* Profile Stats */}
              <View style={styles.profileStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{userStats.followers}</Text>
                  <Text style={styles.statLabel}>Sledující</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{userStats.following}</Text>
                  <Text style={styles.statLabel}>Sleduje</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>Příspěvky</Text>
                </View>
              </View>

              {/* Profile Actions */}
              {selectedUser.id !== user?.id && (
                <View style={styles.profileActions}>
                  <FollowButton 
                    isFollowing={followingUsers.has(selectedUser.id) || friendUsers.has(selectedUser.id)}
                    isFriend={friendUsers.has(selectedUser.id)}
                    onPress={() => toggleFollow(selectedUser.id)}
                  />
                  <TouchableOpacity style={styles.messageButton}>
                    <Ionicons name="chatbubble-outline" size={20} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              )}

              {/* Bio Section */}
              <View style={styles.bioSection}>
                <Text style={styles.bioText}>
                  {selectedUser.bio || 'Žádný popis profilu'}
                </Text>
              </View>

              {/* Posts Grid */}
              <View style={styles.postsGrid}>
                <Text style={styles.postsTitle}>Příspěvky</Text>
                <View style={styles.emptyPosts}>
                  <Ionicons name="grid-outline" size={60} color="#888888" />
                  <Text style={styles.emptyPostsText}>Žádné příspěvky</Text>
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#f8fafc',
  },
  headerContent: {
    flex: 1,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginLeft: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: '#64748b',
  },
  notificationButton: {
    padding: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  noQuestSection: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
    backgroundColor: '#f8fafc',
  },
  clockIcon: {
    marginBottom: 30,
    opacity: 0.6,
  },
  noQuestTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
  },
  noQuestSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  analyticsPlaceholder: {
    height: 120,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  graphsPlaceholder: {
    height: 200,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#667eea',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  notificationsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  notificationItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginVertical: 4,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadNotification: {
    backgroundColor: '#f0f9ff',
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationIcon: {
    marginRight: 12,
  },
  notificationText: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 4,
  },
  notificationUsername: {
    fontWeight: 'bold',
    color: '#667eea',
  },
  notificationTime: {
    fontSize: 14,
    color: '#64748b',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#667eea',
    marginLeft: 8,
  },
  emptyNotifications: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyNotificationsText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyNotificationsSubtext: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  profileModalContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 4,
  },
  profileHeaderTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  profileContent: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  profileInfoSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileAvatar: {
    marginBottom: 16,
  },
  profileName: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileHandle: {
    color: '#888888',
    fontSize: 16,
    marginBottom: 8,
  },
  profileEmail: {
    color: '#666666',
    fontSize: 14,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    color: '#888888',
    fontSize: 14,
  },
  profileActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    gap: 16,
  },
  followButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
    flex: 1,
    alignItems: 'center',
  },
  followButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  followingButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  followingButtonText: {
    color: '#ffffff',
  },
  messageButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bioSection: {
    marginBottom: 30,
  },
  bioText: {
    color: '#888888',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  postsGrid: {
    alignItems: 'center',
  },
  postsTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  emptyPosts: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyPostsText: {
    color: '#888888',
    fontSize: 16,
    marginTop: 12,
  },
});