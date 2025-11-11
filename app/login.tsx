/**
 * Login Screen - Phone number and OTP authentication
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, ChevronDown } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { COUNTRY_CODES, MOCK_USER } from '@/constants/mockData';
import { useApp } from '@/contexts/AppContext';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login, language } = useApp();

  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const texts = {
    tr: {
      title: 'Giriş Yap',
      subtitle: 'Telefon numaranızla giriş yapın',
      phoneLabel: 'Telefon Numarası',
      sendCode: 'Kod Gönder',
      otpTitle: 'Doğrulama Kodu',
      otpSubtitle: 'Size gönderilen 6 haneli kodu girin',
      verify: 'Doğrula',
      mockLogin: 'Mock Kullanıcı ile Giriş',
      selectCountry: 'Ülke Kodu Seç',
      close: 'Kapat',
      invalidPhone: 'Geçerli bir telefon numarası girin',
      invalidOtp: 'Geçerli bir OTP kodu girin (6 hane)',
    },
    en: {
      title: 'Login',
      subtitle: 'Login with your phone number',
      phoneLabel: 'Phone Number',
      sendCode: 'Send Code',
      otpTitle: 'Verification Code',
      otpSubtitle: 'Enter the 6-digit code sent to you',
      verify: 'Verify',
      mockLogin: 'Login with Mock User',
      selectCountry: 'Select Country Code',
      close: 'Close',
      invalidPhone: 'Enter a valid phone number',
      invalidOtp: 'Enter a valid OTP code (6 digits)',
    },
  };

  const t = texts[language];

  const handleSendCode = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Error', t.invalidPhone);
      return;
    }
    setShowOtpInput(true);
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length !== 6) {
      Alert.alert('Error', t.invalidOtp);
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement real OTP verification
      // For now, accept any 6-digit code
      await login(MOCK_USER);
      router.replace('/onboarding');
    } catch (error) {
      Alert.alert('Error', 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMockLogin = async () => {
    setIsLoading(true);
    try {
      await login(MOCK_USER);
      router.replace('/onboarding');
    } catch (error) {
      Alert.alert('Error', 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.content, { paddingTop: insets.top + 20 }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t.title}</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.formContainer}>
          {!showOtpInput ? (
            <>
              <Text style={styles.subtitle}>{t.subtitle}</Text>

              {/* Country Code Selector */}
              <Text style={styles.label}>{t.phoneLabel}</Text>
              <View style={styles.phoneInputContainer}>
                <TouchableOpacity
                  style={styles.countrySelector}
                  onPress={() => setShowCountryPicker(true)}
                >
                  <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
                  <Text style={styles.countryCode}>{selectedCountry.code}</Text>
                  <ChevronDown size={20} color={Colors.textSecondary} />
                </TouchableOpacity>

                <TextInput
                  style={styles.phoneInput}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="5551234567"
                  placeholderTextColor={Colors.textTertiary}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>

              <TouchableOpacity
                style={[styles.button, !phoneNumber && styles.buttonDisabled]}
                onPress={handleSendCode}
                disabled={!phoneNumber}
              >
                <Text style={styles.buttonText}>{t.sendCode}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.subtitle}>{t.otpSubtitle}</Text>

              <Text style={styles.label}>{t.otpTitle}</Text>
              <TextInput
                style={styles.otpInput}
                value={otpCode}
                onChangeText={setOtpCode}
                placeholder="000000"
                placeholderTextColor={Colors.textTertiary}
                keyboardType="number-pad"
                maxLength={6}
              />

              <TouchableOpacity
                style={[styles.button, (!otpCode || isLoading) && styles.buttonDisabled]}
                onPress={handleVerifyOtp}
                disabled={!otpCode || isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? '...' : t.verify}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* Mock Login Button (Development) */}
          <TouchableOpacity
            style={styles.mockButton}
            onPress={handleMockLogin}
            disabled={isLoading}
          >
            <Text style={styles.mockButtonText}>{t.mockLogin}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Country Picker Modal */}
      <Modal
        visible={showCountryPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCountryPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.selectCountry}</Text>
              <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {COUNTRY_CODES.map((country) => (
                <TouchableOpacity
                  key={country.code}
                  style={styles.countryItem}
                  onPress={() => {
                    setSelectedCountry(country);
                    setShowCountryPicker(false);
                  }}
                >
                  <Text style={styles.countryItemFlag}>{country.flag}</Text>
                  <Text style={styles.countryItemName}>{country.country}</Text>
                  <Text style={styles.countryItemCode}>{country.code}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 12,
  },
  countryFlag: {
    fontSize: 24,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    fontSize: 16,
    color: Colors.text,
  },
  otpInput: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    letterSpacing: 8,
    marginBottom: 24,
  },
  button: {
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
  buttonDisabled: {
    backgroundColor: Colors.surface,
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.background,
  },
  mockButton: {
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
  mockButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.secondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  countryItemFlag: {
    fontSize: 32,
  },
  countryItemName: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  countryItemCode: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
