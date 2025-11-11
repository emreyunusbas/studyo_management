/**
 * SMS Settings Screen - SMS konfigürasyonu ve geçmiş
 */

import React, { useState, useEffect } from 'react';
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
  MessageSquare,
  Settings,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  Smartphone,
  Globe,
  DollarSign,
  Save,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { smsService, SMSProvider } from '@/services/smsService';

export default function SMSSettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language, user } = useApp();

  const [smsEnabled, setSmsEnabled] = useState(false);
  const [provider, setProvider] = useState<SMSProvider>('twilio');
  const [accountSid, setAccountSid] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [testPhoneNumber, setTestPhoneNumber] = useState('');

  // SMS Statistics
  const [statistics, setStatistics] = useState({
    total: 0,
    sent: 0,
    delivered: 0,
    failed: 0,
    pending: 0,
  });

  const texts = {
    tr: {
      title: 'SMS Ayarları',
      smsService: 'SMS Servisi',
      enabled: 'Aktif',
      disabled: 'Devre Dışı',
      provider: 'SMS Sağlayıcı',
      selectProvider: 'Sağlayıcı Seçin',
      configuration: 'Konfigürasyon',
      accountSid: 'Account SID',
      authToken: 'Auth Token',
      phoneNumber: 'Gönderen Telefon',
      apiKey: 'API Key',
      apiSecret: 'API Secret',
      saveConfig: 'Ayarları Kaydet',
      testing: 'Test',
      testPhone: 'Test Telefon Numarası',
      sendTest: 'Test SMS Gönder',
      statistics: 'İstatistikler',
      totalSent: 'Toplam Gönderilen',
      successful: 'Başarılı',
      failed: 'Başarısız',
      pending: 'Beklemede',
      history: 'SMS Geçmişi',
      viewHistory: 'Geçmişi Görüntüle',
      clearHistory: 'Geçmişi Temizle',
      templates: 'Şablonlar',
      sessionReminder: 'Seans Hatırlatma',
      paymentReminder: 'Ödeme Hatırlatma',
      welcome: 'Hoşgeldin Mesajı',
      booking: 'Rezervasyon Onayı',
      success: 'Başarılı',
      configSaved: 'SMS ayarları kaydedildi',
      testSent: 'Test SMS gönderildi',
      error: 'Hata',
      fillAllFields: 'Lütfen tüm alanları doldurun',
      invalidPhone: 'Geçersiz telefon numarası',
      providers: {
        twilio: 'Twilio',
        'aws-sns': 'AWS SNS',
        vonage: 'Vonage',
        messagebird: 'MessageBird',
        custom: 'Özel API',
      },
    },
    en: {
      title: 'SMS Settings',
      smsService: 'SMS Service',
      enabled: 'Enabled',
      disabled: 'Disabled',
      provider: 'SMS Provider',
      selectProvider: 'Select Provider',
      configuration: 'Configuration',
      accountSid: 'Account SID',
      authToken: 'Auth Token',
      phoneNumber: 'Sender Phone',
      apiKey: 'API Key',
      apiSecret: 'API Secret',
      saveConfig: 'Save Settings',
      testing: 'Testing',
      testPhone: 'Test Phone Number',
      sendTest: 'Send Test SMS',
      statistics: 'Statistics',
      totalSent: 'Total Sent',
      successful: 'Successful',
      failed: 'Failed',
      pending: 'Pending',
      history: 'SMS History',
      viewHistory: 'View History',
      clearHistory: 'Clear History',
      templates: 'Templates',
      sessionReminder: 'Session Reminder',
      paymentReminder: 'Payment Reminder',
      welcome: 'Welcome Message',
      booking: 'Booking Confirmation',
      success: 'Success',
      configSaved: 'SMS settings saved',
      testSent: 'Test SMS sent',
      error: 'Error',
      fillAllFields: 'Please fill all fields',
      invalidPhone: 'Invalid phone number',
      providers: {
        twilio: 'Twilio',
        'aws-sns': 'AWS SNS',
        vonage: 'Vonage',
        messagebird: 'MessageBird',
        custom: 'Custom API',
      },
    },
  };

  const t = texts[language];

  useEffect(() => {
    loadConfig();
    updateStatistics();
  }, []);

  const loadConfig = () => {
    const config = smsService.getConfig();
    if (config) {
      setProvider(config.provider);
      setAccountSid(config.accountSid || '');
      setAuthToken(config.authToken || '');
      setPhoneNumber(config.phoneNumber || '');
      setApiKey(config.apiKey || '');
      setApiSecret(config.apiSecret || '');
      setSmsEnabled(smsService.isEnabled());
    }
  };

  const updateStatistics = () => {
    const stats = smsService.getStatistics();
    setStatistics(stats);
  };

  const handleSaveConfig = async () => {
    if (provider === 'twilio' && (!accountSid || !authToken || !phoneNumber)) {
      Alert.alert(t.error, t.fillAllFields);
      return;
    }

    await smsService.initialize({
      provider,
      accountSid,
      authToken,
      phoneNumber,
      apiKey,
      apiSecret,
    });

    setSmsEnabled(true);
    Alert.alert(t.success, t.configSaved);
  };

  const handleSendTest = async () => {
    if (!testPhoneNumber) {
      Alert.alert(t.error, t.fillAllFields);
      return;
    }

    if (!smsService.validatePhoneNumber(testPhoneNumber)) {
      Alert.alert(t.error, t.invalidPhone);
      return;
    }

    const result = await smsService.sendSMS({
      to: testPhoneNumber,
      message: 'Bu bir test mesajıdır. SMS servisiniz çalışıyor!',
    });

    if (result) {
      Alert.alert(t.success, t.testSent);
      updateStatistics();
    } else {
      Alert.alert(t.error, 'SMS gönderilemedi');
    }
  };

  const handleClearHistory = () => {
    Alert.alert(
      t.clearHistory,
      'Tüm SMS geçmişini silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            await smsService.clearHistory();
            updateStatistics();
            Alert.alert(t.success, 'Geçmiş temizlendi');
          },
        },
      ]
    );
  };

  const providers: SMSProvider[] = [
    'twilio',
    'aws-sns',
    'vonage',
    'messagebird',
    'custom',
  ];

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
          {/* SMS Service Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.smsService}</Text>

            <View style={styles.statusCard}>
              <View style={styles.statusIcon}>
                <MessageSquare
                  size={32}
                  color={smsEnabled ? Colors.primary : Colors.textSecondary}
                />
              </View>
              <View style={styles.statusContent}>
                <Text style={styles.statusTitle}>
                  {smsEnabled ? t.enabled : t.disabled}
                </Text>
                <Text style={styles.statusDesc}>
                  {smsEnabled
                    ? `${t.providers[provider]} kullanılıyor`
                    : 'SMS servisi yapılandırılmamış'}
                </Text>
              </View>
              <Switch
                value={smsEnabled}
                onValueChange={(value) => {
                  smsService.setEnabled(value);
                  setSmsEnabled(value);
                }}
                trackColor={{ false: Colors.surface, true: Colors.primaryDark }}
                thumbColor={smsEnabled ? Colors.primary : Colors.textTertiary}
              />
            </View>
          </View>

          {/* Provider Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.provider}</Text>

            <View style={styles.providerGrid}>
              {providers.map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.providerCard,
                    provider === p && styles.providerCardActive,
                  ]}
                  onPress={() => setProvider(p)}
                >
                  <Globe
                    size={24}
                    color={provider === p ? Colors.primary : Colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.providerText,
                      provider === p && styles.providerTextActive,
                    ]}
                  >
                    {t.providers[p]}
                  </Text>
                  {provider === p && (
                    <View style={styles.providerCheck}>
                      <CheckCircle size={16} color={Colors.primary} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Configuration */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.configuration}</Text>

            {provider === 'twilio' && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{t.accountSid}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    placeholderTextColor={Colors.textTertiary}
                    value={accountSid}
                    onChangeText={setAccountSid}
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{t.authToken}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="your_auth_token_here"
                    placeholderTextColor={Colors.textTertiary}
                    value={authToken}
                    onChangeText={setAuthToken}
                    autoCapitalize="none"
                    secureTextEntry
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{t.phoneNumber}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="+1234567890"
                    placeholderTextColor={Colors.textTertiary}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                  />
                </View>
              </>
            )}

            {(provider === 'aws-sns' ||
              provider === 'vonage' ||
              provider === 'messagebird' ||
              provider === 'custom') && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{t.apiKey}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="your_api_key_here"
                    placeholderTextColor={Colors.textTertiary}
                    value={apiKey}
                    onChangeText={setApiKey}
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{t.apiSecret}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="your_api_secret_here"
                    placeholderTextColor={Colors.textTertiary}
                    value={apiSecret}
                    onChangeText={setApiSecret}
                    autoCapitalize="none"
                    secureTextEntry
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{t.phoneNumber}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="+1234567890"
                    placeholderTextColor={Colors.textTertiary}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                  />
                </View>
              </>
            )}

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveConfig}>
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                style={styles.saveGradient}
              >
                <Save size={20} color={Colors.background} />
                <Text style={styles.saveButtonText}>{t.saveConfig}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Testing */}
          {smsEnabled && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.testing}</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t.testPhone}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+905551234567"
                  placeholderTextColor={Colors.textTertiary}
                  value={testPhoneNumber}
                  onChangeText={setTestPhoneNumber}
                  keyboardType="phone-pad"
                />
              </View>

              <TouchableOpacity style={styles.testButton} onPress={handleSendTest}>
                <LinearGradient
                  colors={[Colors.info, '#2563eb']}
                  style={styles.testGradient}
                >
                  <Send size={20} color={Colors.background} />
                  <Text style={styles.testButtonText}>{t.sendTest}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* Statistics */}
          {smsEnabled && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.statistics}</Text>

              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <MessageSquare size={28} color={Colors.primary} />
                  <Text style={styles.statValue}>{statistics.total}</Text>
                  <Text style={styles.statLabel}>{t.totalSent}</Text>
                </View>

                <View style={styles.statCard}>
                  <CheckCircle size={28} color={Colors.success} />
                  <Text style={styles.statValue}>{statistics.sent}</Text>
                  <Text style={styles.statLabel}>{t.successful}</Text>
                </View>

                <View style={styles.statCard}>
                  <XCircle size={28} color={Colors.error} />
                  <Text style={styles.statValue}>{statistics.failed}</Text>
                  <Text style={styles.statLabel}>{t.failed}</Text>
                </View>

                <View style={styles.statCard}>
                  <Clock size={28} color={Colors.warning} />
                  <Text style={styles.statValue}>{statistics.pending}</Text>
                  <Text style={styles.statLabel}>{t.pending}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.clearHistoryButton}
                onPress={handleClearHistory}
              >
                <Text style={styles.clearHistoryText}>{t.clearHistory}</Text>
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
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  statusIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContent: {
    flex: 1,
    gap: 4,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  statusDesc: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  providerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  providerCard: {
    position: 'relative',
    minWidth: 100,
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  providerCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceLight,
  },
  providerText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  providerTextActive: {
    color: Colors.primary,
  },
  providerCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
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
  testButton: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.info,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  clearHistoryButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  clearHistoryText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.error,
  },
});
