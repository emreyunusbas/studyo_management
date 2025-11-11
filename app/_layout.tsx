/**
 * Root Layout - App navigation and provider setup
 */

import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider, useApp } from '@/contexts/AppContext';
import { ClassProvider } from '@/contexts/ClassContext';
import { BookingProvider } from '@/contexts/BookingContext';
import { Colors } from '@/constants/colors';

/**
 * Root Layout Navigation - Handles authentication routing logic
 */
function RootLayoutNav() {
  const { user, isLoading } = useApp();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Check if user is in authenticated route
    const inAuthGroup = segments[0] === '(tabs)' ||
      segments[0] === 'members-list' ||
      segments[0] === 'add-member' ||
      segments[0] === 'finance' ||
      segments[0] === 'trainers-menu' ||
      segments[0] === 'sessions-menu' ||
      segments[0] === 'settings';

    // If user is not logged in and trying to access auth routes
    if (!user && inAuthGroup) {
      router.replace('/welcome');
    }
    // If user is logged in and on welcome/login page (but not onboarding)
    else if (user && !inAuthGroup && segments[0] !== 'onboarding') {
      router.replace('/(tabs)');
    }
  }, [user, isLoading, segments]);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'slide_from_right',
        }}
      >
        {/* Welcome & Auth Screens */}
        <Stack.Screen
          name="welcome"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="login"
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="register-select-role"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="register-studio"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="register-trainer"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="register-member"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="onboarding"
          options={{ headerShown: false }}
        />

        {/* Main App (Tabs) */}
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />

        {/* Other Screens - Will be added as needed */}
      </Stack>
    </>
  );
}

/**
 * Root Layout - App entry point
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <ClassProvider>
            <BookingProvider>
              <RootLayoutNav />
            </BookingProvider>
          </ClassProvider>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
