/**
 * Social Media Service - Sosyal medya paylaşım ve entegrasyon
 */

import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';
import { Linking, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Social Media Platform Types
export type SocialPlatform = 'facebook' | 'instagram' | 'twitter' | 'whatsapp' | 'linkedin' | 'telegram';

// Share Content Types
export type ShareContentType =
  | 'session_achievement'
  | 'member_milestone'
  | 'studio_announcement'
  | 'payment_receipt'
  | 'trainer_achievement'
  | 'class_promotion'
  | 'general';

// Share Content Data
export interface ShareContent {
  type: ShareContentType;
  title: string;
  message: string;
  url?: string;
  imageUrl?: string;
  hashtags?: string[];
}

// Social Media Account
export interface SocialAccount {
  platform: SocialPlatform;
  username: string;
  connected: boolean;
  autoShare: boolean;
}

// Share History Entry
export interface ShareHistoryEntry {
  id: string;
  platform: SocialPlatform;
  contentType: ShareContentType;
  message: string;
  sharedAt: Date;
  success: boolean;
}

class SocialService {
  private accounts: SocialAccount[] = [];
  private shareHistory: ShareHistoryEntry[] = [];
  private readonly MAX_HISTORY = 100;

  constructor() {
    this.loadSettings();
  }

  /**
   * Load settings from storage
   */
  private async loadSettings() {
    try {
      const accountsJson = await AsyncStorage.getItem('socialAccounts');
      const historyJson = await AsyncStorage.getItem('socialShareHistory');

      if (accountsJson) {
        this.accounts = JSON.parse(accountsJson);
      }

      if (historyJson) {
        this.shareHistory = JSON.parse(historyJson).map((entry: any) => ({
          ...entry,
          sharedAt: new Date(entry.sharedAt),
        }));
      }
    } catch (error) {
      console.error('Error loading social settings:', error);
    }
  }

  /**
   * Save accounts to storage
   */
  private async saveAccounts() {
    try {
      await AsyncStorage.setItem('socialAccounts', JSON.stringify(this.accounts));
    } catch (error) {
      console.error('Error saving social accounts:', error);
    }
  }

  /**
   * Save share history
   */
  private async saveHistory() {
    try {
      await AsyncStorage.setItem('socialShareHistory', JSON.stringify(this.shareHistory));
    } catch (error) {
      console.error('Error saving share history:', error);
    }
  }

  /**
   * Add to history
   */
  private async addToHistory(
    platform: SocialPlatform,
    contentType: ShareContentType,
    message: string,
    success: boolean
  ) {
    const entry: ShareHistoryEntry = {
      id: Date.now().toString(),
      platform,
      contentType,
      message,
      sharedAt: new Date(),
      success,
    };

    this.shareHistory.unshift(entry);

    // Keep only last MAX_HISTORY items
    if (this.shareHistory.length > this.MAX_HISTORY) {
      this.shareHistory = this.shareHistory.slice(0, this.MAX_HISTORY);
    }

    await this.saveHistory();
  }

  /**
   * Get connected accounts
   */
  getAccounts(): SocialAccount[] {
    return this.accounts;
  }

  /**
   * Add or update account
   */
  async updateAccount(account: SocialAccount): Promise<void> {
    const index = this.accounts.findIndex((a) => a.platform === account.platform);

    if (index >= 0) {
      this.accounts[index] = account;
    } else {
      this.accounts.push(account);
    }

    await this.saveAccounts();
  }

  /**
   * Remove account
   */
  async removeAccount(platform: SocialPlatform): Promise<void> {
    this.accounts = this.accounts.filter((a) => a.platform !== platform);
    await this.saveAccounts();
  }

  /**
   * Get share history
   */
  getShareHistory(limit?: number): ShareHistoryEntry[] {
    return limit ? this.shareHistory.slice(0, limit) : this.shareHistory;
  }

  /**
   * Clear share history
   */
  async clearHistory(): Promise<void> {
    this.shareHistory = [];
    await this.saveHistory();
  }

  /**
   * Share to specific platform
   */
  async shareToplatform(platform: SocialPlatform, content: ShareContent): Promise<boolean> {
    try {
      const message = this.formatMessage(content);
      let success = false;

      switch (platform) {
        case 'facebook':
          success = await this.shareToFacebook(message, content.url);
          break;
        case 'instagram':
          success = await this.shareToInstagram(message);
          break;
        case 'twitter':
          success = await this.shareToTwitter(message, content.hashtags);
          break;
        case 'whatsapp':
          success = await this.shareToWhatsApp(message);
          break;
        case 'linkedin':
          success = await this.shareToLinkedIn(message, content.url);
          break;
        case 'telegram':
          success = await this.shareToTelegram(message);
          break;
        default:
          success = false;
      }

      await this.addToHistory(platform, content.type, content.message, success);
      return success;
    } catch (error) {
      console.error(`Error sharing to ${platform}:`, error);
      await this.addToHistory(platform, content.type, content.message, false);
      return false;
    }
  }

  /**
   * Generic share (shows native share sheet)
   */
  async shareGeneric(content: ShareContent): Promise<boolean> {
    try {
      const message = this.formatMessage(content);
      const isAvailable = await Sharing.isAvailableAsync();

      if (!isAvailable) {
        // Fallback to clipboard
        await Clipboard.setStringAsync(message);
        Alert.alert(
          'Paylaşım',
          'Metin panoya kopyalandı. İstediğiniz uygulamaya yapıştırabilirsiniz.'
        );
        return true;
      }

      // TODO: If content has image, use that
      // For now, just share text
      await Sharing.shareAsync('data:text/plain,' + encodeURIComponent(message), {
        mimeType: 'text/plain',
        dialogTitle: content.title,
      });

      return true;
    } catch (error) {
      console.error('Error in generic share:', error);
      return false;
    }
  }

  /**
   * Format message with hashtags
   */
  private formatMessage(content: ShareContent): string {
    let message = `${content.title}\n\n${content.message}`;

    if (content.url) {
      message += `\n\n${content.url}`;
    }

    if (content.hashtags && content.hashtags.length > 0) {
      message += '\n\n' + content.hashtags.map((tag) => `#${tag}`).join(' ');
    }

    return message;
  }

  /**
   * Share to Facebook
   */
  private async shareToFacebook(message: string, url?: string): Promise<boolean> {
    try {
      const shareUrl = url || 'https://www.facebook.com/';
      const facebookUrl = `fb://facewebmodal/f?href=${encodeURIComponent(shareUrl)}`;

      const canOpen = await Linking.canOpenURL(facebookUrl);

      if (canOpen) {
        await Linking.openURL(facebookUrl);
        return true;
      } else {
        // Fallback to web
        const webUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        await Linking.openURL(webUrl);
        return true;
      }
    } catch (error) {
      console.error('Error sharing to Facebook:', error);
      return false;
    }
  }

  /**
   * Share to Instagram
   */
  private async shareToInstagram(message: string): Promise<boolean> {
    try {
      // Instagram doesn't support direct text sharing via URL scheme
      // Copy to clipboard and open Instagram
      await Clipboard.setStringAsync(message);

      const instagramUrl = 'instagram://camera';
      const canOpen = await Linking.canOpenURL(instagramUrl);

      if (canOpen) {
        await Linking.openURL(instagramUrl);
        Alert.alert(
          'Instagram',
          'Metin panoya kopyalandı. Instagram\'da story veya post oluştururken yapıştırabilirsiniz.'
        );
        return true;
      } else {
        Alert.alert('Hata', 'Instagram uygulaması bulunamadı');
        return false;
      }
    } catch (error) {
      console.error('Error sharing to Instagram:', error);
      return false;
    }
  }

  /**
   * Share to Twitter
   */
  private async shareToTwitter(message: string, hashtags?: string[]): Promise<boolean> {
    try {
      let twitterMessage = message;

      if (hashtags && hashtags.length > 0) {
        twitterMessage += ' ' + hashtags.map((tag) => `#${tag}`).join(' ');
      }

      const twitterUrl = `twitter://post?message=${encodeURIComponent(twitterMessage)}`;
      const canOpen = await Linking.canOpenURL(twitterUrl);

      if (canOpen) {
        await Linking.openURL(twitterUrl);
        return true;
      } else {
        // Fallback to web (X/Twitter)
        const webUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterMessage)}`;
        await Linking.openURL(webUrl);
        return true;
      }
    } catch (error) {
      console.error('Error sharing to Twitter:', error);
      return false;
    }
  }

  /**
   * Share to WhatsApp
   */
  private async shareToWhatsApp(message: string): Promise<boolean> {
    try {
      const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
      const canOpen = await Linking.canOpenURL(whatsappUrl);

      if (canOpen) {
        await Linking.openURL(whatsappUrl);
        return true;
      } else {
        Alert.alert('Hata', 'WhatsApp uygulaması bulunamadı');
        return false;
      }
    } catch (error) {
      console.error('Error sharing to WhatsApp:', error);
      return false;
    }
  }

  /**
   * Share to LinkedIn
   */
  private async shareToLinkedIn(message: string, url?: string): Promise<boolean> {
    try {
      const shareUrl = url || '';
      const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

      await Linking.openURL(linkedinUrl);
      return true;
    } catch (error) {
      console.error('Error sharing to LinkedIn:', error);
      return false;
    }
  }

  /**
   * Share to Telegram
   */
  private async shareToTelegram(message: string): Promise<boolean> {
    try {
      const telegramUrl = `tg://msg?text=${encodeURIComponent(message)}`;
      const canOpen = await Linking.canOpenURL(telegramUrl);

      if (canOpen) {
        await Linking.openURL(telegramUrl);
        return true;
      } else {
        // Fallback to web
        const webUrl = `https://t.me/share/url?url=&text=${encodeURIComponent(message)}`;
        await Linking.openURL(webUrl);
        return true;
      }
    } catch (error) {
      console.error('Error sharing to Telegram:', error);
      return false;
    }
  }

  /**
   * Get share statistics
   */
  getStatistics(): {
    totalShares: number;
    successRate: number;
    topPlatform: SocialPlatform | null;
    topContentType: ShareContentType | null;
    platformBreakdown: Record<SocialPlatform, number>;
  } {
    const totalShares = this.shareHistory.length;
    const successfulShares = this.shareHistory.filter((h) => h.success).length;
    const successRate = totalShares > 0 ? (successfulShares / totalShares) * 100 : 0;

    // Platform breakdown
    const platformBreakdown = this.shareHistory.reduce((acc, entry) => {
      acc[entry.platform] = (acc[entry.platform] || 0) + 1;
      return acc;
    }, {} as Record<SocialPlatform, number>);

    const topPlatform =
      Object.keys(platformBreakdown).length > 0
        ? (Object.keys(platformBreakdown).reduce((a, b) =>
            platformBreakdown[a as SocialPlatform] > platformBreakdown[b as SocialPlatform] ? a : b
          ) as SocialPlatform)
        : null;

    // Content type breakdown
    const contentTypeBreakdown = this.shareHistory.reduce((acc, entry) => {
      acc[entry.contentType] = (acc[entry.contentType] || 0) + 1;
      return acc;
    }, {} as Record<ShareContentType, number>);

    const topContentType =
      Object.keys(contentTypeBreakdown).length > 0
        ? (Object.keys(contentTypeBreakdown).reduce((a, b) =>
            contentTypeBreakdown[a as ShareContentType] > contentTypeBreakdown[b as ShareContentType]
              ? a
              : b
          ) as ShareContentType)
        : null;

    return {
      totalShares,
      successRate,
      topPlatform,
      topContentType,
      platformBreakdown,
    };
  }

  /**
   * Create share content for session achievement
   */
  createSessionAchievementShare(
    memberName: string,
    sessionCount: number,
    studioName: string
  ): ShareContent {
    return {
      type: 'session_achievement',
      title: '🎉 Başarı Paylaş',
      message: `${memberName}, ${studioName}'da ${sessionCount}. seansını tamamladı! 💪`,
      hashtags: ['pilates', 'fitness', 'wellness', 'achievement'],
    };
  }

  /**
   * Create share content for member milestone
   */
  createMemberMilestoneShare(
    memberName: string,
    milestone: string,
    studioName: string
  ): ShareContent {
    return {
      type: 'member_milestone',
      title: '🏆 Kilometre Taşı',
      message: `${memberName}, ${studioName}'da harika bir başarıya imza attı: ${milestone}! 🎊`,
      hashtags: ['pilates', 'milestone', 'fitness', 'success'],
    };
  }

  /**
   * Create share content for studio announcement
   */
  createStudioAnnouncementShare(announcement: string, studioName: string): ShareContent {
    return {
      type: 'studio_announcement',
      title: '📢 Duyuru',
      message: `${studioName} - ${announcement}`,
      hashtags: ['pilates', 'studio', 'announcement'],
    };
  }

  /**
   * Create share content for class promotion
   */
  createClassPromotionShare(
    className: string,
    date: string,
    studioName: string
  ): ShareContent {
    return {
      type: 'class_promotion',
      title: '📅 Sınıf Tanıtımı',
      message: `${studioName}'da ${className} sınıfımız ${date} tarihinde! Kaçırmayın! 🔥`,
      hashtags: ['pilates', 'class', 'fitness', 'workout'],
    };
  }
}

// Export singleton instance
export const socialService = new SocialService();

// Helper functions
export const shareToSocial = (platform: SocialPlatform, content: ShareContent) =>
  socialService.shareToplatform(platform, content);

export const shareGeneric = (content: ShareContent) => socialService.shareGeneric(content);
