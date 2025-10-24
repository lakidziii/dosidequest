import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

interface FollowButtonProps {
  isFollowing: boolean;
  isFriend: boolean;
  onPress: () => void;
}

export function FollowButton({ isFollowing, isFriend, onPress }: FollowButtonProps) {
  const followingState = isFollowing || isFriend;

  return (
    <TouchableOpacity 
      style={[styles.followButton, followingState && styles.followingButton]}
      onPress={onPress}
    >
      <Text style={[styles.followButtonText, followingState && styles.followingButtonText]}>
        {isFriend ? 'Přátelé' : isFollowing ? 'Sleduji' : 'Sledovat'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  followButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: theme.radius.pill,
    flex: 1,
    alignItems: 'center',
  },
  followButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  followingButton: {
    backgroundColor: theme.colors.bgDim,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  followingButtonText: {
    color: theme.colors.textPrimary,
  },
});