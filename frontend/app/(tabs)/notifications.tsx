import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, SIZES } from '@/constants/theme';
import NotificationRow from '@/components/ui/NotificationRow';
import { NotificationItem } from '@/types/notification';

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    type: 'reminder',
    title: 'Session Reminder',
    description: 'Your Leg Day session starts in 15 minutes.',
    time: '5m ago',
    isRead: false,
  },
  {
    id: '2',
    type: 'message',
    title: 'Jane Smith',
    description: "Sent you a message: 'Great workout today!'",
    time: '2h ago',
    isRead: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZOlGxfUR5Zz1nACEERcKhJb14O9CQSDrXc7XulD8giOiC93zult3fVnC__beI8UEfSoxbEVrHRgrOxFVMWZMyX2NkW6FxMTbGMTOD4MXNNjt-mjtQVdXWdcLk4IqEAHSt9ZBAwXUw306pLVeJF3tS2J4nqbS4Vc4AsRXs0bYJCDV-ynBO42W-qdXHBG7cR7NmuRmD1i43P6kJtKk5cIutn7w1GcqwYThJgLRQTFMjhOpJUVsyuJGuqPP0AImo_k3gPpunorkf_bM',
  },
  {
    id: '3',
    type: 'mention',
    title: 'Mentioned in a comment',
    description: "@JohnDoe mentioned you in 'Weekly Progress'...",
    time: 'Yesterday',
    isRead: true,
  },
  {
    id: '4',
    type: 'milestone',
    title: 'Milestone Achieved!',
    description: 'You’ve successfully referred 5 friends. Claim your reward!',
    time: '3d ago',
    isRead: true,
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const { width } = useWindowDimensions();
  const isTablet = width > 768;
  const contentWidth = isTablet ? SIZES.containerMaxWidth : '100%';
  const insets = useSafeAreaInsets();

  const handlePress = (id: string) => {
    setNotifications(prev => prev.map(item =>
      item.id === id ? { ...item, isRead: true } : item
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(item => ({ ...item, isRead: true })));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {/* Header */}
      <View style={[styles.header, { paddingTop: SPACING.s + insets.top }]}>
        <TouchableOpacity style={styles.backButton}>
          {/* Back button, inactive for now */}
          <MaterialIcons name="arrow-back-ios-new" size={20} color="transparent" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={markAllAsRead}>
          <Text style={styles.markReadText}>Mark all as read</Text>
        </TouchableOpacity>
      </View>
      {/* List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationRow item={item} onPress={handlePress} />
        )}
        contentContainerStyle={[
          styles.listContent,
          { width: contentWidth, alignSelf: 'center', paddingTop: SPACING.s },
        ]}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.l,
    paddingBottom: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.whiteTint,
    backgroundColor: COLORS.background,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: FONTS.bold,
    textAlign: 'center',
  },
  markReadText: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: FONTS.medium,
  },
  listContent: {
    padding: SPACING.l,
  },
});
