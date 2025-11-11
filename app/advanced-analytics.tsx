/**
 * Advanced Analytics Screen - İleri seviye analiz ve raporlama
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Target,
  AlertCircle,
  Award,
  BarChart3,
  PieChart,
  Activity,
  Zap,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { analyticsService, DashboardAnalytics, TrendData, DataPoint } from '@/services/analyticsService';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function AdvancedAnalyticsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();

  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'members' | 'revenue' | 'predictive'>('overview');

  const texts = {
    tr: {
      title: 'İleri Seviye Analizler',
      overview: 'Genel Bakış',
      members: 'Üyeler',
      revenue: 'Gelir',
      predictive: 'Tahminler',
      kpis: 'Temel Göstergeler',
      memberRetention: 'Üye Tutma',
      revenueGrowth: 'Gelir Artışı',
      sessionUtilization: 'Seans Kullanımı',
      instructorEfficiency: 'Eğitmen Verimliliği',
      memberSatisfaction: 'Üye Memnuniyeti',
      trends: 'Trendler',
      totalMembers: 'Toplam Üye',
      activeMembers: 'Aktif Üye',
      newMembers: 'Yeni Üye',
      churnRate: 'Kayıp Oranı',
      totalRevenue: 'Toplam Gelir',
      avgRevenuePerMember: 'Üye Başı Gelir',
      completionRate: 'Tamamlanma',
      attendanceRate: 'Katılım Oranı',
      atRiskMembers: 'Risk Altındaki Üyeler',
      predictedChurn: 'Tahmini Kayıp',
      revenueForecast: 'Gelir Tahmini',
      next30Days: '30 Gün',
      next90Days: '90 Gün',
      confidence: 'Güven',
      projectedGrowth: 'Tahmini Büyüme',
      membershipDistribution: 'Üyelik Dağılımı',
      revenueByPayment: 'Ödeme Yöntemine Göre',
      sessionTypes: 'Seans Türleri',
      peakHours: 'Yoğun Saatler',
      topInstructors: 'En İyi Eğitmenler',
      sessions: 'Seans',
      rating: 'Puan',
      satisfaction: 'Memnuniyet',
    },
    en: {
      title: 'Advanced Analytics',
      overview: 'Overview',
      members: 'Members',
      revenue: 'Revenue',
      predictive: 'Predictive',
      kpis: 'Key Performance Indicators',
      memberRetention: 'Member Retention',
      revenueGrowth: 'Revenue Growth',
      sessionUtilization: 'Session Utilization',
      instructorEfficiency: 'Instructor Efficiency',
      memberSatisfaction: 'Member Satisfaction',
      trends: 'Trends',
      totalMembers: 'Total Members',
      activeMembers: 'Active Members',
      newMembers: 'New Members',
      churnRate: 'Churn Rate',
      totalRevenue: 'Total Revenue',
      avgRevenuePerMember: 'Avg Revenue/Member',
      completionRate: 'Completion Rate',
      attendanceRate: 'Attendance Rate',
      atRiskMembers: 'At-Risk Members',
      predictedChurn: 'Predicted Churn',
      revenueForecast: 'Revenue Forecast',
      next30Days: '30 Days',
      next90Days: '90 Days',
      confidence: 'Confidence',
      projectedGrowth: 'Projected Growth',
      membershipDistribution: 'Membership Distribution',
      revenueByPayment: 'Revenue by Payment',
      sessionTypes: 'Session Types',
      peakHours: 'Peak Hours',
      topInstructors: 'Top Instructors',
      sessions: 'Sessions',
      rating: 'Rating',
      satisfaction: 'Satisfaction',
    },
  };

  const t = texts[language];

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    const data = analyticsService.getDashboardAnalytics();
    setAnalytics(data);
  };

  const formatCurrency = (value: number): string => {
    return `₺${value.toLocaleString('tr-TR')}`;
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const renderTrendIndicator = (trend: TrendData) => {
    const isPositive = trend.trend === 'up';
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const color = isPositive ? Colors.success : Colors.error;

    return (
      <View style={styles.trendIndicator}>
        <Icon size={16} color={color} />
        <Text style={[styles.trendValue, { color }]}>
          {formatPercentage(Math.abs(trend.changePercentage))}
        </Text>
      </View>
    );
  };

  const renderKPICard = (title: string, value: number, icon: any, color: string) => {
    const Icon = icon;
    return (
      <View style={styles.kpiCard}>
        <View style={[styles.kpiIcon, { backgroundColor: color + '20' }]}>
          <Icon size={24} color={color} />
        </View>
        <Text style={styles.kpiValue}>{formatPercentage(value)}</Text>
        <Text style={styles.kpiLabel}>{title}</Text>
      </View>
    );
  };

  const renderMetricCard = (
    title: string,
    value: string,
    trend?: TrendData,
    icon?: any,
    color?: string
  ) => {
    const Icon = icon;
    return (
      <View style={styles.metricCard}>
        <View style={styles.metricHeader}>
          {Icon && <Icon size={20} color={color || Colors.primary} />}
          <Text style={styles.metricTitle}>{title}</Text>
        </View>
        <Text style={styles.metricValue}>{value}</Text>
        {trend && renderTrendIndicator(trend)}
      </View>
    );
  };

  const renderDistributionItem = (item: DataPoint) => (
    <View key={item.label} style={styles.distributionItem}>
      <View style={styles.distributionInfo}>
        <Text style={styles.distributionLabel}>{item.label}</Text>
        <Text style={styles.distributionValue}>
          {item.value} ({formatPercentage(item.percentage || 0)})
        </Text>
      </View>
      <View style={styles.distributionBar}>
        <View
          style={[
            styles.distributionBarFill,
            { width: `${item.percentage || 0}%`, backgroundColor: Colors.primary },
          ]}
        />
      </View>
    </View>
  );

  const renderChartBar = (item: DataPoint, maxValue: number) => {
    const heightPercent = (item.value / maxValue) * 100;
    return (
      <View key={item.label} style={styles.chartBarContainer}>
        <View style={styles.chartBar}>
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={[styles.chartBarFill, { height: `${heightPercent}%` }]}
          />
        </View>
        <Text style={styles.chartBarLabel}>{item.label}</Text>
      </View>
    );
  };

  if (!analytics) {
    return (
      <View style={styles.loadingContainer}>
        <Activity size={48} color={Colors.primary} />
      </View>
    );
  }

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

        {/* Tabs */}
        <View style={styles.tabs}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.tabsList}>
              {(['overview', 'members', 'revenue', 'predictive'] as const).map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tab, selectedTab === tab && styles.tabActive]}
                  onPress={() => setSelectedTab(tab)}
                >
                  <Text style={[styles.tabText, selectedTab === tab && styles.tabTextActive]}>
                    {t[tab]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
        >
          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <>
              {/* KPIs */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t.kpis}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.kpiGrid}>
                    {renderKPICard(t.memberRetention, analytics.kpis.memberRetention, Target, Colors.success)}
                    {renderKPICard(t.revenueGrowth, analytics.kpis.revenueGrowth, TrendingUp, Colors.primary)}
                    {renderKPICard(t.sessionUtilization, analytics.kpis.sessionUtilization, Calendar, Colors.info)}
                    {renderKPICard(t.instructorEfficiency, analytics.kpis.instructorEfficiency, Award, Colors.warning)}
                    {renderKPICard(t.memberSatisfaction, analytics.kpis.memberSatisfaction, Zap, Colors.accent)}
                  </View>
                </ScrollView>
              </View>

              {/* Quick Metrics */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t.trends}</Text>
                <View style={styles.metricsGrid}>
                  {renderMetricCard(
                    t.totalMembers,
                    analytics.members.totalMembers.toString(),
                    analytics.members.memberTrend,
                    Users,
                    Colors.primary
                  )}
                  {renderMetricCard(
                    t.totalRevenue,
                    formatCurrency(analytics.revenue.totalRevenue),
                    analytics.revenue.revenueTrend,
                    DollarSign,
                    Colors.success
                  )}
                </View>
                <View style={styles.metricsGrid}>
                  {renderMetricCard(
                    t.completionRate,
                    formatPercentage(analytics.sessions.completionRate),
                    analytics.sessions.sessionTrend,
                    Calendar,
                    Colors.info
                  )}
                  {renderMetricCard(
                    t.attendanceRate,
                    formatPercentage(analytics.attendance.averageAttendanceRate),
                    undefined,
                    BarChart3,
                    Colors.warning
                  )}
                </View>
              </View>
            </>
          )}

          {/* Members Tab */}
          {selectedTab === 'members' && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t.membershipDistribution}</Text>
                <View style={styles.distributionList}>
                  {analytics.members.membershipDistribution.map(renderDistributionItem)}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t.trends}</Text>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{analytics.members.activeMembers}</Text>
                    <Text style={styles.statLabel}>{t.activeMembers}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{analytics.members.newMembers}</Text>
                    <Text style={styles.statLabel}>{t.newMembers}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{analytics.members.churnedMembers}</Text>
                    <Text style={styles.statLabel}>{t.churnRate}</Text>
                  </View>
                </View>
              </View>
            </>
          )}

          {/* Revenue Tab */}
          {selectedTab === 'revenue' && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t.revenueByPayment}</Text>
                <View style={styles.distributionList}>
                  {analytics.revenue.revenueByPaymentMethod.map((item) => (
                    <View key={item.label} style={styles.distributionItem}>
                      <View style={styles.distributionInfo}>
                        <Text style={styles.distributionLabel}>{item.label}</Text>
                        <Text style={styles.distributionValue}>
                          {formatCurrency(item.value)} ({formatPercentage(item.percentage || 0)})
                        </Text>
                      </View>
                      <View style={styles.distributionBar}>
                        <View
                          style={[
                            styles.distributionBarFill,
                            { width: `${item.percentage || 0}%`, backgroundColor: Colors.success },
                          ]}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t.sessionTypes}</Text>
                <View style={styles.chartContainer}>
                  {analytics.sessions.sessionTypeDistribution.map((item) =>
                    renderChartBar(item, Math.max(...analytics.sessions.sessionTypeDistribution.map(d => d.value)))
                  )}
                </View>
              </View>
            </>
          )}

          {/* Predictive Tab */}
          {selectedTab === 'predictive' && (
            <>
              <View style={styles.section}>
                <View style={styles.alertCard}>
                  <View style={styles.alertHeader}>
                    <AlertCircle size={24} color={Colors.warning} />
                    <Text style={styles.alertTitle}>{t.atRiskMembers}</Text>
                  </View>
                  <Text style={styles.alertValue}>
                    {analytics.predictive.churnPrediction.atRiskMembers}
                  </Text>
                  <Text style={styles.alertSubtext}>
                    {t.predictedChurn}: {analytics.predictive.churnPrediction.predictedChurnNext30Days} ({formatPercentage(analytics.predictive.churnPrediction.churnProbability)})
                  </Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t.revenueForecast}</Text>
                <View style={styles.forecastGrid}>
                  <View style={styles.forecastCard}>
                    <Text style={styles.forecastLabel}>{t.next30Days}</Text>
                    <Text style={styles.forecastValue}>
                      {formatCurrency(analytics.predictive.revenueForecast.next30Days)}
                    </Text>
                  </View>
                  <View style={styles.forecastCard}>
                    <Text style={styles.forecastLabel}>{t.next90Days}</Text>
                    <Text style={styles.forecastValue}>
                      {formatCurrency(analytics.predictive.revenueForecast.next90Days)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.confidenceText}>
                  {t.confidence}: {formatPercentage(analytics.predictive.revenueForecast.confidence)}
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t.projectedGrowth}</Text>
                <View style={styles.growthCard}>
                  <Text style={styles.growthValue}>
                    {analytics.predictive.growthProjection.projectedMembers}
                  </Text>
                  <Text style={styles.growthLabel}>
                    {t.totalMembers} ({formatPercentage(analytics.predictive.growthProjection.growthRate)})
                  </Text>
                  <Text style={styles.growthTimeframe}>
                    {analytics.predictive.growthProjection.timeframe}
                  </Text>
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
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
  title: { fontSize: 24, fontWeight: '800', color: Colors.text },
  tabs: { paddingHorizontal: 20, marginBottom: 20 },
  tabsList: { flexDirection: 'row', gap: 12 },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.surface,
  },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
  tabTextActive: { color: Colors.background },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, gap: 24 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, paddingLeft: 4 },
  kpiGrid: { flexDirection: 'row', gap: 12 },
  kpiCard: {
    width: 120,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  kpiIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  kpiValue: { fontSize: 24, fontWeight: '800', color: Colors.text },
  kpiLabel: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary, textAlign: 'center' },
  metricsGrid: { flexDirection: 'row', gap: 12 },
  metricCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  metricHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metricTitle: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  metricValue: { fontSize: 20, fontWeight: '800', color: Colors.text },
  trendIndicator: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  trendValue: { fontSize: 13, fontWeight: '700' },
  distributionList: { gap: 12 },
  distributionItem: { gap: 8 },
  distributionInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  distributionLabel: { fontSize: 14, fontWeight: '700', color: Colors.text },
  distributionValue: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  distributionBar: { height: 8, backgroundColor: Colors.surfaceLight, borderRadius: 4, overflow: 'hidden' },
  distributionBarFill: { height: '100%' },
  chartContainer: { flexDirection: 'row', gap: 12, alignItems: 'flex-end', height: 150 },
  chartBarContainer: { flex: 1, alignItems: 'center', gap: 8 },
  chartBar: { flex: 1, width: '100%', borderRadius: 8, overflow: 'hidden', backgroundColor: Colors.surfaceLight },
  chartBarFill: { width: '100%', borderRadius: 8 },
  chartBarLabel: { fontSize: 10, fontWeight: '600', color: Colors.textSecondary },
  statsRow: { flexDirection: 'row', gap: 12 },
  statItem: { flex: 1, backgroundColor: Colors.surface, borderRadius: 12, padding: 16, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 28, fontWeight: '800', color: Colors.text },
  statLabel: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary, textAlign: 'center' },
  alertCard: { backgroundColor: Colors.warning + '20', borderRadius: 16, padding: 20, gap: 12 },
  alertHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  alertTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },
  alertValue: { fontSize: 48, fontWeight: '800', color: Colors.warning },
  alertSubtext: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  forecastGrid: { flexDirection: 'row', gap: 12 },
  forecastCard: { flex: 1, backgroundColor: Colors.surface, borderRadius: 12, padding: 16, gap: 8 },
  forecastLabel: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  forecastValue: { fontSize: 20, fontWeight: '800', color: Colors.success },
  confidenceText: { fontSize: 13, fontWeight: '700', color: Colors.primary, paddingLeft: 4 },
  growthCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 24, alignItems: 'center', gap: 8 },
  growthValue: { fontSize: 56, fontWeight: '800', color: Colors.primary },
  growthLabel: { fontSize: 14, fontWeight: '700', color: Colors.text },
  growthTimeframe: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
});
