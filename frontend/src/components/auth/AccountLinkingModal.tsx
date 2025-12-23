// Account Linking Modal
// Prompts user to enter password to link Google account to existing email/password account

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Input } from '../ui/Input';
import { Button } from '../Button';
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { Ionicons } from '@expo/vector-icons';

interface AccountLinkingModalProps {
  visible: boolean;
  email: string;
  provider: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const AccountLinkingModal: React.FC<AccountLinkingModalProps> = ({
  visible,
  email,
  provider,
  onClose,
  onSuccess,
}) => {
  const { login, linkGoogleAccount } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLink = async () => {
    if (!password) {
      setError('Please enter your password');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Step 1: Sign in with email/password first
      await login({ email, password });

      // Step 2: Link Google account (user is now signed in)
      await linkGoogleAccount(password);

      // Success - close modal and notify parent
      setPassword('');
      onSuccess();
      onClose();
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to link Google account. Please try again.';
      setError(errorMessage);
      Alert.alert('Linking Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setPassword('');
    setError(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Ionicons name="link" size={32} color={colors.primary} />
              <Text style={styles.title}>Link Google Account</Text>
              <Text style={styles.subtitle}>
                An account already exists with {email} using {provider}
              </Text>
            </View>

            {/* Message */}
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>
                To link your Google account, please sign in with your password first.
              </Text>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError(null);
                }}
                secureTextEntry
                showPasswordToggle
                autoCapitalize="none"
                autoComplete="password"
                returnKeyType="done"
                onSubmitEditing={handleLink}
              />
            </View>

            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Actions */}
            <View style={styles.actions}>
              <Button
                title="Cancel"
                onPress={handleCancel}
                variant="secondary"
                style={styles.cancelButton}
                disabled={isLoading}
              />
              <Button
                title={isLoading ? 'Linking...' : 'Link Account'}
                onPress={handleLink}
                variant="primary"
                style={styles.linkButton}
                disabled={isLoading}
                loading={isLoading}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  container: {
    width: '100%',
    maxWidth: 400,
  },
  content: {
    backgroundColor: colors.background,
    borderRadius: spacing.lg,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  messageContainer: {
    backgroundColor: `${colors.primary}15`,
    padding: spacing.md,
    borderRadius: spacing.sm,
    marginBottom: spacing.lg,
  },
  messageText: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  errorContainer: {
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
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  cancelButton: {
    flex: 1,
  },
  linkButton: {
    flex: 1,
  },
});

