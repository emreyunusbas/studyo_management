/**
 * Payment History Screen - View all payment records with filters
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Search,
  DollarSign,
  CreditCard,
  Wallet,
  Filter,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { MOCK_PAYMENTS } from '@/constants/mockData';
import { useApp } from '@/contexts/AppContext';

type PaymentMethod = 'ALL' | 'CASH' | 'CARD' | 'BANK_TRANSFER';
type PaymentStatus = 'ALL' | 'COMPLETED' | 'PENDING';

export default function PaymentHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus>('ALL');

  const texts = {
    tr: {
      title: 'Ödeme Geçmişi',
      search: 'Üye ara...',
      filters: 'Filtreler',
      method: 'Ödeme Yöntemi',
      status: 'Durum',
      all: 'Tümü',
      statistics: 'İstatistikler',
      totalAmount: 'Toplam Tutar',
      totalPayments: 'Toplam Ödeme',
      avgPayment: 'Ortalama',
      completedPayments: 'Tamamlanan',
      pendingPayments: 'Bekleyen',
      noPayments: 'Ödeme bulunamadı',
      paymentMethods: {
        CASH: 'Nakit',
        CARD: 'Kart',
        BANK_TRANSFER: 'Havale',
      },
      paymentStatus: {
        COMPLETED: 'Tamamlandı',
        PENDING: 'Bekliyor',
      },
      paymentTypes: {
        PACKAGE_PURCHASE: 'Paket Alımı',
        PARTIAL_PAYMENT: 'Taksit',
        RENEWAL: 'Yenileme',
      },
    },
    en: {
      title: 'Payment History',
      search: 'Search member...',
      filters: 'Filters',
      method: 'Payment Method',
      status: 'Status',
      all: 'All',
      statistics: 'Statistics',
      totalAmount: 'Total Amount',
      totalPayments: 'Total Payments',
      avgPayment: 'Average',
      completedPayments: 'Completed',
      pendingPayments: 'Pending',
      noPayments: 'No payments found',
      paymentMethods: {
        CASH: 'Cash',
        CARD: 'Card',
        BANK_TRANSFER: 'Transfer',
      },
      paymentStatus: {
        COMPLETED: 'Completed',
        PENDING: 'Pending',
      },
      paymentTypes: {
        PACKAGE_PURCHASE: 'Package Purchase',
        PARTIAL_PAYMENT: 'Installment',
        RENEWAL: 'Renewal',
      },
    },
  };

  const t = texts[language];

  // Filter payments
  const filteredPayments = MOCK_PAYMENTS.filter((payment) => {
    const matchesSearch = payment.memberName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesMethod =
      selectedMethod === 'ALL' || payment.paymentMethod === selectedMethod;

    const matchesStatus =
      selectedStatus === 'ALL' || payment.status === selectedStatus;

    return matchesSearch && matchesMethod && matchesStatus;
  });

  // Calculate statistics
  const completedPayments = filteredPayments.filter((p) => p.status === 'COMPLETED');
  const totalAmount = completedPayments.reduce((sum, p) => sum + p.amount, 0);
  const avgPayment =
    completedPayments.length > 0 ? totalAmount / completedPayments.length : 0;

  const formatCurrency = (amount: number) => {
    return `₺${amount.toLocaleString('tr-TR')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'CASH':
        return <DollarSign size={20} color={Colors.success} />;
      case 'CARD':
        return <CreditCard size={20} color={Colors.info} />;
      case 'BANK_TRANSFER':
        return <Wallet size={20} color={Colors.accent} />;
      default:
        return <DollarSign size={20} color={Colors.textSecondary} />;
    }
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

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color={Colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder={t.search}
              placeholderTextColor={Colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Statistics Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statsContainer}
          contentContainerStyle={styles.statsContent}
        >
          <View style={styles.statCard}>
            <LinearGradient
              colors={[Colors.success, '#22c55e']}
              style={styles.statGradient}
            >
              <DollarSign size={24} color={Colors.background} />
              <Text style={styles.statValue}>{formatCurrency(totalAmount)}</Text>
              <Text style={styles.statLabel}>{t.totalAmount}</Text>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={styles.statGradient}
            >
              <Calendar size={24} color={Colors.background} />
              <Text style={styles.statValue}>{filteredPayments.length}</Text>
              <Text style={styles.statLabel}>{t.totalPayments}</Text>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={[Colors.info, '#3b82f6']}
              style={styles.statGradient}
            >
              <TrendingUp size={24} color={Colors.background} />
              <Text style={styles.statValue}>{formatCurrency(avgPayment)}</Text>
              <Text style={styles.statLabel}>{t.avgPayment}</Text>
            </LinearGradient>
          </View>
        </ScrollView>

        {/* Filters */}
        <View style={styles.filtersSection}>
          <Text style={styles.filtersTitle}>{t.filters}</Text>

          {/* Payment Method Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterRow}
            contentContainerStyle={styles.filterRowContent}
          >
            <Text style={styles.filterLabel}>{t.method}:</Text>
            {(['ALL', 'CASH', 'CARD', 'BANK_TRANSFER'] as PaymentMethod[]).map(
              (method) => (
                <TouchableOpacity
                  key={method}
                  style={[
                    styles.filterChip,
                    selectedMethod === method && styles.filterChipActive,
                  ]}
                  onPress={() => setSelectedMethod(method)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedMethod === method && styles.filterChipTextActive,
                    ]}
                  >
                    {method === 'ALL' ? t.all : t.paymentMethods[method]}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </ScrollView>

          {/* Status Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterRow}
            contentContainerStyle={styles.filterRowContent}
          >
            <Text style={styles.filterLabel}>{t.status}:</Text>
            {(['ALL', 'COMPLETED', 'PENDING'] as PaymentStatus[]).map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterChip,
                  selectedStatus === status && styles.filterChipActive,
                ]}
                onPress={() => setSelectedStatus(status)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedStatus === status && styles.filterChipTextActive,
                  ]}
                >
                  {status === 'ALL' ? t.all : t.paymentStatus[status]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Payment List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
        >
          {filteredPayments.length > 0 ? (
            filteredPayments.map((payment) => (
              <View key={payment.id} style={styles.paymentCard}>
                <View style={styles.paymentIconContainer}>
                  {getMethodIcon(payment.paymentMethod)}
                </View>

                <View style={styles.paymentInfo}>
                  <View style={styles.paymentHeader}>
                    <Text style={styles.paymentMember}>{payment.memberName}</Text>
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
                      {payment.status === 'COMPLETED' ? (
                        <CheckCircle size={10} color={Colors.background} />
                      ) : (
                        <Clock size={10} color={Colors.background} />
                      )}
                      <Text style={styles.statusText}>
                        {t.paymentStatus[payment.status]}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.paymentPackage}>{payment.packageName}</Text>

                  <View style={styles.paymentMeta}>
                    <View style={styles.paymentMetaItem}>
                      <Text style={styles.paymentMethod}>
                        {t.paymentMethods[payment.paymentMethod]}
                      </Text>
                    </View>
                    <View style={styles.paymentMetaItem}>
                      <Calendar size={12} color={Colors.textTertiary} />
                      <Text style={styles.paymentDate}>{formatDate(payment.date)}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.paymentAmount}>
                  <Text style={styles.amountValue}>{formatCurrency(payment.amount)}</Text>
                  <Text style={styles.amountLabel}>{t.paymentTypes[payment.type]}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Wallet size={64} color={Colors.textTertiary} />
              <Text style={styles.emptyStateText}>{t.noPayments}</Text>
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },
  statsContainer: {
    marginBottom: 20,
  },
  statsContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
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
    padding: 16,
    gap: 8,
    minWidth: 140,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.background,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.background,
    opacity: 0.9,
  },
  filtersSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  filterRow: {
    flexGrow: 0,
  },
  filterRowContent: {
    alignItems: 'center',
    gap: 8,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  filterChipTextActive: {
    color: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentInfo: {
    flex: 1,
    gap: 4,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  paymentMember: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.background,
  },
  paymentPackage: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  paymentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
  paymentAmount: {
    alignItems: 'flex-end',
    gap: 2,
  },
  amountValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  amountLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  emptyState: {
    paddingVertical: 80,
    alignItems: 'center',
    gap: 12,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
