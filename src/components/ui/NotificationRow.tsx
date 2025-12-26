import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';
import { NotificationItem } from '@/types/notification';

interface NotificationRowProps {
  item: NotificationItem;
  onPress: (id: string) => void;
}

export default function NotificationRow({ item, onPress }: NotificationRowProps) {
  // Helper to render specific icon/image
  const renderIcon = () => {
    if (item.type === 'message' && item.image) {
      return (
        <Image 
          source={{ uri: item.image }} 
          style={styles.avatar} 
          resizeMode="cover" 
        />
      );
    }
    let iconName: any = 'notifications';
    let iconColor = COLORS.text;
    let bgColor = COLORS.whiteTint;
    switch (item.type) {
      case 'reminder':
        iconName = 'calendar-today';
        iconColor = COLORS.primary;
        bgColor = COLORS.primaryTintStrong;
        break;
      case 'mention':
        iconName = 'alternate-email';
        iconColor = COLORS.text;
        bgColor = COLORS.whiteTint;
        break;
      case 'milestone':
        iconName = 'workspace-premium';
        iconColor = COLORS.accentGold;
        bgColor = COLORS.goldTint;
        break;
    }
    return (
      <View style={[styles.iconContainer, { backgroundColor: bgColor }]}> 
        <MaterialIcons name={iconName} size={24} color={iconColor} />
      </View>
    );
  };
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        !item.isRead ? styles.unreadContainer : styles.readContainer
      ]}
      onPress={() => onPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        {/* Unread Dot */}
        <View style={[styles.dot, !item.isRead && styles.unreadDot]} />
        {renderIcon()}
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.description} numberOfLines={1}>{item.description}</Text>
        </View>
      </View>
      <Text style={styles.time}>{item.time}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.m,
    borderRadius: SIZES.radius,
    marginBottom: SPACING.xs,
  },
  unreadContainer: {
    backgroundColor: COLORS.primaryTint,
  },
  readContainer: {
    backgroundColor: 'transparent',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SPACING.s,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: SPACING.m,
  },
  unreadDot: {
    backgroundColor: COLORS.primary,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: SIZES.radiusLg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: SPACING.m,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.bold,
    marginBottom: 2,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
  time: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: FONTS.regular,
    alignSelf: 'center',
  },
});
