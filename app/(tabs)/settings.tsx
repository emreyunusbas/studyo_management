/**
 * Settings Screen - Main settings dashboard
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  User,
  Building2,
  Settings as SettingsIcon,
  Bell,
  Lock,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  Globe,
  Moon,
  Shield,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout, language } = useApp();

  const texts = {
    tr: {
      title: 'Ayarlar',
      profile: 'Profil Ayarları',
      profileDesc: 'Hesap bilgilerinizi düzenleyin',
      studio: 'Stüdyo Bilgileri',
      studioDesc: 'İşletme bilgilerinizi yönetin',
      app: 'Uygulama Ayarları',
      appDesc: 'Dil, tema ve bildirim ayarları',
      account: 'Hesap',
      notifications: 'Bildirimler',
      notificationsDesc: 'Bildirim tercihlerinizi yönetin',
      security: 'Güvenlik',
      securityDesc: 'Şifre ve güvenlik ayarları',
      language: 'Dil',
      languageDesc: 'Uygulama dilini değiştirin',
      support: 'Destek',
      help: 'Yardım & SSS',
      helpDesc: 'Sık sorulan sorular',
      about: 'Hakkında',
      aboutDesc: 'Uygulama bilgileri ve versiyonu',
      logout: 'Çıkış Yap',
      logoutConfirm: 'Çıkış yapmak istediğinizden emin misiniz?',
      yes: 'Evet',
      cancel: 'İptal',
      version: 'Versiyon',
    },
    en: {
      title: 'Settings',
      profile: 'Profile Settings',
      profileDesc: 'Edit your account information',
      studio: 'Studio Information',
      studioDesc: 'Manage your business information',
      app: 'App Settings',
      appDesc: 'Language, theme and notification settings',
      account: 'Account',
      notifications: 'Notifications',
      notificationsDesc: 'Manage notification preferences',
      security: 'Security',
      securityDesc: 'Password and security settings',
      language: 'Language',
      languageDesc: 'Change app language',
      support: 'Support',
      help: 'Help & FAQ',
      helpDesc: 'Frequently asked questions',
      about: 'About',
      aboutDesc: 'App information and version',
      logout: 'Logout',
      logoutConfirm: 'Are you sure you want to logout?',
      yes: 'Yes',
      cancel: 'Cancel',
      version: 'Version',
    },
  };

  const t = texts[language];

  const handleLogout = () => {
    Alert.alert(t.logout, t.logoutConfirm, [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.yes,
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/welcome');
        },
      },
    ]);
  };

  const settingsCategories = [
    {
      title: t.account,
      items: [
        {
          id: 'profile',
          title: t.profile,
          description: t.profileDesc,
          icon: User,
          color: Colors.primary,
          route: '/profile-settings',
        },
        {
          id: 'studio',
          title: t.studio,
          description: t.studioDesc,
          icon: Building2,
          color: Colors.info,
          route: '/studio-settings',
        },
        {
          id: 'app',
          title: t.app,
          description: t.appDesc,
          icon: SettingsIcon,
          color: Colors.accent,
          route: '/app-settings',
        },
      ],
    },
    {
      title: t.support,
      items: [
        {
          id: 'help',
          title: t.help,
          description: t.helpDesc,
          icon: HelpCircle,
          color: Colors.warning,
          onPress: () => Alert.alert(t.help, 'Yardım merkezi yakında eklenecek'),
        },
        {
          id: 'about',
          title: t.about,
          description: t.aboutDesc,
          icon: Info,
          color: Colors.success,
          onPress: () => Alert.alert(t.about, 'Neseli Pilates Yönetim v1.0.0'),
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.backgroundLight]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <Text style={styles.title}>{t.title}</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
        >
          {/* User Profile Card */}
          {user && (
            <TouchableOpacity
              style={styles.userCard}
              onPress={() => router.push('/profile-settings' as any)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                style={styles.userGradient}
              >
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>
                    {user.name?.[0]}
                    {user.surname?.[0]}
                  </Text>
                </View>

                <View style={styles.userInfo}>
                  <Text style={styles.userName}>
                    {user.name} {user.surname}
                  </Text>
                  <Text style={styles.userRole}>{user.role}</Text>
                  {user.studioName && (
                    <Text style={styles.userStudio}>{user.studioName}</Text>
                  )}
                </View>

                <ChevronRight size={24} color={Colors.background} />
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Settings Categories */}
          {settingsCategories.map((category, categoryIndex) => (
            <View key={categoryIndex} style={styles.section}>
              <Text style={styles.sectionTitle}>{category.title}</Text>

              {category.items.map((item) => {
                const IconComponent = item.icon;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.settingCard}
                    onPress={() =>
                      item.route ? router.push(item.route as any) : item.onPress?.()
                    }
                    activeOpacity={0.7}
                  >
                    <View
                      style={[styles.settingIcon, { backgroundColor: item.color }]}
                    >
                      <IconComponent size={24} color={Colors.background} />
                    </View>

                    <View style={styles.settingInfo}>
                      <Text style={styles.settingTitle}>{item.title}</Text>
                      <Text style={styles.settingDescription}>
                        {item.description}
                      </Text>
                    </View>

                    <ChevronRight size={20} color={Colors.textSecondary} />
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}

          {/* App Version */}
          <View style={styles.versionCard}>
            <Text style={styles.versionText}>
              {t.version} 1.0.0 (Build 1)
            </Text>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LinearGradient
              colors={[Colors.error, '#dc2626']}
              style={styles.logoutGradient}
            >
              <LogOut size={20} color={Colors.background} />
              <Text style={styles.logoutText}>{t.logout}</Text>
            </LinearGradient>
          </TouchableOpacity>
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
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 20,
  },
  userCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  userGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  userAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primary,
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.background,
  },
  userRole: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.background,
    opacity: 0.9,
  },
  userStudio: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.background,
    opacity: 0.7,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    gap: 2,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  settingDescription: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  versionCard: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  versionText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textTertiary,
  },
  logoutButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 8,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.background,
  },
});
