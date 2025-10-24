import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useUserStore } from '../../stores/userStore';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const { clearUser, nickname, user } = useUserStore();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    clearUser();
  };

  // Mock settings data
  const settingsData = [
    { id: 1, title: 'Account', icon: 'person-outline' },
    { id: 2, title: 'Privacy', icon: 'lock-closed-outline' },
    { id: 3, title: 'Notifications', icon: 'notifications-outline' },
    { id: 4, title: 'Help & Support', icon: 'help-circle-outline' },
    { id: 5, title: 'About', icon: 'information-circle-outline' },
    { id: 6, title: 'Terms of Service', icon: 'document-text-outline' },
    { id: 7, title: 'Data & Storage', icon: 'server-outline' },
    { id: 8, title: 'Language', icon: 'language-outline' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="settings" size={24} color="#1e293b" />
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      
      {/* Subtitle */}
      <Text style={styles.subtitle}>manage your account and preferences</Text>

      {/* Settings List */}
      <View style={styles.settingsContainer}>
        {settingsData.map((setting) => (
          <TouchableOpacity key={setting.id} style={styles.settingRow}>
            <Ionicons name={setting.icon as any} size={20} color="#64748b" />
            <Text style={styles.settingText}>{setting.title}</Text>
            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={20} color="#ef4444" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 32,
    fontWeight: '400',
  },
  settingsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 12,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ef4444',
    gap: 8,
  },
  signOutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
});