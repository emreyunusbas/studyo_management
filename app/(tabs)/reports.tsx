/**
 * Reports Screen - Analytics and reporting dashboard
 */

import React from 'react';
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
  FileText,
  Users,
  Calendar,
  TrendingUp,
  PieChart,
  BarChart3,
  Activity,
  Award,
  Target,
  ChevronRight,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { MOCK_MEMBERS, MOCK_SESSIONS, MOCK_PAYMENTS } from '@/constants/mockData';
import { useApp } from '@/contexts/AppContext';

export default function ReportsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();

  const texts = {
    tr: {
      title: 'Raporlar',
      overview: 'Genel Bakış',
      reportTypes: 'Rapor Türleri',
      memberReports: 'Üye Raporları',
      memberReportsDesc: 'Üye istatistikleri ve analizleri',
      sessionReports: 'Seans Raporları',
      sessionReportsDesc: 'Seans katılım ve performans',
      attendanceReports: 'Katılım Raporları',
      attendanceReportsDesc: 'Üye katılım oranları',
      revenueReports: 'Gelir Raporları',
      revenueReportsDesc: 'Finansal analizler',
      quickStats: 'Hızlı İstatistikler',
      totalMembers: 'Toplam Üye',
      totalSessions: 'Toplam Seans',
      totalRevenue: 'Toplam Gelir',
      avgAttendance: 'Ortalama Katılım',
      viewReport: 'Görüntüle',
    },
    en: {
      title: 'Reports',
      overview: 'Overview',
      reportTypes: 'Report Types',
      memberReports: 'Member Reports',
      memberReportsDesc: 'Member statistics and analytics',
      sessionReports: 'Session Reports',
      sessionReportsDesc: 'Session attendance and performance',
      attendanceReports: 'Attendance Reports',
      attendanceReportsDesc: 'Member attendance rates',
      revenueReports: 'Revenue Reports',
      revenueReportsDesc: 'Financial analytics',
      quickStats: 'Quick Statistics',
      totalMembers: 'Total Members',
      totalSessions: 'Total Sessions',
      totalRevenue: 'Total Revenue',
      avgAttendance: 'Avg Attendance',
      viewReport: 'View',
    },
  };

  const t = texts[language];

  // Calculate quick stats
  const totalMembers = MOCK_MEMBERS.length;
  const totalSessions = MOCK_SESSIONS.length;
  const completedPayments = MOCK_PAYMENTS.filter((p) => p.status === 'COMPLETED');
  const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);
  const avgAttendance = 85; // Mock average attendance percentage

  const formatCurrency = (amount: number) => {
    return `₺${amount.toLocaleString('tr-TR')}`;
  };

  const reportCategories = [
    {
      id: 'member-reports',
      title: t.memberReports,
      description: t.memberReportsDesc,
      icon: Users,
      color: Colors.primary,
      route: '/member-reports',
    },
    {
      id: 'session-reports',
      title: t.sessionReports,
      description: t.sessionReportsDesc,
      icon: Calendar,
      color: Colors.info,
      route: '/session-reports',
    },
    {
      id: 'attendance-reports',
      title: t.attendanceReports,
      description: t.attendanceReportsDesc,
      icon: Activity,
      color: Colors.success,
      route: '/attendance-reports',
    },
    {
      id: 'revenue-reports',
      title: t.revenueReports,
      description: t.revenueReportsDesc,
      icon: TrendingUp,
      color: Colors.warning,
      route: '/financial-reports',
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
          <Text style={styles.title}>{t.title}</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
        >
          {/* Quick Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.quickStats}</Text>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryDark]}
                  style={styles.statGradient}
                >
                  <Users size={28} color={Colors.background} />
                  <Text style={styles.statValue}>{totalMembers}</Text>
                  <Text style={styles.statLabel}>{t.totalMembers}</Text>
                </LinearGradient>
              </View>

              <View style={styles.statCard}>
                <LinearGradient
                  colors={[Colors.info, '#3b82f6']}
                  style={styles.statGradient}
                >
                  <Calendar size={28} color={Colors.background} />
                  <Text style={styles.statValue}>{totalSessions}</Text>
                  <Text style={styles.statLabel}>{t.totalSessions}</Text>
                </LinearGradient>
              </View>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={[Colors.success, '#22c55e']}
                  style={styles.statGradient}
                >
                  <TrendingUp size={28} color={Colors.background} />
                  <Text style={styles.statValue}>{formatCurrency(totalRevenue)}</Text>
                  <Text style={styles.statLabel}>{t.totalRevenue}</Text>
                </LinearGradient>
              </View>

              <View style={styles.statCard}>
                <LinearGradient
                  colors={[Colors.accent, '#ec4899']}
                  style={styles.statGradient}
                >
                  <Target size={28} color={Colors.background} />
                  <Text style={styles.statValue}>{avgAttendance}%</Text>
                  <Text style={styles.statLabel}>{t.avgAttendance}</Text>
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* Report Types */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.reportTypes}</Text>

            {reportCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <TouchableOpacity
                  key={category.id}
                  style={styles.reportCard}
                  onPress={() => router.push(category.route as any)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={[Colors.surface, Colors.surfaceLight]}
                    style={styles.reportGradient}
                  >
                    <View
                      style={[
                        styles.reportIcon,
                        { backgroundColor: category.color },
                      ]}
                    >
                      <IconComponent size={28} color={Colors.background} />
                    </View>

                    <View style={styles.reportInfo}>
                      <Text style={styles.reportTitle}>{category.title}</Text>
                      <Text style={styles.reportDescription}>
                        {category.description}
                      </Text>
                    </View>

                    <ChevronRight size={24} color={Colors.textSecondary} />
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Additional Analytics Cards */}
          <View style={styles.section}>
            <View style={styles.analyticsRow}>
              <View style={styles.analyticsCard}>
                <View style={styles.analyticsIcon}>
                  <PieChart size={24} color={Colors.primary} />
                </View>
                <Text style={styles.analyticsTitle}>Veri Analizi</Text>
                <Text style={styles.analyticsValue}>Detaylı</Text>
              </View>

              <View style={styles.analyticsCard}>
                <View style={styles.analyticsIcon}>
                  <BarChart3 size={24} color={Colors.info} />
                </View>
                <Text style={styles.analyticsTitle}>Grafikler</Text>
                <Text style={styles.analyticsValue}>Görsel</Text>
              </View>

              <View style={styles.analyticsCard}>
                <View style={styles.analyticsIcon}>
                  <Award size={24} color={Colors.warning} />
                </View>
                <Text style={styles.analyticsTitle}>Performans</Text>
                <Text style={styles.analyticsValue}>Analiz</Text>
              </View>
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
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
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
    fontSize: 20,
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
    fontSize: 24,
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
  reportCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reportGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  reportIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportInfo: {
    flex: 1,
    gap: 4,
  },
  reportTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.text,
  },
  reportDescription: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  analyticsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  analyticsCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    gap: 8,
  },
  analyticsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyticsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  analyticsValue: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
