/**
 * Member Reports Screen - Upload and view member reports
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  ChevronDown,
  X,
  Upload,
  FileText,
  Image as ImageIcon,
  Camera,
  Download,
  Calendar,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { MOCK_MEMBERS } from '@/constants/mockData';
import { useApp } from '@/contexts/AppContext';

interface Report {
  id: string;
  memberId: string;
  title: string;
  type: 'pdf' | 'image';
  fileUrl: string;
  uploadDate: string;
  notes?: string;
}

// Mock reports data
const MOCK_REPORTS: Report[] = [
  {
    id: '1',
    memberId: '1',
    title: 'Kan Tahlili Raporu',
    type: 'pdf',
    fileUrl: 'https://example.com/report1.pdf',
    uploadDate: '2025-11-05',
    notes: 'Yıllık kontrol',
  },
  {
    id: '2',
    memberId: '1',
    title: 'MR Sonucu',
    type: 'image',
    fileUrl: 'https://example.com/mr.jpg',
    uploadDate: '2025-10-20',
  },
];

export default function MemberReportsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();
  const params = useLocalSearchParams();
  const preselectedMemberId = params.memberId as string | undefined;

  const [selectedMemberId, setSelectedMemberId] = useState(preselectedMemberId || '');
  const [showMemberPicker, setShowMemberPicker] = useState(false);
  const [showUploadOptions, setShowUploadOptions] = useState(false);

  const texts = {
    tr: {
      title: 'Raporlar',
      selectMember: 'Üye Seç',
      uploadReport: 'Rapor Yükle',
      reports: 'Rapor Listesi',
      noReports: 'Henüz rapor yüklenmemiş',
      uploadOptions: {
        title: 'Rapor Yükle',
        pdf: 'PDF Yükle',
        image: 'Fotoğraf Yükle',
        camera: 'Fotoğraf Çek',
      },
      download: 'İndir',
      view: 'Görüntüle',
      uploadDate: 'Yükleme Tarihi',
    },
    en: {
      title: 'Reports',
      selectMember: 'Select Member',
      uploadReport: 'Upload Report',
      reports: 'Report List',
      noReports: 'No reports uploaded yet',
      uploadOptions: {
        title: 'Upload Report',
        pdf: 'Upload PDF',
        image: 'Upload Photo',
        camera: 'Take Photo',
      },
      download: 'Download',
      view: 'View',
      uploadDate: 'Upload Date',
    },
  };

  const t = texts[language];

  const selectedMember = MOCK_MEMBERS.find((m) => m.id === selectedMemberId);
  const memberReports = MOCK_REPORTS.filter((r) => r.memberId === selectedMemberId);

  const handleUploadOption = async (type: 'pdf' | 'image' | 'camera') => {
    setShowUploadOptions(false);

    // TODO: Implement file picker and camera
    Alert.alert('Bilgi', `${type} yükleme özelliği yakında eklenecek`);
  };

  const handleDownload = (report: Report) => {
    // TODO: Implement download
    Alert.alert('Bilgi', 'İndirme özelliği yakında eklenecek');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
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
          {selectedMemberId && (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => setShowUploadOptions(true)}
            >
              <Upload size={24} color={Colors.background} />
            </TouchableOpacity>
          )}
          {!selectedMemberId && <View style={{ width: 40 }} />}
        </View>

        {/* Member Selection */}
        <View style={styles.memberSection}>
          <TouchableOpacity
            style={styles.memberSelector}
            onPress={() => setShowMemberPicker(true)}
          >
            <Text
              style={[
                styles.memberSelectorText,
                !selectedMember && { color: Colors.textTertiary },
              ]}
            >
              {selectedMember
                ? `${selectedMember.firstName} ${selectedMember.lastName}`
                : t.selectMember}
            </Text>
            <ChevronDown size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Reports List */}
        {selectedMember && (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + 20 },
            ]}
          >
            {memberReports.length === 0 ? (
              <View style={styles.emptyState}>
                <FileText size={64} color={Colors.textTertiary} />
                <Text style={styles.emptyText}>{t.noReports}</Text>
              </View>
            ) : (
              memberReports.map((report) => (
                <TouchableOpacity
                  key={report.id}
                  style={styles.reportCard}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={[Colors.surface, Colors.surfaceLight]}
                    style={styles.reportCardGradient}
                  >
                    <View style={styles.reportIcon}>
                      {report.type === 'pdf' ? (
                        <FileText size={32} color={Colors.indigo} />
                      ) : (
                        <ImageIcon size={32} color={Colors.accent} />
                      )}
                    </View>

                    <View style={styles.reportInfo}>
                      <Text style={styles.reportTitle}>{report.title}</Text>
                      <View style={styles.reportMeta}>
                        <Calendar size={14} color={Colors.textSecondary} />
                        <Text style={styles.reportDate}>
                          {formatDate(report.uploadDate)}
                        </Text>
                      </View>
                      {report.notes && (
                        <Text style={styles.reportNotes}>{report.notes}</Text>
                      )}
                    </View>

                    <TouchableOpacity
                      style={styles.downloadButton}
                      onPress={() => handleDownload(report)}
                    >
                      <Download size={20} color={Colors.primary} />
                    </TouchableOpacity>
                  </LinearGradient>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )}

        {/* Member Picker Modal */}
        <Modal
          visible={showMemberPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowMemberPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t.selectMember}</Text>
                <TouchableOpacity onPress={() => setShowMemberPicker(false)}>
                  <X size={24} color={Colors.text} />
                </TouchableOpacity>
              </View>
              <ScrollView>
                {MOCK_MEMBERS.map((member) => (
                  <TouchableOpacity
                    key={member.id}
                    style={styles.memberItem}
                    onPress={() => {
                      setSelectedMemberId(member.id);
                      setShowMemberPicker(false);
                    }}
                  >
                    <View style={styles.memberAvatar}>
                      <Text style={styles.memberAvatarText}>
                        {member.firstName[0]}
                        {member.lastName[0]}
                      </Text>
                    </View>
                    <Text style={styles.memberName}>
                      {member.firstName} {member.lastName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Upload Options Modal */}
        <Modal
          visible={showUploadOptions}
          transparent
          animationType="slide"
          onRequestClose={() => setShowUploadOptions(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t.uploadOptions.title}</Text>
                <TouchableOpacity onPress={() => setShowUploadOptions(false)}>
                  <X size={24} color={Colors.text} />
                </TouchableOpacity>
              </View>

              <View style={styles.uploadOptions}>
                <TouchableOpacity
                  style={styles.uploadOption}
                  onPress={() => handleUploadOption('pdf')}
                >
                  <LinearGradient
                    colors={[Colors.surface, Colors.surfaceLight]}
                    style={styles.uploadOptionGradient}
                  >
                    <FileText size={32} color={Colors.indigo} />
                    <Text style={styles.uploadOptionText}>{t.uploadOptions.pdf}</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.uploadOption}
                  onPress={() => handleUploadOption('image')}
                >
                  <LinearGradient
                    colors={[Colors.surface, Colors.surfaceLight]}
                    style={styles.uploadOptionGradient}
                  >
                    <ImageIcon size={32} color={Colors.accent} />
                    <Text style={styles.uploadOptionText}>{t.uploadOptions.image}</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.uploadOption}
                  onPress={() => handleUploadOption('camera')}
                >
                  <LinearGradient
                    colors={[Colors.surface, Colors.surfaceLight]}
                    style={styles.uploadOptionGradient}
                  >
                    <Camera size={32} color={Colors.secondary} />
                    <Text style={styles.uploadOptionText}>{t.uploadOptions.camera}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  uploadButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.indigo,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  memberSelector: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberSelectorText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  reportCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: Colors.indigo,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reportCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  reportIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportInfo: {
    flex: 1,
    gap: 6,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  reportMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reportDate: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  reportNotes: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  downloadButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
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
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.background,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  uploadOptions: {
    padding: 20,
    gap: 12,
  },
  uploadOption: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  uploadOptionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  uploadOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
});
