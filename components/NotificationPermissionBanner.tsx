import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import { useNotifications } from '../hooks/useNotifications';

interface NotificationPermissionBannerProps {
  onPermissionGranted?: () => void;
}

export default function NotificationPermissionBanner({ 
  onPermissionGranted 
}: NotificationPermissionBannerProps) {
  const { hasPermission, requestPermission, checkPermissionStatus } = useNotifications();

  // Pokud jsou notifikace povoleny, nezobrazuj banner
  if (hasPermission) {
    return null;
  }

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    
    if (granted) {
      onPermissionGranted?.();
    } else if (!granted) {
      // Pokud uživatel zakázal notifikace natrvalo, nasměruj ho do nastavení
      Alert.alert(
        'Notifikace jsou zakázány',
        'Pro správné fungování aplikace je potřeba povolit notifikace. Přejděte do nastavení a povolte je ručně.',
        [
          { text: 'Zrušit', style: 'cancel' },
          { 
            text: 'Otevřít nastavení', 
            onPress: () => Linking.openSettings() 
          },
        ]
      );
    }
  };

  return (
    <View style={styles.banner}>
      <View style={styles.content}>
        <Text style={styles.icon}>🔔</Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Povolte notifikace</Text>
          <Text style={styles.message}>
            Bez notifikací nebude aplikace fungovat správně. Povolte je pro lepší zážitek.
          </Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleRequestPermission}
      >
        <Text style={styles.buttonText}>
          Povolit
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FFF3CD',
    borderColor: '#FFEAA7',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});