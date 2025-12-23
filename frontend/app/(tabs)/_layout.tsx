import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

/**
 * Main App (Tabs) Layout
 * 
 * Purpose: Container for main app screens (home, train, track, nutrition, etc.)
 * 
 * Protection: Ensures only authenticated users who completed onboarding can access.
 * If user is not authenticated -> redirect to login
 * If user hasn't completed onboarding -> redirect to onboarding
 */
export default function TabsLayout() {
  // Guard this stack - only authenticated users who completed onboarding
  const { isLoading } = useProtectedRoute('app');

  // Show loading while checking authentication status
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000000',
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#888888',
      }}
      initialRouteName="index"
    >
      <Tabs.Screen
        name="debug"
        options={{
          title: 'Debug',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="bug-report" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="debug_tester"
        options={{
          title: 'Tester',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="science" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="link_account"
        options={{
          title: 'Link Account',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="link" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="train"
        options={{
          title: 'Train',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="fitness-center" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="track"
        options={{
          title: 'Track',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="track-changes" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          title: 'Nutrition',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="restaurant" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="more-horiz" size={size} color={color} />
          ),
        }}
      />
      
      {/* Hidden screens - accessible only via navigation */}
      <Tabs.Screen name="habit" options={{ href: null }} />
      <Tabs.Screen name="calculator" options={{ href: null }} />
      <Tabs.Screen name="cart" options={{ href: null }} />
      <Tabs.Screen name="checkout" options={{ href: null }} />
      <Tabs.Screen name="wearables" options={{ href: null }} />
      <Tabs.Screen name="leaderboard" options={{ href: null }} />
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="order_history" options={{ href: null }} />
      <Tabs.Screen name="subscription" options={{ href: null }} />
      <Tabs.Screen name="product_detail" options={{ href: null }} />
      <Tabs.Screen name="recipes" options={{ href: null }} />
      <Tabs.Screen name="referral" options={{ href: null }} />
      <Tabs.Screen name="rehab" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="shop" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

