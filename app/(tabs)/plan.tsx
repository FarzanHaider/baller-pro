import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, SIZES } from '@/constants/theme';

// Components
import WeekNavigator from '@/components/ui/WeekNavigator';
import WeeklyGoalCard from '@/components/ui/WeeklyGoalCard';
import DayCard from '@/components/ui/DayCard';

// Hooks & Services
import { usePlanGuard } from '@/hooks/usePlanGuard';
import { usePlan } from '@/contexts/PlanContext';
import { planService } from '@/services/api/planService';

// Types
import { PlanDay } from '@/types/plan';

export default function PlanScreen() {
  const { isLoading: guardLoading } = usePlanGuard('ACTIVE');
  const { planStatus, refreshPlanStatus } = usePlan();
  
  const [weeklyData, setWeeklyData] = useState<PlanDay[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isTablet = width > 768;
  const contentWidth = isTablet ? SIZES.containerMaxWidthPlan : '100%';

  const fetchPlanDetails = async () => {
    try {
      setDataLoading(true);
      const data = await planService.getFullPlan(); 
      setWeeklyData(data);
    } catch (error) {
      console.error("Error fetching plan details:", error);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (planStatus === 'ACTIVE') {
      fetchPlanDetails();
    }
  }, [planStatus]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshPlanStatus(), fetchPlanDetails()]);
    setRefreshing(false);
  };

  const currentMonth = new Intl.DateTimeFormat('en-US', { 
    month: 'long', 
    year: 'numeric' 
  }).format(new Date());

  if (guardLoading || dataLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          {/* FIXED: The style property below now exists in the StyleSheet */}
          <Text style={styles.loadingText}>
            Loading your schedule...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <View style={[styles.header, { paddingTop: Math.max(insets.top, SPACING.s) }]}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => console.log('back')}>
            <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>{currentMonth}</Text>
          <TouchableOpacity style={styles.iconBtn}>
            <MaterialIcons name="calendar-today" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        <WeekNavigator />
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { alignItems: 'center' }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={COLORS.primary} 
          />
        }
      >
        <View style={{ width: contentWidth }}>
          <WeeklyGoalCard />

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Weekly Split</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.list}>
            {weeklyData.length > 0 ? (
              weeklyData.map((day: PlanDay) => (
                <DayCard 
                  key={day.id} 
                  item={day} 
                  onPress={() => console.log('Day pressed:', day.title)} 
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No workout data found for this week.</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  header: { 
    backgroundColor: COLORS.background, 
    borderBottomWidth: 1, 
    borderBottomColor: COLORS.border, 
    zIndex: 10 
  },
  topBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: SPACING.l, 
    paddingBottom: SPACING.s 
  },
  iconBtn: { 
    width: 40, 
    height: 40, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 20, 
    backgroundColor: 'rgba(255,255,255,0.05)' 
  },
  monthTitle: { 
    color: COLORS.text, 
    fontSize: 16, 
    fontFamily: FONTS.bold 
  },
  scrollContent: { 
    padding: SPACING.l, 
    paddingBottom: 100 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: SPACING.m 
  },
  sectionTitle: { 
    color: COLORS.text, 
    fontSize: 18, 
    fontFamily: FONTS.bold 
  },
  line: { 
    flex: 1, 
    height: 1, 
    backgroundColor: COLORS.border, 
    marginLeft: SPACING.m 
  },
  list: { 
    marginTop: SPACING.xs 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  // ADDED: loadingText style definition
  loadingText: { 
    color: COLORS.textSecondary, 
    marginTop: 10, 
    fontFamily: FONTS.medium 
  },
  emptyState: { 
    padding: 40, 
    alignItems: 'center' 
  },
  emptyText: { 
    color: COLORS.textSecondary, 
    fontFamily: FONTS.regular 
  }
});