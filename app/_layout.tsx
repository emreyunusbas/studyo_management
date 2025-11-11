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
import { NotificationProvider } from '@/contexts/NotificationContext';
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

    // Define public routes that don't require authentication
    const publicRoutes = ['welcome', 'login', 'register-select-role', 'register-studio', 'register-trainer', 'register-member', 'onboarding'];
    const currentRoute = segments[0];
    const isPublicRoute = !currentRoute || publicRoutes.includes(currentRoute);

    // If user is not logged in and trying to access protected routes
    if (!user && !isPublicRoute) {
      router.replace('/welcome');
    }
    // If user is logged in and on public route (except onboarding)
    else if (user && isPublicRoute && currentRoute !== 'onboarding') {
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
          <NotificationProvider>
            <ClassProvider>
              <BookingProvider>
                <RootLayoutNav />
              </BookingProvider>
            </ClassProvider>
          </NotificationProvider>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
