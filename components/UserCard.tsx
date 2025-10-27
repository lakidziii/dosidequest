import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { FollowButton } from './FollowButton';

interface UserCardProps {
  id: string;
  nickname: string;
  bio?: string;
  avatar_url?: string;
  isFriend?: boolean;
  isFollowing?: boolean;
  onFollowToggle?: () => void;
  rightBadgeText?: string;
  onMessagePress?: () => void;
  onInvitePress?: () => void;
}

export function UserCard({ id, nickname, bio, avatar_url, isFriend, isFollowing, onFollowToggle, rightBadgeText, onMessagePress, onInvitePress }: UserCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        {avatar_url ? (
          <Image source={{ uri: avatar_url }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={24} color="rgba(102, 126, 234, 0.6)" />
          </View>
        )}
        <View style={styles.texts}>
          <Text style={styles.username}>{nickname}</Text>
          {bio ? <Text style={styles.bio}>{bio}</Text> : null}
        </View>
      </View>
      {rightBadgeText ? (
        <View style={styles.iconButtons}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={onMessagePress}
          >
            <Ionicons name="chatbubble" size={20} color="#667eea" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={onInvitePress}
          >
            <Ionicons name="person-add" size={20} color="#667eea" />
          </TouchableOpacity>
        </View>
      ) : (
        onFollowToggle ? (
          <View style={{ width: 140 }}>
            <FollowButton isFollowing={!!isFollowing} isFriend={!!isFriend} onPress={onFollowToggle} />
          </View>
        ) : null
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
  avatarPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(102, 126, 234, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
  texts: {
    gap: 6,
    flex: 1,
  },
  username: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a1a1a',
    letterSpacing: 0.3,
  },
  bio: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    opacity: 1,
  },
  badge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  badgeText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  iconButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});