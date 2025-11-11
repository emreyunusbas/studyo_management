/**
 * Member Session Report Screen - View member's session history
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  ChevronDown,
  X,
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { MOCK_MEMBERS } from '@/constants/mockData';
import { useApp } from '@/contexts/AppContext';
import type { Session } from '@/types';

// Mock sessions data
const MOCK_SESSIONS: Session[] = [
  {
    id: '1',
    date: '2025-11-10',
    startTime: '10:00',
    endTime: '11:00',
    groupName: 'Sabah Grubu',
    remainingCredits: 11,
    status: 'COMPLETED',
    description: 'Pilates mat exercises',
  },
  {
    id: '2',
    date: '2025-11-08',
    startTime: '14:00',
    endTime: '15:00',
    groupName: 'Öğleden Sonra Grubu',
    remainingCredits: 12,
    status: 'COMPLETED',
  },
  {
    id: '3',
    date: '2025-11-12',
    startTime: '16:00',
    endTime: '17:00',
    groupName: 'Akşam Grubu',
    remainingCredits: 11,
    status: 'SCHEDULED',
  },
  {
    id: '4',
    date: '2025-11-06',
    startTime: '10:00',
    endTime: '11:00',
    groupName: 'Sabah Grubu',
    remainingCredits: 13,
    status: 'CANCELLED',
    description: 'Cancelled by member',
  },
];

export default function MemberSessionReportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();
  const params = useLocalSearchParams();
  const preselectedMemberId = params.memberId as string | undefined;

  const [selectedMemberId, setSelectedMemberId] = useState(preselectedMemberId || '');
  const [showMemberPicker, setShowMemberPicker] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const texts = {
    tr: {
      title: 'Seans Geçmişi',
      selectMember: 'Üye Seç',
      sessions: 'Seanslar',
      noSessions: 'Henüz seans kaydı yok',
      date: 'Tarih',
      time: 'Saat',
      group: 'Grup',
      trainer: 'Eğitmen',
      status: 'Durum',
      remainingCredits: 'Kalan Seans',
      description: 'Açıklama',
      statuses: {
        COMPLETED: 'Tamamlandı',
        SCHEDULED: 'Planlandı',
        CANCELLED: 'İptal Edildi',
      },
      totalSessions: 'Toplam Seans',
      completedSessions: 'Tamamlanan',
      cancelledSessions: 'İptal Edilen',
      close: 'Kapat',
    },
    en: {
      title: 'Session History',
      selectMember: 'Select Member',
      sessions: 'Sessions',
      noSessions: 'No session records yet',
      date: 'Date',
      time: 'Time',
      group: 'Group',
      trainer: 'Trainer',
      status: 'Status',
      remainingCredits: 'Remaining Sessions',
      description: 'Description',
      statuses: {
        COMPLETED: 'Completed',
        SCHEDULED: 'Scheduled',
        CANCELLED: 'Cancelled',
      },
      totalSessions: 'Total Sessions',
      completedSessions: 'Completed',
      cancelledSessions: 'Cancelled',
      close: 'Close',
    },
  };

  const t = texts[language];

  const selectedMember = MOCK_MEMBERS.find((m) => m.id === selectedMemberId);
  const memberSessions = MOCK_SESSIONS;

  // Calculate statistics
  const completedCount = memberSessions.filter((s) => s.status === 'COMPLETED').length;
  const cancelledCount = memberSessions.filter((s) => s.status === 'CANCELLED').length;

  const getStatusIcon = (status: Session['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle size={20} color={Colors.success} />;
      case 'SCHEDULED':
        return <AlertCircle size={20} color={Colors.info} />;
      case 'CANCELLED':
        return <XCircle size={20} color={Colors.error} />;
    }
  };

  const getStatusColor = (status: Session['status']) => {
    switch (status) {
      case 'COMPLETED':
        return Colors.success;
      case 'SCHEDULED':
        return Colors.info;
      case 'CANCELLED':
        return Colors.error;
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
          <View style={{ width: 40 }} />
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

        {/* Statistics */}
        {selectedMember && memberSessions.length > 0 && (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{memberSessions.length}</Text>
              <Text style={styles.statLabel}>{t.totalSessions}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: Colors.success }]}>
                {completedCount}
              </Text>
              <Text style={styles.statLabel}>{t.completedSessions}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: Colors.error }]}>
                {cancelledCount}
              </Text>
              <Text style={styles.statLabel}>{t.cancelledSessions}</Text>
            </View>
          </View>
        )}

        {/* Sessions List */}
        {selectedMember && (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + 20 },
            ]}
          >
            {memberSessions.length === 0 ? (
              <View style={styles.emptyState}>
                <Calendar size={64} color={Colors.textTertiary} />
                <Text style={styles.emptyText}>{t.noSessions}</Text>
              </View>
            ) : (
              memberSessions
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((session) => (
                  <TouchableOpacity
                    key={session.id}
                    style={styles.sessionCard}
                    onPress={() => setSelectedSession(session)}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={[Colors.surface, Colors.surfaceLight]}
                      style={styles.sessionCardGradient}
                    >
                      <View style={styles.sessionHeader}>
                        <View style={styles.sessionDate}>
                          <Calendar size={16} color={Colors.primary} />
                          <Text style={styles.sessionDateText}>
                            {formatDate(session.date)}
                          </Text>
                        </View>
                        <View style={styles.statusBadge}>
                          {getStatusIcon(session.status)}
                          <Text
                            style={[
                              styles.statusText,
                              { color: getStatusColor(session.status) },
                            ]}
                          >
                            {t.statuses[session.status]}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.sessionBody}>
                        <View style={styles.sessionInfo}>
                          <Clock size={16} color={Colors.textSecondary} />
                          <Text style={styles.sessionInfoText}>
                            {session.startTime} - {session.endTime}
                          </Text>
                        </View>
                        <View style={styles.sessionInfo}>
                          <User size={16} color={Colors.textSecondary} />
                          <Text style={styles.sessionInfoText}>{session.groupName}</Text>
                        </View>
                      </View>

                      {session.description && (
                        <Text style={styles.sessionDescription}>
                          {session.description}
                        </Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
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

        {/* Session Detail Modal */}
        <Modal
          visible={!!selectedSession}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedSession(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.detailModalContent}>
              {selectedSession && (
                <LinearGradient
                  colors={[Colors.surface, Colors.surfaceLight]}
                  style={styles.detailGradient}
                >
                  <Text style={styles.detailTitle}>{t.sessions}</Text>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t.date}</Text>
                    <Text style={styles.detailValue}>
                      {formatDate(selectedSession.date)}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t.time}</Text>
                    <Text style={styles.detailValue}>
                      {selectedSession.startTime} - {selectedSession.endTime}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t.group}</Text>
                    <Text style={styles.detailValue}>{selectedSession.groupName}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t.status}</Text>
                    <Text
                      style={[
                        styles.detailValue,
                        { color: getStatusColor(selectedSession.status) },
                      ]}
                    >
                      {t.statuses[selectedSession.status]}
                    </Text>
                  </View>

                  {selectedSession.description && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>{t.description}</Text>
                      <Text style={styles.detailValue}>
                        {selectedSession.description}
                      </Text>
                    </View>
                  )}

                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setSelectedSession(null)}
                  >
                    <Text style={styles.closeButtonText}>{t.close}</Text>
                  </TouchableOpacity>
                </LinearGradient>
              )}
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
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
  sessionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sessionCardGradient: {
    padding: 16,
    gap: 12,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sessionDateText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.backgroundLight,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sessionBody: {
    gap: 8,
  },
  sessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sessionInfoText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  sessionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    width: '100%',
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
  detailModalContent: {
    margin: 20,
    borderRadius: 24,
    overflow: 'hidden',
    maxWidth: 400,
    width: '100%',
  },
  detailGradient: {
    padding: 24,
    gap: 16,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
  },
  detailRow: {
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.background,
  },
});
