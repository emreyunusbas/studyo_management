/**
 * Studio Management Screen - Çoklu stüdyo yönetimi
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Building2,
  MapPin,
  Phone,
  Mail,
  Users,
  CheckCircle2,
  Star,
  Plus,
  ChevronRight,
  Settings,
  TrendingUp,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { studioService, Studio } from '@/services/studioService';

export default function StudioManagementScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();

  const [studios, setStudios] = useState<Studio[]>([]);
  const [currentStudioId, setCurrentStudioId] = useState<string | null>(null);
  const [statistics, setStatistics] = useState({
    totalStudios: 0,
    activeStudios: 0,
    totalMembers: 0,
    totalInstructors: 0,
  });

  const texts = {
    tr: {
      title: 'Stüdyo Yönetimi',
      currentStudio: 'Aktif Stüdyo',
      allStudios: 'Tüm Stüdyolar',
      addStudio: 'Stüdyo Ekle',
      active: 'Aktif',
      inactive: 'Pasif',
      primary: 'Ana Stüdyo',
      members: 'Üye',
      instructors: 'Eğitmen',
      capacity: 'Kapasite',
      rating: 'Puan',
      switchStudio: 'Stüdyoya Geç',
      currentlyActive: 'Şu an aktif',
      statistics: 'İstatistikler',
      totalStudios: 'Toplam Stüdyo',
      activeStudios: 'Aktif Stüdyo',
      totalMembers: 'Toplam Üye',
      totalInstructors: 'Toplam Eğitmen',
      deactivate: 'Pasifleştir',
      activate: 'Aktifleştir',
      cannotDeactivate: 'Son aktif stüdyo pasifleştirilemez',
      studioSwitched: 'Stüdyo değiştirildi',
      noStudios: 'Henüz stüdyo eklenmemiş',
    },
    en: {
      title: 'Studio Management',
      currentStudio: 'Active Studio',
      allStudios: 'All Studios',
      addStudio: 'Add Studio',
      active: 'Active',
      inactive: 'Inactive',
      primary: 'Primary Studio',
      members: 'Members',
      instructors: 'Instructors',
      capacity: 'Capacity',
      rating: 'Rating',
      switchStudio: 'Switch Studio',
      currentlyActive: 'Currently active',
      statistics: 'Statistics',
      totalStudios: 'Total Studios',
      activeStudios: 'Active Studios',
      totalMembers: 'Total Members',
      totalInstructors: 'Total Instructors',
      deactivate: 'Deactivate',
      activate: 'Activate',
      cannotDeactivate: 'Cannot deactivate the last active studio',
      studioSwitched: 'Studio switched',
      noStudios: 'No studios yet',
    },
  };

  const t = texts[language];

  useEffect(() => {
    loadStudios();
  }, []);

  const loadStudios = () => {
    const allStudios = studioService.getStudios();
    const current = studioService.getCurrentStudioId();
    const stats = studioService.getAllStatistics();

    setStudios(allStudios);
    setCurrentStudioId(current);
    setStatistics(stats);
  };

  const handleSwitchStudio = async (studioId: string) => {
    const success = await studioService.setCurrentStudio(studioId);
    if (success) {
      setCurrentStudioId(studioId);
      Alert.alert(t.studioSwitched);
    }
  };

  const handleToggleActive = async (studioId: string) => {
    const success = await studioService.toggleStudioActive(studioId);
    if (!success) {
      Alert.alert(t.cannotDeactivate);
      return;
    }
    loadStudios();
  };

  const renderStudioCard = (studio: Studio) => {
    const isCurrent = studio.id === currentStudioId;

    return (
      <View key={studio.id} style={styles.studioCard}>
        <TouchableOpacity
          style={styles.studioHeader}
          onPress={() =>
            router.push({
              pathname: '/studio-detail' as any,
              params: { studioId: studio.id },
            })
          }
          activeOpacity={0.7}
        >
          <View style={styles.studioHeaderLeft}>
            <View
              style={[
                styles.studioIcon,
                isCurrent && styles.studioIconActive,
                !studio.isActive && styles.studioIconInactive,
              ]}
            >
              <Building2
                size={24}
                color={isCurrent ? Colors.primary : studio.isActive ? Colors.text : Colors.textTertiary}
              />
            </View>
            <View style={styles.studioInfo}>
              <Text style={styles.studioName}>{studio.name}</Text>
              <View style={styles.studioBadges}>
                {studio.isPrimary && (
                  <View style={styles.primaryBadge}>
                    <Star size={12} color={Colors.primary} fill={Colors.primary} />
                    <Text style={styles.primaryBadgeText}>{t.primary}</Text>
                  </View>
                )}
                {isCurrent && (
                  <View style={styles.activeBadge}>
                    <CheckCircle2 size={12} color={Colors.success} />
                    <Text style={styles.activeBadgeText}>{t.currentlyActive}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
          <ChevronRight size={24} color={Colors.textSecondary} />
        </TouchableOpacity>

        <View style={styles.studioDetails}>
          <View style={styles.studioLocation}>
            <MapPin size={16} color={Colors.textSecondary} />
            <Text style={styles.studioLocationText}>
              {studio.location.district}, {studio.location.city}
            </Text>
          </View>

          <View style={styles.studioContact}>
            <View style={styles.studioContactItem}>
              <Phone size={14} color={Colors.textSecondary} />
              <Text style={styles.studioContactText}>{studio.contact.phone}</Text>
            </View>
            <View style={styles.studioContactItem}>
              <Mail size={14} color={Colors.textSecondary} />
              <Text style={styles.studioContactText}>{studio.contact.email}</Text>
            </View>
          </View>

          <View style={styles.studioStats}>
            <View style={styles.studioStat}>
              <Users size={16} color={Colors.primary} />
              <Text style={styles.studioStatValue}>{studio.memberCount}</Text>
              <Text style={styles.studioStatLabel}>{t.members}</Text>
            </View>
            <View style={styles.studioStat}>
              <Users size={16} color={Colors.info} />
              <Text style={styles.studioStatValue}>{studio.instructorCount}</Text>
              <Text style={styles.studioStatLabel}>{t.instructors}</Text>
            </View>
            <View style={styles.studioStat}>
              <Building2 size={16} color={Colors.warning} />
              <Text style={styles.studioStatValue}>{studio.capacity}</Text>
              <Text style={styles.studioStatLabel}>{t.capacity}</Text>
            </View>
            <View style={styles.studioStat}>
              <Star size={16} color={Colors.accent} fill={Colors.accent} />
              <Text style={styles.studioStatValue}>{studio.rating.toFixed(1)}</Text>
              <Text style={styles.studioStatLabel}>{t.rating}</Text>
            </View>
          </View>

          <View style={styles.studioActions}>
            {!isCurrent && studio.isActive && (
              <TouchableOpacity
                style={styles.switchButton}
                onPress={() => handleSwitchStudio(studio.id)}
              >
                <Text style={styles.switchButtonText}>{t.switchStudio}</Text>
              </TouchableOpacity>
            )}

            <View style={styles.activeToggle}>
              <Text style={styles.activeToggleLabel}>
                {studio.isActive ? t.active : t.inactive}
              </Text>
              <Switch
                value={studio.isActive}
                onValueChange={() => handleToggleActive(studio.id)}
                trackColor={{ false: Colors.border, true: Colors.success }}
                thumbColor={Colors.text}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

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
          <TouchableOpacity style={styles.addButton}>
            <Plus size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Building2 size={20} color={Colors.primary} />
              <Text style={styles.statValue}>{statistics.totalStudios}</Text>
              <Text style={styles.statLabel}>{t.totalStudios}</Text>
            </View>

            <View style={styles.statCard}>
              <CheckCircle2 size={20} color={Colors.success} />
              <Text style={styles.statValue}>{statistics.activeStudios}</Text>
              <Text style={styles.statLabel}>{t.activeStudios}</Text>
            </View>

            <View style={styles.statCard}>
              <Users size={20} color={Colors.info} />
              <Text style={styles.statValue}>{statistics.totalMembers}</Text>
              <Text style={styles.statLabel}>{t.totalMembers}</Text>
            </View>

            <View style={styles.statCard}>
              <Users size={20} color={Colors.warning} />
              <Text style={styles.statValue}>{statistics.totalInstructors}</Text>
              <Text style={styles.statLabel}>{t.totalInstructors}</Text>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
        >
          {/* Studios List */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.allStudios}</Text>
            {studios.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Building2 size={64} color={Colors.textTertiary} />
                <Text style={styles.emptyText}>{t.noStudios}</Text>
              </View>
            ) : (
              <View style={styles.studiosList}>{studios.map(renderStudioCard)}</View>
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontSize: 24, fontWeight: '800', color: Colors.text },
  statsContainer: { paddingHorizontal: 20, marginBottom: 20 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  statValue: { fontSize: 20, fontWeight: '800', color: Colors.text },
  statLabel: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary, textAlign: 'center' },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, gap: 16 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, paddingLeft: 4 },
  studiosList: { gap: 16 },
  studioCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
  },
  studioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  studioHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  studioIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  studioIconActive: { backgroundColor: Colors.primary + '20' },
  studioIconInactive: { opacity: 0.5 },
  studioInfo: { flex: 1, gap: 4 },
  studioName: { fontSize: 16, fontWeight: '800', color: Colors.text },
  studioBadges: { flexDirection: 'row', gap: 8 },
  primaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: Colors.primary + '20',
  },
  primaryBadgeText: { fontSize: 10, fontWeight: '800', color: Colors.primary },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: Colors.success + '20',
  },
  activeBadgeText: { fontSize: 10, fontWeight: '800', color: Colors.success },
  studioDetails: { paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
  studioLocation: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  studioLocationText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  studioContact: { gap: 6 },
  studioContactItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  studioContactText: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  studioStats: { flexDirection: 'row', gap: 12 },
  studioStat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 8,
    padding: 8,
  },
  studioStatValue: { fontSize: 16, fontWeight: '800', color: Colors.text },
  studioStatLabel: { fontSize: 10, fontWeight: '600', color: Colors.textSecondary },
  studioActions: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 },
  switchButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  switchButtonText: { fontSize: 14, fontWeight: '700', color: Colors.background },
  activeToggle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  activeToggleLabel: { fontSize: 13, fontWeight: '700', color: Colors.text },
  emptyContainer: { alignItems: 'center', padding: 40, gap: 16 },
  emptyText: { fontSize: 16, fontWeight: '700', color: Colors.textSecondary },
});
