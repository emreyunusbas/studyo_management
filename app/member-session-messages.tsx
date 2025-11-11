/**
 * Member Session Messages Screen - Chat interface for member-trainer communication
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  ChevronDown,
  Send,
  User,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { MOCK_MEMBERS } from '@/constants/mockData';
import { useApp } from '@/contexts/AppContext';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isTrainer: boolean;
}

// Mock messages
const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    senderId: 'trainer-1',
    senderName: 'Eğitmen',
    text: 'Merhaba! Bugünkü seansınız için hazır mısınız?',
    timestamp: '2025-01-10T09:00:00',
    isTrainer: true,
  },
  {
    id: '2',
    senderId: 'member-1',
    senderName: 'Ahmet Yılmaz',
    text: 'Merhaba, evet hazırım. Bugün hangi hareketleri yapacağız?',
    timestamp: '2025-01-10T09:05:00',
    isTrainer: false,
  },
  {
    id: '3',
    senderId: 'trainer-1',
    senderName: 'Eğitmen',
    text: 'Bugün core güçlendirme hareketlerine odaklanacağız. Reformer egzersizleri yapacağız.',
    timestamp: '2025-01-10T09:10:00',
    isTrainer: true,
  },
  {
    id: '4',
    senderId: 'member-1',
    senderName: 'Ahmet Yılmaz',
    text: 'Harika! Geçen seferkiler çok işe yaradı, bel ağrım azaldı.',
    timestamp: '2025-01-10T09:12:00',
    isTrainer: false,
  },
  {
    id: '5',
    senderId: 'trainer-1',
    senderName: 'Eğitmen',
    text: 'Çok sevindim! O zaman bugün de aynı yönde ilerleyelim. Görüşmek üzere!',
    timestamp: '2025-01-10T09:15:00',
    isTrainer: true,
  },
];

export default function MemberSessionMessagesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();
  const params = useLocalSearchParams();

  const [selectedMember, setSelectedMember] = useState(
    params.memberId
      ? MOCK_MEMBERS.find((m) => m.id === params.memberId) || null
      : null
  );
  const [showMemberPicker, setShowMemberPicker] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);

  const texts = {
    tr: {
      title: 'Seans Mesajları',
      selectMember: 'Üye Seç',
      noMemberSelected: 'Lütfen bir üye seçin',
      typeMessage: 'Mesajınızı yazın...',
      noMessages: 'Henüz mesaj yok',
      startConversation: 'Konuşmaya başlamak için bir mesaj gönderin',
      you: 'Siz',
      member: 'Üye',
    },
    en: {
      title: 'Session Messages',
      selectMember: 'Select Member',
      noMemberSelected: 'Please select a member',
      typeMessage: 'Type your message...',
      noMessages: 'No messages yet',
      startConversation: 'Send a message to start the conversation',
      you: 'You',
      member: 'Member',
    },
  };

  const t = texts[language];

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Bugün';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Dün';
    } else {
      return date.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: 'long',
      });
    }
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedMember) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'trainer-current',
      senderName: 'Siz',
      text: message.trim(),
      timestamp: new Date().toISOString(),
      isTrainer: true,
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  // Group messages by date
  const groupedMessages = messages.reduce((acc, msg) => {
    const date = formatDate(msg.timestamp);
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {} as Record<string, Message[]>);

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

        {/* Member Selector */}
        <View style={styles.selectorContainer}>
          <TouchableOpacity
            style={styles.selector}
            onPress={() => setShowMemberPicker(true)}
          >
            <View style={styles.selectorContent}>
              <User size={20} color={Colors.primary} />
              <Text style={styles.selectorText}>
                {selectedMember
                  ? `${selectedMember.firstName} ${selectedMember.lastName}`
                  : t.selectMember}
              </Text>
            </View>
            <ChevronDown size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        {selectedMember ? (
          <KeyboardAvoidingView
            style={styles.chatContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={100}
          >
            <ScrollView
              style={styles.messagesContainer}
              contentContainerStyle={[
                styles.messagesContent,
                { paddingBottom: insets.bottom + 10 },
              ]}
            >
              {Object.entries(groupedMessages).map(([date, msgs]) => (
                <View key={date}>
                  {/* Date Separator */}
                  <View style={styles.dateSeparator}>
                    <View style={styles.dateLine} />
                    <Text style={styles.dateText}>{date}</Text>
                    <View style={styles.dateLine} />
                  </View>

                  {/* Messages for this date */}
                  {msgs.map((msg) => (
                    <View
                      key={msg.id}
                      style={[
                        styles.messageWrapper,
                        msg.isTrainer ? styles.trainerMessageWrapper : styles.memberMessageWrapper,
                      ]}
                    >
                      <View
                        style={[
                          styles.messageBubble,
                          msg.isTrainer ? styles.trainerBubble : styles.memberBubble,
                        ]}
                      >
                        <Text style={styles.messageText}>{msg.text}</Text>
                        <Text style={styles.messageTime}>{formatTime(msg.timestamp)}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              ))}

              {messages.length === 0 && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>{t.noMessages}</Text>
                  <Text style={styles.emptyStateSubtext}>{t.startConversation}</Text>
                </View>
              )}
            </ScrollView>

            {/* Input */}
            <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 10 }]}>
              <TextInput
                style={styles.input}
                placeholder={t.typeMessage}
                placeholderTextColor={Colors.textTertiary}
                value={message}
                onChangeText={setMessage}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  !message.trim() && styles.sendButtonDisabled,
                ]}
                onPress={handleSendMessage}
                disabled={!message.trim()}
              >
                <Send
                  size={20}
                  color={message.trim() ? Colors.background : Colors.textTertiary}
                />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        ) : (
          <View style={styles.noSelectionContainer}>
            <User size={64} color={Colors.textTertiary} />
            <Text style={styles.noSelectionText}>{t.noMemberSelected}</Text>
          </View>
        )}

        {/* Member Picker Modal */}
        {showMemberPicker && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t.selectMember}</Text>
                <TouchableOpacity onPress={() => setShowMemberPicker(false)}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent}>
                {MOCK_MEMBERS.map((member) => (
                  <TouchableOpacity
                    key={member.id}
                    style={styles.memberOption}
                    onPress={() => {
                      setSelectedMember(member);
                      setShowMemberPicker(false);
                    }}
                  >
                    <View style={styles.memberAvatar}>
                      <Text style={styles.memberAvatarText}>
                        {member.firstName[0]}
                        {member.lastName[0]}
                      </Text>
                    </View>
                    <Text style={styles.memberOptionText}>
                      {member.firstName} {member.lastName}
                    </Text>
                  </TouchableOpacity>
                ))}
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
  selectorContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectorText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 20,
  },
  dateSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 12,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.surfaceLight,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  messageWrapper: {
    marginBottom: 12,
  },
  trainerMessageWrapper: {
    alignItems: 'flex-end',
  },
  memberMessageWrapper: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 16,
    padding: 12,
    gap: 4,
  },
  trainerBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  memberBubble: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 11,
    color: Colors.textSecondary,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 12,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceLight,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.surface,
  },
  noSelectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  noSelectionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
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
  memberOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceLight,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.background,
  },
  memberOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
});
