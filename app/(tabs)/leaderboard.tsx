import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useUserStore } from '../../stores/userStore';
import { useState, useEffect } from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useI18n } from '../../hooks/useI18n';
import { useAuth } from '../../hooks/useAuth';
import { getGlobalLeaderboard, getFriendsLeaderboard, LeaderboardEntry, addPointsToUser } from '../../lib/points';
import { supabase } from '../../lib/supabase';

export default function LeaderboardScreen() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'global' | 'friends'>('global');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Načtení dat leaderboardu
  const loadLeaderboard = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let data: LeaderboardEntry[] = [];
      
      if (activeTab === 'global') {
        const { data: globalData, error: globalError } = await getGlobalLeaderboard(100);
        if (globalError) throw globalError;
        data = globalData || [];
      } else {
        const { data: friendsData, error: friendsError } = await getFriendsLeaderboard(user.id, 100);
        if (friendsError) throw friendsError;
        data = friendsData || [];
      }
      
      setLeaderboardData(data);
    } catch (err) {
      console.error('Error loading leaderboard:', err);
      setError('Nepodařilo se načíst leaderboard');
    } finally {
      setLoading(false);
    }
  };

  // Načtení dat při změně tabu nebo uživatele
  useEffect(() => {
    loadLeaderboard();
  }, [activeTab, user?.id]);

  // Funkce pro změnu tabu
  const handleTabChange = (tab: 'global' | 'friends') => {
    setActiveTab(tab.toLowerCase() as 'global' | 'friends');
  };

  // Testovací funkce pro přidání bodů
  const addTestPoints = async () => {
    if (!user?.id) return;
    
    try {
      const result = await addPointsToUser(user.id, 100, 'Test points');
      if (result.error) {
        console.error('Error adding test points:', result.error);
      } else {
        console.log('Test points added successfully!');
        // Znovu načteme leaderboard
        await loadLeaderboard();
      }
    } catch (error) {
      console.error('Error adding test points:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialIcons name="leaderboard" size={24} color="#1e293b" />
        <Text style={styles.headerTitle}>{t('leaderboard.title')}</Text>
        {/* Test button pro přidání bodů */}
        <TouchableOpacity style={styles.testButton} onPress={addTestPoints}>
          <Text style={styles.testButtonText}>+100 pt</Text>
        </TouchableOpacity>
      </View>
      
      {/* Subtitle */}
      <Text style={styles.subtitle}>{t('leaderboard.earnPointsSubtitle')}</Text>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'global' && styles.activeTab]}
          onPress={() => setActiveTab('global')}
        >
          <Text style={[styles.tabText, activeTab === 'global' && styles.activeTabText]}>{t('leaderboard.global')}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
          onPress={() => setActiveTab('friends')}
        >
          <Text style={[styles.tabText, activeTab === 'Friends' && styles.activeTabText]}>{t('leaderboard.friends')}</Text>
        </TouchableOpacity>
      </View>

      {/* Loading State */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      )}

      {/* Error State */}
      {error && !loading && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadLeaderboard}>
            <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Empty State */}
      {!loading && !error && leaderboardData.length === 0 && (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="leaderboard" size={48} color="#94a3b8" />
          <Text style={styles.emptyText}>
            {activeTab === 'friends' ? t('leaderboard.noFriendsData') : t('leaderboard.noGlobalData')}
          </Text>
          <Text style={styles.emptySubtext}>
            {activeTab === 'friends' 
              ? t('leaderboard.addFriendsHint') 
              : t('leaderboard.beFirstHint')}
          </Text>
        </View>
      )}

      {/* Leaderboard List */}
      {!loading && !error && leaderboardData.length > 0 && (
        <View style={styles.leaderboardContainer}>
          {leaderboardData.map((player, index) => (
            <View key={player.id} style={[
              styles.playerRow,
              player.isUser && styles.currentUserRow
            ]}>
              <Text style={[
                styles.rankText, 
                player.rank <= 3 ? styles.topRankText : null,
                player.isUser && styles.currentUserText
              ]}>
                #{player.rank}
              </Text>
              
              {/* Avatar */}
              <View style={styles.avatarContainer}>
                {player.avatar_url ? (
                  <Image source={{ uri: player.avatar_url }} style={styles.avatar} />
                ) : (
                  <View style={styles.defaultAvatar}>
                    <Ionicons name="person" size={16} color="#64748b" />
                  </View>
                )}
              </View>
              
              <Text style={[
                styles.usernameText,
                player.rank <= 3 ? styles.topUsernameText : null,
                player.isUser && styles.currentUserText
              ]}>
                {player.nickname}
                {player.isUser && ` (${t('leaderboard.you')})`}
              </Text>
              
              <Text style={[
                styles.pointsText,
                player.rank <= 3 ? styles.topPointsText : null,
                player.isUser && styles.currentUserText
              ]}>
                {player.points.toLocaleString()} {t('leaderboard.points')}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginLeft: 12,
    flex: 1,
  },
  testButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  testButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#f1f5f9',
  },
  tabText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#1e293b',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    color: '#1e293b',
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  leaderboardContainer: {
    paddingHorizontal: 20,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  currentUserRow: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    marginVertical: 2,
    paddingHorizontal: 12,
    borderBottomWidth: 0,
  },
  rankText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
    width: 40,
  },
  topRankText: {
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  currentUserText: {
    color: '#0ea5e9',
    fontWeight: '600',
  },
  avatarContainer: {
    marginLeft: 8,
    marginRight: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  defaultAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  usernameText: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  topUsernameText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  pointsText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  topPointsText: {
    color: '#1e293b',
    fontWeight: '600',
  },
});