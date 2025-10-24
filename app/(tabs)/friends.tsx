import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import * as SecureStore from 'expo-secure-store';

interface Friend {
  id: string;
  nickname: string;
  bio?: string;
  avatar_url?: string;
}

export default function FriendsScreen() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    console.log('FriendsScreen se načítá...');
    loadUserId();
  }, []);

  useEffect(() => {
    console.log('userId se změnil:', userId);
    if (userId) {
      console.log('Spouštím loadFriends...');
      loadFriends();
    }
  }, [userId]);

  const loadUserId = async () => {
    try {
      console.log('Načítám userId ze Supabase...');
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Načtený user:', user);
      if (user) {
        console.log('Nastavuji userId:', user.id);
        setUserId(user.id);
      } else {
        console.log('Žádný přihlášený uživatel');
        setUserId(null);
      }
    } catch (error) {
      console.error('Error loading user ID:', error);
    }
  };

  const loadFriends = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      console.log('Načítám přátele pro uživatele:', userId);
      
      // Najít všechny uživatele, které sledujeme
      const { data: following, error: followingError } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', userId);

      if (followingError) {
        console.error('Chyba při načítání sledovaných:', followingError);
        throw followingError;
      }

      console.log('Sledované uživatele:', following);

      if (!following || following.length === 0) {
        console.log('Žádní sledovaní uživatelé');
        setFriends([]);
        setLoading(false);
        return;
      }

      const followingIds = following.map(f => f.following_id);
      console.log('IDs sledovaných:', followingIds);

      // Najít uživatele, kteří nás také sledují (vzájemní přátelé)
      const { data: mutualFollows, error: mutualError } = await supabase
        .from('follows')
        .select('follower_id')
        .eq('following_id', userId)
        .in('follower_id', followingIds);

      if (mutualError) {
        console.error('Chyba při načítání vzájemných sledování:', mutualError);
        throw mutualError;
      }

      console.log('Vzájemní sledování:', mutualFollows);

      if (!mutualFollows || mutualFollows.length === 0) {
        console.log('Žádní vzájemní přátelé');
        setFriends([]);
        setLoading(false);
        return;
      }

      const friendIds = mutualFollows.map(f => f.follower_id);
      console.log('IDs přátel:', friendIds);

      // Načíst data přátel z tabulky profiles
      const { data: friendsData, error: friendsError } = await supabase
        .from('profiles')
        .select('id, nickname, bio, avatar_url')
        .in('id', friendIds);

      if (friendsError) {
        console.error('Chyba při načítání dat přátel:', friendsError);
        throw friendsError;
      }

      console.log('Načteno přátel:', friendsData?.length || 0);
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
              <View key={friend.id} style={styles.friendItem}>
                <View style={styles.friendInfo}>
                  {friend.avatar_url ? (
                    <Image source={{ uri: friend.avatar_url }} style={styles.friendAvatar} />
                  ) : (
                    <View style={styles.friendAvatarPlaceholder}>
                      <Ionicons name="person" size={20} color="#64748b" />
                    </View>
                  )}
                  <Text style={styles.friendUsername}>{friend.nickname}</Text>
                </View>
                <View style={styles.friendBadge}>
                  <Text style={styles.friendBadgeText}>Přítel</Text>
                </View>
              </View>
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