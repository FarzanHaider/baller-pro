import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';
import { CartItem } from '@/types/cart';

interface CartItemRowProps {
  item: CartItem;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function CartItemRow({ item, onIncrease, onDecrease, onRemove }: CartItemRowProps) {
  return (
    <View style={styles.container}>
      {/* Product Image */}
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      {/* Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.variant}>
          Size: {item.size}, Color: {item.color}
        </Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>
      {/* Actions Column */}
      <View style={styles.actionsContainer}>
        {/* Delete Button */}
        <TouchableOpacity 
          onPress={() => onRemove(item.id)} 
          style={styles.deleteButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="delete-outline" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
        {/* Quantity Controls */}
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.qtyButton} 
            onPress={() => onDecrease(item.id)}
          >
            <MaterialIcons name="remove" size={16} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity 
            style={styles.qtyButton} 
            onPress={() => onIncrease(item.id)}
          >
            <MaterialIcons name="add" size={16} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: SPACING.l,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.surfaceHighlight,
  },
  detailsContainer: {
    flex: 1,
    paddingHorizontal: SPACING.m,
    justifyContent: 'center',
  },
  title: {
    color: COLORS.text,
    fontFamily: FONTS.medium,
    fontSize: 16,
    marginBottom: 4,
  },
  variant: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    fontSize: 14,
    marginBottom: 8,
  },
  price: {
    color: COLORS.text,
    fontFamily: FONTS.medium,
    fontSize: 16,
  },
  actionsContainer: {
    height: 80,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  deleteButton: {
    padding: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    color: COLORS.text,
    fontFamily: FONTS.medium,
    fontSize: 14,
    minWidth: 16,
    textAlign: 'center',
  },
});
