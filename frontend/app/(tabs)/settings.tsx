import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { COLORS, FONTS, SPACING, SIZES } from '@/constants/theme';
import SettingsSection from '@/components/ui/SettingsSection';
import SettingsRow from '@/components/ui/SettingsRow';

/**
 * Settings Screen
 * 
 * Purpose: App settings and user account management
 * Features: Profile settings, subscription management, logout
 * 
 * Note: Logout clears all tokens and user data, then redirects to login
 */
export default function SettingsScreen() {
  const { logout, user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const insets = useSafeAreaInsets();

  const handlePress = (item: string) => {
    console.log(`Pressed: ${item}`);
  };

  /**
   * Handle logout with confirmation
   * Clears all authentication data and redirects to login screen
   */
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoggingOut(true);
              console.log('[Settings] Logout initiated for user:', user?.email);
              
              // Call logout - this will:
              // 1. Call backend logout endpoint
              // 2. Clear all tokens from SecureStore
              // 3. Clear user data
              // 4. Update AuthContext state
              // 5. Navigation will automatically redirect to login
              await logout();
              
              console.log('[Settings] ✅ Logout successful');
            } catch (error: any) {
              console.error('[Settings] ❌ Logout error:', error);
              setIsLoggingOut(false);
              
              // Show error but still try to clear local data
              Alert.alert(
                'Logout Error',
                'There was an issue logging out from the server, but your local session has been cleared.',
                [{ text: 'OK' }]
              );
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + SPACING.s }
        ]}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* Account Section */}
        <SettingsSection title="Account">
          <SettingsRow 
            icon="person"
            label="Profile"
            onPress={() => handlePress('Profile')}
          />
          <SettingsRow
            icon="workspace-premium"
            label="Manage Plan"
            iconColor={COLORS.gold}
            isLast
            onPress={() => handlePress('Manage Plan')}
          />
        </SettingsSection>
        {/* Connectivity & Support Section */}
        <SettingsSection title="Connectivity & Support">
          <SettingsRow
            icon="watch"
            label="Device Connections"
            onPress={() => handlePress('Device Connections')}
          />
          <SettingsRow
            icon="help-outline"
            label="Help & Support"
            isLast
            onPress={() => handlePress('Help & Support')}
          />
        </SettingsSection>
        {/* Information Section */}
        <SettingsSection title="Information">
          <SettingsRow
            icon="shield"
            label="Legal"
            isLast
            onPress={() => handlePress('Legal')}
          />
        </SettingsSection>
        {/* User Info Section */}
        {user && (
          <View style={styles.userInfoContainer}>
            <Text style={styles.userInfoLabel}>Logged in as:</Text>
            <Text style={styles.userInfoEmail}>{user.email}</Text>
          </View>
        )}

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={[styles.logoutButton, isLoggingOut && styles.logoutButtonDisabled]}
            activeOpacity={0.8}
            onPress={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <ActivityIndicator size="small" color={COLORS.text} />
            ) : (
              <MaterialIcons name="logout" size={24} color={COLORS.text} />
            )}
            <Text style={styles.logoutText}>
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.l,
    paddingBottom: SPACING.xxl,
  },
  header: {
    paddingBottom: SPACING.m,
    marginBottom: SPACING.xs,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 28,
    fontFamily: FONTS.bold,
  },
  userInfoContainer: {
    marginTop: SPACING.l,
    marginBottom: SPACING.m,
    padding: SPACING.m,
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    alignItems: 'center',
  },
  userInfoLabel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    marginBottom: SPACING.xs,
  },
  userInfoEmail: {
    color: COLORS.text,
    fontSize: SIZES.medium,
    fontFamily: FONTS.medium,
  },
  logoutContainer: {
    marginTop: SPACING.m,
    paddingHorizontal: SPACING.xs,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: SIZES.radius,
    gap: SPACING.s,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 8,
  },
  logoutButtonDisabled: {
    opacity: 0.5,
  },
  logoutText: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
});
