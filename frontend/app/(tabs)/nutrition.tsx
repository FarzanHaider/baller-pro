import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, SIZES } from '@/constants/theme';
import CalorieRing from '@/components/ui/CalorieRing';
import MacroCard from '@/components/ui/MacroCard';
import MealItem from '@/components/ui/MealItem';
import { DEMO_NUTRITION_DATA } from '@/constants/nutrition';

export default function NutritionScreen() {
  const { width } = useWindowDimensions();
  const [nutritionData, setNutritionData] = useState(DEMO_NUTRITION_DATA);

  // Responsive calculation for tablet support
  const isTablet = width > 768;
  const contentWidth = isTablet ? SIZES.containerMaxWidth : '100%';

  const handleAddMeal = () => {
    Alert.alert(
      'Add Meal',
      'This would open a meal entry form',
      [{ text: 'OK' }]
    );
  };

  const handleScanBarcode = () => {
    Alert.alert(
      'Scan Barcode',
      'This would open the barcode scanner',
      [{ text: 'OK' }]
    );
  };

  const handleMealPress = (mealId: string) => {
    const meal = nutritionData.meals.find(m => m.id === mealId);
    if (meal) {
      Alert.alert(
        meal.name,
        `${meal.description}\n\nCalories: ${meal.calories}\nProtein: ${meal.macros.protein}g\nCarbs: ${meal.macros.carbs}g\nFats: ${meal.macros.fats}g`,
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.responsiveContainer, { width: contentWidth }]}>
          
          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Nutrition</Text>
          </View>

          {/* Calorie Ring */}
          <View style={styles.calorieRingContainer}>
            <CalorieRing
              consumed={nutritionData.consumed.calories}
              target={nutritionData.dailyTarget.calories}
            />
          </View>

          {/* Macro Cards */}
          <View style={styles.macroCardsContainer}>
            <MacroCard
              name="Protein"
              current={nutritionData.consumed.protein}
              target={nutritionData.dailyTarget.protein}
            />
            <MacroCard
              name="Carbs"
              current={nutritionData.consumed.carbs}
              target={nutritionData.dailyTarget.carbs}
            />
            <MacroCard
              name="Fats"
              current={nutritionData.consumed.fats}
              target={nutritionData.dailyTarget.fats}
            />
          </View>

          {/* Today's Meals Section */}
          <View style={styles.mealsSection}>
            <View style={styles.mealsSectionHeader}>
              <Text style={styles.mealsSectionTitle}>Today's Meals</Text>
              <TouchableOpacity
                style={styles.addMealButton}
                activeOpacity={0.7}
                onPress={handleAddMeal}
              >
                <Text style={styles.addMealText}>Add Meal</Text>
                <MaterialIcons name="add-circle" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            {/* Meals List */}
            <View style={styles.mealsList}>
              {nutritionData.meals.map((meal) => (
                <MealItem
                  key={meal.id}
                  icon={meal.icon}
                  mealName={meal.name}
                  description={meal.description}
                  calories={meal.calories}
                  onPress={() => handleMealPress(meal.id)}
                />
              ))}
            </View>
          </View>

          {/* Scan Barcode Button */}
          <TouchableOpacity
            style={styles.scanBarcodeButton}
            activeOpacity={0.8}
            onPress={handleScanBarcode}
          >
            <Text style={styles.barcodeIcon}>📊</Text>
            <Text style={styles.scanBarcodeText}>Scan Barcode</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={handleAddMeal}
      >
        <MaterialIcons name="add" size={32} color={COLORS.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.m,
    paddingTop: SPACING.m,
    paddingBottom: 100, // Space for FAB
    alignItems: 'center',
  },
  responsiveContainer: {
    width: '100%',
  },
  headerContainer: {
    width: '100%',
    marginBottom: SPACING.l,
    marginTop: SPACING.s,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 28,
    fontFamily: FONTS.bold,
    textAlign: 'center',
  },
  calorieRingContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.l,
    marginBottom: SPACING.l,
    alignItems: 'center',
  },
  macroCardsContainer: {
    flexDirection: 'row',
    gap: SPACING.m,
    marginBottom: SPACING.l,
    flexWrap: 'wrap',
  },
  mealsSection: {
    width: '100%',
    marginBottom: SPACING.l,
  },
  mealsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  mealsSectionTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  addMealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  addMealText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  mealsList: {
    width: '100%',
  },
  scanBarcodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 56,
    borderRadius: SIZES.radius,
    gap: SPACING.s,
    marginBottom: SPACING.l,
  },
  barcodeIcon: {
    fontSize: 24,
  },
  scanBarcodeText: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});

