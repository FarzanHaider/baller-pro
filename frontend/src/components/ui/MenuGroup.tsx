import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';

interface MenuGroupProps {
  title: string;
  children: React.ReactNode;
}

export default function MenuGroup({ title, children }: MenuGroupProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.card}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACING.xl,
  },
  title: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontFamily: FONTS.bold,
    marginBottom: SPACING.s,
    marginLeft: SPACING.xs,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xs,
  },
});

