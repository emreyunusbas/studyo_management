/**
 * Analytics Service - İleri seviye analiz ve raporlama
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Time Period Types
export type TimePeriod = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

// Chart Data Point
export interface DataPoint {
  label: string;
  value: number;
  date?: Date;
  percentage?: number;
}

// Trend Data
export interface TrendData {
  current: number;
  previous: number;
  change: number;
  changePercentage: number;
  trend: 'up' | 'down' | 'stable';
}

// Member Analytics
export interface MemberAnalytics {
  totalMembers: number;
  activeMembers: number;
  newMembers: number;
  churnedMembers: number;
  retentionRate: number;
  growthRate: number;
  averageLifetime: number; // in months
  membershipDistribution: DataPoint[];
  ageDistribution: DataPoint[];
  genderDistribution: DataPoint[];
  memberTrend: TrendData;
}

// Session Analytics
export interface SessionAnalytics {
  totalSessions: number;
  completedSessions: number;
  cancelledSessions: number;
  completionRate: number;
  averageAttendance: number;
  peakHours: DataPoint[];
  popularDays: DataPoint[];
  sessionTypeDistribution: DataPoint[];
  sessionTrend: TrendData;
}

// Revenue Analytics
export interface RevenueAnalytics {
  totalRevenue: number;
  recurringRevenue: number;
  oneTimeRevenue: number;
  averageRevenuePerMember: number;
  revenueByPaymentMethod: DataPoint[];
  revenueByPackage: DataPoint[];
  monthlyRevenueTrend: DataPoint[];
  revenueForecast: DataPoint[];
  revenueTrend: TrendData;
}

// Instructor Analytics
export interface InstructorAnalytics {
  totalInstructors: number;
  activeInstructors: number;
  averageRating: number;
  totalSessionsDelivered: number;
  instructorPerformance: Array<{
    id: string;
    name: string;
    sessionsCount: number;
    rating: number;
    memberSatisfaction: number;
  }>;
  instructorUtilization: DataPoint[];
}

// Attendance Analytics
export interface AttendanceAnalytics {
  averageAttendanceRate: number;
  peakAttendanceDays: DataPoint[];
  attendanceTrend: DataPoint[];
  noShowRate: number;
  lateArrivalRate: number;
  capacityUtilization: number;
}

// Predictive Analytics
export interface PredictiveAnalytics {
  churnPrediction: {
    atRiskMembers: number;
    churnProbability: number;
    predictedChurnNext30Days: number;
  };
  revenueForecast: {
    next30Days: number;
    next90Days: number;
    confidence: number;
  };
  growthProjection: {
    projectedMembers: number;
    growthRate: number;
    timeframe: string;
  };
}

// Comprehensive Dashboard Data
export interface DashboardAnalytics {
  period: TimePeriod;
  startDate: Date;
  endDate: Date;
  members: MemberAnalytics;
  sessions: SessionAnalytics;
  revenue: RevenueAnalytics;
  instructors: InstructorAnalytics;
  attendance: AttendanceAnalytics;
  predictive: PredictiveAnalytics;
  kpis: {
    memberRetention: number;
    revenueGrowth: number;
    sessionUtilization: number;
    instructorEfficiency: number;
    memberSatisfaction: number;
  };
}

class AnalyticsService {
  private readonly STORAGE_KEY = 'analyticsCache';

  /**
   * Calculate trend data
   */
  private calculateTrend(current: number, previous: number): TrendData {
    const change = current - previous;
    const changePercentage = previous > 0 ? (change / previous) * 100 : 0;
    const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'stable';

    return {
      current,
      previous,
      change,
      changePercentage,
      trend,
    };
  }

  /**
   * Get member analytics
   */
  getMemberAnalytics(period: TimePeriod = 'month'): MemberAnalytics {
    // In real app, this would fetch from backend
    // Using mock data for demonstration
    const totalMembers = 245;
    const activeMembers = 198;
    const newMembers = 28;
    const churnedMembers = 5;
    const previousTotal = 222;

    return {
      totalMembers,
      activeMembers,
      newMembers,
      churnedMembers,
      retentionRate: ((activeMembers / totalMembers) * 100),
      growthRate: ((newMembers - churnedMembers) / previousTotal) * 100,
      averageLifetime: 14.5,
      membershipDistribution: [
        { label: 'Birebir', value: 89, percentage: 36.3 },
        { label: 'Grup', value: 112, percentage: 45.7 },
        { label: 'Düet', value: 44, percentage: 18.0 },
      ],
      ageDistribution: [
        { label: '18-25', value: 45, percentage: 18.4 },
        { label: '26-35', value: 98, percentage: 40.0 },
        { label: '36-45', value: 67, percentage: 27.3 },
        { label: '46+', value: 35, percentage: 14.3 },
      ],
      genderDistribution: [
        { label: 'Kadın', value: 186, percentage: 75.9 },
        { label: 'Erkek', value: 59, percentage: 24.1 },
      ],
      memberTrend: this.calculateTrend(totalMembers, previousTotal),
    };
  }

  /**
   * Get session analytics
   */
  getSessionAnalytics(period: TimePeriod = 'month'): SessionAnalytics {
    const totalSessions = 486;
    const completedSessions = 438;
    const cancelledSessions = 48;
    const previousTotal = 452;

    return {
      totalSessions,
      completedSessions,
      cancelledSessions,
      completionRate: (completedSessions / totalSessions) * 100,
      averageAttendance: 8.5,
      peakHours: [
        { label: '09:00', value: 42 },
        { label: '12:00', value: 38 },
        { label: '18:00', value: 65 },
        { label: '19:00', value: 58 },
      ],
      popularDays: [
        { label: 'Pzt', value: 78 },
        { label: 'Sal', value: 82 },
        { label: 'Çar', value: 88 },
        { label: 'Per', value: 76 },
        { label: 'Cum', value: 72 },
        { label: 'Cmt', value: 52 },
        { label: 'Paz', value: 38 },
      ],
      sessionTypeDistribution: [
        { label: 'Mat Pilates', value: 198, percentage: 40.7 },
        { label: 'Reformer', value: 156, percentage: 32.1 },
        { label: 'Düet', value: 87, percentage: 17.9 },
        { label: 'Özel', value: 45, percentage: 9.3 },
      ],
      sessionTrend: this.calculateTrend(totalSessions, previousTotal),
    };
  }

  /**
   * Get revenue analytics
   */
  getRevenueAnalytics(period: TimePeriod = 'month'): RevenueAnalytics {
    const totalRevenue = 185500;
    const previousRevenue = 168200;

    return {
      totalRevenue,
      recurringRevenue: 142300,
      oneTimeRevenue: 43200,
      averageRevenuePerMember: 757,
      revenueByPaymentMethod: [
        { label: 'Kredi Kartı', value: 112500, percentage: 60.6 },
        { label: 'Nakit', value: 48200, percentage: 26.0 },
        { label: 'Havale', value: 24800, percentage: 13.4 },
      ],
      revenueByPackage: [
        { label: 'Aylık Üyelik', value: 95600, percentage: 51.5 },
        { label: '3 Aylık Paket', value: 52800, percentage: 28.5 },
        { label: '12 Seans Paketi', value: 24700, percentage: 13.3 },
        { label: 'Birebir Seans', value: 12400, percentage: 6.7 },
      ],
      monthlyRevenueTrend: this.generateMonthlyTrend(),
      revenueForecast: this.generateRevenueForecast(),
      revenueTrend: this.calculateTrend(totalRevenue, previousRevenue),
    };
  }

  /**
   * Get instructor analytics
   */
  getInstructorAnalytics(): InstructorAnalytics {
    return {
      totalInstructors: 8,
      activeInstructors: 7,
      averageRating: 4.7,
      totalSessionsDelivered: 486,
      instructorPerformance: [
        { id: '1', name: 'Ayşe Yılmaz', sessionsCount: 112, rating: 4.9, memberSatisfaction: 96 },
        { id: '2', name: 'Mehmet Kaya', sessionsCount: 98, rating: 4.8, memberSatisfaction: 94 },
        { id: '3', name: 'Zeynep Demir', sessionsCount: 87, rating: 4.6, memberSatisfaction: 92 },
        { id: '4', name: 'Ahmet Şahin', sessionsCount: 76, rating: 4.5, memberSatisfaction: 89 },
        { id: '5', name: 'Fatma Özkan', sessionsCount: 65, rating: 4.7, memberSatisfaction: 93 },
      ],
      instructorUtilization: [
        { label: 'Ayşe Y.', value: 94, percentage: 94 },
        { label: 'Mehmet K.', value: 89, percentage: 89 },
        { label: 'Zeynep D.', value: 82, percentage: 82 },
        { label: 'Ahmet Ş.', value: 76, percentage: 76 },
        { label: 'Fatma Ö.', value: 68, percentage: 68 },
      ],
    };
  }

  /**
   * Get attendance analytics
   */
  getAttendanceAnalytics(): AttendanceAnalytics {
    return {
      averageAttendanceRate: 87.5,
      peakAttendanceDays: [
        { label: 'Çarşamba', value: 94, percentage: 94 },
        { label: 'Salı', value: 91, percentage: 91 },
        { label: 'Pazartesi', value: 88, percentage: 88 },
      ],
      attendanceTrend: this.generateAttendanceTrend(),
      noShowRate: 5.2,
      lateArrivalRate: 7.8,
      capacityUtilization: 78.5,
    };
  }

  /**
   * Get predictive analytics
   */
  getPredictiveAnalytics(): PredictiveAnalytics {
    return {
      churnPrediction: {
        atRiskMembers: 18,
        churnProbability: 7.3,
        predictedChurnNext30Days: 5,
      },
      revenueForecast: {
        next30Days: 192000,
        next90Days: 568000,
        confidence: 87.5,
      },
      growthProjection: {
        projectedMembers: 287,
        growthRate: 17.1,
        timeframe: '3 months',
      },
    };
  }

  /**
   * Get comprehensive dashboard analytics
   */
  getDashboardAnalytics(period: TimePeriod = 'month'): DashboardAnalytics {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return {
      period,
      startDate,
      endDate,
      members: this.getMemberAnalytics(period),
      sessions: this.getSessionAnalytics(period),
      revenue: this.getRevenueAnalytics(period),
      instructors: this.getInstructorAnalytics(),
      attendance: this.getAttendanceAnalytics(),
      predictive: this.getPredictiveAnalytics(),
      kpis: {
        memberRetention: 89.7,
        revenueGrowth: 10.3,
        sessionUtilization: 78.5,
        instructorEfficiency: 84.2,
        memberSatisfaction: 93.5,
      },
    };
  }

  /**
   * Generate monthly revenue trend
   */
  private generateMonthlyTrend(): DataPoint[] {
    const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
    const baseRevenue = 140000;

    return months.slice(0, 6).map((month, index) => ({
      label: month,
      value: baseRevenue + (index * 8000) + Math.random() * 5000,
    }));
  }

  /**
   * Generate revenue forecast
   */
  private generateRevenueForecast(): DataPoint[] {
    const months = ['Tem', 'Ağu', 'Eyl', 'Eki'];
    const baseRevenue = 188000;

    return months.map((month, index) => ({
      label: month,
      value: baseRevenue + (index * 9000),
    }));
  }

  /**
   * Generate attendance trend
   */
  private generateAttendanceTrend(): DataPoint[] {
    const weeks = ['Hafta 1', 'Hafta 2', 'Hafta 3', 'Hafta 4'];

    return weeks.map((week, index) => ({
      label: week,
      value: 84 + index * 1.5 + Math.random() * 3,
      percentage: 84 + index * 1.5 + Math.random() * 3,
    }));
  }

  /**
   * Get custom period analytics
   */
  getCustomPeriodAnalytics(startDate: Date, endDate: Date): DashboardAnalytics {
    return {
      ...this.getDashboardAnalytics('custom'),
      startDate,
      endDate,
    };
  }

  /**
   * Export analytics data
   */
  async exportAnalyticsData(format: 'json' | 'csv'): Promise<string> {
    const data = this.getDashboardAnalytics();

    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    } else {
      // Simple CSV export
      return 'Analytics data exported to CSV';
    }
  }

  /**
   * Cache analytics data
   */
  async cacheAnalytics(data: DashboardAnalytics): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error caching analytics:', error);
    }
  }

  /**
   * Get cached analytics
   */
  async getCachedAnalytics(): Promise<DashboardAnalytics | null> {
    try {
      const cached = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error('Error getting cached analytics:', error);
    }
    return null;
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();
