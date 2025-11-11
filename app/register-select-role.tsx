/**
 * Register Select Role Screen - Choose registration type
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
import { Building2, User, Users, ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';

interface RoleOption {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  route: string;
}

export default function RegisterSelectRoleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();

  const texts = {
    tr: {
      title: 'Hesap Türü Seçin',
      subtitle: 'Size uygun hesap türünü seçerek başlayın',
      studio: {
        title: 'Stüdyo Kaydı',
        description: 'Üye, eğitmen ve seans yönetimi, finans takibi, detaylı raporlar ve daha fazlası...',
      },
      trainer: {
        title: 'Eğitmen Kaydı',
        description: 'Öğrenci takibi, seans planlama, ölçüm kayıtları ve performans analizi...',
      },
      member: {
        title: 'Üye Kaydı',
        description: 'Sağlıklı yaşam için ilk adım! Seanslarınızı takip edin, ödemelerinizi görüntüleyin...',
      },
    },
    en: {
      title: 'Select Account Type',
      subtitle: 'Choose the account type that suits you',
      studio: {
        title: 'Studio Registration',
        description: 'Member, trainer and session management, financial tracking, detailed reports and more...',
      },
      trainer: {
        title: 'Trainer Registration',
        description: 'Student tracking, session planning, measurement records and performance analysis...',
      },
      member: {
        title: 'Member Registration',
        description: 'First step to a healthy life! Track your sessions, view your payments...',
      },
    },
  };

  const t = texts[language];

  const roleOptions: RoleOption[] = [
    {
      id: 'studio',
      icon: <Building2 size={32} color={Colors.primary} />,
      title: t.studio.title,
      description: t.studio.description,
      color: Colors.primary,
      route: '/register-studio',
    },
    {
      id: 'trainer',
      icon: <User size={32} color={Colors.secondary} />,
      title: t.trainer.title,
      description: t.trainer.description,
      color: Colors.secondary,
      route: '/register-trainer',
    },
    {
      id: 'member',
      icon: <Users size={32} color={Colors.indigo} />,
      title: t.member.title,
      description: t.member.description,
      color: Colors.indigo,
      route: '/register-member',
    },
  ];

  const handleBack = () => {
    router.back();
  };

  const handleSelectRole = (route: string) => {
    router.push(route as any);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ChevronLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>{t.title}</Text>
            <Text style={styles.subtitle}>{t.subtitle}</Text>
          </View>
        </View>

        {/* Role Options */}
        <View style={styles.optionsContainer}>
          {roleOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionCard}
              onPress={() => handleSelectRole(option.route)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.surface, Colors.surfaceLight]}
                style={styles.gradientCard}
              >
                <View style={styles.iconContainer}>{option.icon}</View>

                <View style={styles.textContainer}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>

                <View style={[styles.indicator, { backgroundColor: option.color }]} />
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTextContainer: {
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  optionsContainer: {
    gap: 20,
  },
  optionCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gradientCard: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    minHeight: 120,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 8,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  optionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  indicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
});
