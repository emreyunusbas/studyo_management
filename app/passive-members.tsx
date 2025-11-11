/**
 * Passive Members Screen - Track and manage inactive members
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
  User,
  Calendar,
  AlertCircle,
  MessageSquare,
  RefreshCw,
  Clock,
  TrendingDown,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { MOCK_MEMBERS } from '@/constants/mockData';
import { useApp } from '@/contexts/AppContext';

interface PassiveMember {
  id: string;
  firstName: string;
  lastName: string;
  membershipType: string;
  lastSessionDate: string;
  packageEndDate: string;
  daysSinceLastSession: number;
  status: 'inactive' | 'expired' | 'at-risk';
  remainingCredits: number;
  openableCredits: number;
}

// Mock passive members data
const PASSIVE_MEMBERS: PassiveMember[] = [
  {
    id: '4',
    firstName: 'Zeynep',
    lastName: 'Kaya',
    membershipType: 'GRUP',
    lastSessionDate: '2024-12-15',
    packageEndDate: '2025-01-20',
    daysSinceLastSession: 27,
    status: 'inactive',
    remainingCredits: 6,
    openableCredits: 12,
  },
  {
    id: '5',
    firstName: 'Can',
    lastName: 'Öztürk',
    membershipType: 'BİREBİR',
    lastSessionDate: '2024-12-01',
    packageEndDate: '2025-01-05',
    daysSinceLastSession: 41,
    status: 'expired',
    remainingCredits: 0,
    openableCredits: 8,
  },
  {
    id: '6',
    firstName: 'Elif',
    lastName: 'Şahin',
    membershipType: 'DÜET',
    lastSessionDate: '2025-01-01',
    packageEndDate: '2025-02-15',
    daysSinceLastSession: 10,
    status: 'at-risk',
    remainingCredits: 10,
    openableCredits: 16,
  },
];

export default function PassiveMembersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'inactive' | 'expired' | 'at-risk'>('all');

  const texts = {
    tr: {
      title: 'Pasif Üyeler',
      statistics: 'İstatistikler',
      totalPassive: 'Toplam Pasif',
      inactive: 'Aktif Değil',
      expired: 'Süresi Dolmuş',
      atRisk: 'Risk Altında',
      all: 'Tümü',
      members: 'Üye',
      lastSession: 'Son Seans',
      daysAgo: 'gün önce',
      packageExpired: 'Paket süresi doldu',
      remainingSessions: 'Kalan Seans',
      actions: 'İşlemler',
      sendReminder: 'Hatırlat',
      renewPackage: 'Yenile',
      viewDetail: 'Detay',
      noPassiveMembers: 'Pasif üye yok',
      allMembersActive: 'Tüm üyeler aktif',
      membershipTypes: {
        GRUP: 'Grup',
        BİREBİR: 'Birebir',
        DÜET: 'Düet',
        HAMİLE: 'Hamile',
        FİZYOTERAPİST: 'Fizyoterapist',
      },
      statusLabels: {
        inactive: 'Aktif Değil',
        expired: 'Süresi Doldu',
        'at-risk': 'Risk Altında',
      },
      filterLabels: {
        all: 'Tümü',
        inactive: 'Aktif Değil',
        expired: 'Süresi Dolmuş',
        'at-risk': 'Risk Altında',
      },
    },
    en: {
      title: 'Passive Members',
      statistics: 'Statistics',
      totalPassive: 'Total Passive',
      inactive: 'Inactive',
      expired: 'Expired',
      atRisk: 'At Risk',
      all: 'All',
      members: 'Members',
      lastSession: 'Last Session',
      daysAgo: 'days ago',
      packageExpired: 'Package expired',
      remainingSessions: 'Remaining Sessions',
      actions: 'Actions',
      sendReminder: 'Remind',
      renewPackage: 'Renew',
      viewDetail: 'Details',
      noPassiveMembers: 'No passive members',
      allMembersActive: 'All members are active',
      membershipTypes: {
        GRUP: 'Group',
        BİREBİR: 'One-on-One',
        DÜET: 'Duet',
        HAMİLE: 'Pregnant',
        FİZYOTERAPİST: 'Physiotherapist',
      },
      statusLabels: {
        inactive: 'Inactive',
        expired: 'Expired',
        'at-risk': 'At Risk',
      },
      filterLabels: {
        all: 'All',
        inactive: 'Inactive',
        expired: 'Expired',
        'at-risk': 'At Risk',
      },
    },
  };

  const t = texts[language];

  const getFilteredMembers = () => {
    if (selectedFilter === 'all') return PASSIVE_MEMBERS;
    return PASSIVE_MEMBERS.filter((m) => m.status === selectedFilter);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'inactive':
        return Colors.warning;
      case 'expired':
        return Colors.error;
      case 'at-risk':
        return Colors.secondary;
      default:
        return Colors.textSecondary;
    }
  };

  const getStatCount = (status: 'inactive' | 'expired' | 'at-risk') => {
    return PASSIVE_MEMBERS.filter((m) => m.status === status).length;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleSendReminder = (member: PassiveMember) => {
    router.push(`/send-notification?memberId=${member.id}` as any);
  };

  const handleRenewPackage = (member: PassiveMember) => {
    router.push(`/member-renew-package?memberId=${member.id}` as any);
  };

  const handleViewDetail = (member: PassiveMember) => {
    router.push(`/member-detail?id=${member.id}` as any);
  };

  const filteredMembers = getFilteredMembers();

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
          {/* Statistics */}
          <View style={styles.statsCard}>
            <LinearGradient
              colors={[Colors.surface, Colors.surfaceLight]}
              style={styles.statsGradient}
            >
              <Text style={styles.statsTitle}>{t.statistics}</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <TrendingDown size={24} color={Colors.textSecondary} />
                  <Text style={styles.statLabel}>{t.totalPassive}</Text>
                  <Text style={styles.statValue}>{PASSIVE_MEMBERS.length}</Text>
                </View>

                <View style={styles.statItem}>
                  <Clock size={24} color={Colors.warning} />
                  <Text style={styles.statLabel}>{t.inactive}</Text>
                  <Text style={[styles.statValue, { color: Colors.warning }]}>
                    {getStatCount('inactive')}
                  </Text>
                </View>

                <View style={styles.statItem}>
                  <AlertCircle size={24} color={Colors.error} />
                  <Text style={styles.statLabel}>{t.expired}</Text>
                  <Text style={[styles.statValue, { color: Colors.error }]}>
                    {getStatCount('expired')}
                  </Text>
                </View>

                <View style={styles.statItem}>
                  <User size={24} color={Colors.secondary} />
                  <Text style={styles.statLabel}>{t.atRisk}</Text>
                  <Text style={[styles.statValue, { color: Colors.secondary }]}>
                    {getStatCount('at-risk')}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtersContainer}
            contentContainerStyle={styles.filtersContent}
          >
            {(['all', 'inactive', 'expired', 'at-risk'] as const).map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  selectedFilter === filter && styles.filterChipActive,
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedFilter === filter && styles.filterChipTextActive,
                  ]}
                >
                  {t.filterLabels[filter]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Members List */}
          <View style={styles.section}>
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <View key={member.id} style={styles.memberCard}>
                  <LinearGradient
                    colors={[Colors.surface, Colors.surfaceLight]}
                    style={styles.memberGradient}
                  >
                    {/* Member Header */}
                    <View style={styles.memberHeader}>
                      <View style={styles.memberAvatar}>
                        <Text style={styles.memberAvatarText}>
                          {member.firstName[0]}
                          {member.lastName[0]}
                        </Text>
                      </View>

                      <View style={styles.memberInfo}>
                        <Text style={styles.memberName}>
                          {member.firstName} {member.lastName}
                        </Text>
                        <View style={styles.memberBadges}>
                          <View
                            style={[
                              styles.statusBadge,
                              { backgroundColor: getStatusColor(member.status) },
                            ]}
                          >
                            <Text style={styles.statusBadgeText}>
                              {t.statusLabels[member.status]}
                            </Text>
                          </View>
                          <View style={styles.typeBadge}>
                            <Text style={styles.typeBadgeText}>
                              {t.membershipTypes[member.membershipType as keyof typeof t.membershipTypes]}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Member Details */}
                    <View style={styles.memberDetails}>
                      <View style={styles.detailRow}>
                        <Calendar size={16} color={Colors.textSecondary} />
                        <Text style={styles.detailLabel}>{t.lastSession}:</Text>
                        <Text style={styles.detailValue}>
                          {member.daysSinceLastSession} {t.daysAgo}
                        </Text>
                      </View>

                      <View style={styles.detailRow}>
                        <Clock size={16} color={Colors.textSecondary} />
                        <Text style={styles.detailLabel}>Paket Bitiş:</Text>
                        <Text
                          style={[
                            styles.detailValue,
                            member.status === 'expired' && { color: Colors.error },
                          ]}
                        >
                          {member.status === 'expired'
                            ? t.packageExpired
                            : formatDate(member.packageEndDate)}
                        </Text>
                      </View>

                      <View style={styles.detailRow}>
                        <User size={16} color={Colors.textSecondary} />
                        <Text style={styles.detailLabel}>{t.remainingSessions}:</Text>
                        <Text style={styles.detailValue}>
                          {member.remainingCredits}/{member.openableCredits}
                        </Text>
                      </View>
                    </View>

                    {/* Actions */}
                    <View style={styles.memberActions}>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.actionButtonPrimary]}
                        onPress={() => handleSendReminder(member)}
                      >
                        <MessageSquare size={16} color={Colors.background} />
                        <Text style={styles.actionButtonTextPrimary}>
                          {t.sendReminder}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionButton, styles.actionButtonSecondary]}
                        onPress={() => handleRenewPackage(member)}
                      >
                        <RefreshCw size={16} color={Colors.info} />
                        <Text style={styles.actionButtonTextSecondary}>
                          {t.renewPackage}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionButton, styles.actionButtonSecondary]}
                        onPress={() => handleViewDetail(member)}
                      >
                        <User size={16} color={Colors.accent} />
                        <Text style={styles.actionButtonTextSecondary}>
                          {t.viewDetail}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <User size={64} color={Colors.success} />
                <Text style={styles.emptyStateText}>{t.noPassiveMembers}</Text>
                <Text style={styles.emptyStateSubtext}>{t.allMembersActive}</Text>
              </View>
            )}
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
  },
  statsCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  statsGradient: {
    padding: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    width: '48%',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    gap: 6,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
  },
  filtersContainer: {
    marginBottom: 20,
  },
  filtersContent: {
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  filterChipTextActive: {
    color: Colors.background,
  },
  section: {
    gap: 16,
  },
  memberCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  memberGradient: {
    padding: 16,
    gap: 16,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  memberAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberAvatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.background,
  },
  memberInfo: {
    flex: 1,
    gap: 6,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  memberBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.background,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: Colors.surfaceLight,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  memberDetails: {
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceLight,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  memberActions: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceLight,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  actionButtonPrimary: {
    backgroundColor: Colors.primary,
  },
  actionButtonSecondary: {
    backgroundColor: Colors.background,
  },
  actionButtonTextPrimary: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.background,
  },
  actionButtonTextSecondary: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  emptyState: {
    paddingVertical: 100,
    alignItems: 'center',
    gap: 12,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.success,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
