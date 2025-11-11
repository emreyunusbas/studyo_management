/**
 * SMS Service - SMS gönderimi ve yönetimi
 *
 * Desteklenen SMS Providers:
 * - Twilio (Recommended)
 * - AWS SNS
 * - Vonage (formerly Nexmo)
 * - MessageBird
 * - Custom API
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// SMS Provider Types
export type SMSProvider = 'twilio' | 'aws-sns' | 'vonage' | 'messagebird' | 'custom';

// SMS Template Types
export type SMSTemplateType =
  | 'session_reminder'
  | 'payment_reminder'
  | 'membership_expiry'
  | 'welcome'
  | 'booking_confirmation'
  | 'cancellation_notice'
  | 'custom';

// SMS Configuration
export interface SMSConfig {
  provider: SMSProvider;
  accountSid?: string; // Twilio
  authToken?: string; // Twilio
  phoneNumber?: string; // Sender phone number
  apiKey?: string; // Generic API key
  apiSecret?: string; // Generic API secret
  region?: string; // AWS SNS region
}

// SMS Message
export interface SMSMessage {
  to: string; // Recipient phone number
  message: string;
  templateType?: SMSTemplateType;
  templateData?: Record<string, any>;
}

// SMS History Entry
export interface SMSHistoryEntry {
  id: string;
  to: string;
  message: string;
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  sentAt: Date;
  deliveredAt?: Date;
  errorMessage?: string;
  provider: SMSProvider;
  cost?: number;
}

// SMS Templates
const SMS_TEMPLATES: Record<SMSTemplateType, (data: any) => string> = {
  session_reminder: (data) =>
    `Merhaba ${data.memberName}! ${data.sessionTitle} seansınız ${data.timeRemaining} sonra başlayacak. Stüdyomuzda görüşmek üzere! - ${data.studioName}`,

  payment_reminder: (data) =>
    `Sayın ${data.memberName}, ${data.amount}₺ tutarındaki ödemenizin son günü ${data.dueDate}. Bilginize sunarız. - ${data.studioName}`,

  membership_expiry: (data) =>
    `Merhaba ${data.memberName}! Üyeliğiniz ${data.expiryDate} tarihinde sona erecek. Yenilemek için lütfen bizimle iletişime geçin. - ${data.studioName}`,

  welcome: (data) =>
    `Hoş geldiniz ${data.memberName}! ${data.studioName} ailesine katıldığınız için teşekkür ederiz. Sorularınız için: ${data.phoneNumber}`,

  booking_confirmation: (data) =>
    `Rezervasyonunuz onaylandı! ${data.sessionTitle} - ${data.date} ${data.time}. İptal için: ${data.phoneNumber} - ${data.studioName}`,

  cancellation_notice: (data) =>
    `${data.sessionTitle} seansınız ${data.date} tarihinde iptal edilmiştir. Detaylar için: ${data.phoneNumber} - ${data.studioName}`,

  custom: (data) => data.message,
};

class SMSService {
  private config: SMSConfig | null = null;
  private history: SMSHistoryEntry[] = [];
  private enabled: boolean = false;

  /**
   * Initialize SMS service with configuration
   */
  async initialize(config: SMSConfig): Promise<void> {
    this.config = config;
    this.enabled = true;

    // Save config to AsyncStorage
    await AsyncStorage.setItem('smsConfig', JSON.stringify(config));

    // Load history
    await this.loadHistory();

    console.log('SMS Service initialized with provider:', config.provider);
  }

  /**
   * Get current configuration
   */
  getConfig(): SMSConfig | null {
    return this.config;
  }

  /**
   * Check if SMS service is enabled
   */
  isEnabled(): boolean {
    return this.enabled && this.config !== null;
  }

  /**
   * Enable/disable SMS service
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Send SMS message
   */
  async sendSMS(message: SMSMessage): Promise<boolean> {
    if (!this.isEnabled()) {
      console.log('SMS Service is not enabled');
      return false;
    }

    try {
      // Generate message text from template if provided
      let messageText = message.message;
      if (message.templateType && message.templateData) {
        const template = SMS_TEMPLATES[message.templateType];
        messageText = template(message.templateData);
      }

      // Send based on provider
      const result = await this.sendWithProvider(message.to, messageText);

      // Add to history
      const historyEntry: SMSHistoryEntry = {
        id: Date.now().toString(),
        to: message.to,
        message: messageText,
        status: result ? 'sent' : 'failed',
        sentAt: new Date(),
        provider: this.config!.provider,
      };

      this.history.unshift(historyEntry);
      await this.saveHistory();

      return result;
    } catch (error) {
      console.error('Error sending SMS:', error);
      return false;
    }
  }

  /**
   * Send SMS with specific provider
   */
  private async sendWithProvider(to: string, message: string): Promise<boolean> {
    if (!this.config) return false;

    switch (this.config.provider) {
      case 'twilio':
        return await this.sendWithTwilio(to, message);

      case 'aws-sns':
        return await this.sendWithAWS(to, message);

      case 'vonage':
        return await this.sendWithVonage(to, message);

      case 'messagebird':
        return await this.sendWithMessageBird(to, message);

      case 'custom':
        return await this.sendWithCustomAPI(to, message);

      default:
        console.log('Unknown SMS provider');
        return false;
    }
  }

  /**
   * Send SMS with Twilio
   */
  private async sendWithTwilio(to: string, message: string): Promise<boolean> {
    // TODO: Implement Twilio API call
    // const accountSid = this.config?.accountSid;
    // const authToken = this.config?.authToken;
    // const from = this.config?.phoneNumber;

    // Example Twilio API call:
    /*
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: from!,
          To: to,
          Body: message,
        }),
      }
    );

    return response.ok;
    */

    console.log('[Twilio] Sending SMS to:', to, 'Message:', message);
    return true; // Mock success
  }

  /**
   * Send SMS with AWS SNS
   */
  private async sendWithAWS(to: string, message: string): Promise<boolean> {
    // TODO: Implement AWS SNS API call
    console.log('[AWS SNS] Sending SMS to:', to, 'Message:', message);
    return true; // Mock success
  }

  /**
   * Send SMS with Vonage
   */
  private async sendWithVonage(to: string, message: string): Promise<boolean> {
    // TODO: Implement Vonage API call
    console.log('[Vonage] Sending SMS to:', to, 'Message:', message);
    return true; // Mock success
  }

  /**
   * Send SMS with MessageBird
   */
  private async sendWithMessageBird(to: string, message: string): Promise<boolean> {
    // TODO: Implement MessageBird API call
    console.log('[MessageBird] Sending SMS to:', to, 'Message:', message);
    return true; // Mock success
  }

  /**
   * Send SMS with Custom API
   */
  private async sendWithCustomAPI(to: string, message: string): Promise<boolean> {
    // TODO: Implement custom API call
    console.log('[Custom API] Sending SMS to:', to, 'Message:', message);
    return true; // Mock success
  }

  /**
   * Send session reminder SMS
   */
  async sendSessionReminder(
    memberName: string,
    phoneNumber: string,
    sessionTitle: string,
    timeRemaining: string,
    studioName: string
  ): Promise<boolean> {
    return await this.sendSMS({
      to: phoneNumber,
      message: '',
      templateType: 'session_reminder',
      templateData: {
        memberName,
        sessionTitle,
        timeRemaining,
        studioName,
      },
    });
  }

  /**
   * Send payment reminder SMS
   */
  async sendPaymentReminder(
    memberName: string,
    phoneNumber: string,
    amount: number,
    dueDate: string,
    studioName: string
  ): Promise<boolean> {
    return await this.sendSMS({
      to: phoneNumber,
      message: '',
      templateType: 'payment_reminder',
      templateData: {
        memberName,
        amount,
        dueDate,
        studioName,
      },
    });
  }

  /**
   * Send welcome SMS
   */
  async sendWelcomeSMS(
    memberName: string,
    phoneNumber: string,
    studioName: string,
    contactPhone: string
  ): Promise<boolean> {
    return await this.sendSMS({
      to: phoneNumber,
      message: '',
      templateType: 'welcome',
      templateData: {
        memberName,
        studioName,
        phoneNumber: contactPhone,
      },
    });
  }

  /**
   * Send booking confirmation SMS
   */
  async sendBookingConfirmation(
    phoneNumber: string,
    sessionTitle: string,
    date: string,
    time: string,
    contactPhone: string,
    studioName: string
  ): Promise<boolean> {
    return await this.sendSMS({
      to: phoneNumber,
      message: '',
      templateType: 'booking_confirmation',
      templateData: {
        sessionTitle,
        date,
        time,
        phoneNumber: contactPhone,
        studioName,
      },
    });
  }

  /**
   * Get SMS history
   */
  getHistory(): SMSHistoryEntry[] {
    return this.history;
  }

  /**
   * Clear SMS history
   */
  async clearHistory(): Promise<void> {
    this.history = [];
    await AsyncStorage.removeItem('smsHistory');
  }

  /**
   * Save history to storage
   */
  private async saveHistory(): Promise<void> {
    try {
      // Keep only last 100 entries
      const historyToSave = this.history.slice(0, 100);
      await AsyncStorage.setItem('smsHistory', JSON.stringify(historyToSave));
    } catch (error) {
      console.error('Error saving SMS history:', error);
    }
  }

  /**
   * Load history from storage
   */
  private async loadHistory(): Promise<void> {
    try {
      const historyJson = await AsyncStorage.getItem('smsHistory');
      if (historyJson) {
        this.history = JSON.parse(historyJson);
      }
    } catch (error) {
      console.error('Error loading SMS history:', error);
    }
  }

  /**
   * Get SMS statistics
   */
  getStatistics(): {
    total: number;
    sent: number;
    delivered: number;
    failed: number;
    pending: number;
  } {
    return {
      total: this.history.length,
      sent: this.history.filter((h) => h.status === 'sent').length,
      delivered: this.history.filter((h) => h.status === 'delivered').length,
      failed: this.history.filter((h) => h.status === 'failed').length,
      pending: this.history.filter((h) => h.status === 'pending').length,
    };
  }

  /**
   * Validate phone number format
   */
  validatePhoneNumber(phoneNumber: string): boolean {
    // Basic validation for international format
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber.replace(/[\s-]/g, ''));
  }

  /**
   * Format phone number to E.164 format
   */
  formatPhoneNumber(phoneNumber: string, countryCode: string = '+90'): string {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Add country code if not present
    if (!phoneNumber.startsWith('+')) {
      return `${countryCode}${cleaned}`;
    }

    return `+${cleaned}`;
  }
}

// Export singleton instance
export const smsService = new SMSService();

// Helper functions
export const sendSMS = (message: SMSMessage) => smsService.sendSMS(message);

export const sendSessionReminderSMS = (
  memberName: string,
  phoneNumber: string,
  sessionTitle: string,
  timeRemaining: string,
  studioName: string
) =>
  smsService.sendSessionReminder(
    memberName,
    phoneNumber,
    sessionTitle,
    timeRemaining,
    studioName
  );

export const sendPaymentReminderSMS = (
  memberName: string,
  phoneNumber: string,
  amount: number,
  dueDate: string,
  studioName: string
) =>
  smsService.sendPaymentReminder(
    memberName,
    phoneNumber,
    amount,
    dueDate,
    studioName
  );
