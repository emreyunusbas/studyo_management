/**
 * Members List Screen - Display and filter member list
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
import { ChevronLeft, Search, Plus, User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { MOCK_MEMBERS } from '@/constants/mockData';
import { useApp } from '@/contexts/AppContext';
import type { MemberListItem } from '@/types';

type FilterType = 'all' | 'mine' | 'admin';

export default function MembersListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');

  const texts = {
    tr: {
      title: 'Üye Listesi',
      search: 'Üye ara...',
      addMember: 'Üye Ekle',
      filters: {
        all: 'Tümü',
        mine: 'Benim Üyelerim',
        admin: 'Admin Eğitmen',
      },
      membershipTypes: {
        GRUP: 'Grup',
        BİREBİR: 'Birebir',
        DÜET: 'Düet',
        HAMİLE: 'Hamile',
        FİZYOTERAPİST: 'Fizyoterapist',
      },
      remainingCredits: 'Kalan Seans',
      endDate: 'Bitiş',
      lastPayment: 'Son Ödeme',
      remainingPayment: 'Kalan Ödeme',
      noMembers: 'Üye bulunamadı',
    },
    en: {
      title: 'Member List',
      search: 'Search member...',
      addMember: 'Add Member',
      filters: {
        all: 'All',
        mine: 'My Members',
        admin: 'Admin Trainer',
      },
      membershipTypes: {
        GRUP: 'Group',
        BİREBİR: 'One-on-One',
        DÜET: 'Duet',
        HAMİLE: 'Pregnant',
        FİZYOTERAPİST: 'Physiotherapist',
      },
      remainingCredits: 'Remaining Sessions',
      endDate: 'End Date',
      lastPayment: 'Last Payment',
      remainingPayment: 'Remaining Payment',
      noMembers: 'No members found',
    },
  };

  const t = texts[language];

  // Filter members based on search query
  const filteredMembers = MOCK_MEMBERS.filter((member) => {
    const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleMemberPress = (member: MemberListItem) => {
    router.push(`/member-detail?id=${member.id}` as any);
  };

  const handleAddMember = () => {
    router.push('/add-member');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
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
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>{t.title}</Text>
          <TouchableOpacity onPress={handleAddMember} style={styles.addButton}>
            <Plus size={24} color={Colors.background} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t.search}
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {(['all', 'mine', 'admin'] as FilterType[]).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                filterType === filter && styles.filterButtonActive,
              ]}
              onPress={() => setFilterType(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  filterType === filter && styles.filterTextActive,
                ]}
              >
                {t.filters[filter]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Members List */}
        <ScrollView
          style={styles.listContainer}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
        >
          {filteredMembers.length === 0 ? (
            <View style={styles.emptyState}>
              <User size={64} color={Colors.textTertiary} />
              <Text style={styles.emptyText}>{t.noMembers}</Text>
            </View>
          ) : (
            filteredMembers.map((member) => (
              <TouchableOpacity
                key={member.id}
                style={styles.memberCard}
                onPress={() => handleMemberPress(member)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={[Colors.surface, Colors.surfaceLight]}
                  style={styles.memberCardGradient}
                >
                  {/* Member Avatar */}
                  <View style={styles.avatarContainer}>
                    {member.photoUrl ? (
                      <View style={styles.avatar}>
                        {/* TODO: Add image component */}
                        <Text style={styles.avatarText}>
                          {member.firstName[0]}
                          {member.lastName[0]}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                          {member.firstName[0]}
                          {member.lastName[0]}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Member Info */}
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>
                      {member.firstName} {member.lastName}
                    </Text>
                    <View style={styles.memberDetails}>
                      <View style={[styles.badge, styles.badgeMembership]}>
                        <Text style={styles.badgeText}>
                          {t.membershipTypes[member.membershipType]}
                        </Text>
                      </View>
                      <Text style={styles.memberStat}>
                        {member.remainingCredits}/{member.openableCredits} seans
                      </Text>
                    </View>
                    <View style={styles.memberFooter}>
                      <Text style={styles.memberEndDate}>
                        {formatDate(member.endDate)}
                      </Text>
                      {member.remainingPayment && member.remainingPayment > 0 ? (
                        <Text style={[styles.memberPayment, { color: Colors.warning }]}>
                          ₺{member.remainingPayment} kalan
                        </Text>
                      ) : (
                        <Text style={[styles.memberPayment, { color: Colors.success }]}>
                          Ödendi
                        </Text>
                      )}
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))
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
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  filtersContainer: {
    marginBottom: 20,
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.surface,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.background,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  memberCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  memberCardGradient: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  avatarContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.background,
  },
  memberInfo: {
    flex: 1,
    gap: 8,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  memberDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeMembership: {
    backgroundColor: Colors.primary,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.background,
  },
  memberStat: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  memberFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberEndDate: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  memberPayment: {
    fontSize: 14,
    fontWeight: '700',
  },
});
