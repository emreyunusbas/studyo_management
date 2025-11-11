/**
 * Add Member Screen - Create new member with membership
 */

import React, { useState } from 'react';
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
import { ChevronLeft, ChevronDown, X } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { COUNTRY_CODES } from '@/constants/mockData';
import { useApp } from '@/contexts/AppContext';
import type { MembershipType } from '@/types';

type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export default function AddMemberScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();

  // Form state
  const [membershipType, setMembershipType] = useState<MembershipType | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [gender, setGender] = useState<Gender | null>(null);
  const [packageName, setPackageName] = useState('');
  const [sessionCount, setSessionCount] = useState('');
  const [packagePrice, setPackagePrice] = useState('');
  const [paidAmount, setPaidAmount] = useState('');

  // UI state
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showMembershipTypePicker, setShowMembershipTypePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const texts = {
    tr: {
      title: 'Üye Ekle',
      membershipType: 'Üyelik Tipi',
      selectMembershipType: 'Üyelik Tipi Seç',
      membershipTypes: {
        GRUP: 'Grup',
        BİREBİR: 'Birebir',
        DÜET: 'Düet',
        HAMİLE: 'Hamile Pilatesi',
        FİZYOTERAPİST: 'Fizyoterapist Eşliğinde',
      },
      personalInfo: 'Kişisel Bilgiler',
      firstName: 'Ad',
      lastName: 'Soyad',
      email: 'E-posta',
      phone: 'Telefon',
      gender: 'Cinsiyet',
      genderOptions: {
        MALE: 'Erkek',
        FEMALE: 'Kadın',
        OTHER: 'Diğer',
      },
      selectGender: 'Cinsiyet Seç',
      packageInfo: 'Paket Bilgileri',
      packageName: 'Paket Adı',
      sessionCount: 'Seans Sayısı',
      packagePrice: 'Paket Fiyatı',
      paymentInfo: 'Ödeme Bilgileri',
      paidAmount: 'Ödenen Tutar',
      save: 'Kaydet',
      cancel: 'İptal',
      selectCountry: 'Ülke Kodu Seç',
      close: 'Kapat',
      requiredField: 'Bu alan zorunludur',
      invalidEmail: 'Geçerli bir e-posta adresi girin',
      invalidPhone: 'Geçerli bir telefon numarası girin',
    },
    en: {
      title: 'Add Member',
      membershipType: 'Membership Type',
      selectMembershipType: 'Select Membership Type',
      membershipTypes: {
        GRUP: 'Group',
        BİREBİR: 'One-on-One',
        DÜET: 'Duet',
        HAMİLE: 'Pregnant Pilates',
        FİZYOTERAPİST: 'With Physiotherapist',
      },
      personalInfo: 'Personal Information',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      gender: 'Gender',
      genderOptions: {
        MALE: 'Male',
        FEMALE: 'Female',
        OTHER: 'Other',
      },
      selectGender: 'Select Gender',
      packageInfo: 'Package Information',
      packageName: 'Package Name',
      sessionCount: 'Session Count',
      packagePrice: 'Package Price',
      paymentInfo: 'Payment Information',
      paidAmount: 'Paid Amount',
      save: 'Save',
      cancel: 'Cancel',
      selectCountry: 'Select Country Code',
      close: 'Close',
      requiredField: 'This field is required',
      invalidEmail: 'Enter a valid email address',
      invalidPhone: 'Enter a valid phone number',
    },
  };

  const t = texts[language];

  const membershipTypeOptions: MembershipType[] = ['GRUP', 'BİREBİR', 'DÜET', 'HAMİLE', 'FİZYOTERAPİST'];
  const genderOptions: Gender[] = ['MALE', 'FEMALE', 'OTHER'];

  const validateForm = () => {
    if (!membershipType) {
      Alert.alert('Error', t.requiredField + ': ' + t.membershipType);
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
    if (!packageName.trim()) {
      Alert.alert('Error', t.requiredField + ': ' + t.packageName);
      return false;
    }
    if (!sessionCount || parseInt(sessionCount) <= 0) {
      Alert.alert('Error', t.requiredField + ': ' + t.sessionCount);
      return false;
    }
    if (!packagePrice || parseFloat(packagePrice) <= 0) {
      Alert.alert('Error', t.requiredField + ': ' + t.packagePrice);
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // TODO: Implement real API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Alert.alert('Başarılı', 'Üye başarıyla eklendi!', [
        {
          text: 'Tamam',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Üye eklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
          { paddingBottom: insets.bottom + 40 },
        ]}
      >
        {/* Membership Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.membershipType}</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowMembershipTypePicker(true)}
          >
            <Text
              style={[
                styles.inputText,
                !membershipType && { color: Colors.textTertiary },
              ]}
            >
              {membershipType ? t.membershipTypes[membershipType] : t.selectMembershipType}
            </Text>
            <ChevronDown size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Personal Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.personalInfo}</Text>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>{t.firstName} *</Text>
              <TextInput
                style={styles.textInput}
                value={firstName}
                onChangeText={setFirstName}
                placeholder={t.firstName}
                placeholderTextColor={Colors.textTertiary}
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>{t.lastName} *</Text>
              <TextInput
                style={styles.textInput}
                value={lastName}
                onChangeText={setLastName}
                placeholder={t.lastName}
                placeholderTextColor={Colors.textTertiary}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t.email} *</Text>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="ornek@email.com"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t.phone} *</Text>
            <View style={styles.phoneContainer}>
              <TouchableOpacity
                style={styles.countrySelector}
                onPress={() => setShowCountryPicker(true)}
              >
                <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
                <Text style={styles.countryCode}>{selectedCountry.code}</Text>
                <ChevronDown size={16} color={Colors.textSecondary} />
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
        </View>

        {/* Package Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.packageInfo}</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t.packageName} *</Text>
            <TextInput
              style={styles.textInput}
              value={packageName}
              onChangeText={setPackageName}
              placeholder={t.packageName}
              placeholderTextColor={Colors.textTertiary}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>{t.sessionCount} *</Text>
              <TextInput
                style={styles.textInput}
                value={sessionCount}
                onChangeText={setSessionCount}
                placeholder="12"
                placeholderTextColor={Colors.textTertiary}
                keyboardType="number-pad"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>{t.packagePrice} *</Text>
              <TextInput
                style={styles.textInput}
                value={packagePrice}
                onChangeText={setPackagePrice}
                placeholder="1500"
                placeholderTextColor={Colors.textTertiary}
                keyboardType="decimal-pad"
              />
            </View>
          </View>
        </View>

        {/* Payment Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.paymentInfo}</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t.paidAmount}</Text>
            <TextInput
              style={styles.textInput}
              value={paidAmount}
              onChangeText={setPaidAmount}
              placeholder="0"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary, isLoading && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={isLoading}
          >
            <Text style={styles.buttonPrimaryText}>
              {isLoading ? '...' : t.save}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonSecondaryText}>{t.cancel}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Membership Type Picker Modal */}
      <Modal
        visible={showMembershipTypePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMembershipTypePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.selectMembershipType}</Text>
              <TouchableOpacity onPress={() => setShowMembershipTypePicker(false)}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.optionsContainer}>
              {membershipTypeOptions.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.optionItem}
                  onPress={() => {
                    setMembershipType(type);
                    setShowMembershipTypePicker(false);
                  }}
                >
                  <Text style={styles.optionText}>
                    {t.membershipTypes[type]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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
            <View style={styles.optionsContainer}>
              {genderOptions.map((g) => (
                <TouchableOpacity
                  key={g}
                  style={styles.optionItem}
                  onPress={() => {
                    setGender(g);
                    setShowGenderPicker(false);
                  }}
                >
                  <Text style={styles.optionText}>
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
  },
  section: {
    marginBottom: 24,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  textInput: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    fontSize: 16,
    color: Colors.text,
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
    fontSize: 20,
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
  buttonContainer: {
    gap: 12,
    marginTop: 8,
  },
  button: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonSecondary: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPrimaryText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.background,
  },
  buttonSecondaryText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
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
  optionsContainer: {
    padding: 20,
  },
  optionItem: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 12,
    marginBottom: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
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
