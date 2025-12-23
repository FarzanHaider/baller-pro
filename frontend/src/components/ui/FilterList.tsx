import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, SIZES, FONTS } from '@/constants/theme';
import { RECIPE_FILTERS } from '@/constants/recipes';

export default function FilterList() {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {RECIPE_FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.chip,
              filter.active ? styles.chipActive : styles.chipInactive
            ]}
            activeOpacity={0.7}
          >
            <Text 
              style={[
                styles.chipText,
                filter.active ? styles.textActive : styles.textInactive
              ]}
            >
              {filter.label ? String(filter.label) : ''}
            </Text>
          </TouchableOpacity>
        ))}
        {/* All Filters Button */}
        <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
          <MaterialIcons name="tune" size={18} color={COLORS.textSecondary} />
          <Text style={[styles.filterButtonText, { marginLeft: SPACING.s }]}>All Filters</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.l,
  },
  scrollContent: {
    paddingRight: SPACING.l,
    // gap: SPACING.m, // Using marginRight on items instead
  },
  chip: {
    height: 36,
    paddingHorizontal: SPACING.l,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
  },
  chipInactive: {
    backgroundColor: COLORS.surface,
  },
  chipText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  textActive: {
    color: COLORS.text,
  },
  textInactive: {
    color: COLORS.textSecondary,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    height: 36,
    paddingLeft: SPACING.m,
    paddingRight: SPACING.l,
    borderRadius: 8,
    // gap: SPACING.s, // Using marginLeft on text instead
  },
  filterButtonText: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
});
