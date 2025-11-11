/**
 * Register Studio Screen - Studio owner registration
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronDown, X, AlertCircle } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { COUNTRY_CODES } from '@/constants/mockData';
import { useApp } from '@/contexts/AppContext';

type Gender = 'male' | 'female' | 'other';

export default function RegisterStudioScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login, language } = useApp();

  // Form state
  const [studioName, setStudioName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [gender, setGender] = useState<Gender | null>(null);

  // UI state
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const texts = {
    tr: {
      title: 'Stüdyo Kaydı',
      warningTitle: 'Dikkat!',
      warningMessage: 'Bu sayfa stüdyo kaydı içindir. Eğer bireysel eğitmen veya üye olarak kayıt olmak istiyorsanız, lütfen geri dönüp uygun seçeneği seçin.',
      warningButton: 'Anladım',
      studioName: 'Stüdyo Adı',
      firstName: 'Ad',
      lastName: 'Soyad',
      email: 'E-posta',
      phone: 'Telefon Numarası',
      gender: 'Cinsiyet',
      genderOptions: {
        male: 'Erkek',
        female: 'Kadın',
        other: 'Belirtmek İstemiyorum',
      },
      selectGender: 'Cinsiyet Seçin',
      register: 'Kayıt Ol',
      requiredField: 'Bu alan zorunludur',
      invalidEmail: 'Geçerli bir e-posta adresi girin',
      invalidPhone: 'Geçerli bir telefon numarası girin',
      selectCountry: 'Ülke Kodu Seç',
      close: 'Kapat',
    },
    en: {
      title: 'Studio Registration',
      warningTitle: 'Warning!',
      warningMessage: 'This page is for studio registration. If you want to register as an individual trainer or member, please go back and select the appropriate option.',
      warningButton: 'I Understand',
      studioName: 'Studio Name',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone Number',
      gender: 'Gender',
      genderOptions: {
        male: 'Male',
        female: 'Female',
        other: 'Prefer Not to Say',
      },
      selectGender: 'Select Gender',
      register: 'Register',
      requiredField: 'This field is required',
      invalidEmail: 'Enter a valid email address',
      invalidPhone: 'Enter a valid phone number',
      selectCountry: 'Select Country Code',
      close: 'Close',
    },
  };

  const t = texts[language];

  const validateForm = () => {
    if (!studioName.trim()) {
      Alert.alert('Error', t.requiredField + ': ' + t.studioName);
      return false;
    }
    if (!firstName.trim()) {
      Alert.alert('Error', t.requiredField + ': ' + t.firstName);
      return false;
    }
    if (!lastName.trim()) {
      Alert.alert('Error', t.requiredField + ': ' + t.lastName);
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Error', t.invalidEmail);
      return false;
    }
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Error', t.invalidPhone);
      return false;
    }
    if (!gender) {
      Alert.alert('Error', t.requiredField + ': ' + t.gender);
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // TODO: Implement real registration API call
      const newUser = {
        id: Date.now().toString(),
        email,
        phone: selectedCountry.code + phoneNumber,
        role: 'ADMIN' as const,
        status: 'ACTIVE' as const,
        emailVerified: false,
        phoneVerified: false,
        name: firstName,
        surname: lastName,
        studioName,
        gender,
        createdAt: new Date().toISOString(),
      };

      await login(newUser);
      router.replace('/onboarding');
    } catch (error) {
      Alert.alert('Error', 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>{t.title}</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Studio Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t.studioName} *</Text>
            <TextInput
              style={styles.input}
              value={studioName}
              onChangeText={setStudioName}
              placeholder={t.studioName}
              placeholderTextColor={Colors.textTertiary}
            />
          </View>

          {/* First & Last Name */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>{t.firstName} *</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder={t.firstName}
                placeholderTextColor={Colors.textTertiary}
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>{t.lastName} *</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder={t.lastName}
                placeholderTextColor={Colors.textTertiary}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t.email} *</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="ornek@email.com"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t.phone} *</Text>
            <View style={styles.phoneContainer}>
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
          </View>

          {/* Gender */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t.gender} *</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowGenderPicker(true)}
            >
              <Text
                style={[
                  styles.inputText,
                  !gender && { color: Colors.textTertiary },
                ]}
              >
                {gender ? t.genderOptions[gender] : t.selectGender}
              </Text>
              <ChevronDown size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.registerButton, isLoading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.registerButtonText}>
              {isLoading ? '...' : t.register}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Warning Modal */}
      <Modal
        visible={showWarningModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowWarningModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.warningModalContent}>
            <AlertCircle size={48} color={Colors.warning} />
            <Text style={styles.warningTitle}>{t.warningTitle}</Text>
            <Text style={styles.warningMessage}>{t.warningMessage}</Text>
            <TouchableOpacity
              style={styles.warningButton}
              onPress={() => setShowWarningModal(false)}
            >
              <Text style={styles.warningButtonText}>{t.warningButton}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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

      {/* Gender Picker Modal */}
      <Modal
        visible={showGenderPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGenderPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.selectGender}</Text>
              <TouchableOpacity onPress={() => setShowGenderPicker(false)}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.genderOptions}>
              {(['male', 'female', 'other'] as Gender[]).map((g) => (
                <TouchableOpacity
                  key={g}
                  style={styles.genderOption}
                  onPress={() => {
                    setGender(g);
                    setShowGenderPicker(false);
                  }}
                >
                  <Text style={styles.genderOptionText}>
                    {t.genderOptions[g]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
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
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  input: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    fontSize: 16,
    color: Colors.text,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  phoneContainer: {
    flexDirection: 'row',
    gap: 12,
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
  registerButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 12,
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
  registerButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.background,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningModalContent: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 32,
    margin: 20,
    alignItems: 'center',
    gap: 16,
    maxWidth: 400,
  },
  warningTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.warning,
  },
  warningMessage: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  warningButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  warningButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.background,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    width: '100%',
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
  genderOptions: {
    padding: 20,
  },
  genderOption: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 12,
    marginBottom: 12,
  },
  genderOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
});
