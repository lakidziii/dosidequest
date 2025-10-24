import { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { supabase } from '../lib/supabase';
import { useUserStore } from '../stores/userStore';
import { useNotifications } from '../hooks/useNotifications';
import NotificationPermissionBanner from '../components/NotificationPermissionBanner';

export default function HomeScreen() {
  const { user, nickname, setUser, setNickname, clearUser } = useUserStore();
  const { 
    hasPermission, 
    requestPermission, 
    scheduleRandomReminder,
    expoPushToken 
  } = useNotifications();

  useEffect(() => {
    // Získej user data z Supabase a ulož do Zustand store
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        if (user.user_metadata?.nickname) {
          setNickname(user.user_metadata.nickname);
        }
      }
    };
    
    getUserData();
  }, [setUser, setNickname]);

  // Automaticky požádej o povolení notifikací při načtení home screen
  useEffect(() => {
    const requestNotificationPermission = async () => {
      if (hasPermission === null) {
        // Počkej chvilku než se zobrazí home screen
        setTimeout(async () => {
          await requestPermission();
        }, 1000);
      }
    };

    requestNotificationPermission();
  }, [hasPermission, requestPermission]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    clearUser(); // Vyčisti Zustand store
    // Po odhlášení se automaticky přesměruje na auth screen díky RootLayout
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <NotificationPermissionBanner />
      
      <Text style={styles.title}>Vítejte doma!</Text>
      <Text style={styles.subtitle}>
        {nickname ? `Ahoj, ${nickname}!` : 'Vítejte v aplikaci!'}
      </Text>
      
      <View style={styles.content}>
        <Text style={styles.welcomeText}>
          Úspěšně jste se přihlásili do DoSideQuest aplikace.
        </Text>
        
        {user && (
          <Text style={styles.userInfo}>
            Email: {user.email}
          </Text>
        )}

        {hasPermission && (
          <TouchableOpacity 
            style={[styles.button, styles.reminderButton]} 
            onPress={scheduleRandomReminder}
          >
            <Text style={styles.buttonText}>Naplánovat připomínku</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Odhlásit se</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  welcomeText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  userInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
    marginBottom: 10,
  },
  reminderButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});