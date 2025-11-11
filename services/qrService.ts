/**
 * QR Code Service - QR kod oluşturma ve check-in yönetimi
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// QR Code Data Types
export interface QRCodeData {
  type: 'member' | 'session' | 'payment' | 'custom';
  memberId?: string;
  sessionId?: string;
  timestamp: number;
  studioId?: string;
  data?: Record<string, any>;
}

// Check-in Record
export interface CheckInRecord {
  id: string;
  memberId: string;
  memberName: string;
  sessionId?: string;
  sessionTitle?: string;
  timestamp: Date;
  method: 'qr' | 'manual';
  location?: string;
}

class QRService {
  private checkInHistory: CheckInRecord[] = [];

  constructor() {
    this.loadHistory();
  }

  /**
   * Generate QR code data string for a member
   */
  generateMemberQRData(memberId: string, memberName: string): string {
    const qrData: QRCodeData = {
      type: 'member',
      memberId,
      timestamp: Date.now(),
      data: { memberName },
    };
    return JSON.stringify(qrData);
  }

  /**
   * Generate QR code data for a session
   */
  generateSessionQRData(sessionId: string, sessionTitle: string): string {
    const qrData: QRCodeData = {
      type: 'session',
      sessionId,
      timestamp: Date.now(),
      data: { sessionTitle },
    };
    return JSON.stringify(qrData);
  }

  /**
   * Parse scanned QR code data
   */
  parseQRData(qrString: string): QRCodeData | null {
    try {
      const data = JSON.parse(qrString);
      
      // Validate QR code structure
      if (!data.type || !data.timestamp) {
        return null;
      }

      // Check if QR code is expired (valid for 24 hours)
      const expiryTime = 24 * 60 * 60 * 1000; // 24 hours
      if (Date.now() - data.timestamp > expiryTime) {
        console.log('QR code expired');
        return null;
      }

      return data as QRCodeData;
    } catch (error) {
      console.error('Invalid QR code data:', error);
      return null;
    }
  }

  /**
   * Process check-in from QR code
   */
  async processCheckIn(
    qrData: QRCodeData,
    sessionId?: string,
    sessionTitle?: string
  ): Promise<CheckInRecord | null> {
    if (qrData.type !== 'member') {
      console.log('QR code is not for member check-in');
      return null;
    }

    if (!qrData.memberId || !qrData.data?.memberName) {
      console.log('Invalid member QR code');
      return null;
    }

    const checkIn: CheckInRecord = {
      id: Date.now().toString(),
      memberId: qrData.memberId,
      memberName: qrData.data.memberName,
      sessionId,
      sessionTitle,
      timestamp: new Date(),
      method: 'qr',
    };

    // Add to history
    this.checkInHistory.unshift(checkIn);
    await this.saveHistory();

    return checkIn;
  }

  /**
   * Manual check-in (without QR)
   */
  async manualCheckIn(
    memberId: string,
    memberName: string,
    sessionId?: string,
    sessionTitle?: string
  ): Promise<CheckInRecord> {
    const checkIn: CheckInRecord = {
      id: Date.now().toString(),
      memberId,
      memberName,
      sessionId,
      sessionTitle,
      timestamp: new Date(),
      method: 'manual',
    };

    this.checkInHistory.unshift(checkIn);
    await this.saveHistory();

    return checkIn;
  }

  /**
   * Get check-in history
   */
  getHistory(limit: number = 50): CheckInRecord[] {
    return this.checkInHistory.slice(0, limit);
  }

  /**
   * Get today's check-ins
   */
  getTodayCheckIns(): CheckInRecord[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.checkInHistory.filter((checkIn) => {
      const checkInDate = new Date(checkIn.timestamp);
      checkInDate.setHours(0, 0, 0, 0);
      return checkInDate.getTime() === today.getTime();
    });
  }

  /**
   * Get check-ins for a specific member
   */
  getMemberCheckIns(memberId: string): CheckInRecord[] {
    return this.checkInHistory.filter(
      (checkIn) => checkIn.memberId === memberId
    );
  }

  /**
   * Get check-ins for a specific session
   */
  getSessionCheckIns(sessionId: string): CheckInRecord[] {
    return this.checkInHistory.filter(
      (checkIn) => checkIn.sessionId === sessionId
    );
  }

  /**
   * Clear check-in history
   */
  async clearHistory(): Promise<void> {
    this.checkInHistory = [];
    await AsyncStorage.removeItem('checkInHistory');
  }

  /**
   * Save check-in history to storage
   */
  private async saveHistory(): Promise<void> {
    try {
      // Keep only last 200 entries
      const historyToSave = this.checkInHistory.slice(0, 200);
      await AsyncStorage.setItem('checkInHistory', JSON.stringify(historyToSave));
    } catch (error) {
      console.error('Error saving check-in history:', error);
    }
  }

  /**
   * Load check-in history from storage
   */
  private async loadHistory(): Promise<void> {
    try {
      const historyJson = await AsyncStorage.getItem('checkInHistory');
      if (historyJson) {
        this.checkInHistory = JSON.parse(historyJson);
      }
    } catch (error) {
      console.error('Error loading check-in history:', error);
    }
  }

  /**
   * Get check-in statistics
   */
  getStatistics(): {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    qrCheckIns: number;
    manualCheckIns: number;
  } {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      total: this.checkInHistory.length,
      today: this.checkInHistory.filter(
        (c) => new Date(c.timestamp) >= todayStart
      ).length,
      thisWeek: this.checkInHistory.filter(
        (c) => new Date(c.timestamp) >= weekStart
      ).length,
      thisMonth: this.checkInHistory.filter(
        (c) => new Date(c.timestamp) >= monthStart
      ).length,
      qrCheckIns: this.checkInHistory.filter((c) => c.method === 'qr').length,
      manualCheckIns: this.checkInHistory.filter((c) => c.method === 'manual')
        .length,
    };
  }
}

// Export singleton instance
export const qrService = new QRService();
