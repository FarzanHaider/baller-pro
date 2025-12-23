import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ImageBackground, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  SafeAreaView,
  StatusBar,
  useWindowDimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';
import AuthInput from '@/components/ui/AuthInput';
import SocialBadge from '@/components/ui/SocialBadge';

export default function LinkAccountScreen() {
  const { width } = useWindowDimensions();
  // Responsive: Max width for tablet, full width for mobile
  // Account for horizontal padding to ensure equal gaps on all sides
  const horizontalPadding = SPACING.m * 2;
  const contentWidth = Math.min(width - horizontalPadding, SIZES.containerMaxWidth);

  const handleLink = () => {
    console.log("Verify & Link Account");
  };

  const handleCancel = () => {
    console.log("Cancel");
  };

  return (
    <ImageBackground 
      source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4hRIA1wow84IhFxO_Gdr8Jm6smjiV_9yiI1ljkQfwdL7lTeM0BVE4MSpfRjls-XE09Uk1lnaS51PPC-eLw5nqi186udXwdqUFbfymD-cNGi8PnqFhEb2H_jbSxODYEwIjhhC86AiSBHBC3HhjsqUbCMMnrelYt-Qn2Q63YENArzpseSbSARifEu9jACircdoBw4tbEoGHrAJykRBfa6Iq8dd99aWDSvF8f-tkUPB1xbuzYwGz98wcKfWj9wy0kQIAjTBChItaYP8Q' }} 
      style={styles.background}
      resizeMode="cover"
      blurRadius={3} // Native blur effect
    >
      <StatusBar barStyle="light-content" />
      
      {/* Dark Overlay */}
      <View style={styles.overlay} />

      {/* Main Safe Container */}
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Modal Card */}
            <View style={[styles.card, { width: contentWidth }]}>
              
              {/* Handle Bar (Visual Only) */}
              <View style={styles.handleBar} />

              <View style={styles.cardContent}>
                
                {/* Icons */}
                <SocialBadge />

                {/* Header Text */}
                <View style={styles.textSection}>
                  <Text style={styles.title}>Link Google Account</Text>
                  <Text style={styles.description}>
                    An account with <Text style={styles.highlight}>user@example.com</Text> already exists. 
                    To keep your account secure, please confirm your password to link Google.
                  </Text>
                </View>

                {/* Inputs */}
                <View style={styles.formSection}>
                  <AuthInput
                    label="Email Address"
                    value="user@example.com"
                    icon="mail"
                    rightIcon="check-circle"
                    rightIconColor={COLORS.success}
                    editable={false} // Disabled styling
                    style={{ opacity: 0.8 }}
                  />

                  <AuthInput
                    label="Confirm Password"
                    placeholder="Enter your password"
                    icon="lock"
                    isPassword
                    rightLabelLink="FORGOT?"
                    onRightLabelPress={() => console.log('Forgot Password')}
                  />
                </View>

                {/* Actions */}
                <View style={styles.actionSection}>
                  <TouchableOpacity 
                    style={styles.primaryButton} 
                    activeOpacity={0.9}
                    onPress={handleLink}
                  >
                    <Text style={styles.primaryBtnText}>Verify & Link Account</Text>
                    <MaterialIcons name="arrow-forward" size={20} color={COLORS.white} />
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.secondaryButton} 
                    onPress={handleCancel}
                  >
                    <Text style={styles.secondaryBtnText}>Cancel</Text>
                  </TouchableOpacity>
                </View>

                {/* Footer Security Badge */}
                <View style={styles.footerBadge}>
                  <MaterialIcons name="security" size={14} color={COLORS.textSecondary} />
                  <Text style={styles.footerText}>Secure Connection</Text>
                </View>

              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)', // Dark overlay
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
    justifyContent: 'center', // Centers card vertically
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.m,
  },
  card: {
    backgroundColor: COLORS.modalBg,
    borderRadius: SIZES.radiusXl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  handleBar: {
    width: 40,
    height: 6,
    backgroundColor: '#3F3F46', // Zinc-700
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: SPACING.l,
    marginBottom: SPACING.xs,
  },
  cardContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxl,
    paddingTop: SPACING.s,
  },
  textSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    color: COLORS.white,
    fontSize: 22,
    fontFamily: FONTS.bold,
    marginBottom: SPACING.s,
    textAlign: 'center',
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontFamily: FONTS.regular,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: SPACING.s,
  },
  highlight: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
  },
  formSection: {
    marginBottom: SPACING.l,
  },
  actionSection: {
    gap: SPACING.m,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    borderRadius: SIZES.radiusFull,
    gap: SPACING.s,
    // Glow Effect
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontFamily: FONTS.bold,
  },
  secondaryButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radiusFull,
  },
  secondaryBtnText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
  footerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.m,
    opacity: 0.5,
    gap: 6,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

