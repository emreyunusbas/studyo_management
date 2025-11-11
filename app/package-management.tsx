/**
 * Package Management Screen - Manage session packages
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Plus,
  Package,
  Calendar,
  DollarSign,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { MOCK_PACKAGES } from '@/constants/mockData';
import { useApp } from '@/contexts/AppContext';

interface PackageData {
  id: string;
  name: string;
  sessionCount: number;
  price: number;
  validityDays: number;
  description?: string;
  isActive: boolean;
}

export default function PackageManagementScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();

  const [packages, setPackages] = useState<PackageData[]>(MOCK_PACKAGES);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageData | null>(null);

  // Form state
  const [packageName, setPackageName] = useState('');
  const [sessionCount, setSessionCount] = useState('');
  const [price, setPrice] = useState('');
  const [validityDays, setValidityDays] = useState('');
  const [description, setDescription] = useState('');

  const texts = {
    tr: {
      title: 'Paket Yönetimi',
      addPackage: 'Yeni Paket',
      editPackage: 'Paketi Düzenle',
      activePackages: 'Aktif Paketler',
      inactivePackages: 'Pasif Paketler',
      name: 'Paket Adı',
      sessions: 'Seans Sayısı',
      price: 'Fiyat',
      validity: 'Geçerlilik',
      description: 'Açıklama',
      days: 'gün',
      active: 'Aktif',
      inactive: 'Pasif',
      save: 'Kaydet',
      cancel: 'İptal',
      edit: 'Düzenle',
      delete: 'Sil',
      confirmDelete: 'Paketi Sil?',
      confirmDeleteMessage: 'Bu paketi silmek istediğinizden emin misiniz?',
      yes: 'Evet',
      no: 'Hayır',
      noPackages: 'Paket bulunamadı',
      required: 'Bu alan zorunludur',
      pricePerSession: 'Seans başına',
      statistics: 'İstatistikler',
      totalPackages: 'Toplam Paket',
      avgPrice: 'Ortalama Fiyat',
      totalSessions: 'Toplam Seans',
    },
    en: {
      title: 'Package Management',
      addPackage: 'New Package',
      editPackage: 'Edit Package',
      activePackages: 'Active Packages',
      inactivePackages: 'Inactive Packages',
      name: 'Package Name',
      sessions: 'Session Count',
      price: 'Price',
      validity: 'Validity',
      description: 'Description',
      days: 'days',
      active: 'Active',
      inactive: 'Inactive',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      confirmDelete: 'Delete Package?',
      confirmDeleteMessage: 'Are you sure you want to delete this package?',
      yes: 'Yes',
      no: 'No',
      noPackages: 'No packages found',
      required: 'This field is required',
      pricePerSession: 'Per session',
      statistics: 'Statistics',
      totalPackages: 'Total Packages',
      avgPrice: 'Average Price',
      totalSessions: 'Total Sessions',
    },
  };

  const t = texts[language];

  const activePackages = packages.filter((p) => p.isActive);
  const inactivePackages = packages.filter((p) => !p.isActive);

  // Calculate statistics
  const avgPrice =
    packages.length > 0
      ? packages.reduce((sum, p) => sum + p.price, 0) / packages.length
      : 0;
  const totalSessions = packages.reduce((sum, p) => sum + p.sessionCount, 0);

  const formatCurrency = (amount: number) => {
    return `₺${amount.toLocaleString('tr-TR')}`;
  };

  const openAddModal = () => {
    setEditingPackage(null);
    setPackageName('');
    setSessionCount('');
    setPrice('');
    setValidityDays('');
    setDescription('');
    setIsAddModalVisible(true);
  };

  const openEditModal = (pkg: PackageData) => {
    setEditingPackage(pkg);
    setPackageName(pkg.name);
    setSessionCount(pkg.sessionCount.toString());
    setPrice(pkg.price.toString());
    setValidityDays(pkg.validityDays.toString());
    setDescription(pkg.description || '');
    setIsAddModalVisible(true);
  };

  const handleSave = () => {
    if (!packageName.trim()) {
      Alert.alert(t.required, 'Paket adı girmelisiniz');
      return;
    }
    if (!sessionCount || parseInt(sessionCount) <= 0) {
      Alert.alert(t.required, 'Geçerli bir seans sayısı girmelisiniz');
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      Alert.alert(t.required, 'Geçerli bir fiyat girmelisiniz');
      return;
    }
    if (!validityDays || parseInt(validityDays) <= 0) {
      Alert.alert(t.required, 'Geçerli bir geçerlilik süresi girmelisiniz');
      return;
    }

    const packageData: PackageData = {
      id: editingPackage?.id || Date.now().toString(),
      name: packageName.trim(),
      sessionCount: parseInt(sessionCount),
      price: parseFloat(price),
      validityDays: parseInt(validityDays),
      description: description.trim() || undefined,
      isActive: editingPackage?.isActive ?? true,
    };

    if (editingPackage) {
      setPackages(packages.map((p) => (p.id === editingPackage.id ? packageData : p)));
    } else {
      setPackages([packageData, ...packages]);
    }

    setIsAddModalVisible(false);
  };

  const handleDelete = (pkg: PackageData) => {
    Alert.alert(t.confirmDelete, t.confirmDeleteMessage, [
      { text: t.no, style: 'cancel' },
      {
        text: t.yes,
        style: 'destructive',
        onPress: () => {
          setPackages(packages.filter((p) => p.id !== pkg.id));
        },
      },
    ]);
  };

  const toggleActive = (pkg: PackageData) => {
    setPackages(
      packages.map((p) => (p.id === pkg.id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const renderPackageCard = (pkg: PackageData) => {
    const pricePerSession = pkg.price / pkg.sessionCount;

    return (
      <View key={pkg.id} style={styles.packageCard}>
        <LinearGradient
          colors={pkg.isActive ? [Colors.surface, Colors.surfaceLight] : [Colors.surfaceLight, Colors.surface]}
          style={styles.packageGradient}
        >
          {/* Header */}
          <View style={styles.packageHeader}>
            <View style={styles.packageIcon}>
              <Package size={24} color={pkg.isActive ? Colors.primary : Colors.textSecondary} />
            </View>

            <View style={styles.packageTitleContainer}>
              <Text style={styles.packageName}>{pkg.name}</Text>
              <TouchableOpacity
                onPress={() => toggleActive(pkg)}
                style={[
                  styles.activeToggle,
                  { backgroundColor: pkg.isActive ? Colors.success : Colors.error },
                ]}
              >
                {pkg.isActive ? (
                  <CheckCircle size={12} color={Colors.background} />
                ) : (
                  <XCircle size={12} color={Colors.background} />
                )}
                <Text style={styles.activeText}>
                  {pkg.isActive ? t.active : t.inactive}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Description */}
          {pkg.description && (
            <Text style={styles.packageDescription}>{pkg.description}</Text>
          )}

          {/* Details */}
          <View style={styles.packageDetails}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Calendar size={16} color={Colors.info} />
                <Text style={styles.detailLabel}>{t.sessions}</Text>
              </View>
              <Text style={styles.detailValue}>{pkg.sessionCount}</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <DollarSign size={16} color={Colors.success} />
                <Text style={styles.detailLabel}>{t.price}</Text>
              </View>
              <Text style={styles.detailValue}>{formatCurrency(pkg.price)}</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <AlertCircle size={16} color={Colors.warning} />
                <Text style={styles.detailLabel}>{t.validity}</Text>
              </View>
              <Text style={styles.detailValue}>
                {pkg.validityDays} {t.days}
              </Text>
            </View>
          </View>

          {/* Price per session */}
          <View style={styles.pricePerSession}>
            <Text style={styles.pricePerSessionLabel}>{t.pricePerSession}:</Text>
            <Text style={styles.pricePerSessionValue}>
              {formatCurrency(pricePerSession)}
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.packageActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => openEditModal(pkg)}
            >
              <Edit size={18} color={Colors.info} />
              <Text style={styles.actionButtonText}>{t.edit}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDelete(pkg)}
            >
              <Trash2 size={18} color={Colors.error} />
              <Text style={[styles.actionButtonText, { color: Colors.error }]}>
                {t.delete}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
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
          <TouchableOpacity onPress={openAddModal} style={styles.addButton}>
            <Plus size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.miniStatCard}>
            <Package size={20} color={Colors.primary} />
            <View>
              <Text style={styles.miniStatValue}>{packages.length}</Text>
              <Text style={styles.miniStatLabel}>{t.totalPackages}</Text>
            </View>
          </View>

          <View style={styles.miniStatCard}>
            <DollarSign size={20} color={Colors.success} />
            <View>
              <Text style={styles.miniStatValue}>{formatCurrency(avgPrice)}</Text>
              <Text style={styles.miniStatLabel}>{t.avgPrice}</Text>
            </View>
          </View>

          <View style={styles.miniStatCard}>
            <Calendar size={20} color={Colors.info} />
            <View>
              <Text style={styles.miniStatValue}>{totalSessions}</Text>
              <Text style={styles.miniStatLabel}>{t.totalSessions}</Text>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
        >
          {/* Active Packages */}
          {activePackages.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.activePackages}</Text>
              {activePackages.map(renderPackageCard)}
            </View>
          )}

          {/* Inactive Packages */}
          {inactivePackages.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.inactivePackages}</Text>
              {inactivePackages.map(renderPackageCard)}
            </View>
          )}

          {/* Empty State */}
          {packages.length === 0 && (
            <View style={styles.emptyState}>
              <Package size={64} color={Colors.textTertiary} />
              <Text style={styles.emptyStateText}>{t.noPackages}</Text>
            </View>
          )}
        </ScrollView>

        {/* Add/Edit Modal */}
        <Modal
          visible={isAddModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsAddModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingPackage ? t.editPackage : t.addPackage}
                </Text>
                <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
                  <XCircle size={24} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll}>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>{t.name} *</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Örn: 12 Seans Paketi"
                    placeholderTextColor={Colors.textTertiary}
                    value={packageName}
                    onChangeText={setPackageName}
                  />
                </View>

                <View style={styles.formRow}>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.formLabel}>{t.sessions} *</Text>
                    <TextInput
                      style={styles.formInput}
                      placeholder="8"
                      placeholderTextColor={Colors.textTertiary}
                      keyboardType="number-pad"
                      value={sessionCount}
                      onChangeText={setSessionCount}
                    />
                  </View>

                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.formLabel}>{t.validity} (gün) *</Text>
                    <TextInput
                      style={styles.formInput}
                      placeholder="30"
                      placeholderTextColor={Colors.textTertiary}
                      keyboardType="number-pad"
                      value={validityDays}
                      onChangeText={setValidityDays}
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>{t.price} (₺) *</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="2400"
                    placeholderTextColor={Colors.textTertiary}
                    keyboardType="decimal-pad"
                    value={price}
                    onChangeText={setPrice}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>{t.description}</Text>
                  <TextInput
                    style={[styles.formInput, styles.formTextArea]}
                    placeholder="Paket açıklaması..."
                    placeholderTextColor={Colors.textTertiary}
                    multiline
                    numberOfLines={3}
                    value={description}
                    onChangeText={setDescription}
                  />
                </View>
              </ScrollView>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setIsAddModalVisible(false)}
                >
                  <Text style={styles.modalCancelText}>{t.cancel}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalSaveButton} onPress={handleSave}>
                  <LinearGradient
                    colors={[Colors.primary, Colors.primaryDark]}
                    style={styles.modalSaveGradient}
                  >
                    <Text style={styles.modalSaveText}>{t.save}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  miniStatCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
  },
  miniStatValue: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text,
  },
  miniStatLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
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
  packageCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  packageGradient: {
    padding: 16,
    gap: 12,
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  packageIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  packageTitleContainer: {
    flex: 1,
    gap: 4,
  },
  packageName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  activeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.background,
  },
  packageDescription: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  packageDetails: {
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceLight,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  pricePerSession: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceLight,
  },
  pricePerSessionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  pricePerSessionValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
  },
  packageActions: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceLight,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.background,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  emptyState: {
    paddingVertical: 80,
    alignItems: 'center',
    gap: 12,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceLight,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  modalScroll: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
  },
  formTextArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceLight,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  modalSaveButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalSaveGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.background,
  },
});
