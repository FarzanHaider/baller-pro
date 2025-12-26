import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';

const WEEKS = ['Week 3', 'Week 4', 'Week 5', 'Week 6'];

export default function WeekNavigator() {
  const activeWeek = 'Week 4';

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {WEEKS.map((week, index) => {
          const isActive = week === activeWeek;
          return (
            <TouchableOpacity
              key={week}
              style={[
                styles.pill,
                isActive ? styles.pillActive : styles.pillInactive,
                index < WEEKS.length - 1 && styles.pillSpacing
              ]}
            >
              <Text 
                style={[
                  styles.text,
                  isActive ? styles.textActive : styles.textInactive
                ]}
              >
                {week}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.m,
  },
  scrollContent: {
    paddingHorizontal: SPACING.l,
  },
  pill: {
    height: 36,
    paddingHorizontal: SPACING.l,
    borderRadius: SIZES.radiusPlan,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 90,
  },
  pillSpacing: {
    marginRight: SPACING.m,
  },
  pillActive: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  pillInactive: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  text: {
    fontSize: 14,
    fontFamily: FONTS.medium,
  },
  textActive: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
  },
  textInactive: {
    color: COLORS.textSecondaryZinc,
  },
});

