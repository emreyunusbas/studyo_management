/**
 * Session Reports Screen - Session statistics and analytics
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Users,
  BarChart3,
  PieChart,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { MOCK_SESSIONS, WEEK_DAYS_FULL } from '@/constants/mockData';
import { useApp } from '@/contexts/AppContext';

type DateRange = 'week' | 'month' | 'quarter' | 'year';

export default function SessionReportsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();

  const [selectedRange, setSelectedRange] = useState<DateRange>('month');

  const texts = {
    tr: {
      title: 'Seans Raporları',
      dateRange: 'Tarih Aralığı',
      week: 'Hafta',
      month: 'Ay',
      quarter: 'Çeyrek',
      year: 'Yıl',
      overview: 'Genel Bakış',
      totalSessions: 'Toplam Seans',
      completedSessions: 'Tamamlanan',
      scheduledSessions: 'Planlanmış',
      cancelledSessions: 'İptal',
      completionRate: 'Tamamlanma Oranı',
      cancellationRate: 'İptal Oranı',
      sessionsByDay: 'Günlere Göre Seanslar',
      sessionsByStatus: 'Duruma Göre Seanslar',
      averageCapacity: 'Ortalama Kapasite',
      totalCapacity: 'Toplam Kapasite',
      utilizationRate: 'Doluluk Oranı',
      peakDays: 'En Yoğun Günler',
      sessionsPerDay: 'Günlük Seans',
      trend: 'Eğilim',
      vs: 'önceki döneme göre',
    },
    en: {
      title: 'Session Reports',
      dateRange: 'Date Range',
      week: 'Week',
      month: 'Month',
      quarter: 'Quarter',
      year: 'Year',
      overview: 'Overview',
      totalSessions: 'Total Sessions',
      completedSessions: 'Completed',
      scheduledSessions: 'Scheduled',
      cancelledSessions: 'Cancelled',
      completionRate: 'Completion Rate',
      cancellationRate: 'Cancellation Rate',
      sessionsByDay: 'Sessions by Day',
      sessionsByStatus: 'Sessions by Status',
      averageCapacity: 'Average Capacity',
      totalCapacity: 'Total Capacity',
      utilizationRate: 'Utilization Rate',
      peakDays: 'Peak Days',
      sessionsPerDay: 'Sessions Per Day',
      trend: 'Trend',
      vs: 'vs previous period',
    },
  };

  const t = texts[language];

  // Calculate statistics
  const totalSessions = MOCK_SESSIONS.length;
  const completedSessions = MOCK_SESSIONS.filter((s) => s.status === 'COMPLETED');
  const scheduledSessions = MOCK_SESSIONS.filter((s) => s.status === 'SCHEDULED');
  const cancelledSessions = MOCK_SESSIONS.filter((s) => s.status === 'CANCELLED');

  const completionRate =
    totalSessions > 0
      ? ((completedSessions.length / totalSessions) * 100).toFixed(1)
      : '0';

  const cancellationRate =
    totalSessions > 0
      ? ((cancelledSessions.length / totalSessions) * 100).toFixed(1)
      : '0';

  // Calculate total capacity and utilization
  const totalCapacity = MOCK_SESSIONS.reduce((sum, s) => sum + s.capacity, 0);
  const totalOccupied = MOCK_SESSIONS.reduce(
    (sum, s) => sum + s.members.length,
    0
  );
  const utilizationRate =
    totalCapacity > 0 ? ((totalOccupied / totalCapacity) * 100).toFixed(1) : '0';

  // Group sessions by day of week
  const sessionsByDay = WEEK_DAYS_FULL.map((day, index) => {
    const count = MOCK_SESSIONS.filter((session) => {
      const sessionDate = new Date(session.date);
      // Adjust for Turkish week starting on Monday (0 = Monday, 6 = Sunday)
      const dayOfWeek = (sessionDate.getDay() + 6) % 7;
      return dayOfWeek === index;
    }).length;
    return { day, count };
  });

  const maxDailySessions = Math.max(...sessionsByDay.map((d) => d.count), 1);

  // Mock trend data
  const trendPercentage = '+12.5';

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

        {/* Date Range Selector */}
        <View style={styles.dateRangeSection}>
          <Text style={styles.sectionLabel}>{t.dateRange}</Text>
          <View style={styles.dateRangeContainer}>
            {(['week', 'month', 'quarter', 'year'] as DateRange[]).map((range) => (
              <TouchableOpacity
                key={range}
                style={[
                  styles.dateRangeButton,
                  selectedRange === range && styles.dateRangeButtonActive,
                ]}
                onPress={() => setSelectedRange(range)}
              >
                <Text
                  style={[
                    styles.dateRangeText,
                    selectedRange === range && styles.dateRangeTextActive,
                  ]}
                >
                  {t[range]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryDark]}
                  style={styles.statGradient}
                >
                  <Calendar size={28} color={Colors.background} />
                  <Text style={styles.statValue}>{totalSessions}</Text>
                  <Text style={styles.statLabel}>{t.totalSessions}</Text>
                </LinearGradient>
              </View>

              <View style={styles.statCard}>
                <LinearGradient
                  colors={[Colors.success, '#22c55e']}
                  style={styles.statGradient}
                >
                  <CheckCircle size={28} color={Colors.background} />
                  <Text style={styles.statValue}>{completedSessions.length}</Text>
                  <Text style={styles.statLabel}>{t.completedSessions}</Text>
                </LinearGradient>
              </View>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={[Colors.info, '#3b82f6']}
                  style={styles.statGradient}
                >
                  <Clock size={28} color={Colors.background} />
                  <Text style={styles.statValue}>{scheduledSessions.length}</Text>
                  <Text style={styles.statLabel}>{t.scheduledSessions}</Text>
                </LinearGradient>
              </View>

              <View style={styles.statCard}>
                <LinearGradient
                  colors={[Colors.error, '#dc2626']}
                  style={styles.statGradient}
                >
                  <XCircle size={28} color={Colors.background} />
                  <Text style={styles.statValue}>{cancelledSessions.length}</Text>
                  <Text style={styles.statLabel}>{t.cancelledSessions}</Text>
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* Completion & Cancellation Rates */}
          <View style={styles.section}>
            <View style={styles.rateCard}>
              <LinearGradient
                colors={[Colors.success, '#22c55e']}
                style={styles.rateGradient}
              >
                <View style={styles.rateContent}>
                  <Text style={styles.rateLabel}>{t.completionRate}</Text>
                  <Text style={styles.rateValue}>{completionRate}%</Text>
                </View>
                <CheckCircle size={48} color={Colors.background} style={{ opacity: 0.3 }} />
              </LinearGradient>
            </View>

            <View style={styles.rateCard}>
              <LinearGradient
                colors={[Colors.error, '#dc2626']}
                style={styles.rateGradient}
              >
                <View style={styles.rateContent}>
                  <Text style={styles.rateLabel}>{t.cancellationRate}</Text>
                  <Text style={styles.rateValue}>{cancellationRate}%</Text>
                </View>
                <XCircle size={48} color={Colors.background} style={{ opacity: 0.3 }} />
              </LinearGradient>
            </View>
          </View>

          {/* Capacity & Utilization */}
          <View style={styles.section}>
            <View style={styles.capacityCard}>
              <LinearGradient
                colors={[Colors.accent, '#ec4899']}
                style={styles.capacityGradient}
              >
                <View style={styles.capacityHeader}>
                  <Text style={styles.capacityTitle}>{t.utilizationRate}</Text>
                  <View style={styles.trendBadge}>
                    <TrendingUp size={12} color={Colors.background} />
                    <Text style={styles.trendText}>{trendPercentage}%</Text>
                  </View>
                </View>

                <Text style={styles.capacityValue}>{utilizationRate}%</Text>
                <View style={styles.capacityStats}>
                  <View style={styles.capacityStat}>
                    <Text style={styles.capacityStatLabel}>{t.totalCapacity}</Text>
                    <Text style={styles.capacityStatValue}>{totalCapacity}</Text>
                  </View>
                  <View style={styles.capacityDivider} />
                  <View style={styles.capacityStat}>
                    <Text style={styles.capacityStatLabel}>Dolu</Text>
                    <Text style={styles.capacityStatValue}>{totalOccupied}</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Sessions by Day Chart */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <BarChart3 size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>{t.sessionsByDay}</Text>
            </View>

            <View style={styles.chartCard}>
              <View style={styles.chart}>
                {sessionsByDay.map((data, index) => (
                  <View key={index} style={styles.chartBar}>
                    <View style={styles.chartBarContainer}>
                      <LinearGradient
                        colors={[Colors.primary, Colors.primaryDark]}
                        style={[
                          styles.chartBarFill,
                          {
                            height: `${(data.count / maxDailySessions) * 100}%`,
                          },
                        ]}
                      >
                        <Text style={styles.chartBarValue}>{data.count}</Text>
                      </LinearGradient>
                    </View>
                    <Text style={styles.chartBarLabel}>
                      {data.day.substring(0, 2)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Sessions by Status */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <PieChart size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>{t.sessionsByStatus}</Text>
            </View>

            <View style={styles.statusGrid}>
              <View style={styles.statusCard}>
                <View style={[styles.statusBar, { backgroundColor: Colors.success }]}>
                  <View
                    style={[
                      styles.statusBarFill,
                      {
                        width: `${(completedSessions.length / totalSessions) * 100}%`,
                        backgroundColor: Colors.background,
                      },
                    ]}
                  />
                </View>
                <View style={styles.statusInfo}>
                  <Text style={styles.statusLabel}>{t.completedSessions}</Text>
                  <Text style={styles.statusValue}>{completedSessions.length}</Text>
                </View>
              </View>

              <View style={styles.statusCard}>
                <View style={[styles.statusBar, { backgroundColor: Colors.info }]}>
                  <View
                    style={[
                      styles.statusBarFill,
                      {
                        width: `${(scheduledSessions.length / totalSessions) * 100}%`,
                        backgroundColor: Colors.background,
                      },
                    ]}
                  />
                </View>
                <View style={styles.statusInfo}>
                  <Text style={styles.statusLabel}>{t.scheduledSessions}</Text>
                  <Text style={styles.statusValue}>{scheduledSessions.length}</Text>
                </View>
              </View>

              <View style={styles.statusCard}>
                <View style={[styles.statusBar, { backgroundColor: Colors.error }]}>
                  <View
                    style={[
                      styles.statusBarFill,
                      {
                        width: `${(cancelledSessions.length / totalSessions) * 100}%`,
                        backgroundColor: Colors.background,
                      },
                    ]}
                  />
                </View>
                <View style={styles.statusInfo}>
                  <Text style={styles.statusLabel}>{t.cancelledSessions}</Text>
                  <Text style={styles.statusValue}>{cancelledSessions.length}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Peak Days */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Users size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>{t.peakDays}</Text>
            </View>

            {sessionsByDay
              .sort((a, b) => b.count - a.count)
              .slice(0, 3)
              .map((data, index) => (
                <View key={index} style={styles.peakDayCard}>
                  <View style={styles.peakDayRank}>
                    <Text style={styles.peakDayRankText}>{index + 1}</Text>
                  </View>
                  <View style={styles.peakDayInfo}>
                    <Text style={styles.peakDayName}>{data.day}</Text>
                    <Text style={styles.peakDayCount}>
                      {data.count} {t.sessionsPerDay.toLowerCase()}
                    </Text>
                  </View>
                  <LinearGradient
                    colors={
                      index === 0
                        ? [Colors.warning, '#f59e0b']
                        : index === 1
                        ? [Colors.info, '#3b82f6']
                        : [Colors.accent, '#ec4899']
                    }
                    style={styles.peakDayBar}
                  >
                    <Text style={styles.peakDayBarText}>
                      {((data.count / maxDailySessions) * 100).toFixed(0)}%
                    </Text>
                  </LinearGradient>
                </View>
              ))}
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
  dateRangeSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  dateRangeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dateRangeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    alignItems: 'center',
  },
  dateRangeButtonActive: {
    backgroundColor: Colors.primary,
  },
  dateRangeText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  dateRangeTextActive: {
    color: Colors.background,
    fontWeight: '700',
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  statGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 8,
    minHeight: 120,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.background,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.background,
    opacity: 0.9,
    textAlign: 'center',
  },
  rateCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  rateGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  rateContent: {
    gap: 6,
  },
  rateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.background,
    opacity: 0.9,
  },
  rateValue: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.background,
  },
  capacityCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  capacityGradient: {
    padding: 20,
    gap: 12,
  },
  capacityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  capacityTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.background,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.success,
  },
  capacityValue: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.background,
  },
  capacityStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  capacityStat: {
    flex: 1,
    gap: 4,
  },
  capacityStatLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.background,
    opacity: 0.8,
  },
  capacityStatValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.background,
  },
  capacityDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.background,
    opacity: 0.3,
    marginHorizontal: 16,
  },
  chartCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 180,
    gap: 6,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  chartBarContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  chartBarFill: {
    width: '100%',
    borderRadius: 6,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 6,
  },
  chartBarValue: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.background,
  },
  chartBarLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  statusGrid: {
    gap: 12,
  },
  statusCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  statusBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  statusBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  peakDayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
  },
  peakDayRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  peakDayRankText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.background,
  },
  peakDayInfo: {
    flex: 1,
    gap: 2,
  },
  peakDayName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  peakDayCount: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  peakDayBar: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  peakDayBarText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.background,
  },
});
