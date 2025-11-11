/**
 * Add Session Screen - Create new training session
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
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Calendar,
  Clock,
  Users,
  FileText,
  ChevronDown,
  User,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { MOCK_MEMBERS } from '@/constants/mockData';
import { useApp } from '@/contexts/AppContext';
import DateTimePicker from '@react-native-community/datetimepicker';

const GROUP_OPTIONS = [
  'Sabah Grubu',
  'Öğle Grubu',
  'Akşam Grubu',
  'Birebir Seans',
  'Hafta Sonu Özel',
  'Düet Seans',
];

export default function AddSessionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();

  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date(new Date().getTime() + 60 * 60 * 1000));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const [groupName, setGroupName] = useState('');
  const [showGroupPicker, setShowGroupPicker] = useState(false);
  const [capacity, setCapacity] = useState('8');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showMembersPicker, setShowMembersPicker] = useState(false);

  const texts = {
    tr: {
      title: 'Yeni Seans',
      dateTime: 'Tarih ve Saat',
      selectDate: 'Tarih Seç',
      startTime: 'Başlangıç Saati',
      endTime: 'Bitiş Saati',
      groupInfo: 'Grup Bilgileri',
      groupName: 'Grup Adı',
      selectGroup: 'Grup seç veya yeni isim girin',
      capacity: 'Kapasite',
      capacityPlaceholder: 'Maksimum katılımcı sayısı',
      description: 'Açıklama',
      descriptionPlaceholder: 'Seans açıklaması (opsiyonel)',
      participants: 'Katılımcılar',
      addParticipants: 'Katılımcı Ekle',
      selected: 'seçildi',
      save: 'Kaydet',
      cancel: 'İptal',
      error: 'Hata',
      fillRequired: 'Lütfen gerekli alanları doldurun',
      invalidTime: 'Bitiş saati başlangıç saatinden sonra olmalıdır',
      success: 'Başarılı',
      sessionCreated: 'Seans oluşturuldu',
    },
    en: {
      title: 'New Session',
      dateTime: 'Date and Time',
      selectDate: 'Select Date',
      startTime: 'Start Time',
      endTime: 'End Time',
      groupInfo: 'Group Information',
      groupName: 'Group Name',
      selectGroup: 'Select group or enter new name',
      capacity: 'Capacity',
      capacityPlaceholder: 'Maximum number of participants',
      description: 'Description',
      descriptionPlaceholder: 'Session description (optional)',
      participants: 'Participants',
      addParticipants: 'Add Participants',
      selected: 'selected',
      save: 'Save',
      cancel: 'Cancel',
      error: 'Error',
      fillRequired: 'Please fill required fields',
      invalidTime: 'End time must be after start time',
      success: 'Success',
      sessionCreated: 'Session created',
    },
  };

  const t = texts[language];

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const toggleMemberSelection = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const handleSave = () => {
    if (!groupName || !capacity) {
      Alert.alert(t.error, t.fillRequired);
      return;
    }

    if (endTime <= startTime) {
      Alert.alert(t.error, t.invalidTime);
      return;
    }

    // TODO: Save to backend
    Alert.alert(t.success, t.sessionCreated, [
      {
        text: 'Tamam',
        onPress: () => router.back(),
      },
    ]);
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
          {/* Date and Time Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.dateTime}</Text>

            {/* Date */}
            <TouchableOpacity
              style={styles.inputCard}
              onPress={() => setShowDatePicker(true)}
            >
              <Calendar size={20} color={Colors.primary} />
              <Text style={styles.inputText}>{formatDate(date)}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (selectedDate) setDate(selectedDate);
                }}
              />
            )}

            {/* Time Range */}
            <View style={styles.timeRow}>
              <TouchableOpacity
                style={[styles.inputCard, styles.timeCard]}
                onPress={() => setShowStartTimePicker(true)}
              >
                <Clock size={16} color={Colors.info} />
                <Text style={styles.timeLabel}>{t.startTime}</Text>
                <Text style={styles.timeValue}>{formatTime(startTime)}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.inputCard, styles.timeCard]}
                onPress={() => setShowEndTimePicker(true)}
              >
                <Clock size={16} color={Colors.secondary} />
                <Text style={styles.timeLabel}>{t.endTime}</Text>
                <Text style={styles.timeValue}>{formatTime(endTime)}</Text>
              </TouchableOpacity>
            </View>

            {showStartTimePicker && (
              <DateTimePicker
                value={startTime}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedTime) => {
                  setShowStartTimePicker(Platform.OS === 'ios');
                  if (selectedTime) setStartTime(selectedTime);
                }}
              />
            )}

            {showEndTimePicker && (
              <DateTimePicker
                value={endTime}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedTime) => {
                  setShowEndTimePicker(Platform.OS === 'ios');
                  if (selectedTime) setEndTime(selectedTime);
                }}
              />
            )}
          </View>

          {/* Group Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.groupInfo}</Text>

            {/* Group Name */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>{t.groupName}</Text>
              <TouchableOpacity
                style={styles.inputCard}
                onPress={() => setShowGroupPicker(true)}
              >
                <Users size={20} color={Colors.primary} />
                <Text style={[styles.inputText, !groupName && styles.placeholder]}>
                  {groupName || t.selectGroup}
                </Text>
                <ChevronDown size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Capacity */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>{t.capacity}</Text>
              <View style={styles.inputCard}>
                <Users size={20} color={Colors.accent} />
                <TextInput
                  style={styles.input}
                  placeholder={t.capacityPlaceholder}
                  placeholderTextColor={Colors.textTertiary}
                  value={capacity}
                  onChangeText={setCapacity}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            {/* Description */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>{t.description}</Text>
              <View style={[styles.inputCard, styles.textAreaCard]}>
                <FileText size={20} color={Colors.info} />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder={t.descriptionPlaceholder}
                  placeholderTextColor={Colors.textTertiary}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>
          </View>

          {/* Participants Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t.participants} ({selectedMembers.length})
            </Text>
            <TouchableOpacity
              style={styles.addParticipantsButton}
              onPress={() => setShowMembersPicker(true)}
            >
              <User size={20} color={Colors.primary} />
              <Text style={styles.addParticipantsText}>{t.addParticipants}</Text>
            </TouchableOpacity>

            {selectedMembers.length > 0 && (
              <View style={styles.selectedMembers}>
                {MOCK_MEMBERS.filter((m) => selectedMembers.includes(m.id)).map(
                  (member) => (
                    <View key={member.id} style={styles.memberChip}>
                      <Text style={styles.memberChipText}>
                        {member.firstName} {member.lastName}
                      </Text>
                    </View>
                  )
                )}
              </View>
            )}
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={styles.saveButtonGradient}
            >
              <Text style={styles.saveButtonText}>{t.save}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>

        {/* Group Picker Modal */}
        {showGroupPicker && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t.groupName}</Text>
                <TouchableOpacity onPress={() => setShowGroupPicker(false)}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent}>
                {GROUP_OPTIONS.map((group) => (
                  <TouchableOpacity
                    key={group}
                    style={styles.groupOption}
                    onPress={() => {
                      setGroupName(group);
                      setShowGroupPicker(false);
                    }}
                  >
                    <Text style={styles.groupOptionText}>{group}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.modalFooter}>
                <TextInput
                  style={styles.customGroupInput}
                  placeholder="Yeni grup adı girin..."
                  placeholderTextColor={Colors.textTertiary}
                  onSubmitEditing={(e) => {
                    if (e.nativeEvent.text) {
                      setGroupName(e.nativeEvent.text);
                      setShowGroupPicker(false);
                    }
                  }}
                />
              </View>
            </View>
          </View>
        )}

        {/* Members Picker Modal */}
        {showMembersPicker && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t.participants}</Text>
                <TouchableOpacity onPress={() => setShowMembersPicker(false)}>
                  <Text style={styles.modalClose}>✕</Text>
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
                  style={styles.doneButton}
                  onPress={() => setShowMembersPicker(false)}
                >
                  <LinearGradient
                    colors={[Colors.primary, Colors.primaryDark]}
                    style={styles.doneButtonGradient}
                  >
                    <Text style={styles.doneButtonText}>
                      Tamam ({selectedMembers.length})
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
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
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
  },
  inputText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  placeholder: {
    color: Colors.textTertiary,
    fontWeight: '400',
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeCard: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  timeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  timeValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
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
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },
  textAreaCard: {
    alignItems: 'flex-start',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  addParticipantsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  addParticipantsText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
  },
  selectedMembers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  memberChip: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  memberChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  saveButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonGradient: {
    padding: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
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
  groupOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceLight,
  },
  groupOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceLight,
  },
  customGroupInput: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
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
  doneButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  doneButtonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.background,
  },
});
