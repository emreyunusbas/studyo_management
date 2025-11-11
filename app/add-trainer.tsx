/**
 * Add Trainer Screen - Add new trainer to the system
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  User,
  Mail,
  Phone,
  Award,
  FileText,
  ChevronDown,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { COUNTRY_CODES } from '@/constants/mockData';
import { useApp } from '@/contexts/AppContext';

const SPECIALTY_OPTIONS = [
  'Reformer',
  'Mat Pilates',
  'Tower',
  'Cadillac',
  'Chair',
  'Core Güçlendirme',
  'Prenatal Pilates',
  'Postnatal Pilates',
  'Rehabilitation',
  'Advanced Techniques',
  'Düet Seansları',
  'Grup Seansları',
];

export default function AddTrainerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState(COUNTRY_CODES[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [bio, setBio] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [showSpecialtyPicker, setShowSpecialtyPicker] = useState(false);
  const [certifications, setCertifications] = useState('');

  const texts = {
    tr: {
      title: 'Yeni Eğitmen',
      personalInfo: 'Kişisel Bilgiler',
      firstName: 'Ad',
      lastName: 'Soyad',
      email: 'E-posta',
      phone: 'Telefon',
      professional: 'Profesyonel Bilgiler',
      bio: 'Biyografi',
      bioPlaceholder: 'Eğitmen hakkında kısa bilgi...',
      specialties: 'Uzmanlık Alanları',
      selectSpecialties: 'Uzmanlık alanlarını seç',
      selected: 'seçildi',
      certifications: 'Sertifikalar',
      certificationsPlaceholder: 'Sertifikaları girin (virgülle ayırın)',
      save: 'Kaydet',
      cancel: 'İptal',
      error: 'Hata',
      fillRequired: 'Lütfen gerekli alanları doldurun',
      invalidEmail: 'Geçerli bir e-posta adresi girin',
      success: 'Başarılı',
      trainerAdded: 'Eğitmen eklendi',
    },
    en: {
      title: 'New Trainer',
      personalInfo: 'Personal Information',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      professional: 'Professional Information',
      bio: 'Biography',
      bioPlaceholder: 'Short bio about the trainer...',
      specialties: 'Specialties',
      selectSpecialties: 'Select specialties',
      selected: 'selected',
      certifications: 'Certifications',
      certificationsPlaceholder: 'Enter certifications (comma separated)',
      save: 'Save',
      cancel: 'Cancel',
      error: 'Error',
      fillRequired: 'Please fill required fields',
      invalidEmail: 'Enter a valid email address',
      success: 'Success',
      trainerAdded: 'Trainer added',
    },
  };

  const t = texts[language];

  const toggleSpecialty = (specialty: string) => {
    if (selectedSpecialties.includes(specialty)) {
      setSelectedSpecialties(selectedSpecialties.filter((s) => s !== specialty));
    } else {
      setSelectedSpecialties([...selectedSpecialties, specialty]);
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSave = () => {
    if (!firstName || !lastName || !email || !phone) {
      Alert.alert(t.error, t.fillRequired);
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert(t.error, t.invalidEmail);
      return;
    }

    // TODO: Save trainer to backend
    Alert.alert(t.success, t.trainerAdded, [
      {
        text: 'Tamam',
        onPress: () => router.back(),
      },
    ]);
  };

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
          {/* Personal Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.personalInfo}</Text>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>{t.firstName}</Text>
              <View style={styles.inputCard}>
                <User size={20} color={Colors.primary} />
                <TextInput
                  style={styles.input}
                  placeholder={t.firstName}
                  placeholderTextColor={Colors.textTertiary}
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>{t.lastName}</Text>
              <View style={styles.inputCard}>
                <User size={20} color={Colors.primary} />
                <TextInput
                  style={styles.input}
                  placeholder={t.lastName}
                  placeholderTextColor={Colors.textTertiary}
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>{t.email}</Text>
              <View style={styles.inputCard}>
                <Mail size={20} color={Colors.info} />
                <TextInput
                  style={styles.input}
                  placeholder={t.email}
                  placeholderTextColor={Colors.textTertiary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>{t.phone}</Text>
              <View style={styles.phoneRow}>
                <TouchableOpacity
                  style={styles.countryCodeButton}
                  onPress={() => setShowCountryPicker(true)}
                >
                  <Text style={styles.countryFlag}>{selectedCountryCode.flag}</Text>
                  <Text style={styles.countryCode}>{selectedCountryCode.code}</Text>
                  <ChevronDown size={16} color={Colors.textSecondary} />
                </TouchableOpacity>

                <View style={[styles.inputCard, styles.phoneInput]}>
                  <Phone size={20} color={Colors.accent} />
                  <TextInput
                    style={styles.input}
                    placeholder="555 123 4567"
                    placeholderTextColor={Colors.textTertiary}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Professional Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.professional}</Text>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>{t.bio}</Text>
              <View style={[styles.inputCard, styles.textAreaCard]}>
                <FileText size={20} color={Colors.secondary} />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder={t.bioPlaceholder}
                  placeholderTextColor={Colors.textTertiary}
                  value={bio}
                  onChangeText={setBio}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                {t.specialties} ({selectedSpecialties.length} {t.selected})
              </Text>
              <TouchableOpacity
                style={styles.inputCard}
                onPress={() => setShowSpecialtyPicker(true)}
              >
                <Award size={20} color={Colors.warning} />
                <Text
                  style={[
                    styles.inputText,
                    !selectedSpecialties.length && styles.placeholder,
                  ]}
                >
                  {selectedSpecialties.length > 0
                    ? selectedSpecialties.join(', ')
                    : t.selectSpecialties}
                </Text>
                <ChevronDown size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>{t.certifications}</Text>
              <View style={styles.inputCard}>
                <Award size={20} color={Colors.success} />
                <TextInput
                  style={styles.input}
                  placeholder={t.certificationsPlaceholder}
                  placeholderTextColor={Colors.textTertiary}
                  value={certifications}
                  onChangeText={setCertifications}
                />
              </View>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={styles.saveButtonGradient}
            >
              <Text style={styles.saveButtonText}>{t.save}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>

        {/* Country Code Picker Modal */}
        {showCountryPicker && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Ülke Seç</Text>
                <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent}>
                {COUNTRY_CODES.map((country) => (
                  <TouchableOpacity
                    key={country.code}
                    style={styles.countryOption}
                    onPress={() => {
                      setSelectedCountryCode(country);
                      setShowCountryPicker(false);
                    }}
                  >
                    <Text style={styles.countryOptionFlag}>{country.flag}</Text>
                    <Text style={styles.countryOptionText}>{country.country}</Text>
                    <Text style={styles.countryOptionCode}>{country.code}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}

        {/* Specialty Picker Modal */}
        {showSpecialtyPicker && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t.specialties}</Text>
                <TouchableOpacity onPress={() => setShowSpecialtyPicker(false)}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent}>
                {SPECIALTY_OPTIONS.map((specialty) => {
                  const isSelected = selectedSpecialties.includes(specialty);
                  return (
                    <TouchableOpacity
                      key={specialty}
                      style={[
                        styles.specialtyOption,
                        isSelected && styles.specialtyOptionSelected,
                      ]}
                      onPress={() => toggleSpecialty(specialty)}
                    >
                      <Text style={styles.specialtyOptionText}>{specialty}</Text>
                      {isSelected && (
                        <View style={styles.checkmark}>
                          <Text style={styles.checkmarkText}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={() => setShowSpecialtyPicker(false)}
                >
                  <LinearGradient
                    colors={[Colors.primary, Colors.primaryDark]}
                    style={styles.doneButtonGradient}
                  >
                    <Text style={styles.doneButtonText}>
                      Tamam ({selectedSpecialties.length})
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
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
    gap: 24,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  formGroup: {
    gap: 8,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },
  inputText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  placeholder: {
    color: Colors.textTertiary,
    fontWeight: '400',
  },
  phoneRow: {
    flexDirection: 'row',
    gap: 12,
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
  },
  countryFlag: {
    fontSize: 20,
  },
  countryCode: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  phoneInput: {
    flex: 1,
  },
  textAreaCard: {
    alignItems: 'flex-start',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonGradient: {
    padding: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.background,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceLight,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  modalClose: {
    fontSize: 24,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  modalContent: {
    maxHeight: 400,
  },
  countryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceLight,
  },
  countryOptionFlag: {
    fontSize: 24,
  },
  countryOptionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  countryOptionCode: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  specialtyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceLight,
  },
  specialtyOptionSelected: {
    backgroundColor: Colors.surfaceLight,
  },
  specialtyOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.background,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceLight,
  },
  doneButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  doneButtonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.background,
  },
});
