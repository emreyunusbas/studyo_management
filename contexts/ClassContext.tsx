/**
 * ClassContext - Manages class/session state
 * TODO: Implement when backend is ready
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { Class } from '@/types';

interface ClassContextState {
  classes: Class[];
  selectedDate: Date;
  isLoading: boolean;
}

interface ClassContextMethods {
  loadClasses: (date: Date, branchId?: string) => Promise<void>;
  createClass: (classData: Partial<Class>) => Promise<void>;
  updateClass: (id: string, updates: Partial<Class>) => Promise<void>;
  cancelClass: (id: string, reason: string) => Promise<void>;
}

type ClassContextType = ClassContextState & ClassContextMethods;

const ClassContext = createContext<ClassContextType | undefined>(undefined);

interface ClassProviderProps {
  children: ReactNode;
}

export function ClassProvider({ children }: ClassProviderProps) {
  // TODO: Implement state and methods
  const value: ClassContextType = {
    classes: [],
    selectedDate: new Date(),
    isLoading: false,
    loadClasses: async () => {},
    createClass: async () => {},
    updateClass: async () => {},
    cancelClass: async () => {},
  };

  return <ClassContext.Provider value={value}>{children}</ClassContext.Provider>;
}

export function useClass() {
  const context = useContext(ClassContext);
  if (context === undefined) {
    throw new Error('useClass must be used within a ClassProvider');
  }
  return context;
}
