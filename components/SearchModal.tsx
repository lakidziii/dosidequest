import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, FlatList, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { searchProfiles } from '../lib/profiles';
import { UserCard } from './UserCard';
import { useUserStore } from '../stores/userStore';
import { useI18n } from '../hooks/useI18n';

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectUser?: (user: any) => void;
}

export function SearchModal({ visible, onClose, onSelectUser }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { user: currentUser } = useUserStore();
  const { t } = useI18n();

  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    const { data, error } = await searchProfiles(text);
    setIsSearching(false);
    if (error) return;
    const items = (data || []).map(p => ({ id: p.id, nickname: p.nickname, bio: p.bio, avatar_url: p.avatar_url }));
    setResults(items);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.modalContainer}>
        <View className="modalHeader" style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{t('search.users')}</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="rgba(102, 126, 234, 0.6)" />
          <TextInput
            style={styles.searchInput}
            placeholder={t('search.byNickname')}
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
          />
        </View>

        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          style={styles.resultsList}
          renderItem={({ item }) => {
            const isOwnProfile = currentUser?.id === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.userItem}
                disabled={isOwnProfile}
                onPress={() => !isOwnProfile && onSelectUser?.(item)}
              >
                <View style={styles.userCardContainer}>
                  <UserCard 
                    id={item.id} 
                    nickname={item.nickname} 
                    bio={item.bio} 
                    avatar_url={item.avatar_url}
                    rightBadgeText={isOwnProfile ? "You" : undefined} 
                  />
                </View>
                {!isOwnProfile && (
                  <View style={styles.chevronContainer}>
                    <Ionicons name="chevron-forward" size={24} color="#1a1a1a" />
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              {isSearching ? (
                <Text style={styles.emptyText}>Searching...</Text>
              ) : searchQuery ? (
                <Text style={styles.emptyText}>No users found</Text>
              ) : (
                <Text style={styles.emptyText}>{t('search.startTyping')}</Text>
              )}
            </View>
          )}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 24,
    backgroundColor: '#ffffff',
  },
  modalTitle: {
    color: '#1a1a1a',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginHorizontal: 24,
    marginTop: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: 'rgba(102, 126, 234, 0.15)',
    shadowColor: 'rgba(102, 126, 234, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '500',
  },
  resultsList: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },
  userItem: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.12)',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: 'rgba(102, 126, 234, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  userCardContainer: {
    flex: 1,
  },
  userItemDisabled: {
    opacity: 0.6,
    backgroundColor: '#f8f9ff',
  },
  chevronContainer: {
    paddingRight: 20,
    paddingLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
    height: '100%',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
    backgroundColor: '#ffffff',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});