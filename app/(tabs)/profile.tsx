import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../../stores/userStore';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { AvatarPicker } from '../../components/AvatarPicker';
import { useI18n } from '../../hooks/useI18n';

export default function ProfileScreen() {
  const { user, nickname, bio, avatar_url, setUser, setNickname, setBio, setAvatarUrl } = useUserStore();
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'Posts' | 'Liked'>('Posts');
  const [editBioModalVisible, setEditBioModalVisible] = useState(false);
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [tempBio, setTempBio] = useState('');
  const [tempNickname, setTempNickname] = useState('');
  const [userStats, setUserStats] = useState({ followers: 0, following: 0 });

  // Odvozený handle ve stylu TikTok
  const handle = nickname ? nickname.replace(/\s+/g, '').toLowerCase() : 'user';

  // Mock data pro grid (může se později napojit na Supabase)
  const posts = Array.from({ length: 9 }, (_, i) => ({ id: i + 1 }));
  const likedPosts = Array.from({ length: 6 }, (_, i) => ({ id: i + 1 }));

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        if (user.user_metadata?.nickname) {
          setNickname(user.user_metadata.nickname);
        }
        
        // Načtení bio a avatar_url z profiles tabulky
        const { data: profile } = await supabase
          .from('profiles')
          .select('bio, avatar_url')
          .eq('id', user.id)
          .single();
        
        if (profile?.bio) {
          setBio(profile.bio);
        }
        if (profile?.avatar_url) {
          setAvatarUrl(profile.avatar_url);
        }

        // Načtení statistik uživatele
        await loadUserStats(user.id);
      }
    };
    getUserData();
  }, [setUser, setNickname, setBio]);

  const loadUserStats = async (userId: string) => {
    try {
      // Get followers count
      const { count: followersCount, error: followersError } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', userId);

      // Get following count
      const { count: followingCount, error: followingError } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', userId);

      if (followersError || followingError) {
        console.error('Error loading user stats:', followersError || followingError);
        return;
      }

      setUserStats({
        followers: followersCount || 0,
        following: followingCount || 0
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const openEditProfile = () => {
    setTempNickname(nickname || '');
    setTempBio(bio || '');
    setEditProfileModalVisible(true);
  };

  const closeEditProfile = () => {
    setEditProfileModalVisible(false);
    setTempNickname('');
    setTempBio('');
  };

  const saveProfile = async () => {
    const trimmedNickname = tempNickname.trim();
    const trimmedBio = tempBio.trim() || null;
    
    if (trimmedNickname) {
      setNickname(trimmedNickname);
    }
    setBio(trimmedBio);
    
    // Uložení do databáze
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Update nickname in user metadata
        const { error: metadataError } = await supabase.auth.updateUser({
          data: { nickname: trimmedNickname }
        });
        
        // Update bio in profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ bio: trimmedBio })
          .eq('id', user.id);
        
        if (metadataError || profileError) {
          console.error('Error updating profile:', metadataError || profileError);
        }
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
    
    setEditProfileModalVisible(false);
    setTempNickname('');
    setTempBio('');
  };

  const removeAvatar = async () => {
    try {
      setAvatarUrl(null);
      
      // Update avatar in database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({ avatar_url: null })
          .eq('id', user.id);
        
        if (error) {
          console.error('Error removing avatar:', error);
        }
      }
    } catch (error) {
      console.error('Error removing avatar:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile header (TikTok-like) */}
      <View style={styles.profileHeader}>
        <AvatarPicker 
          currentAvatarUrl={avatar_url}
          onAvatarChange={setAvatarUrl}
          size={80}
          disabled={true}
        />
        <Text style={styles.profileName}>{nickname || 'User'}</Text>
        <Text style={styles.handleText}>@{handle}</Text>
        {/* Bio - not clickable */}
        <Text style={[styles.bioText, !bio && styles.bioPlaceholder]}>
          {bio || 'Add a bio to tell people about yourself'}
        </Text>

        {/* Stats row with more spacing */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.following}</Text>
            <Text style={styles.statLabel}>{t('profile.following')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.followers}</Text>
            <Text style={styles.statLabel}>{t('profile.followers')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>{t('profile.likes')}</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.editProfileButton} onPress={openEditProfile}>
            <Text style={styles.editProfileButtonText}>{t('profile.editProfile')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.analyticsButton}>
            <Text style={styles.analyticsButtonText}>{t('profile.seeAnalytics')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs (Posts / Liked) */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'Posts' && styles.activeTab]}
          onPress={() => setActiveTab('Posts')}
        >
          <Ionicons
            name={activeTab === 'Posts' ? 'grid' : 'grid-outline'}
            size={20}
            color={activeTab === 'Posts' ? '#1a1a1a' : '#6b7280'}
          />
          <Text style={[styles.tabText, activeTab === 'Posts' && styles.activeTabText]}>{t('profile.posts')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'Liked' && styles.activeTab]}
          onPress={() => setActiveTab('Liked')}
        >
          <Ionicons
            name={activeTab === 'Liked' ? 'heart' : 'heart-outline'}
            size={20}
            color={activeTab === 'Liked' ? '#1a1a1a' : '#6b7280'}
          />
          <Text style={[styles.tabText, activeTab === 'Liked' && styles.activeTabText]}>{t('profile.liked')}</Text>
        </TouchableOpacity>
      </View>

      {/* Grid */}
      <View style={styles.grid}>
        {(activeTab === 'Posts' ? posts : likedPosts).map((item) => (
          <TouchableOpacity key={item.id} style={styles.postItem}>
            <View style={styles.postThumb}>
              <Ionicons name="videocam" size={24} color="#64748b" />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Edit Profile Modal */}
      <Modal
        visible={editProfileModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.editProfileContainer}>
          <View style={styles.editProfileHeader}>
            <TouchableOpacity onPress={closeEditProfile}>
              <Text style={styles.cancelButton}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            <Text style={styles.editProfileTitle}>{t('profile.editProfile')}</Text>
            <TouchableOpacity onPress={saveProfile}>
              <Text style={styles.saveButton}>{t('common.save')}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.editProfileContent}>
            {/* Avatar Section */}
            <View style={styles.avatarSection}>
              <Text style={styles.sectionTitle}>{t('profile.profilePicture')}</Text>
              <AvatarPicker 
                currentAvatarUrl={avatar_url}
                onAvatarChange={setAvatarUrl}
                size={100}
              />
              {avatar_url && (
                <TouchableOpacity style={styles.removeAvatarButton} onPress={removeAvatar}>
                  <Ionicons name="trash-outline" size={16} color="#ef4444" />
                  <Text style={styles.removeAvatarText}>{t('profile.removePicture')}</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Nickname Section */}
            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>{t('profile.nickname')}</Text>
              <TextInput
                style={styles.profileInput}
                value={tempNickname}
                onChangeText={setTempNickname}
                placeholder={t('profile.enterNickname')}
                placeholderTextColor="#888888"
                maxLength={30}
              />
              <Text style={styles.characterCount}>{tempNickname.length}/30</Text>
            </View>

            {/* Bio Section */}
            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>{t('profile.bio')}</Text>
              <TextInput
                style={styles.bioInput}
                value={tempBio}
                onChangeText={setTempBio}
                placeholder={t('profile.tellPeopleAboutYourself')}
                placeholderTextColor="#888888"
                multiline
                maxLength={150}
              />
              <Text style={styles.characterCount}>{tempBio.length}/150</Text>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

// styles in ProfileScreen file
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarLarge: {
    marginBottom: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  handleText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  bioText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingVertical: 24,
    backgroundColor: '#f8f9ff',
    borderRadius: 16,
    marginHorizontal: -10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.12)',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 12,
  },
  editProfileButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    flex: 1,
  },
  editProfileButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  analyticsButton: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flex: 1,
  },
  analyticsButtonText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9ff',
    borderRadius: 16,
    padding: 6,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.12)',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  tabText: {
    fontSize: 15,
    color: '#6b7280',
    fontWeight: '500',
  },
  activeTab: {
    backgroundColor: '#ffffff',
    shadowColor: 'rgba(102, 126, 234, 0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  activeTabText: {
    color: '#1a1a1a',
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  postItem: {
    width: '31.5%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  postThumb: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bioPlaceholder: {
    fontStyle: 'italic',
    color: '#94a3b8',
  },
  editBioContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  editBioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  editBioTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  cancelButton: {
    fontSize: 16,
    color: '#888888',
  },
  saveButton: {
    fontSize: 16,
    color: '#fe2c55',
    fontWeight: '600',
  },
  editBioContent: {
    flex: 1,
    padding: 20,
  },
  bioInput: {
    fontSize: 16,
    color: '#1a1a1a',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  characterCount: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'right',
    marginTop: 8,
  },
  editProfileContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  editProfileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  editProfileTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  editProfileContent: {
    flex: 1,
    padding: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  inputSection: {
    marginBottom: 24,
  },
  profileInput: {
    fontSize: 16,
    color: '#1a1a1a',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  removeAvatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
    gap: 8,
  },
  removeAvatarText: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '500',
  },

});