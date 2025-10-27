import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useUserStore } from '../../stores/userStore';
import { FollowButton } from '../../components/FollowButton';
import { searchProfiles, getUserStats as fetchUserStats } from '../../lib/profiles';
import { SearchModal } from '../../components/SearchModal';
import { useFollow } from '../../hooks/useFollow';
import { useI18n } from '../../hooks/useI18n';

export default function VideosScreen() {
  const { user, nickname: currentUserNickname, bio: currentUserBio, setBio } = useUserStore();
  const { t } = useI18n();
  const {
    followingUsers,
    friendUsers,
    followerUsers,
    userStats,
    loadFollowingStatus,
    loadUserStats,
    toggleFollow,
  } = useFollow();
  const [activeTab, setActiveTab] = useState('For You');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [editBioModalVisible, setEditBioModalVisible] = useState(false);
  const [tempBio, setTempBio] = useState('');

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
              {t('videos.forYou')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'Friends' && styles.activeTab]}
            onPress={() => setActiveTab('Friends')}
          >
            <Text style={[styles.tabText, activeTab === 'Friends' && styles.activeTabText]}>
              {t('videos.friends')}
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
              <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
            </TouchableOpacity>
            <Text style={styles.profileHeaderTitle}>Profile</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Profile Content */}
          {selectedUser && (
            <ScrollView contentContainerStyle={styles.profileContent}>
              {/* Avatar and Basic Info */}
              <View style={styles.profileInfoSection}>
                <Ionicons name="person-circle" size={100} color="#6b7280" style={styles.profileAvatar} />
                <Text style={styles.profileName}>{selectedUser.nickname}</Text>
                <Text style={styles.profileHandle}>@{selectedUser.nickname?.replace(/\s+/g, '').toLowerCase()}</Text>
                {selectedUser.bio && (
                  <Text style={styles.profileBio}>{selectedUser.bio}</Text>
                )}
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
                  <FollowButton 
                    isFollowing={followingUsers.has(selectedUser.id) || friendUsers.has(selectedUser.id)}
                    isFriend={friendUsers.has(selectedUser.id)}
                    isFollowingMe={followerUsers.has(selectedUser.id)}
                    onPress={() => toggleFollow(selectedUser.id)}
                  />
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
    backgroundColor: '#ffffff',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(102, 126, 234, 0.12)',
  },
  backButton: {
    padding: 4,
  },
  profileHeaderTitle: {
    color: '#1a1a1a',
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
    color: '#1a1a1a',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileHandle: {
    color: '#6b7280',
    fontSize: 16,
    marginBottom: 8,
  },
  profileBio: {
    color: '#4b5563',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 8,
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
    backgroundColor: '#f8f9ff',
    borderRadius: 16,
    marginHorizontal: -10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.12)',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#1a1a1a',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '500',
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
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  followButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  followingButton: {
    backgroundColor: '#f8f9ff',
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
  followingButtonText: {
    color: '#667eea',
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
    backgroundColor: '#f8f9ff',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
  editProfileButtonText: {
    color: '#667eea',
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