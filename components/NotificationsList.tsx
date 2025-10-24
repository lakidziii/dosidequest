import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { Notification } from '../types/db';

interface NotificationsListProps {
  notifications: Notification[];
  onOpenUser: (userId: string) => void;
  onMarkRead: (notificationId: string) => void;
}

export function NotificationsList({ notifications, onOpenUser, onMarkRead }: NotificationsListProps) {
  return (
    <FlatList
      data={notifications}
      keyExtractor={(item) => item.id}
      style={styles.list}
      renderItem={({ item }) => (
        <TouchableOpacity 
          style={[styles.notificationItem, !item.read && styles.unreadItem]}
          onPress={() => onOpenUser(item.from_user_id)}
        >
          <View style={styles.notificationIcon}>
            <Ionicons name="person-add" size={24} color={theme.colors.textPrimary} />
          </View>
          <View style={styles.notificationText}>
            <Text style={styles.notificationMessage}>
              <Text style={styles.notificationUsername}>{item.from_user_nickname}</Text>
              {' vás začal sledovat'}
            </Text>
            <Text style={styles.notificationTime}>
              {new Date(item.created_at).toLocaleDateString('cs-CZ', {
                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
              })}
            </Text>
          </View>
          <TouchableOpacity onPress={() => onMarkRead(item.id)}>
            <Ionicons name={item.read ? 'checkmark-circle-outline' : 'ellipse-outline'} size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          {!item.read && <View style={styles.unreadDot} />}
        </TouchableOpacity>
      )}
      ListEmptyComponent={() => (
        <View style={styles.emptyNotifications}>
          <Ionicons name="notifications-outline" size={40} color={theme.colors.textSecondary} />
          <Text style={styles.emptyNotificationsText}>Žádné notifikace</Text>
          <Text style={styles.emptyNotificationsSubtext}>Začneme tě informovat, jakmile se něco stane.</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  unreadItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  notificationIcon: {
    marginRight: 12,
  },
  notificationText: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  notificationUsername: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  notificationTime: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginLeft: 8,
  },
  emptyNotifications: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyNotificationsText: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyNotificationsSubtext: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});