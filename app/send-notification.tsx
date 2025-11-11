/**
 * Send Notification Screen - Send push notifications to members
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
  ChevronDown,
  User,
  Bell,
  Send,
  FileText,
  Users,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { MOCK_MEMBERS } from '@/constants/mockData';
import { useApp } from '@/contexts/AppContext';

interface NotificationTemplate {
  id: string;
  title: string;
  body: string;
  category: string;
}

// Notification templates
const NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  {
    id: '1',
    title: 'Seans Hatırlatması',
    body: 'Merhaba! Bugün saat {time} seansınız var. Görüşmek üzere!',
    category: 'reminder',
  },
  {
    id: '2',
    title: 'Hoş Geldiniz',
    body: 'Ailemize hoş geldiniz! İlk seansınızda başarılar dileriz.',
    category: 'welcome',
  },
  {
    id: '3',
    title: 'Tebrikler!',
    body: 'Harika ilerleme kaydediyorsunuz! Böyle devam edin.',
    category: 'motivation',
  },
  {
    id: '4',
    title: 'Paket Bitiş Uyarısı',
    body: 'Paketiniz {days} gün içinde sona erecek. Yenileme için iletişime geçebilirsiniz.',
    category: 'warning',
  },
  {
    id: '5',
    title: 'Kampanya Duyurusu',
    body: 'Yeni kampanyamız başladı! %{discount} indirim fırsatını kaçırmayın.',
    category: 'promotion',
  },
  {
    id: '6',
    title: 'Özel Gün Kutlaması',
    body: 'Doğum gününüz kutlu olsun! Size özel hediyemiz var.',
    category: 'celebration',
  },
];

export default function SendNotificationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();
  const params = useLocalSearchParams();

  const [selectedMembers, setSelectedMembers] = useState<string[]>(
    params.memberId ? [params.memberId as string] : []
  );
  const [showMemberPicker, setShowMemberPicker] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationBody, setNotificationBody] = useState('');
  const [sendToAll, setSendToAll] = useState(false);

  const texts = {
    tr: {
      title: 'Bildirim Gönder',
      selectMembers: 'Üye Seç',
      noMembersSelected: 'Üye seçilmedi',
      membersSelected: 'üye seçildi',
      sendToAll: 'Tüm Üyelere Gönder',
      useTemplate: 'Şablon Kullan',
      notificationTitle: 'Bildirim Başlığı',
      titlePlaceholder: 'Başlık girin...',
      notificationBody: 'Bildirim Metni',
      bodyPlaceholder: 'Mesajınızı yazın...',
      preview: 'Önizleme',
      send: 'Gönder',
      selectTemplate: 'Şablon Seç',
      customMessage: 'Özel Mesaj',
      templates: {
        reminder: 'Hatırlatma',
        welcome: 'Hoş Geldiniz',
        motivation: 'Motivasyon',
        warning: 'Uyarı',
        promotion: 'Kampanya',
        celebration: 'Kutlama',
      },
      success: 'Başarılı',
      notificationSent: 'Bildirim gönderildi',
      error: 'Hata',
      fillAllFields: 'Lütfen tüm alanları doldurun',
      selectAtLeastOne: 'Lütfen en az bir üye seçin',
    },
    en: {
      title: 'Send Notification',
      selectMembers: 'Select Members',
      noMembersSelected: 'No members selected',
      membersSelected: 'members selected',
      sendToAll: 'Send to All Members',
      useTemplate: 'Use Template',
      notificationTitle: 'Notification Title',
      titlePlaceholder: 'Enter title...',
      notificationBody: 'Notification Body',
      bodyPlaceholder: 'Write your message...',
      preview: 'Preview',
      send: 'Send',
      selectTemplate: 'Select Template',
      customMessage: 'Custom Message',
      templates: {
        reminder: 'Reminder',
        welcome: 'Welcome',
        motivation: 'Motivation',
        warning: 'Warning',
        promotion: 'Promotion',
        celebration: 'Celebration',
      },
      success: 'Success',
      notificationSent: 'Notification sent',
      error: 'Error',
      fillAllFields: 'Please fill all fields',
      selectAtLeastOne: 'Please select at least one member',
    },
  };

  const t = texts[language];

  const getSelectedMembersText = () => {
    if (sendToAll) return t.sendToAll;
    if (selectedMembers.length === 0) return t.noMembersSelected;
    if (selectedMembers.length === 1) {
      const member = MOCK_MEMBERS.find((m) => m.id === selectedMembers[0]);
      return member ? `${member.firstName} ${member.lastName}` : '';
    }
    return `${selectedMembers.length} ${t.membersSelected}`;
  };

  const toggleMemberSelection = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const selectAllMembers = () => {
    setSelectedMembers(MOCK_MEMBERS.map((m) => m.id));
  };

  const clearSelection = () => {
    setSelectedMembers([]);
  };

  const useTemplate = (template: NotificationTemplate) => {
    setNotificationTitle(template.title);
    setNotificationBody(template.body);
    setShowTemplatePicker(false);
  };

  const handleSend = () => {
    if (!notificationTitle.trim() || !notificationBody.trim()) {
      Alert.alert(t.error, t.fillAllFields);
      return;
    }

    if (!sendToAll && selectedMembers.length === 0) {
      Alert.alert(t.error, t.selectAtLeastOne);
      return;
    }

    // TODO: Implement actual notification sending
    Alert.alert(t.success, t.notificationSent, [
      {
        text: 'Tamam',
        onPress: () => {
          setNotificationTitle('');
          setNotificationBody('');
          setSelectedMembers([]);
          setSendToAll(false);
        },
      },
    ]);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'reminder':
        return Colors.info;
      case 'welcome':
        return Colors.success;
      case 'motivation':
        return Colors.primary;
      case 'warning':
        return Colors.warning;
      case 'promotion':
        return Colors.secondary;
      case 'celebration':
        return Colors.accent;
      default:
        return Colors.primary;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'reminder':
        return Bell;
      case 'welcome':
      case 'motivation':
      case 'celebration':
        return '🎉';
      case 'warning':
        return '⚠️';
      case 'promotion':
        return '🎁';
      default:
        return Bell;
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
          {/* Recipient Section */}
          <View style={styles.section}>
            {/* Send to All Toggle */}
            <TouchableOpacity
              style={styles.toggleRow}
              onPress={() => {
                setSendToAll(!sendToAll);
                if (!sendToAll) {
                  clearSelection();
                }
              }}
            >
              <View style={styles.toggleContent}>
                <Users size={20} color={Colors.primary} />
                <Text style={styles.toggleText}>{t.sendToAll}</Text>
              </View>
              <View
                style={[
                  styles.toggle,
                  sendToAll && styles.toggleActive,
                ]}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    sendToAll && styles.toggleThumbActive,
                  ]}
                />
              </View>
            </TouchableOpacity>

            {/* Member Selector */}
            {!sendToAll && (
              <TouchableOpacity
                style={styles.selector}
                onPress={() => setShowMemberPicker(true)}
              >
                <View style={styles.selectorContent}>
                  <User size={20} color={Colors.primary} />
                  <Text style={styles.selectorText}>{getSelectedMembersText()}</Text>
                </View>
                <ChevronDown size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Template Button */}
          <TouchableOpacity
            style={styles.templateButton}
            onPress={() => setShowTemplatePicker(true)}
          >
            <FileText size={20} color={Colors.accent} />
            <Text style={styles.templateButtonText}>{t.useTemplate}</Text>
          </TouchableOpacity>

          {/* Notification Form */}
          <View style={styles.section}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>{t.notificationTitle}</Text>
              <TextInput
                style={styles.input}
                placeholder={t.titlePlaceholder}
                placeholderTextColor={Colors.textTertiary}
                value={notificationTitle}
                onChangeText={setNotificationTitle}
                maxLength={100}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>{t.notificationBody}</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder={t.bodyPlaceholder}
                placeholderTextColor={Colors.textTertiary}
                value={notificationBody}
                onChangeText={setNotificationBody}
                multiline
                numberOfLines={6}
                maxLength={500}
              />
              <Text style={styles.charCount}>
                {notificationBody.length}/500
              </Text>
            </View>
          </View>

          {/* Preview */}
          {(notificationTitle || notificationBody) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.preview}</Text>
              <View style={styles.previewCard}>
                <View style={styles.previewHeader}>
                  <Bell size={16} color={Colors.primary} />
                  <Text style={styles.previewAppName}>PilatesSalon</Text>
                  <Text style={styles.previewTime}>şimdi</Text>
                </View>
                {notificationTitle && (
                  <Text style={styles.previewTitle}>{notificationTitle}</Text>
                )}
                {notificationBody && (
                  <Text style={styles.previewBody}>{notificationBody}</Text>
                )}
              </View>
            </View>
          )}

          {/* Send Button */}
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={styles.sendButtonGradient}
            >
              <Send size={20} color={Colors.background} />
              <Text style={styles.sendButtonText}>{t.send}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>

        {/* Member Picker Modal */}
        {showMemberPicker && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t.selectMembers}</Text>
                <TouchableOpacity onPress={() => setShowMemberPicker(false)}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalActionButton}
                  onPress={selectAllMembers}
                >
                  <Text style={styles.modalActionText}>Tümünü Seç</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalActionButton}
                  onPress={clearSelection}
                >
                  <Text style={styles.modalActionText}>Temizle</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent}>
                {MOCK_MEMBERS.map((member) => {
                  const isSelected = selectedMembers.includes(member.id);
                  return (
                    <TouchableOpacity
                      key={member.id}
                      style={[
                        styles.memberOption,
                        isSelected && styles.memberOptionSelected,
                      ]}
                      onPress={() => toggleMemberSelection(member.id)}
                    >
                      <View style={styles.memberAvatar}>
                        <Text style={styles.memberAvatarText}>
                          {member.firstName[0]}
                          {member.lastName[0]}
                        </Text>
                      </View>
                      <Text style={styles.memberOptionText}>
                        {member.firstName} {member.lastName}
                      </Text>
                      {isSelected && (
                        <View style={styles.checkmark}>
                          <Text style={styles.checkmarkText}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.modalDoneButton}
                  onPress={() => setShowMemberPicker(false)}
                >
                  <LinearGradient
                    colors={[Colors.primary, Colors.primaryDark]}
                    style={styles.modalDoneGradient}
                  >
                    <Text style={styles.modalDoneText}>
                      Tamam ({selectedMembers.length})
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

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
                {NOTIFICATION_TEMPLATES.map((template) => (
                  <TouchableOpacity
                    key={template.id}
                    style={styles.templateOption}
                    onPress={() => useTemplate(template)}
                  >
                    <View
                      style={[
                        styles.templateIcon,
                        { backgroundColor: getCategoryColor(template.category) },
                      ]}
                    >
                      <Bell size={20} color={Colors.background} />
                    </View>
                    <View style={styles.templateContent}>
                      <Text style={styles.templateTitle}>{template.title}</Text>
                      <Text style={styles.templateBody} numberOfLines={2}>
                        {template.body}
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
  section: {
    marginBottom: 24,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  toggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surfaceLight,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: Colors.primary,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.text,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectorText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  templateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.accent,
    borderStyle: 'dashed',
  },
  templateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.accent,
  },
  formGroup: {
    gap: 8,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
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
  },
  previewCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  previewAppName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  previewTime: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  previewBody: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  sendButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: Colors.primary,
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
    maxHeight: '80%',
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
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceLight,
  },
  modalActionButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  modalActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  modalContent: {
    maxHeight: 400,
  },
  memberOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceLight,
  },
  memberOptionSelected: {
    backgroundColor: Colors.surfaceLight,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.background,
  },
  memberOptionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.background,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceLight,
  },
  modalDoneButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalDoneGradient: {
    padding: 16,
    alignItems: 'center',
  },
  modalDoneText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.background,
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
  templateBody: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
