import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/Button';
import { SocialButton } from '../../src/components/ui/SocialButton';
import { Checkbox } from '../../src/components/ui/Checkbox';
import { AccountLinkingModal } from '../../src/components/auth/AccountLinkingModal';
import { useAuth } from '../../src/contexts/AuthContext';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { typography } from '../../src/theme/typography';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, googleSignIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLinkingModal, setShowLinkingModal] = useState(false);
  const [linkingInfo, setLinkingInfo] = useState<{ email: string; provider: string } | null>(null);

  const handleRegister = async () => {
    // Validation
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!acceptedTerms) {
      setError('Please accept the Terms & Conditions');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Call register from AuthContext (handles Firebase signup + Firestore)
      await register({ 
        name: email.split('@')[0], 
        email, 
        password 
      });
      
      // Navigate to root - index.tsx will detect auth state and redirect appropriately
      // New users will be redirected to onboarding
      setTimeout(() => {
        router.replace('/');
      }, 300);
      
    } catch (err: any) {
      console.error('[Register] Error:', err);
      const errorMessage = err.message || 'Failed to register. Please try again.';
      setError(errorMessage);
      Alert.alert('Registration Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignUp = () => {
    // TODO: Implement Apple sign up
    console.log('Apple sign up pressed');
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await googleSignIn();

      // Check if account linking is required
      if (result.requiresLinking) {
        setLinkingInfo(result.requiresLinking);
        setShowLinkingModal(true);
        setIsLoading(false);
        return;
      }

      // Google sign-up successful - navigation will be handled by index.tsx
      router.replace('/');
    } catch (err: any) {
      const errorMessage = err.message || 'Google sign-up failed. Please try again.';
      setError(errorMessage);
      Alert.alert('Google Sign-Up Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkingSuccess = () => {
    // Account linked successfully - navigation will be handled by index.tsx
    router.replace('/');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        bounces={false}
      >
        <View style={styles.content}>
          {/* Icon - Red circle with diamond */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <View style={styles.diamondContainer}>
                <View style={styles.diamondTop} />
                <View style={styles.diamondBottom} />
              </View>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>Create Account</Text>

          {/* Input Fields */}
          <View style={styles.inputsContainer}>
            <Input
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="next"
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              showPasswordToggle
              autoCapitalize="none"
              autoComplete="password"
              returnKeyType="next"
            />

            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              showPasswordToggle
              autoCapitalize="none"
              autoComplete="password"
              returnKeyType="done"
            />
          </View>

          {/* Terms & Conditions Checkbox */}
          <View style={styles.termsContainer}>
            <Checkbox
              checked={acceptedTerms}
              onToggle={() => setAcceptedTerms(!acceptedTerms)}
              labelComponent={
                <Text style={styles.termsText}>
                  I agree to the{' '}
                  <Text style={styles.termsLink}>Terms & Conditions</Text>
                </Text>
              }
            />
          </View>

          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Register Button */}
          <Button
            title={isLoading ? 'Registering...' : 'Register'}
            onPress={handleRegister}
            variant="primary"
            style={styles.registerButton}
            disabled={!acceptedTerms || isLoading}
            loading={isLoading}
          />

          {/* OR Separator */}
          <View style={styles.separatorContainer}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>OR</Text>
            <View style={styles.separatorLine} />
          </View>

          {/* Social Sign Up */}
          <View style={styles.socialContainer}>
            <SocialButton
              provider="apple"
              onPress={handleAppleSignUp}
              variant="signup"
            />
            <SocialButton
              provider="google"
              onPress={handleGoogleSignUp}
              variant="signup"
            />
          </View>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Account Linking Modal */}
      {linkingInfo && (
        <AccountLinkingModal
          visible={showLinkingModal}
          email={linkingInfo.email}
          provider={linkingInfo.provider}
          onClose={() => {
            setShowLinkingModal(false);
            setLinkingInfo(null);
          }}
          onSuccess={handleLinkingSuccess}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.md,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diamondContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diamondTop: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.text,
    marginBottom: -2,
  },
  diamondBottom: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.text,
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 36,
    marginBottom: spacing.xl,
  },
  inputsContainer: {
    width: '100%',
    marginBottom: spacing.md,
  },
  termsContainer: {
    width: '100%',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  termsText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    flex: 1,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
    textDecorationLine: 'underline',
  },
  registerButton: {
    width: '100%',
    height: 64,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
    gap: spacing.md,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.inputBg,
  },
  separatorText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  socialContainer: {
    width: '100%',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  loginText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  loginLink: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
  },
  errorContainer: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.sm,
    backgroundColor: `${colors.error}20`,
    borderRadius: spacing.sm,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
  },
});

