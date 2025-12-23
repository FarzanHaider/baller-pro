import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar,
  useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';
import StatCard from '@/components/ui/StatCard';
import MenuButton from '@/components/ui/MenuButton';
import MenuGroup from '@/components/ui/MenuGroup';

export default function DashboardScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;
  const contentWidth = isTablet ? SIZES.containerMaxWidth : '100%';
  const router = useRouter();
  const { user, logout } = useAuth();

  const handlePress = (item: string, route?: string) => {
    console.log(`Navigating to ${item}`);
    if (route) {
      router.push(route as any);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Scrollable Content */}
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { alignItems: 'center' }]} 
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Responsive Container */}
        <View style={{ width: contentWidth, paddingHorizontal: SPACING.l }}>
          
          {/* Header Bar */}
          <View style={styles.headerBar}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNo8Wsr0EjwcPMayt9CsqtSf5nZHY3SOgX_o1ZgU_-JOMUtgs7enT-htGOtUORr1UqAyIthgO2TiLJHb-45UVrvBAtpqB6AZ1kB9SkOGirxTvk2KMdmTZ1dX8FFMzdYjX2qHdngpbo3Pv2jNCzs3nE--k-xAMKapxA3dMXZbQcn77fhoIPG3rfIDeXzs9d51Jqk37_xAkW2giPk1tI-7nmLb199euMCPKpdA1I29AWIWkslkksgUUIcPXNSFyHb-svZ5k3UHOHg3U' }} 
                style={styles.avatar} 
              />
            </View>
            <Text style={styles.screenTitle}>Dashboard</Text>
            <TouchableOpacity 
              style={styles.notificationButton}
              onPress={() => handlePress('Notifications', '/(tabs)/notifications')}
            >
              <MaterialIcons name="notifications" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          {/* User Headline */}
          <View style={styles.profileSection}>
            <Text style={styles.userName}>{user?.name || user?.email || 'User'}</Text>
            
            {/* Status Chip */}
            <LinearGradient
              colors={[COLORS.goldStart, COLORS.goldEnd]}
              start={[0, 0]}
              end={[1, 0]}
              style={styles.proChip}
            >
              <MaterialIcons name="star" size={20} color={COLORS.black} />
              <Text style={styles.proText}>Pro • Active</Text>
            </LinearGradient>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <StatCard label="Workouts" value="128" />
            <StatCard label="Week Streak" value="12" />
            <StatCard label="Avg Score" value="95" />
          </View>

          {/* Quick Access */}
          <MenuGroup title="Quick Access">
            <MenuButton 
              icon="fitness-center" 
              label="Workouts" 
              onPress={() => handlePress('Workouts', '/(tabs)/train')} 
            />
            <MenuButton 
              icon="assignment" 
              label="Programs" 
              onPress={() => handlePress('Programs')} 
            />
            <MenuButton 
              icon="emoji-events" 
              label="Challenges" 
              onPress={() => handlePress('Challenges', '/(tabs)/community')} 
            />
          </MenuGroup>

          {/* Features */}
          <MenuGroup title="Features">
            <MenuButton 
              icon="healing" 
              label="Injury Protocols" 
              onPress={() => handlePress('Injury Protocols', '/(tabs)/rehab')} 
            />
            <MenuButton 
              icon="shopping-bag" 
              label="Merch Shop" 
              onPress={() => handlePress('Merch Shop', '/(tabs)/shop')} 
            />
          </MenuGroup>

          {/* Account */}
          <MenuGroup title="Account">
            <MenuButton 
              icon="settings" 
              label="Settings" 
              iconColor={COLORS.textSecondary}
              iconBg="rgba(161, 161, 170, 0.1)"
              onPress={() => handlePress('Settings', '/(tabs)/settings')} 
            />
            
            {/* Divider within Group */}
            <View style={styles.divider} />
            
            <MenuButton 
              icon="notifications" 
              label="Notifications" 
              iconColor={COLORS.textSecondary}
              iconBg="rgba(161, 161, 170, 0.1)"
              onPress={() => handlePress('Notifications', '/(tabs)/notifications')} 
            />
            
            <View style={styles.divider} />
            
            <MenuButton 
              icon="logout" 
              label="Logout" 
              iconColor={COLORS.error}
              iconBg="rgba(239, 68, 68, 0.1)"
              onPress={() => {
                console.log('Logging out...');
                logout();
              }} 
            />
          </MenuGroup>
          
          <View style={{ height: 40 }} />
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
  scrollContent: {
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
    paddingVertical: SPACING.m,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: SIZES.radiusFull,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  screenTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  notificationButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  profileSection: {
    marginBottom: SPACING.xxl,
    paddingHorizontal: SPACING.xs,
  },
  userName: {
    color: COLORS.text,
    fontSize: 32,
    fontFamily: FONTS.bold,
    marginBottom: SPACING.s,
  },
  proChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: SPACING.l,
    borderRadius: SIZES.radiusFull,
    gap: SPACING.xs,
  },
  proText: {
    color: COLORS.black,
    fontSize: 14,
    fontFamily: FONTS.medium,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: SPACING.xxl,
    gap: SPACING.s,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.m,
  },
});
