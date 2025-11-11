/**
 * Notification Service - Push notification ve scheduled notification yönetimi
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Notification handler configuration
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  data?: any;
  trigger:
    | { seconds: number }
    | { hour: number; minute: number; repeats?: boolean }
    | { date: Date };
}

class NotificationService {
  private expoPushToken: string | null = null;
  private notificationListener: any = null;
  private responseListener: any = null;

  /**
   * Register for push notifications and get push token
   */
  async registerForPushNotifications(): Promise<string | null> {
    let token: string | null = null;

    // Check if it's a physical device
    if (!Device.isDevice) {
      console.log('Push notifications only work on physical devices');
      return null;
    }

    // Check existing permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // If not granted, request permission
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return null;
    }

    // Get push token
    try {
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: 'your-project-id', // TODO: Replace with actual project ID
        })
      ).data;
      this.expoPushToken = token;

      // Save token to AsyncStorage
      await AsyncStorage.setItem('expoPushToken', token);

      console.log('Push token:', token);
    } catch (error) {
      console.error('Error getting push token:', error);
    }

    // Set notification channel for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#B8FF3C',
      });

      await Notifications.setNotificationChannelAsync('reminders', {
        name: 'Hatırlatmalar',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#B8FF3C',
        sound: 'notification-sound.wav',
      });
    }

    return token;
  }

  /**
   * Get current push token
   */
  getPushToken(): string | null {
    return this.expoPushToken;
  }

  /**
   * Send a local notification immediately
   */
  async sendLocalNotification(
    title: string,
    body: string,
    data?: any
  ): Promise<string> {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: 'notification-sound.wav',
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null, // Send immediately
    });

    return notificationId;
  }

  /**
   * Schedule a notification for later
   */
  async scheduleNotification(
    notification: ScheduledNotification
  ): Promise<string> {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
        data: notification.data,
        sound: 'notification-sound.wav',
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: notification.trigger,
    });

    return notificationId;
  }

  /**
   * Cancel a scheduled notification
   */
  async cancelScheduledNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllScheduledNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  /**
   * Get all scheduled notifications
   */
  async getAllScheduledNotifications(): Promise<
    Notifications.NotificationRequest[]
  > {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  /**
   * Set up notification listeners
   */
  setupNotificationListeners(
    onNotificationReceived?: (notification: Notifications.Notification) => void,
    onNotificationResponse?: (
      response: Notifications.NotificationResponse
    ) => void
  ): void {
    // Listener for notifications received while app is foregrounded
    this.notificationListener =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log('Notification received:', notification);
        onNotificationReceived?.(notification);
      });

    // Listener for when user taps on notification
    this.responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log('Notification tapped:', response);
        onNotificationResponse?.(response);
      });
  }

  /**
   * Remove notification listeners
   */
  removeNotificationListeners(): void {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }

  /**
   * Set badge count (iOS)
   */
  async setBadgeCount(count: number): Promise<void> {
    if (Platform.OS === 'ios') {
      await Notifications.setBadgeCountAsync(count);
    }
  }

  /**
   * Get badge count (iOS)
   */
  async getBadgeCount(): Promise<number> {
    if (Platform.OS === 'ios') {
      return await Notifications.getBadgeCountAsync();
    }
    return 0;
  }

  /**
   * Clear badge (iOS)
   */
  async clearBadge(): Promise<void> {
    await this.setBadgeCount(0);
  }

  /**
   * Dismiss all notifications
   */
  async dismissAllNotifications(): Promise<void> {
    await Notifications.dismissAllNotificationsAsync();
  }

  /**
   * Schedule session reminder
   */
  async scheduleSessionReminder(
    sessionTitle: string,
    sessionDate: Date,
    minutesBefore: number = 60
  ): Promise<string> {
    const reminderDate = new Date(sessionDate);
    reminderDate.setMinutes(reminderDate.getMinutes() - minutesBefore);

    return await this.scheduleNotification({
      id: `session-${sessionDate.getTime()}`,
      title: 'Seans Hatırlatması',
      body: `${sessionTitle} seansınıza ${minutesBefore} dakika kaldı!`,
      data: {
        type: 'session_reminder',
        sessionDate: sessionDate.toISOString(),
      },
      trigger: { date: reminderDate },
    });
  }

  /**
   * Schedule payment reminder
   */
  async schedulePaymentReminder(
    memberName: string,
    amount: number,
    dueDate: Date
  ): Promise<string> {
    return await this.scheduleNotification({
      id: `payment-${dueDate.getTime()}`,
      title: 'Ödeme Hatırlatması',
      body: `${memberName} - ${amount}₺ ödeme tarihi yaklaşıyor`,
      data: {
        type: 'payment_reminder',
        memberName,
        amount,
        dueDate: dueDate.toISOString(),
      },
      trigger: { date: dueDate },
    });
  }

  /**
   * Schedule daily reminder at specific time
   */
  async scheduleDailyReminder(
    title: string,
    body: string,
    hour: number,
    minute: number
  ): Promise<string> {
    return await this.scheduleNotification({
      id: `daily-${hour}-${minute}`,
      title,
      body,
      data: {
        type: 'daily_reminder',
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });
  }

  /**
   * Check notification permissions
   */
  async checkPermissions(): Promise<Notifications.NotificationPermissionsStatus> {
    return await Notifications.getPermissionsAsync();
  }

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<Notifications.NotificationPermissionsStatus> {
    return await Notifications.requestPermissionsAsync();
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

// Helper functions for common use cases
export const scheduleSessionReminder = (
  sessionTitle: string,
  sessionDate: Date,
  minutesBefore: number = 60
) => {
  return notificationService.scheduleSessionReminder(
    sessionTitle,
    sessionDate,
    minutesBefore
  );
};

export const schedulePaymentReminder = (
  memberName: string,
  amount: number,
  dueDate: Date
) => {
  return notificationService.schedulePaymentReminder(
    memberName,
    amount,
    dueDate
  );
};

export const sendNotification = (title: string, body: string, data?: any) => {
  return notificationService.sendLocalNotification(title, body, data);
};
