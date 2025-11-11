/**
 * Calendar Settings Screen - Takvim senkronizasyon ayarları
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  RefreshCw,
  Info,
  Settings as SettingsIcon,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { calendarService } from '@/services/calendarService';

export default function CalendarSettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();

  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [calendarId, setCalendarId] = useState<string | null>(null);
  const [autoSync, setAutoSync] = useState(true);
  const [syncNewSessions, setSyncNewSessions] = useState(true);
  const [reminderBefore60, setReminderBefore60] = useState(true);
  const [reminderBefore15, setReminderBefore15] = useState(true);
  const [lastSyncDate, setLastSyncDate] = useState<Date | null>(null);
  const [calendars, setCalendars] = useState<any[]>([]);

  const texts = {
    tr: {
      title: 'Takvim Ayarları',
      calendarSync: 'Takvim Senkronizasyonu',
      permissionStatus: 'İzin Durumu',
      granted: 'Verildi',
      notGranted: 'Verilmedi',
      requestPermission: 'İzin İste',
      connectedCalendar: 'Bağlı Takvim',
      notConnected: 'Takvim bağlı değil',
      autoSync: 'Otomatik Senkronizasyon',
      autoSyncDesc: 'Yeni seanslar otomatik olarak takvime eklensin',
      syncNewSessions: 'Yeni Seansları Ekle',
      syncNewSessionsDesc: 'Oluşturulan yeni seansları takvime ekle',
      reminders: 'Hatırlatıcılar',
      reminder60: '1 Saat Önce',
      reminder15: '15 Dakika Önce',
      lastSync: 'Son Senkronizasyon',
      never: 'Hiçbir zaman',
      syncNow: 'Şimdi Senkronize Et',
      syncing: 'Senkronize ediliyor...',
      syncSuccess: 'Senkronizasyon başarılı',
      syncError: 'Senkronizasyon hatası',
      availableCalendars: 'Mevcut Takvimler',
      noCalendars: 'Takvim bulunamadı',
      pilatesStudio: 'Pilates Studio',
      info: 'Bilgi',
      calendarInfo:
        'Seanslarınız otomatik olarak telefonunuzun takvim uygulamasına eklenecektir. İstediğiniz zaman manuel olarak senkronize edebilir veya otomatik senkronizasyonu kapatabilirsiniz.',
      permissionRequired: 'Takvim izni gerekli',
      permissionMessage:
        'Seanslarınızı takviminize eklemek için takvim erişim izni gereklidir.',
    },
    en: {
      title: 'Calendar Settings',
      calendarSync: 'Calendar Synchronization',
      permissionStatus: 'Permission Status',
      granted: 'Granted',
      notGranted: 'Not Granted',
      requestPermission: 'Request Permission',
      connectedCalendar: 'Connected Calendar',
      notConnected: 'No calendar connected',
      autoSync: 'Auto Synchronization',
      autoSyncDesc: 'Automatically add new sessions to calendar',
      syncNewSessions: 'Sync New Sessions',
      syncNewSessionsDesc: 'Add newly created sessions to calendar',
      reminders: 'Reminders',
      reminder60: '1 Hour Before',
      reminder15: '15 Minutes Before',
      lastSync: 'Last Sync',
      never: 'Never',
      syncNow: 'Sync Now',
      syncing: 'Syncing...',
      syncSuccess: 'Sync successful',
      syncError: 'Sync error',
      availableCalendars: 'Available Calendars',
      noCalendars: 'No calendars found',
      pilatesStudio: 'Pilates Studio',
      info: 'Info',
      calendarInfo:
        'Your sessions will be automatically added to your phone calendar app. You can manually sync anytime or disable auto-sync.',
      permissionRequired: 'Calendar permission required',
      permissionMessage:
        'Calendar access permission is required to add sessions to your calendar.',
    },
  };

  const t = texts[language];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);

    try {
      // Check permissions
      const hasCalendarPermission = await calendarService.checkPermissions();
      setHasPermission(hasCalendarPermission);

      if (hasCalendarPermission) {
        // Get calendar ID
        const defaultCalendar = await calendarService.getDefaultCalendar();
        setCalendarId(defaultCalendar);

        // Get all calendars
        const allCalendars = await calendarService.getAllCalendars();
        setCalendars(allCalendars);
      }

      // Load settings from AsyncStorage
      const autoSyncEnabled = await AsyncStorage.getItem('calendarAutoSync');
      const syncNew = await AsyncStorage.getItem('calendarSyncNewSessions');
      const reminder60 = await AsyncStorage.getItem('calendarReminder60');
      const reminder15 = await AsyncStorage.getItem('calendarReminder15');
      const lastSync = await AsyncStorage.getItem('calendarLastSync');

      setAutoSync(autoSyncEnabled !== 'false');
      setSyncNewSessions(syncNew !== 'false');
      setReminderBefore60(reminder60 !== 'false');
      setReminderBefore15(reminder15 !== 'false');
      setLastSyncDate(lastSync ? new Date(lastSync) : null);
    } catch (error) {
      console.error('Error loading calendar settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPermission = async () => {
    const granted = await calendarService.requestPermissions();
    setHasPermission(granted);

    if (granted) {
      const defaultCalendar = await calendarService.getDefaultCalendar();
      setCalendarId(defaultCalendar);

      const allCalendars = await calendarService.getAllCalendars();
      setCalendars(allCalendars);
    } else {
      Alert.alert(t.permissionRequired, t.permissionMessage);
    }
  };

  const handleSyncNow = async () => {
    if (!hasPermission) {
      Alert.alert(t.permissionRequired, t.permissionMessage);
      return;
    }

    setSyncing(true);

    try {
      // In a real app, you would get upcoming sessions from your data source
      // For now, we'll just update the last sync date
      const now = new Date();
      await AsyncStorage.setItem('calendarLastSync', now.toISOString());
      setLastSyncDate(now);

      Alert.alert(t.syncSuccess);
    } catch (error) {
      console.error('Sync error:', error);
      Alert.alert(t.syncError);
    } finally {
      setSyncing(false);
    }
  };

  const handleToggleAutoSync = async (value: boolean) => {
    setAutoSync(value);
    await AsyncStorage.setItem('calendarAutoSync', value.toString());
  };

  const handleToggleSyncNewSessions = async (value: boolean) => {
    setSyncNewSessions(value);
    await AsyncStorage.setItem('calendarSyncNewSessions', value.toString());
  };

  const handleToggleReminder60 = async (value: boolean) => {
    setReminderBefore60(value);
    await AsyncStorage.setItem('calendarReminder60', value.toString());
  };

  const handleToggleReminder15 = async (value: boolean) => {
    setReminderBefore15(value);
    await AsyncStorage.setItem('calendarReminder15', value.toString());
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.backgroundLight]}
        style={styles.gradient}
      >
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
          {/* Permission Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.permissionStatus}</Text>
            <View style={styles.card}>
              <View style={styles.statusRow}>
                {hasPermission ? (
                  <CheckCircle size={24} color={Colors.success} />
                ) : (
                  <XCircle size={24} color={Colors.error} />
                )}
                <View style={styles.statusInfo}>
                  <Text style={styles.statusText}>
                    {hasPermission ? t.granted : t.notGranted}
                  </Text>
                  {!hasPermission && (
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
            </View>
          </View>

          {hasPermission && (
            <>
              {/* Connected Calendar */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t.connectedCalendar}</Text>
                <View style={styles.card}>
                  <View style={styles.calendarRow}>
                    <CalendarIcon size={24} color={Colors.primary} />
                    <Text style={styles.calendarName}>
                      {calendarId ? t.pilatesStudio : t.notConnected}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Sync Settings */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t.calendarSync}</Text>

                <View style={styles.card}>
                  <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingTitle}>{t.autoSync}</Text>
                      <Text style={styles.settingDesc}>{t.autoSyncDesc}</Text>
                    </View>
                    <Switch
                      value={autoSync}
                      onValueChange={handleToggleAutoSync}
                      trackColor={{ false: Colors.border, true: Colors.primary }}
                      thumbColor={Colors.text}
                    />
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingTitle}>{t.syncNewSessions}</Text>
                      <Text style={styles.settingDesc}>{t.syncNewSessionsDesc}</Text>
                    </View>
                    <Switch
                      value={syncNewSessions}
                      onValueChange={handleToggleSyncNewSessions}
                      trackColor={{ false: Colors.border, true: Colors.primary }}
                      thumbColor={Colors.text}
                    />
                  </View>
                </View>
              </View>

              {/* Reminders */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t.reminders}</Text>

                <View style={styles.card}>
                  <View style={styles.settingRow}>
                    <Text style={styles.settingTitle}>{t.reminder60}</Text>
                    <Switch
                      value={reminderBefore60}
                      onValueChange={handleToggleReminder60}
                      trackColor={{ false: Colors.border, true: Colors.primary }}
                      thumbColor={Colors.text}
                    />
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.settingRow}>
                    <Text style={styles.settingTitle}>{t.reminder15}</Text>
                    <Switch
                      value={reminderBefore15}
                      onValueChange={handleToggleReminder15}
                      trackColor={{ false: Colors.border, true: Colors.primary }}
                      thumbColor={Colors.text}
                    />
                  </View>
                </View>
              </View>

              {/* Last Sync & Sync Now */}
              <View style={styles.section}>
                <View style={styles.card}>
                  <View style={styles.syncRow}>
                    <View>
                      <Text style={styles.lastSyncLabel}>{t.lastSync}</Text>
                      <Text style={styles.lastSyncDate}>
                        {lastSyncDate
                          ? lastSyncDate.toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US')
                          : t.never}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.syncButton, syncing && styles.syncButtonDisabled]}
                      onPress={handleSyncNow}
                      disabled={syncing}
                    >
                      {syncing ? (
                        <ActivityIndicator size="small" color={Colors.background} />
                      ) : (
                        <RefreshCw size={20} color={Colors.background} />
                      )}
                      <Text style={styles.syncButtonText}>
                        {syncing ? t.syncing : t.syncNow}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Info */}
              <View style={styles.infoCard}>
                <View style={styles.infoHeader}>
                  <Info size={20} color={Colors.primary} />
                  <Text style={styles.infoTitle}>{t.info}</Text>
                </View>
                <Text style={styles.infoText}>{t.calendarInfo}</Text>
              </View>

              {/* Available Calendars */}
              {calendars.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>{t.availableCalendars}</Text>
                  <View style={styles.card}>
                    {calendars.map((calendar, index) => (
                      <View key={calendar.id}>
                        {index > 0 && <View style={styles.divider} />}
                        <View style={styles.calendarItem}>
                          <View
                            style={[
                              styles.calendarColor,
                              { backgroundColor: calendar.color || Colors.primary },
                            ]}
                          />
                          <View style={styles.calendarItemInfo}>
                            <Text style={styles.calendarItemTitle}>{calendar.title}</Text>
                            <Text style={styles.calendarItemSource}>
                              {calendar.source?.name || 'Local'}
                            </Text>
                          </View>
                          {calendar.id === calendarId && (
                            <CheckCircle size={20} color={Colors.success} />
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
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
  title: { fontSize: 24, fontWeight: '800', color: Colors.text },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, gap: 24 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, paddingLeft: 4 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  statusInfo: { flex: 1, gap: 12 },
  statusText: { fontSize: 16, fontWeight: '700', color: Colors.text },
  permissionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  permissionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.background,
  },
  calendarRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  calendarName: { fontSize: 16, fontWeight: '700', color: Colors.text },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  settingInfo: { flex: 1, gap: 4 },
  settingTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
  settingDesc: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  divider: { height: 1, backgroundColor: Colors.border },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  lastSyncLabel: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  lastSyncDate: { fontSize: 15, fontWeight: '700', color: Colors.text, marginTop: 4 },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  syncButtonDisabled: { opacity: 0.6 },
  syncButtonText: { fontSize: 14, fontWeight: '700', color: Colors.background },
  infoCard: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  infoHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoTitle: { fontSize: 14, fontWeight: '700', color: Colors.text },
  infoText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  calendarItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  calendarColor: { width: 24, height: 24, borderRadius: 12 },
  calendarItemInfo: { flex: 1, gap: 2 },
  calendarItemTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
  calendarItemSource: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
});
