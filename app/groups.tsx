/**
 * Groups Management Screen - Create and manage member groups
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
  Plus,
  Users,
  Calendar,
  User,
  Edit,
  Trash2,
  UserPlus,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { MOCK_MEMBERS } from '@/constants/mockData';
import { useApp } from '@/contexts/AppContext';

interface Group {
  id: string;
  name: string;
  description?: string;
  memberIds: string[];
  color: string;
  createdAt: string;
  schedule?: string;
}

// Mock groups
const INITIAL_GROUPS: Group[] = [
  {
    id: '1',
    name: 'Sabah Grubu',
    description: 'Hafta içi sabah seansları',
    memberIds: ['1', '2'],
    color: Colors.primary,
    createdAt: '2025-01-01',
    schedule: 'Pazartesi, Çarşamba, Cuma 09:00',
  },
  {
    id: '2',
    name: 'Akşam Grubu',
    description: 'Hafta içi akşam seansları',
    memberIds: ['3'],
    color: Colors.secondary,
    createdAt: '2025-01-05',
    schedule: 'Salı, Perşembe 18:00',
  },
  {
    id: '3',
    name: 'Hafta Sonu Özel',
    description: 'Cumartesi öğleden sonra',
    memberIds: [],
    color: Colors.accent,
    createdAt: '2025-01-08',
    schedule: 'Cumartesi 14:00',
  },
];

const GROUP_COLORS = [
  Colors.primary,
  Colors.secondary,
  Colors.accent,
  Colors.info,
  Colors.success,
  Colors.warning,
];

export default function GroupsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();

  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  // Form state
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupSchedule, setGroupSchedule] = useState('');
  const [selectedColor, setSelectedColor] = useState(GROUP_COLORS[0]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const texts = {
    tr: {
      title: 'Grup Yönetimi',
      addGroup: 'Yeni Grup',
      groups: 'Gruplar',
      noGroups: 'Henüz grup yok',
      createFirstGroup: 'İlk grubunuzu oluşturun',
      members: 'Üye',
      membersPlural: 'Üye',
      noMembers: 'Henüz üye yok',
      viewMembers: 'Üyeleri Gör',
      addMembers: 'Üye Ekle',
      editGroup: 'Grubu Düzenle',
      deleteGroup: 'Grubu Sil',
      groupName: 'Grup Adı',
      groupNamePlaceholder: 'Örn: Sabah Grubu',
      description: 'Açıklama',
      descriptionPlaceholder: 'Grup açıklaması (opsiyonel)',
      schedule: 'Program',
      schedulePlaceholder: 'Örn: Pazartesi, Çarşamba 09:00',
      selectColor: 'Renk Seç',
      selectMembers: 'Üye Seç',
      save: 'Kaydet',
      cancel: 'İptal',
      create: 'Oluştur',
      delete: 'Sil',
      confirmDelete: 'Grubu Sil?',
      confirmDeleteMessage: 'Bu grubu silmek istediğinizden emin misiniz?',
      success: 'Başarılı',
      groupCreated: 'Grup oluşturuldu',
      groupUpdated: 'Grup güncellendi',
      groupDeleted: 'Grup silindi',
      error: 'Hata',
      enterGroupName: 'Lütfen grup adı girin',
      selected: 'seçildi',
    },
    en: {
      title: 'Groups Management',
      addGroup: 'New Group',
      groups: 'Groups',
      noGroups: 'No groups yet',
      createFirstGroup: 'Create your first group',
      members: 'Member',
      membersPlural: 'Members',
      noMembers: 'No members yet',
      viewMembers: 'View Members',
      addMembers: 'Add Members',
      editGroup: 'Edit Group',
      deleteGroup: 'Delete Group',
      groupName: 'Group Name',
      groupNamePlaceholder: 'e.g., Morning Group',
      description: 'Description',
      descriptionPlaceholder: 'Group description (optional)',
      schedule: 'Schedule',
      schedulePlaceholder: 'e.g., Monday, Wednesday 09:00',
      selectColor: 'Select Color',
      selectMembers: 'Select Members',
      save: 'Save',
      cancel: 'Cancel',
      create: 'Create',
      delete: 'Delete',
      confirmDelete: 'Delete Group?',
      confirmDeleteMessage: 'Are you sure you want to delete this group?',
      success: 'Success',
      groupCreated: 'Group created',
      groupUpdated: 'Group updated',
      groupDeleted: 'Group deleted',
      error: 'Error',
      enterGroupName: 'Please enter group name',
      selected: 'selected',
    },
  };

  const t = texts[language];

  const resetForm = () => {
    setGroupName('');
    setGroupDescription('');
    setGroupSchedule('');
    setSelectedColor(GROUP_COLORS[0]);
    setSelectedMembers([]);
    setSelectedGroup(null);
  };

  const handleAddGroup = () => {
    if (!groupName.trim()) {
      Alert.alert(t.error, t.enterGroupName);
      return;
    }

    const newGroup: Group = {
      id: Date.now().toString(),
      name: groupName.trim(),
      description: groupDescription.trim() || undefined,
      schedule: groupSchedule.trim() || undefined,
      memberIds: selectedMembers,
      color: selectedColor,
      createdAt: new Date().toISOString(),
    };

    setGroups([newGroup, ...groups]);
    setShowAddModal(false);
    resetForm();
    Alert.alert(t.success, t.groupCreated);
  };

  const handleEditGroup = () => {
    if (!selectedGroup || !groupName.trim()) {
      Alert.alert(t.error, t.enterGroupName);
      return;
    }

    const updatedGroups = groups.map((g) =>
      g.id === selectedGroup.id
        ? {
            ...g,
            name: groupName.trim(),
            description: groupDescription.trim() || undefined,
            schedule: groupSchedule.trim() || undefined,
            memberIds: selectedMembers,
            color: selectedColor,
          }
        : g
    );

    setGroups(updatedGroups);
    setShowAddModal(false);
    resetForm();
    Alert.alert(t.success, t.groupUpdated);
  };

  const handleDeleteGroup = (group: Group) => {
    Alert.alert(t.confirmDelete, t.confirmDeleteMessage, [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.delete,
        style: 'destructive',
        onPress: () => {
          setGroups(groups.filter((g) => g.id !== group.id));
          Alert.alert(t.success, t.groupDeleted);
        },
      },
    ]);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (group: Group) => {
    setSelectedGroup(group);
    setGroupName(group.name);
    setGroupDescription(group.description || '');
    setGroupSchedule(group.schedule || '');
    setSelectedColor(group.color);
    setSelectedMembers(group.memberIds);
    setShowAddModal(true);
  };

  const openMembersModal = (group: Group) => {
    setSelectedGroup(group);
    setShowMembersModal(true);
  };

  const toggleMemberSelection = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const getGroupMembers = (group: Group) => {
    return MOCK_MEMBERS.filter((m) => group.memberIds.includes(m.id));
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
          <TouchableOpacity onPress={openAddModal} style={styles.addButton}>
            <Plus size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
        >
          {groups.length > 0 ? (
            groups.map((group) => {
              const members = getGroupMembers(group);
              return (
                <View key={group.id} style={styles.groupCard}>
                  <LinearGradient
                    colors={[Colors.surface, Colors.surfaceLight]}
                    style={styles.groupGradient}
                  >
                    {/* Group Header */}
                    <View style={styles.groupHeader}>
                      <View
                        style={[
                          styles.groupColorIndicator,
                          { backgroundColor: group.color },
                        ]}
                      />
                      <View style={styles.groupHeaderInfo}>
                        <Text style={styles.groupName}>{group.name}</Text>
                        {group.description && (
                          <Text style={styles.groupDescription}>
                            {group.description}
                          </Text>
                        )}
                      </View>
                    </View>

                    {/* Schedule */}
                    {group.schedule && (
                      <View style={styles.scheduleRow}>
                        <Calendar size={16} color={Colors.primary} />
                        <Text style={styles.scheduleText}>{group.schedule}</Text>
                      </View>
                    )}

                    {/* Members Count */}
                    <View style={styles.membersRow}>
                      <Users size={16} color={Colors.textSecondary} />
                      <Text style={styles.membersCount}>
                        {group.memberIds.length}{' '}
                        {group.memberIds.length === 1 ? t.members : t.membersPlural}
                      </Text>
                    </View>

                    {/* Members Preview */}
                    {members.length > 0 && (
                      <View style={styles.membersPreview}>
                        {members.slice(0, 3).map((member) => (
                          <View key={member.id} style={styles.memberBadge}>
                            <Text style={styles.memberBadgeText}>
                              {member.firstName[0]}
                              {member.lastName[0]}
                            </Text>
                          </View>
                        ))}
                        {members.length > 3 && (
                          <View style={styles.moreBadge}>
                            <Text style={styles.moreBadgeText}>
                              +{members.length - 3}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}

                    {/* Actions */}
                    <View style={styles.groupActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => openMembersModal(group)}
                      >
                        <UserPlus size={18} color={Colors.primary} />
                        <Text style={styles.actionButtonText}>
                          {members.length > 0 ? t.viewMembers : t.addMembers}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => openEditModal(group)}
                      >
                        <Edit size={18} color={Colors.info} />
                        <Text style={styles.actionButtonText}>{t.editGroup}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleDeleteGroup(group)}
                      >
                        <Trash2 size={18} color={Colors.error} />
                        <Text style={[styles.actionButtonText, { color: Colors.error }]}>
                          {t.deleteGroup}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Users size={64} color={Colors.textTertiary} />
              <Text style={styles.emptyStateText}>{t.noGroups}</Text>
              <Text style={styles.emptyStateSubtext}>{t.createFirstGroup}</Text>
            </View>
          )}
        </ScrollView>

        {/* Add/Edit Group Modal */}
        {showAddModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {selectedGroup ? t.editGroup : t.addGroup}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                >
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent}>
                <View style={styles.formContainer}>
                  {/* Group Name */}
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>{t.groupName}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder={t.groupNamePlaceholder}
                      placeholderTextColor={Colors.textTertiary}
                      value={groupName}
                      onChangeText={setGroupName}
                    />
                  </View>

                  {/* Description */}
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>{t.description}</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder={t.descriptionPlaceholder}
                      placeholderTextColor={Colors.textTertiary}
                      value={groupDescription}
                      onChangeText={setGroupDescription}
                      multiline
                      numberOfLines={2}
                    />
                  </View>

                  {/* Schedule */}
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>{t.schedule}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder={t.schedulePlaceholder}
                      placeholderTextColor={Colors.textTertiary}
                      value={groupSchedule}
                      onChangeText={setGroupSchedule}
                    />
                  </View>

                  {/* Color Selector */}
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>{t.selectColor}</Text>
                    <View style={styles.colorSelector}>
                      {GROUP_COLORS.map((color) => (
                        <TouchableOpacity
                          key={color}
                          style={[
                            styles.colorOption,
                            { backgroundColor: color },
                            selectedColor === color && styles.colorOptionSelected,
                          ]}
                          onPress={() => setSelectedColor(color)}
                        >
                          {selectedColor === color && (
                            <Text style={styles.colorCheckmark}>✓</Text>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Member Selector */}
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>
                      {t.selectMembers} ({selectedMembers.length} {t.selected})
                    </Text>
                    <View style={styles.memberSelector}>
                      {MOCK_MEMBERS.map((member) => {
                        const isSelected = selectedMembers.includes(member.id);
                        return (
                          <TouchableOpacity
                            key={member.id}
                            style={[
                              styles.memberSelectOption,
                              isSelected && styles.memberSelectOptionSelected,
                            ]}
                            onPress={() => toggleMemberSelection(member.id)}
                          >
                            <View style={styles.memberSelectAvatar}>
                              <Text style={styles.memberSelectAvatarText}>
                                {member.firstName[0]}
                                {member.lastName[0]}
                              </Text>
                            </View>
                            <Text style={styles.memberSelectName}>
                              {member.firstName} {member.lastName}
                            </Text>
                            {isSelected && (
                              <View style={styles.memberSelectCheckmark}>
                                <Text style={styles.memberSelectCheckmarkText}>✓</Text>
                              </View>
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  {/* Buttons */}
                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.modalButtonCancel]}
                      onPress={() => {
                        setShowAddModal(false);
                        resetForm();
                      }}
                    >
                      <Text style={styles.modalButtonTextCancel}>{t.cancel}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.modalButton, styles.modalButtonSave]}
                      onPress={selectedGroup ? handleEditGroup : handleAddGroup}
                    >
                      <LinearGradient
                        colors={[Colors.primary, Colors.primaryDark]}
                        style={styles.modalButtonGradient}
                      >
                        <Text style={styles.modalButtonText}>
                          {selectedGroup ? t.save : t.create}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        )}

        {/* View Members Modal */}
        {showMembersModal && selectedGroup && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {selectedGroup.name} - {t.membersPlural}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowMembersModal(false);
                    setSelectedGroup(null);
                  }}
                >
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent}>
                {getGroupMembers(selectedGroup).length > 0 ? (
                  getGroupMembers(selectedGroup).map((member) => (
                    <View key={member.id} style={styles.memberListItem}>
                      <View style={styles.memberListAvatar}>
                        <Text style={styles.memberListAvatarText}>
                          {member.firstName[0]}
                          {member.lastName[0]}
                        </Text>
                      </View>
                      <View style={styles.memberListInfo}>
                        <Text style={styles.memberListName}>
                          {member.firstName} {member.lastName}
                        </Text>
                        <Text style={styles.memberListDetail}>
                          {member.remainingCredits}/{member.openableCredits} seans
                        </Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyMembers}>
                    <User size={48} color={Colors.textTertiary} />
                    <Text style={styles.emptyMembersText}>{t.noMembers}</Text>
                  </View>
                )}
              </ScrollView>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  groupCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  groupGradient: {
    padding: 20,
    gap: 12,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  groupColorIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  groupHeaderInfo: {
    flex: 1,
    gap: 4,
  },
  groupName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  groupDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scheduleText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  membersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  membersCount: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  membersPreview: {
    flexDirection: 'row',
    gap: 8,
  },
  memberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.background,
  },
  moreBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  groupActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceLight,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  emptyState: {
    paddingVertical: 100,
    alignItems: 'center',
    gap: 12,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.textTertiary,
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
    maxHeight: '85%',
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
    maxHeight: 600,
  },
  formContainer: {
    padding: 20,
    gap: 20,
  },
  formGroup: {
    gap: 8,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  colorSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  colorOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: Colors.text,
  },
  colorCheckmark: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.background,
  },
  memberSelector: {
    gap: 8,
  },
  memberSelectOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.surfaceLight,
  },
  memberSelectOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceLight,
  },
  memberSelectAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberSelectAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.background,
  },
  memberSelectName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  memberSelectCheckmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberSelectCheckmarkText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.background,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalButtonCancel: {
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalButtonSave: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  modalButtonGradient: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.background,
  },
  modalButtonTextCancel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  memberListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceLight,
  },
  memberListAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberListAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.background,
  },
  memberListInfo: {
    flex: 1,
    gap: 4,
  },
  memberListName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  memberListDetail: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  emptyMembers: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 12,
  },
  emptyMembersText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
