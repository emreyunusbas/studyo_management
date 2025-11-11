/**
 * Member Measurements Screen - Track member measurements
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
  Plus,
  Ruler,
  TrendingUp,
  Calendar,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { MOCK_MEMBERS } from '@/constants/mockData';
import { useApp } from '@/contexts/AppContext';
import type { Measurement } from '@/types';

// Mock measurements data
const MOCK_MEASUREMENTS: Measurement[] = [
  {
    id: '1',
    memberId: '1',
    date: '2025-11-01',
    title: 'Kilo',
    unit: 'kg',
    value: 72.5,
    notes: 'Hedef: 70kg',
    createdAt: '2025-11-01T10:00:00Z',
  },
  {
    id: '2',
    memberId: '1',
    date: '2025-11-01',
    title: 'Vücut Yağ Oranı',
    unit: '%',
    value: 18.5,
    createdAt: '2025-11-01T10:00:00Z',
  },
  {
    id: '3',
    memberId: '1',
    date: '2025-10-15',
    title: 'Kilo',
    unit: 'kg',
    value: 74,
    createdAt: '2025-10-15T10:00:00Z',
  },
];

export default function MemberMeasurementsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();
  const params = useLocalSearchParams();
  const preselectedMemberId = params.memberId as string | undefined;

  const [selectedMemberId, setSelectedMemberId] = useState(preselectedMemberId || '');
  const [showMemberPicker, setShowMemberPicker] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add measurement form
  const [measurementTitle, setMeasurementTitle] = useState('');
  const [measurementUnit, setMeasurementUnit] = useState('');
  const [measurementValue, setMeasurementValue] = useState('');
  const [measurementNotes, setMeasurementNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const texts = {
    tr: {
      title: 'Ölçümler',
      selectMember: 'Üye Seç',
      addMeasurement: 'Yeni Ölçüm',
      measurements: 'Ölçüm Kayıtları',
      noMeasurements: 'Henüz ölçüm kaydı yok',
      measurementTitle: 'Ölçüm Başlığı',
      unit: 'Birim',
      value: 'Değer',
      notes: 'Notlar',
      date: 'Tarih',
      save: 'Kaydet',
      cancel: 'İptal',
      optional: '(Opsiyonel)',
      examples: {
        title: 'Örn: Kilo, Boy, Göğüs, Bel',
        unit: 'Örn: kg, cm, %',
      },
    },
    en: {
      title: 'Measurements',
      selectMember: 'Select Member',
      addMeasurement: 'New Measurement',
      measurements: 'Measurement Records',
      noMeasurements: 'No measurement records yet',
      measurementTitle: 'Measurement Title',
      unit: 'Unit',
      value: 'Value',
      notes: 'Notes',
      date: 'Date',
      save: 'Save',
      cancel: 'Cancel',
      optional: '(Optional)',
      examples: {
        title: 'e.g: Weight, Height, Chest, Waist',
        unit: 'e.g: kg, cm, %',
      },
    },
  };

  const t = texts[language];

  const selectedMember = MOCK_MEMBERS.find((m) => m.id === selectedMemberId);
  const memberMeasurements = MOCK_MEASUREMENTS.filter(
    (m) => m.memberId === selectedMemberId
  );

  // Group measurements by date
  const groupedMeasurements = memberMeasurements.reduce((acc, measurement) => {
    const date = measurement.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(measurement);
    return acc;
  }, {} as Record<string, Measurement[]>);

  const handleAddMeasurement = async () => {
    if (!measurementTitle.trim()) {
      Alert.alert('Hata', 'Lütfen ölçüm başlığı girin');
      return;
    }
    if (!measurementUnit.trim()) {
      Alert.alert('Hata', 'Lütfen birim girin');
      return;
    }
    if (!measurementValue || parseFloat(measurementValue) <= 0) {
      Alert.alert('Hata', 'Lütfen geçerli bir değer girin');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement real API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Alert.alert('Başarılı', 'Ölçüm başarıyla eklendi!');
      setShowAddModal(false);
      // Reset form
      setMeasurementTitle('');
      setMeasurementUnit('');
      setMeasurementValue('');
      setMeasurementNotes('');
    } catch (error) {
      Alert.alert('Hata', 'Ölçüm eklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
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
          {selectedMemberId && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddModal(true)}
            >
              <Plus size={24} color={Colors.background} />
            </TouchableOpacity>
          )}
          {!selectedMemberId && <View style={{ width: 40 }} />}
        </View>

        {/* Member Selection */}
        <View style={styles.memberSection}>
          <TouchableOpacity
            style={styles.memberSelector}
            onPress={() => setShowMemberPicker(true)}
          >
            <Text
              style={[
                styles.memberSelectorText,
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

        {/* Measurements List */}
        {selectedMember && (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + 20 },
            ]}
          >
            {Object.keys(groupedMeasurements).length === 0 ? (
              <View style={styles.emptyState}>
                <Ruler size={64} color={Colors.textTertiary} />
                <Text style={styles.emptyText}>{t.noMeasurements}</Text>
              </View>
            ) : (
              Object.keys(groupedMeasurements)
                .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
                .map((date) => (
                  <View key={date} style={styles.dateGroup}>
                    <View style={styles.dateHeader}>
                      <Calendar size={16} color={Colors.primary} />
                      <Text style={styles.dateText}>{formatDate(date)}</Text>
                    </View>

                    <View style={styles.measurementsGrid}>
                      {groupedMeasurements[date].map((measurement) => (
                        <View key={measurement.id} style={styles.measurementCard}>
                          <LinearGradient
                            colors={[Colors.surface, Colors.surfaceLight]}
                            style={styles.measurementCardGradient}
                          >
                            <View style={styles.measurementHeader}>
                              <Ruler size={20} color={Colors.accent} />
                              <Text style={styles.measurementTitle}>
                                {measurement.title}
                              </Text>
                            </View>
                            <View style={styles.measurementBody}>
                              <Text style={styles.measurementValue}>
                                {measurement.value}
                              </Text>
                              <Text style={styles.measurementUnit}>
                                {measurement.unit}
                              </Text>
                            </View>
                            {measurement.notes && (
                              <Text style={styles.measurementNotes}>
                                {measurement.notes}
                              </Text>
                            )}
                          </LinearGradient>
                        </View>
                      ))}
                    </View>
                  </View>
                ))
            )}
          </ScrollView>
        )}

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

        {/* Add Measurement Modal */}
        <Modal
          visible={showAddModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowAddModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.addModalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t.addMeasurement}</Text>
                <TouchableOpacity onPress={() => setShowAddModal(false)}>
                  <X size={24} color={Colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.formScroll}>
                <View style={styles.formSection}>
                  <Text style={styles.label}>{t.measurementTitle}</Text>
                  <TextInput
                    style={styles.textInput}
                    value={measurementTitle}
                    onChangeText={setMeasurementTitle}
                    placeholder={t.examples.title}
                    placeholderTextColor={Colors.textTertiary}
                  />
                </View>

                <View style={styles.formRow}>
                  <View style={[styles.formSection, styles.formHalf]}>
                    <Text style={styles.label}>{t.unit}</Text>
                    <TextInput
                      style={styles.textInput}
                      value={measurementUnit}
                      onChangeText={setMeasurementUnit}
                      placeholder={t.examples.unit}
                      placeholderTextColor={Colors.textTertiary}
                    />
                  </View>

                  <View style={[styles.formSection, styles.formHalf]}>
                    <Text style={styles.label}>{t.value}</Text>
                    <TextInput
                      style={styles.textInput}
                      value={measurementValue}
                      onChangeText={setMeasurementValue}
                      placeholder="0"
                      placeholderTextColor={Colors.textTertiary}
                      keyboardType="decimal-pad"
                    />
                  </View>
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.label}>
                    {t.notes} {t.optional}
                  </Text>
                  <TextInput
                    style={styles.notesInput}
                    value={measurementNotes}
                    onChangeText={setMeasurementNotes}
                    placeholder={t.notes}
                    placeholderTextColor={Colors.textTertiary}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.buttonPrimary,
                      isLoading && styles.buttonDisabled,
                    ]}
                    onPress={handleAddMeasurement}
                    disabled={isLoading}
                  >
                    <Text style={styles.buttonPrimaryText}>
                      {isLoading ? '...' : t.save}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.buttonSecondary]}
                    onPress={() => setShowAddModal(false)}
                  >
                    <Text style={styles.buttonSecondaryText}>{t.cancel}</Text>
                  </TouchableOpacity>
                </View>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  memberSelector: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberSelectorText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  measurementsGrid: {
    gap: 12,
  },
  measurementCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  measurementCardGradient: {
    padding: 16,
    gap: 12,
  },
  measurementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  measurementTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  measurementBody: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  measurementValue: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.accent,
  },
  measurementUnit: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  measurementNotes: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
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
  addModalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
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
  formScroll: {
    padding: 20,
  },
  formSection: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formHalf: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    fontSize: 16,
    color: Colors.text,
  },
  notesInput: {
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    fontSize: 16,
    color: Colors.text,
    minHeight: 80,
  },
  modalButtons: {
    gap: 12,
    marginTop: 8,
  },
  button: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: Colors.accent,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonSecondary: {
    backgroundColor: Colors.backgroundLight,
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
});
