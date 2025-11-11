/**
 * Video Library Screen - Video kütüphanesi ve yönetim
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Search,
  Play,
  Heart,
  Eye,
  ThumbsUp,
  Clock,
  Filter,
  Plus,
  Film,
  TrendingUp,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { videoService, Video, VideoCategory, DifficultyLevel } from '@/services/videoService';

export default function VideoLibraryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();

  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [statistics, setStatistics] = useState({
    totalVideos: 0,
    totalDuration: 0,
    totalViews: 0,
    favoriteCount: 0,
  });

  const texts = {
    tr: {
      title: 'Video Kütüphanesi',
      search: 'Video ara...',
      all: 'Tümü',
      exercise: 'Egzersiz',
      tutorial: 'Eğitim',
      warmup: 'Isınma',
      cooldown: 'Soğuma',
      beginner: 'Başlangıç',
      intermediate: 'Orta',
      advanced: 'İleri',
      general: 'Genel',
      category: 'Kategori',
      difficulty: 'Zorluk',
      totalVideos: 'Video',
      totalDuration: 'Dakika',
      totalViews: 'İzlenme',
      favorites: 'Favori',
      addVideo: 'Video Ekle',
      noVideos: 'Video bulunamadı',
      statistics: 'İstatistikler',
      minutes: 'dk',
      views: 'izlenme',
    },
    en: {
      title: 'Video Library',
      search: 'Search videos...',
      all: 'All',
      exercise: 'Exercise',
      tutorial: 'Tutorial',
      warmup: 'Warm-up',
      cooldown: 'Cool-down',
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      general: 'General',
      category: 'Category',
      difficulty: 'Difficulty',
      totalVideos: 'Videos',
      totalDuration: 'Minutes',
      totalViews: 'Views',
      favorites: 'Favorites',
      addVideo: 'Add Video',
      noVideos: 'No videos found',
      statistics: 'Statistics',
      minutes: 'min',
      views: 'views',
    },
  };

  const t = texts[language];

  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    filterVideos();
  }, [searchQuery, selectedCategory, selectedDifficulty, videos]);

  const loadVideos = () => {
    const allVideos = videoService.getVideos();
    const stats = videoService.getStatistics();

    setVideos(allVideos);
    setStatistics(stats);
  };

  const filterVideos = () => {
    let filtered = [...videos];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = videoService.searchVideos(searchQuery);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((v) => v.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter((v) => v.difficulty === selectedDifficulty);
    }

    setFilteredVideos(filtered);
  };

  const handleToggleFavorite = async (videoId: string) => {
    await videoService.toggleFavorite(videoId);
    loadVideos();
  };

  const handleVideoPress = (video: Video) => {
    videoService.incrementViews(video.id);
    router.push({
      pathname: '/video-player' as any,
      params: {
        videoId: video.id,
        title: video.title,
        uri: video.uri,
        duration: video.duration.toString(),
      },
    });
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const categories: Array<VideoCategory | 'all'> = [
    'all',
    'beginner',
    'intermediate',
    'advanced',
    'exercise',
    'tutorial',
    'warmup',
    'cooldown',
  ];

  const renderVideoCard = ({ item }: { item: Video }) => (
    <TouchableOpacity
      style={styles.videoCard}
      onPress={() => handleVideoPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.videoThumbnail}>
        <LinearGradient
          colors={[Colors.primary + '40', Colors.info + '40']}
          style={styles.thumbnailGradient}
        >
          <Play size={40} color={Colors.text} />
        </LinearGradient>

        <View style={styles.videoDuration}>
          <Clock size={12} color={Colors.text} />
          <Text style={styles.videoDurationText}>{formatDuration(item.duration)}</Text>
        </View>

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => handleToggleFavorite(item.id)}
        >
          <Heart
            size={20}
            color={item.isFavorite ? Colors.error : Colors.text}
            fill={item.isFavorite ? Colors.error : 'transparent'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.videoDescription} numberOfLines={1}>
          {item.description}
        </Text>

        {item.instructor && (
          <Text style={styles.videoInstructor}>
            {item.instructor}
          </Text>
        )}

        <View style={styles.videoStats}>
          <View style={styles.videoStat}>
            <Eye size={14} color={Colors.textSecondary} />
            <Text style={styles.videoStatText}>{item.views}</Text>
          </View>
          <View style={styles.videoStat}>
            <ThumbsUp size={14} color={Colors.textSecondary} />
            <Text style={styles.videoStatText}>{item.likes}</Text>
          </View>
          <View style={styles.videoBadge}>
            <Text style={styles.videoBadgeText}>{t[item.difficulty]}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

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
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Film size={20} color={Colors.primary} />
                <Text style={styles.statValue}>{statistics.totalVideos}</Text>
                <Text style={styles.statLabel}>{t.totalVideos}</Text>
              </View>

              <View style={styles.statCard}>
                <Clock size={20} color={Colors.info} />
                <Text style={styles.statValue}>
                  {Math.floor(statistics.totalDuration / 60)}
                </Text>
                <Text style={styles.statLabel}>{t.totalDuration}</Text>
              </View>

              <View style={styles.statCard}>
                <Eye size={20} color={Colors.success} />
                <Text style={styles.statValue}>{statistics.totalViews}</Text>
                <Text style={styles.statLabel}>{t.totalViews}</Text>
              </View>

              <View style={styles.statCard}>
                <Heart size={20} color={Colors.error} />
                <Text style={styles.statValue}>{statistics.favoriteCount}</Text>
                <Text style={styles.statLabel}>{t.favorites}</Text>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
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

        {/* Category Filter */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterList}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterChip,
                    selectedCategory === category && styles.filterChipActive,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedCategory === category && styles.filterChipTextActive,
                    ]}
                  >
                    {t[category]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Video List */}
        {filteredVideos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Film size={64} color={Colors.textTertiary} />
            <Text style={styles.emptyText}>{t.noVideos}</Text>
          </View>
        ) : (
          <FlatList
            data={filteredVideos}
            renderItem={renderVideoCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.videoList,
              { paddingBottom: insets.bottom + 20 },
            ]}
            showsVerticalScrollIndicator={false}
          />
        )}
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
  statsGrid: { flexDirection: 'row', gap: 12 },
  statCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 6,
    minWidth: 80,
  },
  statValue: { fontSize: 20, fontWeight: '800', color: Colors.text },
  statLabel: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary },
  searchContainer: { paddingHorizontal: 20, marginBottom: 16 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  filterContainer: { paddingHorizontal: 20, marginBottom: 20 },
  filterList: { flexDirection: 'row', gap: 8 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.background,
  },
  videoList: { paddingHorizontal: 20, gap: 16 },
  videoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
  },
  videoThumbnail: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  thumbnailGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoDuration: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.background + 'CC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  videoDurationText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background + 'CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: { padding: 16, gap: 6 },
  videoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  videoDescription: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  videoInstructor: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  videoStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  videoStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  videoStatText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  videoBadge: {
    marginLeft: 'auto',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: Colors.primary + '20',
  },
  videoBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
});
