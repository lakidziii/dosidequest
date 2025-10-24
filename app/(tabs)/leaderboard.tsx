import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useUserStore } from '../../stores/userStore';
import { useState, useEffect } from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function LeaderboardScreen() {
  const { nickname } = useUserStore();

  // Mock leaderboard data
  const leaderboardData = [
    { rank: 1, username: 'lakidziii', points: 1249924, isUser: false },
    { rank: 2, username: 'bambi', points: 124555, isUser: false },
    { rank: 3, username: 'skibidi', points: 124332, isUser: false },
    { rank: 4, username: 'skibidi', points: 124332, isUser: false },
    { rank: 4, username: 'skibidi', points: 124332, isUser: false },
    { rank: 4, username: 'skibidi', points: 124332, isUser: false },
    { rank: 4, username: 'skibidi', points: 124332, isUser: false },
    { rank: 4, username: 'skibidi', points: 124332, isUser: false },
    { rank: 4, username: 'skibidi', points: 124332, isUser: false },
    { rank: 4, username: 'skibidi', points: 124332, isUser: false },
    { rank: 4, username: 'skibidi', points: 124332, isUser: false },
    { rank: 4, username: 'skibidi', points: 124332, isUser: false },
    { rank: 4, username: 'skibidi', points: 124332, isUser: false },
    { rank: 4, username: 'skibidi', points: 124332, isUser: false },
    { rank: 4, username: 'skibidi', points: 124332, isUser: false },
    { rank: 4, username: 'skibidi', points: 124332, isUser: false },
    { rank: 4, username: 'skibidi', points: 124332, isUser: false },
    { rank: 4, username: 'skibidi', points: 124332, isUser: false },
    { rank: 4, username: 'skibidi', points: 124332, isUser: false },
    { rank: 4, username: 'skibidi', points: 124332, isUser: false },
    { rank: 4, username: 'skibidi', points: 124332, isUser: false },
    { rank: 4, username: 'skibidi', points: 124332, isUser: false },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialIcons name="leaderboard" size={24} color="#1e293b" />
        <Text style={styles.headerTitle}>Leaderboard</Text>
      </View>
      
      {/* Subtitle */}
      <Text style={styles.subtitle}>earn points by completing sidequests</Text>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Global</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Friends</Text>
        </TouchableOpacity>
      </View>

      {/* Leaderboard List */}
      <View style={styles.leaderboardContainer}>
        {leaderboardData.map((player, index) => (
          <View key={index} style={styles.playerRow}>
            <Text style={[
              styles.rankText, 
              player.rank <= 3 ? styles.topRankText : null
            ]}>
              #{player.rank}
            </Text>
            <Text style={[
              styles.usernameText,
              player.rank <= 3 ? styles.topUsernameText : null
            ]}>
              {player.username}
            </Text>
            <Text style={[
              styles.pointsText,
              player.rank <= 3 ? styles.topPointsText : null
            ]}>
              {player.points.toLocaleString()} pt.
            </Text>
          </View>
        ))}
      </View>
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginLeft: 12,
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
  usernameText: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
    marginLeft: 12,
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