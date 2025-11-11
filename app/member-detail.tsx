/**
 * Member Detail Screen - View member information and quick actions
 */

import React from 'react';
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
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Ruler,
  RefreshCw,
  User,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { MOCK_MEMBERS } from '@/constants/mockData';
import { useApp } from '@/contexts/AppContext';

export default function MemberDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();
  const params = useLocalSearchParams();
  const memberId = params.id as string;

  // Find member from mock data
  const member = MOCK_MEMBERS.find((m) => m.id === memberId) || MOCK_MEMBERS[0];

  const texts = {
    tr: {
      title: 'Üye Detayı',
      memberInfo: 'Üye Bilgileri',
      packageInfo: 'Paket Bilgileri',
      quickActions: 'Hızlı İşlemler',
      remainingSessions: 'Kalan Seans',
      openableSessions: 'Açılabilir Seans',
      endDate: 'Bitiş Tarihi',
      lastPayment: 'Son Ödeme',
      remainingPayment: 'Kalan Ödeme',
      membershipType: 'Üyelik Tipi',
      membershipTypes: {
        GRUP: 'Grup',
        BİREBİR: 'Birebir',
        DÜET: 'Düet',
        HAMİLE: 'Hamile',
        FİZYOTERAPİST: 'Fizyoterapist',
      },
      takePayment: 'Ödeme Al',
      addMeasurement: 'Ölçüm Ekle',
      renewPackage: 'Paket Yenile',
      viewSessions: 'Seanslar',
    },
    en: {
      title: 'Member Detail',
      memberInfo: 'Member Information',
      packageInfo: 'Package Information',
      quickActions: 'Quick Actions',
      remainingSessions: 'Remaining Sessions',
      openableSessions: 'Openable Sessions',
      endDate: 'End Date',
      lastPayment: 'Last Payment',
      remainingPayment: 'Remaining Payment',
      membershipType: 'Membership Type',
      membershipTypes: {
        GRUP: 'Group',
        BİREBİR: 'One-on-One',
        DÜET: 'Duet',
        HAMİLE: 'Pregnant',
        FİZYOTERAPİST: 'Physiotherapist',
      },
      takePayment: 'Take Payment',
      addMeasurement: 'Add Measurement',
      renewPackage: 'Renew Package',
      viewSessions: 'Sessions',
    },
  };

  const t = texts[language];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleAction = (route: string) => {
    router.push(`${route}?memberId=${memberId}` as any);
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
          {/* Member Header Card */}
          <View style={styles.memberHeaderCard}>
            <LinearGradient
              colors={[Colors.surface, Colors.surfaceLight]}
              style={styles.memberHeaderGradient}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {member.firstName[0]}
                  {member.lastName[0]}
                </Text>
              </View>
              <View style={styles.memberHeaderInfo}>
                <Text style={styles.memberName}>
                  {member.firstName} {member.lastName}
                </Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {t.membershipTypes[member.membershipType]}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Package Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.packageInfo}</Text>

            <View style={styles.infoGrid}>
              <View style={styles.infoCard}>
                <Calendar size={24} color={Colors.primary} />
                <Text style={styles.infoLabel}>{t.remainingSessions}</Text>
                <Text style={styles.infoValue}>
                  {member.remainingCredits}/{member.openableCredits}
                </Text>
              </View>

              <View style={styles.infoCard}>
                <Calendar size={24} color={Colors.info} />
                <Text style={styles.infoLabel}>{t.endDate}</Text>
                <Text style={styles.infoValue}>{formatDate(member.endDate)}</Text>
              </View>
            </View>

            {/* Payment Info */}
            {member.lastPaymentAmount !== undefined && (
              <View style={styles.infoGrid}>
                <View style={styles.infoCard}>
                  <CreditCard size={24} color={Colors.success} />
                  <Text style={styles.infoLabel}>{t.lastPayment}</Text>
                  <Text style={styles.infoValue}>₺{member.lastPaymentAmount}</Text>
                </View>

                <View style={styles.infoCard}>
                  <CreditCard size={24} color={Colors.warning} />
                  <Text style={styles.infoLabel}>{t.remainingPayment}</Text>
                  <Text style={[
                    styles.infoValue,
                    { color: member.remainingPayment && member.remainingPayment > 0 ? Colors.warning : Colors.success }
                  ]}>
                    ₺{member.remainingPayment || 0}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.quickActions}</Text>

            <View style={styles.actionsGrid}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleAction('/member-payment')}
              >
                <LinearGradient
                  colors={[Colors.success, '#3fbd6e']}
                  style={styles.actionGradient}
                >
                  <CreditCard size={28} color={Colors.text} />
                  <Text style={styles.actionText}>{t.takePayment}</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleAction('/member-measurements')}
              >
                <LinearGradient
                  colors={[Colors.accent, '#b02fc4']}
                  style={styles.actionGradient}
                >
                  <Ruler size={28} color={Colors.text} />
                  <Text style={styles.actionText}>{t.addMeasurement}</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleAction('/member-renew-package')}
              >
                <LinearGradient
                  colors={[Colors.info, '#2b6ccc']}
                  style={styles.actionGradient}
                >
                  <RefreshCw size={28} color={Colors.text} />
                  <Text style={styles.actionText}>{t.renewPackage}</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleAction('/member-session-report')}
              >
                <LinearGradient
                  colors={[Colors.secondary, '#e67539']}
                  style={styles.actionGradient}
                >
                  <Calendar size={28} color={Colors.text} />
                  <Text style={styles.actionText}>{t.viewSessions}</Text>
                </LinearGradient>
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
  },
  memberHeaderCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  memberHeaderGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    gap: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.background,
  },
  memberHeaderInfo: {
    flex: 1,
    gap: 12,
  },
  memberName: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: Colors.primary,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.background,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  infoCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    width: '48%',
    height: 100,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
});
