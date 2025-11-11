/**
 * Financial Reports Screen - Generate and view financial reports
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
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  FileText,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  Users,
  CreditCard,
  BarChart3,
  PieChart,
  Share2,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { MOCK_PAYMENTS, MOCK_PACKAGES, MOCK_MEMBERS } from '@/constants/mockData';
import { useApp } from '@/contexts/AppContext';

type ReportType = 'revenue' | 'payments' | 'packages' | 'members';
type DateRange = 'week' | 'month' | 'quarter' | 'year';

export default function FinancialReportsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();

  const [selectedReport, setSelectedReport] = useState<ReportType>('revenue');
  const [selectedRange, setSelectedRange] = useState<DateRange>('month');

  const texts = {
    tr: {
      title: 'Finansal Raporlar',
      reportTypes: 'Rapor Türleri',
      dateRange: 'Tarih Aralığı',
      revenue: 'Gelir Raporu',
      payments: 'Ödeme Raporu',
      packages: 'Paket Raporu',
      members: 'Üye Raporu',
      week: 'Hafta',
      month: 'Ay',
      quarter: 'Çeyrek',
      year: 'Yıl',
      summary: 'Özet',
      totalRevenue: 'Toplam Gelir',
      totalPayments: 'Toplam Ödeme',
      avgPayment: 'Ortalama Ödeme',
      growth: 'Büyüme',
      topPackages: 'En Çok Satan Paketler',
      paymentMethods: 'Ödeme Yöntemleri',
      cash: 'Nakit',
      card: 'Kart',
      transfer: 'Havale',
      export: 'Dışa Aktar',
      share: 'Paylaş',
      generate: 'Rapor Oluştur',
      exportPDF: 'PDF Olarak Dışa Aktar',
      exportExcel: 'Excel Olarak Dışa Aktar',
      revenueByMonth: 'Aylık Gelir',
      paymentTrends: 'Ödeme Eğilimleri',
      packageSales: 'Paket Satışları',
      memberGrowth: 'Üye Artışı',
      viewDetails: 'Detayları Görüntüle',
    },
    en: {
      title: 'Financial Reports',
      reportTypes: 'Report Types',
      dateRange: 'Date Range',
      revenue: 'Revenue Report',
      payments: 'Payment Report',
      packages: 'Package Report',
      members: 'Member Report',
      week: 'Week',
      month: 'Month',
      quarter: 'Quarter',
      year: 'Year',
      summary: 'Summary',
      totalRevenue: 'Total Revenue',
      totalPayments: 'Total Payments',
      avgPayment: 'Avg Payment',
      growth: 'Growth',
      topPackages: 'Top Selling Packages',
      paymentMethods: 'Payment Methods',
      cash: 'Cash',
      card: 'Card',
      transfer: 'Transfer',
      export: 'Export',
      share: 'Share',
      generate: 'Generate Report',
      exportPDF: 'Export as PDF',
      exportExcel: 'Export as Excel',
      revenueByMonth: 'Monthly Revenue',
      paymentTrends: 'Payment Trends',
      packageSales: 'Package Sales',
      memberGrowth: 'Member Growth',
      viewDetails: 'View Details',
    },
  };

  const t = texts[language];

  // Calculate report data
  const completedPayments = MOCK_PAYMENTS.filter((p) => p.status === 'COMPLETED');
  const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);
  const avgPayment =
    completedPayments.length > 0 ? totalRevenue / completedPayments.length : 0;

  // Payment methods breakdown
  const cashPayments = completedPayments.filter((p) => p.paymentMethod === 'CASH');
  const cardPayments = completedPayments.filter((p) => p.paymentMethod === 'CARD');
  const transferPayments = completedPayments.filter(
    (p) => p.paymentMethod === 'BANK_TRANSFER'
  );

  const cashAmount = cashPayments.reduce((sum, p) => sum + p.amount, 0);
  const cardAmount = cardPayments.reduce((sum, p) => sum + p.amount, 0);
  const transferAmount = transferPayments.reduce((sum, p) => sum + p.amount, 0);

  // Mock growth data
  const growthRate = '+18.5';

  const formatCurrency = (amount: number) => {
    return `₺${amount.toLocaleString('tr-TR')}`;
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    Alert.alert(
      'Dışa Aktar',
      `Rapor ${format.toUpperCase()} olarak dışa aktarılıyor...`,
      [{ text: 'Tamam' }]
    );
  };

  const handleShare = () => {
    Alert.alert('Paylaş', 'Rapor paylaşılıyor...', [{ text: 'Tamam' }]);
  };

  const reportTypes: { type: ReportType; icon: any; color: string }[] = [
    { type: 'revenue', icon: DollarSign, color: Colors.success },
    { type: 'payments', icon: CreditCard, color: Colors.info },
    { type: 'packages', icon: Package, color: Colors.accent },
    { type: 'members', icon: Users, color: Colors.warning },
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
          <Text style={styles.title}>{t.title}</Text>
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <Share2 size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Report Type Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t.reportTypes}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.reportTypesContent}
          >
            {reportTypes.map(({ type, icon: Icon, color }) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.reportTypeCard,
                  selectedReport === type && styles.reportTypeCardActive,
                ]}
                onPress={() => setSelectedReport(type)}
              >
                <View
                  style={[
                    styles.reportTypeIcon,
                    { backgroundColor: selectedReport === type ? color : Colors.surfaceLight },
                  ]}
                >
                  <Icon
                    size={24}
                    color={selectedReport === type ? Colors.background : color}
                  />
                </View>
                <Text
                  style={[
                    styles.reportTypeText,
                    selectedReport === type && styles.reportTypeTextActive,
                  ]}
                >
                  {t[type]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Date Range Selector */}
        <View style={styles.section}>
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
          {/* Summary Card */}
          <View style={styles.summaryCard}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={styles.summaryGradient}
            >
              <View style={styles.summaryHeader}>
                <Text style={styles.summaryTitle}>{t.summary}</Text>
                <View style={styles.growthBadge}>
                  <TrendingUp size={14} color={Colors.background} />
                  <Text style={styles.growthText}>{growthRate}%</Text>
                </View>
              </View>

              <View style={styles.summaryStats}>
                <View style={styles.summaryStatItem}>
                  <Text style={styles.summaryStatLabel}>{t.totalRevenue}</Text>
                  <Text style={styles.summaryStatValue}>
                    {formatCurrency(totalRevenue)}
                  </Text>
                </View>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryStatItem}>
                  <Text style={styles.summaryStatLabel}>{t.totalPayments}</Text>
                  <Text style={styles.summaryStatValue}>{completedPayments.length}</Text>
                </View>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryStatItem}>
                  <Text style={styles.summaryStatLabel}>{t.avgPayment}</Text>
                  <Text style={styles.summaryStatValue}>
                    {formatCurrency(avgPayment)}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Payment Methods Breakdown */}
          <View style={styles.reportSection}>
            <View style={styles.reportSectionHeader}>
              <PieChart size={20} color={Colors.primary} />
              <Text style={styles.reportSectionTitle}>{t.paymentMethods}</Text>
            </View>

            <View style={styles.paymentMethodsGrid}>
              <View style={styles.paymentMethodCard}>
                <LinearGradient
                  colors={[Colors.success, '#22c55e']}
                  style={styles.paymentMethodGradient}
                >
                  <DollarSign size={24} color={Colors.background} />
                  <Text style={styles.paymentMethodValue}>
                    {formatCurrency(cashAmount)}
                  </Text>
                  <Text style={styles.paymentMethodLabel}>{t.cash}</Text>
                  <Text style={styles.paymentMethodCount}>
                    {cashPayments.length} ödeme
                  </Text>
                </LinearGradient>
              </View>

              <View style={styles.paymentMethodCard}>
                <LinearGradient
                  colors={[Colors.info, '#3b82f6']}
                  style={styles.paymentMethodGradient}
                >
                  <CreditCard size={24} color={Colors.background} />
                  <Text style={styles.paymentMethodValue}>
                    {formatCurrency(cardAmount)}
                  </Text>
                  <Text style={styles.paymentMethodLabel}>{t.card}</Text>
                  <Text style={styles.paymentMethodCount}>
                    {cardPayments.length} ödeme
                  </Text>
                </LinearGradient>
              </View>

              <View style={styles.paymentMethodCard}>
                <LinearGradient
                  colors={[Colors.accent, '#ec4899']}
                  style={styles.paymentMethodGradient}
                >
                  <CreditCard size={24} color={Colors.background} />
                  <Text style={styles.paymentMethodValue}>
                    {formatCurrency(transferAmount)}
                  </Text>
                  <Text style={styles.paymentMethodLabel}>{t.transfer}</Text>
                  <Text style={styles.paymentMethodCount}>
                    {transferPayments.length} ödeme
                  </Text>
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* Top Packages */}
          <View style={styles.reportSection}>
            <View style={styles.reportSectionHeader}>
              <BarChart3 size={20} color={Colors.primary} />
              <Text style={styles.reportSectionTitle}>{t.topPackages}</Text>
            </View>

            {MOCK_PACKAGES.slice(0, 3).map((pkg, index) => (
              <View key={pkg.id} style={styles.packageRankCard}>
                <View style={styles.packageRank}>
                  <Text style={styles.packageRankText}>{index + 1}</Text>
                </View>

                <View style={styles.packageRankInfo}>
                  <Text style={styles.packageRankName}>{pkg.name}</Text>
                  <Text style={styles.packageRankDetails}>
                    {pkg.sessionCount} seans • {pkg.validityDays} gün
                  </Text>
                </View>

                <Text style={styles.packageRankPrice}>{formatCurrency(pkg.price)}</Text>
              </View>
            ))}
          </View>

          {/* Export Actions */}
          <View style={styles.exportSection}>
            <Text style={styles.exportTitle}>{t.export}</Text>

            <TouchableOpacity
              style={styles.exportButton}
              onPress={() => handleExport('pdf')}
            >
              <LinearGradient
                colors={[Colors.error, '#dc2626']}
                style={styles.exportGradient}
              >
                <FileText size={20} color={Colors.background} />
                <Text style={styles.exportButtonText}>{t.exportPDF}</Text>
                <Download size={18} color={Colors.background} />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.exportButton}
              onPress={() => handleExport('excel')}
            >
              <LinearGradient
                colors={[Colors.success, '#22c55e']}
                style={styles.exportGradient}
              >
                <FileText size={20} color={Colors.background} />
                <Text style={styles.exportButtonText}>{t.exportExcel}</Text>
                <Download size={18} color={Colors.background} />
              </LinearGradient>
            </TouchableOpacity>
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
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  reportTypesContent: {
    gap: 12,
  },
  reportTypeCard: {
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    minWidth: 100,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  reportTypeCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceLight,
  },
  reportTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  reportTypeTextActive: {
    color: Colors.text,
    fontWeight: '700',
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
    gap: 20,
  },
  summaryCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  summaryGradient: {
    padding: 20,
    gap: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.background,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: Colors.background,
  },
  growthText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.success,
  },
  summaryStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryStatItem: {
    flex: 1,
    gap: 6,
  },
  summaryStatLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.background,
    opacity: 0.8,
  },
  summaryStatValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.background,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.background,
    opacity: 0.3,
    marginHorizontal: 8,
  },
  reportSection: {
    gap: 12,
  },
  reportSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reportSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  paymentMethodsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  paymentMethodCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  paymentMethodGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 6,
    minHeight: 140,
  },
  paymentMethodValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.background,
  },
  paymentMethodLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.background,
    opacity: 0.9,
  },
  paymentMethodCount: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.background,
    opacity: 0.7,
  },
  packageRankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
  },
  packageRank: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  packageRankText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.background,
  },
  packageRankInfo: {
    flex: 1,
    gap: 2,
  },
  packageRankName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  packageRankDetails: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  packageRankPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
  },
  exportSection: {
    gap: 12,
  },
  exportTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  exportButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  exportGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 16,
  },
  exportButtonText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.background,
  },
});
