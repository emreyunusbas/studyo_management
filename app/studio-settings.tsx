/**
 * Studio Settings Screen - Manage studio/business information
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
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Check,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';

export default function StudioSettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, language } = useApp();

  const [studioName, setStudioName] = useState(user?.studioName || '');
  const [address, setAddress] = useState('İstanbul, Türkiye');
  const [phone, setPhone] = useState('+90 555 123 4567');
  const [email, setEmail] = useState('info@neselipilates.com');
  const [website, setWebsite] = useState('www.neselipilates.com');
  const [workingHours, setWorkingHours] = useState('09:00 - 20:00');
  const [description, setDescription] = useState(
    'Profesyonel pilates eğitimi veren modern bir stüdyo'
  );

  const texts = {
    tr: {
      title: 'Stüdyo Bilgileri',
      businessInfo: 'İşletme Bilgileri',
      studioName: 'Stüdyo Adı',
      address: 'Adres',
      phone: 'Telefon',
      email: 'E-posta',
      website: 'Website',
      workingHours: 'Çalışma Saatleri',
      description: 'Açıklama',
      save: 'Kaydet',
      success: 'Başarılı',
      studioUpdated: 'Stüdyo bilgileri güncellendi',
      error: 'Hata',
      fillAllFields: 'Lütfen tüm zorunlu alanları doldurun',
    },
    en: {
      title: 'Studio Information',
      businessInfo: 'Business Information',
      studioName: 'Studio Name',
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      website: 'Website',
      workingHours: 'Working Hours',
      description: 'Description',
      save: 'Save',
      success: 'Success',
      studioUpdated: 'Studio information has been updated',
      error: 'Error',
      fillAllFields: 'Please fill all required fields',
    },
  };

  const t = texts[language];

  const handleSave = () => {
    if (!studioName.trim() || !address.trim() || !phone.trim()) {
      Alert.alert(t.error, t.fillAllFields);
      return;
    }

    // TODO: Implement studio update API call
    Alert.alert(t.success, t.studioUpdated);
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
          {/* Studio Header */}
          <View style={styles.studioHeader}>
            <View style={styles.studioIcon}>
              <Building2 size={40} color={Colors.background} />
            </View>
            <Text style={styles.studioTitle}>{studioName || t.studioName}</Text>
          </View>

          {/* Business Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.businessInfo}</Text>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>{t.studioName} *</Text>
              <View style={styles.inputContainer}>
                <Building2 size={20} color={Colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder={t.studioName}
                  placeholderTextColor={Colors.textTertiary}
                  value={studioName}
                  onChangeText={setStudioName}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>{t.address} *</Text>
              <View style={styles.inputContainer}>
                <MapPin size={20} color={Colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder={t.address}
                  placeholderTextColor={Colors.textTertiary}
                  value={address}
                  onChangeText={setAddress}
                  multiline
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>{t.phone} *</Text>
              <View style={styles.inputContainer}>
                <Phone size={20} color={Colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder={t.phone}
                  placeholderTextColor={Colors.textTertiary}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>{t.email}</Text>
              <View style={styles.inputContainer}>
                <Mail size={20} color={Colors.textSecondary} />
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
              <Text style={styles.formLabel}>{t.website}</Text>
              <View style={styles.inputContainer}>
                <Globe size={20} color={Colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder={t.website}
                  placeholderTextColor={Colors.textTertiary}
                  value={website}
                  onChangeText={setWebsite}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>{t.workingHours}</Text>
              <View style={styles.inputContainer}>
                <Clock size={20} color={Colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder={t.workingHours}
                  placeholderTextColor={Colors.textTertiary}
                  value={workingHours}
                  onChangeText={setWorkingHours}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>{t.description}</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer]}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder={t.description}
                  placeholderTextColor={Colors.textTertiary}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                style={styles.saveGradient}
              >
                <Check size={20} color={Colors.background} />
                <Text style={styles.saveButtonText}>{t.save}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Info Cards */}
          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <View style={styles.infoIcon}>
                <MapPin size={20} color={Colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Adres</Text>
                <Text style={styles.infoValue}>{address}</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoIcon}>
                <Phone size={20} color={Colors.info} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Telefon</Text>
                <Text style={styles.infoValue}>{phone}</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoIcon}>
                <Clock size={20} color={Colors.warning} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Çalışma Saatleri</Text>
                <Text style={styles.infoValue}>{workingHours}</Text>
              </View>
            </View>
          </View>
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
    gap: 24,
  },
  studioHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  studioIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  studioTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
  },
  section: {
    gap: 12,
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
    fontWeight: '700',
    color: Colors.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
  },
  textAreaContainer: {
    alignItems: 'flex-start',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 16,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.background,
  },
  infoSection: {
    gap: 12,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
  },
  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
    gap: 2,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
});
