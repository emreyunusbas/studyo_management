/**
 * Type definitions for PilatesSalon Yönetimi
 */

// ============================================================================
// User Management
// ============================================================================

export type UserRole = 'ADMIN' | 'TRAINER' | 'MEMBER';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'DELETED';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface User {
  id: string;
  email: string;
  phone?: string;
  role: UserRole;
  status?: UserStatus;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  name?: string;
  surname?: string;
  studioName?: string;
  gender?: 'male' | 'female' | 'other';
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
}

export type NotificationChannel = 'PUSH' | 'EMAIL' | 'SMS';

export interface MemberProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: Gender;
  photoUrl?: string;
  emergencyContact?: string;
  medicalNotes?: string;
  preferences: {
    notificationChannels: NotificationChannel[];
    language: string;
    timezone: string;
  };
  membershipStartDate: string;
  tags?: string[];
  loyaltyPoints: number;
  noShowCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TrainerProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  bio?: string;
  photoUrl?: string;
  certifications?: string[];
  specialties: string[];
  branchIds: string[];
  hourlyRate?: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================================
// Studio & Branch
// ============================================================================

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface BranchSettings {
  bookingWindowDays: number;
  cancellationHours: number;
  noShowPenalty: number;
  lateCheckInMinutes: number;
}

export interface Branch {
  id: string;
  name: string;
  address: Address;
  timezone: string;
  contactPhone: string;
  contactEmail: string;
  currency: string;
  settings: BranchSettings;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Room {
  id: string;
  branchId: string;
  name: string;
  capacity: number;
  equipment?: string[];
  isActive: boolean;
}

// ============================================================================
// Classes & Sessions
// ============================================================================

export type ClassLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS';
export type ClassStatus = 'SCHEDULED' | 'CANCELLED' | 'COMPLETED';

export interface Class {
  id: string;
  branchId: string;
  courseId?: string;
  roomId?: string;
  trainerId?: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  capacity: number;
  level: ClassLevel;
  tags?: string[];
  price?: number;
  status: ClassStatus;
  bookingCount: number;
  waitlistCount: number;
  createdAt?: string;
  updatedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
}

// ============================================================================
// Packages & Subscriptions
// ============================================================================

export type PackageType = 'CREDIT' | 'UNLIMITED' | 'DROPIN';

export interface PackageRestrictions {
  allowedLevels?: string[];
  allowedBranchIds?: string[];
  maxBookingsPerDay?: number;
  maxBookingsPerWeek?: number | null;
}

export interface Package {
  id: string;
  branchId: string;
  name: string;
  description?: string;
  type: PackageType;
  creditCount: number | null;
  validityDays: number | null;
  price: number;
  currency: string;
  restrictions: PackageRestrictions;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Subscription {
  id: string;
  memberId: string;
  packageId: string;
  status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'CANCELLED';
  startDate: string;
  endDate?: string;
  creditsRemaining?: number;
  autoRenew: boolean;
  renewalDate?: string;
  frozenUntil?: string;
  purchasePrice: number;
  currency: string;
  createdAt?: string;
  updatedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
}

// ============================================================================
// Bookings
// ============================================================================

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'WAITLISTED' | 'CANCELLED' | 'NO_SHOW' | 'ATTENDED';

export interface Booking {
  id: string;
  classId: string;
  memberId: string;
  subscriptionId?: string;
  status: BookingStatus;
  bookedAt: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancelReason?: string;
  penaltyAmount: number;
  waitlistPosition?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================================
// Payments
// ============================================================================

export type PaymentMethod = 'CARD' | 'BANK_TRANSFER' | 'CASH' | 'LINK_PAY' | 'COUPON';
export type PaymentStatus = 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'REFUNDED';

export interface Payment {
  id: string;
  memberId: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  gatewayTransactionId?: string;
  failureReason?: string;
  refundedAt?: string;
  refundAmount?: number;
  createdAt: string;
  updatedAt?: string;
}

// ============================================================================
// Notifications
// ============================================================================

export type NotificationType =
  | 'BOOKING_CONFIRMED'
  | 'REMINDER'
  | 'WAITLIST_PROMOTED'
  | 'PACKAGE_EXPIRING'
  | 'PAYMENT_SUCCEEDED'
  | 'PAYMENT_FAILED';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  channel: NotificationChannel;
  templateKey: string;
  params: Record<string, unknown>;
  status: 'PENDING' | 'SENT' | 'FAILED' | 'CANCELLED';
  sentAt?: string;
  failureReason?: string;
  readAt?: string;
  createdAt: string;
}

// ============================================================================
// Custom Application Types
// ============================================================================

export type MembershipType = 'GRUP' | 'BİREBİR' | 'DÜET' | 'HAMİLE' | 'FİZYOTERAPİST';

export interface MemberListItem {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  membershipType: MembershipType;
  remainingCredits: number;
  openableCredits: number;
  endDate: string;
  lastPaymentAmount?: number;
  remainingPayment?: number;
}

export interface Session {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  groupName: string;
  remainingCredits: number;
  status: 'COMPLETED' | 'SCHEDULED' | 'CANCELLED';
  description?: string;
  members?: SessionMember[];
}

export interface SessionMember {
  id: string;
  name: string;
  photoUrl?: string;
  difficultyLevel?: number;
  isCheckedIn: boolean;
}

export interface Measurement {
  id: string;
  memberId: string;
  date: string;
  title: string;
  unit: string;
  value: number;
  notes?: string;
  createdAt?: string;
}

export interface DifficultyLevel {
  id: string;
  memberId: string;
  sessionId: string;
  date: string;
  level: number;
  notes?: string;
}

export interface StudioRule {
  id: string;
  title: string;
  description: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface NotificationTemplate {
  id: string;
  title: string;
  body: string;
  category: string;
  createdAt?: string;
}

// Country Code for phone input
export interface CountryCode {
  country: string;
  code: string;
  flag: string;
}

// Onboarding slide
export interface OnboardingSlide {
  id: number;
  emoji: string;
  title: string;
  description: string;
}

// Language option
export interface LanguageOption {
  code: 'tr' | 'en';
  name: string;
  flag: string;
}

// App Context State
export interface AppContextState {
  user: User | null;
  selectedBranch: Branch | null;
  language: 'tr' | 'en';
  isLoading: boolean;
}
