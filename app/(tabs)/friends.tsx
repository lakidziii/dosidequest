import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import * as SecureStore from 'expo-secure-store';
import { theme } from '../../styles/theme';
import { UserCard } from '../../components/UserCard';
import { getUserStats as fetchUserStats, fetchProfileById } from '../../lib/profiles';
import { useFollow } from '../../hooks/useFollow';

interface Friend {
  id: string;
  nickname: string;
  bio?: string;
  avatar_url?: string;
}

export default function FriendsScreen() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUserId, followingUsers, friendUsers, toggleFollow } = useFollow();

  useEffect(() => {
    if (currentUserId) {
      loadFriends(currentUserId);
    }
  }, [currentUserId, followingUsers, friendUsers]);

  const loadFriends = async (userId: string) => {
    try {
      setLoading(true);
      const { data: following, error: followingError } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', userId);
      if (followingError) throw followingError;
      if (!following || following.length === 0) {
        setFriends([]);
        setLoading(false);
        return;
      }
      const followingIds = following.map(f => f.following_id);
      const { data: mutualFollows, error: mutualError } = await supabase
        .from('follows')
        .select('follower_id')
        .eq('following_id', userId)
        .in('follower_id', followingIds);
      if (mutualError) throw mutualError;
      const friendIds = mutualFollows.map(f => f.follower_id);
      const { data: friendsData, error: friendsError } = await supabase
        .from('profiles')
        .select('id, nickname, bio, avatar_url')
        .in('id', friendIds);
      if (friendsError) throw friendsError;
      setFriends(friendsData || []);
    } catch (error) {
      console.error('Error loading friends:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="people" size={24} color="#1e293b" />
        <Text style={styles.headerTitle}>Přátelé</Text>
      </View>

      {/* Friends Section */}
      <View style={styles.friendsSection}>
        {loading ? (
          <Text style={styles.loadingText}>Načítání přátel...</Text>
        ) : friends.length === 0 ? (
          <>
            <Text style={styles.noFriendsText}>Zatím žádní přátelé...</Text>
            <Text style={styles.noFriendsSubtext}>
              Přátelé se zobrazí automaticky, když se budete vzájemně sledovat s někým.
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.friendsCount}>Přátelé ({friends.length})</Text>
            {friends.map((friend) => (
              <UserCard
                key={friend.id}
                id={friend.id}
                nickname={friend.nickname}
                bio={friend.bio}
                avatar_url={friend.avatar_url}
                isFriend={true}
                isFollowing={true}
                rightBadgeText="Přítel"
              />
            ))}
          </>
        )}
      </View>

      {/* Party Section */}
      <View style={styles.partySection}>
        <View style={styles.partyHeader}>
          <Ionicons name="people-circle" size={24} color="#1e293b" />
          <Text style={styles.partyTitle}>Party (0/4)</Text>
        </View>
        <Text style={styles.partySubtitle}>Invite someone or join party</Text>
        
        <View style={styles.partyButtons}>
          <TouchableOpacity style={styles.inviteButton}>
            <Text style={styles.inviteButtonText}>Invite</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.joinButton}>
            <Text style={styles.joinButtonText}>Join party</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

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
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginLeft: 12,
  },
  friendsSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  noFriendsText: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 8,
    textAlign: 'center',
  },
  noFriendsSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
  friendsCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  friendAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  friendUsername: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  friendBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  friendBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  partySection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
  },
  partyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  partyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginLeft: 12,
  },
  partySubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
  },
  partyButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  inviteButton: {
    flex: 1,
    backgroundColor: '#667eea',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  inviteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  joinButton: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#1e293b',
    fontSize: 14,
    fontWeight: '600',
  },
});