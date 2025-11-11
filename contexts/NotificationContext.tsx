/**
 * Notification Context - Push notification state yönetimi
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { notificationService } from '@/services/notificationService';
import { useApp } from './AppContext';

interface NotificationContextType {
  // Push token
  pushToken: string | null;

  // Permission status
  permissionGranted: boolean;

  // Functions
  requestPermissions: () => Promise<boolean>;
  registerForPushNotifications: () => Promise<void>;
  sendNotification: (title: string, body: string, data?: any) => Promise<void>;
  scheduleSessionReminder: (
    sessionTitle: string,
    sessionDate: Date,
    minutesBefore?: number
  ) => Promise<void>;
  schedulePaymentReminder: (
    memberName: string,
    amount: number,
    dueDate: Date
  ) => Promise<void>;
  getAllScheduledNotifications: () => Promise<
    Notifications.NotificationRequest[]
  >;
  cancelAllNotifications: () => Promise<void>;
  clearBadge: () => Promise<void>;

  // State
  scheduledNotificationsCount: number;
  badgeCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useApp();
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [scheduledNotificationsCount, setScheduledNotificationsCount] =
    useState(0);
  const [badgeCount, setBadgeCount] = useState(0);

  // Initialize notifications on mount
  useEffect(() => {
    checkPermissions();
    setupListeners();
    updateScheduledCount();

    return () => {
      notificationService.removeNotificationListeners();
    };
  }, []);

  // Check notification permissions
  const checkPermissions = async () => {
    const { status } = await notificationService.checkPermissions();
    setPermissionGranted(status === 'granted');
  };

  // Setup notification listeners
  const setupListeners = () => {
    notificationService.setupNotificationListeners(
      // On notification received
      (notification) => {
        console.log('Notification received in app:', notification);
      },
      // On notification tapped
      (response) => {
        console.log('Notification response:', response);
        handleNotificationResponse(response);
      }
    );
  };

  // Handle notification tap
  const handleNotificationResponse = (
    response: Notifications.NotificationResponse
  ) => {
    const data = response.notification.request.content.data;

    // Navigate based on notification type
    if (data?.type === 'session_reminder') {
      // TODO: Navigate to sessions screen
      console.log('Navigate to sessions');
    } else if (data?.type === 'payment_reminder') {
      // TODO: Navigate to payments screen
      console.log('Navigate to payments');
    }
  };

  // Update scheduled notifications count
  const updateScheduledCount = async () => {
    const notifications = await notificationService.getAllScheduledNotifications();
    setScheduledNotificationsCount(notifications.length);
  };

  // Request notification permissions
  const requestPermissions = async (): Promise<boolean> => {
    const { status } = await notificationService.requestPermissions();
    const granted = status === 'granted';
    setPermissionGranted(granted);
    return granted;
  };

  // Register for push notifications
  const registerForPushNotifications = async () => {
    const token = await notificationService.registerForPushNotifications();
    if (token) {
      setPushToken(token);

      // TODO: Send token to backend
      console.log('Push token to send to backend:', token);
    }
  };

  // Send local notification
  const sendNotification = async (title: string, body: string, data?: any) => {
    if (!permissionGranted) {
      const granted = await requestPermissions();
      if (!granted) {
        console.log('Permission not granted');
        return;
      }
    }

    await notificationService.sendLocalNotification(title, body, data);
  };

  // Schedule session reminder
  const scheduleSessionReminder = async (
    sessionTitle: string,
    sessionDate: Date,
    minutesBefore: number = 60
  ) => {
    if (!permissionGranted) {
      const granted = await requestPermissions();
      if (!granted) return;
    }

    await notificationService.scheduleSessionReminder(
      sessionTitle,
      sessionDate,
      minutesBefore
    );
    await updateScheduledCount();
  };

  // Schedule payment reminder
  const schedulePaymentReminder = async (
    memberName: string,
    amount: number,
    dueDate: Date
  ) => {
    if (!permissionGranted) {
      const granted = await requestPermissions();
      if (!granted) return;
    }

    await notificationService.schedulePaymentReminder(
      memberName,
      amount,
      dueDate
    );
    await updateScheduledCount();
  };

  // Get all scheduled notifications
  const getAllScheduledNotifications = async () => {
    return await notificationService.getAllScheduledNotifications();
  };

  // Cancel all notifications
  const cancelAllNotifications = async () => {
    await notificationService.cancelAllScheduledNotifications();
    await updateScheduledCount();
  };

  // Clear badge
  const clearBadge = async () => {
    await notificationService.clearBadge();
    setBadgeCount(0);
  };

  const value: NotificationContextType = {
    pushToken,
    permissionGranted,
    requestPermissions,
    registerForPushNotifications,
    sendNotification,
    scheduleSessionReminder,
    schedulePaymentReminder,
    getAllScheduledNotifications,
    cancelAllNotifications,
    clearBadge,
    scheduledNotificationsCount,
    badgeCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Hook to use notification context
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider'
    );
  }
  return context;
}
