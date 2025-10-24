import { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Nastavení chování notifikací
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const requestPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setHasPermission(status === 'granted');
    
    if (status === 'granted') {
      await registerForPushNotifications();
    }
    
    return status === 'granted';
  };

  const registerForPushNotifications = async () => {
    try {
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      setExpoPushToken(token);
      
      // Zde můžete uložit token do Supabase pro budoucí push notifikace
      console.log('Expo Push Token:', token);
      
      return token;
    } catch (error) {
      console.error('Chyba při získávání push tokenu:', error);
      return null;
    }
  };

  const scheduleRandomReminder = async () => {
    if (!hasPermission) {
      console.log('Nemáte povolení pro notifikace');
      return;
    }

    // Náhodný čas mezi 5 minutami a 2 hodinami
    const randomMinutes = Math.floor(Math.random() * 115) + 5; // 5-120 minut
    const seconds = randomMinutes * 60;

    const reminderMessages = [
      'Čas na malý úkol! 💪',
      'Splň něco užitečného teď! ✨',
      'Malý krok k velkému cíli! 🎯',
      'Tvoje budoucnost ti poděkuje! 🚀',
      'Každá minuta se počítá! ⏰',
      'Udělej něco pro sebe! 🌟',
      'Malý úkol, velký dopad! 💎',
      'Čas na produktivitu! 📈'
    ];

    const randomMessage = reminderMessages[Math.floor(Math.random() * reminderMessages.length)];

    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'DoSideQuest Připomínka',
          body: randomMessage,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds },
      });

      console.log(`Notifikace naplánována za ${randomMinutes} minut (ID: ${notificationId})`);
      return notificationId;
    } catch (error) {
      console.error('Chyba při plánování notifikace:', error);
      return null;
    }
  };

  const cancelAllNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  return {
    expoPushToken,
    hasPermission,
    requestPermission,
    scheduleRandomReminder,
    cancelAllNotifications,
    checkPermissionStatus,
  };
}