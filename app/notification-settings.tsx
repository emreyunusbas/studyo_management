/**
 * Notification Settings Screen - Bildirim ayarları ve zamanlanmış bildirimler
 */

import React, { useState, useEffect } from 'react';
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
  Bell,
  BellOff,
  Clock,
  Trash2,
  Check,
  Calendar,
  DollarSign,
  Settings,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { useNotifications } from '@/contexts/NotificationContext';
import * as Notifications from 'expo-notifications';

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();
  const {
    permissionGranted,
    requestPermissions,
    scheduledNotificationsCount,
    getAllScheduledNotifications,
    cancelAllNotifications,
    clearBadge,
  } = useNotifications();

  const [pushEnabled, setPushEnabled] = useState(permissionGranted);
  const [sessionReminders, setSessionReminders] = useState(true);
  const [paymentReminders, setPaymentReminders] = useState(true);
  const [reminderTime, setReminderTime] = useState(60); // minutes before
  const [scheduledNotifications, setScheduledNotifications] = useState<
    Notifications.NotificationRequest[]
  >([]);

  const texts = {
    tr: {
      title: 'Bildirim Ayarları',
      pushNotifications: 'Anlık Bildirimler',
      pushDesc: 'Push notification izinlerini yönet',
      enabled: 'Aktif',
      disabled: 'Devre Dışı',
      requestPermission: 'İzin İste',
      permissionGranted: 'İzin Verildi',
      notificationTypes: 'Bildirim Türleri',
      sessionReminders: 'Seans Hatırlatmaları',
      sessionRemindersDesc: 'Seans öncesi bildirim al',
      paymentReminders: 'Ödeme Hatırlatmaları',
      paymentRemindersDesc: 'Ödeme tarihi yaklaştığında bildirim al',
      reminderSettings: 'Hatırlatma Ayarları',
      reminderTime: 'Hatırlatma Zamanı',
      minutesBefore: 'dakika önce',
      scheduledNotifications: 'Zamanlanmış Bildirimler',
      scheduledCount: 'zamanlanmış bildirim',
      viewAll: 'Tümünü Görüntüle',
      clearAll: 'Tümünü Temizle',
      clearAllConfirm:
        'Tüm zamanlanmış bildirimleri silmek istediğinizden emin misiniz?',
      yes: 'Evet',
      cancel: 'İptal',
      cleared: 'Tüm bildirimler temizlendi',
      testNotification: 'Test Bildirimi Gönder',
      testSent: 'Test bildirimi gönderildi',
      noScheduled: 'Zamanlanmış bildirim bulunmuyor',
      badgeClear: 'Badge Temizle',
      badgeCleared: 'Badge temizlendi',
    },
    en: {
      title: 'Notification Settings',
      pushNotifications: 'Push Notifications',
      pushDesc: 'Manage push notification permissions',
      enabled: 'Enabled',
      disabled: 'Disabled',
      requestPermission: 'Request Permission',
      permissionGranted: 'Permission Granted',
      notificationTypes: 'Notification Types',
      sessionReminders: 'Session Reminders',
      sessionRemindersDesc: 'Get notified before sessions',
      paymentReminders: 'Payment Reminders',
      paymentRemindersDesc: 'Get notified when payment is due',
      reminderSettings: 'Reminder Settings',
      reminderTime: 'Reminder Time',
      minutesBefore: 'minutes before',
      scheduledNotifications: 'Scheduled Notifications',
      scheduledCount: 'scheduled notifications',
      viewAll: 'View All',
      clearAll: 'Clear All',
      clearAllConfirm:
        'Are you sure you want to clear all scheduled notifications?',
      yes: 'Yes',
      cancel: 'Cancel',
      cleared: 'All notifications cleared',
      testNotification: 'Send Test Notification',
      testSent: 'Test notification sent',
      noScheduled: 'No scheduled notifications',
      badgeClear: 'Clear Badge',
      badgeCleared: 'Badge cleared',
    },
  };

  const t = texts[language];

  // Load scheduled notifications
  useEffect(() => {
    loadScheduledNotifications();
  }, []);

  const loadScheduledNotifications = async () => {
    const notifications = await getAllScheduledNotifications();
    setScheduledNotifications(notifications);
  };

  const handleRequestPermission = async () => {
    const granted = await requestPermissions();
    setPushEnabled(granted);

    if (granted) {
      Alert.alert(t.permissionGranted);
    }
  };

  const handleClearAll = () => {
    Alert.alert(t.clearAll, t.clearAllConfirm, [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.yes,
        style: 'destructive',
        onPress: async () => {
          await cancelAllNotifications();
          await loadScheduledNotifications();
          Alert.alert(t.cleared);
        },
      },
    ]);
  };

  const handleClearBadge = async () => {
    await clearBadge();
    Alert.alert(t.badgeCleared);
  };

  const handleTestNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Test Bildirimi',
        body: 'Bu bir test bildirimidir.',
        sound: 'notification-sound.wav',
      },
      trigger: null,
    });
    Alert.alert(t.testSent);
  };

  const reminderTimeOptions = [15, 30, 60, 120, 180];

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
          {/* Push Notifications Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.pushNotifications}</Text>

            <View style={styles.statusCard}>
              <View style={styles.statusIcon}>
                {pushEnabled ? (
                  <Bell size={32} color={Colors.primary} />
                ) : (
                  <BellOff size={32} color={Colors.textSecondary} />
                )}
              </View>

              <View style={styles.statusContent}>
                <Text style={styles.statusTitle}>
                  {pushEnabled ? t.enabled : t.disabled}
                </Text>
                <Text style={styles.statusDesc}>{t.pushDesc}</Text>
              </View>

              {!pushEnabled && (
                <TouchableOpacity
                  style={styles.permissionButton}
                  onPress={handleRequestPermission}
                >
                  <Text style={styles.permissionButtonText}>
                    {t.requestPermission}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Notification Types */}
          {pushEnabled && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.notificationTypes}</Text>

              <View style={styles.optionCard}>
                <View style={styles.optionIcon}>
                  <Calendar size={24} color={Colors.info} />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{t.sessionReminders}</Text>
                  <Text style={styles.optionDesc}>{t.sessionRemindersDesc}</Text>
                </View>
                <Switch
                  value={sessionReminders}
                  onValueChange={setSessionReminders}
                  trackColor={{ false: Colors.surface, true: Colors.primaryDark }}
                  thumbColor={sessionReminders ? Colors.primary : Colors.textTertiary}
                />
              </View>

              <View style={styles.optionCard}>
                <View style={styles.optionIcon}>
                  <DollarSign size={24} color={Colors.warning} />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{t.paymentReminders}</Text>
                  <Text style={styles.optionDesc}>{t.paymentRemindersDesc}</Text>
                </View>
                <Switch
                  value={paymentReminders}
                  onValueChange={setPaymentReminders}
                  trackColor={{ false: Colors.surface, true: Colors.primaryDark }}
                  thumbColor={paymentReminders ? Colors.primary : Colors.textTertiary}
                />
              </View>
            </View>
          )}

          {/* Reminder Settings */}
          {pushEnabled && (sessionReminders || paymentReminders) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.reminderSettings}</Text>

              <Text style={styles.subsectionTitle}>{t.reminderTime}</Text>

              <View style={styles.timeOptionsContainer}>
                {reminderTimeOptions.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeOption,
                      reminderTime === time && styles.timeOptionActive,
                    ]}
                    onPress={() => setReminderTime(time)}
                  >
                    <Text
                      style={[
                        styles.timeOptionText,
                        reminderTime === time && styles.timeOptionTextActive,
                      ]}
                    >
                      {time}
                    </Text>
                    <Text
                      style={[
                        styles.timeOptionLabel,
                        reminderTime === time && styles.timeOptionLabelActive,
                      ]}
                    >
                      {t.minutesBefore}
                    </Text>
                    {reminderTime === time && (
                      <View style={styles.timeOptionCheck}>
                        <Check size={16} color={Colors.background} />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Scheduled Notifications */}
          {pushEnabled && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t.scheduledNotifications}</Text>
                {scheduledNotificationsCount > 0 && (
                  <TouchableOpacity onPress={handleClearAll}>
                    <Text style={styles.clearAllText}>{t.clearAll}</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.scheduledCard}>
                <Clock size={40} color={Colors.primary} />
                <Text style={styles.scheduledCount}>
                  {scheduledNotificationsCount}
                </Text>
                <Text style={styles.scheduledLabel}>{t.scheduledCount}</Text>

                {scheduledNotificationsCount === 0 && (
                  <Text style={styles.noScheduledText}>{t.noScheduled}</Text>
                )}
              </View>
            </View>
          )}

          {/* Actions */}
          {pushEnabled && (
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleTestNotification}
              >
                <LinearGradient
                  colors={[Colors.info, '#2563eb']}
                  style={styles.actionGradient}
                >
                  <Bell size={20} color={Colors.background} />
                  <Text style={styles.actionButtonText}>{t.testNotification}</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleClearBadge}
              >
                <LinearGradient
                  colors={[Colors.warning, '#f59e0b']}
                  style={styles.actionGradient}
                >
                  <Trash2 size={20} color={Colors.background} />
                  <Text style={styles.actionButtonText}>{t.badgeClear}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  subsectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 8,
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.error,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  statusIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContent: {
    flex: 1,
    gap: 4,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  statusDesc: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  permissionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  permissionButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.background,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionContent: {
    flex: 1,
    gap: 2,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  optionDesc: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  timeOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeOption: {
    position: 'relative',
    minWidth: 100,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  timeOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeOptionText: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
  },
  timeOptionTextActive: {
    color: Colors.background,
  },
  timeOptionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  timeOptionLabelActive: {
    color: Colors.background,
    opacity: 0.8,
  },
  timeOptionCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduledCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  scheduledCount: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.primary,
  },
  scheduledLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  noScheduledText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textTertiary,
    marginTop: 8,
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 16,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.background,
  },
});
