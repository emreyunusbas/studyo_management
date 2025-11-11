/**
 * Trainers List Screen - View all trainers
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
  Plus,
  Star,
  Calendar,
  Users,
  CheckCircle,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { MOCK_TRAINERS } from '@/constants/mockData';
import { useApp } from '@/contexts/AppContext';

export default function TrainersListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const texts = {
    tr: {
      title: 'Eğitmenler',
      search: 'Eğitmen ara...',
      addTrainer: 'Yeni Eğitmen',
      all: 'Tümü',
      active: 'Aktif',
      inactive: 'Pasif',
      noTrainers: 'Eğitmen bulunamadı',
      sessions: 'Seans',
      members: 'Üye',
      rating: 'Puan',
      viewDetail: 'Detay',
    },
    en: {
      title: 'Trainers',
      search: 'Search trainer...',
      addTrainer: 'New Trainer',
      all: 'All',
      active: 'Active',
      inactive: 'Inactive',
      noTrainers: 'No trainers found',
      sessions: 'Sessions',
      members: 'Members',
      rating: 'Rating',
      viewDetail: 'Details',
    },
  };

  const t = texts[language];

  const filteredTrainers = MOCK_TRAINERS.filter((trainer) => {
    const matchesSearch = `${trainer.firstName} ${trainer.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'active' && trainer.isActive) ||
      (selectedFilter === 'inactive' && !trainer.isActive);

    return matchesSearch && matchesFilter;
  });

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
          <TouchableOpacity
            onPress={() => router.push('/add-trainer' as any)}
            style={styles.addButton}
          >
            <Plus size={24} color={Colors.primary} />
          </TouchableOpacity>
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

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {(['all', 'active', 'inactive'] as const).map((filter) => (
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
                {t[filter]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Trainers List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
        >
          {filteredTrainers.length > 0 ? (
            filteredTrainers.map((trainer) => (
              <TouchableOpacity
                key={trainer.id}
                style={styles.trainerCard}
                onPress={() => router.push(`/trainer-detail?id=${trainer.id}` as any)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={[Colors.surface, Colors.surfaceLight]}
                  style={styles.trainerGradient}
                >
                  {/* Trainer Header */}
                  <View style={styles.trainerHeader}>
                    <View style={styles.trainerAvatar}>
                      <Text style={styles.trainerAvatarText}>
                        {trainer.firstName[0]}
                        {trainer.lastName[0]}
                      </Text>
                    </View>

                    <View style={styles.trainerInfo}>
                      <View style={styles.trainerNameRow}>
                        <Text style={styles.trainerName}>
                          {trainer.firstName} {trainer.lastName}
                        </Text>
                        {trainer.isActive && (
                          <CheckCircle size={16} color={Colors.success} />
                        )}
                      </View>

                      {trainer.specialties && trainer.specialties.length > 0 && (
                        <Text style={styles.trainerSpecialty} numberOfLines={1}>
                          {trainer.specialties[0]}
                        </Text>
                      )}

                      {/* Rating */}
                      {trainer.rating && (
                        <View style={styles.ratingRow}>
                          <Star size={14} color={Colors.warning} fill={Colors.warning} />
                          <Text style={styles.ratingText}>
                            {trainer.rating.toFixed(1)}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Stats */}
                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <Calendar size={16} color={Colors.primary} />
                      <Text style={styles.statValue}>{trainer.completedSessions}</Text>
                      <Text style={styles.statLabel}>{t.sessions}</Text>
                    </View>

                    <View style={styles.statDivider} />

                    <View style={styles.statItem}>
                      <Users size={16} color={Colors.accent} />
                      <Text style={styles.statValue}>{trainer.activeMembers}</Text>
                      <Text style={styles.statLabel}>{t.members}</Text>
                    </View>
                  </View>

                  {/* Specialties Tags */}
                  {trainer.specialties && trainer.specialties.length > 0 && (
                    <View style={styles.specialtiesTags}>
                      {trainer.specialties.slice(0, 3).map((specialty, idx) => (
                        <View key={idx} style={styles.specialtyTag}>
                          <Text style={styles.specialtyTagText}>{specialty}</Text>
                        </View>
                      ))}
                      {trainer.specialties.length > 3 && (
                        <View style={styles.specialtyTag}>
                          <Text style={styles.specialtyTagText}>
                            +{trainer.specialties.length - 3}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Users size={64} color={Colors.textTertiary} />
              <Text style={styles.emptyStateText}>{t.noTrainers}</Text>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
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
  filtersContainer: {
    marginBottom: 20,
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 13,
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
  trainerCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  trainerGradient: {
    padding: 16,
    gap: 12,
  },
  trainerHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  trainerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trainerAvatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.background,
  },
  trainerInfo: {
    flex: 1,
    gap: 4,
  },
  trainerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trainerName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  trainerSpecialty: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.warning,
  },
  statsRow: {
    flexDirection: 'row',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceLight,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.surfaceLight,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  specialtiesTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingTop: 8,
  },
  specialtyTag: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  specialtyTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
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
