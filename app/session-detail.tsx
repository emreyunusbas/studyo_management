/**
 * Session Detail Screen - View and manage session details
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
  Users,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  UserPlus,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { MOCK_SESSIONS } from '@/constants/mockData';
import { useApp } from '@/contexts/AppContext';

export default function SessionDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();
  const params = useLocalSearchParams();

  const session = MOCK_SESSIONS.find((s) => s.id === params.id);

  const texts = {
    tr: {
      title: 'Seans Detayı',
      dateTime: 'Tarih ve Saat',
      groupName: 'Grup Adı',
      capacity: 'Kapasite',
      participants: 'Katılımcılar',
      description: 'Açıklama',
      trainer: 'Eğitmen',
      status: 'Durum',
      actions: 'İşlemler',
      editSession: 'Düzenle',
      cancelSession: 'İptal Et',
      deleteSession: 'Sil',
      addParticipants: 'Katılımcı Ekle',
      startAttendance: 'Yoklama Al',
      noParticipants: 'Henüz katılımcı yok',
      sessionNotFound: 'Seans bulunamadı',
      confirmCancel: 'Seansı İptal Et?',
      confirmCancelMessage: 'Bu seansı iptal etmek istediğinizden emin misiniz?',
      confirmDelete: 'Seansı Sil?',
      confirmDeleteMessage: 'Bu seansı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      yes: 'Evet',
      no: 'Hayır',
      cancel: 'İptal',
      statusLabels: {
        SCHEDULED: 'Planlandı',
        COMPLETED: 'Tamamlandı',
        CANCELLED: 'İptal Edildi',
      },
      checkedIn: 'Katıldı',
      notCheckedIn: 'Katılmadı',
    },
    en: {
      title: 'Session Details',
      dateTime: 'Date and Time',
      groupName: 'Group Name',
      capacity: 'Capacity',
      participants: 'Participants',
      description: 'Description',
      trainer: 'Trainer',
      status: 'Status',
      actions: 'Actions',
      editSession: 'Edit',
      cancelSession: 'Cancel',
      deleteSession: 'Delete',
      addParticipants: 'Add Participants',
      startAttendance: 'Take Attendance',
      noParticipants: 'No participants yet',
      sessionNotFound: 'Session not found',
      confirmCancel: 'Cancel Session?',
      confirmCancelMessage: 'Are you sure you want to cancel this session?',
      confirmDelete: 'Delete Session?',
      confirmDeleteMessage: 'Are you sure you want to delete this session? This action cannot be undone.',
      yes: 'Yes',
      no: 'No',
      cancel: 'Cancel',
      statusLabels: {
        SCHEDULED: 'Scheduled',
        COMPLETED: 'Completed',
        CANCELLED: 'Cancelled',
      },
      checkedIn: 'Attended',
      notCheckedIn: 'Not Attended',
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
      weekday: 'long',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return Colors.success;
      case 'CANCELLED':
        return Colors.error;
      case 'SCHEDULED':
        return Colors.info;
      default:
        return Colors.textSecondary;
    }
  };

  const handleCancelSession = () => {
    Alert.alert(t.confirmCancel, t.confirmCancelMessage, [
      { text: t.no, style: 'cancel' },
      {
        text: t.yes,
        style: 'destructive',
        onPress: () => {
          // TODO: Cancel session in backend
          Alert.alert('Başarılı', 'Seans iptal edildi');
          router.back();
        },
      },
    ]);
  };

  const handleDeleteSession = () => {
    Alert.alert(t.confirmDelete, t.confirmDeleteMessage, [
      { text: t.no, style: 'cancel' },
      {
        text: t.yes,
        style: 'destructive',
        onPress: () => {
          // TODO: Delete session in backend
          Alert.alert('Başarılı', 'Seans silindi');
          router.back();
        },
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
          {/* Status Badge */}
          <View
            style={[
              styles.statusBanner,
              { backgroundColor: getStatusColor(session.status) },
            ]}
          >
            <Text style={styles.statusBannerText}>
              {t.statusLabels[session.status]}
            </Text>
          </View>

          {/* Session Info Card */}
          <View style={styles.card}>
            <Text style={styles.groupName}>{session.groupName}</Text>

            {/* Date & Time */}
            <View style={styles.infoRow}>
              <Calendar size={20} color={Colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{t.dateTime}</Text>
                <Text style={styles.infoValue}>
                  {formatDate(session.date)}
                </Text>
                <Text style={styles.infoValue}>
                  {session.startTime} - {session.endTime}
                </Text>
              </View>
            </View>

            {/* Capacity */}
            <View style={styles.infoRow}>
              <Users size={20} color={Colors.accent} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{t.capacity}</Text>
                <Text style={styles.infoValue}>
                  {session.members?.length || 0}/{session.capacity} {t.participants}
                </Text>
              </View>
            </View>

            {/* Description */}
            {session.description && (
              <View style={styles.infoRow}>
                <Clock size={20} color={Colors.info} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>{t.description}</Text>
                  <Text style={styles.infoValue}>{session.description}</Text>
                </View>
              </View>
            )}

            {/* Trainer */}
            {session.trainerName && (
              <View style={styles.infoRow}>
                <Users size={20} color={Colors.secondary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>{t.trainer}</Text>
                  <Text style={styles.infoValue}>{session.trainerName}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Participants */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t.participants} ({session.members?.length || 0})
            </Text>

            {session.members && session.members.length > 0 ? (
              <View style={styles.participantsList}>
                {session.members.map((member) => (
                  <View key={member.id} style={styles.participantCard}>
                    <View style={styles.participantAvatar}>
                      <Text style={styles.participantAvatarText}>
                        {member.name.split(' ').map((n) => n[0]).join('')}
                      </Text>
                    </View>

                    <View style={styles.participantInfo}>
                      <Text style={styles.participantName}>{member.name}</Text>
                      {session.status === 'COMPLETED' && (
                        <Text
                          style={[
                            styles.participantStatus,
                            { color: member.isCheckedIn ? Colors.success : Colors.error },
                          ]}
                        >
                          {member.isCheckedIn ? t.checkedIn : t.notCheckedIn}
                        </Text>
                      )}
                    </View>

                    {member.isCheckedIn && (
                      <CheckCircle size={20} color={Colors.success} />
                    )}
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyParticipants}>
                <Users size={48} color={Colors.textTertiary} />
                <Text style={styles.emptyText}>{t.noParticipants}</Text>
              </View>
            )}
          </View>

          {/* Actions */}
          {session.status === 'SCHEDULED' && (
            <View style={styles.actionsSection}>
              <TouchableOpacity
                style={styles.primaryActionButton}
                onPress={() => router.push(`/session-attendance?id=${session.id}` as any)}
              >
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryDark]}
                  style={styles.primaryActionGradient}
                >
                  <CheckCircle size={20} color={Colors.background} />
                  <Text style={styles.primaryActionText}>{t.startAttendance}</Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.secondaryActions}>
                <TouchableOpacity
                  style={styles.secondaryActionButton}
                  onPress={() => {
                    // TODO: Navigate to add participants
                    Alert.alert('Bilgi', 'Katılımcı ekleme özelliği yakında eklenecek');
                  }}
                >
                  <UserPlus size={18} color={Colors.info} />
                  <Text style={styles.secondaryActionText}>{t.addParticipants}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryActionButton}
                  onPress={() => {
                    // TODO: Navigate to edit
                    Alert.alert('Bilgi', 'Düzenleme özelliği yakında eklenecek');
                  }}
                >
                  <Edit size={18} color={Colors.accent} />
                  <Text style={styles.secondaryActionText}>{t.editSession}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dangerActions}>
                <TouchableOpacity
                  style={styles.dangerActionButton}
                  onPress={handleCancelSession}
                >
                  <XCircle size={18} color={Colors.warning} />
                  <Text style={[styles.secondaryActionText, { color: Colors.warning }]}>
                    {t.cancelSession}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dangerActionButton}
                  onPress={handleDeleteSession}
                >
                  <Trash2 size={18} color={Colors.error} />
                  <Text style={[styles.secondaryActionText, { color: Colors.error }]}>
                    {t.deleteSession}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
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
  statusBanner: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  statusBannerText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.background,
  },
  card: {
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
  groupName: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceLight,
  },
  infoContent: {
    flex: 1,
    gap: 4,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  participantsList: {
    gap: 8,
  },
  participantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
  },
  participantAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  participantAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.background,
  },
  participantInfo: {
    flex: 1,
    gap: 2,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  participantStatus: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyParticipants: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  actionsSection: {
    gap: 12,
  },
  primaryActionButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 18,
  },
  primaryActionText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.background,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  dangerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  dangerActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
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
