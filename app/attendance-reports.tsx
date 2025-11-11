/**
 * Attendance Reports Screen - Member attendance statistics
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
  Activity,
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  Target,
  BarChart3,
  Calendar,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { MOCK_MEMBERS, MOCK_SESSIONS } from '@/constants/mockData';
import { useApp } from '@/contexts/AppContext';

type DateRange = 'week' | 'month' | 'quarter' | 'year';

interface MemberAttendance {
  memberId: string;
  memberName: string;
  totalSessions: number;
  attended: number;
  missed: number;
  attendanceRate: number;
}

export default function AttendanceReportsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();

  const [selectedRange, setSelectedRange] = useState<DateRange>('month');

  const texts = {
    tr: {
      title: 'Katılım Raporları',
      dateRange: 'Tarih Aralığı',
      week: 'Hafta',
      month: 'Ay',
      quarter: 'Çeyrek',
      year: 'Yıl',
      overview: 'Genel Bakış',
      averageAttendance: 'Ortalama Katılım',
      totalAttended: 'Toplam Katılım',
      totalMissed: 'Toplam Devamsızlık',
      attendanceRate: 'Katılım Oranı',
      topAttenders: 'En Düzenli Üyeler',
      lowAttenders: 'Düşük Katılım',
      attendanceTrend: 'Katılım Eğilimi',
      memberDetails: 'Üye Detayları',
      attended: 'Katıldı',
      missed: 'Katılmadı',
      sessions: 'Seans',
      vs: 'önceki döneme göre',
      excellent: 'Mükemmel',
      good: 'İyi',
      fair: 'Orta',
      poor: 'Düşük',
    },
    en: {
      title: 'Attendance Reports',
      dateRange: 'Date Range',
      week: 'Week',
      month: 'Month',
      quarter: 'Quarter',
      year: 'Year',
      overview: 'Overview',
      averageAttendance: 'Average Attendance',
      totalAttended: 'Total Attended',
      totalMissed: 'Total Missed',
      attendanceRate: 'Attendance Rate',
      topAttenders: 'Top Attenders',
      lowAttenders: 'Low Attendance',
      attendanceTrend: 'Attendance Trend',
      memberDetails: 'Member Details',
      attended: 'Attended',
      missed: 'Missed',
      sessions: 'Sessions',
      vs: 'vs previous period',
      excellent: 'Excellent',
      good: 'Good',
      fair: 'Fair',
      poor: 'Poor',
    },
  };

  const t = texts[language];

  // Calculate attendance statistics
  const completedSessions = MOCK_SESSIONS.filter((s) => s.status === 'COMPLETED');

  // Mock: Calculate member attendance
  const memberAttendance: MemberAttendance[] = MOCK_MEMBERS.map((member) => {
    const memberSessions = completedSessions.filter((s) =>
      s.members.some((m) => m.name === `${member.firstName} ${member.lastName}`)
    );

    const attended = memberSessions.filter((s) => {
      const memberInSession = s.members.find(
        (m) => m.name === `${member.firstName} ${member.lastName}`
      );
      return memberInSession?.isCheckedIn;
    }).length;

    const total = memberSessions.length;
    const missed = total - attended;
    const attendanceRate = total > 0 ? (attended / total) * 100 : 0;

    return {
      memberId: member.id,
      memberName: `${member.firstName} ${member.lastName}`,
      totalSessions: total,
      attended,
      missed,
      attendanceRate,
    };
  });

  // Calculate aggregate statistics
  const totalAttended = memberAttendance.reduce((sum, m) => sum + m.attended, 0);
  const totalMissed = memberAttendance.reduce((sum, m) => sum + m.missed, 0);
  const totalSessions = totalAttended + totalMissed;
  const overallAttendanceRate =
    totalSessions > 0 ? ((totalAttended / totalSessions) * 100).toFixed(1) : '0';

  // Sort members by attendance rate
  const topAttenders = [...memberAttendance]
    .sort((a, b) => b.attendanceRate - a.attendanceRate)
    .slice(0, 5);

  const lowAttenders = [...memberAttendance]
    .filter((m) => m.attendanceRate < 70)
    .sort((a, b) => a.attendanceRate - b.attendanceRate);

  // Mock trend data
  const trendPercentage = '+8.5';

  // Mock monthly attendance data for chart
  const monthlyAttendance = [
    { month: 'Oca', rate: 78 },
    { month: 'Şub', rate: 82 },
    { month: 'Mar', rate: 85 },
    { month: 'Nis', rate: 88 },
    { month: 'May', rate: 90 },
    { month: 'Haz', rate: parseFloat(overallAttendanceRate) },
  ];

  const maxRate = 100;

  const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return Colors.success;
    if (rate >= 75) return Colors.primary;
    if (rate >= 60) return Colors.warning;
    return Colors.error;
  };

  const getAttendanceLabel = (rate: number) => {
    if (rate >= 90) return t.excellent;
    if (rate >= 75) return t.good;
    if (rate >= 60) return t.fair;
    return t.poor;
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
                  colors={[Colors.success, '#22c55e']}
                  style={styles.statGradient}
                >
                  <Target size={28} color={Colors.background} />
                  <Text style={styles.statValue}>{overallAttendanceRate}%</Text>
                  <Text style={styles.statLabel}>{t.attendanceRate}</Text>
                </LinearGradient>
              </View>

              <View style={styles.statCard}>
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryDark]}
                  style={styles.statGradient}
                >
                  <Activity size={28} color={Colors.background} />
                  <Text style={styles.statValue}>{totalAttended}</Text>
                  <Text style={styles.statLabel}>{t.totalAttended}</Text>
                </LinearGradient>
              </View>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={[Colors.error, '#dc2626']}
                  style={styles.statGradient}
                >
                  <TrendingDown size={28} color={Colors.background} />
                  <Text style={styles.statValue}>{totalMissed}</Text>
                  <Text style={styles.statLabel}>{t.totalMissed}</Text>
                </LinearGradient>
              </View>

              <View style={styles.statCard}>
                <LinearGradient
                  colors={[Colors.info, '#3b82f6']}
                  style={styles.statGradient}
                >
                  <Calendar size={28} color={Colors.background} />
                  <Text style={styles.statValue}>{totalSessions}</Text>
                  <Text style={styles.statLabel}>{t.sessions}</Text>
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* Attendance Trend Card */}
          <View style={styles.section}>
            <View style={styles.trendCard}>
              <LinearGradient
                colors={[Colors.accent, '#ec4899']}
                style={styles.trendGradient}
              >
                <View style={styles.trendHeader}>
                  <Text style={styles.trendTitle}>{t.attendanceTrend}</Text>
                  <View style={styles.trendBadge}>
                    <TrendingUp size={12} color={Colors.background} />
                    <Text style={styles.trendText}>{trendPercentage}%</Text>
                  </View>
                </View>
                <Text style={styles.trendSubtext}>{t.vs}</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Attendance Trend Chart */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <BarChart3 size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>{t.attendanceTrend}</Text>
            </View>

            <View style={styles.chartCard}>
              <View style={styles.chart}>
                {monthlyAttendance.map((data, index) => (
                  <View key={index} style={styles.chartBar}>
                    <View style={styles.chartBarContainer}>
                      <LinearGradient
                        colors={[Colors.success, '#22c55e']}
                        style={[
                          styles.chartBarFill,
                          {
                            height: `${(data.rate / maxRate) * 100}%`,
                          },
                        ]}
                      >
                        <Text style={styles.chartBarValue}>{data.rate}%</Text>
                      </LinearGradient>
                    </View>
                    <Text style={styles.chartBarLabel}>{data.month}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Top Attenders */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Award size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>{t.topAttenders}</Text>
            </View>

            {topAttenders.map((member, index) => (
              <View key={member.memberId} style={styles.memberCard}>
                <View
                  style={[
                    styles.memberRank,
                    {
                      backgroundColor:
                        index === 0
                          ? Colors.warning
                          : index === 1
                          ? Colors.info
                          : Colors.accent,
                    },
                  ]}
                >
                  <Text style={styles.memberRankText}>{index + 1}</Text>
                </View>

                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.memberName}</Text>
                  <Text style={styles.memberStats}>
                    {member.attended}/{member.totalSessions} {t.sessions.toLowerCase()}
                  </Text>
                </View>

                <View style={styles.memberAttendance}>
                  <Text
                    style={[
                      styles.memberRate,
                      { color: getAttendanceColor(member.attendanceRate) },
                    ]}
                  >
                    {member.attendanceRate.toFixed(0)}%
                  </Text>
                  <Text style={styles.memberRateLabel}>
                    {getAttendanceLabel(member.attendanceRate)}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Low Attenders */}
          {lowAttenders.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Users size={20} color={Colors.error} />
                <Text style={styles.sectionTitle}>{t.lowAttenders}</Text>
              </View>

              {lowAttenders.map((member) => (
                <View key={member.memberId} style={styles.alertCard}>
                  <View style={styles.alertIcon}>
                    <TrendingDown size={20} color={Colors.error} />
                  </View>

                  <View style={styles.alertInfo}>
                    <Text style={styles.alertName}>{member.memberName}</Text>
                    <View style={styles.alertStats}>
                      <Text style={styles.alertStat}>
                        {member.attended} {t.attended.toLowerCase()}
                      </Text>
                      <View style={styles.alertDivider} />
                      <Text style={styles.alertStat}>
                        {member.missed} {t.missed.toLowerCase()}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.alertBadge,
                      {
                        backgroundColor:
                          member.attendanceRate >= 50 ? Colors.warning : Colors.error,
                      },
                    ]}
                  >
                    <Text style={styles.alertBadgeText}>
                      {member.attendanceRate.toFixed(0)}%
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* All Members Attendance */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Users size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>{t.memberDetails}</Text>
            </View>

            {memberAttendance
              .sort((a, b) => b.attendanceRate - a.attendanceRate)
              .map((member) => (
                <View key={member.memberId} style={styles.detailCard}>
                  <View style={styles.detailHeader}>
                    <Text style={styles.detailName}>{member.memberName}</Text>
                    <Text
                      style={[
                        styles.detailRate,
                        { color: getAttendanceColor(member.attendanceRate) },
                      ]}
                    >
                      {member.attendanceRate.toFixed(0)}%
                    </Text>
                  </View>

                  <View style={styles.detailBar}>
                    <View
                      style={[
                        styles.detailBarFill,
                        {
                          width: `${member.attendanceRate}%`,
                          backgroundColor: getAttendanceColor(member.attendanceRate),
                        },
                      ]}
                    />
                  </View>

                  <View style={styles.detailStats}>
                    <View style={styles.detailStat}>
                      <Text style={styles.detailStatValue}>{member.attended}</Text>
                      <Text style={styles.detailStatLabel}>{t.attended}</Text>
                    </View>
                    <View style={styles.detailStat}>
                      <Text style={styles.detailStatValue}>{member.missed}</Text>
                      <Text style={styles.detailStatLabel}>{t.missed}</Text>
                    </View>
                    <View style={styles.detailStat}>
                      <Text style={styles.detailStatValue}>{member.totalSessions}</Text>
                      <Text style={styles.detailStatLabel}>Toplam</Text>
                    </View>
                  </View>
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
  trendCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  trendGradient: {
    padding: 20,
    gap: 8,
  },
  trendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trendTitle: {
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
  trendSubtext: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.background,
    opacity: 0.8,
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
    fontSize: 10,
    fontWeight: '800',
    color: Colors.background,
  },
  chartBarLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
  },
  memberRank: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberRankText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.background,
  },
  memberInfo: {
    flex: 1,
    gap: 2,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  memberStats: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  memberAttendance: {
    alignItems: 'flex-end',
    gap: 2,
  },
  memberRate: {
    fontSize: 20,
    fontWeight: '800',
  },
  memberRateLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.errorLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertInfo: {
    flex: 1,
    gap: 4,
  },
  alertName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  alertStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertStat: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  alertDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textTertiary,
  },
  alertBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  alertBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.background,
  },
  detailCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  detailRate: {
    fontSize: 18,
    fontWeight: '800',
  },
  detailBar: {
    height: 8,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  detailBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  detailStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailStat: {
    alignItems: 'center',
    gap: 2,
  },
  detailStatValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  detailStatLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
