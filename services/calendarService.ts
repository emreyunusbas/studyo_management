/**
 * Calendar Service - Takvim senkronizasyonu ve etkinlik yönetimi
 */

import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Calendar Event Data
export interface CalendarEventData {
  id?: string;
  title: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  notes?: string;
  alarms?: { relativeOffset: number }[]; // minutes before event
}

class CalendarService {
  private defaultCalendarId: string | null = null;
  private hasPermission: boolean = false;

  /**
   * Request calendar permissions
   */
  async requestPermissions(): Promise<boolean> {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    this.hasPermission = status === 'granted';
    return this.hasPermission;
  }

  /**
   * Check if calendar permission is granted
   */
  async checkPermissions(): Promise<boolean> {
    const { status } = await Calendar.getCalendarPermissionsAsync();
    this.hasPermission = status === 'granted';
    return this.hasPermission;
  }

  /**
   * Get or create default calendar for the app
   */
  async getDefaultCalendar(): Promise<string | null> {
    if (!this.hasPermission) {
      await this.requestPermissions();
    }

    if (!this.hasPermission) {
      console.log('Calendar permission not granted');
      return null;
    }

    // Check if we have a saved calendar ID
    const savedCalendarId = await AsyncStorage.getItem('defaultCalendarId');
    if (savedCalendarId) {
      try {
        const calendar = await Calendar.getCalendarAsync(savedCalendarId);
        if (calendar) {
          this.defaultCalendarId = savedCalendarId;
          return savedCalendarId;
        }
      } catch (error) {
        console.log('Saved calendar not found, creating new one');
      }
    }

    // Get all calendars
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);

    // Find or create "Pilates Studio" calendar
    let pilatesCalendar = calendars.find(
      (cal) => cal.title === 'Pilates Studio' && cal.allowsModifications
    );

    if (!pilatesCalendar) {
      // Create new calendar
      const defaultCalendarSource =
        Platform.OS === 'ios'
          ? await this.getDefaultCalendarSource()
          : { isLocalAccount: true, name: 'Pilates Studio', type: Calendar.SourceType.LOCAL };

      if (defaultCalendarSource) {
        const newCalendarId = await Calendar.createCalendarAsync({
          title: 'Pilates Studio',
          color: '#B8FF3C',
          entityType: Calendar.EntityTypes.EVENT,
          sourceId: defaultCalendarSource.id,
          source: defaultCalendarSource,
          name: 'Pilates Studio',
          ownerAccount: 'personal',
          accessLevel: Calendar.CalendarAccessLevel.OWNER,
        });

        this.defaultCalendarId = newCalendarId;
        await AsyncStorage.setItem('defaultCalendarId', newCalendarId);
        return newCalendarId;
      }
    } else {
      this.defaultCalendarId = pilatesCalendar.id;
      await AsyncStorage.setItem('defaultCalendarId', pilatesCalendar.id);
      return pilatesCalendar.id;
    }

    // Fallback to first writable calendar
    const writableCalendar = calendars.find((cal) => cal.allowsModifications);
    if (writableCalendar) {
      this.defaultCalendarId = writableCalendar.id;
      await AsyncStorage.setItem('defaultCalendarId', writableCalendar.id);
      return writableCalendar.id;
    }

    return null;
  }

  /**
   * Get default calendar source (iOS only)
   */
  private async getDefaultCalendarSource() {
    if (Platform.OS !== 'ios') return null;

    const sources = await Calendar.getSourcesAsync();
    return sources.find(
      (source) => source.type === Calendar.SourceType.CALDAV && source.name === 'iCloud'
    ) || sources.find((source) => source.type === Calendar.SourceType.LOCAL);
  }

  /**
   * Add event to calendar
   */
  async addEvent(eventData: CalendarEventData): Promise<string | null> {
    const calendarId = await this.getDefaultCalendar();
    if (!calendarId) {
      console.log('No calendar available');
      return null;
    }

    try {
      const eventId = await Calendar.createEventAsync(calendarId, {
        title: eventData.title,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        location: eventData.location,
        notes: eventData.notes,
        alarms: eventData.alarms || [{ relativeOffset: -60 }], // 1 hour before
        timeZone: 'Europe/Istanbul',
      });

      // Save event ID mapping
      await this.saveEventMapping(eventData.id || '', eventId);

      return eventId;
    } catch (error) {
      console.error('Error adding event to calendar:', error);
      return null;
    }
  }

  /**
   * Update calendar event
   */
  async updateEvent(eventId: string, eventData: CalendarEventData): Promise<boolean> {
    if (!this.hasPermission) {
      console.log('Calendar permission not granted');
      return false;
    }

    try {
      await Calendar.updateEventAsync(eventId, {
        title: eventData.title,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        location: eventData.location,
        notes: eventData.notes,
        alarms: eventData.alarms,
      });

      return true;
    } catch (error) {
      console.error('Error updating calendar event:', error);
      return false;
    }
  }

  /**
   * Delete calendar event
   */
  async deleteEvent(eventId: string): Promise<boolean> {
    if (!this.hasPermission) {
      console.log('Calendar permission not granted');
      return false;
    }

    try {
      await Calendar.deleteEventAsync(eventId);
      return true;
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      return false;
    }
  }

  /**
   * Add session to calendar
   */
  async addSessionToCalendar(
    sessionId: string,
    sessionTitle: string,
    startDate: Date,
    endDate: Date,
    location?: string,
    trainer?: string
  ): Promise<string | null> {
    const notes = trainer ? `Eğitmen: ${trainer}` : undefined;

    return await this.addEvent({
      id: sessionId,
      title: `Pilates: ${sessionTitle}`,
      startDate,
      endDate,
      location,
      notes,
      alarms: [
        { relativeOffset: -60 }, // 1 hour before
        { relativeOffset: -15 }, // 15 minutes before
      ],
    });
  }

  /**
   * Get events in date range
   */
  async getEvents(startDate: Date, endDate: Date): Promise<Calendar.Event[]> {
    const calendarId = await this.getDefaultCalendar();
    if (!calendarId) return [];

    try {
      const events = await Calendar.getEventsAsync([calendarId], startDate, endDate);
      return events;
    } catch (error) {
      console.error('Error getting events:', error);
      return [];
    }
  }

  /**
   * Save event ID mapping (session ID -> calendar event ID)
   */
  private async saveEventMapping(sessionId: string, calendarEventId: string): Promise<void> {
    try {
      const mappingsJson = await AsyncStorage.getItem('calendarEventMappings');
      const mappings = mappingsJson ? JSON.parse(mappingsJson) : {};
      mappings[sessionId] = calendarEventId;
      await AsyncStorage.setItem('calendarEventMappings', JSON.stringify(mappings));
    } catch (error) {
      console.error('Error saving event mapping:', error);
    }
  }

  /**
   * Get calendar event ID for session
   */
  async getEventIdForSession(sessionId: string): Promise<string | null> {
    try {
      const mappingsJson = await AsyncStorage.getItem('calendarEventMappings');
      const mappings = mappingsJson ? JSON.parse(mappingsJson) : {};
      return mappings[sessionId] || null;
    } catch (error) {
      console.error('Error getting event mapping:', error);
      return null;
    }
  }

  /**
   * Remove session from calendar
   */
  async removeSessionFromCalendar(sessionId: string): Promise<boolean> {
    const calendarEventId = await this.getEventIdForSession(sessionId);
    if (!calendarEventId) {
      console.log('No calendar event found for session');
      return false;
    }

    return await this.deleteEvent(calendarEventId);
  }

  /**
   * Sync all upcoming sessions to calendar
   */
  async syncUpcomingSessions(
    sessions: Array<{
      id: string;
      title: string;
      date: Date;
      duration: number; // in minutes
      location?: string;
      trainer?: string;
    }>
  ): Promise<number> {
    let synced = 0;

    for (const session of sessions) {
      const endDate = new Date(session.date);
      endDate.setMinutes(endDate.getMinutes() + session.duration);

      const result = await this.addSessionToCalendar(
        session.id,
        session.title,
        session.date,
        endDate,
        session.location,
        session.trainer
      );

      if (result) {
        synced++;
      }
    }

    return synced;
  }

  /**
   * Get all calendars
   */
  async getAllCalendars(): Promise<Calendar.Calendar[]> {
    if (!this.hasPermission) {
      await this.requestPermissions();
    }

    if (!this.hasPermission) return [];

    try {
      return await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    } catch (error) {
      console.error('Error getting calendars:', error);
      return [];
    }
  }
}

// Export singleton instance
export const calendarService = new CalendarService();

// Helper functions
export const addSessionToCalendar = (
  sessionId: string,
  sessionTitle: string,
  startDate: Date,
  endDate: Date,
  location?: string,
  trainer?: string
) =>
  calendarService.addSessionToCalendar(
    sessionId,
    sessionTitle,
    startDate,
    endDate,
    location,
    trainer
  );

export const removeSessionFromCalendar = (sessionId: string) =>
  calendarService.removeSessionFromCalendar(sessionId);
