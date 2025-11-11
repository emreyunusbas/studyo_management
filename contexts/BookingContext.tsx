/**
 * BookingContext - Manages booking/reservation state
 * TODO: Implement when backend is ready
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { Booking, Subscription } from '@/types';

interface BookingContextState {
  bookings: Booking[];
  subscriptions: Subscription[];
  isLoading: boolean;
}

interface BookingContextMethods {
  loadBookings: (memberId?: string) => Promise<void>;
  createBooking: (bookingData: Partial<Booking>) => Promise<void>;
  cancelBooking: (id: string, reason: string) => Promise<void>;
  checkIn: (bookingId: string) => Promise<void>;
  markNoShow: (bookingId: string) => Promise<void>;
}

type BookingContextType = BookingContextState & BookingContextMethods;

const BookingContext = createContext<BookingContextType | undefined>(undefined);

interface BookingProviderProps {
  children: ReactNode;
}

export function BookingProvider({ children }: BookingProviderProps) {
  // TODO: Implement state and methods
  const value: BookingContextType = {
    bookings: [],
    subscriptions: [],
    isLoading: false,
    loadBookings: async () => {},
    createBooking: async () => {},
    cancelBooking: async () => {},
    checkIn: async () => {},
    markNoShow: async () => {},
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
