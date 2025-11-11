/**
 * Dashboard Screen - Main home screen
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Bell,
  Users,
  UserPlus,
  Calendar,
  DollarSign,
  Settings,
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { MOCK_WEEKLY_SESSIONS, WEEK_DAYS } from '@/constants/mockData';
import { useApp } from '@/contexts/AppContext';

const { width } = Dimensions.get('window');
const cardWidth = (width - 52) / 2; // 20px padding * 2 + 12px gap

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useApp();

  const handleNavigate = (route: string) => {
    // router.push(route as any);
    console.log('Navigate to:', route);
  };

  // Calculate week number
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);

  // Weekly sessions data
  const maxCount = Math.max(...MOCK_WEEKLY_SESSIONS.map((s) => s.count));

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>PS</Text>
            </View>
            <Text style={styles.brandName}>
              {user?.studioName || 'PilatesSalon'}
            </Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Big Card - Members */}
        <TouchableOpacity
          style={styles.bigCard}
          onPress={() => handleNavigate('/members-list')}
          activeOpacity={0.8}
        >
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800' }}
            style={styles.bigCardImage}
            imageStyle={styles.bigCardImageStyle}
          >
            <LinearGradient
              colors={['rgba(26,29,35,0.7)', 'rgba(26,29,35,0.9)']}
              style={styles.bigCardOverlay}
            >
              <Users size={40} color={Colors.primary} />
              <Text style={styles.bigCardTitle}>ÜYELER</Text>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>

        {/* 2x2 Grid Cards */}
        <View style={styles.gridContainer}>
          {/* Trainers */}
          <TouchableOpacity
            style={[styles.gridCard, { width: cardWidth }]}
            onPress={() => handleNavigate('/trainers-menu')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.surface, Colors.surfaceLight]}
              style={styles.gridCardGradient}
            >
              <UserPlus size={28} color={Colors.secondary} />
              <Text style={styles.gridCardTitle}>EĞİTMENLER</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Sessions */}
          <TouchableOpacity
            style={[styles.gridCard, { width: cardWidth }]}
            onPress={() => handleNavigate('/sessions-menu')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.surface, Colors.surfaceLight]}
              style={styles.gridCardGradient}
            >
              <Calendar size={28} color={Colors.primary} />
              <Text style={styles.gridCardTitle}>SEANSLAR</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Finance */}
          <TouchableOpacity
            style={[styles.gridCard, { width: cardWidth }]}
            onPress={() => handleNavigate('/finance')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.surface, Colors.surfaceLight]}
              style={styles.gridCardGradient}
            >
              <DollarSign size={28} color={Colors.success} />
              <Text style={styles.gridCardTitle}>FİNANS</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Settings */}
          <TouchableOpacity
            style={[styles.gridCard, { width: cardWidth }]}
            onPress={() => router.push('/settings')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.surface, Colors.surfaceLight]}
              style={styles.gridCardGradient}
            >
              <Settings size={28} color={Colors.textSecondary} />
              <Text style={styles.gridCardTitle}>AYARLAR</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Weekly Sessions Widget */}
        <View style={styles.widgetCard}>
          <View style={styles.widgetHeader}>
            <Text style={styles.widgetTitle}>haftalık seanslar</Text>
            <Text style={styles.weekNumber}>{weekNumber}. HAFTA</Text>
          </View>

          <View style={styles.chartContainer}>
            {MOCK_WEEKLY_SESSIONS.map((item, index) => (
              <View key={index} style={styles.chartItem}>
                <View
                  style={[
                    styles.chartBar,
                    { height: (item.count / maxCount) * 80 },
                  ]}
                >
                  <LinearGradient
                    colors={[Colors.primary, Colors.primaryDark]}
                    style={styles.chartBarGradient}
                  >
                    <Text style={styles.chartCount}>{item.count}</Text>
                  </LinearGradient>
                </View>
                <Text style={styles.chartDay}>{item.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Daily Remaining Sessions */}
        <View style={styles.widgetCard}>
          <Text style={styles.widgetTitle}>günlük kalan seanslar</Text>

          {/* My Sessions */}
          <View style={styles.sessionRow}>
            <Text style={styles.sessionLabel}>Benim</Text>
            <View style={styles.sessionProgressContainer}>
              <View style={styles.sessionProgressBg}>
                <View style={[styles.sessionProgress, { width: '0%', backgroundColor: Colors.primary }]} />
              </View>
              <Text style={styles.sessionValue}>0/0</Text>
            </View>
          </View>

          {/* Studio Sessions */}
          <View style={styles.sessionRow}>
            <Text style={styles.sessionLabel}>Stüdyonun</Text>
            <View style={styles.sessionProgressContainer}>
              <View style={styles.sessionProgressBg}>
                <View style={[styles.sessionProgress, { width: '0%', backgroundColor: Colors.secondary }]} />
              </View>
              <Text style={styles.sessionValue}>0/0</Text>
            </View>
          </View>
        </View>

        {/* Financial Cards */}
        <View style={styles.financialContainer}>
          {/* Monthly Revenue */}
          <TouchableOpacity
            style={[styles.financialCard, { width: cardWidth }]}
            onPress={() => handleNavigate('/payments-received')}
            activeOpacity={0.8}
          >
            <Text style={styles.financialLabel}>Aylık Ciro</Text>
            <Text style={styles.financialValue}>₺3,600</Text>
          </TouchableOpacity>

          {/* Remaining Payments */}
          <TouchableOpacity
            style={[styles.financialCard, { width: cardWidth }]}
            onPress={() => handleNavigate('/remaining-payments')}
            activeOpacity={0.8}
          >
            <Text style={styles.financialLabel}>Kalan Ödemeler</Text>
            <Text style={[styles.financialValue, { color: Colors.primary }]}>₺9,900</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.background,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigCard: {
    height: 160,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  bigCardImage: {
    flex: 1,
  },
  bigCardImageStyle: {
    borderRadius: 20,
  },
  bigCardOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  bigCardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: 2,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  gridCard: {
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  gridCardGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  gridCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 1,
  },
  widgetCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  widgetTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'lowercase',
  },
  weekNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
  },
  chartItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  chartBar: {
    width: '80%',
    borderRadius: 6,
    overflow: 'hidden',
    minHeight: 30,
  },
  chartBarGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartCount: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.background,
  },
  chartDay: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textTertiary,
    textTransform: 'capitalize',
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sessionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    width: 100,
  },
  sessionProgressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sessionProgressBg: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.surfaceLight,
    overflow: 'hidden',
  },
  sessionProgress: {
    height: '100%',
    borderRadius: 4,
  },
  sessionValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    width: 50,
    textAlign: 'right',
  },
  financialContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  financialCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  financialLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  financialValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
  },
});
