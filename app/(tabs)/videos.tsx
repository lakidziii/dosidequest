import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useUserStore } from '../../stores/userStore';
import { FollowButton } from '../../components/FollowButton';
import { searchProfiles, getUserStats as fetchUserStats } from '../../lib/profiles';
import { SearchModal } from '../../components/SearchModal';
import { useFollow } from '../../hooks/useFollow';

export default function VideosScreen() {
  const { user, nickname: currentUserNickname, bio: currentUserBio, setBio } = useUserStore();
  const [activeTab, setActiveTab] = useState('For You');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [editBioModalVisible, setEditBioModalVisible] = useState(false);
  const [tempBio, setTempBio] = useState('');
  const [followingUsers, setFollowingUsers] = useState<Set<string>>(new Set());
  const [friendUsers, setFriendUsers] = useState<Set<string>>(new Set());
  const [userStats, setUserStats] = useState<{[key: string]: {followers: number, following: number}}>({});

  // Načtení following statusu při načtení komponenty
  useEffect(() => {
    loadFollowingStatus();
  }, []);

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await searchProfiles(query);
      if (error) {
        console.error('Error searching profiles:', error);
        setSearchResults([]);
        return;
      }

      const results = (data || []).map(profile => ({
        id: profile.id,
        nickname: profile.nickname,
        email: `${profile.nickname}@user.com`,
        bio: profile.bio || 'no bio yet',
      }));
      setSearchResults(results);
    } catch (err) {
      console.error('Error searching profiles:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    searchUsers(text);
  };

  const openSearchModal = () => {
    setSearchModalVisible(true);
  };

  const closeSearchModal = () => {
    setSearchModalVisible(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const openProfileModal = async (user: any) => {
    setSelectedUser(user);
    setProfileModalVisible(true);
    // Load stats for the selected user
    await loadUserStats(user.id);
  };

  const closeProfileModal = () => {
    setProfileModalVisible(false);
    setSelectedUser(null);
  };

  const openEditBio = () => {
    setTempBio(currentUserBio || '');
    setEditBioModalVisible(true);
  };

  const closeEditBio = () => {
    setEditBioModalVisible(false);
    setTempBio('');
  };

  const saveBio = async () => {
    const trimmedBio = tempBio.trim() || null;
    setBio(trimmedBio);
    
    // Uložení do databáze
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({ bio: trimmedBio })
          .eq('id', user.id);
        
        if (error) {
          console.error('Error updating bio:', error);
        }
      }
    } catch (error) {
      console.error('Error saving bio:', error);
    }
    
    setEditBioModalVisible(false);
    setTempBio('');
  };

  const toggleFollow = async (targetUserId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const isCurrentlyFollowing = followingUsers.has(targetUserId);
    
    try {
      if (isCurrentlyFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
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
          .eq('follower_id', user.id)
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
              follower_id: user.id,
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
              from_user_id: user.id,
              from_user_nickname: user.user_metadata?.nickname || 'Neznámý uživatel',
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
          .eq('following_id', user.id)
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

  const loadUserStats = async (userId: string) => {
    try {
      const { data, error } = await fetchUserStats(userId);
      if (error || !data) {
        console.error('Error loading user stats:', error);
        return;
      }
      setUserStats(prev => ({
        ...prev,
        [userId]: {
          followers: data.followers,
          following: data.following,
        }
      }));
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const loadFollowingStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      // Get users that current user is following
      const { data: followingData, error: followingError } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', user.id);

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
        .eq('following_id', user.id);

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

  useEffect(() => {
    loadFollowingStatus();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header with Tabs */}
      <View style={styles.header}>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'For You' && styles.activeTab]}
            onPress={() => setActiveTab('For You')}
          >
            <Text style={[styles.tabText, activeTab === 'For You' && styles.activeTabText]}>
              For You
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'Friends' && styles.activeTab]}
            onPress={() => setActiveTab('Friends')}
          >
            <Text style={[styles.tabText, activeTab === 'Friends' && styles.activeTabText]}>
              Friends
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={openSearchModal}>
          <Ionicons name="search" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.maintenanceContainer}>
          <Text style={styles.maintenanceTitle}>This category is under maintenance</Text>
          <Text style={styles.maintenanceSubtitle}>We'll open this in future updates</Text>
        </View>
      </View>

      {/* Search Modal */}
      <SearchModal
        visible={searchModalVisible}
        onClose={closeSearchModal}
        onSelectUser={openProfileModal}
      />
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
            <TouchableOpacity onPress={closeProfileModal} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.profileHeaderTitle}>Profile</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Profile Content */}
          {selectedUser && (
            <ScrollView contentContainerStyle={styles.profileContent}>
              {/* Avatar and Basic Info */}
              <View style={styles.profileInfoSection}>
                <Ionicons name="person-circle" size={100} color="#888888" style={styles.profileAvatar} />
                <Text style={styles.profileName}>{selectedUser.nickname}</Text>
                <Text style={styles.profileHandle}>@{selectedUser.nickname?.replace(/\s+/g, '').toLowerCase()}</Text>
                <Text style={styles.profileEmail}>{selectedUser.email}</Text>
              </View>

              {/* Stats Section */}
              <View style={styles.profileStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>
                    {userStats[selectedUser.id]?.following || 0}
                  </Text>
                  <Text style={styles.statLabel}>Following</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>
                    {userStats[selectedUser.id]?.followers || 0}
                  </Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>Likes</Text>
                </View>
              </View>

              {/* Action Buttons - Only show for other users */}
              {selectedUser.nickname !== currentUserNickname && (
                <View style={styles.profileActions}>
                  <TouchableOpacity 
                    style={styles.messageButton}>
                    <Ionicons name="chatbubble-outline" size={20} color="#ffffff" />
                  </TouchableOpacity>
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

              {/* Edit Profile Button - Only show for current user */}
              {selectedUser.nickname === currentUserNickname && (
                <View style={styles.profileActions}>
                  <TouchableOpacity style={styles.editProfileButton}>
                    <Text style={styles.editProfileButtonText}>Edit Profile</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Bio Section */}
              <View style={styles.bioSection}>
                {selectedUser.nickname === currentUserNickname ? (
                  <TouchableOpacity onPress={openEditBio}>
                    <Text style={[styles.bioText, !currentUserBio && styles.bioPlaceholder]}>
                      {currentUserBio || 'Add a bio to tell people about yourself'}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.bioText}>
                    {selectedUser.bio || 'No bio available'}
                  </Text>
                )}
              </View>

              {/* Posts Grid */}
              <View style={styles.postsGrid}>
                <Text style={styles.postsTitle}>Posts</Text>
                <View style={styles.emptyPosts}>
                  <Ionicons name="grid-outline" size={40} color="#888888" />
                  <Text style={styles.emptyPostsText}>
                    {selectedUser.nickname === currentUserNickname ? 'Share your first post' : 'No posts yet'}
                  </Text>
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* Edit Bio Modal */}
      <Modal
        visible={editBioModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeEditBio}
      >
        <View style={styles.editBioContainer}>
          {/* Header */}
          <View style={styles.editBioHeader}>
            <TouchableOpacity onPress={closeEditBio}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.editBioTitle}>Edit Bio</Text>
            <TouchableOpacity onPress={saveBio}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          {/* Bio Input */}
          <View style={styles.editBioContent}>
            <TextInput
              style={styles.bioInput}
              placeholder="Tell people about yourself..."
              placeholderTextColor="#888888"
              value={tempBio}
              onChangeText={setTempBio}
              multiline
              maxLength={150}
              autoFocus
            />
            <Text style={styles.characterCount}>{tempBio.length}/150</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabText: {
    color: '#888888',
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#ffffff',
  },
  searchButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  maintenanceContainer: {
    alignItems: 'center',
  },
  maintenanceTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  maintenanceSubtitle: {
    color: '#888888',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 12,
  },
  resultsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  userHandle: {
    color: '#888888',
    fontSize: 14,
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#888888',
    fontSize: 16,
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
  editProfileButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  editProfileButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  bioPlaceholder: {
    fontStyle: 'italic',
    color: '#888888',
  },
  editBioContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  editBioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  editBioTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    color: '#888888',
    fontSize: 16,
  },
  saveButton: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
  editBioContent: {
    padding: 20,
  },
  bioInput: {
    color: '#ffffff',
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  characterCount: {
    color: '#888888',
    fontSize: 14,
    textAlign: 'right',
    marginTop: 8,
  },
});