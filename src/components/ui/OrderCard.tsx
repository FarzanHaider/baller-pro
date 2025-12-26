import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';
import { Order, OrderStatus } from '@/types/order';

interface OrderCardProps {
  item: Order;
  onPress: (item: Order) => void;
}

export default function OrderCard({ item, onPress }: OrderCardProps) {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered': return COLORS.success;
      case 'Shipped': return COLORS.info;
      case 'Processing': return COLORS.processing;
      default: return COLORS.textSecondary;
    }
  };
  const statusColor = getStatusColor(item.status);
  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={0.7}
      onPress={() => onPress(item)}
    >
      <View style={styles.content}>
        {/* Left Column: Info */}
        <View style={styles.infoColumn}>
          <Text style={styles.orderNumber}>{item.orderNumber}</Text>
          <Text style={styles.date}>{item.date}</Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>{item.status}</Text>
          </View>
        </View>
        {/* Right Column: Price & Action */}
        <View style={styles.actionColumn}>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          <MaterialIcons 
            name="chevron-right" 
            size={24} 
            color={COLORS.textSecondary} 
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    marginBottom: SPACING.m,
    padding: SPACING.l,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoColumn: {
    flex: 1,
    gap: SPACING.xs,
  },
  orderNumber: {
    color: COLORS.accent,
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  date: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    fontSize: 14,
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
  },
  actionColumn: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: SPACING.m,
  },
  price: {
    color: COLORS.text,
    fontFamily: FONTS.bold,
    fontSize: 18,
  },
});
