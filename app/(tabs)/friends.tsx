import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import * as SecureStore from 'expo-secure-store';
import { theme } from '../../styles/theme';
import { UserCard } from '../../components/UserCard';
import { getUserStats as fetchUserStats, fetchProfileById } from '../../lib/profiles';
import { useFollow } from '../../hooks/useFollow';
import { useI18n } from '../../hooks/useI18n';

interface Friend {
  id: string;
  nickname: string;
  bio?: string;
  avatar_url?: string;
}

export default function FriendsScreen() {
  const { t } = useI18n();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllFriends, setShowAllFriends] = useState(false);
  const lastRefreshTime = useRef<number>(0);
  const { currentUserId, followingUsers, friendUsers, toggleFollow, loadFollowingStatus } = useFollow();

  useEffect(() => {
    if (currentUserId) {
      loadFriends(currentUserId);
    }
  }, [currentUserId, followingUsers, friendUsers]);

  useEffect(() => {
    // Filtrování přátel podle vyhledávání
    if (searchQuery.trim() === '') {
      setFilteredFriends(friends);
    } else {
      const filtered = friends.filter(friend =>
        friend.nickname.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFriends(filtered);
    }
  }, [friends, searchQuery]);

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
      setFilteredFriends(friendsData || []);
    } catch (error) {
      console.error('Error loading friends:', error);
      setFriends([]);
      setFilteredFriends([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    const now = Date.now();
    const timeSinceLastRefresh = now - lastRefreshTime.current;
    
    // Debounce - povolit refresh pouze každých 5 sekund
    if (timeSinceLastRefresh < 5000) {
      return;
    }
    
    setRefreshing(true);
    lastRefreshTime.current = now;
    
    try {
      // Nejdříve aktualizuj stav sledování z useFollow hooku
      await loadFollowingStatus();
      // Pak znovu načti přátele
      if (currentUserId) {
        await loadFriends(currentUserId);
      }
    } catch (error) {
      console.error('Error refreshing friends:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="people" size={24} color="#1e293b" />
        <Text style={styles.headerTitle}>{t('friends.title')}</Text>
      </View>

      {/* Party Section - Always Visible */}
      <View style={styles.partySection}>
        <View style={styles.partyHeader}>
          <Ionicons name="people-circle" size={24} color="#1e293b" />
          <Text style={styles.partyTitle}>{t('friends.party')} (0/4)</Text>
        </View>
        <Text style={styles.partySubtitle}>{t('friends.partySubtitle')}</Text>
        
        <View style={styles.partyButtons}>
          <TouchableOpacity style={styles.inviteButton}>
            <Text style={styles.inviteButtonText}>{t('friends.invite')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.joinButton}>
            <Text style={styles.joinButtonText}>{t('friends.joinParty')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Friends Section */}
      <View style={styles.friendsHeader}>
        <Text style={styles.friendsTitle}>{t('friends.friendsCount')} ({friends.length})</Text>
        <View style={styles.friendsHeaderButtons}>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={handleRefresh}
            disabled={refreshing}
          >
            <Ionicons 
              name="refresh" 
              size={18} 
              color={refreshing ? "#94a3b8" : "#667eea"} 
            />
          </TouchableOpacity>
          {friends.length > 5 && (
            <TouchableOpacity 
              style={styles.toggleButton}
              onPress={() => setShowAllFriends(!showAllFriends)}
            >
              <Text style={styles.toggleButtonText}>
                {showAllFriends ? t('friends.showLess') : t('friends.showAll')}
              </Text>
              <Ionicons 
                name={showAllFriends ? "chevron-up" : "chevron-down"} 
                size={16} 
                color="#667eea" 
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Bar - Only show when there are friends */}
      {friends.length > 0 && (
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('friends.searchPlaceholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Scrollable Friends List */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.friendsSection}>
          {loading ? (
            <Text style={styles.loadingText}>{t('friends.loading')}</Text>
          ) : friends.length === 0 ? (
            <>
              <Text style={styles.noFriendsText}>{t('friends.noFriends')}</Text>
              <Text style={styles.noFriendsSubtext}>
                {t('friends.noFriendsSubtext')}
              </Text>
            </>
          ) : filteredFriends.length === 0 ? (
            <Text style={styles.noResultsText}>{t('friends.noResults')} "{searchQuery}"</Text>
          ) : (
            <>
              {(showAllFriends ? filteredFriends : filteredFriends.slice(0, 5)).map((friend) => (
                <UserCard
                  key={friend.id}
                  id={friend.id}
                  nickname={friend.nickname}
                  bio={friend.bio}
                  avatar_url={friend.avatar_url}
                  isFriend={true}
                  isFollowing={true}
                  rightBadgeText={t('friends.friendBadge')}
                  onMessagePress={() => {
                    // TODO: Implementovat zprávy
                    console.log('Zpráva pro:', friend.nickname);
                  }}
                  onInvitePress={() => {
                    // TODO: Implementovat pozvánky
                    console.log('Pozvánka pro:', friend.nickname);
                  }}
                />
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 4,
    marginTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginLeft: 12,
  },
  refreshButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
  },
  partySection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
    marginBottom: 16,
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
  friendsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  friendsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  friendsHeaderButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  toggleButtonText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '500',
    marginRight: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  clearButton: {
    padding: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  friendsSection: {
    paddingBottom: 20,
  },
  loadingText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 16,
    marginTop: 40,
  },
  noFriendsText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 40,
    marginBottom: 8,
  },
  noFriendsSubtext: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  noResultsText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 16,
    marginTop: 20,
    fontStyle: 'italic',
  },
});