import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar,
  useWindowDimensions,
  ScrollView,
  RefreshControl
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, FONTS, SPACING, SIZES } from '@/constants/theme';
import PlanLoader from '@/components/ui/PlanLoader';
import GenerationStatusList from '@/components/ui/GenerationStatusList';
import LoadingProgressBar from '@/components/ui/LoadingProgressBar';
import { useAuth } from '@/contexts/AuthContext';
import { usePlan } from '@/contexts/PlanContext';

export default function GeneratingPlanScreen() {
  const { user, refreshUser } = useAuth();
  const { refreshPlanStatus, planStatus } = usePlan();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const { width, height } = useWindowDimensions();
  
  const isTablet = width > 768;
  const contentWidth = isTablet ? SIZES.containerMaxWidth : '100%';

  // POLLING LOGIC: Check status every 3 seconds
  useEffect(() => {
    const checkStatus = setInterval(async () => {
      // 1. Refresh both contexts to ensure data is fresh
      await Promise.all([refreshUser(), refreshPlanStatus()]);
      
      const currentStatus = user?.planStatus || planStatus;

      // 2. FLOW TRIGGER: If AI is done and needs coach review
      if (currentStatus === 'PENDING_APPROVAL') {
        clearInterval(checkStatus);
        router.replace('/(tabs)/plan_review'); // Redirect to review info screen
      } 
      
      // 3. FLOW TRIGGER: If AI is done and already active
      else if (currentStatus === 'ACTIVE') {
        clearInterval(checkStatus);
        router.replace('/(tabs)/'); // Redirect to Dashboard
      }
    }, 3000);

    return () => clearInterval(checkStatus);
  }, [user?.planStatus, planStatus]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshUser(), refreshPlanStatus()]);
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.backgroundDeep} />
      
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { minHeight: height }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={COLORS.primary} />
        }
      >
        <View style={[styles.container, { width: contentWidth }]}>
          
          <View style={styles.visualContainer}>
            <PlanLoader />
          </View>

          <Text style={styles.title}>
            Crafting your personalized weekly plan...
          </Text>
          <Text style={styles.subtitle}>
            Our AI is analyzing your goals, training age, and injury history to build your optimal split.
          </Text>

          {/* Progress Visuals */}
          <LoadingProgressBar />
          <GenerationStatusList />

          <View style={{ flex: 1 }} />

          <View style={styles.footer}>
            <View style={styles.footerIcon}>
              <MaterialIcons name="security" size={14} color="rgba(255,255,255,0.3)" />
            </View>
            <Text style={styles.footerText}>AI Engine v2.0 • Secure Processing</Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.backgroundDeep },
  scrollContent: { alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  visualContainer: { marginBottom: SPACING.xxl, marginTop: SPACING.xl },
  title: { 
    color: COLORS.white, 
    fontSize: 24, 
    fontFamily: FONTS.bold, 
    textAlign: 'center', 
    marginBottom: SPACING.s,
    lineHeight: 32 
  },
  subtitle: { 
    color: COLORS.textSecondary, 
    fontSize: 15, 
    fontFamily: FONTS.regular, 
    textAlign: 'center', 
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.m 
  },
  footer: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.xxl, opacity: 0.5 },
  footerIcon: { marginRight: SPACING.xs },
  footerText: { color: COLORS.white, fontSize: 12, fontFamily: FONTS.medium },
});