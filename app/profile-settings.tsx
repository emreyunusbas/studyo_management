/**
 * Profile Settings Screen - Edit user profile information
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
  Lock,
  Camera,
  Check,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, language } = useApp();

  const [name, setName] = useState(user?.name || '');
  const [surname, setSurname] = useState(user?.surname || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const texts = {
    tr: {
      title: 'Profil Ayarları',
      personalInfo: 'Kişisel Bilgiler',
      name: 'Ad',
      surname: 'Soyad',
      email: 'E-posta',
      phone: 'Telefon',
      changePhoto: 'Fotoğrafı Değiştir',
      security: 'Güvenlik',
      changePassword: 'Şifre Değiştir',
      currentPassword: 'Mevcut Şifre',
      newPassword: 'Yeni Şifre',
      confirmPassword: 'Yeni Şifre (Tekrar)',
      save: 'Kaydet',
      success: 'Başarılı',
      profileUpdated: 'Profil bilgileriniz güncellendi',
      passwordChanged: 'Şifreniz başarıyla değiştirildi',
      error: 'Hata',
      fillAllFields: 'Lütfen tüm alanları doldurun',
      passwordsNotMatch: 'Şifreler eşleşmiyor',
      invalidEmail: 'Geçersiz e-posta adresi',
    },
    en: {
      title: 'Profile Settings',
      personalInfo: 'Personal Information',
      name: 'Name',
      surname: 'Surname',
      email: 'Email',
      phone: 'Phone',
      changePhoto: 'Change Photo',
      security: 'Security',
      changePassword: 'Change Password',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm New Password',
      save: 'Save',
      success: 'Success',
      profileUpdated: 'Your profile has been updated',
      passwordChanged: 'Your password has been changed successfully',
      error: 'Error',
      fillAllFields: 'Please fill all fields',
      passwordsNotMatch: 'Passwords do not match',
      invalidEmail: 'Invalid email address',
    },
  };

  const t = texts[language];

  const handleSaveProfile = () => {
    if (!name.trim() || !surname.trim() || !email.trim()) {
      Alert.alert(t.error, t.fillAllFields);
      return;
    }

    // TODO: Implement profile update API call
    Alert.alert(t.success, t.profileUpdated);
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert(t.error, t.fillAllFields);
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(t.error, t.passwordsNotMatch);
      return;
    }

    // TODO: Implement password change API call
    Alert.alert(t.success, t.passwordChanged);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleChangePhoto = () => {
    // TODO: Implement photo picker
    Alert.alert('Bilgi', 'Fotoğraf değiştirme özelliği yakında eklenecek');
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
          {/* Profile Photo */}
          <View style={styles.photoSection}>
            <View style={styles.photoContainer}>
              <View style={styles.photo}>
                <Text style={styles.photoText}>
                  {user?.name?.[0]}
                  {user?.surname?.[0]}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.photoButton}
                onPress={handleChangePhoto}
              >
                <Camera size={16} color={Colors.background} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.personalInfo}</Text>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>{t.name}</Text>
              <View style={styles.inputContainer}>
                <User size={20} color={Colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder={t.name}
                  placeholderTextColor={Colors.textTertiary}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>{t.surname}</Text>
              <View style={styles.inputContainer}>
                <User size={20} color={Colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder={t.surname}
                  placeholderTextColor={Colors.textTertiary}
                  value={surname}
                  onChangeText={setSurname}
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
              <Text style={styles.formLabel}>{t.phone}</Text>
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

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveProfile}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                style={styles.saveGradient}
              >
                <Check size={20} color={Colors.background} />
                <Text style={styles.saveButtonText}>{t.save}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Security */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.security}</Text>
            <Text style={styles.sectionSubtitle}>{t.changePassword}</Text>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>{t.currentPassword}</Text>
              <View style={styles.inputContainer}>
                <Lock size={20} color={Colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.textTertiary}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>{t.newPassword}</Text>
              <View style={styles.inputContainer}>
                <Lock size={20} color={Colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.textTertiary}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>{t.confirmPassword}</Text>
              <View style={styles.inputContainer}>
                <Lock size={20} color={Colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.textTertiary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleChangePassword}
            >
              <LinearGradient
                colors={[Colors.warning, '#f59e0b']}
                style={styles.saveGradient}
              >
                <Lock size={20} color={Colors.background} />
                <Text style={styles.saveButtonText}>{t.changePassword}</Text>
              </LinearGradient>
            </TouchableOpacity>
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
  photoSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  photoContainer: {
    position: 'relative',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoText: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.background,
  },
  photoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.background,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: -8,
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
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
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
});
