/**
 * Email Service - E-posta gönderimi ve yönetimi
 *
 * Desteklenen Email Providers:
 * - SendGrid
 * - AWS SES (Simple Email Service)
 * - Mailgun
 * - Postmark
 * - SMTP (NodeMailer)
 * - Custom API
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Email Provider Types
export type EmailProvider = 'sendgrid' | 'aws-ses' | 'mailgun' | 'postmark' | 'smtp' | 'custom';

// Email Template Types
export type EmailTemplateType =
  | 'welcome'
  | 'session_reminder'
  | 'payment_reminder'
  | 'payment_receipt'
  | 'membership_expiry'
  | 'monthly_report'
  | 'password_reset'
  | 'booking_confirmation'
  | 'cancellation_notice'
  | 'custom';

// Email Configuration
export interface EmailConfig {
  provider: EmailProvider;
  apiKey?: string;
  fromEmail: string;
  fromName: string;
  // SMTP specific
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
  smtpSecure?: boolean;
  // AWS SES specific
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
}

// Email Message
export interface EmailMessage {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  body: string;
  isHTML?: boolean;
  templateType?: EmailTemplateType;
  templateData?: Record<string, any>;
  attachments?: EmailAttachment[];
}

// Email Attachment
export interface EmailAttachment {
  filename: string;
  content: string; // Base64 encoded
  contentType: string;
}

// Email History Entry
export interface EmailHistoryEntry {
  id: string;
  to: string | string[];
  subject: string;
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  sentAt: Date;
  deliveredAt?: Date;
  errorMessage?: string;
  provider: EmailProvider;
}

// HTML Email Templates
const EMAIL_TEMPLATES: Record<EmailTemplateType, (data: any) => string> = {
  welcome: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #B8FF3C, #9FE01A); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: #0A0A0B; margin: 0; }
        .content { background: #f9f9f9; padding: 30px; }
        .footer { background: #0A0A0B; color: #B3B3B3; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #B8FF3C; color: #0A0A0B; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Hoş Geldiniz!</h1>
        </div>
        <div class="content">
          <h2>Merhaba ${data.memberName}!</h2>
          <p>${data.studioName} ailesine katıldığınız için teşekkür ederiz.</p>
          <p>Bizimle beraber sağlıklı bir yaşam yolculuğuna başlamaktan mutluluk duyuyoruz.</p>
          <a href="${data.loginUrl}" class="button">Hesabınıza Giriş Yapın</a>
          <p>Sorularınız için bize ulaşabilirsiniz:</p>
          <p>📧 ${data.email}<br>📞 ${data.phone}</p>
        </div>
        <div class="footer">
          <p>© 2025 ${data.studioName}. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  session_reminder: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3B82F6, #2563eb); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; }
        .session-info { background: white; padding: 20px; border-left: 4px solid #3B82F6; margin: 20px 0; }
        .footer { background: #0A0A0B; color: #B3B3B3; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🗓️ Seans Hatırlatması</h1>
        </div>
        <div class="content">
          <h2>Merhaba ${data.memberName}!</h2>
          <p>Seansınız yaklaşıyor:</p>
          <div class="session-info">
            <h3>${data.sessionTitle}</h3>
            <p><strong>Tarih:</strong> ${data.date}</p>
            <p><strong>Saat:</strong> ${data.time}</p>
            <p><strong>Eğitmen:</strong> ${data.trainer}</p>
            <p><strong>Lokasyon:</strong> ${data.location}</p>
          </div>
          <p>Görüşmek üzere!</p>
        </div>
        <div class="footer">
          <p>© 2025 ${data.studioName}</p>
        </div>
      </div>
    </body>
    </html>
  `,

  payment_reminder: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #F59E0B, #d97706); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; }
        .payment-info { background: white; padding: 20px; border-left: 4px solid #F59E0B; margin: 20px 0; }
        .footer { background: #0A0A0B; color: #B3B3B3; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💳 Ödeme Hatırlatması</h1>
        </div>
        <div class="content">
          <h2>Sayın ${data.memberName},</h2>
          <p>Aşağıdaki ödeme tarihi yaklaşmaktadır:</p>
          <div class="payment-info">
            <p><strong>Tutar:</strong> ${data.amount}₺</p>
            <p><strong>Son Ödeme Tarihi:</strong> ${data.dueDate}</p>
            <p><strong>Açıklama:</strong> ${data.description}</p>
          </div>
          <p>Ödemenizi zamanında yaparak hizmetlerimizden kesintisiz yararlanmaya devam edebilirsiniz.</p>
        </div>
        <div class="footer">
          <p>© 2025 ${data.studioName}</p>
        </div>
      </div>
    </body>
    </html>
  `,

  payment_receipt: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10B981, #059669); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; }
        .receipt { background: white; padding: 20px; border: 2px solid #10B981; margin: 20px 0; }
        .footer { background: #0A0A0B; color: #B3B3B3; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Ödeme Alındı</h1>
        </div>
        <div class="content">
          <h2>Sayın ${data.memberName},</h2>
          <p>Ödemeniz başarıyla alınmıştır.</p>
          <div class="receipt">
            <h3>Makbuz Detayları</h3>
            <p><strong>İşlem No:</strong> ${data.transactionId}</p>
            <p><strong>Tarih:</strong> ${data.date}</p>
            <p><strong>Tutar:</strong> ${data.amount}₺</p>
            <p><strong>Ödeme Yöntemi:</strong> ${data.paymentMethod}</p>
            <p><strong>Açıklama:</strong> ${data.description}</p>
          </div>
          <p>Teşekkür ederiz!</p>
        </div>
        <div class="footer">
          <p>© 2025 ${data.studioName}</p>
        </div>
      </div>
    </body>
    </html>
  `,

  membership_expiry: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #EF4444, #dc2626); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; }
        .warning { background: #FEF3C7; padding: 20px; border-left: 4px solid #F59E0B; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 30px; background: #EF4444; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        .footer { background: #0A0A0B; color: #B3B3B3; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚠️ Üyelik Sona Eriyor</h1>
        </div>
        <div class="content">
          <h2>Merhaba ${data.memberName}!</h2>
          <div class="warning">
            <p><strong>Üyeliğiniz ${data.expiryDate} tarihinde sona erecek.</strong></p>
          </div>
          <p>Kesintisiz hizmet alabilmek için lütfen üyeliğinizi yenileyin.</p>
          <a href="${data.renewUrl}" class="button">Üyeliği Yenile</a>
          <p>Yardım için bize ulaşın: ${data.phone}</p>
        </div>
        <div class="footer">
          <p>© 2025 ${data.studioName}</p>
        </div>
      </div>
    </body>
    </html>
  `,

  monthly_report: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #EC4899, #db2777); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; }
        .stats { display: flex; flex-wrap: wrap; gap: 15px; margin: 20px 0; }
        .stat-card { background: white; padding: 15px; border-radius: 8px; flex: 1; min-width: 120px; text-align: center; }
        .stat-value { font-size: 24px; font-weight: bold; color: #EC4899; }
        .stat-label { font-size: 12px; color: #666; }
        .footer { background: #0A0A0B; color: #B3B3B3; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📊 Aylık Rapor</h1>
          <p>${data.month} ${data.year}</p>
        </div>
        <div class="content">
          <h2>Merhaba ${data.memberName}!</h2>
          <p>Bu ay ki performansınız:</p>
          <div class="stats">
            <div class="stat-card">
              <div class="stat-value">${data.sessionsAttended}</div>
              <div class="stat-label">Katılılan Seans</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${data.attendanceRate}%</div>
              <div class="stat-label">Katılım Oranı</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${data.creditsUsed}</div>
              <div class="stat-label">Kullanılan Kredi</div>
            </div>
          </div>
          <p>Harika bir performans! Böyle devam edin! 💪</p>
        </div>
        <div class="footer">
          <p>© 2025 ${data.studioName}</p>
        </div>
      </div>
    </body>
    </html>
  `,

  password_reset: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0A0A0B, #1A1A1D); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; }
        .code { background: white; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; color: #B8FF3C; letter-spacing: 5px; margin: 20px 0; border: 2px dashed #B8FF3C; }
        .button { display: inline-block; padding: 12px 30px; background: #B8FF3C; color: #0A0A0B; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        .footer { background: #0A0A0B; color: #B3B3B3; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔒 Şifre Sıfırlama</h1>
        </div>
        <div class="content">
          <h2>Merhaba ${data.memberName}!</h2>
          <p>Şifre sıfırlama isteğinizi aldık. Aşağıdaki kodu kullanarak şifrenizi sıfırlayabilirsiniz:</p>
          <div class="code">${data.resetCode}</div>
          <p>Veya butona tıklayarak doğrudan sıfırlayabilirsiniz:</p>
          <a href="${data.resetUrl}" class="button">Şifreyi Sıfırla</a>
          <p><small>Bu kod 15 dakika süreyle geçerlidir.</small></p>
          <p><small>Bu isteği siz yapmadıysanız, lütfen bu e-postayı dikkate almayın.</small></p>
        </div>
        <div class="footer">
          <p>© 2025 ${data.studioName}</p>
        </div>
      </div>
    </body>
    </html>
  `,

  booking_confirmation: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10B981, #059669); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; }
        .booking { background: white; padding: 20px; border-left: 4px solid #10B981; margin: 20px 0; }
        .footer { background: #0A0A0B; color: #B3B3B3; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Rezervasyon Onaylandı</h1>
        </div>
        <div class="content">
          <h2>Merhaba ${data.memberName}!</h2>
          <p>Rezervasyonunuz başarıyla oluşturuldu:</p>
          <div class="booking">
            <h3>${data.sessionTitle}</h3>
            <p><strong>Tarih:</strong> ${data.date}</p>
            <p><strong>Saat:</strong> ${data.time}</p>
            <p><strong>Eğitmen:</strong> ${data.trainer}</p>
            <p><strong>Rezervasyon No:</strong> ${data.bookingId}</p>
          </div>
          <p>İptal etmeniz gerekirse lütfen en az 24 saat önceden bildirin.</p>
        </div>
        <div class="footer">
          <p>© 2025 ${data.studioName}</p>
        </div>
      </div>
    </body>
    </html>
  `,

  cancellation_notice: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #EF4444, #dc2626); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; }
        .notice { background: #FEE2E2; padding: 20px; border-left: 4px solid #EF4444; margin: 20px 0; }
        .footer { background: #0A0A0B; color: #B3B3B3; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>❌ Rezervasyon İptal Edildi</h1>
        </div>
        <div class="content">
          <h2>Merhaba ${data.memberName}!</h2>
          <div class="notice">
            <p>Aşağıdaki rezervasyonunuz iptal edilmiştir:</p>
            <p><strong>${data.sessionTitle}</strong></p>
            <p>${data.date} - ${data.time}</p>
            <p><small>İptal Nedeni: ${data.reason}</small></p>
          </div>
          <p>Yeni rezervasyon oluşturmak için lütfen bizimle iletişime geçin.</p>
        </div>
        <div class="footer">
          <p>© 2025 ${data.studioName}</p>
        </div>
      </div>
    </body>
    </html>
  `,

  custom: (data) => data.htmlBody || `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          ${data.message}
        </div>
      </div>
    </body>
    </html>
  `,
};

class EmailService {
  private config: EmailConfig | null = null;
  private history: EmailHistoryEntry[] = [];
  private enabled: boolean = false;

  /**
   * Initialize email service with configuration
   */
  async initialize(config: EmailConfig): Promise<void> {
    this.config = config;
    this.enabled = true;

    // Save config to AsyncStorage
    await AsyncStorage.setItem('emailConfig', JSON.stringify(config));

    // Load history
    await this.loadHistory();

    console.log('Email Service initialized with provider:', config.provider);
  }

  /**
   * Get current configuration
   */
  getConfig(): EmailConfig | null {
    return this.config;
  }

  /**
   * Check if email service is enabled
   */
  isEnabled(): boolean {
    return this.enabled && this.config !== null;
  }

  /**
   * Enable/disable email service
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Send email
   */
  async sendEmail(message: EmailMessage): Promise<boolean> {
    if (!this.isEnabled()) {
      console.log('Email Service is not enabled');
      return false;
    }

    try {
      // Generate HTML body from template if provided
      let emailBody = message.body;
      if (message.templateType && message.templateData) {
        const template = EMAIL_TEMPLATES[message.templateType];
        emailBody = template(message.templateData);
      }

      // Send based on provider
      const result = await this.sendWithProvider(message, emailBody);

      // Add to history
      const historyEntry: EmailHistoryEntry = {
        id: Date.now().toString(),
        to: message.to,
        subject: message.subject,
        status: result ? 'sent' : 'failed',
        sentAt: new Date(),
        provider: this.config!.provider,
      };

      this.history.unshift(historyEntry);
      await this.saveHistory();

      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  /**
   * Send email with specific provider
   */
  private async sendWithProvider(
    message: EmailMessage,
    htmlBody: string
  ): Promise<boolean> {
    if (!this.config) return false;

    const emailData = {
      to: Array.isArray(message.to) ? message.to : [message.to],
      cc: message.cc ? (Array.isArray(message.cc) ? message.cc : [message.cc]) : [],
      bcc: message.bcc ? (Array.isArray(message.bcc) ? message.bcc : [message.bcc]) : [],
      subject: message.subject,
      body: message.isHTML !== false ? htmlBody : message.body,
      attachments: message.attachments || [],
    };

    switch (this.config.provider) {
      case 'sendgrid':
        return await this.sendWithSendGrid(emailData);

      case 'aws-ses':
        return await this.sendWithAWSSES(emailData);

      case 'mailgun':
        return await this.sendWithMailgun(emailData);

      case 'postmark':
        return await this.sendWithPostmark(emailData);

      case 'smtp':
        return await this.sendWithSMTP(emailData);

      case 'custom':
        return await this.sendWithCustomAPI(emailData);

      default:
        console.log('Unknown email provider');
        return false;
    }
  }

  /**
   * Send email with SendGrid
   */
  private async sendWithSendGrid(emailData: any): Promise<boolean> {
    // TODO: Implement SendGrid API call
    console.log('[SendGrid] Sending email:', emailData.subject);
    return true; // Mock success
  }

  /**
   * Send email with AWS SES
   */
  private async sendWithAWSSES(emailData: any): Promise<boolean> {
    // TODO: Implement AWS SES API call
    console.log('[AWS SES] Sending email:', emailData.subject);
    return true; // Mock success
  }

  /**
   * Send email with Mailgun
   */
  private async sendWithMailgun(emailData: any): Promise<boolean> {
    // TODO: Implement Mailgun API call
    console.log('[Mailgun] Sending email:', emailData.subject);
    return true; // Mock success
  }

  /**
   * Send email with Postmark
   */
  private async sendWithPostmark(emailData: any): Promise<boolean> {
    // TODO: Implement Postmark API call
    console.log('[Postmark] Sending email:', emailData.subject);
    return true; // Mock success
  }

  /**
   * Send email with SMTP
   */
  private async sendWithSMTP(emailData: any): Promise<boolean> {
    // TODO: Implement SMTP (NodeMailer) sending
    console.log('[SMTP] Sending email:', emailData.subject);
    return true; // Mock success
  }

  /**
   * Send email with Custom API
   */
  private async sendWithCustomAPI(emailData: any): Promise<boolean> {
    // TODO: Implement custom API call
    console.log('[Custom API] Sending email:', emailData.subject);
    return true; // Mock success
  }

  /**
   * Get email history
   */
  getHistory(): EmailHistoryEntry[] {
    return this.history;
  }

  /**
   * Clear email history
   */
  async clearHistory(): Promise<void> {
    this.history = [];
    await AsyncStorage.removeItem('emailHistory');
  }

  /**
   * Save history to storage
   */
  private async saveHistory(): Promise<void> {
    try {
      // Keep only last 100 entries
      const historyToSave = this.history.slice(0, 100);
      await AsyncStorage.setItem('emailHistory', JSON.stringify(historyToSave));
    } catch (error) {
      console.error('Error saving email history:', error);
    }
  }

  /**
   * Load history from storage
   */
  private async loadHistory(): Promise<void> {
    try {
      const historyJson = await AsyncStorage.getItem('emailHistory');
      if (historyJson) {
        this.history = JSON.parse(historyJson);
      }
    } catch (error) {
      console.error('Error loading email history:', error);
    }
  }

  /**
   * Get email statistics
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
   * Validate email address
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Export singleton instance
export const emailService = new EmailService();

// Helper functions
export const sendEmail = (message: EmailMessage) => emailService.sendEmail(message);
