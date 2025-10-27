import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

interface FollowButtonProps {
  isFollowing: boolean;
  isFriend: boolean;
  isFollowingMe?: boolean;
  onPress: () => void;
}

export function FollowButton({ isFollowing, isFriend, isFollowingMe = false, onPress }: FollowButtonProps) {
  const followingState = isFollowing || isFriend;

  const getButtonText = () => {
    if (isFriend) return 'Přátelé';
    if (isFollowing) return 'Sleduji';
    if (isFollowingMe && !isFollowing) return 'Také Sledovat';
    return 'Sledovat';
  };

  return (
    <TouchableOpacity 
      style={[styles.followButton, followingState && styles.followingButton]}
      onPress={onPress}
    >
      <Text style={[styles.followButtonText, followingState && styles.followingButtonText]}>
        {getButtonText()}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  followButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
    flex: 1,
    alignItems: 'center',
    // Removing shadow to fix the square border issue
  },
  followButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  followingButton: {
    backgroundColor: '#f8f9ff',
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
  followingButtonText: {
    color: '#667eea',
  },
});