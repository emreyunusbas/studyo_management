/**
 * QR Scanner Screen - QR kod okuma ve check-in
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Vibration,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, Camera } from 'expo-camera';
import {
  ChevronLeft,
  Scan,
  CheckCircle,
  Flashlight,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { qrService } from '@/services/qrService';

export default function QRScannerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();
  const params = useLocalSearchParams();

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);

  const sessionId = params.sessionId as string | undefined;
  const sessionTitle = params.sessionTitle as string | undefined;

  const texts = {
    tr: {
      title: 'QR Kod Tara',
      scanPrompt: 'QR kodu kare içine alın',
      success: 'Check-in Başarılı!',
      error: 'Hata',
      invalidQR: 'Geçersiz QR kod',
      scanAgain: 'Tekrar Tara',
      memberCheckedIn: 'üye check-in yaptı',
      forSession: 'Seans:',
      noPermission: 'Kamera izni gerekli',
      requestPermission: 'İzin İste',
    },
    en: {
      title: 'Scan QR Code',
      scanPrompt: 'Place QR code inside the frame',
      success: 'Check-in Successful!',
      error: 'Error',
      invalidQR: 'Invalid QR code',
      scanAgain: 'Scan Again',
      memberCheckedIn: 'member checked in',
      forSession: 'Session:',
      noPermission: 'Camera permission required',
      requestPermission: 'Request Permission',
    },
  };

  const t = texts[language];

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;

    setScanned(true);
    Vibration.vibrate(100);

    const qrData = qrService.parseQRData(data);

    if (!qrData || qrData.type !== 'member') {
      Alert.alert(t.error, t.invalidQR, [
        { text: t.scanAgain, onPress: () => setScanned(false) },
      ]);
      return;
    }

    const checkIn = await qrService.processCheckIn(qrData, sessionId, sessionTitle);

    if (checkIn) {
      Alert.alert(
        t.success,
        `${checkIn.memberName} ${t.memberCheckedIn}${
          sessionTitle ? `\n${t.forSession} ${sessionTitle}` : ''
        }`,
        [{ text: 'OK', onPress: () => setScanned(false) }]
      );
    } else {
      Alert.alert(t.error, t.invalidQR, [
        { text: t.scanAgain, onPress: () => setScanned(false) },
      ]);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Kamera izni kontrol ediliyor...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>{t.noPermission}</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestCameraPermission}>
          <Text style={styles.permissionButtonText}>{t.requestPermission}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        enableTorch={flashEnabled}
      />

      <View style={styles.overlay}>
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>{t.title}</Text>
          <TouchableOpacity
            onPress={() => setFlashEnabled(!flashEnabled)}
            style={styles.flashButton}
          >
            <Flashlight size={24} color={flashEnabled ? Colors.primary : Colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.scanAreaContainer}>
          <View style={styles.scanArea}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>

        <View style={[styles.bottomInfo, { paddingBottom: insets.bottom + 20 }]}>
          <Scan size={40} color={Colors.primary} />
          <Text style={styles.scanPrompt}>{t.scanPrompt}</Text>
          {sessionTitle && (
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionLabel}>{t.forSession}</Text>
              <Text style={styles.sessionTitle}>{sessionTitle}</Text>
            </View>
          )}
        </View>
      </View>

      {scanned && (
        <View style={styles.successOverlay}>
          <LinearGradient
            colors={['rgba(16, 185, 129, 0.9)', 'rgba(5, 150, 105, 0.9)']}
            style={styles.successGradient}
          >
            <CheckCircle size={80} color={Colors.background} />
            <Text style={styles.successText}>{t.success}</Text>
          </LinearGradient>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
  message: { fontSize: 16, color: Colors.text, textAlign: 'center', paddingHorizontal: 40 },
  permissionButton: { marginTop: 20, paddingHorizontal: 30, paddingVertical: 12, backgroundColor: Colors.primary, borderRadius: 8 },
  permissionButtonText: { fontSize: 16, fontWeight: '700', color: Colors.background },
  overlay: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(10, 10, 11, 0.8)', justifyContent: 'center', alignItems: 'center' },
  flashButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(10, 10, 11, 0.8)', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: Colors.text },
  scanAreaContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scanArea: { width: 280, height: 280, position: 'relative' },
  corner: { position: 'absolute', width: 40, height: 40, borderColor: Colors.primary },
  topLeft: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 8 },
  topRight: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 8 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 8 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 8 },
  bottomInfo: { paddingHorizontal: 20, paddingTop: 40, alignItems: 'center', gap: 12 },
  scanPrompt: { fontSize: 16, fontWeight: '600', color: Colors.text, textAlign: 'center' },
  sessionInfo: { marginTop: 12, padding: 16, backgroundColor: 'rgba(26, 26, 29, 0.8)', borderRadius: 12, alignItems: 'center', gap: 4 },
  sessionLabel: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  sessionTitle: { fontSize: 16, fontWeight: '800', color: Colors.primary },
  successOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  successGradient: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', gap: 20 },
  successText: { fontSize: 32, fontWeight: '800', color: Colors.background },
});
