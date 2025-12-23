import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, SIZES } from '@/constants/theme';
import { Category } from '@/types/merch';

interface CategoryFilterProps {
  categories: Category[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function CategoryFilter({ categories, selectedId, onSelect }: CategoryFilterProps) {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Sort By Button */}
        <TouchableOpacity style={styles.sortButton}>
          <Text style={styles.sortText}>Sort By</Text>
          <MaterialIcons name="keyboard-arrow-down" size={20} color={COLORS.text} />
        </TouchableOpacity>
        {categories.map((cat) => {
          const isSelected = selectedId === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryButton,
                isSelected && styles.selectedButton
              ]}
              onPress={() => onSelect(cat.id)}
            >
              <Text 
                style={[
                  styles.categoryText,
                  isSelected && styles.selectedText
                ]}
              >
                {cat.label}
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
    paddingVertical: SPACING.s,
  },
  scrollContent: {
    paddingHorizontal: SPACING.l,
    gap: SPACING.m,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceHighlight,
    height: 36,
    paddingHorizontal: SPACING.m,
    borderRadius: SIZES.radius,
    gap: SPACING.xs,
  },
  sortText: {
    color: COLORS.text,
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  categoryButton: {
    height: 36,
    paddingHorizontal: SPACING.m,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: 'rgba(239, 67, 67, 0.2)',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  categoryText: {
    color: COLORS.text,
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  selectedText: {
    color: COLORS.primary,
  },
});
