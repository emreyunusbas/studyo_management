/**
 * Member QR Code Screen - Üye QR kod gösterimi
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Download, Share2, Info } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import { Colors } from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { qrService } from '@/services/qrService';

export default function MemberQRScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();
  const params = useLocalSearchParams();

  const memberId = params.memberId as string;
  const memberName = params.memberName as string;

  // Generate QR code data
  const qrData = qrService.generateMemberQRData(memberId, memberName);

  const texts = {
    tr: {
      title: 'Üye QR Kodu',
      memberQR: 'Üye QR Kodu',
      scanToCheckIn: 'Check-in için bu QR kodu okutun',
      validFor: 'QR kod 24 saat geçerlidir',
      howToUse: 'Nasıl Kullanılır?',
      step1: 'Stüdyoya geldiğinizde bu QR kodu gösterin',
      step2: 'Eğitmen veya resepsiyon QR kodu okutacak',
      step3: 'Otomatik check-in yapılacak',
      share: 'Paylaş',
      download: 'İndir',
      info: 'Bilgi',
      qrInfo: 'Bu QR kod size özeldir ve 24 saat süreyle geçerlidir. Her giriş çıkışınızda kullanabilirsiniz.',
    },
    en: {
      title: 'Member QR Code',
      memberQR: 'Member QR Code',
      scanToCheckIn: 'Scan this QR code to check-in',
      validFor: 'QR code is valid for 24 hours',
      howToUse: 'How to Use?',
      step1: 'Show this QR code when you arrive at the studio',
      step2: 'Trainer or reception will scan the QR code',
      step3: 'Automatic check-in will be completed',
      share: 'Share',
      download: 'Download',
      info: 'Info',
      qrInfo: 'This QR code is unique to you and is valid for 24 hours. You can use it for every check-in.',
    },
  };

  const t = texts[language];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${memberName} - ${t.memberQR}\n${qrData}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
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
          {/* Member Info */}
          <View style={styles.memberCard}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={styles.memberGradient}
            >
              <Text style={styles.memberName}>{memberName}</Text>
              <Text style={styles.memberId}>ID: {memberId}</Text>
            </LinearGradient>
          </View>

          {/* QR Code */}
          <View style={styles.qrContainer}>
            <View style={styles.qrCard}>
              <View style={styles.qrWrapper}>
                <QRCode value={qrData} size={240} backgroundColor={Colors.text} color={Colors.background} />
              </View>
              <Text style={styles.qrLabel}>{t.scanToCheckIn}</Text>
              <Text style={styles.qrValidity}>{t.validFor}</Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Share2 size={20} color={Colors.info} />
              <Text style={styles.actionText}>{t.share}</Text>
            </TouchableOpacity>
          </View>

          {/* How to Use */}
          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <Info size={24} color={Colors.primary} />
              <Text style={styles.infoTitle}>{t.howToUse}</Text>
            </View>

            <View style={styles.stepsList}>
              <View style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={styles.stepText}>{t.step1}</Text>
              </View>

              <View style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepText}>{t.step2}</Text>
              </View>

              <View style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.stepText}>{t.step3}</Text>
              </View>
            </View>
          </View>

          {/* Info Note */}
          <View style={styles.noteCard}>
            <Text style={styles.noteText}>{t.qrInfo}</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: Colors.text },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, gap: 24 },
  memberCard: { borderRadius: 16, overflow: 'hidden' },
  memberGradient: { padding: 20, alignItems: 'center', gap: 8 },
  memberName: { fontSize: 24, fontWeight: '800', color: Colors.background },
  memberId: { fontSize: 14, fontWeight: '600', color: Colors.background, opacity: 0.8 },
  qrContainer: { alignItems: 'center' },
  qrCard: { backgroundColor: Colors.surface, borderRadius: 20, padding: 24, alignItems: 'center', gap: 16, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 8 },
  qrWrapper: { padding: 20, backgroundColor: Colors.text, borderRadius: 16 },
  qrLabel: { fontSize: 16, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  qrValidity: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, textAlign: 'center' },
  actionsRow: { flexDirection: 'row', gap: 12 },
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.surface, borderRadius: 12, padding: 16 },
  actionText: { fontSize: 15, fontWeight: '700', color: Colors.text },
  infoSection: { gap: 16 },
  infoHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  stepsList: { gap: 12 },
  stepItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: Colors.surface, borderRadius: 12, padding: 16 },
  stepNumber: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  stepNumberText: { fontSize: 16, fontWeight: '800', color: Colors.background },
  stepText: { flex: 1, fontSize: 14, fontWeight: '600', color: Colors.text, lineHeight: 20 },
  noteCard: { backgroundColor: Colors.surfaceLight, borderRadius: 12, padding: 16, borderLeftWidth: 4, borderLeftColor: Colors.primary },
  noteText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, lineHeight: 20 },
});
