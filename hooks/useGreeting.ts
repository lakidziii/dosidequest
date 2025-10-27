import { useI18n } from './useI18n';
import { useUserStore } from '../stores/userStore';

export const useGreeting = () => {
  const { t } = useI18n();
  const { nickname } = useUserStore();

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    const userName = nickname || 'User';
    
    if (currentHour >= 5 && currentHour < 12) {
      // Ráno: 5:00 - 11:59
      return `${t('home.goodMorning')}, ${userName}`;
    } else if (currentHour >= 12 && currentHour < 18) {
      // Odpoledne: 12:00 - 17:59
      return `${t('home.goodAfternoon')}, ${userName}`;
    } else {
      // Večer: 18:00 - 4:59
      return `${t('home.goodEvening')}, ${userName}`;
    }
  };

  return {
    greeting: getGreeting(),
  };
};