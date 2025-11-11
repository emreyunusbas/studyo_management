/**
 * Welcome Screen - First screen users see
 * Shows logo, motto, language selection, and auth buttons
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { WELCOME_MOTTOS, LANGUAGE_OPTIONS } from '@/constants/mockData';
import { useApp } from '@/contexts/AppContext';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language, updateLanguage } = useApp();
  const [currentMottoIndex, setCurrentMottoIndex] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];

  // Change motto every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // Change motto
        setCurrentMottoIndex((prev) => (prev + 1) % WELCOME_MOTTOS.length);
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleLanguageChange = (lang: 'tr' | 'en') => {
    updateLanguage(lang);
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleRegister = () => {
    router.push('/register-select-role');
  };

  return (
    <LinearGradient
      colors={[Colors.background, Colors.backgroundLight, Colors.background]}
      style={styles.container}
    >
      <View style={[styles.content, { paddingTop: insets.top + 20 }]}>
        {/* Language Selection */}
        <View style={styles.languageContainer}>
          {LANGUAGE_OPTIONS.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageButton,
                language === lang.code && styles.languageButtonActive,
              ]}
              onPress={() => handleLanguageChange(lang.code)}
            >
              <Text style={styles.languageFlag}>{lang.flag}</Text>
              <Text
                style={[
                  styles.languageText,
                  language === lang.code && styles.languageTextActive,
                ]}
              >
                {lang.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logo Area */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>PS</Text>
          </View>
          <Text style={styles.brandName}>PilatesSalon</Text>
          <Text style={styles.brandTagline}>
            {language === 'tr' ? 'Yönetim' : 'Management'}
          </Text>
        </View>

        {/* Animated Motto */}
        <Animated.View style={[styles.mottoContainer, { opacity: fadeAnim }]}>
          <Text style={styles.mottoText}>{WELCOME_MOTTOS[currentMottoIndex]}</Text>
        </Animated.View>

        {/* Auth Buttons */}
        <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 40 }]}>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>
              {language === 'tr' ? 'Giriş Yap' : 'Login'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>
              {language === 'tr' ? 'Kayıt Ol' : 'Register'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
  },
  languageButtonActive: {
    backgroundColor: Colors.primary,
  },
  languageFlag: {
    fontSize: 18,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  languageTextActive: {
    color: Colors.background,
    fontWeight: '700',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: height * 0.15,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.background,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 24,
  },
  brandTagline: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 8,
  },
  mottoContainer: {
    paddingHorizontal: 40,
    marginTop: 40,
  },
  mottoText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.primary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    gap: 16,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.background,
  },
  registerButton: {
    backgroundColor: Colors.surface,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
});
