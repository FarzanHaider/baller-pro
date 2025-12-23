import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import IntegrationRow from '@/components/ui/IntegrationRow';
import { Integration } from '@/types/integration';

export default function WearablesScreen() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'Apple Health',
      statusText: 'Last synced: 2 hours ago',
      isConnected: true,
      iconName: 'favorite',
      iconColor: COLORS.appleHealth,
    },
    {
      id: '2',
      name: 'Garmin',
      statusText: 'Last synced: 1 day ago',
      isConnected: true,
      iconName: 'watch',
      iconColor: COLORS.garmin,
    },
    {
      id: '3',
      name: 'Google Fit',
      statusText: 'Not Connected',
      isConnected: false,
      iconName: 'fitness-center',
      iconColor: COLORS.googleFit,
    },
    {
      id: '4',
      name: 'WHOOP',
      statusText: 'Not Connected',
      isConnected: false,
      iconName: 'bolt',
      iconColor: COLORS.whoop,
    },
    {
      id: '5',
      name: 'Strava',
      statusText: 'Connection Failed',
      isConnected: false,
      hasError: true,
      iconName: 'directions-run',
      iconColor: COLORS.strava,
    },
  ]);

  const handleToggle = (id: string) => {
    setIntegrations(prev => prev.map(item => 
      item.id === id 
        ? { ...item, isConnected: !item.isConnected, statusText: !item.isConnected ? 'Connected just now' : 'Not Connected', hasError: false } 
        : item
    ));
  };

  const connectedItems = integrations.filter(i => i.isConnected);
  const availableItems = integrations.filter(i => !i.isConnected);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <MaterialIcons name="arrow-back-ios-new" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wearables & Integrations</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.description}>
          Connect your favorite apps and devices to sync your activity.
        </Text>
        {/* Connected Section */}
        {connectedItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Connected</Text>
            {connectedItems.map((item) => (
              <IntegrationRow 
                key={item.id} 
                item={item} 
                onToggle={handleToggle} 
              />
            ))}
          </View>
        )}
        {/* Available Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { paddingTop: SPACING.s }]}>Available</Text>
          {availableItems.map((item) => (
            <IntegrationRow 
              key={item.id} 
              item={item} 
              onToggle={handleToggle} 
            />
          ))}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    marginBottom: SPACING.xs,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  placeholder: {
    width: 40,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: FONTS.bold,
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontFamily: FONTS.regular,
    lineHeight: 24,
    paddingHorizontal: SPACING.m,
    marginBottom: SPACING.m,
  },
  section: {
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: FONTS.bold,
    paddingHorizontal: SPACING.m,
    paddingBottom: SPACING.s,
    paddingTop: SPACING.m,
  },
});
