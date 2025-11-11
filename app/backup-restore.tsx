/**
 * Backup/Restore Screen - Yedekleme ve geri yükleme yönetimi
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Database,
  RefreshCw,
  Download,
  Upload,
  Clock,
  Trash2,
  CheckCircle,
  XCircle,
  HardDrive,
  Cloud,
  Shield,
  Zap,
  Settings as SettingsIcon,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import {
  backupService,
  BackupInfo,
  BackupSettings,
  BackupType,
  BackupSchedule,
  StorageLocation,
} from '@/services/backupService';

export default function BackupRestoreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();

  const [loading, setLoading] = useState(false);
  const [backups, setBackups] = useState<BackupInfo[]>([]);
  const [settings, setSettings] = useState<BackupSettings>(backupService.getSettings());
  const [statistics, setStatistics] = useState({
    totalBackups: 0,
    totalSize: 0,
    latestBackup: null as Date | null,
    averageSize: 0,
  });

  const texts = {
    tr: {
      title: 'Yedekleme & Geri Yükleme',
      settings: 'Ayarlar',
      backups: 'Yedeklemeler',
      statistics: 'İstatistikler',
      createBackup: 'Yedek Oluştur',
      restore: 'Geri Yükle',
      autoBackup: 'Otomatik Yedekleme',
      autoBackupDesc: 'Belirlenen aralıklarla otomatik yedekleme yap',
      schedule: 'Zamanlama',
      manual: 'Manuel',
      daily: 'Günlük',
      weekly: 'Haftalık',
      monthly: 'Aylık',
      backupType: 'Yedekleme Türü',
      full: 'Tam',
      incremental: 'Artımlı',
      differential: 'Farksal',
      storageLocation: 'Depolama Konumu',
      local: 'Yerel',
      cloud: 'Bulut',
      both: 'Her İkisi',
      maxBackups: 'Maksimum Yedek',
      retentionDays: 'Saklama Süresi (Gün)',
      compressBackups: 'Yedekleri Sıkıştır',
      encryptBackups: 'Yedekleri Şifrele',
      includeMedia: 'Medya Dahil Et',
      totalBackups: 'Toplam Yedek',
      totalSize: 'Toplam Boyut',
      latestBackup: 'Son Yedek',
      averageSize: 'Ortalama Boyut',
      never: 'Hiçbir zaman',
      creating: 'Oluşturuluyor...',
      restoring: 'Geri yükleniyor...',
      backupSuccess: 'Yedek oluşturuldu',
      backupFailed: 'Yedekleme başarısız',
      restoreSuccess: 'Geri yükleme başarılı',
      restoreFailed: 'Geri yükleme başarısız',
      confirmRestore: 'Geri yüklemek istediğinizden emin misiniz?',
      confirmRestoreDesc: 'Mevcut veriler yedek ile değiştirilecek.',
      yes: 'Evet',
      no: 'Hayır',
      confirmDelete: 'Yedek silinsin mi?',
      deleteBackup: 'Yedek Sil',
      noBackups: 'Henüz yedek oluşturulmadı',
      items: 'öğe',
      completed: 'Tamamlandı',
      failed: 'Başarısız',
      inProgress: 'Devam Ediyor',
    },
    en: {
      title: 'Backup & Restore',
      settings: 'Settings',
      backups: 'Backups',
      statistics: 'Statistics',
      createBackup: 'Create Backup',
      restore: 'Restore',
      autoBackup: 'Auto Backup',
      autoBackupDesc: 'Automatically backup at scheduled intervals',
      schedule: 'Schedule',
      manual: 'Manual',
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      backupType: 'Backup Type',
      full: 'Full',
      incremental: 'Incremental',
      differential: 'Differential',
      storageLocation: 'Storage Location',
      local: 'Local',
      cloud: 'Cloud',
      both: 'Both',
      maxBackups: 'Max Backups',
      retentionDays: 'Retention Days',
      compressBackups: 'Compress Backups',
      encryptBackups: 'Encrypt Backups',
      includeMedia: 'Include Media',
      totalBackups: 'Total Backups',
      totalSize: 'Total Size',
      latestBackup: 'Latest Backup',
      averageSize: 'Average Size',
      never: 'Never',
      creating: 'Creating...',
      restoring: 'Restoring...',
      backupSuccess: 'Backup created',
      backupFailed: 'Backup failed',
      restoreSuccess: 'Restore successful',
      restoreFailed: 'Restore failed',
      confirmRestore: 'Are you sure you want to restore?',
      confirmRestoreDesc: 'Current data will be replaced with backup.',
      yes: 'Yes',
      no: 'No',
      confirmDelete: 'Delete backup?',
      deleteBackup: 'Delete Backup',
      noBackups: 'No backups yet',
      items: 'items',
      completed: 'Completed',
      failed: 'Failed',
      inProgress: 'In Progress',
    },
  };

  const t = texts[language];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const backupHistory = await backupService.getBackupHistory();
    const stats = await backupService.getStatistics();

    setBackups(backupHistory);
    setStatistics(stats);
  };

  const handleCreateBackup = async () => {
    setLoading(true);

    try {
      const backup = await backupService.createBackup(settings.backupType);
      if (backup) {
        Alert.alert(t.backupSuccess);
        await loadData();
      } else {
        Alert.alert(t.backupFailed);
      }
    } catch (error) {
      Alert.alert(t.backupFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = (backupId: string) => {
    Alert.alert(t.confirmRestore, t.confirmRestoreDesc, [
      { text: t.no, style: 'cancel' },
      {
        text: t.yes,
        style: 'destructive',
        onPress: async () => {
          setLoading(true);

          try {
            const result = await backupService.restoreFromBackup(backupId);
            if (result.success) {
              Alert.alert(
                t.restoreSuccess,
                `${result.restoredItems} ${t.items} ${t.completed.toLowerCase()}`
              );
            } else {
              Alert.alert(t.restoreFailed, result.errors.join('\n'));
            }
          } catch (error) {
            Alert.alert(t.restoreFailed);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handleDelete = (backupId: string) => {
    Alert.alert(t.deleteBackup, t.confirmDelete, [
      { text: t.no, style: 'cancel' },
      {
        text: t.yes,
        style: 'destructive',
        onPress: async () => {
          await backupService.deleteBackup(backupId);
          await loadData();
        },
      },
    ]);
  };

  const handleUpdateSettings = async (updates: Partial<BackupSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    await backupService.updateSettings(updates);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} color={Colors.success} />;
      case 'failed':
        return <XCircle size={20} color={Colors.error} />;
      case 'in_progress':
        return <ActivityIndicator size="small" color={Colors.primary} />;
      default:
        return <Clock size={20} color={Colors.warning} />;
    }
  };

  const storageIcons: Record<StorageLocation, any> = {
    local: HardDrive,
    cloud: Cloud,
    both: Database,
  };

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
          {/* Statistics */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Database size={24} color={Colors.primary} />
              <Text style={styles.sectionTitle}>{t.statistics}</Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{statistics.totalBackups}</Text>
                <Text style={styles.statLabel}>{t.totalBackups}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{formatFileSize(statistics.totalSize)}</Text>
                <Text style={styles.statLabel}>{t.totalSize}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {statistics.latestBackup
                    ? statistics.latestBackup.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')
                    : t.never}
                </Text>
                <Text style={styles.statLabel}>{t.latestBackup}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{formatFileSize(statistics.averageSize)}</Text>
                <Text style={styles.statLabel}>{t.averageSize}</Text>
              </View>
            </View>
          </View>

          {/* Create Backup */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.createBackupButton}
              onPress={handleCreateBackup}
              disabled={loading}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                style={styles.createBackupGradient}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={Colors.background} />
                ) : (
                  <>
                    <Download size={24} color={Colors.background} />
                    <Text style={styles.createBackupText}>{t.createBackup}</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Settings */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <SettingsIcon size={24} color={Colors.info} />
              <Text style={styles.sectionTitle}>{t.settings}</Text>
            </View>

            <View style={styles.settingsCard}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>{t.autoBackup}</Text>
                  <Text style={styles.settingDesc}>{t.autoBackupDesc}</Text>
                </View>
                <Switch
                  value={settings.autoBackup}
                  onValueChange={(value) => handleUpdateSettings({ autoBackup: value })}
                  trackColor={{ false: Colors.border, true: Colors.primary }}
                  thumbColor={Colors.text}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <Text style={styles.settingTitle}>{t.compressBackups}</Text>
                <Switch
                  value={settings.compressBackups}
                  onValueChange={(value) => handleUpdateSettings({ compressBackups: value })}
                  trackColor={{ false: Colors.border, true: Colors.primary }}
                  thumbColor={Colors.text}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Shield size={20} color={Colors.warning} />
                  <Text style={styles.settingTitle}>{t.encryptBackups}</Text>
                </View>
                <Switch
                  value={settings.encryptBackups}
                  onValueChange={(value) => handleUpdateSettings({ encryptBackups: value })}
                  trackColor={{ false: Colors.border, true: Colors.warning }}
                  thumbColor={Colors.text}
                />
              </View>
            </View>
          </View>

          {/* Backup History */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={24} color={Colors.accent} />
              <Text style={styles.sectionTitle}>{t.backups}</Text>
            </View>

            {backups.length === 0 ? (
              <View style={styles.emptyState}>
                <Database size={64} color={Colors.textTertiary} />
                <Text style={styles.emptyText}>{t.noBackups}</Text>
              </View>
            ) : (
              <View style={styles.backupsList}>
                {backups.map((backup) => {
                  const StorageIcon = storageIcons[backup.storageLocation];
                  return (
                    <View key={backup.id} style={styles.backupItem}>
                      <View style={styles.backupIcon}>
                        <StorageIcon size={24} color={Colors.primary} />
                      </View>

                      <View style={styles.backupInfo}>
                        <Text style={styles.backupName}>{backup.name}</Text>
                        <View style={styles.backupMeta}>
                          <Text style={styles.backupMetaText}>
                            {formatFileSize(backup.size)}
                          </Text>
                          <Text style={styles.backupMetaText}>•</Text>
                          <Text style={styles.backupMetaText}>
                            {backup.itemCount} {t.items}
                          </Text>
                          <Text style={styles.backupMetaText}>•</Text>
                          <Text style={styles.backupMetaText}>
                            {backup.createdAt.toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US')}
                          </Text>
                        </View>
                        <View style={styles.backupBadges}>
                          <View style={styles.backupBadge}>
                            <Text style={styles.backupBadgeText}>{t[backup.type]}</Text>
                          </View>
                          {getStatusIcon(backup.status)}
                        </View>
                      </View>

                      <View style={styles.backupActions}>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleRestore(backup.id)}
                          disabled={loading || backup.status !== 'completed'}
                        >
                          <Upload size={20} color={Colors.success} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleDelete(backup.id)}
                        >
                          <Trash2 size={20} color={Colors.error} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
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
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  statValue: { fontSize: 18, fontWeight: '800', color: Colors.text },
  statLabel: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary, textAlign: 'center' },
  createBackupButton: { borderRadius: 16, overflow: 'hidden' },
  createBackupGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 18,
  },
  createBackupText: { fontSize: 18, fontWeight: '800', color: Colors.background },
  settingsCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, gap: 16 },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  settingInfo: { flex: 1, gap: 4, flexDirection: 'row', alignItems: 'center' },
  settingTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
  settingDesc: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  divider: { height: 1, backgroundColor: Colors.border },
  emptyState: { alignItems: 'center', padding: 40, gap: 16 },
  emptyText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  backupsList: { gap: 12 },
  backupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  backupIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backupInfo: { flex: 1, gap: 4 },
  backupName: { fontSize: 14, fontWeight: '700', color: Colors.text },
  backupMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  backupMetaText: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary },
  backupBadges: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  backupBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: Colors.surfaceLight,
  },
  backupBadgeText: { fontSize: 10, fontWeight: '700', color: Colors.textSecondary },
  backupActions: { flexDirection: 'row', gap: 8 },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
