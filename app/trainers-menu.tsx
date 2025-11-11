/**
 * Trainers Menu Screen - Main menu for trainer management
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  ChevronRight,
  Users,
  UserPlus,
  Award,
  Calendar,
  TrendingUp,
  Clock,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';

interface MenuItem {
  id: string;
  title: string;
  route: string;
  icon: any;
  color: string;
}

export default function TrainersMenuScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();

  const texts = {
    tr: {
      title: 'Eğitmen Yönetimi',
      menuItems: [
        { id: '1', title: 'Eğitmen Listesi', route: '/trainers-list', icon: Users, color: Colors.primary },
        { id: '2', title: 'Yeni Eğitmen Ekle', route: '/add-trainer', icon: UserPlus, color: Colors.success },
        { id: '3', title: 'Performans Değerlendirme', route: '/trainer-performance', icon: TrendingUp, color: Colors.info },
        { id: '4', title: 'Eğitmen Programları', route: '/trainer-schedule', icon: Calendar, color: Colors.accent },
        { id: '5', title: 'Sertifikalar', route: '/trainer-certifications', icon: Award, color: Colors.secondary },
        { id: '6', title: 'Çalışma Saatleri', route: '/trainer-hours', icon: Clock, color: Colors.warning },
      ],
    },
    en: {
      title: 'Trainer Management',
      menuItems: [
        { id: '1', title: 'Trainer List', route: '/trainers-list', icon: Users, color: Colors.primary },
        { id: '2', title: 'Add New Trainer', route: '/add-trainer', icon: UserPlus, color: Colors.success },
        { id: '3', title: 'Performance Evaluation', route: '/trainer-performance', icon: TrendingUp, color: Colors.info },
        { id: '4', title: 'Trainer Schedules', route: '/trainer-schedule', icon: Calendar, color: Colors.accent },
        { id: '5', title: 'Certifications', route: '/trainer-certifications', icon: Award, color: Colors.secondary },
        { id: '6', title: 'Working Hours', route: '/trainer-hours', icon: Clock, color: Colors.warning },
      ],
    },
  };

  const t = texts[language];
  const menuItems = t.menuItems as MenuItem[];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.backgroundLight]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>{t.title}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
        >
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => router.push(item.route as any)}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                    <IconComponent size={24} color={Colors.background} />
                  </View>
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </View>
                <ChevronRight size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
});
