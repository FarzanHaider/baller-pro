import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';

interface PaymentInfoRowProps {
  icon?: string; // MaterialIcon name
  image?: string; // URL for payment icon/image
  title: string;
  subtitle: string;
  onChange: () => void;
}

export default function PaymentInfoRow({ icon, image, title, subtitle, onChange }: PaymentInfoRowProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <View style={styles.iconBox}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} resizeMode="contain" />
          ) : (
            <MaterialIcons 
              name={icon as any} 
              size={24} 
              color={COLORS.text} 
            />
          )}
        </View>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={onChange}>
        <Text style={styles.changeText}>Change</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.m,
    minHeight: 72,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.m,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 32,
    height: 32,
  },
  title: {
    color: COLORS.text,
    fontFamily: FONTS.medium,
    fontSize: 16,
    marginBottom: 2,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    fontSize: 14,
  },
  changeText: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
});
