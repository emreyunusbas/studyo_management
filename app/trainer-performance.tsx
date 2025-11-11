/**
 * Trainer Performance Screen - View trainer performance metrics and trends
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  Star,
  CheckCircle,
  XCircle,
  Award,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { MOCK_TRAINERS } from '@/constants/mockData';
import { useApp } from '@/contexts/AppContext';

export default function TrainerPerformanceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();
  const params = useLocalSearchParams();

  const trainer = MOCK_TRAINERS.find((t) => t.id === params.id) || MOCK_TRAINERS[0];

  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const texts = {
    tr: {
      title: 'Performans',
      period: {
        week: 'Hafta',
        month: 'Ay',
        year: 'Yıl',
      },
      overview: 'Genel Bakış',
      totalSessions: 'Toplam Seans',
      completedSessions: 'Tamamlanan',
      cancelledSessions: 'İptal',
      completionRate: 'Tamamlanma Oranı',
      activeMembers: 'Aktif Üyeler',
      averageRating: 'Ortalama Puan',
      trends: 'Eğilimler',
      sessionsThisPeriod: 'Bu Dönem Seanslar',
      vs: 'geçen döneme göre',
      memberRetention: 'Üye Elde Tutma',
      recentAchievements: 'Son Başarılar',
      topPerformer: 'En İyi Performans',
      perfectAttendance: 'Mükemmel Katılım',
      memberFavorite: 'Üye Favorisi',
      noTrainerSelected: 'Eğitmen seçilmedi',
    },
    en: {
      title: 'Performance',
      period: {
        week: 'Week',
        month: 'Month',
        year: 'Year',
      },
      overview: 'Overview',
      totalSessions: 'Total Sessions',
      completedSessions: 'Completed',
      cancelledSessions: 'Cancelled',
      completionRate: 'Completion Rate',
      activeMembers: 'Active Members',
      averageRating: 'Average Rating',
      trends: 'Trends',
      sessionsThisPeriod: 'Sessions This Period',
      vs: 'vs last period',
      memberRetention: 'Member Retention',
      recentAchievements: 'Recent Achievements',
      topPerformer: 'Top Performer',
      perfectAttendance: 'Perfect Attendance',
      memberFavorite: 'Member Favorite',
      noTrainerSelected: 'No trainer selected',
    },
  };

  const t = texts[language];

  // Calculate metrics
  const completionRate = trainer.totalSessions > 0
    ? ((trainer.completedSessions / trainer.totalSessions) * 100).toFixed(1)
    : '0';

  const retentionRate = '92'; // Mock data
  const sessionsTrend = '+12'; // Mock data
  const ratingTrend = '+0.3'; // Mock data

  // Mock achievements
  const achievements = [
    {
      id: '1',
      title: t.topPerformer,
      description: 'Bu ayki en yüksek tamamlanma oranı',
      icon: Award,
      color: Colors.warning,
    },
    {
      id: '2',
      title: t.perfectAttendance,
      description: 'Son 30 günde iptal yok',
      icon: CheckCircle,
      color: Colors.success,
    },
    {
      id: '3',
      title: t.memberFavorite,
      description: '4.8+ puan ortalaması',
      icon: Star,
      color: Colors.primary,
    },
  ];

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
          <View style={styles.headerCenter}>
            <Text style={styles.title}>{t.title}</Text>
            <Text style={styles.trainerName}>
              {trainer.firstName} {trainer.lastName}
            </Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {(['week', 'month', 'year'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.periodButtonTextActive,
                ]}
              >
                {t.period[period]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
        >
          {/* Overview Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.overview}</Text>

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

          {/* Key Metrics */}
          <View style={styles.section}>
            <View style={styles.metricCard}>
              <LinearGradient
                colors={[Colors.success, '#22c55e']}
                style={styles.metricGradient}
              >
                <View style={styles.metricContent}>
                  <Text style={styles.metricLabel}>{t.completionRate}</Text>
                  <Text style={styles.metricValue}>{completionRate}%</Text>
                </View>
                <TrendingUp size={40} color={Colors.background} style={{ opacity: 0.3 }} />
              </LinearGradient>
            </View>

            <View style={styles.metricCard}>
              <LinearGradient
                colors={[Colors.warning, '#f59e0b']}
                style={styles.metricGradient}
              >
                <View style={styles.metricContent}>
                  <Text style={styles.metricLabel}>{t.averageRating}</Text>
                  <View style={styles.ratingRow}>
                    <Star size={24} color={Colors.background} fill={Colors.background} />
                    <Text style={styles.metricValue}>{trainer.rating.toFixed(1)}</Text>
                  </View>
                </View>
                <Star size={40} color={Colors.background} style={{ opacity: 0.3 }} />
              </LinearGradient>
            </View>
          </View>

          {/* Trends */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.trends}</Text>

            <View style={styles.trendCard}>
              <View style={styles.trendHeader}>
                <Text style={styles.trendTitle}>{t.sessionsThisPeriod}</Text>
                <View style={[styles.trendBadge, { backgroundColor: Colors.success }]}>
                  <TrendingUp size={14} color={Colors.background} />
                  <Text style={styles.trendBadgeText}>{sessionsTrend}%</Text>
                </View>
              </View>
              <Text style={styles.trendValue}>{trainer.completedSessions}</Text>
              <Text style={styles.trendSubtext}>{t.vs}</Text>
            </View>

            <View style={styles.trendCard}>
              <View style={styles.trendHeader}>
                <Text style={styles.trendTitle}>{t.memberRetention}</Text>
                <View style={[styles.trendBadge, { backgroundColor: Colors.primary }]}>
                  <TrendingUp size={14} color={Colors.background} />
                  <Text style={styles.trendBadgeText}>{retentionRate}%</Text>
                </View>
              </View>
              <Text style={styles.trendValue}>{trainer.activeMembers}</Text>
              <Text style={styles.trendSubtext}>{t.activeMembers}</Text>
            </View>
          </View>

          {/* Recent Achievements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.recentAchievements}</Text>

            {achievements.map((achievement) => {
              const IconComponent = achievement.icon;
              return (
                <View key={achievement.id} style={styles.achievementCard}>
                  <View
                    style={[
                      styles.achievementIcon,
                      { backgroundColor: achievement.color },
                    ]}
                  >
                    <IconComponent size={24} color={Colors.background} />
                  </View>
                  <View style={styles.achievementContent}>
                    <Text style={styles.achievementTitle}>{achievement.title}</Text>
                    <Text style={styles.achievementDescription}>
                      {achievement.description}
                    </Text>
                  </View>
                </View>
              );
            })}
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
  headerCenter: {
    alignItems: 'center',
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  trainerName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: Colors.primary,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  periodButtonTextActive: {
    color: Colors.background,
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
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  metricCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  metricGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  metricContent: {
    gap: 8,
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.background,
    opacity: 0.9,
  },
  metricValue: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.background,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trendCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  trendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.background,
  },
  trendValue: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
  },
  trendSubtext: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textTertiary,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementContent: {
    flex: 1,
    gap: 4,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  achievementDescription: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
