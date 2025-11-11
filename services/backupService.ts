/**
 * Backup Service - Otomatik yedekleme ve geri yükleme
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

// Backup Types
export type BackupType = 'full' | 'incremental' | 'differential';

// Backup Schedule
export type BackupSchedule = 'manual' | 'daily' | 'weekly' | 'monthly';

// Backup Storage Location
export type StorageLocation = 'local' | 'cloud' | 'both';

// Backup Status
export type BackupStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

// Backup Info
export interface BackupInfo {
  id: string;
  name: string;
  type: BackupType;
  size: number;
  path: string;
  createdAt: Date;
  status: BackupStatus;
  storageLocation: StorageLocation;
  version: string;
  checksum?: string;
  dataCategories: string[];
  itemCount: number;
}

// Restore Point
export interface RestorePoint {
  backupId: string;
  timestamp: Date;
  description: string;
  canRestore: boolean;
}

// Backup Settings
export interface BackupSettings {
  autoBackup: boolean;
  schedule: BackupSchedule;
  backupType: BackupType;
  storageLocation: StorageLocation;
  maxBackups: number;
  retentionDays: number;
  compressBackups: boolean;
  encryptBackups: boolean;
  includeMedia: boolean;
}

// Restore Result
export interface RestoreResult {
  success: boolean;
  restoredItems: number;
  failedItems: number;
  errors: string[];
  duration: number;
}

class BackupService {
  private readonly SETTINGS_KEY = 'backupSettings';
  private readonly BACKUPS_KEY = 'backupHistory';
  private readonly MAX_HISTORY = 50;
  private settings: BackupSettings;
  private backupInProgress: boolean = false;

  constructor() {
    this.settings = {
      autoBackup: true,
      schedule: 'daily',
      backupType: 'full',
      storageLocation: 'local',
      maxBackups: 10,
      retentionDays: 30,
      compressBackups: true,
      encryptBackups: false,
      includeMedia: false,
    };
    this.loadSettings();
  }

  /**
   * Load settings from storage
   */
  private async loadSettings() {
    try {
      const settingsJson = await AsyncStorage.getItem(this.SETTINGS_KEY);
      if (settingsJson) {
        this.settings = JSON.parse(settingsJson);
      }
    } catch (error) {
      console.error('Error loading backup settings:', error);
    }
  }

  /**
   * Save settings to storage
   */
  private async saveSettings() {
    try {
      await AsyncStorage.setItem(this.SETTINGS_KEY, JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error saving backup settings:', error);
    }
  }

  /**
   * Get backup settings
   */
  getSettings(): BackupSettings {
    return { ...this.settings };
  }

  /**
   * Update backup settings
   */
  async updateSettings(updates: Partial<BackupSettings>): Promise<boolean> {
    try {
      this.settings = { ...this.settings, ...updates };
      await this.saveSettings();
      return true;
    } catch (error) {
      console.error('Error updating backup settings:', error);
      return false;
    }
  }

  /**
   * Create backup
   */
  async createBackup(type: BackupType = 'full', name?: string): Promise<BackupInfo | null> {
    if (this.backupInProgress) {
      Alert.alert('Backup in Progress', 'A backup is already running');
      return null;
    }

    this.backupInProgress = true;

    try {
      const backupId = Date.now().toString();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const backupName = name || `backup-${type}-${timestamp}`;
      const filename = `${backupName}.json`;
      const path = `${FileSystem.documentDirectory}backups/${filename}`;

      // Create backups directory if not exists
      const backupsDir = `${FileSystem.documentDirectory}backups/`;
      const dirInfo = await FileSystem.getInfoAsync(backupsDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(backupsDir, { intermediates: true });
      }

      // Gather data to backup
      const data = await this.gatherBackupData(type);

      // Calculate checksum
      const checksum = this.calculateChecksum(data);

      // Compress if enabled
      const content = this.settings.compressBackups
        ? JSON.stringify(data)
        : JSON.stringify(data, null, 2);

      // Encrypt if enabled (mock implementation)
      const finalContent = this.settings.encryptBackups
        ? this.encryptData(content)
        : content;

      // Write backup file
      await FileSystem.writeAsStringAsync(path, finalContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const fileInfo = await FileSystem.getInfoAsync(path);

      const backupInfo: BackupInfo = {
        id: backupId,
        name: backupName,
        type,
        size: fileInfo.size || 0,
        path,
        createdAt: new Date(),
        status: 'completed',
        storageLocation: this.settings.storageLocation,
        version: '1.0.0',
        checksum,
        dataCategories: Object.keys(data).filter((key) => key !== 'metadata'),
        itemCount: this.countItems(data),
      };

      // Save to history
      await this.addToHistory(backupInfo);

      // Cleanup old backups
      await this.cleanupOldBackups();

      // Upload to cloud if enabled
      if (
        this.settings.storageLocation === 'cloud' ||
        this.settings.storageLocation === 'both'
      ) {
        await this.uploadToCloud(backupInfo);
      }

      return backupInfo;
    } catch (error) {
      console.error('Backup error:', error);
      Alert.alert('Backup Failed', `Error: ${error}`);
      return null;
    } finally {
      this.backupInProgress = false;
    }
  }

  /**
   * Restore from backup
   */
  async restoreFromBackup(backupId: string): Promise<RestoreResult> {
    const startTime = Date.now();

    try {
      const backup = await this.getBackupInfo(backupId);
      if (!backup) {
        return {
          success: false,
          restoredItems: 0,
          failedItems: 0,
          errors: ['Backup not found'],
          duration: Date.now() - startTime,
        };
      }

      // Read backup file
      let content = await FileSystem.readAsStringAsync(backup.path, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Decrypt if needed
      if (this.settings.encryptBackups) {
        content = this.decryptData(content);
      }

      const data = JSON.parse(content);

      // Validate backup data
      if (!this.validateBackupData(data)) {
        return {
          success: false,
          restoredItems: 0,
          failedItems: 0,
          errors: ['Invalid backup data'],
          duration: Date.now() - startTime,
        };
      }

      let restoredItems = 0;
      let failedItems = 0;
      const errors: string[] = [];

      // Restore members
      if (data.members) {
        try {
          await AsyncStorage.setItem('members', JSON.stringify(data.members));
          restoredItems += data.members.length;
        } catch (error) {
          errors.push(`Failed to restore members: ${error}`);
          failedItems += data.members.length;
        }
      }

      // Restore sessions
      if (data.sessions) {
        try {
          await AsyncStorage.setItem('sessions', JSON.stringify(data.sessions));
          restoredItems += data.sessions.length;
        } catch (error) {
          errors.push(`Failed to restore sessions: ${error}`);
          failedItems += data.sessions.length;
        }
      }

      // Restore payments
      if (data.payments) {
        try {
          await AsyncStorage.setItem('payments', JSON.stringify(data.payments));
          restoredItems += data.payments.length;
        } catch (error) {
          errors.push(`Failed to restore payments: ${error}`);
          failedItems += data.payments.length;
        }
      }

      // Restore trainers
      if (data.trainers) {
        try {
          await AsyncStorage.setItem('trainers', JSON.stringify(data.trainers));
          restoredItems += data.trainers.length;
        } catch (error) {
          errors.push(`Failed to restore trainers: ${error}`);
          failedItems += data.trainers.length;
        }
      }

      // Restore packages
      if (data.packages) {
        try {
          await AsyncStorage.setItem('packages', JSON.stringify(data.packages));
          restoredItems += data.packages.length;
        } catch (error) {
          errors.push(`Failed to restore packages: ${error}`);
          failedItems += data.packages.length;
        }
      }

      // Restore settings
      if (data.settings) {
        try {
          for (const [key, value] of Object.entries(data.settings)) {
            await AsyncStorage.setItem(key, JSON.stringify(value));
          }
        } catch (error) {
          errors.push(`Failed to restore settings: ${error}`);
        }
      }

      return {
        success: restoredItems > 0,
        restoredItems,
        failedItems,
        errors,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        restoredItems: 0,
        failedItems: 0,
        errors: [`Restore failed: ${error}`],
        duration: Date.now() - startTime,
      };
    }
  }

  /**
   * Gather data for backup
   */
  private async gatherBackupData(type: BackupType): Promise<any> {
    const data: any = {
      metadata: {
        backupType: type,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        appVersion: '1.0.0',
      },
    };

    // Get all data for full backup
    if (type === 'full') {
      const membersJson = await AsyncStorage.getItem('members');
      const sessionsJson = await AsyncStorage.getItem('sessions');
      const paymentsJson = await AsyncStorage.getItem('payments');
      const trainersJson = await AsyncStorage.getItem('trainers');
      const packagesJson = await AsyncStorage.getItem('packages');

      data.members = membersJson ? JSON.parse(membersJson) : [];
      data.sessions = sessionsJson ? JSON.parse(sessionsJson) : [];
      data.payments = paymentsJson ? JSON.parse(paymentsJson) : [];
      data.trainers = trainersJson ? JSON.parse(trainersJson) : [];
      data.packages = packagesJson ? JSON.parse(packagesJson) : [];

      // Include settings
      data.settings = await this.getAllSettings();
    }

    return data;
  }

  /**
   * Get all settings for backup
   */
  private async getAllSettings(): Promise<any> {
    const settings: any = {};
    const keys = await AsyncStorage.getAllKeys();

    for (const key of keys) {
      if (key.includes('Settings') || key.includes('Config')) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          settings[key] = JSON.parse(value);
        }
      }
    }

    return settings;
  }

  /**
   * Calculate checksum
   */
  private calculateChecksum(data: any): string {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Encrypt data (mock implementation)
   */
  private encryptData(data: string): string {
    // In production, use a proper encryption library
    return Buffer.from(data).toString('base64');
  }

  /**
   * Decrypt data (mock implementation)
   */
  private decryptData(data: string): string {
    // In production, use a proper encryption library
    return Buffer.from(data, 'base64').toString('utf8');
  }

  /**
   * Validate backup data
   */
  private validateBackupData(data: any): boolean {
    if (!data.metadata) return false;
    if (!data.metadata.timestamp) return false;
    if (!data.metadata.version) return false;
    return true;
  }

  /**
   * Count items in backup
   */
  private countItems(data: any): number {
    let count = 0;
    if (data.members) count += data.members.length;
    if (data.sessions) count += data.sessions.length;
    if (data.payments) count += data.payments.length;
    if (data.trainers) count += data.trainers.length;
    if (data.packages) count += data.packages.length;
    return count;
  }

  /**
   * Add backup to history
   */
  private async addToHistory(backupInfo: BackupInfo): Promise<void> {
    try {
      const historyJson = await AsyncStorage.getItem(this.BACKUPS_KEY);
      const history = historyJson ? JSON.parse(historyJson) : [];

      history.unshift(backupInfo);

      if (history.length > this.MAX_HISTORY) {
        history.splice(this.MAX_HISTORY);
      }

      await AsyncStorage.setItem(this.BACKUPS_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error adding to backup history:', error);
    }
  }

  /**
   * Get backup history
   */
  async getBackupHistory(): Promise<BackupInfo[]> {
    try {
      const historyJson = await AsyncStorage.getItem(this.BACKUPS_KEY);
      if (historyJson) {
        return JSON.parse(historyJson).map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        }));
      }
    } catch (error) {
      console.error('Error getting backup history:', error);
    }
    return [];
  }

  /**
   * Get backup info
   */
  async getBackupInfo(backupId: string): Promise<BackupInfo | null> {
    const history = await this.getBackupHistory();
    return history.find((b) => b.id === backupId) || null;
  }

  /**
   * Delete backup
   */
  async deleteBackup(backupId: string): Promise<boolean> {
    try {
      const backup = await this.getBackupInfo(backupId);
      if (!backup) return false;

      // Delete file
      await FileSystem.deleteAsync(backup.path, { idempotent: true });

      // Remove from history
      const history = await this.getBackupHistory();
      const filtered = history.filter((b) => b.id !== backupId);
      await AsyncStorage.setItem(this.BACKUPS_KEY, JSON.stringify(filtered));

      return true;
    } catch (error) {
      console.error('Error deleting backup:', error);
      return false;
    }
  }

  /**
   * Cleanup old backups
   */
  private async cleanupOldBackups(): Promise<void> {
    try {
      const history = await this.getBackupHistory();

      // Remove backups older than retention period
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.settings.retentionDays);

      const toDelete = history.filter(
        (backup) => backup.createdAt < cutoffDate && history.indexOf(backup) >= this.settings.maxBackups
      );

      for (const backup of toDelete) {
        await this.deleteBackup(backup.id);
      }
    } catch (error) {
      console.error('Error cleaning up old backups:', error);
    }
  }

  /**
   * Upload to cloud (mock implementation)
   */
  private async uploadToCloud(backupInfo: BackupInfo): Promise<boolean> {
    // In production, integrate with cloud storage (AWS S3, Google Drive, etc.)
    console.log('Uploading to cloud:', backupInfo.name);
    return true;
  }

  /**
   * Download from cloud (mock implementation)
   */
  private async downloadFromCloud(backupId: string): Promise<boolean> {
    // In production, integrate with cloud storage
    console.log('Downloading from cloud:', backupId);
    return true;
  }

  /**
   * Get restore points
   */
  async getRestorePoints(): Promise<RestorePoint[]> {
    const history = await this.getBackupHistory();

    return history.map((backup) => ({
      backupId: backup.id,
      timestamp: backup.createdAt,
      description: `${backup.type} backup - ${backup.itemCount} items`,
      canRestore: backup.status === 'completed',
    }));
  }

  /**
   * Schedule auto backup
   */
  async scheduleAutoBackup(): Promise<void> {
    if (!this.settings.autoBackup) return;

    // In production, use background tasks or scheduled notifications
    console.log('Auto backup scheduled:', this.settings.schedule);
  }

  /**
   * Check if backup needed
   */
  async isBackupNeeded(): Promise<boolean> {
    const history = await this.getBackupHistory();
    if (history.length === 0) return true;

    const lastBackup = history[0];
    const now = new Date();
    const hoursSinceBackup =
      (now.getTime() - lastBackup.createdAt.getTime()) / (1000 * 60 * 60);

    switch (this.settings.schedule) {
      case 'daily':
        return hoursSinceBackup >= 24;
      case 'weekly':
        return hoursSinceBackup >= 24 * 7;
      case 'monthly':
        return hoursSinceBackup >= 24 * 30;
      default:
        return false;
    }
  }

  /**
   * Get backup statistics
   */
  async getStatistics(): Promise<{
    totalBackups: number;
    totalSize: number;
    latestBackup: Date | null;
    oldestBackup: Date | null;
    averageSize: number;
  }> {
    const history = await this.getBackupHistory();

    return {
      totalBackups: history.length,
      totalSize: history.reduce((sum, b) => sum + b.size, 0),
      latestBackup: history.length > 0 ? history[0].createdAt : null,
      oldestBackup: history.length > 0 ? history[history.length - 1].createdAt : null,
      averageSize: history.length > 0 ? history.reduce((sum, b) => sum + b.size, 0) / history.length : 0,
    };
  }
}

// Export singleton instance
export const backupService = new BackupService();
