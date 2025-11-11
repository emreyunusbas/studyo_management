/**
 * Member Payment Screen - Receive payment from member
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
import {
  ChevronLeft,
  ChevronDown,
  X,
  CreditCard,
  Banknote,
  Wallet,
  DollarSign,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { MOCK_MEMBERS } from '@/constants/mockData';
import { useApp } from '@/contexts/AppContext';
import type { PaymentMethod } from '@/types';

export default function MemberPaymentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();
  const params = useLocalSearchParams();
  const preselectedMemberId = params.memberId as string | undefined;

  const [selectedMemberId, setSelectedMemberId] = useState(preselectedMemberId || '');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [notes, setNotes] = useState('');
  const [showMemberPicker, setShowMemberPicker] = useState(false);
  const [showPaymentMethodPicker, setShowPaymentMethodPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const texts = {
    tr: {
      title: 'Ödeme Al',
      selectMember: 'Üye Seç',
      memberInfo: 'Üye Bilgileri',
      remainingPayment: 'Kalan Ödeme',
      paymentAmount: 'Ödeme Tutarı',
      paymentMethod: 'Ödeme Yöntemi',
      notes: 'Notlar',
      paymentMethods: {
        CASH: 'Nakit',
        CARD: 'Kredi/Banka Kartı',
        BANK_TRANSFER: 'Banka Transferi',
        LINK_PAY: 'Link ile Ödeme',
        COUPON: 'Kupon',
      },
      selectPaymentMethod: 'Ödeme Yöntemi Seç',
      fullPayment: 'Tümünü Öde',
      save: 'Ödeme Al',
      cancel: 'İptal',
      optional: '(Opsiyonel)',
    },
    en: {
      title: 'Receive Payment',
      selectMember: 'Select Member',
      memberInfo: 'Member Information',
      remainingPayment: 'Remaining Payment',
      paymentAmount: 'Payment Amount',
      paymentMethod: 'Payment Method',
      notes: 'Notes',
      paymentMethods: {
        CASH: 'Cash',
        CARD: 'Credit/Debit Card',
        BANK_TRANSFER: 'Bank Transfer',
        LINK_PAY: 'Link Payment',
        COUPON: 'Coupon',
      },
      selectPaymentMethod: 'Select Payment Method',
      fullPayment: 'Pay Full',
      save: 'Receive Payment',
      cancel: 'Cancel',
      optional: '(Optional)',
    },
  };

  const t = texts[language];

  const selectedMember = MOCK_MEMBERS.find((m) => m.id === selectedMemberId);
  const remainingPayment = selectedMember?.remainingPayment || 0;

  const paymentMethodOptions: { id: PaymentMethod; icon: React.ReactNode }[] = [
    { id: 'CASH', icon: <Banknote size={24} color={Colors.success} /> },
    { id: 'CARD', icon: <CreditCard size={24} color={Colors.info} /> },
    { id: 'BANK_TRANSFER', icon: <Wallet size={24} color={Colors.accent} /> },
    { id: 'LINK_PAY', icon: <DollarSign size={24} color={Colors.secondary} /> },
    { id: 'COUPON', icon: <CreditCard size={24} color={Colors.warning} /> },
  ];

  const handleFullPayment = () => {
    setPaymentAmount(remainingPayment.toString());
  };

  const handleSave = async () => {
    if (!selectedMemberId) {
      Alert.alert('Hata', 'Lütfen üye seçin');
      return;
    }
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      Alert.alert('Hata', 'Lütfen geçerli bir tutar girin');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement real API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Alert.alert('Başarılı', 'Ödeme başarıyla kaydedildi!', [
        {
          text: 'Tamam',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert('Hata', 'Ödeme kaydedilirken bir hata oluştu');
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

          {/* Member Info & Remaining Payment */}
          {selectedMember && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.memberInfo}</Text>
              <View style={styles.paymentCard}>
                <LinearGradient
                  colors={[Colors.surface, Colors.surfaceLight]}
                  style={styles.paymentCardGradient}
                >
                  <CreditCard size={32} color={Colors.warning} />
                  <Text style={styles.remainingLabel}>{t.remainingPayment}</Text>
                  <Text style={styles.remainingValue}>₺{remainingPayment}</Text>
                  {remainingPayment > 0 && (
                    <TouchableOpacity
                      style={styles.fullPaymentButton}
                      onPress={handleFullPayment}
                    >
                      <Text style={styles.fullPaymentText}>{t.fullPayment}</Text>
                    </TouchableOpacity>
                  )}
                </LinearGradient>
              </View>
            </View>
          )}

          {/* Payment Amount */}
          <View style={styles.section}>
            <Text style={styles.label}>{t.paymentAmount}</Text>
            <TextInput
              style={styles.amountInput}
              value={paymentAmount}
              onChangeText={setPaymentAmount}
              placeholder="0"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="decimal-pad"
            />
          </View>

          {/* Payment Method */}
          <View style={styles.section}>
            <Text style={styles.label}>{t.paymentMethod}</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowPaymentMethodPicker(true)}
            >
              <View style={styles.methodRow}>
                {paymentMethodOptions.find((m) => m.id === paymentMethod)?.icon}
                <Text style={styles.inputText}>{t.paymentMethods[paymentMethod]}</Text>
              </View>
              <ChevronDown size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <Text style={styles.label}>
              {t.notes} {t.optional}
            </Text>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder={t.notes}
              placeholderTextColor={Colors.textTertiary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.buttonPrimary,
                (!selectedMemberId || !paymentAmount || isLoading) && styles.buttonDisabled,
              ]}
              onPress={handleSave}
              disabled={!selectedMemberId || !paymentAmount || isLoading}
            >
              <Text style={styles.buttonPrimaryText}>
                {isLoading ? '...' : t.save}
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
                    <View style={styles.memberItemInfo}>
                      <Text style={styles.memberName}>
                        {member.firstName} {member.lastName}
                      </Text>
                      {member.remainingPayment && member.remainingPayment > 0 && (
                        <Text style={styles.memberPayment}>₺{member.remainingPayment} kalan</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Payment Method Picker Modal */}
        <Modal
          visible={showPaymentMethodPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPaymentMethodPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t.selectPaymentMethod}</Text>
                <TouchableOpacity onPress={() => setShowPaymentMethodPicker(false)}>
                  <X size={24} color={Colors.text} />
                </TouchableOpacity>
              </View>
              <View style={styles.optionsContainer}>
                {paymentMethodOptions.map((method) => (
                  <TouchableOpacity
                    key={method.id}
                    style={styles.methodOption}
                    onPress={() => {
                      setPaymentMethod(method.id);
                      setShowPaymentMethodPicker(false);
                    }}
                  >
                    <LinearGradient
                      colors={[Colors.surface, Colors.surfaceLight]}
                      style={styles.methodOptionGradient}
                    >
                      {method.icon}
                      <Text style={styles.methodOptionText}>
                        {t.paymentMethods[method.id]}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
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
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  paymentCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.warning,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  paymentCardGradient: {
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  remainingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  remainingValue: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.warning,
  },
  fullPaymentButton: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.primary,
  },
  fullPaymentText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.background,
  },
  amountInput: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 12,
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
  },
  notesInput: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    fontSize: 16,
    color: Colors.text,
    minHeight: 100,
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
    backgroundColor: Colors.success,
    shadowColor: Colors.success,
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
    color: Colors.text,
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
  memberItemInfo: {
    flex: 1,
    gap: 4,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  memberPayment: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.warning,
  },
  optionsContainer: {
    padding: 20,
    gap: 12,
  },
  methodOption: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  methodOptionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  methodOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
});
