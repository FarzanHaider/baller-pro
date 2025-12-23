import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { TabSwitcher } from '../../src/components/ui/TabSwitcher';
import SearchBar from '../../src/components/ui/SearchBar';
import { CategoryChip } from '../../src/components/ui/CategoryChip';
import { WorkoutCard } from '../../src/components/ui/WorkoutCard';
import { WORKOUTS, CATEGORIES, Workout } from '../../src/constants/workouts';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { typography } from '../../src/theme/typography';
import { Ionicons } from '@expo/vector-icons';

type Tab = 'Workouts' | 'Programs';

export default function TrainScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('Workouts');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter Logic
  const filteredWorkouts = useMemo(() => {
    return WORKOUTS.filter((workout) => {
      // Search Filter
      const matchesSearch =
        workout.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workout.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Category Filter
      const matchesCategory =
        activeCategory === 'All' || workout.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const handleStartWorkout = (workout: Workout) => {
    // Navigate to exercise detail screen (for now, using first exercise)
    // TODO: Navigate to workout detail screen with all exercises
    router.push('/workouts/1');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Train</Text>
        <TouchableOpacity>
          <Ionicons name="person-outline" size={28} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TabSwitcher
          tabs={['Workouts', 'Programs']}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as Tab)}
        />
      </View>

      {/* Search & Filter */}
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search workouts or programs"
          onFilterPress={() => {
            // TODO: Open filter modal
            console.log('Filter pressed');
          }}
        />
      </View>

      {/* Category Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScrollView}
        contentContainerStyle={styles.categoriesContainer}
      >
        {CATEGORIES.map((category) => (
          <CategoryChip
            key={category}
            label={category}
            selected={activeCategory === category}
            onPress={() => setActiveCategory(category)}
          />
        ))}
      </ScrollView>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'Workouts' ? (
          filteredWorkouts.length > 0 ? (
            filteredWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onStart={() => handleStartWorkout(workout)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="search-outline"
                size={64}
                color={colors.textSecondary}
              />
              <Text style={styles.emptyTitle}>No workouts found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your filters
              </Text>
            </View>
          )
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.programsIcon}>
              <Text style={styles.programsIconText}>📋</Text>
            </View>
            <Text style={styles.emptyTitle}>Programs Coming Soon</Text>
            <Text style={styles.emptySubtitle}>
              Structured multi-week training plans are currently under
              development.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    letterSpacing: -0.5,
  },
  tabContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  categoriesScrollView: {
    maxHeight: 60,
    marginBottom: spacing.md,
  },
  categoriesContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  programsIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  programsIconText: {
    fontSize: 40,
  },
});

