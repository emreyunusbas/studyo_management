/**
 * Finance Screen - Financial dashboard and overview
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Package,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Wallet,
  Receipt,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { MOCK_PAYMENTS, MOCK_PACKAGES } from '@/constants/mockData';
import { useApp } from '@/contexts/AppContext';

export default function FinanceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();

  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'year'>('month');

  const texts = {
    tr: {
      title: 'Finans',
      overview: 'Genel Bakış',
      totalRevenue: 'Toplam Gelir',
      thisMonth: 'Bu Ay',
      pendingPayments: 'Bekleyen Ödemeler',
      completedPayments: 'Tamamlanan',
      recentPayments: 'Son Ödemeler',
      quickActions: 'Hızlı İşlemler',
      viewAllPayments: 'Tüm Ödemeler',
      managePackages: 'Paket Yönetimi',
      financialReports: 'Finansal Raporlar',
      viewAll: 'Tümünü Gör',
      period: {
        month: 'Ay',
        year: 'Yıl',
      },
      paymentMethods: {
        CASH: 'Nakit',
        CARD: 'Kart',
        BANK_TRANSFER: 'Havale',
      },
      status: {
        COMPLETED: 'Tamamlandı',
        PENDING: 'Bekliyor',
      },
      trend: 'Eğilim',
      vsLastPeriod: 'Geçen döneme göre',
    },
    en: {
      title: 'Finance',
      overview: 'Overview',
      totalRevenue: 'Total Revenue',
      thisMonth: 'This Month',
      pendingPayments: 'Pending Payments',
      completedPayments: 'Completed',
      recentPayments: 'Recent Payments',
      quickActions: 'Quick Actions',
      viewAllPayments: 'All Payments',
      managePackages: 'Manage Packages',
      financialReports: 'Financial Reports',
      viewAll: 'View All',
      period: {
        month: 'Month',
        year: 'Year',
      },
      paymentMethods: {
        CASH: 'Cash',
        CARD: 'Card',
        BANK_TRANSFER: 'Transfer',
      },
      status: {
        COMPLETED: 'Completed',
        PENDING: 'Pending',
      },
      trend: 'Trend',
      vsLastPeriod: 'vs last period',
    },
  };

  const t = texts[language];

  // Calculate statistics
  const completedPayments = MOCK_PAYMENTS.filter((p) => p.status === 'COMPLETED');
  const pendingPayments = MOCK_PAYMENTS.filter((p) => p.status === 'PENDING');

  const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

  // Mock: This month's revenue (in real app, filter by date)
  const thisMonthRevenue = completedPayments.slice(0, 3).reduce((sum, p) => sum + p.amount, 0);

  // Mock trend data
  const revenueTrend = '+15.5'; // Percentage increase

  const formatCurrency = (amount: number) => {
    return `₺${amount.toLocaleString('tr-TR')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'short',
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
          <Text style={styles.title}>{t.title}</Text>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {(['month', 'year'] as const).map((period) => (
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
          {/* Revenue Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.overview}</Text>

            {/* Total Revenue Card */}
            <TouchableOpacity
              style={styles.revenueCard}
              activeOpacity={0.9}
              onPress={() => router.push('/payment-history' as any)}
            >
              <LinearGradient
                colors={[Colors.success, '#22c55e']}
                style={styles.revenueGradient}
              >
                <View style={styles.revenueContent}>
                  <View style={styles.revenueHeader}>
                    <DollarSign size={32} color={Colors.background} />
                    <View style={styles.trendBadge}>
                      <TrendingUp size={12} color={Colors.background} />
                      <Text style={styles.trendText}>{revenueTrend}%</Text>
                    </View>
                  </View>
                  <Text style={styles.revenueLabel}>{t.totalRevenue}</Text>
                  <Text style={styles.revenueValue}>{formatCurrency(totalRevenue)}</Text>
                  <Text style={styles.revenueSubtext}>{t.vsLastPeriod}</Text>
                </View>
                <TrendingUp size={80} color={Colors.background} style={{ opacity: 0.2 }} />
              </LinearGradient>
            </TouchableOpacity>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Wallet size={24} color={Colors.primary} />
                <Text style={styles.statValue}>{formatCurrency(thisMonthRevenue)}</Text>
                <Text style={styles.statLabel}>{t.thisMonth}</Text>
              </View>

              <View style={styles.statCard}>
                <Clock size={24} color={Colors.warning} />
                <Text style={styles.statValue}>{formatCurrency(pendingAmount)}</Text>
                <Text style={styles.statLabel}>{t.pendingPayments}</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.miniStatCard}>
                <CheckCircle size={20} color={Colors.success} />
                <View style={styles.miniStatContent}>
                  <Text style={styles.miniStatValue}>{completedPayments.length}</Text>
                  <Text style={styles.miniStatLabel}>{t.completedPayments}</Text>
                </View>
              </View>

              <View style={styles.miniStatCard}>
                <AlertCircle size={20} color={Colors.error} />
                <View style={styles.miniStatContent}>
                  <Text style={styles.miniStatValue}>{pendingPayments.length}</Text>
                  <Text style={styles.miniStatLabel}>{t.pendingPayments}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.quickActions}</Text>

            <View style={styles.actionsGrid}>
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => router.push('/payment-history' as any)}
              >
                <LinearGradient
                  colors={[Colors.info, '#3b82f6']}
                  style={styles.actionGradient}
                >
                  <Receipt size={28} color={Colors.background} />
                  <Text style={styles.actionText}>{t.viewAllPayments}</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => router.push('/package-management' as any)}
              >
                <LinearGradient
                  colors={[Colors.accent, '#ec4899']}
                  style={styles.actionGradient}
                >
                  <Package size={28} color={Colors.background} />
                  <Text style={styles.actionText}>{t.managePackages}</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => router.push('/financial-reports' as any)}
              >
                <LinearGradient
                  colors={[Colors.warning, '#f59e0b']}
                  style={styles.actionGradient}
                >
                  <FileText size={28} color={Colors.background} />
                  <Text style={styles.actionText}>{t.financialReports}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Payments */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t.recentPayments}</Text>
              <TouchableOpacity onPress={() => router.push('/payment-history' as any)}>
                <Text style={styles.viewAllButton}>{t.viewAll}</Text>
              </TouchableOpacity>
            </View>

            {MOCK_PAYMENTS.slice(0, 5).map((payment) => (
              <View key={payment.id} style={styles.paymentCard}>
                <View style={styles.paymentIcon}>
                  {payment.paymentMethod === 'CASH' ? (
                    <DollarSign size={20} color={Colors.success} />
                  ) : payment.paymentMethod === 'CARD' ? (
                    <CreditCard size={20} color={Colors.info} />
                  ) : (
                    <Wallet size={20} color={Colors.accent} />
                  )}
                </View>

                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentMember}>{payment.memberName}</Text>
                  <Text style={styles.paymentPackage}>{payment.packageName}</Text>
                  <View style={styles.paymentMeta}>
                    <Text style={styles.paymentMethod}>
                      {t.paymentMethods[payment.paymentMethod]}
                    </Text>
                    <Text style={styles.paymentDate}>{formatDate(payment.date)}</Text>
                  </View>
                </View>

                <View style={styles.paymentRight}>
                  <Text style={styles.paymentAmount}>{formatCurrency(payment.amount)}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          payment.status === 'COMPLETED'
                            ? Colors.success
                            : Colors.warning,
                      },
                    ]}
                  >
                    <Text style={styles.statusText}>{t.status[payment.status]}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Active Packages Info */}
          <View style={styles.section}>
            <View style={styles.infoCard}>
              <Package size={24} color={Colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Aktif Paketler</Text>
                <Text style={styles.infoValue}>{MOCK_PACKAGES.length} paket mevcut</Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push('/package-management' as any)}
              >
                <ChevronRight size={24} color={Colors.textSecondary} />
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
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
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
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAllButton: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  revenueCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  revenueGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
  },
  revenueContent: {
    gap: 8,
  },
  revenueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
    fontSize: 12,
    fontWeight: '800',
    color: Colors.success,
  },
  revenueLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.background,
    opacity: 0.9,
  },
  revenueValue: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.background,
  },
  revenueSubtext: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.background,
    opacity: 0.7,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
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
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  miniStatCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
  },
  miniStatContent: {
    gap: 2,
  },
  miniStatValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  miniStatLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 10,
    minHeight: 110,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.background,
    textAlign: 'center',
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentInfo: {
    flex: 1,
    gap: 3,
  },
  paymentMember: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  paymentPackage: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  paymentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  paymentMethod: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  paymentDate: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textTertiary,
  },
  paymentRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.background,
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
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
