import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar,
  SafeAreaView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, SIZES } from '@/constants/theme';
import SegmentedControl from '@/components/ui/SegmentedControl';
import InputWithUnit from '@/components/ui/InputWithUnit';
import MacroResultCard from '@/components/ui/MacroResultCard';

export default function CalculatorScreen() {
  const [gender, setGender] = useState('Male');
  const [unitSystem, setUnitSystem] = useState('Metric');
  const [showResults, setShowResults] = useState(true); // Default true for demo purposes

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Macro Calculator</Text>
        <View style={styles.placeholderIcon} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.headline}>Calculate Your Macros</Text>
        <Text style={styles.description}>
          Enter your details below to calculate your BMR and daily macro needs.
        </Text>
        {/* Controls */}
        <View style={styles.controlsRow}>
          <SegmentedControl 
            options={['Male', 'Female']} 
            selected={gender} 
            onSelect={setGender} 
          />
          <View style={{ width: SPACING.m }} />
          <SegmentedControl 
            options={['Metric', 'Imperial']} 
            selected={unitSystem} 
            onSelect={setUnitSystem} 
          />
        </View>
        {/* Inputs */}
        <View style={styles.inputsRow}>
          <InputWithUnit 
            label="Age" 
            unit="years" 
            placeholder="25" 
            style={{ flex: 1 }}
          />
          <View style={{ width: SPACING.m }} />
          <InputWithUnit 
            label="Weight" 
            unit="kg" 
            placeholder="70" 
            style={{ flex: 1.2 }} 
          />
          <View style={{ width: SPACING.m }} />
          <InputWithUnit 
            label="Height" 
            unit="cm" 
            placeholder="180" 
            style={{ flex: 1.2 }} 
          />
        </View>
        {/* Activity Level Dropdown (Simulated) */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Activity Level</Text>
          <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>Moderately Active (3-5 days/week)</Text>
            <MaterialIcons name="keyboard-arrow-down" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
        {/* CTA Button */}
        <TouchableOpacity 
          style={styles.ctaButton}
          onPress={() => setShowResults(!showResults)}
        >
          <Text style={styles.ctaText}>Calculate Macros</Text>
        </TouchableOpacity>
        {/* Result */}
        {showResults && (
          <MacroResultCard 
            calories={2450}
            carbs={310}
            protein={185}
            fats={82}
            bmr={1780}
          />
        )}
        {/* Bottom Padding */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    backgroundColor: COLORS.background,
  },
  backButton: {
    padding: SPACING.xs,
  },
  placeholderIcon: {
    width: 32,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  content: {
    padding: SPACING.m,
  },
  headline: {
    color: COLORS.text,
    fontSize: 32,
    fontFamily: FONTS.bold,
    marginBottom: SPACING.s,
    marginTop: SPACING.s,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontFamily: FONTS.regular,
    lineHeight: 24,
    marginBottom: SPACING.l,
  },
  controlsRow: {
    flexDirection: 'row',
    marginBottom: SPACING.m,
  },
  inputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.m,
  },
  dropdownContainer: {
    marginBottom: SPACING.xl,
  },
  dropdownLabel: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    fontSize: 14,
    marginBottom: SPACING.s,
  },
  dropdown: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.m,
  },
  dropdownText: {
    color: COLORS.text,
    fontFamily: FONTS.medium,
    fontSize: 16,
  },
  ctaButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: SIZES.radiusFull,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
});
