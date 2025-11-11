/**
 * Members Menu Screen - Main menu for member management
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Users,
  UserPlus,
  RefreshCw,
  CreditCard,
  Ruler,
  FileText,
  BarChart3,
  MessageCircle,
  Activity,
  Bell,
  AlertCircle,
  UsersRound,
  UserX,
  ChevronRight,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';

interface MenuItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  route: string;
  color: string;
}

export default function MembersMenuScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();

  const texts = {
    tr: {
      title: 'Üyeler',
      subtitle: 'Üye yönetimi ve işlemleri',
      menuItems: {
        list: 'Üye Listesi',
        add: 'Üye Ekle',
        renew: 'Üyenin Paketini Yenile',
        newMembership: 'Yeni Üyelik Oluştur',
        payment: 'Üyeden Ödeme Al',
        measurements: 'Üyenin Ölçümleri',
        reports: 'Üyenin Raporları',
        sessionReport: 'Üye - Seans Raporu',
        messages: 'Üye Seans Mesajları',
        difficulty: 'Üyenin Zorlanma Derecesi',
        notification: 'Üyeye Bildirim Gönder',
        paymentReminder: 'Üyeye Ödemeyi Hatırlat',
        groups: 'Grup Yönetimi',
        passive: 'Pasif Üyeler',
      },
    },
    en: {
      title: 'Members',
      subtitle: 'Member management and operations',
      menuItems: {
        list: 'Member List',
        add: 'Add Member',
        renew: 'Renew Member Package',
        newMembership: 'Create New Membership',
        payment: 'Receive Payment from Member',
        measurements: 'Member Measurements',
        reports: 'Member Reports',
        sessionReport: 'Member - Session Report',
        messages: 'Member Session Messages',
        difficulty: 'Member Difficulty Level',
        notification: 'Send Notification to Member',
        paymentReminder: 'Send Payment Reminder',
        groups: 'Group Management',
        passive: 'Passive Members',
      },
    },
  };

  const t = texts[language];

  const menuItems: MenuItem[] = [
    {
      id: 'list',
      icon: <Users size={24} color={Colors.primary} />,
      title: t.menuItems.list,
      route: '/members-list',
      color: Colors.primary,
    },
    {
      id: 'add',
      icon: <UserPlus size={24} color={Colors.secondary} />,
      title: t.menuItems.add,
      route: '/add-member',
      color: Colors.secondary,
    },
    {
      id: 'renew',
      icon: <RefreshCw size={24} color={Colors.info} />,
      title: t.menuItems.renew,
      route: '/member-renew-package',
      color: Colors.info,
    },
    {
      id: 'newMembership',
      icon: <UserPlus size={24} color={Colors.secondary} />,
      title: t.menuItems.newMembership,
      route: '/add-member',
      color: Colors.secondary,
    },
    {
      id: 'payment',
      icon: <CreditCard size={24} color={Colors.success} />,
      title: t.menuItems.payment,
      route: '/member-payment',
      color: Colors.success,
    },
    {
      id: 'measurements',
      icon: <Ruler size={24} color={Colors.accent} />,
      title: t.menuItems.measurements,
      route: '/member-measurements',
      color: Colors.accent,
    },
    {
      id: 'reports',
      icon: <FileText size={24} color={Colors.indigo} />,
      title: t.menuItems.reports,
      route: '/member-reports',
      color: Colors.indigo,
    },
    {
      id: 'sessionReport',
      icon: <BarChart3 size={24} color={Colors.primary} />,
      title: t.menuItems.sessionReport,
      route: '/member-session-report',
      color: Colors.primary,
    },
    {
      id: 'messages',
      icon: <MessageCircle size={24} color={Colors.info} />,
      title: t.menuItems.messages,
      route: '/member-session-messages',
      color: Colors.info,
    },
    {
      id: 'difficulty',
      icon: <Activity size={24} color={Colors.warning} />,
      title: t.menuItems.difficulty,
      route: '/member-difficulty',
      color: Colors.warning,
    },
    {
      id: 'notification',
      icon: <Bell size={24} color={Colors.secondary} />,
      title: t.menuItems.notification,
      route: '/send-notification',
      color: Colors.secondary,
    },
    {
      id: 'paymentReminder',
      icon: <AlertCircle size={24} color={Colors.warning} />,
      title: t.menuItems.paymentReminder,
      route: '/member-payment-reminder',
      color: Colors.warning,
    },
    {
      id: 'groups',
      icon: <UsersRound size={24} color={Colors.accent} />,
      title: t.menuItems.groups,
      route: '/groups',
      color: Colors.accent,
    },
    {
      id: 'passive',
      icon: <UserX size={24} color={Colors.textSecondary} />,
      title: t.menuItems.passive,
      route: '/passive-members',
      color: Colors.textSecondary,
    },
  ];

  const handleMenuPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.backgroundLight]}
        style={styles.gradient}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Users size={32} color={Colors.primary} />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>{t.title}</Text>
              <Text style={styles.subtitle}>{t.subtitle}</Text>
            </View>
          </View>

          {/* Menu Items */}
          <View style={styles.menuContainer}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleMenuPress(item.route)}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIndicator, { backgroundColor: item.color }]} />
                <View style={styles.menuIconContainer}>{item.icon}</View>
                <Text style={styles.menuText}>{item.title}</Text>
                <ChevronRight size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            ))}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTextContainer: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  menuContainer: {
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
});
