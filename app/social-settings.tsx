/**
 * Social Media Settings Screen - Sosyal medya ayarları ve paylaşım
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
  Linkedin,
  Send,
  Share2,
  TrendingUp,
  CheckCircle,
  XCircle,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import {
  socialService,
  SocialPlatform,
  SocialAccount,
  ShareContent,
} from '@/services/socialService';

export default function SocialSettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();

  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [statistics, setStatistics] = useState({
    totalShares: 0,
    successRate: 0,
    topPlatform: null as SocialPlatform | null,
    topContentType: null,
    platformBreakdown: {} as Record<SocialPlatform, number>,
  });
  const [shareHistory, setShareHistory] = useState<any[]>([]);
  const [testMessage, setTestMessage] = useState('');

  const texts = {
    tr: {
      title: 'Sosyal Medya',
      connectedAccounts: 'Bağlı Hesaplar',
      platforms: 'Platformlar',
      statistics: 'İstatistikler',
      totalShares: 'Toplam Paylaşım',
      successRate: 'Başarı Oranı',
      topPlatform: 'En Çok Kullanılan',
      recentShares: 'Son Paylaşımlar',
      noShares: 'Henüz paylaşım yapılmadı',
      testShare: 'Test Paylaşımı',
      testMessage: 'Test mesajınızı yazın...',
      shareNow: 'Şimdi Paylaş',
      autoShare: 'Otomatik Paylaşım',
      username: 'Kullanıcı Adı',
      connected: 'Bağlı',
      notConnected: 'Bağlı Değil',
      connect: 'Bağla',
      disconnect: 'Bağlantıyı Kes',
      facebook: 'Facebook',
      instagram: 'Instagram',
      twitter: 'Twitter / X',
      whatsapp: 'WhatsApp',
      linkedin: 'LinkedIn',
      telegram: 'Telegram',
      success: 'Başarılı',
      failed: 'Başarısız',
      shareSuccess: 'Paylaşım başarılı!',
      shareError: 'Paylaşım başarısız',
      enterMessage: 'Lütfen bir mesaj girin',
    },
    en: {
      title: 'Social Media',
      connectedAccounts: 'Connected Accounts',
      platforms: 'Platforms',
      statistics: 'Statistics',
      totalShares: 'Total Shares',
      successRate: 'Success Rate',
      topPlatform: 'Most Used',
      recentShares: 'Recent Shares',
      noShares: 'No shares yet',
      testShare: 'Test Share',
      testMessage: 'Write your test message...',
      shareNow: 'Share Now',
      autoShare: 'Auto Share',
      username: 'Username',
      connected: 'Connected',
      notConnected: 'Not Connected',
      connect: 'Connect',
      disconnect: 'Disconnect',
      facebook: 'Facebook',
      instagram: 'Instagram',
      twitter: 'Twitter / X',
      whatsapp: 'WhatsApp',
      linkedin: 'LinkedIn',
      telegram: 'Telegram',
      success: 'Success',
      failed: 'Failed',
      shareSuccess: 'Share successful!',
      shareError: 'Share failed',
      enterMessage: 'Please enter a message',
    },
  };

  const t = texts[language];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const loadedAccounts = socialService.getAccounts();
    const stats = socialService.getStatistics();
    const history = socialService.getShareHistory(10);

    setAccounts(loadedAccounts);
    setStatistics(stats);
    setShareHistory(history);
  };

  const platformIcons = {
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
    whatsapp: MessageCircle,
    linkedin: Linkedin,
    telegram: Send,
  };

  const platformColors = {
    facebook: '#1877F2',
    instagram: '#E4405F',
    twitter: '#1DA1F2',
    whatsapp: '#25D366',
    linkedin: '#0A66C2',
    telegram: '#0088CC',
  };

  const handleToggleAccount = async (platform: SocialPlatform) => {
    const account = accounts.find((a) => a.platform === platform);

    if (account) {
      // Disconnect
      await socialService.removeAccount(platform);
    } else {
      // Connect - in a real app, this would initiate OAuth flow
      const newAccount: SocialAccount = {
        platform,
        username: '',
        connected: true,
        autoShare: false,
      };
      await socialService.updateAccount(newAccount);
    }

    loadData();
  };

  const handleToggleAutoShare = async (platform: SocialPlatform) => {
    const account = accounts.find((a) => a.platform === platform);
    if (account) {
      account.autoShare = !account.autoShare;
      await socialService.updateAccount(account);
      loadData();
    }
  };

  const handleTestShare = async (platform: SocialPlatform) => {
    if (!testMessage.trim()) {
      Alert.alert(t.enterMessage);
      return;
    }

    const content: ShareContent = {
      type: 'general',
      title: t.testShare,
      message: testMessage,
      hashtags: ['pilates', 'fitness'],
    };

    const success = await socialService.shareToplatform(platform, content);

    if (success) {
      Alert.alert(t.success, t.shareSuccess);
      setTestMessage('');
      loadData();
    } else {
      Alert.alert(t.shareError);
    }
  };

  const renderPlatformCard = (platform: SocialPlatform) => {
    const Icon = platformIcons[platform];
    const color = platformColors[platform];
    const account = accounts.find((a) => a.platform === platform);
    const isConnected = !!account;

    const platformName = {
      facebook: t.facebook,
      instagram: t.instagram,
      twitter: t.twitter,
      whatsapp: t.whatsapp,
      linkedin: t.linkedin,
      telegram: t.telegram,
    }[platform];

    return (
      <View key={platform} style={styles.platformCard}>
        <View style={styles.platformHeader}>
          <View style={[styles.platformIcon, { backgroundColor: color }]}>
            <Icon size={24} color={Colors.text} />
          </View>
          <View style={styles.platformInfo}>
            <Text style={styles.platformName}>{platformName}</Text>
            <Text style={[styles.platformStatus, isConnected && styles.platformStatusConnected]}>
              {isConnected ? t.connected : t.notConnected}
            </Text>
          </View>
          <Switch
            value={isConnected}
            onValueChange={() => handleToggleAccount(platform)}
            trackColor={{ false: Colors.border, true: color }}
            thumbColor={Colors.text}
          />
        </View>

        {isConnected && (
          <View style={styles.platformActions}>
            <View style={styles.platformSetting}>
              <Text style={styles.platformSettingLabel}>{t.autoShare}</Text>
              <Switch
                value={account?.autoShare || false}
                onValueChange={() => handleToggleAutoShare(platform)}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.text}
              />
            </View>

            <TouchableOpacity
              style={[styles.testShareButton, { backgroundColor: color }]}
              onPress={() => handleTestShare(platform)}
            >
              <Share2 size={16} color={Colors.text} />
              <Text style={styles.testShareButtonText}>{t.shareNow}</Text>
            </TouchableOpacity>
          </View>
        )}
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
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.statistics}</Text>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <TrendingUp size={24} color={Colors.primary} />
                <Text style={styles.statValue}>{statistics.totalShares}</Text>
                <Text style={styles.statLabel}>{t.totalShares}</Text>
              </View>

              <View style={styles.statCard}>
                <CheckCircle size={24} color={Colors.success} />
                <Text style={styles.statValue}>{statistics.successRate.toFixed(0)}%</Text>
                <Text style={styles.statLabel}>{t.successRate}</Text>
              </View>

              {statistics.topPlatform && (
                <View style={styles.statCard}>
                  <Share2 size={24} color={Colors.info} />
                  <Text style={styles.statValue}>
                    {
                      {
                        facebook: t.facebook,
                        instagram: t.instagram,
                        twitter: t.twitter,
                        whatsapp: t.whatsapp,
                        linkedin: t.linkedin,
                        telegram: t.telegram,
                      }[statistics.topPlatform]
                    }
                  </Text>
                  <Text style={styles.statLabel}>{t.topPlatform}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Test Message */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.testShare}</Text>
            <View style={styles.testMessageCard}>
              <TextInput
                style={styles.testMessageInput}
                placeholder={t.testMessage}
                placeholderTextColor={Colors.textTertiary}
                value={testMessage}
                onChangeText={setTestMessage}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          {/* Platforms */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.platforms}</Text>
            {(['facebook', 'instagram', 'twitter', 'whatsapp', 'linkedin', 'telegram'] as SocialPlatform[]).map(
              renderPlatformCard
            )}
          </View>

          {/* Recent Shares */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.recentShares}</Text>
            {shareHistory.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>{t.noShares}</Text>
              </View>
            ) : (
              <View style={styles.historyList}>
                {shareHistory.map((entry, index) => (
                  <View key={entry.id || index} style={styles.historyItem}>
                    <View
                      style={[
                        styles.historyIcon,
                        {
                          backgroundColor: entry.success
                            ? Colors.success + '20'
                            : Colors.error + '20',
                        },
                      ]}
                    >
                      {entry.success ? (
                        <CheckCircle size={20} color={Colors.success} />
                      ) : (
                        <XCircle size={20} color={Colors.error} />
                      )}
                    </View>
                    <View style={styles.historyInfo}>
                      <Text style={styles.historyPlatform}>
                        {
                          {
                            facebook: t.facebook,
                            instagram: t.instagram,
                            twitter: t.twitter,
                            whatsapp: t.whatsapp,
                            linkedin: t.linkedin,
                            telegram: t.telegram,
                          }[entry.platform as SocialPlatform]
                        }
                      </Text>
                      <Text style={styles.historyMessage} numberOfLines={1}>
                        {entry.message}
                      </Text>
                      <Text style={styles.historyDate}>
                        {new Date(entry.sharedAt).toLocaleString(
                          language === 'tr' ? 'tr-TR' : 'en-US'
                        )}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.historyStatus,
                        entry.success ? styles.historyStatusSuccess : styles.historyStatusFailed,
                      ]}
                    >
                      {entry.success ? t.success : t.failed}
                    </Text>
                  </View>
                ))}
              </View>
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
  title: { fontSize: 24, fontWeight: '800', color: Colors.text },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, gap: 24 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, paddingLeft: 4 },
  statsGrid: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  statValue: { fontSize: 20, fontWeight: '800', color: Colors.text },
  statLabel: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary, textAlign: 'center' },
  testMessageCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16 },
  testMessageInput: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  platformCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, gap: 12 },
  platformHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  platformIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  platformInfo: { flex: 1, gap: 4 },
  platformName: { fontSize: 16, fontWeight: '700', color: Colors.text },
  platformStatus: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  platformStatusConnected: { color: Colors.success },
  platformActions: { gap: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.border },
  platformSetting: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  platformSettingLabel: { fontSize: 14, fontWeight: '700', color: Colors.text },
  testShareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  testShareButtonText: { fontSize: 14, fontWeight: '700', color: Colors.text },
  emptyCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 24, alignItems: 'center' },
  emptyText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  historyList: { gap: 12 },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
  },
  historyIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  historyInfo: { flex: 1, gap: 2 },
  historyPlatform: { fontSize: 14, fontWeight: '700', color: Colors.text },
  historyMessage: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  historyDate: { fontSize: 11, fontWeight: '600', color: Colors.textTertiary },
  historyStatus: { fontSize: 12, fontWeight: '700' },
  historyStatusSuccess: { color: Colors.success },
  historyStatusFailed: { color: Colors.error },
});
