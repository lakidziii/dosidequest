import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../../stores/userStore';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function ProfileScreen() {
  const { user, nickname, bio, setUser, setNickname, setBio } = useUserStore();
  const [activeTab, setActiveTab] = useState<'Posts' | 'Liked'>('Posts');
  const [editBioModalVisible, setEditBioModalVisible] = useState(false);
  const [tempBio, setTempBio] = useState('');
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
        
        // Načtení bio z profiles tabulky
        const { data: profile } = await supabase
          .from('profiles')
          .select('bio')
          .eq('id', user.id)
          .single();
        
        if (profile?.bio) {
          setBio(profile.bio);
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

  const openEditBio = () => {
    setTempBio(bio || '');
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="person-circle" size={24} color="#1e293b" />
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Profile header (TikTok-like) */}
      <View style={styles.profileHeader}>
        <Ionicons name="person-circle" size={80} color="#64748b" style={styles.avatarLarge} />
        <Text style={styles.profileName}>{nickname || 'User'}</Text>
        <Text style={styles.handleText}>@{handle}</Text>
        {/* Bio */}
        <TouchableOpacity onPress={openEditBio}>
          <Text style={[styles.bioText, !bio && styles.bioPlaceholder]}>
            {bio || 'Add a bio to tell people about yourself'}
          </Text>
        </TouchableOpacity>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.following}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.followers}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={18} color="#ffffff" />
            <Text style={styles.editButtonText}>Edit profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-outline" size={18} color="#1e293b" />
            <Text style={styles.shareButtonText}>Share profile</Text>
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
            color={activeTab === 'Posts' ? '#1e293b' : '#64748b'}
          />
          <Text style={[styles.tabText, activeTab === 'Posts' && styles.activeTabText]}>Posts</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'Liked' && styles.activeTab]}
          onPress={() => setActiveTab('Liked')}
        >
          <Ionicons
            name={activeTab === 'Liked' ? 'heart' : 'heart-outline'}
            size={20}
            color={activeTab === 'Liked' ? '#1e293b' : '#64748b'}
          />
          <Text style={[styles.tabText, activeTab === 'Liked' && styles.activeTabText]}>Liked</Text>
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
    </ScrollView>
  );
}

// styles in ProfileScreen file
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginLeft: 12,
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
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 14,
    marginBottom: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#667eea',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  shareButtonText: {
    color: '#1e293b',
    fontSize: 14,
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 4,
    marginTop: 16,
    marginBottom: 12,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  tabText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  activeTab: {
    backgroundColor: '#f1f5f9',
  },
  activeTabText: {
    color: '#1e293b',
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
    color: '#ffffff',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 15,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#333333',
  },
  characterCount: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'right',
    marginTop: 8,
  },

});