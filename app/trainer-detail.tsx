/**
 * Trainer Detail Screen - View trainer information and stats
 */

import React from 'react';
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
  Mail,
  Phone,
  Calendar,
  Users,
  Star,
  Award,
  TrendingUp,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { MOCK_TRAINERS } from '@/constants/mockData';
import { useApp } from '@/contexts/AppContext';

export default function TrainerDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();
  const params = useLocalSearchParams();

  const trainer = MOCK_TRAINERS.find((t) => t.id === params.id);

  const texts = {
    tr: {
      title: 'Eğitmen Detayı',
      contact: 'İletişim',
      specialties: 'Uzmanlık Alanları',
      certifications: 'Sertifikalar',
      statistics: 'İstatistikler',
      totalSessions: 'Toplam Seans',
      completedSessions: 'Tamamlanan',
      cancelledSessions: 'İptal',
      activeMembers: 'Aktif Üyeler',
      rating: 'Puan',
      memberSince: 'Üyelik Tarihi',
      actions: 'İşlemler',
      edit: 'Düzenle',
      delete: 'Sil',
      viewPerformance: 'Performans',
      viewSchedule: 'Program',
      confirmDelete: 'Eğitmeni Sil?',
      confirmDeleteMessage: 'Bu eğitmeni silmek istediğinizden emin misiniz?',
      yes: 'Evet',
      no: 'Hayır',
      active: 'Aktif',
      inactive: 'Pasif',
      trainerNotFound: 'Eğitmen bulunamadı',
    },
    en: {
      title: 'Trainer Details',
      contact: 'Contact',
      specialties: 'Specialties',
      certifications: 'Certifications',
      statistics: 'Statistics',
      totalSessions: 'Total Sessions',
      completedSessions: 'Completed',
      cancelledSessions: 'Cancelled',
      activeMembers: 'Active Members',
      rating: 'Rating',
      memberSince: 'Member Since',
      actions: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      viewPerformance: 'Performance',
      viewSchedule: 'Schedule',
      confirmDelete: 'Delete Trainer?',
      confirmDeleteMessage: 'Are you sure you want to delete this trainer?',
      yes: 'Yes',
      no: 'No',
      active: 'Active',
      inactive: 'Inactive',
      trainerNotFound: 'Trainer not found',
    },
  };

  const t = texts[language];

  if (!trainer) {
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
            <Text style={styles.notFoundText}>{t.trainerNotFound}</Text>
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

  const handleDelete = () => {
    Alert.alert(t.confirmDelete, t.confirmDeleteMessage, [
      { text: t.no, style: 'cancel' },
      {
        text: t.yes,
        style: 'destructive',
        onPress: () => {
          Alert.alert(t.success || 'Success', 'Eğitmen silindi');
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
          {/* Trainer Header Card */}
          <View style={styles.headerCard}>
            <View style={styles.trainerAvatar}>
              <Text style={styles.trainerAvatarText}>
                {trainer.firstName[0]}
                {trainer.lastName[0]}
              </Text>
            </View>

            <Text style={styles.trainerName}>
              {trainer.firstName} {trainer.lastName}
            </Text>

            <View style={styles.statusBadge}>
              {trainer.isActive ? (
                <CheckCircle size={16} color={Colors.success} />
              ) : (
                <XCircle size={16} color={Colors.error} />
              )}
              <Text
                style={[
                  styles.statusText,
                  { color: trainer.isActive ? Colors.success : Colors.error },
                ]}
              >
                {trainer.isActive ? t.active : t.inactive}
              </Text>
            </View>

            {trainer.bio && <Text style={styles.trainerBio}>{trainer.bio}</Text>}

            {/* Rating */}
            {trainer.rating && (
              <View style={styles.ratingCard}>
                <Star size={24} color={Colors.warning} fill={Colors.warning} />
                <Text style={styles.ratingValue}>{trainer.rating.toFixed(1)}</Text>
                <Text style={styles.ratingLabel}>{t.rating}</Text>
              </View>
            )}
          </View>

          {/* Contact Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.contact}</Text>

            <View style={styles.infoCard}>
              <Mail size={20} color={Colors.info} />
              <Text style={styles.infoText}>{trainer.email}</Text>
            </View>

            <View style={styles.infoCard}>
              <Phone size={20} color={Colors.accent} />
              <Text style={styles.infoText}>{trainer.phone}</Text>
            </View>

            <View style={styles.infoCard}>
              <Calendar size={20} color={Colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{t.memberSince}</Text>
                <Text style={styles.infoValue}>{formatDate(trainer.joinDate)}</Text>
              </View>
            </View>
          </View>

          {/* Statistics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.statistics}</Text>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Calendar size={24} color={Colors.primary} />
                <Text style={styles.statValue}>{trainer.totalSessions}</Text>
                <Text style={styles.statLabel}>{t.totalSessions}</Text>
              </View>

              <View style={styles.statCard}>
                <CheckCircle size={24} color={Colors.success} />
                <Text style={styles.statValue}>{trainer.completedSessions}</Text>
                <Text style={styles.statLabel}>{t.completedSessions}</Text>
              </View>

              <View style={styles.statCard}>
                <XCircle size={24} color={Colors.error} />
                <Text style={styles.statValue}>{trainer.cancelledSessions}</Text>
                <Text style={styles.statLabel}>{t.cancelledSessions}</Text>
              </View>

              <View style={styles.statCard}>
                <Users size={24} color={Colors.accent} />
                <Text style={styles.statValue}>{trainer.activeMembers}</Text>
                <Text style={styles.statLabel}>{t.activeMembers}</Text>
              </View>
            </View>
          </View>

          {/* Specialties */}
          {trainer.specialties && trainer.specialties.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.specialties}</Text>
              <View style={styles.tagsList}>
                {trainer.specialties.map((specialty, idx) => (
                  <View key={idx} style={styles.tag}>
                    <Text style={styles.tagText}>{specialty}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Certifications */}
          {trainer.certifications && trainer.certifications.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.certifications}</Text>
              {trainer.certifications.map((cert, idx) => (
                <View key={idx} style={styles.certCard}>
                  <Award size={20} color={Colors.warning} />
                  <Text style={styles.certText}>{cert}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Actions */}
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={styles.primaryActionButton}
              onPress={() => router.push(`/trainer-performance?id=${trainer.id}` as any)}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                style={styles.primaryActionGradient}
              >
                <TrendingUp size={20} color={Colors.background} />
                <Text style={styles.primaryActionText}>{t.viewPerformance}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.secondaryActions}>
              <TouchableOpacity
                style={styles.secondaryActionButton}
                onPress={() => {
                  Alert.alert('Bilgi', 'Düzenleme özelliği yakında eklenecek');
                }}
              >
                <Edit size={18} color={Colors.info} />
                <Text style={styles.secondaryActionText}>{t.edit}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryActionButton}
                onPress={handleDelete}
              >
                <Trash2 size={18} color={Colors.error} />
                <Text style={[styles.secondaryActionText, { color: Colors.error }]}>
                  {t.delete}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
  headerCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  trainerAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  trainerAvatarText: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.background,
  },
  trainerName: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: Colors.surfaceLight,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
  },
  trainerBio: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  ratingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  ratingValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.warning,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  infoContent: {
    flex: 1,
    gap: 2,
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
  infoText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
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
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.background,
  },
  certCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
  },
  certText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  actionsSection: {
    gap: 12,
    marginTop: 8,
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
