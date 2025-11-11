/**
 * Sessions Screen - View and manage all sessions with calendar
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
  Calendar,
  Plus,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { MOCK_SESSIONS, WEEK_DAYS_FULL } from '@/constants/mockData';
import { useApp } from '@/contexts/AppContext';

export default function SessionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');

  const texts = {
    tr: {
      title: 'Seanslar',
      addSession: 'Yeni Seans',
      today: 'Bugün',
      filters: {
        all: 'Tümü',
        scheduled: 'Planlandı',
        completed: 'Tamamlandı',
        cancelled: 'İptal',
      },
      noSessions: 'Bu tarihte seans yok',
      createFirst: 'İlk seansı oluşturun',
      participants: 'Katılımcı',
      capacity: 'Kapasite',
      startAttendance: 'Yoklama Al',
      viewDetails: 'Detay',
      sessionStats: 'Seans İstatistikleri',
      totalSessions: 'Toplam',
      scheduled: 'Planlandı',
      completed: 'Tamamlandı',
      cancelled: 'İptal',
    },
    en: {
      title: 'Sessions',
      addSession: 'New Session',
      today: 'Today',
      filters: {
        all: 'All',
        scheduled: 'Scheduled',
        completed: 'Completed',
        cancelled: 'Cancelled',
      },
      noSessions: 'No sessions on this date',
      createFirst: 'Create your first session',
      participants: 'Participants',
      capacity: 'Capacity',
      startAttendance: 'Take Attendance',
      viewDetails: 'Details',
      sessionStats: 'Session Statistics',
      totalSessions: 'Total',
      scheduled: 'Scheduled',
      completed: 'Completed',
      cancelled: 'Cancelled',
    },
  };

  const t = texts[language];

  // Generate week view (7 days centered on selected date)
  const getWeekDays = () => {
    const days = [];
    const start = new Date(selectedDate);
    start.setDate(start.getDate() - 3); // Start 3 days before selected

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const weekDays = getWeekDays();

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (date: Date) => {
    return formatDateKey(date) === formatDateKey(today);
  };

  const isSelectedDate = (date: Date) => {
    return formatDateKey(date) === formatDateKey(selectedDate);
  };

  const getSessionsForDate = (date: Date) => {
    const dateKey = formatDateKey(date);
    let sessions = MOCK_SESSIONS.filter((s) => s.date === dateKey);

    if (selectedFilter !== 'all') {
      sessions = sessions.filter((s) => s.status.toLowerCase() === selectedFilter);
    }

    return sessions.sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const selectedDateSessions = getSessionsForDate(selectedDate);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return Colors.success;
      case 'CANCELLED':
        return Colors.error;
      case 'SCHEDULED':
        return Colors.info;
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return CheckCircle;
      case 'CANCELLED':
        return XCircle;
      case 'SCHEDULED':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handleAddSession = () => {
    router.push('/add-session' as any);
  };

  const handleViewDetail = (sessionId: string) => {
    router.push(`/session-detail?id=${sessionId}` as any);
  };

  const handleAttendance = (sessionId: string) => {
    router.push(`/session-attendance?id=${sessionId}` as any);
  };

  // Calculate statistics
  const totalSessions = MOCK_SESSIONS.length;
  const scheduledCount = MOCK_SESSIONS.filter((s) => s.status === 'SCHEDULED').length;
  const completedCount = MOCK_SESSIONS.filter((s) => s.status === 'COMPLETED').length;
  const cancelledCount = MOCK_SESSIONS.filter((s) => s.status === 'CANCELLED').length;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.backgroundLight]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <Text style={styles.title}>{t.title}</Text>
          <TouchableOpacity onPress={handleAddSession} style={styles.addButton}>
            <Plus size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Statistics Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statsContainer}
          contentContainerStyle={styles.statsContent}
        >
          <View style={styles.statCard}>
            <Calendar size={20} color={Colors.primary} />
            <Text style={styles.statValue}>{totalSessions}</Text>
            <Text style={styles.statLabel}>{t.totalSessions}</Text>
          </View>

          <View style={styles.statCard}>
            <AlertCircle size={20} color={Colors.info} />
            <Text style={styles.statValue}>{scheduledCount}</Text>
            <Text style={styles.statLabel}>{t.scheduled}</Text>
          </View>

          <View style={styles.statCard}>
            <CheckCircle size={20} color={Colors.success} />
            <Text style={styles.statValue}>{completedCount}</Text>
            <Text style={styles.statLabel}>{t.completed}</Text>
          </View>

          <View style={styles.statCard}>
            <XCircle size={20} color={Colors.error} />
            <Text style={styles.statValue}>{cancelledCount}</Text>
            <Text style={styles.statLabel}>{t.cancelled}</Text>
          </View>
        </ScrollView>

        {/* Calendar Week View */}
        <View style={styles.calendarContainer}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={handlePreviousDay} style={styles.navButton}>
              <ChevronLeft size={20} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.selectedDateText}>
              {selectedDate.toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
            <TouchableOpacity onPress={handleNextDay} style={styles.navButton}>
              <ChevronRight size={20} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.weekDays}>
            {weekDays.map((date, index) => {
              const isSelected = isSelectedDate(date);
              const isTodayDate = isToday(date);
              const dayName = WEEK_DAYS_FULL[date.getDay() === 0 ? 6 : date.getDay() - 1];

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCard,
                    isSelected && styles.dayCardSelected,
                  ]}
                  onPress={() => setSelectedDate(date)}
                >
                  <Text
                    style={[
                      styles.dayName,
                      isSelected && styles.dayNameSelected,
                    ]}
                  >
                    {dayName.substring(0, 3)}
                  </Text>
                  <Text
                    style={[
                      styles.dayNumber,
                      isSelected && styles.dayNumberSelected,
                    ]}
                  >
                    {date.getDate()}
                  </Text>
                  {isTodayDate && !isSelected && (
                    <View style={styles.todayDot} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {(['all', 'scheduled', 'completed', 'cancelled'] as const).map((filter) => (
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
                {t.filters[filter]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Sessions List */}
        <ScrollView
          style={styles.sessionsList}
          contentContainerStyle={[
            styles.sessionsContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
        >
          {selectedDateSessions.length > 0 ? (
            selectedDateSessions.map((session) => {
              const StatusIcon = getStatusIcon(session.status);
              const statusColor = getStatusColor(session.status);

              return (
                <TouchableOpacity
                  key={session.id}
                  style={styles.sessionCard}
                  onPress={() => handleViewDetail(session.id)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={[Colors.surface, Colors.surfaceLight]}
                    style={styles.sessionGradient}
                  >
                    {/* Time Badge */}
                    <View style={styles.sessionTime}>
                      <Clock size={16} color={Colors.primary} />
                      <Text style={styles.sessionTimeText}>
                        {session.startTime} - {session.endTime}
                      </Text>
                    </View>

                    {/* Session Info */}
                    <View style={styles.sessionInfo}>
                      <View style={styles.sessionHeader}>
                        <Text style={styles.sessionGroup}>{session.groupName}</Text>
                        <View
                          style={[
                            styles.statusBadge,
                            { backgroundColor: statusColor },
                          ]}
                        >
                          <StatusIcon size={12} color={Colors.background} />
                        </View>
                      </View>

                      {session.description && (
                        <Text style={styles.sessionDescription}>
                          {session.description}
                        </Text>
                      )}

                      {/* Participants */}
                      <View style={styles.sessionMeta}>
                        <View style={styles.metaItem}>
                          <Users size={16} color={Colors.textSecondary} />
                          <Text style={styles.metaText}>
                            {session.members?.length || 0}/{session.capacity} {t.participants}
                          </Text>
                        </View>
                      </View>

                      {/* Members Preview */}
                      {session.members && session.members.length > 0 && (
                        <View style={styles.membersPreview}>
                          {session.members.slice(0, 3).map((member, idx) => (
                            <View key={idx} style={styles.memberBadge}>
                              <Text style={styles.memberBadgeText}>
                                {member.name.split(' ').map((n) => n[0]).join('')}
                              </Text>
                            </View>
                          ))}
                          {session.members.length > 3 && (
                            <View style={styles.moreBadge}>
                              <Text style={styles.moreBadgeText}>
                                +{session.members.length - 3}
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                    </View>

                    {/* Actions */}
                    {session.status === 'SCHEDULED' && (
                      <View style={styles.sessionActions}>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={(e) => {
                            e.stopPropagation();
                            handleAttendance(session.id);
                          }}
                        >
                          <CheckCircle size={16} color={Colors.primary} />
                          <Text style={styles.actionButtonText}>
                            {t.startAttendance}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Calendar size={64} color={Colors.textTertiary} />
              <Text style={styles.emptyStateText}>{t.noSessions}</Text>
              <Text style={styles.emptyStateSubtext}>{t.createFirst}</Text>
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
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    marginBottom: 20,
  },
  statsContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    minWidth: 100,
    alignItems: 'center',
    gap: 6,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  calendarContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  weekDays: {
    flexDirection: 'row',
    gap: 8,
  },
  dayCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 4,
    position: 'relative',
  },
  dayCardSelected: {
    backgroundColor: Colors.primary,
  },
  dayName: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  dayNameSelected: {
    color: Colors.background,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  dayNumberSelected: {
    color: Colors.background,
  },
  todayDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
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
  sessionsList: {
    flex: 1,
  },
  sessionsContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  sessionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sessionGradient: {
    padding: 16,
    gap: 12,
  },
  sessionTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sessionTimeText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  sessionInfo: {
    gap: 8,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sessionGroup: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    flex: 1,
  },
  statusBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  sessionMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  membersPreview: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  memberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.background,
  },
  moreBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  sessionActions: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceLight,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  emptyState: {
    paddingVertical: 80,
    alignItems: 'center',
    gap: 12,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.textTertiary,
  },
});
