/**
 * Video Service - Video içerik yönetimi ve oynatma
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

// Video Category Types
export type VideoCategory =
  | 'exercise'
  | 'tutorial'
  | 'warmup'
  | 'cooldown'
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'general';

// Video Difficulty Level
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

// Video Data
export interface Video {
  id: string;
  title: string;
  description: string;
  uri: string;
  thumbnail?: string;
  duration: number; // in seconds
  category: VideoCategory;
  difficulty: DifficultyLevel;
  tags: string[];
  instructor?: string;
  uploadDate: Date;
  views: number;
  likes: number;
  isFavorite: boolean;
}

// Video Playlist
export interface VideoPlaylist {
  id: string;
  name: string;
  description: string;
  videoIds: string[];
  createdAt: Date;
  thumbnail?: string;
}

// Video Progress
export interface VideoProgress {
  videoId: string;
  currentTime: number;
  duration: number;
  completed: boolean;
  lastWatched: Date;
}

class VideoService {
  private videos: Video[] = [];
  private playlists: VideoPlaylist[] = [];
  private progress: Map<string, VideoProgress> = new Map();
  private readonly STORAGE_KEY = 'videoLibrary';
  private readonly PLAYLISTS_KEY = 'videoPlaylists';
  private readonly PROGRESS_KEY = 'videoProgress';

  constructor() {
    this.loadData();
  }

  /**
   * Load data from storage
   */
  private async loadData() {
    try {
      const videosJson = await AsyncStorage.getItem(this.STORAGE_KEY);
      const playlistsJson = await AsyncStorage.getItem(this.PLAYLISTS_KEY);
      const progressJson = await AsyncStorage.getItem(this.PROGRESS_KEY);

      if (videosJson) {
        this.videos = JSON.parse(videosJson).map((v: any) => ({
          ...v,
          uploadDate: new Date(v.uploadDate),
        }));
      } else {
        // Load mock videos if no data exists
        this.videos = this.getMockVideos();
        await this.saveVideos();
      }

      if (playlistsJson) {
        this.playlists = JSON.parse(playlistsJson).map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
        }));
      }

      if (progressJson) {
        const progressArray = JSON.parse(progressJson);
        this.progress = new Map(
          progressArray.map((p: any) => [
            p.videoId,
            { ...p, lastWatched: new Date(p.lastWatched) },
          ])
        );
      }
    } catch (error) {
      console.error('Error loading video data:', error);
    }
  }

  /**
   * Save videos to storage
   */
  private async saveVideos() {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.videos));
    } catch (error) {
      console.error('Error saving videos:', error);
    }
  }

  /**
   * Save playlists to storage
   */
  private async savePlaylists() {
    try {
      await AsyncStorage.setItem(this.PLAYLISTS_KEY, JSON.stringify(this.playlists));
    } catch (error) {
      console.error('Error saving playlists:', error);
    }
  }

  /**
   * Save progress to storage
   */
  private async saveProgress() {
    try {
      const progressArray = Array.from(this.progress.entries()).map(([videoId, prog]) => ({
        videoId,
        ...prog,
      }));
      await AsyncStorage.setItem(this.PROGRESS_KEY, JSON.stringify(progressArray));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }

  /**
   * Get all videos
   */
  getVideos(): Video[] {
    return this.videos;
  }

  /**
   * Get video by ID
   */
  getVideo(id: string): Video | undefined {
    return this.videos.find((v) => v.id === id);
  }

  /**
   * Get videos by category
   */
  getVideosByCategory(category: VideoCategory): Video[] {
    return this.videos.filter((v) => v.category === category);
  }

  /**
   * Get videos by difficulty
   */
  getVideosByDifficulty(difficulty: DifficultyLevel): Video[] {
    return this.videos.filter((v) => v.difficulty === difficulty);
  }

  /**
   * Get favorite videos
   */
  getFavoriteVideos(): Video[] {
    return this.videos.filter((v) => v.isFavorite);
  }

  /**
   * Search videos
   */
  searchVideos(query: string): Video[] {
    const lowerQuery = query.toLowerCase();
    return this.videos.filter(
      (v) =>
        v.title.toLowerCase().includes(lowerQuery) ||
        v.description.toLowerCase().includes(lowerQuery) ||
        v.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
        v.instructor?.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Add video
   */
  async addVideo(video: Omit<Video, 'id' | 'uploadDate' | 'views' | 'likes'>): Promise<Video> {
    const newVideo: Video = {
      ...video,
      id: Date.now().toString(),
      uploadDate: new Date(),
      views: 0,
      likes: 0,
    };

    this.videos.unshift(newVideo);
    await this.saveVideos();

    return newVideo;
  }

  /**
   * Update video
   */
  async updateVideo(id: string, updates: Partial<Video>): Promise<boolean> {
    const index = this.videos.findIndex((v) => v.id === id);
    if (index === -1) return false;

    this.videos[index] = { ...this.videos[index], ...updates };
    await this.saveVideos();

    return true;
  }

  /**
   * Delete video
   */
  async deleteVideo(id: string): Promise<boolean> {
    const index = this.videos.findIndex((v) => v.id === id);
    if (index === -1) return false;

    this.videos.splice(index, 1);
    await this.saveVideos();

    // Remove from playlists
    for (const playlist of this.playlists) {
      playlist.videoIds = playlist.videoIds.filter((vid) => vid !== id);
    }
    await this.savePlaylists();

    // Remove progress
    this.progress.delete(id);
    await this.saveProgress();

    return true;
  }

  /**
   * Toggle favorite
   */
  async toggleFavorite(id: string): Promise<boolean> {
    const video = this.videos.find((v) => v.id === id);
    if (!video) return false;

    video.isFavorite = !video.isFavorite;
    await this.saveVideos();

    return video.isFavorite;
  }

  /**
   * Increment views
   */
  async incrementViews(id: string): Promise<void> {
    const video = this.videos.find((v) => v.id === id);
    if (video) {
      video.views++;
      await this.saveVideos();
    }
  }

  /**
   * Toggle like
   */
  async toggleLike(id: string): Promise<void> {
    const video = this.videos.find((v) => v.id === id);
    if (video) {
      video.likes = video.likes > 0 ? video.likes - 1 : video.likes + 1;
      await this.saveVideos();
    }
  }

  /**
   * Request video picker permissions
   */
  async requestPermissions(): Promise<boolean> {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  }

  /**
   * Pick video from library
   */
  async pickVideo(): Promise<{ uri: string; duration: number } | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        Alert.alert('İzin Gerekli', 'Video seçmek için medya kütüphanesine erişim gerekli.');
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        return {
          uri: result.assets[0].uri,
          duration: result.assets[0].duration || 0,
        };
      }

      return null;
    } catch (error) {
      console.error('Error picking video:', error);
      return null;
    }
  }

  /**
   * Get all playlists
   */
  getPlaylists(): VideoPlaylist[] {
    return this.playlists;
  }

  /**
   * Get playlist by ID
   */
  getPlaylist(id: string): VideoPlaylist | undefined {
    return this.playlists.find((p) => p.id === id);
  }

  /**
   * Create playlist
   */
  async createPlaylist(
    name: string,
    description: string,
    videoIds: string[] = []
  ): Promise<VideoPlaylist> {
    const playlist: VideoPlaylist = {
      id: Date.now().toString(),
      name,
      description,
      videoIds,
      createdAt: new Date(),
    };

    this.playlists.unshift(playlist);
    await this.savePlaylists();

    return playlist;
  }

  /**
   * Update playlist
   */
  async updatePlaylist(id: string, updates: Partial<VideoPlaylist>): Promise<boolean> {
    const index = this.playlists.findIndex((p) => p.id === id);
    if (index === -1) return false;

    this.playlists[index] = { ...this.playlists[index], ...updates };
    await this.savePlaylists();

    return true;
  }

  /**
   * Delete playlist
   */
  async deletePlaylist(id: string): Promise<boolean> {
    const index = this.playlists.findIndex((p) => p.id === id);
    if (index === -1) return false;

    this.playlists.splice(index, 1);
    await this.savePlaylists();

    return true;
  }

  /**
   * Add video to playlist
   */
  async addToPlaylist(playlistId: string, videoId: string): Promise<boolean> {
    const playlist = this.playlists.find((p) => p.id === playlistId);
    if (!playlist) return false;

    if (!playlist.videoIds.includes(videoId)) {
      playlist.videoIds.push(videoId);
      await this.savePlaylists();
    }

    return true;
  }

  /**
   * Remove video from playlist
   */
  async removeFromPlaylist(playlistId: string, videoId: string): Promise<boolean> {
    const playlist = this.playlists.find((p) => p.id === playlistId);
    if (!playlist) return false;

    playlist.videoIds = playlist.videoIds.filter((id) => id !== videoId);
    await this.savePlaylists();

    return true;
  }

  /**
   * Get video progress
   */
  getProgress(videoId: string): VideoProgress | undefined {
    return this.progress.get(videoId);
  }

  /**
   * Update video progress
   */
  async updateProgress(
    videoId: string,
    currentTime: number,
    duration: number
  ): Promise<void> {
    const completed = currentTime >= duration * 0.9; // 90% watched = completed

    this.progress.set(videoId, {
      videoId,
      currentTime,
      duration,
      completed,
      lastWatched: new Date(),
    });

    await this.saveProgress();
  }

  /**
   * Get statistics
   */
  getStatistics(): {
    totalVideos: number;
    totalDuration: number;
    totalViews: number;
    totalLikes: number;
    favoriteCount: number;
    completedCount: number;
    categoryBreakdown: Record<VideoCategory, number>;
    difficultyBreakdown: Record<DifficultyLevel, number>;
  } {
    const totalVideos = this.videos.length;
    const totalDuration = this.videos.reduce((sum, v) => sum + v.duration, 0);
    const totalViews = this.videos.reduce((sum, v) => sum + v.views, 0);
    const totalLikes = this.videos.reduce((sum, v) => sum + v.likes, 0);
    const favoriteCount = this.videos.filter((v) => v.isFavorite).length;

    const completedCount = Array.from(this.progress.values()).filter((p) => p.completed).length;

    const categoryBreakdown = this.videos.reduce((acc, v) => {
      acc[v.category] = (acc[v.category] || 0) + 1;
      return acc;
    }, {} as Record<VideoCategory, number>);

    const difficultyBreakdown = this.videos.reduce((acc, v) => {
      acc[v.difficulty] = (acc[v.difficulty] || 0) + 1;
      return acc;
    }, {} as Record<DifficultyLevel, number>);

    return {
      totalVideos,
      totalDuration,
      totalViews,
      totalLikes,
      favoriteCount,
      completedCount,
      categoryBreakdown,
      difficultyBreakdown,
    };
  }

  /**
   * Get mock videos for initial data
   */
  private getMockVideos(): Video[] {
    return [
      {
        id: '1',
        title: 'Pilates Temel Hareketler',
        description: 'Pilates için temel hareketlerin tanıtımı ve doğru teknik açıklamaları',
        uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        duration: 596,
        category: 'beginner',
        difficulty: 'beginner',
        tags: ['temel', 'başlangıç', 'teknik'],
        instructor: 'Ayşe Yılmaz',
        uploadDate: new Date('2024-01-15'),
        views: 234,
        likes: 45,
        isFavorite: false,
      },
      {
        id: '2',
        title: 'Mat Pilates - İleri Seviye',
        description: 'İleri seviye mat pilates rutini, core güçlendirme ve denge',
        uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        duration: 653,
        category: 'advanced',
        difficulty: 'advanced',
        tags: ['mat', 'core', 'denge', 'ileri seviye'],
        instructor: 'Mehmet Kaya',
        uploadDate: new Date('2024-02-01'),
        views: 156,
        likes: 32,
        isFavorite: true,
      },
      {
        id: '3',
        title: 'Isınma Egzersizleri',
        description: 'Pilates seansı öncesi 10 dakikalık ısınma rutini',
        uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        duration: 600,
        category: 'warmup',
        difficulty: 'beginner',
        tags: ['ısınma', 'mobilite', 'esneklik'],
        instructor: 'Zeynep Demir',
        uploadDate: new Date('2024-02-10'),
        views: 189,
        likes: 28,
        isFavorite: false,
      },
      {
        id: '4',
        title: 'Soğuma ve Germe',
        description: 'Seans sonrası soğuma ve germe hareketleri',
        uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        duration: 480,
        category: 'cooldown',
        difficulty: 'beginner',
        tags: ['soğuma', 'germe', 'esneme'],
        instructor: 'Zeynep Demir',
        uploadDate: new Date('2024-02-15'),
        views: 142,
        likes: 21,
        isFavorite: false,
      },
      {
        id: '5',
        title: 'Reformer Pilates Tutorial',
        description: 'Reformer aletinde temel hareketler ve ayarlamalar',
        uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        duration: 720,
        category: 'tutorial',
        difficulty: 'intermediate',
        tags: ['reformer', 'alet', 'teknik'],
        instructor: 'Ayşe Yılmaz',
        uploadDate: new Date('2024-02-20'),
        views: 201,
        likes: 38,
        isFavorite: true,
      },
    ];
  }
}

// Export singleton instance
export const videoService = new VideoService();
