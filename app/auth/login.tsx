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
import { AccountLinkingModal } from '../../src/components/auth/AccountLinkingModal';
import { useAuth } from '../../src/contexts/AuthContext';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { typography } from '../../src/theme/typography';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const { login, googleSignIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLinkingModal, setShowLinkingModal] = useState(false);
  const [linkingInfo, setLinkingInfo] = useState<{ email: string; provider: string } | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Call login from AuthContext (handles Firebase signin)
      await login({ email, password });
      
      // Login successful - navigation will be handled by index.tsx based on auth state
        router.replace('/');
      
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to login. Please try again.';
      setError(errorMessage);
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Navigate to forgot password screen
    console.log('Forgot password pressed');
  };

  const handleAppleSignIn = () => {
    // TODO: Implement Apple sign in
    console.log('Apple sign in pressed');
  };

  const handleGoogleSignIn = async () => {
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

      // Google sign-in successful - navigation will be handled by index.tsx
      router.replace('/');
    } catch (err: any) {
      const errorMessage = err.message || 'Google sign-in failed. Please try again.';
      setError(errorMessage);
      Alert.alert('Google Sign-In Failed', errorMessage);
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
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Ionicons name="fitness" size={64} color={colors.primary} />
          </View>

          {/* Title */}
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Unleash Your Potential</Text>

          {/* Input Fields */}
          <View style={styles.inputsContainer}>
            <Input
              label="Email"
              placeholder="Enter your email"
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
              returnKeyType="done"
            />
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            onPress={handleForgotPassword}
            style={styles.forgotPasswordContainer}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Login Button */}
          <Button
            title={isLoading ? 'Logging in...' : 'Login'}
            onPress={handleLogin}
            variant="primary"
            style={styles.loginButton}
            disabled={isLoading}
            loading={isLoading}
          />

          {/* OR Separator */}
          <View style={styles.separatorContainer}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>OR</Text>
            <View style={styles.separatorLine} />
          </View>

          {/* Social Sign In */}
          <View style={styles.socialContainer}>
            <SocialButton provider="apple" onPress={handleAppleSignIn} />
            <SocialButton provider="google" onPress={handleGoogleSignIn} />
          </View>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/register')}>
              <Text style={styles.signUpLink}>Sign Up</Text>
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
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.normal,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  inputsContainer: {
    width: '100%',
    marginBottom: spacing.sm,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: spacing.xl,
  },
  forgotPasswordText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.accent,
  },
  loginButton: {
    width: '100%',
    height: 64,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  signUpText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  signUpLink: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
});

