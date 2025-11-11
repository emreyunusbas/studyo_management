/**
 * Export/Import Service - Veri dışa/içe aktarma
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

// Export Format Types
export type ExportFormat = 'json' | 'csv' | 'excel';

// Export Category Types
export type ExportCategory = 'all' | 'members' | 'sessions' | 'payments' | 'trainers' | 'packages';

// Export Options
export interface ExportOptions {
  format: ExportFormat;
  categories: ExportCategory[];
  includeArchived: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// Import Result
export interface ImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors: string[];
  summary: {
    members?: number;
    sessions?: number;
    payments?: number;
    trainers?: number;
    packages?: number;
  };
}

// Export File Info
export interface ExportFileInfo {
  filename: string;
  size: number;
  path: string;
  format: ExportFormat;
  createdAt: Date;
  categories: ExportCategory[];
}

class ExportImportService {
  private readonly EXPORT_HISTORY_KEY = 'exportHistory';
  private readonly MAX_HISTORY = 20;

  /**
   * Export data
   */
  async exportData(options: ExportOptions): Promise<ExportFileInfo | null> {
    try {
      const data = await this.gatherData(options);
      const content = this.formatData(data, options.format);
      const filename = this.generateFilename(options);
      const path = `${FileSystem.documentDirectory}${filename}`;

      // Write file
      await FileSystem.writeAsStringAsync(path, content, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const fileInfo = await FileSystem.getInfoAsync(path);

      const exportInfo: ExportFileInfo = {
        filename,
        size: fileInfo.size || 0,
        path,
        format: options.format,
        createdAt: new Date(),
        categories: options.categories,
      };

      // Save to history
      await this.addToHistory(exportInfo);

      // Share file
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(path, {
          mimeType: this.getMimeType(options.format),
          dialogTitle: 'Export Data',
        });
      }

      return exportInfo;
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Export Error', 'Failed to export data');
      return null;
    }
  }

  /**
   * Import data from file
   */
  async importData(fileUri: string): Promise<ImportResult> {
    try {
      // Read file
      const content = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Parse data
      const data = JSON.parse(content);

      // Validate data
      const validation = this.validateImportData(data);
      if (!validation.valid) {
        return {
          success: false,
          imported: 0,
          failed: 0,
          errors: validation.errors,
          summary: {},
        };
      }

      // Import data
      let imported = 0;
      let failed = 0;
      const errors: string[] = [];
      const summary: ImportResult['summary'] = {};

      // Import members
      if (data.members && Array.isArray(data.members)) {
        try {
          // In real app, save to backend/database
          const membersJson = await AsyncStorage.getItem('members');
          const existingMembers = membersJson ? JSON.parse(membersJson) : [];
          const updatedMembers = [...existingMembers, ...data.members];
          await AsyncStorage.setItem('members', JSON.stringify(updatedMembers));

          summary.members = data.members.length;
          imported += data.members.length;
        } catch (error) {
          errors.push(`Members import failed: ${error}`);
          failed += data.members.length;
        }
      }

      // Import sessions
      if (data.sessions && Array.isArray(data.sessions)) {
        try {
          const sessionsJson = await AsyncStorage.getItem('sessions');
          const existingSessions = sessionsJson ? JSON.parse(sessionsJson) : [];
          const updatedSessions = [...existingSessions, ...data.sessions];
          await AsyncStorage.setItem('sessions', JSON.stringify(updatedSessions));

          summary.sessions = data.sessions.length;
          imported += data.sessions.length;
        } catch (error) {
          errors.push(`Sessions import failed: ${error}`);
          failed += data.sessions.length;
        }
      }

      // Import payments
      if (data.payments && Array.isArray(data.payments)) {
        try {
          const paymentsJson = await AsyncStorage.getItem('payments');
          const existingPayments = paymentsJson ? JSON.parse(paymentsJson) : [];
          const updatedPayments = [...existingPayments, ...data.payments];
          await AsyncStorage.setItem('payments', JSON.stringify(updatedPayments));

          summary.payments = data.payments.length;
          imported += data.payments.length;
        } catch (error) {
          errors.push(`Payments import failed: ${error}`);
          failed += data.payments.length;
        }
      }

      // Import trainers
      if (data.trainers && Array.isArray(data.trainers)) {
        try {
          const trainersJson = await AsyncStorage.getItem('trainers');
          const existingTrainers = trainersJson ? JSON.parse(trainersJson) : [];
          const updatedTrainers = [...existingTrainers, ...data.trainers];
          await AsyncStorage.setItem('trainers', JSON.stringify(updatedTrainers));

          summary.trainers = data.trainers.length;
          imported += data.trainers.length;
        } catch (error) {
          errors.push(`Trainers import failed: ${error}`);
          failed += data.trainers.length;
        }
      }

      // Import packages
      if (data.packages && Array.isArray(data.packages)) {
        try {
          const packagesJson = await AsyncStorage.getItem('packages');
          const existingPackages = packagesJson ? JSON.parse(packagesJson) : [];
          const updatedPackages = [...existingPackages, ...data.packages];
          await AsyncStorage.setItem('packages', JSON.stringify(updatedPackages));

          summary.packages = data.packages.length;
          imported += data.packages.length;
        } catch (error) {
          errors.push(`Packages import failed: ${error}`);
          failed += data.packages.length;
        }
      }

      return {
        success: imported > 0,
        imported,
        failed,
        errors,
        summary,
      };
    } catch (error) {
      return {
        success: false,
        imported: 0,
        failed: 0,
        errors: [`Import failed: ${error}`],
        summary: {},
      };
    }
  }

  /**
   * Gather data for export
   */
  private async gatherData(options: ExportOptions): Promise<any> {
    const data: any = {
      exportDate: new Date().toISOString(),
      version: '1.0.0',
      categories: options.categories,
    };

    // Get members
    if (options.categories.includes('all') || options.categories.includes('members')) {
      const membersJson = await AsyncStorage.getItem('members');
      data.members = membersJson ? JSON.parse(membersJson) : [];
    }

    // Get sessions
    if (options.categories.includes('all') || options.categories.includes('sessions')) {
      const sessionsJson = await AsyncStorage.getItem('sessions');
      data.sessions = sessionsJson ? JSON.parse(sessionsJson) : [];
    }

    // Get payments
    if (options.categories.includes('all') || options.categories.includes('payments')) {
      const paymentsJson = await AsyncStorage.getItem('payments');
      data.payments = paymentsJson ? JSON.parse(paymentsJson) : [];
    }

    // Get trainers
    if (options.categories.includes('all') || options.categories.includes('trainers')) {
      const trainersJson = await AsyncStorage.getItem('trainers');
      data.trainers = trainersJson ? JSON.parse(trainersJson) : [];
    }

    // Get packages
    if (options.categories.includes('all') || options.categories.includes('packages')) {
      const packagesJson = await AsyncStorage.getItem('packages');
      data.packages = packagesJson ? JSON.parse(packagesJson) : [];
    }

    return data;
  }

  /**
   * Format data based on export format
   */
  private formatData(data: any, format: ExportFormat): string {
    switch (format) {
      case 'json':
        return JSON.stringify(data, null, 2);

      case 'csv':
        return this.convertToCSV(data);

      case 'excel':
        // For now, return JSON (Excel export requires additional library)
        // In production, use library like 'xlsx' or 'exceljs'
        return JSON.stringify(data, null, 2);

      default:
        return JSON.stringify(data, null, 2);
    }
  }

  /**
   * Convert data to CSV format
   */
  private convertToCSV(data: any): string {
    let csv = '';

    // Export members
    if (data.members && data.members.length > 0) {
      csv += '=== MEMBERS ===\n';
      const headers = Object.keys(data.members[0]);
      csv += headers.join(',') + '\n';

      data.members.forEach((member: any) => {
        const values = headers.map((header) => {
          const value = member[header];
          return typeof value === 'string' && value.includes(',')
            ? `"${value}"`
            : value;
        });
        csv += values.join(',') + '\n';
      });
      csv += '\n';
    }

    // Export sessions
    if (data.sessions && data.sessions.length > 0) {
      csv += '=== SESSIONS ===\n';
      const headers = Object.keys(data.sessions[0]);
      csv += headers.join(',') + '\n';

      data.sessions.forEach((session: any) => {
        const values = headers.map((header) => {
          const value = session[header];
          return typeof value === 'string' && value.includes(',')
            ? `"${value}"`
            : value;
        });
        csv += values.join(',') + '\n';
      });
      csv += '\n';
    }

    // Add other categories similarly...

    return csv;
  }

  /**
   * Validate import data
   */
  private validateImportData(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check if data is an object
    if (typeof data !== 'object' || data === null) {
      errors.push('Invalid data format');
      return { valid: false, errors };
    }

    // Check required fields
    if (!data.exportDate) {
      errors.push('Missing export date');
    }

    if (!data.version) {
      errors.push('Missing version');
    }

    // Validate arrays
    if (data.members && !Array.isArray(data.members)) {
      errors.push('Members must be an array');
    }

    if (data.sessions && !Array.isArray(data.sessions)) {
      errors.push('Sessions must be an array');
    }

    if (data.payments && !Array.isArray(data.payments)) {
      errors.push('Payments must be an array');
    }

    if (data.trainers && !Array.isArray(data.trainers)) {
      errors.push('Trainers must be an array');
    }

    if (data.packages && !Array.isArray(data.packages)) {
      errors.push('Packages must be an array');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Generate filename for export
   */
  private generateFilename(options: ExportOptions): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const categories = options.categories.join('-');
    const extension = options.format === 'excel' ? 'xlsx' : options.format;

    return `pilates-export-${categories}-${timestamp}.${extension}`;
  }

  /**
   * Get MIME type for format
   */
  private getMimeType(format: ExportFormat): string {
    switch (format) {
      case 'json':
        return 'application/json';
      case 'csv':
        return 'text/csv';
      case 'excel':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      default:
        return 'text/plain';
    }
  }

  /**
   * Add export to history
   */
  private async addToHistory(exportInfo: ExportFileInfo): Promise<void> {
    try {
      const historyJson = await AsyncStorage.getItem(this.EXPORT_HISTORY_KEY);
      const history = historyJson ? JSON.parse(historyJson) : [];

      history.unshift(exportInfo);

      // Keep only last MAX_HISTORY items
      if (history.length > this.MAX_HISTORY) {
        history.splice(this.MAX_HISTORY);
      }

      await AsyncStorage.setItem(this.EXPORT_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error adding to export history:', error);
    }
  }

  /**
   * Get export history
   */
  async getExportHistory(): Promise<ExportFileInfo[]> {
    try {
      const historyJson = await AsyncStorage.getItem(this.EXPORT_HISTORY_KEY);
      if (historyJson) {
        return JSON.parse(historyJson).map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        }));
      }
    } catch (error) {
      console.error('Error getting export history:', error);
    }
    return [];
  }

  /**
   * Clear export history
   */
  async clearExportHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.EXPORT_HISTORY_KEY);
    } catch (error) {
      console.error('Error clearing export history:', error);
    }
  }

  /**
   * Delete export file
   */
  async deleteExportFile(path: string): Promise<boolean> {
    try {
      await FileSystem.deleteAsync(path, { idempotent: true });
      return true;
    } catch (error) {
      console.error('Error deleting export file:', error);
      return false;
    }
  }

  /**
   * Get export templates
   */
  getExportTemplates(): Array<{
    name: string;
    description: string;
    categories: ExportCategory[];
    format: ExportFormat;
  }> {
    return [
      {
        name: 'Full Backup',
        description: 'All data including members, sessions, payments, trainers, and packages',
        categories: ['all'],
        format: 'json',
      },
      {
        name: 'Members Only',
        description: 'Export only member data',
        categories: ['members'],
        format: 'csv',
      },
      {
        name: 'Financial Data',
        description: 'Export payments and packages',
        categories: ['payments', 'packages'],
        format: 'excel',
      },
      {
        name: 'Session History',
        description: 'Export all session data',
        categories: ['sessions'],
        format: 'csv',
      },
      {
        name: 'Staff Data',
        description: 'Export trainer information',
        categories: ['trainers'],
        format: 'json',
      },
    ];
  }
}

// Export singleton instance
export const exportImportService = new ExportImportService();
