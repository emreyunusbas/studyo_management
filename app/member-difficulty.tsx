/**
 * Member Difficulty Screen - Track member exercise difficulty levels over time
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
  Calendar,
  TrendingUp,
  Plus,
  Activity,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { MOCK_MEMBERS } from '@/constants/mockData';
import { useApp } from '@/contexts/AppContext';

interface DifficultyRecord {
  id: string;
  date: string;
  difficulty: number; // 1-5
  sessionType: string;
  notes?: string;
}

// Mock difficulty records
const MOCK_DIFFICULTY_RECORDS: DifficultyRecord[] = [
  {
    id: '1',
    date: '2025-01-10',
    difficulty: 3,
    sessionType: 'Core Güçlendirme',
    notes: 'Reformer egzersizlerinde zorluk yaşadı',
  },
  {
    id: '2',
    date: '2025-01-08',
    difficulty: 2,
    sessionType: 'Esneklik Çalışması',
    notes: 'İyi ilerliyor, daha rahat yapıyor',
  },
  {
    id: '3',
    date: '2025-01-05',
    difficulty: 4,
    sessionType: 'Kuvvet Antrenmanı',
    notes: 'Yeni hareketler ekledik, biraz zorlandı',
  },
  {
    id: '4',
    date: '2025-01-03',
    difficulty: 3,
    sessionType: 'Denge ve Koordinasyon',
  },
  {
    id: '5',
    date: '2025-01-01',
    difficulty: 3,
    sessionType: 'Genel Pilates',
    notes: 'Başlangıç seviyesi',
  },
];

export default function MemberDifficultyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();
  const params = useLocalSearchParams();

  const [selectedMember, setSelectedMember] = useState(
    params.memberId
      ? MOCK_MEMBERS.find((m) => m.id === params.memberId) || null
      : null
  );
  const [showMemberPicker, setShowMemberPicker] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [difficultyRecords, setDifficultyRecords] = useState<DifficultyRecord[]>(
    MOCK_DIFFICULTY_RECORDS
  );

  // Form state
  const [selectedDifficulty, setSelectedDifficulty] = useState<number>(3);
  const [sessionType, setSessionType] = useState('');
  const [notes, setNotes] = useState('');

  const texts = {
    tr: {
      title: 'Zorlanma Derecesi',
      selectMember: 'Üye Seç',
      noMemberSelected: 'Lütfen bir üye seçin',
      averageDifficulty: 'Ortalama Zorluk',
      recentTrend: 'Son Eğilim',
      totalRecords: 'Toplam Kayıt',
      addRecord: 'Kayıt Ekle',
      difficultyHistory: 'Zorluk Geçmişi',
      noRecords: 'Henüz kayıt yok',
      startTracking: 'İlk kaydı ekleyerek takibe başlayın',
      difficultyLevel: 'Zorluk Seviyesi',
      veryEasy: 'Çok Kolay',
      easy: 'Kolay',
      moderate: 'Orta',
      hard: 'Zor',
      veryHard: 'Çok Zor',
      sessionType: 'Seans Türü',
      sessionTypePlaceholder: 'Örn: Core Güçlendirme',
      notes: 'Notlar',
      notesPlaceholder: 'Opsiyonel notlar ekleyin...',
      save: 'Kaydet',
      cancel: 'İptal',
      increasing: 'Artıyor',
      decreasing: 'Azalıyor',
      stable: 'Stabil',
    },
    en: {
      title: 'Difficulty Tracking',
      selectMember: 'Select Member',
      noMemberSelected: 'Please select a member',
      averageDifficulty: 'Average Difficulty',
      recentTrend: 'Recent Trend',
      totalRecords: 'Total Records',
      addRecord: 'Add Record',
      difficultyHistory: 'Difficulty History',
      noRecords: 'No records yet',
      startTracking: 'Add the first record to start tracking',
      difficultyLevel: 'Difficulty Level',
      veryEasy: 'Very Easy',
      easy: 'Easy',
      moderate: 'Moderate',
      hard: 'Hard',
      veryHard: 'Very Hard',
      sessionType: 'Session Type',
      sessionTypePlaceholder: 'e.g., Core Strengthening',
      notes: 'Notes',
      notesPlaceholder: 'Add optional notes...',
      save: 'Save',
      cancel: 'Cancel',
      increasing: 'Increasing',
      decreasing: 'Decreasing',
      stable: 'Stable',
    },
  };

  const t = texts[language];

  const difficultyLabels = [
    t.veryEasy,
    t.easy,
    t.moderate,
    t.hard,
    t.veryHard,
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const calculateAverage = () => {
    if (difficultyRecords.length === 0) return 0;
    const sum = difficultyRecords.reduce((acc, record) => acc + record.difficulty, 0);
    return (sum / difficultyRecords.length).toFixed(1);
  };

  const getTrend = () => {
    if (difficultyRecords.length < 2) return t.stable;
    const recent = difficultyRecords.slice(0, 3);
    const older = difficultyRecords.slice(3, 6);

    if (older.length === 0) return t.stable;

    const recentAvg = recent.reduce((acc, r) => acc + r.difficulty, 0) / recent.length;
    const olderAvg = older.reduce((acc, r) => acc + r.difficulty, 0) / older.length;

    if (recentAvg > olderAvg + 0.3) return t.increasing;
    if (recentAvg < olderAvg - 0.3) return t.decreasing;
    return t.stable;
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 1) return Colors.success;
    if (difficulty <= 2) return '#90EE90';
    if (difficulty <= 3) return Colors.warning;
    if (difficulty <= 4) return Colors.secondary;
    return Colors.error;
  };

  const handleAddRecord = () => {
    if (!sessionType.trim()) {
      Alert.alert('Hata', 'Lütfen seans türünü girin');
      return;
    }

    const newRecord: DifficultyRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      difficulty: selectedDifficulty,
      sessionType: sessionType.trim(),
      notes: notes.trim() || undefined,
    };

    setDifficultyRecords([newRecord, ...difficultyRecords]);
    setShowAddModal(false);
    setSessionType('');
    setNotes('');
    setSelectedDifficulty(3);
    Alert.alert('Başarılı', 'Kayıt eklendi');
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

        {/* Member Selector */}
        <View style={styles.selectorContainer}>
          <TouchableOpacity
            style={styles.selector}
            onPress={() => setShowMemberPicker(true)}
          >
            <View style={styles.selectorContent}>
              <User size={20} color={Colors.primary} />
              <Text style={styles.selectorText}>
                {selectedMember
                  ? `${selectedMember.firstName} ${selectedMember.lastName}`
                  : t.selectMember}
              </Text>
            </View>
            <ChevronDown size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {selectedMember ? (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + 20 },
            ]}
          >
            {/* Statistics */}
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Activity size={24} color={Colors.primary} />
                <Text style={styles.statLabel}>{t.averageDifficulty}</Text>
                <Text style={styles.statValue}>{calculateAverage()}/5</Text>
              </View>

              <View style={styles.statCard}>
                <TrendingUp size={24} color={Colors.info} />
                <Text style={styles.statLabel}>{t.recentTrend}</Text>
                <Text style={styles.statValue}>{getTrend()}</Text>
              </View>

              <View style={styles.statCard}>
                <Calendar size={24} color={Colors.accent} />
                <Text style={styles.statLabel}>{t.totalRecords}</Text>
                <Text style={styles.statValue}>{difficultyRecords.length}</Text>
              </View>
            </View>

            {/* Add Button */}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddModal(true)}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                style={styles.addButtonGradient}
              >
                <Plus size={20} color={Colors.background} />
                <Text style={styles.addButtonText}>{t.addRecord}</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* History */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.difficultyHistory}</Text>

              {difficultyRecords.length > 0 ? (
                difficultyRecords.map((record) => (
                  <View key={record.id} style={styles.recordCard}>
                    <View style={styles.recordHeader}>
                      <View style={styles.recordDate}>
                        <Calendar size={16} color={Colors.textSecondary} />
                        <Text style={styles.recordDateText}>
                          {formatDate(record.date)}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.difficultyBadge,
                          { backgroundColor: getDifficultyColor(record.difficulty) },
                        ]}
                      >
                        <Text style={styles.difficultyBadgeText}>
                          {difficultyLabels[record.difficulty - 1]}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.recordSessionType}>{record.sessionType}</Text>

                    {/* Difficulty Visual */}
                    <View style={styles.difficultyVisual}>
                      {[1, 2, 3, 4, 5].map((level) => (
                        <View
                          key={level}
                          style={[
                            styles.difficultyBar,
                            level <= record.difficulty && {
                              backgroundColor: getDifficultyColor(record.difficulty),
                            },
                          ]}
                        />
                      ))}
                    </View>

                    {record.notes && (
                      <Text style={styles.recordNotes}>{record.notes}</Text>
                    )}
                  </View>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Activity size={48} color={Colors.textTertiary} />
                  <Text style={styles.emptyStateText}>{t.noRecords}</Text>
                  <Text style={styles.emptyStateSubtext}>{t.startTracking}</Text>
                </View>
              )}
            </View>
          </ScrollView>
        ) : (
          <View style={styles.noSelectionContainer}>
            <User size={64} color={Colors.textTertiary} />
            <Text style={styles.noSelectionText}>{t.noMemberSelected}</Text>
          </View>
        )}

        {/* Member Picker Modal */}
        {showMemberPicker && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t.selectMember}</Text>
                <TouchableOpacity onPress={() => setShowMemberPicker(false)}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent}>
                {MOCK_MEMBERS.map((member) => (
                  <TouchableOpacity
                    key={member.id}
                    style={styles.memberOption}
                    onPress={() => {
                      setSelectedMember(member);
                      setShowMemberPicker(false);
                    }}
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
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}

        {/* Add Record Modal */}
        {showAddModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t.addRecord}</Text>
                <TouchableOpacity onPress={() => setShowAddModal(false)}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent}>
                <View style={styles.formContainer}>
                  {/* Difficulty Level */}
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>{t.difficultyLevel}</Text>
                    <View style={styles.difficultySelector}>
                      {[1, 2, 3, 4, 5].map((level) => (
                        <TouchableOpacity
                          key={level}
                          style={[
                            styles.difficultyOption,
                            selectedDifficulty === level && styles.difficultyOptionSelected,
                            { backgroundColor: getDifficultyColor(level) },
                          ]}
                          onPress={() => setSelectedDifficulty(level)}
                        >
                          <Text
                            style={[
                              styles.difficultyOptionText,
                              selectedDifficulty === level && styles.difficultyOptionTextSelected,
                            ]}
                          >
                            {level}
                          </Text>
                          <Text style={styles.difficultyOptionLabel}>
                            {difficultyLabels[level - 1]}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Session Type */}
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>{t.sessionType}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder={t.sessionTypePlaceholder}
                      placeholderTextColor={Colors.textTertiary}
                      value={sessionType}
                      onChangeText={setSessionType}
                    />
                  </View>

                  {/* Notes */}
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>{t.notes}</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder={t.notesPlaceholder}
                      placeholderTextColor={Colors.textTertiary}
                      value={notes}
                      onChangeText={setNotes}
                      multiline
                      numberOfLines={3}
                    />
                  </View>

                  {/* Buttons */}
                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.modalButtonCancel]}
                      onPress={() => setShowAddModal(false)}
                    >
                      <Text style={styles.modalButtonTextCancel}>{t.cancel}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.modalButton, styles.modalButtonSave]}
                      onPress={handleAddRecord}
                    >
                      <LinearGradient
                        colors={[Colors.primary, Colors.primaryDark]}
                        style={styles.modalButtonGradient}
                      >
                        <Text style={styles.modalButtonText}>{t.save}</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
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
  selectorContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  addButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.background,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  recordCard: {
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
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recordDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recordDateText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.background,
  },
  recordSessionType: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  difficultyVisual: {
    flexDirection: 'row',
    gap: 4,
  },
  difficultyBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.surfaceLight,
  },
  recordNotes: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  noSelectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  noSelectionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 12,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.textTertiary,
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
  modalContent: {
    maxHeight: 600,
  },
  memberOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceLight,
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
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  formContainer: {
    padding: 20,
    gap: 20,
  },
  formGroup: {
    gap: 8,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  difficultySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyOption: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    opacity: 0.6,
  },
  difficultyOptionSelected: {
    opacity: 1,
    borderWidth: 3,
    borderColor: Colors.text,
  },
  difficultyOptionText: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.background,
  },
  difficultyOptionTextSelected: {
    fontSize: 22,
  },
  difficultyOptionLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.background,
    textAlign: 'center',
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalButtonCancel: {
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalButtonSave: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  modalButtonGradient: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.background,
  },
  modalButtonTextCancel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
});
