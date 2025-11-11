/**
 * Root Index - Entry point redirects to welcome or main app
 */

import { Redirect } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/colors';

export default function Index() {
  const { user, isLoading } = useApp();

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Redirect based on auth state
  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/welcome" />;
}
