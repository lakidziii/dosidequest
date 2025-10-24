import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
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
}

export function UserCard({ id, nickname, bio, avatar_url, isFriend, isFollowing, onFollowToggle, rightBadgeText }: UserCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        {avatar_url ? (
          <Image source={{ uri: avatar_url }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={20} color={theme.colors.textSecondary} />
          </View>
        )}
        <View style={styles.texts}>
          <Text style={styles.username}>{nickname}</Text>
          {bio ? <Text style={styles.bio}>{bio}</Text> : null}
        </View>
      </View>
      {rightBadgeText ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{rightBadgeText}</Text>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  texts: {
    gap: 2,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  bio: {
    fontSize: 12,
    color: '#64748b',
  },
  badge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});