import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Switch, Alert } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useUserStore } from '../../stores/userStore';
import { useAuth } from '../../hooks/useAuth';
import { useI18n } from '../../hooks/useI18n';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const { clearUser, nickname, user } = useUserStore();
  const { t, currentLanguage, changeLanguage, isLoading, availableLanguages } = useI18n();
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [dataSync, setDataSync] = useState(true);

  // Mapování jazyků s jejich názvy a vlajkami
  const languageOptions = [
    { code: 'cs' as const, name: 'Čeština', flag: '🇨🇿' },
    { code: 'en' as const, name: 'English', flag: '🇺🇸' },
    { code: 'sk' as const, name: 'Slovenčina', flag: '🇸🇰' },
    { code: 'de' as const, name: 'Deutsch', flag: '🇩🇪' }
  ];

  // Funkce pro změnu jazyka
  const handleLanguageChange = async (languageCode: string) => {
    try {
      await changeLanguage(languageCode as any);
      // Zavřít modal po úspěšné změně
      setActiveModal(null);
    } catch (error) {
      console.error('Chyba při změně jazyka:', error);
    }
  };

  const handleShopPress = () => {
    router.push('/shop');
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Odhlásit se',
      'Opravdu se chcete odhlásit?',
      [
        { text: 'Zrušit', style: 'cancel' },
        { 
          text: 'Odhlásit', 
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut();
            clearUser();
          }
        }
      ]
    );
  };

  const handleSettingPress = (settingId: number, title: string) => {
    setActiveModal(title);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Smazat účet',
      'Tato akce je nevratná. Opravdu chcete smazat svůj účet?',
      [
        { text: 'Zrušit', style: 'cancel' },
        { 
          text: 'Smazat', 
          style: 'destructive',
          onPress: () => {
            // TODO: Implementovat mazání účtu
            Alert.alert('Info', 'Funkce bude brzy dostupná');
          }
        }
      ]
    );
  };

  // Mock settings data
  const settingsData = [
    { id: 1, title: t('settings.account'), icon: 'person-outline' },
    { id: 2, title: t('settings.privacy'), icon: 'lock-closed-outline' },
    { id: 3, title: t('settings.notifications'), icon: 'notifications-outline' },
    { id: 4, title: t('settings.helpSupport'), icon: 'help-circle-outline' },
    { id: 5, title: t('settings.about'), icon: 'information-circle-outline' },
    { id: 6, title: t('settings.termsOfService'), icon: 'document-text-outline' },
    { id: 7, title: t('settings.dataStorage'), icon: 'server-outline' },
    { id: 8, title: t('settings.language'), icon: 'language-outline' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="settings" size={24} color="#1e293b" />
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
      </View>
      
      {/* Subtitle */}
      <Text style={styles.subtitle}>{t('settings.subtitle')}</Text>

      {/* Settings List */}
      <View style={styles.settingsContainer}>
        {settingsData.map((setting) => (
          <TouchableOpacity 
            key={setting.id} 
            style={styles.settingRow}
            onPress={() => handleSettingPress(setting.id, setting.title)}
          >
            <Ionicons name={setting.icon as any} size={20} color="#64748b" />
            <Text style={styles.settingText}>{setting.title}</Text>
            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Shop Button */}
      <TouchableOpacity style={styles.shopButton} onPress={handleShopPress}>
        <Ionicons name="storefront-outline" size={20} color="#667eea" />
        <Text style={styles.shopText}>Shop</Text>
      </TouchableOpacity>

      {/* Sign Out Button */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
        <Text style={styles.signOutText}>{t('settings.signOut')}</Text>
      </TouchableOpacity>

      {/* Account Modal */}
      <Modal visible={activeModal === t('settings.account')} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('settings.account')}</Text>
            <TouchableOpacity onPress={closeModal}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.accountSection}>
              <Text style={styles.sectionTitle}>{t('settings.profileInformation')}</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('settings.email')}:</Text>
                <Text style={styles.infoValue}>{user?.email || t('common.notAvailable')}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('settings.nickname')}:</Text>
                <Text style={styles.infoValue}>{nickname || t('common.notAvailable')}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('settings.accountCreated')}:</Text>
                <Text style={styles.infoValue}>
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : t('common.notAvailable')}
                </Text>
              </View>
            </View>

            <View style={styles.accountSection}>
              <Text style={styles.sectionTitle}>{t('settings.accountActions')}</Text>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>{t('settings.changePassword')}</Text>
                <Ionicons name="chevron-forward" size={16} color="#64748b" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>{t('settings.exportData')}</Text>
                <Ionicons name="chevron-forward" size={16} color="#64748b" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.dangerButton]} onPress={handleDeleteAccount}>
                <Text style={[styles.actionButtonText, styles.dangerText]}>{t('settings.deleteAccount')}</Text>
                <Ionicons name="chevron-forward" size={16} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Privacy Modal */}
      <Modal visible={activeModal === t('settings.privacy')} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('settings.privacy')}</Text>
            <TouchableOpacity onPress={closeModal}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.privacySection}>
              <Text style={styles.sectionTitle}>{t('settings.accountPrivacy')}</Text>
              <View style={styles.switchRow}>
                <View style={styles.switchInfo}>
                  <Text style={styles.switchLabel}>{t('settings.privateAccount')}</Text>
                  <Text style={styles.switchDescription}>{t('settings.privateAccountDesc')}</Text>
                </View>
                <Switch
                  value={privateAccount}
                  onValueChange={setPrivateAccount}
                  trackColor={{ false: '#f1f5f9', true: '#3b82f6' }}
                  thumbColor={privateAccount ? '#ffffff' : '#64748b'}
                />
              </View>
            </View>

            <View style={styles.privacySection}>
              <Text style={styles.sectionTitle}>{t('settings.dataCollection')}</Text>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>{t('settings.manageDataCollection')}</Text>
                <Ionicons name="chevron-forward" size={16} color="#64748b" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>{t('settings.cookiePreferences')}</Text>
                <Ionicons name="chevron-forward" size={16} color="#64748b" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>{t('settings.adPersonalization')}</Text>
                <Ionicons name="chevron-forward" size={16} color="#64748b" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Notifications Modal */}
      <Modal visible={activeModal === 'Notifications'} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('settings.notificationSettings')}</Text>
            <TouchableOpacity onPress={closeModal}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.notificationSection}>
              <Text style={styles.sectionTitle}>{t('settings.pushNotifications')}</Text>
              <View style={styles.switchRow}>
                <View style={styles.switchInfo}>
                  <Text style={styles.switchLabel}>{t('settings.enableNotifications')}</Text>
                  <Text style={styles.switchDescription}>{t('settings.enableNotificationsDesc')}</Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: '#f1f5f9', true: '#3b82f6' }}
                  thumbColor={notificationsEnabled ? '#ffffff' : '#64748b'}
                />
              </View>
            </View>

            <View style={styles.notificationSection}>
              <Text style={styles.sectionTitle}>{t('settings.notificationTypes')}</Text>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>{t('settings.likesComments')}</Text>
                <Ionicons name="chevron-forward" size={16} color="#64748b" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>{t('settings.newFollowers')}</Text>
                <Ionicons name="chevron-forward" size={16} color="#64748b" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>{t('settings.questUpdates')}</Text>
                <Ionicons name="chevron-forward" size={16} color="#64748b" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Help & Support Modal */}
      <Modal visible={activeModal === t('settings.helpSupport')} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('settings.helpSupport')}</Text>
            <TouchableOpacity onPress={closeModal}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.helpSection}>
              <Text style={styles.sectionTitle}>{t('settings.getHelp')}</Text>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>{t('settings.faq')}</Text>
                <Ionicons name="chevron-forward" size={16} color="#64748b" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>{t('settings.contactSupport')}</Text>
                <Ionicons name="chevron-forward" size={16} color="#64748b" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>{t('settings.reportBug')}</Text>
                <Ionicons name="chevron-forward" size={16} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View style={styles.helpSection}>
              <Text style={styles.sectionTitle}>{t('settings.community')}</Text>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>{t('settings.communityGuidelines')}</Text>
                <Ionicons name="chevron-forward" size={16} color="#64748b" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>{t('settings.reportContent')}</Text>
                <Ionicons name="chevron-forward" size={16} color="#64748b" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* About Modal */}
      <Modal visible={activeModal === t('settings.about')} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('settings.aboutApp')}</Text>
            <TouchableOpacity onPress={closeModal}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.aboutSection}>
              <Text style={styles.appName}>DoSideQuest</Text>
              <Text style={styles.appVersion}>{t('settings.version')}</Text>
              <Text style={styles.appDescription}>
                {t('settings.appDescription')}
              </Text>
            </View>

            <View style={styles.aboutSection}>
              <Text style={styles.sectionTitle}>{t('settings.legal')}</Text>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>{t('settings.termsOfService')}</Text>
                <Ionicons name="chevron-forward" size={16} color="#64748b" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>{t('settings.privacyPolicy')}</Text>
                <Ionicons name="chevron-forward" size={16} color="#64748b" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>{t('settings.openSourceLicenses')}</Text>
                <Ionicons name="chevron-forward" size={16} color="#64748b" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Data & Storage Modal */}
      <Modal visible={activeModal === t('settings.dataStorage')} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('settings.dataStorage')}</Text>
            <TouchableOpacity onPress={closeModal}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.dataSection}>
              <Text style={styles.sectionTitle}>{t('settings.storageUsage')}</Text>
              <View style={styles.storageInfo}>
                <Text style={styles.storageLabel}>{t('settings.cacheSize')}:</Text>
                <Text style={styles.storageValue}>24.5 MB</Text>
              </View>
              <View style={styles.storageInfo}>
                <Text style={styles.storageLabel}>{t('settings.mediaStorage')}:</Text>
                <Text style={styles.storageValue}>156.2 MB</Text>
              </View>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>{t('settings.clearCache')}</Text>
                <Ionicons name="chevron-forward" size={16} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View style={styles.dataSection}>
              <Text style={styles.sectionTitle}>{t('settings.dataSync')}</Text>
              <View style={styles.switchRow}>
                <View style={styles.switchInfo}>
                  <Text style={styles.switchLabel}>{t('settings.autoSync')}</Text>
                  <Text style={styles.switchDescription}>{t('settings.autoSyncDesc')}</Text>
                </View>
                <Switch
                  value={dataSync}
                  onValueChange={setDataSync}
                  trackColor={{ false: '#f1f5f9', true: '#3b82f6' }}
                  thumbColor={dataSync ? '#ffffff' : '#64748b'}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Language Modal */}
      <Modal visible={activeModal === t('settings.language')} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('settings.languageSettings')}</Text>
            <TouchableOpacity onPress={closeModal}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.languageSection}>
              <Text style={styles.sectionTitle}>{t('settings.selectLanguage')}</Text>
              {languageOptions.map((language) => (
                <TouchableOpacity 
                  key={language.code}
                  style={[
                    styles.languageOption,
                    currentLanguage === language.code && styles.selectedLanguageOption
                  ]}
                  onPress={() => handleLanguageChange(language.code)}
                  disabled={isLoading}
                >
                  <Text style={styles.languageFlag}>{language.flag}</Text>
                  <Text style={[
                    styles.languageText,
                    currentLanguage === language.code && styles.selectedLanguageText
                  ]}>{language.name}</Text>
                  {currentLanguage === language.code && (
                    <Ionicons name="checkmark" size={20} color="#3b82f6" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>
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
    fontWeight: '500',
  },
  shopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#667eea',
    gap: 8,
    marginBottom: 16,
  },
  shopText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  accountSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  privacySection: {
    marginTop: 20,
    marginBottom: 30,
  },
  notificationSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  helpSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  aboutSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  dataSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  languageSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoLabel: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '400',
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 10,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  dangerButton: {
    backgroundColor: '#fef2f2',
  },
  dangerText: {
    color: '#ef4444',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 10,
  },
  switchInfo: {
    flex: 1,
    marginRight: 15,
  },
  switchLabel: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  appDescription: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  storageInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  storageLabel: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  storageValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 10,
  },
  languageText: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
    flex: 1,
  },
  languageFlag: {
    fontSize: 20,
    marginRight: 12,
  },
  selectedLanguageOption: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
    borderWidth: 1,
  },
  selectedLanguageText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
});