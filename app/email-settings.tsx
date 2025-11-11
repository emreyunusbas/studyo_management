/**
 * Email Settings Screen - E-posta konfigürasyonu
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Mail,
  Send,
  CheckCircle,
  Globe,
  Server,
  Save,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { emailService, EmailProvider } from '@/services/emailService';

export default function EmailSettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();

  const [emailEnabled, setEmailEnabled] = useState(false);
  const [provider, setProvider] = useState<EmailProvider>('sendgrid');
  const [apiKey, setApiKey] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [fromName, setFromName] = useState('');
  const [testEmail, setTestEmail] = useState('');

  const texts = {
    tr: {
      title: 'E-posta Ayarları',
      service: 'E-posta Servisi',
      enabled: 'Aktif',
      disabled: 'Devre Dışı',
      provider: 'Sağlayıcı',
      config: 'Konfigürasyon',
      apiKey: 'API Key',
      fromEmail: 'Gönderen E-posta',
      fromName: 'Gönderen İsim',
      save: 'Kaydet',
      test: 'Test E-postası',
      testEmail: 'Test E-posta Adresi',
      sendTest: 'Test Gönder',
      success: 'Başarılı',
      configSaved: 'Ayarlar kaydedildi',
      testSent: 'Test e-postası gönderildi',
      error: 'Hata',
      fillFields: 'Lütfen tüm alanları doldurun',
      invalidEmail: 'Geçersiz e-posta',
    },
    en: {
      title: 'Email Settings',
      service: 'Email Service',
      enabled: 'Enabled',
      disabled: 'Disabled',
      provider: 'Provider',
      config: 'Configuration',
      apiKey: 'API Key',
      fromEmail: 'From Email',
      fromName: 'From Name',
      save: 'Save',
      test: 'Test Email',
      testEmail: 'Test Email Address',
      sendTest: 'Send Test',
      success: 'Success',
      configSaved: 'Settings saved',
      testSent: 'Test email sent',
      error: 'Error',
      fillFields: 'Please fill all fields',
      invalidEmail: 'Invalid email',
    },
  };

  const t = texts[language];

  const providers: { value: EmailProvider; label: string }[] = [
    { value: 'sendgrid', label: 'SendGrid' },
    { value: 'aws-ses', label: 'AWS SES' },
    { value: 'mailgun', label: 'Mailgun' },
    { value: 'postmark', label: 'Postmark' },
    { value: 'smtp', label: 'SMTP' },
    { value: 'custom', label: 'Custom' },
  ];

  const handleSave = async () => {
    if (!apiKey || !fromEmail || !fromName) {
      Alert.alert(t.error, t.fillFields);
      return;
    }

    await emailService.initialize({
      provider,
      apiKey,
      fromEmail,
      fromName,
    });

    setEmailEnabled(true);
    Alert.alert(t.success, t.configSaved);
  };

  const handleTest = async () => {
    if (!testEmail || !emailService.validateEmail(testEmail)) {
      Alert.alert(t.error, t.invalidEmail);
      return;
    }

    const result = await emailService.sendEmail({
      to: testEmail,
      subject: 'Test E-postası',
      body: 'Bu bir test e-postasıdır. E-posta servisiniz çalışıyor!',
      isHTML: false,
    });

    if (result) {
      Alert.alert(t.success, t.testSent);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.backgroundLight]}
        style={styles.gradient}
      >
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
          {/* Status */}
          <View style={styles.statusCard}>
            <Mail size={32} color={emailEnabled ? Colors.info : Colors.textSecondary} />
            <View style={styles.statusContent}>
              <Text style={styles.statusTitle}>
                {emailEnabled ? t.enabled : t.disabled}
              </Text>
            </View>
            <Switch
              value={emailEnabled}
              onValueChange={(v) => {
                emailService.setEnabled(v);
                setEmailEnabled(v);
              }}
              trackColor={{ false: Colors.surface, true: Colors.primaryDark }}
              thumbColor={emailEnabled ? Colors.info : Colors.textTertiary}
            />
          </View>

          {/* Provider Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.provider}</Text>
            <View style={styles.providerGrid}>
              {providers.map((p) => (
                <TouchableOpacity
                  key={p.value}
                  style={[
                    styles.providerCard,
                    provider === p.value && styles.providerCardActive,
                  ]}
                  onPress={() => setProvider(p.value)}
                >
                  <Globe
                    size={20}
                    color={provider === p.value ? Colors.info : Colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.providerText,
                      provider === p.value && styles.providerTextActive,
                    ]}
                  >
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Configuration */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.config}</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t.apiKey}</Text>
              <TextInput
                style={styles.input}
                placeholder="sk_..."
                placeholderTextColor={Colors.textTertiary}
                value={apiKey}
                onChangeText={setApiKey}
                autoCapitalize="none"
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t.fromEmail}</Text>
              <TextInput
                style={styles.input}
                placeholder="info@studio.com"
                placeholderTextColor={Colors.textTertiary}
                value={fromEmail}
                onChangeText={setFromEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t.fromName}</Text>
              <TextInput
                style={styles.input}
                placeholder="Pilates Studio"
                placeholderTextColor={Colors.textTertiary}
                value={fromName}
                onChangeText={setFromName}
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <LinearGradient
                colors={[Colors.info, '#2563eb']}
                style={styles.saveGradient}
              >
                <Save size={20} color={Colors.background} />
                <Text style={styles.saveButtonText}>{t.save}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Test */}
          {emailEnabled && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.test}</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t.testEmail}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="test@example.com"
                  placeholderTextColor={Colors.textTertiary}
                  value={testEmail}
                  onChangeText={setTestEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity style={styles.testButton} onPress={handleTest}>
                <LinearGradient
                  colors={[Colors.success, '#059669']}
                  style={styles.testGradient}
                >
                  <Send size={20} color={Colors.background} />
                  <Text style={styles.testButtonText}>{t.sendTest}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
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
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  providerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  providerCard: {
    flex: 1,
    minWidth: 100,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 6,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  providerCardActive: {
    borderColor: Colors.info,
    backgroundColor: Colors.surfaceLight,
  },
  providerText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  providerTextActive: {
    color: Colors.info,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
  },
  saveButton: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
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
  testButton: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  testGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 16,
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.background,
  },
});
