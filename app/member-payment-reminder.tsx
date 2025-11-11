/**
 * Member Payment Reminder Screen - Send payment reminders to members with outstanding balances
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  DollarSign,
  Send,
  Bell,
  MessageSquare,
  Calendar,
  AlertCircle,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { MOCK_MEMBERS } from '@/constants/mockData';
import { useApp } from '@/contexts/AppContext';

interface ReminderTemplate {
  id: string;
  title: string;
  message: string;
  tone: 'polite' | 'urgent' | 'friendly';
}

const REMINDER_TEMPLATES: ReminderTemplate[] = [
  {
    id: '1',
    title: 'Nazik Hatırlatma',
    message: 'Merhaba! {amount} tutarındaki kalan ödemenizi hatırlatmak isteriz. Detaylı bilgi için bize ulaşabilirsiniz.',
    tone: 'polite',
  },
  {
    id: '2',
    title: 'Acil Hatırlatma',
    message: 'Sayın üyemiz, {amount} tutarındaki ödemenizin son ödeme tarihi yaklaştı. Lütfen en kısa sürede ödemenizi gerçekleştiriniz.',
    tone: 'urgent',
  },
  {
    id: '3',
    title: 'Samimi Hatırlatma',
    message: 'Merhaba! 👋 {amount} tutarındaki kalan ödemeniz var. Ödeme yaptığınızda bize haber verirseniz seviniriz!',
    tone: 'friendly',
  },
  {
    id: '4',
    title: 'Taksit Hatırlatması',
    message: 'Merhaba! Aylık taksit ödemeniz ({amount}) için hatırlatma yapıyoruz. İyi günler dileriz.',
    tone: 'polite',
  },
];

export default function MemberPaymentReminderScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();
  const params = useLocalSearchParams();

  // Filter members with remaining payment
  const membersWithDebt = MOCK_MEMBERS.filter(
    (m) => m.remainingPayment && m.remainingPayment > 0
  );

  const [selectedMembers, setSelectedMembers] = useState<string[]>(
    params.memberId && membersWithDebt.find((m) => m.id === params.memberId)
      ? [params.memberId as string]
      : []
  );
  const [reminderMessage, setReminderMessage] = useState('');
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [reminderMethod, setReminderMethod] = useState<'notification' | 'sms'>(
    'notification'
  );

  const texts = {
    tr: {
      title: 'Ödeme Hatırlatması',
      membersWithDebt: 'Borcu Olan Üyeler',
      noDebt: 'Tüm ödemeler tamamlanmış',
      remainingPayment: 'Kalan Ödeme',
      selectMembers: 'Üye Seçin',
      selected: 'seçildi',
      reminderMethod: 'Hatırlatma Yöntemi',
      notification: 'Bildirim',
      sms: 'SMS',
      useTemplate: 'Şablon Kullan',
      customMessage: 'Özel Mesaj',
      messagePlaceholder: 'Hatırlatma mesajınızı yazın...',
      preview: 'Önizleme',
      sendReminder: 'Hatırlatma Gönder',
      selectTemplate: 'Şablon Seç',
      success: 'Başarılı',
      reminderSent: 'Hatırlatma gönderildi',
      error: 'Hata',
      selectAtLeastOne: 'Lütfen en az bir üye seçin',
      writeMessage: 'Lütfen bir mesaj yazın',
      totalDebt: 'Toplam Borç',
      memberCount: 'Üye Sayısı',
    },
    en: {
      title: 'Payment Reminder',
      membersWithDebt: 'Members with Outstanding Balance',
      noDebt: 'All payments completed',
      remainingPayment: 'Remaining Payment',
      selectMembers: 'Select Members',
      selected: 'selected',
      reminderMethod: 'Reminder Method',
      notification: 'Notification',
      sms: 'SMS',
      useTemplate: 'Use Template',
      customMessage: 'Custom Message',
      messagePlaceholder: 'Write your reminder message...',
      preview: 'Preview',
      sendReminder: 'Send Reminder',
      selectTemplate: 'Select Template',
      success: 'Success',
      reminderSent: 'Reminder sent',
      error: 'Error',
      selectAtLeastOne: 'Please select at least one member',
      writeMessage: 'Please write a message',
      totalDebt: 'Total Debt',
      memberCount: 'Member Count',
    },
  };

  const t = texts[language];

  const toggleMemberSelection = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const selectAllMembers = () => {
    setSelectedMembers(membersWithDebt.map((m) => m.id));
  };

  const clearSelection = () => {
    setSelectedMembers([]);
  };

  const useTemplate = (template: ReminderTemplate) => {
    setReminderMessage(template.message);
    setShowTemplatePicker(false);
  };

  const getTotalDebt = () => {
    return selectedMembers.reduce((total, memberId) => {
      const member = membersWithDebt.find((m) => m.id === memberId);
      return total + (member?.remainingPayment || 0);
    }, 0);
  };

  const handleSendReminder = () => {
    if (selectedMembers.length === 0) {
      Alert.alert(t.error, t.selectAtLeastOne);
      return;
    }

    if (!reminderMessage.trim()) {
      Alert.alert(t.error, t.writeMessage);
      return;
    }

    // TODO: Implement actual reminder sending
    const methodText = reminderMethod === 'notification' ? t.notification : t.sms;
    Alert.alert(
      t.success,
      `${selectedMembers.length} üyeye ${methodText.toLowerCase()} ile hatırlatma gönderildi`,
      [
        {
          text: 'Tamam',
          onPress: () => {
            setReminderMessage('');
            setSelectedMembers([]);
          },
        },
      ]
    );
  };

  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'polite':
        return Colors.info;
      case 'urgent':
        return Colors.warning;
      case 'friendly':
        return Colors.success;
      default:
        return Colors.primary;
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
            { paddingBottom: insets.bottom + 20 },
          ]}
        >
          {/* Statistics */}
          {selectedMembers.length > 0 && (
            <View style={styles.statsCard}>
              <LinearGradient
                colors={[Colors.warning, '#f59e0b']}
                style={styles.statsGradient}
              >
                <View style={styles.statItem}>
                  <DollarSign size={20} color={Colors.background} />
                  <Text style={styles.statLabel}>{t.totalDebt}</Text>
                  <Text style={styles.statValue}>₺{getTotalDebt()}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <AlertCircle size={20} color={Colors.background} />
                  <Text style={styles.statLabel}>{t.memberCount}</Text>
                  <Text style={styles.statValue}>{selectedMembers.length}</Text>
                </View>
              </LinearGradient>
            </View>
          )}

          {/* Members with Debt */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t.membersWithDebt}</Text>
              {membersWithDebt.length > 0 && (
                <View style={styles.selectionActions}>
                  <TouchableOpacity onPress={selectAllMembers}>
                    <Text style={styles.selectionActionText}>Tümünü Seç</Text>
                  </TouchableOpacity>
                  <Text style={styles.selectionDivider}>|</Text>
                  <TouchableOpacity onPress={clearSelection}>
                    <Text style={styles.selectionActionText}>Temizle</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {membersWithDebt.length > 0 ? (
              membersWithDebt.map((member) => {
                const isSelected = selectedMembers.includes(member.id);
                return (
                  <TouchableOpacity
                    key={member.id}
                    style={[
                      styles.memberCard,
                      isSelected && styles.memberCardSelected,
                    ]}
                    onPress={() => toggleMemberSelection(member.id)}
                  >
                    <View style={styles.memberAvatar}>
                      <Text style={styles.memberAvatarText}>
                        {member.firstName[0]}
                        {member.lastName[0]}
                      </Text>
                    </View>

                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName}>
                        {member.firstName} {member.lastName}
                      </Text>
                      <View style={styles.memberDebtRow}>
                        <DollarSign size={14} color={Colors.warning} />
                        <Text style={styles.memberDebt}>
                          {t.remainingPayment}: ₺{member.remainingPayment}
                        </Text>
                      </View>
                      {member.endDate && (
                        <View style={styles.memberDateRow}>
                          <Calendar size={14} color={Colors.textTertiary} />
                          <Text style={styles.memberDate}>
                            {new Date(member.endDate).toLocaleDateString('tr-TR')}
                          </Text>
                        </View>
                      )}
                    </View>

                    {isSelected && (
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={styles.emptyState}>
                <DollarSign size={48} color={Colors.success} />
                <Text style={styles.emptyStateText}>{t.noDebt}</Text>
              </View>
            )}
          </View>

          {/* Reminder Method */}
          {selectedMembers.length > 0 && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t.reminderMethod}</Text>
                <View style={styles.methodSelector}>
                  <TouchableOpacity
                    style={[
                      styles.methodOption,
                      reminderMethod === 'notification' && styles.methodOptionSelected,
                    ]}
                    onPress={() => setReminderMethod('notification')}
                  >
                    <Bell
                      size={24}
                      color={
                        reminderMethod === 'notification'
                          ? Colors.background
                          : Colors.primary
                      }
                    />
                    <Text
                      style={[
                        styles.methodText,
                        reminderMethod === 'notification' && styles.methodTextSelected,
                      ]}
                    >
                      {t.notification}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.methodOption,
                      reminderMethod === 'sms' && styles.methodOptionSelected,
                    ]}
                    onPress={() => setReminderMethod('sms')}
                  >
                    <MessageSquare
                      size={24}
                      color={
                        reminderMethod === 'sms' ? Colors.background : Colors.primary
                      }
                    />
                    <Text
                      style={[
                        styles.methodText,
                        reminderMethod === 'sms' && styles.methodTextSelected,
                      ]}
                    >
                      {t.sms}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Template Button */}
              <TouchableOpacity
                style={styles.templateButton}
                onPress={() => setShowTemplatePicker(true)}
              >
                <Text style={styles.templateButtonText}>{t.useTemplate}</Text>
              </TouchableOpacity>

              {/* Message Input */}
              <View style={styles.section}>
                <Text style={styles.formLabel}>{t.customMessage}</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder={t.messagePlaceholder}
                  placeholderTextColor={Colors.textTertiary}
                  value={reminderMessage}
                  onChangeText={setReminderMessage}
                  multiline
                  numberOfLines={6}
                  maxLength={500}
                />
                <Text style={styles.charCount}>{reminderMessage.length}/500</Text>
                <Text style={styles.hint}>
                  💡 {'{amount}'} yazarak otomatik tutar ekleyebilirsiniz
                </Text>
              </View>

              {/* Preview */}
              {reminderMessage && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>{t.preview}</Text>
                  <View style={styles.previewCard}>
                    <View style={styles.previewHeader}>
                      {reminderMethod === 'notification' ? (
                        <Bell size={16} color={Colors.warning} />
                      ) : (
                        <MessageSquare size={16} color={Colors.info} />
                      )}
                      <Text style={styles.previewMethod}>
                        {reminderMethod === 'notification' ? t.notification : t.sms}
                      </Text>
                    </View>
                    <Text style={styles.previewMessage}>
                      {reminderMessage.replace('{amount}', '₺500')}
                    </Text>
                  </View>
                </View>
              )}

              {/* Send Button */}
              <TouchableOpacity style={styles.sendButton} onPress={handleSendReminder}>
                <LinearGradient
                  colors={[Colors.warning, '#f59e0b']}
                  style={styles.sendButtonGradient}
                >
                  <Send size={20} color={Colors.background} />
                  <Text style={styles.sendButtonText}>{t.sendReminder}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>

        {/* Template Picker Modal */}
        {showTemplatePicker && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t.selectTemplate}</Text>
                <TouchableOpacity onPress={() => setShowTemplatePicker(false)}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent}>
                {REMINDER_TEMPLATES.map((template) => (
                  <TouchableOpacity
                    key={template.id}
                    style={styles.templateOption}
                    onPress={() => useTemplate(template)}
                  >
                    <View
                      style={[
                        styles.templateIcon,
                        { backgroundColor: getToneColor(template.tone) },
                      ]}
                    >
                      <DollarSign size={20} color={Colors.background} />
                    </View>
                    <View style={styles.templateContent}>
                      <Text style={styles.templateTitle}>{template.title}</Text>
                      <Text style={styles.templateMessage} numberOfLines={2}>
                        {template.message}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}
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
  statsCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: Colors.warning,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  statsGradient: {
    flexDirection: 'row',
    padding: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.background,
    opacity: 0.3,
    marginHorizontal: 16,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.background,
    opacity: 0.9,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.background,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  selectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectionActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  selectionDivider: {
    fontSize: 14,
    color: Colors.textTertiary,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    gap: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  memberCardSelected: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.background,
  },
  memberInfo: {
    flex: 1,
    gap: 4,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  memberDebtRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  memberDebt: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.warning,
  },
  memberDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  memberDate: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.background,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 12,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.success,
  },
  methodSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  methodOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.surfaceLight,
  },
  methodOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  methodText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  methodTextSelected: {
    color: Colors.background,
  },
  templateButton: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  templateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: Colors.textTertiary,
    textAlign: 'right',
    marginTop: 4,
  },
  hint: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
  previewCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: Colors.warning,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  previewMethod: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  previewMessage: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
  sendButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: Colors.warning,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sendButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 10,
  },
  sendButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.background,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
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
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  modalClose: {
    fontSize: 24,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  modalContent: {
    maxHeight: 400,
  },
  templateOption: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceLight,
  },
  templateIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  templateContent: {
    flex: 1,
    gap: 4,
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  templateMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
