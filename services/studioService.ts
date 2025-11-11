/**
 * Studio Service - Çoklu stüdyo yönetimi
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Studio Location Data
export interface StudioLocation {
  address: string;
  city: string;
  district: string;
  postalCode?: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Studio Contact Info
export interface StudioContact {
  phone: string;
  email: string;
  website?: string;
  instagram?: string;
  facebook?: string;
}

// Studio Operating Hours
export interface OperatingHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

// Studio Amenities
export type StudioAmenity =
  | 'parking'
  | 'locker_room'
  | 'shower'
  | 'wifi'
  | 'air_conditioning'
  | 'reformer'
  | 'mat'
  | 'props'
  | 'water'
  | 'towels';

// Studio Data
export interface Studio {
  id: string;
  name: string;
  description: string;
  logo?: string;
  location: StudioLocation;
  contact: StudioContact;
  operatingHours: OperatingHours[];
  amenities: StudioAmenity[];
  capacity: number;
  instructorCount: number;
  memberCount: number;
  rating: number;
  isActive: boolean;
  isPrimary: boolean;
  createdAt: Date;
}

// Studio Statistics
export interface StudioStatistics {
  studioId: string;
  totalMembers: number;
  activeMembers: number;
  totalInstructors: number;
  totalSessions: number;
  completedSessions: number;
  totalRevenue: number;
  monthlyRevenue: number;
  averageRating: number;
  capacity: number;
  utilizationRate: number;
}

class StudioService {
  private studios: Studio[] = [];
  private currentStudioId: string | null = null;
  private readonly STORAGE_KEY = 'studios';
  private readonly CURRENT_STUDIO_KEY = 'currentStudioId';

  constructor() {
    this.loadData();
  }

  /**
   * Load data from storage
   */
  private async loadData() {
    try {
      const studiosJson = await AsyncStorage.getItem(this.STORAGE_KEY);
      const currentStudioId = await AsyncStorage.getItem(this.CURRENT_STUDIO_KEY);

      if (studiosJson) {
        this.studios = JSON.parse(studiosJson).map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt),
        }));
      } else {
        // Load mock studio if no data exists
        this.studios = [this.getMockStudio()];
        await this.saveStudios();
      }

      if (currentStudioId) {
        this.currentStudioId = currentStudioId;
      } else if (this.studios.length > 0) {
        this.currentStudioId = this.studios[0].id;
        await this.setCurrentStudio(this.currentStudioId);
      }
    } catch (error) {
      console.error('Error loading studio data:', error);
    }
  }

  /**
   * Save studios to storage
   */
  private async saveStudios() {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.studios));
    } catch (error) {
      console.error('Error saving studios:', error);
    }
  }

  /**
   * Get all studios
   */
  getStudios(): Studio[] {
    return this.studios;
  }

  /**
   * Get active studios
   */
  getActiveStudios(): Studio[] {
    return this.studios.filter((s) => s.isActive);
  }

  /**
   * Get studio by ID
   */
  getStudio(id: string): Studio | undefined {
    return this.studios.find((s) => s.id === id);
  }

  /**
   * Get current studio
   */
  getCurrentStudio(): Studio | undefined {
    if (!this.currentStudioId) return undefined;
    return this.getStudio(this.currentStudioId);
  }

  /**
   * Get current studio ID
   */
  getCurrentStudioId(): string | null {
    return this.currentStudioId;
  }

  /**
   * Set current studio
   */
  async setCurrentStudio(studioId: string): Promise<boolean> {
    const studio = this.getStudio(studioId);
    if (!studio || !studio.isActive) return false;

    this.currentStudioId = studioId;
    await AsyncStorage.setItem(this.CURRENT_STUDIO_KEY, studioId);

    return true;
  }

  /**
   * Get primary studio
   */
  getPrimaryStudio(): Studio | undefined {
    return this.studios.find((s) => s.isPrimary);
  }

  /**
   * Add studio
   */
  async addStudio(studio: Omit<Studio, 'id' | 'createdAt'>): Promise<Studio> {
    const newStudio: Studio = {
      ...studio,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    // If this is the first studio or marked as primary, make it primary
    if (this.studios.length === 0 || studio.isPrimary) {
      // Remove primary flag from other studios
      this.studios.forEach((s) => (s.isPrimary = false));
      newStudio.isPrimary = true;
    }

    this.studios.unshift(newStudio);
    await this.saveStudios();

    // Set as current if it's the first studio
    if (this.studios.length === 1) {
      await this.setCurrentStudio(newStudio.id);
    }

    return newStudio;
  }

  /**
   * Update studio
   */
  async updateStudio(id: string, updates: Partial<Studio>): Promise<boolean> {
    const index = this.studios.findIndex((s) => s.id === id);
    if (index === -1) return false;

    // If setting as primary, remove primary from others
    if (updates.isPrimary) {
      this.studios.forEach((s) => (s.isPrimary = false));
    }

    this.studios[index] = { ...this.studios[index], ...updates };
    await this.saveStudios();

    return true;
  }

  /**
   * Delete studio
   */
  async deleteStudio(id: string): Promise<boolean> {
    const index = this.studios.findIndex((s) => s.id === id);
    if (index === -1) return false;

    // Can't delete the last studio
    if (this.studios.length === 1) {
      return false;
    }

    const deletedStudio = this.studios[index];
    this.studios.splice(index, 1);

    // If deleted studio was primary, make first studio primary
    if (deletedStudio.isPrimary && this.studios.length > 0) {
      this.studios[0].isPrimary = true;
    }

    // If deleted studio was current, switch to first studio
    if (this.currentStudioId === id && this.studios.length > 0) {
      await this.setCurrentStudio(this.studios[0].id);
    }

    await this.saveStudios();

    return true;
  }

  /**
   * Toggle studio active status
   */
  async toggleStudioActive(id: string): Promise<boolean> {
    const studio = this.getStudio(id);
    if (!studio) return false;

    // Can't deactivate the last active studio
    const activeStudios = this.getActiveStudios();
    if (studio.isActive && activeStudios.length === 1) {
      return false;
    }

    studio.isActive = !studio.isActive;

    // If deactivating current studio, switch to another active studio
    if (!studio.isActive && this.currentStudioId === id) {
      const otherActiveStudio = activeStudios.find((s) => s.id !== id);
      if (otherActiveStudio) {
        await this.setCurrentStudio(otherActiveStudio.id);
      }
    }

    await this.saveStudios();

    return true;
  }

  /**
   * Set primary studio
   */
  async setPrimaryStudio(id: string): Promise<boolean> {
    const studio = this.getStudio(id);
    if (!studio) return false;

    // Remove primary from all studios
    this.studios.forEach((s) => (s.isPrimary = false));

    // Set new primary
    studio.isPrimary = true;
    await this.saveStudios();

    return true;
  }

  /**
   * Search studios
   */
  searchStudios(query: string): Studio[] {
    const lowerQuery = query.toLowerCase();
    return this.studios.filter(
      (s) =>
        s.name.toLowerCase().includes(lowerQuery) ||
        s.description.toLowerCase().includes(lowerQuery) ||
        s.location.city.toLowerCase().includes(lowerQuery) ||
        s.location.district.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get studios by city
   */
  getStudiosByCity(city: string): Studio[] {
    return this.studios.filter((s) => s.location.city.toLowerCase() === city.toLowerCase());
  }

  /**
   * Get studio statistics (mock implementation)
   */
  getStudioStatistics(studioId: string): StudioStatistics | null {
    const studio = this.getStudio(studioId);
    if (!studio) return null;

    // In a real app, this would fetch from backend
    return {
      studioId,
      totalMembers: studio.memberCount,
      activeMembers: Math.floor(studio.memberCount * 0.8),
      totalInstructors: studio.instructorCount,
      totalSessions: 150,
      completedSessions: 120,
      totalRevenue: 125000,
      monthlyRevenue: 15000,
      averageRating: studio.rating,
      capacity: studio.capacity,
      utilizationRate: 0.75,
    };
  }

  /**
   * Get all statistics
   */
  getAllStatistics(): {
    totalStudios: number;
    activeStudios: number;
    totalMembers: number;
    totalInstructors: number;
    totalCapacity: number;
    averageRating: number;
  } {
    const activeStudios = this.getActiveStudios();

    return {
      totalStudios: this.studios.length,
      activeStudios: activeStudios.length,
      totalMembers: this.studios.reduce((sum, s) => sum + s.memberCount, 0),
      totalInstructors: this.studios.reduce((sum, s) => sum + s.instructorCount, 0),
      totalCapacity: this.studios.reduce((sum, s) => sum + s.capacity, 0),
      averageRating:
        this.studios.reduce((sum, s) => sum + s.rating, 0) / (this.studios.length || 1),
    };
  }

  /**
   * Get mock studio data
   */
  private getMockStudio(): Studio {
    return {
      id: '1',
      name: 'Neşeli Pilates Merkez',
      description: 'Ana stüdyomuz. Reformer ve mat pilates dersleri.',
      location: {
        address: 'Atatürk Caddesi No: 123',
        city: 'İstanbul',
        district: 'Kadıköy',
        postalCode: '34710',
        country: 'Türkiye',
        coordinates: {
          latitude: 40.9901,
          longitude: 29.0298,
        },
      },
      contact: {
        phone: '+90 216 555 1234',
        email: 'info@neselipilates.com',
        website: 'https://neselipilates.com',
        instagram: '@neselipilates',
        facebook: 'neselipilates',
      },
      operatingHours: [
        { day: 'Pazartesi', open: '08:00', close: '21:00', isClosed: false },
        { day: 'Salı', open: '08:00', close: '21:00', isClosed: false },
        { day: 'Çarşamba', open: '08:00', close: '21:00', isClosed: false },
        { day: 'Perşembe', open: '08:00', close: '21:00', isClosed: false },
        { day: 'Cuma', open: '08:00', close: '20:00', isClosed: false },
        { day: 'Cumartesi', open: '09:00', close: '18:00', isClosed: false },
        { day: 'Pazar', open: '09:00', close: '18:00', isClosed: true },
      ],
      amenities: [
        'parking',
        'locker_room',
        'shower',
        'wifi',
        'air_conditioning',
        'reformer',
        'mat',
        'props',
        'water',
        'towels',
      ],
      capacity: 50,
      instructorCount: 5,
      memberCount: 120,
      rating: 4.8,
      isActive: true,
      isPrimary: true,
      createdAt: new Date('2024-01-01'),
    };
  }
}

// Export singleton instance
export const studioService = new StudioService();
