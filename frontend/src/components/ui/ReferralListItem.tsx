import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, SIZES } from '@/constants/theme';
import { Referral } from '@/types/referral';

interface ReferralListItemProps {
  item: Referral;
}

export default function ReferralListItem({ item }: ReferralListItemProps) {
  const getStatusColor = () => {
    switch (item.status) {
      case 'Confirmed': return COLORS.success;
      case 'Rewarded': return COLORS.accent;
      default: return COLORS.accent; // Pending uses accent color
    }
  };

  const getStatusIcon = () => {
    switch (item.status) {
      case 'Confirmed': return 'verified';
      case 'Rewarded': return 'emoji-events';
      default: return 'hourglass-top';
    }
  };

  const statusColor = getStatusColor();

  return (
    <View style={styles.container}>
      {/* Icon Circle */}
      <View style={[styles.iconContainer, item.status === 'Rewarded' && { backgroundColor: 'rgba(255, 215, 0, 0.2)' }]}
      >
        <MaterialIcons 
          name={getStatusIcon()} 
          size={20} 
          color={item.status === 'Rewarded' ? COLORS.accent : "rgba(255,255,255,0.7)"} 
        />
      </View>
      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.email}>{item.email}</Text>
        <Text style={styles.date}>
          {item.status === 'Pending' ? 'Invited on' : item.status === 'Confirmed' ? 'Joined on' : 'Rewarded on'} {item.date}
        </Text>
      </View>
      {/* Badge */}
      <View style={[styles.badge, { backgroundColor: `${statusColor}33` }]}
      >
        <Text style={[styles.badgeText, { color: statusColor }]}>{item.status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.m,
    borderRadius: SIZES.radius,
    marginBottom: SPACING.s,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
  },
  info: {
    flex: 1,
  },
  email: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.medium,
    marginBottom: 2,
  },
  date: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: FONTS.regular,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: SIZES.radiusFull,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
});
