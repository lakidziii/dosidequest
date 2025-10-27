import { useState, useEffect } from 'react';
import { i18n, Language } from '../lib/i18n';

export function useI18n() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(i18n.getLanguage());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = i18n.subscribe((newLanguage) => {
      setCurrentLanguage(newLanguage);
    });

    return unsubscribe;
  }, []);

  const changeLanguage = async (newLanguage: Language) => {
    setIsLoading(true);
    try {
      await i18n.setLanguage(newLanguage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentLanguage,
    t: i18n.t.bind(i18n),
    changeLanguage,
    isLoading,
    availableLanguages: i18n.getAvailableLanguages(),
  };
}