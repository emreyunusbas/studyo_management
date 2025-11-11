/**
 * Export/Import Screen - Veri dışa/içe aktarma yönetimi
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import {
  ChevronLeft,
  Download,
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  FileJson,
  FileSpreadsheet,
  Database,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import {
  exportImportService,
  ExportFormat,
  ExportCategory,
  ExportFileInfo,
  ImportResult,
} from '@/services/exportImportService';

export default function ExportImportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();

  const [loading, setLoading] = useState(false);
  const [exportHistory, setExportHistory] = useState<ExportFileInfo[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('json');
  const [selectedCategories, setSelectedCategories] = useState<ExportCategory[]>(['all']);

  const texts = {
    tr: {
      title: 'Dışa/İçe Aktarma',
      export: 'Dışa Aktar',
      import: 'İçe Aktar',
      exportData: 'Veri Dışa Aktar',
      importData: 'Veri İçe Aktar',
      selectFormat: 'Format Seç',
      selectCategories: 'Kategoriler Seç',
      exportHistory: 'Dışa Aktarma Geçmişi',
      templates: 'Şablonlar',
      all: 'Tümü',
      members: 'Üyeler',
      sessions: 'Seanslar',
      payments: 'Ödemeler',
      trainers: 'Eğitmenler',
      packages: 'Paketler',
      json: 'JSON',
      csv: 'CSV',
      excel: 'Excel',
      exportSuccess: 'Dışa aktarma başarılı',
      exportError: 'Dışa aktarma başarısız',
      importSuccess: 'İçe aktarma başarılı',
      importError: 'İçe aktarma başarısız',
      selectFile: 'Dosya Seç',
      importing: 'İçe aktarılıyor...',
      exporting: 'Dışa aktarılıyor...',
      noHistory: 'Henüz dışa aktarma yapılmadı',
      deleteFile: 'Dosya Sil',
      confirmDelete: 'Dosyayı silmek istediğinizden emin misiniz?',
      yes: 'Evet',
      no: 'Hayır',
      imported: 'içe aktarıldı',
      failed: 'başarısız',
      size: 'Boyut',
    },
    en: {
      title: 'Export/Import',
      export: 'Export',
      import: 'Import',
      exportData: 'Export Data',
      importData: 'Import Data',
      selectFormat: 'Select Format',
      selectCategories: 'Select Categories',
      exportHistory: 'Export History',
      templates: 'Templates',
      all: 'All',
      members: 'Members',
      sessions: 'Sessions',
      payments: 'Payments',
      trainers: 'Trainers',
      packages: 'Packages',
      json: 'JSON',
      csv: 'CSV',
      excel: 'Excel',
      exportSuccess: 'Export successful',
      exportError: 'Export failed',
      importSuccess: 'Import successful',
      importError: 'Import failed',
      selectFile: 'Select File',
      importing: 'Importing...',
      exporting: 'Exporting...',
      noHistory: 'No exports yet',
      deleteFile: 'Delete File',
      confirmDelete: 'Are you sure you want to delete this file?',
      yes: 'Yes',
      no: 'No',
      imported: 'imported',
      failed: 'failed',
      size: 'Size',
    },
  };

  const t = texts[language];

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const history = await exportImportService.getExportHistory();
    setExportHistory(history);
  };

  const handleExport = async () => {
    if (selectedCategories.length === 0) {
      Alert.alert('Error', 'Please select at least one category');
      return;
    }

    setLoading(true);

    try {
      const result = await exportImportService.exportData({
        format: selectedFormat,
        categories: selectedCategories,
        includeArchived: true,
      });

      if (result) {
        Alert.alert(t.exportSuccess);
        await loadHistory();
      } else {
        Alert.alert(t.exportError);
      }
    } catch (error) {
      Alert.alert(t.exportError);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/json', 'text/csv'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      setLoading(true);

      const importResult: ImportResult = await exportImportService.importData(result.assets[0].uri);

      if (importResult.success) {
        const summary = Object.entries(importResult.summary)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n');

        Alert.alert(
          t.importSuccess,
          `${importResult.imported} ${t.imported}\n${importResult.failed} ${t.failed}\n\n${summary}`
        );
      } else {
        Alert.alert(t.importError, importResult.errors.join('\n'));
      }
    } catch (error) {
      Alert.alert(t.importError);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExport = (path: string, filename: string) => {
    Alert.alert(t.deleteFile, t.confirmDelete, [
      { text: t.no, style: 'cancel' },
      {
        text: t.yes,
        style: 'destructive',
        onPress: async () => {
          await exportImportService.deleteExportFile(path);
          await loadHistory();
        },
      },
    ]);
  };

  const toggleCategory = (category: ExportCategory) => {
    if (category === 'all') {
      setSelectedCategories(['all']);
    } else {
      const filtered = selectedCategories.filter((c) => c !== 'all');
      if (filtered.includes(category)) {
        const newCategories = filtered.filter((c) => c !== category);
        setSelectedCategories(newCategories.length > 0 ? newCategories : ['all']);
      } else {
        setSelectedCategories([...filtered, category]);
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatIcons: Record<ExportFormat, any> = {
    json: FileJson,
    csv: FileSpreadsheet,
    excel: FileSpreadsheet,
  };

  const renderFormatButton = (format: ExportFormat) => {
    const Icon = formatIcons[format];
    return (
      <TouchableOpacity
        key={format}
        style={[
          styles.formatButton,
          selectedFormat === format && styles.formatButtonActive,
        ]}
        onPress={() => setSelectedFormat(format)}
      >
        <Icon
          size={24}
          color={selectedFormat === format ? Colors.background : Colors.text}
        />
        <Text
          style={[
            styles.formatButtonText,
            selectedFormat === format && styles.formatButtonTextActive,
          ]}
        >
          {t[format]}
        </Text>
      </TouchableOpacity>
    );
  };

  const categories: ExportCategory[] = ['all', 'members', 'sessions', 'payments', 'trainers', 'packages'];

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
          {/* Export Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Download size={24} color={Colors.primary} />
              <Text style={styles.sectionTitle}>{t.export}</Text>
            </View>

            <Text style={styles.subsectionTitle}>{t.selectFormat}</Text>
            <View style={styles.formatGrid}>
              {(['json', 'csv', 'excel'] as ExportFormat[]).map(renderFormatButton)}
            </View>

            <Text style={styles.subsectionTitle}>{t.selectCategories}</Text>
            <View style={styles.categoryGrid}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    selectedCategories.includes(category) && styles.categoryChipActive,
                  ]}
                  onPress={() => toggleCategory(category)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      selectedCategories.includes(category) && styles.categoryChipTextActive,
                    ]}
                  >
                    {t[category]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.exportButton}
              onPress={handleExport}
              disabled={loading}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                style={styles.exportButtonGradient}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={Colors.background} />
                ) : (
                  <>
                    <Download size={20} color={Colors.background} />
                    <Text style={styles.exportButtonText}>{t.exportData}</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Import Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Upload size={24} color={Colors.info} />
              <Text style={styles.sectionTitle}>{t.import}</Text>
            </View>

            <TouchableOpacity
              style={styles.importButton}
              onPress={handleImport}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={Colors.info} />
              ) : (
                <>
                  <Upload size={20} color={Colors.info} />
                  <Text style={styles.importButtonText}>{t.importData}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Export History */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={24} color={Colors.warning} />
              <Text style={styles.sectionTitle}>{t.exportHistory}</Text>
            </View>

            {exportHistory.length === 0 ? (
              <View style={styles.emptyState}>
                <Database size={48} color={Colors.textTertiary} />
                <Text style={styles.emptyStateText}>{t.noHistory}</Text>
              </View>
            ) : (
              <View style={styles.historyList}>
                {exportHistory.map((item, index) => {
                  const Icon = formatIcons[item.format];
                  return (
                    <View key={index} style={styles.historyItem}>
                      <View style={styles.historyIcon}>
                        <Icon size={24} color={Colors.primary} />
                      </View>
                      <View style={styles.historyInfo}>
                        <Text style={styles.historyFilename}>{item.filename}</Text>
                        <View style={styles.historyMeta}>
                          <Text style={styles.historyMetaText}>
                            {formatFileSize(item.size)}
                          </Text>
                          <Text style={styles.historyMetaText}>•</Text>
                          <Text style={styles.historyMetaText}>
                            {item.createdAt.toLocaleDateString()}
                          </Text>
                        </View>
                        <View style={styles.historyCategoriesRow}>
                          {item.categories.map((cat, idx) => (
                            <View key={idx} style={styles.historyCategoryBadge}>
                              <Text style={styles.historyCategoryText}>{t[cat]}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteExport(item.path, item.filename)}
                      >
                        <Trash2 size={20} color={Colors.error} />
                      </TouchableOpacity>
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
  section: { gap: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
  subsectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary, paddingLeft: 4 },
  formatGrid: { flexDirection: 'row', gap: 12 },
  formatButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  formatButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  formatButtonText: { fontSize: 13, fontWeight: '700', color: Colors.text },
  formatButtonTextActive: { color: Colors.background },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary + '20',
    borderColor: Colors.primary,
  },
  categoryChipText: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary },
  categoryChipTextActive: { color: Colors.primary },
  exportButton: { borderRadius: 12, overflow: 'hidden' },
  exportButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  exportButtonText: { fontSize: 16, fontWeight: '800', color: Colors.background },
  importButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: Colors.info,
  },
  importButtonText: { fontSize: 16, fontWeight: '800', color: Colors.info },
  emptyState: { alignItems: 'center', padding: 40, gap: 16 },
  emptyStateText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  historyList: { gap: 12 },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  historyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyInfo: { flex: 1, gap: 4 },
  historyFilename: { fontSize: 14, fontWeight: '700', color: Colors.text },
  historyMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  historyMetaText: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary },
  historyCategoriesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 },
  historyCategoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: Colors.surfaceLight,
  },
  historyCategoryText: { fontSize: 10, fontWeight: '700', color: Colors.textSecondary },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.error + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
