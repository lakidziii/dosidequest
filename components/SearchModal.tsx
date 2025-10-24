import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { searchProfiles } from '../lib/profiles';
import { UserCard } from './UserCard';

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectUser?: (user: any) => void;
}

export function SearchModal({ visible, onClose, onSelectUser }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

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
    const items = (data || []).map(p => ({ id: p.id, nickname: p.nickname, bio: p.bio }));
    setResults(items);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View className="modalHeader" style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Search Users</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by nickname..."
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
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.userItem} onPress={() => onSelectUser?.(item)}>
              <UserCard id={item.id} nickname={item.nickname} bio={item.bio} rightBadgeText={undefined} />
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              {isSearching ? (
                <Text style={styles.emptyText}>Searching...</Text>
              ) : searchQuery ? (
                <Text style={styles.emptyText}>No users found</Text>
              ) : (
                <Text style={styles.emptyText}>Start typing to search users</Text>
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
    backgroundColor: '#000000',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.bgDim,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    color: theme.colors.textPrimary,
    fontSize: 16,
  },
  resultsList: {
    flex: 1,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: theme.colors.textSecondary,
  },
});