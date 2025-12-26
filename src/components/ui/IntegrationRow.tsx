import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';
import { Integration } from '@/types/integration';

interface IntegrationRowProps {
  item: Integration;
  onToggle: (id: string) => void;
}

export default function IntegrationRow({ item, onToggle }: IntegrationRowProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <MaterialIcons 
            name={item.iconName} 
            size={28} 
            color={item.iconColor} 
          />
        </View>
        {/* Details */}
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          {item.hasError ? (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={14} color={COLORS.error} />
              <Text style={styles.errorText}>{item.statusText}</Text>
            </View>
          ) : (
            <Text style={styles.status}>{item.statusText}</Text>
          )}
        </View>
      </View>
      {/* Switch */}
      <Switch
        trackColor={{ false: COLORS.surfaceHighlight, true: COLORS.primary }}
        thumbColor={"#FFFFFF"}
        ios_backgroundColor={COLORS.surfaceHighlight}
        onValueChange={() => onToggle(item.id)}
        value={item.isConnected}
        style={styles.switch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.m,
    backgroundColor: COLORS.background,
    minHeight: 72,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SPACING.m,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  textContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  name: {
    color: COLORS.text,
    fontFamily: FONTS.medium,
    fontSize: 16,
    marginBottom: 2,
  },
  status: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    fontSize: 14,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  errorText: {
    color: COLORS.error,
    fontFamily: FONTS.regular,
    fontSize: 14,
  },
  switch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
});
