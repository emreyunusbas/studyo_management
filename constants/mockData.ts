/**
 * Mock data for development and testing
 */

import { User, CountryCode, OnboardingSlide, LanguageOption, MemberListItem } from '@/types';

// Mock user for development
export const MOCK_USER: User = {
  id: '1',
  email: 'admin@neselipilates.com',
  phone: '+905551234567',
  role: 'ADMIN',
  status: 'ACTIVE',
  emailVerified: true,
  phoneVerified: true,
  name: 'Neseli',
  surname: 'Pilates',
  studioName: 'Neseli Pilates Stüdyo',
  gender: 'female',
  createdAt: new Date().toISOString(),
  lastLoginAt: new Date().toISOString(),
};

// Country codes for phone input
export const COUNTRY_CODES: CountryCode[] = [
  { country: 'Türkiye', code: '+90', flag: '🇹🇷' },
  { country: 'United States', code: '+1', flag: '🇺🇸' },
  { country: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { country: 'Germany', code: '+49', flag: '🇩🇪' },
];

// Onboarding slides
export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: 1,
    emoji: '👥',
    title: 'Hızlı Üye Kaydı',
    description: 'Yeni üyelerinizi saniyeler içinde sisteme ekleyin. Tüm bilgileri tek ekranda toplayın.',
  },
  {
    id: 2,
    emoji: '👨‍🏫',
    title: 'Eğitmen Takibi',
    description: 'Eğitmenlerinizin performansını izleyin, seans sayılarını ve üye memnuniyetini takip edin.',
  },
  {
    id: 3,
    emoji: '📊',
    title: 'Detaylı Raporlar',
    description: 'Stüdyonuzun finansal durumunu, üye katılımlarını ve trendleri analiz edin.',
  },
  {
    id: 4,
    emoji: '📅',
    title: 'Seans Programı',
    description: 'Seanslarınızı kolayca planlayın, üyelerinizi atayın ve değişiklikleri anında yapın.',
  },
  {
    id: 5,
    emoji: '📏',
    title: 'Üye Ölçüm Takibi',
    description: 'Üyelerinizin kilo, kas kütlesi ve vücut ölçümlerini kaydedip ilerlemelerini takip edin.',
  },
  {
    id: 6,
    emoji: '🥗',
    title: 'Beslenme Programları',
    description: 'Üyeleriniz için özel beslenme programları oluşturun ve paylaşın.',
  },
  {
    id: 7,
    emoji: '💬',
    title: 'Anlık İletişim',
    description: 'Üyelerinizle direkt mesajlaşın, seans notları paylaşın ve geri bildirim alın.',
  },
  {
    id: 8,
    emoji: '🔔',
    title: 'Anlık Bildirimler',
    description: 'Üyelerinize seans hatırlatmaları, ödeme bildirimleri ve özel mesajlar gönderin.',
  },
  {
    id: 9,
    emoji: '✅',
    title: 'Gün Sonu Bekleyen İşler',
    description: 'Günün sonunda yapılması gereken tüm işlemleri bir arada görün ve tamamlayın.',
  },
];

// Language options
export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
];

// Welcome screen mottos
export const WELCOME_MOTTOS = [
  'Sağlıklı yaşam, güçlü gelecek',
  'Her hareket bir adım',
  'Kendinize yatırım yapın',
  'Güçlü vücut, güçlü zihin',
  'Pilates ile yaşam kalitesi',
  'Esneklik ve güç dengesi',
  'Nefes al, hareket et, yaşa',
  'Her gün yeni bir başlangıç',
  'Vücudunuzu keşfedin',
  'Hedeflerinize ulaşın',
];

// Mock members for development
export const MOCK_MEMBERS: MemberListItem[] = [
  {
    id: '1',
    firstName: 'Ayşe',
    lastName: 'Yılmaz',
    photoUrl: undefined,
    membershipType: 'BİREBİR',
    remainingCredits: 8,
    openableCredits: 12,
    endDate: '2025-12-31',
    lastPaymentAmount: 1500,
    remainingPayment: 0,
  },
  {
    id: '2',
    firstName: 'Mehmet',
    lastName: 'Demir',
    photoUrl: undefined,
    membershipType: 'GRUP',
    remainingCredits: 15,
    openableCredits: 20,
    endDate: '2025-11-30',
    lastPaymentAmount: 1200,
    remainingPayment: 400,
  },
  {
    id: '3',
    firstName: 'Zeynep',
    lastName: 'Kaya',
    photoUrl: undefined,
    membershipType: 'DÜET',
    remainingCredits: 6,
    openableCredits: 10,
    endDate: '2026-01-15',
    lastPaymentAmount: 1800,
    remainingPayment: 600,
  },
];

// Week days (Turkish)
export const WEEK_DAYS = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'];

// Week days (Full Turkish)
export const WEEK_DAYS_FULL = [
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
  'Pazar',
];

// Mock weekly session data
export const MOCK_WEEKLY_SESSIONS = [
  { day: 'Pt', count: 8 },
  { day: 'Sa', count: 6 },
  { day: 'Ça', count: 10 },
  { day: 'Pe', count: 7 },
  { day: 'Cu', count: 9 },
  { day: 'Ct', count: 5 },
  { day: 'Pz', count: 4 },
];

// Mock sessions data
export const MOCK_SESSIONS = [
  {
    id: '1',
    date: '2025-01-11',
    startTime: '09:00',
    endTime: '10:00',
    groupName: 'Sabah Grubu',
    remainingCredits: 6,
    status: 'SCHEDULED' as const,
    description: 'Core güçlendirme ve esneklik',
    members: [
      {
        id: '1',
        name: 'Ayşe Yılmaz',
        isCheckedIn: false,
        difficultyLevel: 3,
      },
      {
        id: '2',
        name: 'Mehmet Demir',
        isCheckedIn: false,
        difficultyLevel: 2,
      },
    ],
    trainerId: 'trainer-1',
    trainerName: 'Neseli Pilates',
    capacity: 8,
  },
  {
    id: '2',
    date: '2025-01-11',
    startTime: '10:30',
    endTime: '11:30',
    groupName: 'Birebir Seans',
    remainingCredits: 1,
    status: 'SCHEDULED' as const,
    description: 'Özel reformer antrenmanı',
    members: [
      {
        id: '3',
        name: 'Zeynep Kaya',
        isCheckedIn: false,
        difficultyLevel: 4,
      },
    ],
    trainerId: 'trainer-1',
    trainerName: 'Neseli Pilates',
    capacity: 1,
  },
  {
    id: '3',
    date: '2025-01-11',
    startTime: '14:00',
    endTime: '15:00',
    groupName: 'Öğle Grubu',
    remainingCredits: 5,
    status: 'SCHEDULED' as const,
    description: 'Temel pilates hareketleri',
    members: [],
    trainerId: 'trainer-1',
    trainerName: 'Neseli Pilates',
    capacity: 6,
  },
  {
    id: '4',
    date: '2025-01-10',
    startTime: '09:00',
    endTime: '10:00',
    groupName: 'Sabah Grubu',
    remainingCredits: 6,
    status: 'COMPLETED' as const,
    description: 'Core güçlendirme',
    members: [
      {
        id: '1',
        name: 'Ayşe Yılmaz',
        isCheckedIn: true,
        difficultyLevel: 3,
      },
      {
        id: '2',
        name: 'Mehmet Demir',
        isCheckedIn: true,
        difficultyLevel: 2,
      },
    ],
    trainerId: 'trainer-1',
    trainerName: 'Neseli Pilates',
    capacity: 8,
  },
  {
    id: '5',
    date: '2025-01-09',
    startTime: '18:00',
    endTime: '19:00',
    groupName: 'Akşam Grubu',
    remainingCredits: 8,
    status: 'CANCELLED' as const,
    description: 'Eğitmen rahatsızlığı',
    members: [],
    trainerId: 'trainer-1',
    trainerName: 'Neseli Pilates',
    capacity: 10,
  },
  {
    id: '6',
    date: '2025-01-12',
    startTime: '10:00',
    endTime: '11:00',
    groupName: 'Hafta Sonu Özel',
    remainingCredits: 4,
    status: 'SCHEDULED' as const,
    description: 'Reformer ve mat pilates kombinasyonu',
    members: [
      {
        id: '1',
        name: 'Ayşe Yılmaz',
        isCheckedIn: false,
      },
    ],
    trainerId: 'trainer-1',
    trainerName: 'Neseli Pilates',
    capacity: 6,
  },
];

// Mock trainers data
export const MOCK_TRAINERS = [
  {
    id: 'trainer-1',
    firstName: 'Neseli',
    lastName: 'Pilates',
    email: 'neseli@pilates.com',
    phone: '+905551234567',
    photoUrl: undefined,
    specialties: ['Reformer', 'Mat Pilates', 'Core Güçlendirme'],
    certifications: ['Pilates Instructor Certificate', 'Advanced Reformer Training'],
    bio: '10 yıllık deneyime sahip sertifikalı pilates eğitmeni',
    isActive: true,
    totalSessions: 450,
    completedSessions: 425,
    cancelledSessions: 15,
    activeMembers: 28,
    rating: 4.8,
    joinDate: '2020-01-15',
  },
  {
    id: 'trainer-2',
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    email: 'ahmet@pilates.com',
    phone: '+905559876543',
    photoUrl: undefined,
    specialties: ['Mat Pilates', 'Prenatal Pilates', 'Rehabilitation'],
    certifications: ['Pilates Instructor Certificate', 'Prenatal Specialist'],
    bio: '5 yıllık deneyime sahip, hamile pilatesinde uzman',
    isActive: true,
    totalSessions: 220,
    completedSessions: 210,
    cancelledSessions: 5,
    activeMembers: 15,
    rating: 4.6,
    joinDate: '2022-06-01',
  },
  {
    id: 'trainer-3',
    firstName: 'Zeynep',
    lastName: 'Kaya',
    email: 'zeynep@pilates.com',
    phone: '+905558765432',
    photoUrl: undefined,
    specialties: ['Reformer', 'Tower', 'Advanced Techniques'],
    certifications: ['Pilates Instructor Certificate', 'Master Trainer Certificate'],
    bio: 'İleri seviye reformer ve tower uzmanı',
    isActive: true,
    totalSessions: 380,
    completedSessions: 365,
    cancelledSessions: 10,
    activeMembers: 22,
    rating: 4.9,
    joinDate: '2021-03-20',
  },
];

// Mock payments data
export const MOCK_PAYMENTS = [
  {
    id: 'pay-1',
    memberId: '1',
    memberName: 'Ayşe Yılmaz',
    amount: 1500,
    paymentMethod: 'CARD',
    date: '2025-01-10',
    type: 'PACKAGE_PURCHASE',
    packageName: '12 Seans Paketi',
    status: 'COMPLETED',
  },
  {
    id: 'pay-2',
    memberId: '2',
    memberName: 'Mehmet Demir',
    amount: 800,
    paymentMethod: 'CASH',
    date: '2025-01-09',
    type: 'PARTIAL_PAYMENT',
    packageName: '20 Seans Paketi',
    status: 'COMPLETED',
  },
  {
    id: 'pay-3',
    memberId: '3',
    memberName: 'Zeynep Kaya',
    amount: 1800,
    paymentMethod: 'BANK_TRANSFER',
    date: '2025-01-08',
    type: 'PACKAGE_PURCHASE',
    packageName: '10 Seans Paketi',
    status: 'COMPLETED',
  },
  {
    id: 'pay-4',
    memberId: '1',
    memberName: 'Ayşe Yılmaz',
    amount: 600,
    paymentMethod: 'CARD',
    date: '2025-01-05',
    type: 'PARTIAL_PAYMENT',
    packageName: '12 Seans Paketi',
    status: 'COMPLETED',
  },
  {
    id: 'pay-5',
    memberId: '2',
    memberName: 'Mehmet Demir',
    amount: 400,
    paymentMethod: 'CASH',
    date: '2025-01-03',
    type: 'PARTIAL_PAYMENT',
    packageName: '20 Seans Paketi',
    status: 'PENDING',
  },
];

// Mock packages data
export const MOCK_PACKAGES = [
  {
    id: 'pkg-1',
    name: '8 Seans Paketi',
    sessionCount: 8,
    price: 2400,
    validityDays: 30,
    description: 'Başlangıç seviyesi için ideal',
    isActive: true,
  },
  {
    id: 'pkg-2',
    name: '12 Seans Paketi',
    sessionCount: 12,
    price: 3200,
    validityDays: 45,
    description: 'En popüler paket',
    isActive: true,
  },
  {
    id: 'pkg-3',
    name: '16 Seans Paketi',
    sessionCount: 16,
    price: 4000,
    validityDays: 60,
    description: 'Düzenli antrenman için',
    isActive: true,
  },
  {
    id: 'pkg-4',
    name: '24 Seans Paketi',
    sessionCount: 24,
    price: 5600,
    validityDays: 90,
    description: 'Avantajlı uzun dönem paketi',
    isActive: true,
  },
  {
    id: 'pkg-5',
    name: 'Birebir 8 Seans',
    sessionCount: 8,
    price: 4800,
    validityDays: 30,
    description: 'Özel birebir eğitim',
    isActive: true,
  },
];
