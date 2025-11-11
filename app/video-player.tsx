/**
 * Video Player Screen - Video oynatıcı ve kontroller
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Video, ResizeMode } from 'expo-av';
import {
  ChevronLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  Heart,
  ThumbsUp,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { videoService } from '@/services/videoService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function VideoPlayerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();
  const params = useLocalSearchParams();

  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<any>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const videoId = params.videoId as string;
  const title = params.title as string;
  const uri = params.uri as string;

  const texts = {
    tr: {
      loading: 'Yükleniyor...',
      play: 'Oynat',
      pause: 'Duraklat',
      skipBack: '10 saniye geri',
      skipForward: '10 saniye ileri',
      mute: 'Sessiz',
      unmute: 'Sesi Aç',
      like: 'Beğen',
      favorite: 'Favorilere Ekle',
    },
    en: {
      loading: 'Loading...',
      play: 'Play',
      pause: 'Pause',
      skipBack: '10 seconds back',
      skipForward: '10 seconds forward',
      mute: 'Mute',
      unmute: 'Unmute',
      like: 'Like',
      favorite: 'Add to Favorites',
    },
  };

  const t = texts[language];

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    // Auto-hide controls after 3 seconds
    if (showControls && isPlaying) {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showControls, isPlaying]);

  useEffect(() => {
    // Update progress periodically
    if (status.isPlaying && status.positionMillis && status.durationMillis) {
      const progress = status.positionMillis / 1000;
      const dur = status.durationMillis / 1000;
      setCurrentTime(progress);
      setDuration(dur);

      // Save progress
      videoService.updateProgress(videoId, progress, dur);
    }
  }, [status]);

  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSkipBack = async () => {
    if (videoRef.current && status.positionMillis) {
      const newPosition = Math.max(0, status.positionMillis - 10000);
      await videoRef.current.setPositionAsync(newPosition);
    }
  };

  const handleSkipForward = async () => {
    if (videoRef.current && status.positionMillis && status.durationMillis) {
      const newPosition = Math.min(status.durationMillis, status.positionMillis + 10000);
      await videoRef.current.setPositionAsync(newPosition);
    }
  };

  const handleToggleMute = async () => {
    if (videoRef.current) {
      await videoRef.current.setIsMutedAsync(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const handleToggleFavorite = async () => {
    await videoService.toggleFavorite(videoId);
  };

  const handleToggleLike = async () => {
    await videoService.toggleLike(videoId);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.videoContainer}
        activeOpacity={1}
        onPress={() => setShowControls(!showControls)}
      >
        <Video
          ref={videoRef}
          source={{ uri }}
          rate={1.0}
          volume={1.0}
          isMuted={isMuted}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={false}
          isLooping={false}
          style={styles.video}
          onPlaybackStatusUpdate={(status) => setStatus(status)}
          onLoad={() => setIsLoading(false)}
          onError={(error) => console.error('Video error:', error)}
        />

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>{t.loading}</Text>
          </View>
        )}

        {showControls && !isLoading && (
          <>
            {/* Top Bar */}
            <LinearGradient
              colors={['rgba(0,0,0,0.8)', 'transparent']}
              style={[styles.topBar, { paddingTop: insets.top + 10 }]}
            >
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ChevronLeft size={24} color={Colors.text} />
              </TouchableOpacity>
              <Text style={styles.videoTitle} numberOfLines={1}>
                {title}
              </Text>
              <View style={styles.topActions}>
                <TouchableOpacity onPress={handleToggleFavorite} style={styles.iconButton}>
                  <Heart size={24} color={Colors.text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleToggleLike} style={styles.iconButton}>
                  <ThumbsUp size={24} color={Colors.text} />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            {/* Center Controls */}
            <View style={styles.centerControls}>
              <TouchableOpacity onPress={handleSkipBack} style={styles.controlButton}>
                <SkipBack size={40} color={Colors.text} />
              </TouchableOpacity>

              <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryDark]}
                  style={styles.playButtonGradient}
                >
                  {isPlaying ? (
                    <Pause size={48} color={Colors.background} />
                  ) : (
                    <Play size={48} color={Colors.background} />
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleSkipForward} style={styles.controlButton}>
                <SkipForward size={40} color={Colors.text} />
              </TouchableOpacity>
            </View>

            {/* Bottom Bar */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={[styles.bottomBar, { paddingBottom: insets.bottom + 20 }]}
            >
              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
                </View>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                  <Text style={styles.timeText}>{formatTime(duration)}</Text>
                </View>
              </View>

              {/* Bottom Controls */}
              <View style={styles.bottomControls}>
                <TouchableOpacity onPress={handleToggleMute} style={styles.iconButton}>
                  {isMuted ? (
                    <VolumeX size={24} color={Colors.text} />
                  ) : (
                    <Volume2 size={24} color={Colors.text} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconButton}>
                  <Maximize size={24} color={Colors.text} />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface + '80',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  topActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface + '80',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerControls: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    transform: [{ translateY: -40 }],
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surface + '80',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  playButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  progressContainer: {
    gap: 8,
    marginBottom: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.surface,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
