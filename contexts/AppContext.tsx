/**
 * AppContext - Global application state management
 * Manages user authentication, selected branch, and language preferences
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Branch } from '@/types';

// Storage keys
const STORAGE_KEYS = {
  USER: '@pilates4us:user',
  SELECTED_BRANCH: '@pilates4us:selected_branch',
  LANGUAGE: '@pilates4us:language',
};

// Context state interface
interface AppContextState {
  user: User | null;
  selectedBranch: Branch | null;
  language: 'tr' | 'en';
  isLoading: boolean;
}

// Context methods interface
interface AppContextMethods {
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  updateSelectedBranch: (branch: Branch | null) => Promise<void>;
  updateLanguage: (lang: 'tr' | 'en') => Promise<void>;
}

// Combined context type
type AppContextType = AppContextState & AppContextMethods;

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider props
interface AppProviderProps {
  children: ReactNode;
}

/**
 * AppProvider - Provides global application state to children
 */
export function AppProvider({ children }: AppProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted data on mount
  useEffect(() => {
    loadPersistedData();
  }, []);

  /**
   * Load persisted data from AsyncStorage
   */
  const loadPersistedData = async () => {
    try {
      const [storedUser, storedBranch, storedLanguage] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.SELECTED_BRANCH),
        AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE),
      ]);

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      if (storedBranch) {
        setSelectedBranch(JSON.parse(storedBranch));
      }

      if (storedLanguage) {
        setLanguage(storedLanguage as 'tr' | 'en');
      }
    } catch (error) {
      console.error('Error loading persisted data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login user and persist to storage
   */
  const login = async (userData: User) => {
    try {
      // Update last login timestamp
      const updatedUser = {
        ...userData,
        lastLoginAt: new Date().toISOString(),
      };

      setUser(updatedUser);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  /**
   * Logout user and clear storage
   */
  const logout = async () => {
    try {
      setUser(null);
      setSelectedBranch(null);
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.USER),
        AsyncStorage.removeItem(STORAGE_KEYS.SELECTED_BRANCH),
      ]);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  /**
   * Update user data
   */
  const updateUser = async (userData: Partial<User>) => {
    try {
      if (!user) return;

      const updatedUser = {
        ...user,
        ...userData,
        updatedAt: new Date().toISOString(),
      };

      setUser(updatedUser);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  /**
   * Update selected branch
   */
  const updateSelectedBranch = async (branch: Branch | null) => {
    try {
      setSelectedBranch(branch);
      if (branch) {
        await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_BRANCH, JSON.stringify(branch));
      } else {
        await AsyncStorage.removeItem(STORAGE_KEYS.SELECTED_BRANCH);
      }
    } catch (error) {
      console.error('Error updating selected branch:', error);
      throw error;
    }
  };

  /**
   * Update language preference
   */
  const updateLanguage = async (lang: 'tr' | 'en') => {
    try {
      setLanguage(lang);
      await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    } catch (error) {
      console.error('Error updating language:', error);
      throw error;
    }
  };

  const value: AppContextType = {
    user,
    selectedBranch,
    language,
    isLoading,
    login,
    logout,
    updateUser,
    updateSelectedBranch,
    updateLanguage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * useApp hook - Access app context
 */
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
