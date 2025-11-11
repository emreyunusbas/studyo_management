/**
 * Settings Screen - Placeholder
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings, LogOut } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useApp();

  const handleLogout = async () => {
    await logout();
    router.replace('/welcome');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <View style={styles.content}>
        <Settings size={64} color={Colors.textSecondary} />
        <Text style={styles.title}>Ayarlar</Text>
        <Text style={styles.subtitle}>Bu sayfa yapım aşamasında</Text>

        {user && (
          <View style={styles.userInfo}>
            <Text style={styles.userText}>
              {user.name} {user.surname}
            </Text>
            <Text style={styles.userRole}>{user.role}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color={Colors.error} />
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  userInfo: {
    marginTop: 32,
    padding: 20,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    gap: 8,
    alignItems: 'center',
  },
  userText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  userRole: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.error,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.error,
  },
});
