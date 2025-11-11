/**
 * Member Renew Package Screen - Renew member's package
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronDown, X, Package, Calendar, CreditCard } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { MOCK_MEMBERS } from '@/constants/mockData';
import { useApp } from '@/contexts/AppContext';

interface PackageOption {
  id: string;
  name: string;
  sessionCount: number;
  price: number;
  validityDays: number;
}

export default function MemberRenewPackageScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();
  const params = useLocalSearchParams();
  const preselectedMemberId = params.memberId as string | undefined;

  const [selectedMemberId, setSelectedMemberId] = useState(preselectedMemberId || '');
  const [selectedPackage, setSelectedPackage] = useState<PackageOption | null>(null);
  const [paidAmount, setPaidAmount] = useState('');
  const [showMemberPicker, setShowMemberPicker] = useState(false);
  const [showPackagePicker, setShowPackagePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const texts = {
    tr: {
      title: 'Paket Yenile',
      selectMember: 'Üye Seç',
      currentPackage: 'Mevcut Paket',
      newPackage: 'Yeni Paket',
      selectPackage: 'Paket Seç',
      packageInfo: 'Paket Bilgileri',
      sessionCount: 'Seans Sayısı',
      validity: 'Geçerlilik',
      price: 'Fiyat',
      payment: 'Ödeme',
      paidAmount: 'Ödenen Tutar',
      remainingAmount: 'Kalan Tutar',
      renew: 'Paketi Yenile',
      cancel: 'İptal',
      days: 'gün',
      sessions: 'seans',
      remainingSessions: 'Kalan Seans',
      endDate: 'Bitiş Tarihi',
    },
    en: {
      title: 'Renew Package',
      selectMember: 'Select Member',
      currentPackage: 'Current Package',
      newPackage: 'New Package',
      selectPackage: 'Select Package',
      packageInfo: 'Package Information',
      sessionCount: 'Session Count',
      validity: 'Validity',
      price: 'Price',
      payment: 'Payment',
      paidAmount: 'Paid Amount',
      remainingAmount: 'Remaining Amount',
      renew: 'Renew Package',
      cancel: 'Cancel',
      days: 'days',
      sessions: 'sessions',
      remainingSessions: 'Remaining Sessions',
      endDate: 'End Date',
    },
  };

  const t = texts[language];

  // Mock packages
  const packages: PackageOption[] = [
    { id: '1', name: '8 Seans Paketi', sessionCount: 8, price: 2400, validityDays: 30 },
    { id: '2', name: '12 Seans Paketi', sessionCount: 12, price: 3200, validityDays: 45 },
    { id: '3', name: '16 Seans Paketi', sessionCount: 16, price: 4000, validityDays: 60 },
    { id: '4', name: '24 Seans Paketi', sessionCount: 24, price: 5600, validityDays: 90 },
  ];

  const selectedMember = MOCK_MEMBERS.find((m) => m.id === selectedMemberId);

  const remainingPayment = selectedPackage && paidAmount
    ? selectedPackage.price - parseFloat(paidAmount)
    : selectedPackage?.price || 0;

  const handleRenew = async () => {
    if (!selectedMemberId) {
      Alert.alert('Hata', 'Lütfen üye seçin');
      return;
    }
    if (!selectedPackage) {
      Alert.alert('Hata', 'Lütfen paket seçin');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement real API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Alert.alert('Başarılı', 'Paket başarıyla yenilendi!', [
        {
          text: 'Tamam',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert('Hata', 'Paket yenilenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
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
            { paddingBottom: insets.bottom + 40 },
          ]}
        >
          {/* Member Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>{t.selectMember}</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowMemberPicker(true)}
            >
              <Text
                style={[
                  styles.inputText,
                  !selectedMember && { color: Colors.textTertiary },
                ]}
              >
                {selectedMember
                  ? `${selectedMember.firstName} ${selectedMember.lastName}`
                  : t.selectMember}
              </Text>
              <ChevronDown size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Current Package Info */}
          {selectedMember && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.currentPackage}</Text>
              <View style={styles.infoCard}>
                <LinearGradient
                  colors={[Colors.surface, Colors.surfaceLight]}
                  style={styles.infoCardGradient}
                >
                  <View style={styles.infoRow}>
                    <Package size={20} color={Colors.primary} />
                    <Text style={styles.infoText}>
                      {t.remainingSessions}: {selectedMember.remainingCredits}/
                      {selectedMember.openableCredits}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Calendar size={20} color={Colors.info} />
                    <Text style={styles.infoText}>
                      {t.endDate}: {new Date(selectedMember.endDate).toLocaleDateString('tr-TR')}
                    </Text>
                  </View>
                </LinearGradient>
              </View>
            </View>
          )}

          {/* New Package Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>{t.newPackage}</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowPackagePicker(true)}
            >
              <Text
                style={[
                  styles.inputText,
                  !selectedPackage && { color: Colors.textTertiary },
                ]}
              >
                {selectedPackage ? selectedPackage.name : t.selectPackage}
              </Text>
              <ChevronDown size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Package Details */}
          {selectedPackage && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.packageInfo}</Text>
              <View style={styles.detailsGrid}>
                <View style={styles.detailCard}>
                  <Text style={styles.detailLabel}>{t.sessionCount}</Text>
                  <Text style={styles.detailValue}>
                    {selectedPackage.sessionCount} {t.sessions}
                  </Text>
                </View>
                <View style={styles.detailCard}>
                  <Text style={styles.detailLabel}>{t.validity}</Text>
                  <Text style={styles.detailValue}>
                    {selectedPackage.validityDays} {t.days}
                  </Text>
                </View>
                <View style={styles.detailCard}>
                  <Text style={styles.detailLabel}>{t.price}</Text>
                  <Text style={[styles.detailValue, { color: Colors.primary }]}>
                    ₺{selectedPackage.price}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Payment Info */}
          {selectedPackage && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.payment}</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t.paidAmount}</Text>
                <TextInput
                  style={styles.textInput}
                  value={paidAmount}
                  onChangeText={setPaidAmount}
                  placeholder="0"
                  placeholderTextColor={Colors.textTertiary}
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.paymentSummary}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{t.price}</Text>
                  <Text style={styles.summaryValue}>₺{selectedPackage.price}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{t.paidAmount}</Text>
                  <Text style={[styles.summaryValue, { color: Colors.success }]}>
                    ₺{paidAmount || 0}
                  </Text>
                </View>
                <View style={[styles.summaryRow, styles.summaryTotal]}>
                  <Text style={styles.summaryTotalLabel}>{t.remainingAmount}</Text>
                  <Text
                    style={[
                      styles.summaryTotalValue,
                      { color: remainingPayment > 0 ? Colors.warning : Colors.success },
                    ]}
                  >
                    ₺{remainingPayment}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.buttonPrimary,
                (!selectedMemberId || !selectedPackage || isLoading) && styles.buttonDisabled,
              ]}
              onPress={handleRenew}
              disabled={!selectedMemberId || !selectedPackage || isLoading}
            >
              <Text style={styles.buttonPrimaryText}>
                {isLoading ? '...' : t.renew}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={() => router.back()}
            >
              <Text style={styles.buttonSecondaryText}>{t.cancel}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Member Picker Modal */}
        <Modal
          visible={showMemberPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowMemberPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t.selectMember}</Text>
                <TouchableOpacity onPress={() => setShowMemberPicker(false)}>
                  <X size={24} color={Colors.text} />
                </TouchableOpacity>
              </View>
              <ScrollView>
                {MOCK_MEMBERS.map((member) => (
                  <TouchableOpacity
                    key={member.id}
                    style={styles.memberItem}
                    onPress={() => {
                      setSelectedMemberId(member.id);
                      setShowMemberPicker(false);
                    }}
                  >
                    <View style={styles.memberAvatar}>
                      <Text style={styles.memberAvatarText}>
                        {member.firstName[0]}
                        {member.lastName[0]}
                      </Text>
                    </View>
                    <Text style={styles.memberName}>
                      {member.firstName} {member.lastName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Package Picker Modal */}
        <Modal
          visible={showPackagePicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPackagePicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t.selectPackage}</Text>
                <TouchableOpacity onPress={() => setShowPackagePicker(false)}>
                  <X size={24} color={Colors.text} />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.packageList}>
                {packages.map((pkg) => (
                  <TouchableOpacity
                    key={pkg.id}
                    style={styles.packageItem}
                    onPress={() => {
                      setSelectedPackage(pkg);
                      setShowPackagePicker(false);
                    }}
                  >
                    <LinearGradient
                      colors={[Colors.surface, Colors.surfaceLight]}
                      style={styles.packageItemGradient}
                    >
                      <Text style={styles.packageName}>{pkg.name}</Text>
                      <View style={styles.packageDetails}>
                        <Text style={styles.packageDetail}>
                          {pkg.sessionCount} {t.sessions}
                        </Text>
                        <Text style={styles.packageDetail}>•</Text>
                        <Text style={styles.packageDetail}>
                          {pkg.validityDays} {t.days}
                        </Text>
                      </View>
                      <Text style={styles.packagePrice}>₺{pkg.price}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  infoCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  infoCardGradient: {
    padding: 16,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  detailCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  inputGroup: {
    gap: 8,
  },
  textInput: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    fontSize: 16,
    color: Colors.text,
  },
  paymentSummary: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    gap: 12,
    marginTop: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  summaryTotal: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  summaryTotalValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonSecondary: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPrimaryText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.background,
  },
  buttonSecondaryText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.background,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  packageList: {
    padding: 20,
  },
  packageItem: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  packageItemGradient: {
    padding: 20,
    gap: 8,
  },
  packageName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  packageDetails: {
    flexDirection: 'row',
    gap: 8,
  },
  packageDetail: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  packagePrice: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 8,
  },
});
