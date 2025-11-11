/**
 * App Settings Screen - Application preferences and settings
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Globe,
  Bell,
  Moon,
  Smartphone,
  Mail,
  MessageSquare,
  Volume2,
  Vibrate,
  ChevronRight,
  Calendar,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';

export default function AppSettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language, setLanguage } = useApp();

  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [sessionReminders, setSessionReminders] = useState(true);
  const [paymentReminders, setPaymentReminders] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const texts = {
    tr: {
      title: 'Uygulama Ayarları',
      language: 'Dil',
      languageDesc: 'Uygulama dilini seçin',
      turkish: 'Türkçe',
      english: 'English',
      notifications: 'Bildirimler',
      pushNotifications: 'Push Bildirimleri',
      pushDesc: 'Anlık bildirimler alın',
      emailNotifications: 'E-posta Bildirimleri',
      emailDesc: 'E-posta ile bildirimler',
      smsNotifications: 'SMS Bildirimleri',
      smsDesc: 'SMS ile bildirimler',
      preferences: 'Tercihler',
      sessionReminders: 'Seans Hatırlatıcıları',
      sessionDesc: 'Seans öncesi hatırlatma',
      paymentReminders: 'Ödeme Hatırlatıcıları',
      paymentDesc: 'Ödeme vadesi hatırlatması',
      appearance: 'Görünüm',
      darkMode: 'Karanlık Mod',
      darkModeDesc: 'Koyu tema kullan',
      sound: 'Ses',
      soundDesc: 'Bildirim sesleri',
      vibration: 'Titreşim',
      vibrationDesc: 'Bildirim titreşimleri',
      success: 'Başarılı',
      languageChanged: 'Dil ayarı değiştirildi',
    },
    en: {
      title: 'App Settings',
      language: 'Language',
      languageDesc: 'Select app language',
      turkish: 'Türkçe',
      english: 'English',
      notifications: 'Notifications',
      pushNotifications: 'Push Notifications',
      pushDesc: 'Receive push notifications',
      emailNotifications: 'Email Notifications',
      emailDesc: 'Email notifications',
      smsNotifications: 'SMS Notifications',
      smsDesc: 'SMS notifications',
      preferences: 'Preferences',
      sessionReminders: 'Session Reminders',
      sessionDesc: 'Pre-session reminders',
      paymentReminders: 'Payment Reminders',
      paymentDesc: 'Payment due reminders',
      appearance: 'Appearance',
      darkMode: 'Dark Mode',
      darkModeDesc: 'Use dark theme',
      sound: 'Sound',
      soundDesc: 'Notification sounds',
      vibration: 'Vibration',
      vibrationDesc: 'Notification vibrations',
      success: 'Success',
      languageChanged: 'Language setting changed',
    },
  };

  const t = texts[language];

  const handleLanguageChange = (newLanguage: 'tr' | 'en') => {
    setLanguage(newLanguage);
    Alert.alert(t.success, t.languageChanged);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.backgroundLight]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>{t.title}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
        >
          {/* Language */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.language}</Text>
            <Text style={styles.sectionSubtitle}>{t.languageDesc}</Text>

            <TouchableOpacity
              style={[
                styles.languageCard,
                language === 'tr' && styles.languageCardActive,
              ]}
              onPress={() => handleLanguageChange('tr')}
            >
              <View style={styles.languageInfo}>
                <Globe size={24} color={language === 'tr' ? Colors.primary : Colors.textSecondary} />
                <Text style={styles.languageText}>{t.turkish}</Text>
              </View>
              {language === 'tr' && (
                <View style={styles.languageCheck}>
                  <ChevronRight size={20} color={Colors.primary} />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageCard,
                language === 'en' && styles.languageCardActive,
              ]}
              onPress={() => handleLanguageChange('en')}
            >
              <View style={styles.languageInfo}>
                <Globe size={24} color={language === 'en' ? Colors.primary : Colors.textSecondary} />
                <Text style={styles.languageText}>{t.english}</Text>
              </View>
              {language === 'en' && (
                <View style={styles.languageCheck}>
                  <ChevronRight size={20} color={Colors.primary} />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Notifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.notifications}</Text>

            {/* Notification Settings Link */}
            <TouchableOpacity
              style={styles.manageCard}
              onPress={() => router.push('/notification-settings' as any)}
              activeOpacity={0.7}
            >
              <View style={styles.manageIcon}>
                <Bell size={24} color={Colors.primary} />
              </View>
              <View style={styles.manageInfo}>
                <Text style={styles.manageTitle}>
                  {language === 'tr'
                    ? 'Bildirim Ayarlarını Yönet'
                    : 'Manage Notification Settings'}
                </Text>
                <Text style={styles.manageDesc}>
                  {language === 'tr'
                    ? 'İzinler, hatırlatmalar ve zamanlanmış bildirimler'
                    : 'Permissions, reminders and scheduled notifications'}
                </Text>
              </View>
              <ChevronRight size={24} color={Colors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Smartphone size={20} color={Colors.primary} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t.pushNotifications}</Text>
                <Text style={styles.settingDesc}>{t.pushDesc}</Text>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: Colors.surfaceLight, true: Colors.primaryLight }}
                thumbColor={pushNotifications ? Colors.primary : Colors.textTertiary}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Mail size={20} color={Colors.info} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t.emailNotifications}</Text>
                <Text style={styles.settingDesc}>{t.emailDesc}</Text>
              </View>
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                trackColor={{ false: Colors.surfaceLight, true: Colors.primaryLight }}
                thumbColor={emailNotifications ? Colors.primary : Colors.textTertiary}
              />
            </View>

            {/* SMS Settings Link */}
            <TouchableOpacity
              style={styles.smsManageCard}
              onPress={() => router.push('/sms-settings' as any)}
              activeOpacity={0.7}
            >
              <View style={styles.smsManageIcon}>
                <MessageSquare size={24} color={Colors.warning} />
              </View>
              <View style={styles.manageInfo}>
                <Text style={styles.smsManageTitle}>
                  {language === 'tr'
                    ? 'SMS Ayarlarını Yönet'
                    : 'Manage SMS Settings'}
                </Text>
                <Text style={styles.smsManageDesc}>
                  {language === 'tr'
                    ? 'SMS sağlayıcı, şablonlar ve geçmiş'
                    : 'SMS provider, templates and history'}
                </Text>
              </View>
              <ChevronRight size={24} color={Colors.background} />
            </TouchableOpacity>

            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <MessageSquare size={20} color={Colors.warning} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t.smsNotifications}</Text>
                <Text style={styles.settingDesc}>{t.smsDesc}</Text>
              </View>
              <Switch
                value={smsNotifications}
                onValueChange={setSmsNotifications}
                trackColor={{ false: Colors.surfaceLight, true: Colors.primaryLight }}
                thumbColor={smsNotifications ? Colors.primary : Colors.textTertiary}
              />
            </View>
          </View>

          {/* Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.preferences}</Text>

            {/* Calendar Settings Link */}
            <TouchableOpacity
              style={styles.calendarManageCard}
              onPress={() => router.push('/calendar-settings' as any)}
              activeOpacity={0.7}
            >
              <View style={styles.calendarManageIcon}>
                <Calendar size={24} color={Colors.info} />
              </View>
              <View style={styles.manageInfo}>
                <Text style={styles.calendarManageTitle}>
                  {language === 'tr'
                    ? 'Takvim Senkronizasyonu'
                    : 'Calendar Synchronization'}
                </Text>
                <Text style={styles.calendarManageDesc}>
                  {language === 'tr'
                    ? 'Seansları takviminizle senkronize edin'
                    : 'Sync sessions with your calendar'}
                </Text>
              </View>
              <ChevronRight size={24} color={Colors.background} />
            </TouchableOpacity>

            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Bell size={20} color={Colors.accent} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t.sessionReminders}</Text>
                <Text style={styles.settingDesc}>{t.sessionDesc}</Text>
              </View>
              <Switch
                value={sessionReminders}
                onValueChange={setSessionReminders}
                trackColor={{ false: Colors.surfaceLight, true: Colors.primaryLight }}
                thumbColor={sessionReminders ? Colors.primary : Colors.textTertiary}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Bell size={20} color={Colors.success} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t.paymentReminders}</Text>
                <Text style={styles.settingDesc}>{t.paymentDesc}</Text>
              </View>
              <Switch
                value={paymentReminders}
                onValueChange={setPaymentReminders}
                trackColor={{ false: Colors.surfaceLight, true: Colors.primaryLight }}
                thumbColor={paymentReminders ? Colors.primary : Colors.textTertiary}
              />
            </View>
          </View>

          {/* Appearance */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.appearance}</Text>

            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Moon size={20} color={Colors.indigo} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t.darkMode}</Text>
                <Text style={styles.settingDesc}>{t.darkModeDesc}</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: Colors.surfaceLight, true: Colors.primaryLight }}
                thumbColor={darkMode ? Colors.primary : Colors.textTertiary}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Volume2 size={20} color={Colors.warning} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t.sound}</Text>
                <Text style={styles.settingDesc}>{t.soundDesc}</Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: Colors.surfaceLight, true: Colors.primaryLight }}
                thumbColor={soundEnabled ? Colors.primary : Colors.textTertiary}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Vibrate size={20} color={Colors.accent} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t.vibration}</Text>
                <Text style={styles.settingDesc}>{t.vibrationDesc}</Text>
              </View>
              <Switch
                value={vibrationEnabled}
                onValueChange={setVibrationEnabled}
                trackColor={{ false: Colors.surfaceLight, true: Colors.primaryLight }}
                thumbColor={vibrationEnabled ? Colors.primary : Colors.textTertiary}
              />
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: -8,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceLight,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  languageText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  languageCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  manageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  manageIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  manageInfo: {
    flex: 1,
    gap: 4,
  },
  manageTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.background,
  },
  manageDesc: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.background,
    opacity: 0.8,
  },
  smsManageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.warning,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.warning,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  smsManageIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smsManageTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.background,
  },
  smsManageDesc: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.background,
    opacity: 0.8,
  },
  calendarManageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.info,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.info,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  calendarManageIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarManageTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.background,
  },
  calendarManageDesc: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.background,
    opacity: 0.8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    gap: 2,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  settingDesc: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
