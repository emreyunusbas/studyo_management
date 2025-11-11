/**
 * Session Attendance Screen - Take attendance for a session
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  User,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { MOCK_SESSIONS } from '@/constants/mockData';
import { useApp } from '@/contexts/AppContext';

export default function SessionAttendanceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();
  const params = useLocalSearchParams();

  const session = MOCK_SESSIONS.find((s) => s.id === params.id);

  const [attendance, setAttendance] = useState<Record<string, boolean>>(
    session?.members?.reduce((acc, m) => {
      acc[m.id] = m.isCheckedIn || false;
      return acc;
    }, {} as Record<string, boolean>) || {}
  );

  const texts = {
    tr: {
      title: 'Yoklama Al',
      sessionInfo: 'Seans Bilgileri',
      participants: 'Katılımcılar',
      checkAll: 'Tümünü İşaretle',
      uncheckAll: 'Tümünü Kaldır',
      present: 'Katıldı',
      absent: 'Katılmadı',
      save: 'Kaydet',
      cancel: 'İptal',
      noParticipants: 'Bu seansın katılımcısı yok',
      success: 'Başarılı',
      attendanceSaved: 'Yoklama kaydedildi',
      sessionNotFound: 'Seans bulunamadı',
      summary: 'Özet',
      presentCount: 'Katılan',
      absentCount: 'Katılmayan',
    },
    en: {
      title: 'Take Attendance',
      sessionInfo: 'Session Information',
      participants: 'Participants',
      checkAll: 'Check All',
      uncheckAll: 'Uncheck All',
      present: 'Present',
      absent: 'Absent',
      save: 'Save',
      cancel: 'Cancel',
      noParticipants: 'This session has no participants',
      success: 'Success',
      attendanceSaved: 'Attendance saved',
      sessionNotFound: 'Session not found',
      summary: 'Summary',
      presentCount: 'Present',
      absentCount: 'Absent',
    },
  };

  const t = texts[language];

  if (!session) {
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
          <View style={styles.notFound}>
            <XCircle size={64} color={Colors.error} />
            <Text style={styles.notFoundText}>{t.sessionNotFound}</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const toggleAttendance = (memberId: string) => {
    setAttendance((prev) => ({
      ...prev,
      [memberId]: !prev[memberId],
    }));
  };

  const checkAll = () => {
    const allChecked: Record<string, boolean> = {};
    session.members?.forEach((m) => {
      allChecked[m.id] = true;
    });
    setAttendance(allChecked);
  };

  const uncheckAll = () => {
    const allUnchecked: Record<string, boolean> = {};
    session.members?.forEach((m) => {
      allUnchecked[m.id] = false;
    });
    setAttendance(allUnchecked);
  };

  const handleSave = () => {
    // TODO: Save attendance to backend
    Alert.alert(t.success, t.attendanceSaved, [
      {
        text: 'Tamam',
        onPress: () => router.back(),
      },
    ]);
  };

  const presentCount = Object.values(attendance).filter((v) => v).length;
  const absentCount = (session.members?.length || 0) - presentCount;

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
          {/* Session Info Card */}
          <View style={styles.sessionCard}>
            <Text style={styles.groupName}>{session.groupName}</Text>

            <View style={styles.sessionMeta}>
              <View style={styles.metaItem}>
                <Calendar size={16} color={Colors.primary} />
                <Text style={styles.metaText}>{formatDate(session.date)}</Text>
              </View>

              <View style={styles.metaItem}>
                <Clock size={16} color={Colors.info} />
                <Text style={styles.metaText}>
                  {session.startTime} - {session.endTime}
                </Text>
              </View>
            </View>
          </View>

          {/* Summary Card */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>{t.summary}</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <CheckCircle size={24} color={Colors.success} />
                <Text style={styles.summaryLabel}>{t.presentCount}</Text>
                <Text style={styles.summaryValue}>{presentCount}</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryItem}>
                <XCircle size={24} color={Colors.error} />
                <Text style={styles.summaryLabel}>{t.absentCount}</Text>
                <Text style={styles.summaryValue}>{absentCount}</Text>
              </View>
            </View>
          </View>

          {/* Bulk Actions */}
          <View style={styles.bulkActions}>
            <TouchableOpacity style={styles.bulkActionButton} onPress={checkAll}>
              <CheckCircle size={18} color={Colors.success} />
              <Text style={styles.bulkActionText}>{t.checkAll}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.bulkActionButton} onPress={uncheckAll}>
              <XCircle size={18} color={Colors.error} />
              <Text style={styles.bulkActionText}>{t.uncheckAll}</Text>
            </TouchableOpacity>
          </View>

          {/* Participants List */}
          {session.members && session.members.length > 0 ? (
            <View style={styles.participantsList}>
              {session.members.map((member) => {
                const isPresent = attendance[member.id];

                return (
                  <TouchableOpacity
                    key={member.id}
                    style={[
                      styles.participantCard,
                      isPresent && styles.participantCardPresent,
                    ]}
                    onPress={() => toggleAttendance(member.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.participantLeft}>
                      <View
                        style={[
                          styles.participantAvatar,
                          isPresent && styles.participantAvatarPresent,
                        ]}
                      >
                        <Text
                          style={[
                            styles.participantAvatarText,
                            isPresent && styles.participantAvatarTextPresent,
                          ]}
                        >
                          {member.name.split(' ').map((n) => n[0]).join('')}
                        </Text>
                      </View>

                      <View style={styles.participantInfo}>
                        <Text style={styles.participantName}>{member.name}</Text>
                        <Text
                          style={[
                            styles.participantStatus,
                            { color: isPresent ? Colors.success : Colors.error },
                          ]}
                        >
                          {isPresent ? t.present : t.absent}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.checkCircle,
                        isPresent && styles.checkCircleActive,
                      ]}
                    >
                      {isPresent && <CheckCircle size={24} color={Colors.background} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <User size={64} color={Colors.textTertiary} />
              <Text style={styles.emptyText}>{t.noParticipants}</Text>
            </View>
          )}

          {/* Save Button */}
          {session.members && session.members.length > 0 && (
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <LinearGradient
                colors={[Colors.success, '#22c55e']}
                style={styles.saveButtonGradient}
              >
                <CheckCircle size={20} color={Colors.background} />
                <Text style={styles.saveButtonText}>{t.save}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </ScrollView>
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
    gap: 20,
  },
  sessionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    gap: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  groupName: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
  },
  sessionMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    gap: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  summaryDivider: {
    width: 1,
    height: 60,
    backgroundColor: Colors.surfaceLight,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
  },
  bulkActions: {
    flexDirection: 'row',
    gap: 12,
  },
  bulkActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
  },
  bulkActionText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  participantsList: {
    gap: 10,
  },
  participantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.surfaceLight,
  },
  participantCardPresent: {
    borderColor: Colors.success,
    backgroundColor: Colors.surfaceLight,
  },
  participantLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  participantAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  participantAvatarPresent: {
    backgroundColor: Colors.success,
  },
  participantAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  participantAvatarTextPresent: {
    color: Colors.background,
  },
  participantInfo: {
    flex: 1,
    gap: 4,
  },
  participantName: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.text,
  },
  participantStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleActive: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  saveButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 12,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 18,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.background,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.error,
  },
});
