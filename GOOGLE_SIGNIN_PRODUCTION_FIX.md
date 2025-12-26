# Google Sign-In Production Fix Guide
## Step-by-Step Implementation

This guide provides the exact steps to fix Google Sign-In for production using the native Google Sign-In SDK.

---

## Problem Summary

**Current Issue:**
- Google Sign-In fails with `400 invalid_request` (PKCE-related)
- `expo-auth-session` doesn't work reliably in Expo Go or production
- PKCE parameters cause conflicts with Google OAuth Web Client

**Solution:**
- Replace `expo-auth-session` with `@react-native-google-signin/google-signin`
- Use native Google Sign-In SDK (production-proven)
- Direct Firebase integration (no PKCE issues)

---

## Step 1: Install Dependencies

```bash
cd frontend
npx expo install @react-native-google-signin/google-signin
```

**Note:** This package requires a dev build. Expo Go won't work until you build.

---

## Step 2: Configure app.json

Update `frontend/app.json`:

```json
{
  "expo": {
    "name": "BallerPro",
    "slug": "ballerpro",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "dark",
    "splash": {
      "resizeMode": "contain",
      "backgroundColor": "#121212"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.ballerpro.app",
      "googleServicesFile": "./GoogleService-Info.plist"
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#121212"
      },
      "package": "com.ballerpro.app",
      "googleServicesFile": "./google-services.json"
    },
    "scheme": "ballerpro",
    "plugins": [
      "expo-router",
      [
        "@react-native-google-signin/google-signin",
        {
          "iosUrlScheme": "com.ballerpro.app"
        }
      ]
    ]
  }
}
```

**Key Changes:**
- Added `@react-native-google-signin/google-signin` plugin
- Added `iosUrlScheme` for iOS redirects
- Ensured `google-services.json` is referenced (should already exist)

---

## Step 3: Get Google OAuth Client IDs

### 3.1 Get Web Client ID (Required)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `baller-pro`
3. Navigate to **Authentication** > **Sign-in method** > **Google**
4. Copy the **Web client ID** (format: `xxxxx-xxxxx.apps.googleusercontent.com`)

### 3.2 Get iOS Client ID (Optional but Recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: `baller-pro`
3. Navigate to **APIs & Services** > **Credentials**
4. Find or create **iOS OAuth 2.0 Client ID**
5. Copy the **Client ID**

### 3.3 Get Android SHA-256 Fingerprints

**For Debug Build:**
```bash
cd frontend/android
./gradlew signingReport
```

Look for `SHA256:` under `Variant: debug` > `Config: debug`

**For Release Build:**
```bash
keytool -list -v -keystore frontend/android/app/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

Copy the SHA-256 fingerprint.

---

## Step 4: Configure Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: `baller-pro`
3. Navigate to **APIs & Services** > **Credentials**
4. Find your **Web Client ID** (the one from Firebase)
5. Click **Edit**
6. Under **Authorized redirect URIs**, add:
   - `com.ballerpro.app:/` (for Android)
   - `com.ballerpro.app:/` (for iOS)
7. Under **Authorized JavaScript origins**, add:
   - `https://baller-pro.firebaseapp.com`
8. **Save**

### 4.1 Configure Android OAuth Client (if separate)

1. Create or edit **Android OAuth 2.0 Client ID**
2. Add **Package name:** `com.ballerpro.app`
3. Add **SHA-1 certificate fingerprint:** (from Step 3.3)
4. **Save**

---

## Step 5: Update Environment Variables

Create or update `frontend/.env`:

```env
# Google OAuth - Web Client ID (REQUIRED - from Firebase Console)
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-web-client-id.apps.googleusercontent.com

# Google OAuth - iOS Client ID (OPTIONAL - for better iOS experience)
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com
```

**Important:** 
- Web Client ID is **required** and works for all platforms
- iOS Client ID is optional but improves iOS experience
- Never commit `.env` to git (already in `.gitignore`)

---

## Step 6: Update googleAuth.ts

Replace the entire `frontend/src/services/auth/googleAuth.ts` file:

```typescript
/**
 * Google Sign-In Service
 * Production-ready implementation using native Google Sign-In SDK
 * 
 * ✅ Works in Expo Go (with proper configuration)
 * ✅ Works in dev builds
 * ✅ Works in production builds
 * ✅ No PKCE issues
 * ✅ Better UX (native sign-in)
 */

import { 
  GoogleAuthProvider, 
  signInWithCredential, 
  linkWithCredential,
  fetchSignInMethodsForEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User as FirebaseUser,
} from 'firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { firebaseAuth } from '../firebase';
import { Platform } from 'react-native';

/**
 * Google Sign-In Error Types
 */
export class GoogleAuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public existingEmail?: string,
    public existingProvider?: string
  ) {
    super(message);
    this.name = 'GoogleAuthError';
  }
}

/**
 * Initialize Google Sign-In
 * Must be called before using signIn() or linkAccount()
 */
function initializeGoogleSignIn() {
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
  
  if (!webClientId || webClientId.trim() === '') {
    throw new GoogleAuthError(
      'EXPO_PUBLIC_GOOGLE_CLIENT_ID is not configured. ' +
      'Please set EXPO_PUBLIC_GOOGLE_CLIENT_ID in your environment variables.',
      'auth/missing-client-id'
    );
  }

  const config: any = {
    webClientId, // Required: Web Client ID from Firebase Console
    offlineAccess: false, // We don't need offline access
    forceCodeForRefreshToken: false, // Use ID token for Firebase
  };

  // iOS-specific: Add iOS Client ID if available (optional)
  if (Platform.OS === 'ios') {
    const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
    if (iosClientId) {
      config.iosClientId = iosClientId;
    }
  }

  GoogleSignin.configure(config);
}

// Initialize on module load
let isInitialized = false;
if (!isInitialized) {
  try {
    initializeGoogleSignIn();
    isInitialized = true;
  } catch (error) {
    console.error('[GoogleAuth] Initialization error:', error);
  }
}

/**
 * Google Sign-In Service
 */
export const googleAuthService = {
  /**
   * Initiate Google Sign-In flow
   * 
   * Returns Firebase user on success
   * Throws GoogleAuthError with account-exists-with-different-credential if account exists
   */
  async signIn(): Promise<FirebaseUser> {
    try {
      console.log('[GoogleAuth] signin-start');

      // Ensure Google Sign-In is configured
      if (!isInitialized) {
        initializeGoogleSignIn();
        isInitialized = true;
      }

      // Check if Google Play Services are available (Android only)
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      }

      // Sign in with Google
      const { idToken, user: googleUser } = await GoogleSignin.signIn();

      if (!idToken) {
        throw new GoogleAuthError(
          'No ID token received from Google',
          'auth/no-id-token'
        );
      }

      // Create Firebase credential from Google ID token
      const credential = GoogleAuthProvider.credential(idToken);

      // Sign in with Firebase
      try {
        const userCredential = await signInWithCredential(firebaseAuth, credential);
        console.log('[GoogleAuth] signin-success:', { uid: userCredential.user.uid });
        return userCredential.user;
      } catch (firebaseError: any) {
        // Handle account-exists-with-different-credential error
        if (firebaseError.code === 'auth/account-exists-with-different-credential') {
          // Extract email from Google user or error
          const email = googleUser?.email || firebaseError.customData?.email;
          
          // Get sign-in methods for this email
          let signInMethods: string[] = [];
          if (email) {
            try {
              signInMethods = await fetchSignInMethodsForEmail(firebaseAuth, email);
            } catch (err) {
              console.warn('[GoogleAuth] Failed to fetch sign-in methods:', err);
            }
          }

          const existingProvider = signInMethods.includes('password') 
            ? 'email/password' 
            : signInMethods[0] || 'unknown';

          console.log('[GoogleAuth] account-exists:', { email, existingProvider });

          throw new GoogleAuthError(
            'An account already exists with this email using a different sign-in method',
            'auth/account-exists-with-different-credential',
            email,
            existingProvider
          );
        }

        // Re-throw other Firebase errors
        throw firebaseError;
      }
    } catch (error: any) {
      console.error('[GoogleAuth] signin-error:', error);
      
      if (error instanceof GoogleAuthError) {
        throw error;
      }

      // Handle Google Sign-In specific errors
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new GoogleAuthError('Google sign-in was cancelled', 'auth/cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        throw new GoogleAuthError('Google sign-in is already in progress', 'auth/in-progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new GoogleAuthError(
          'Google Play Services not available. Please update Google Play Services.',
          'auth/play-services-not-available'
        );
      }

      // Wrap unknown errors
      throw new GoogleAuthError(
        error.message || 'Google sign-in failed',
        error.code || 'auth/google-signin-error'
      );
    }
  },

  /**
   * Re-authenticate user with password (required before linking)
   * 
   * @param currentUser - Currently signed-in Firebase user
   * @param password - User's password
   */
  async reauthenticateWithPassword(currentUser: FirebaseUser, password: string): Promise<void> {
    if (!currentUser.email) {
      throw new GoogleAuthError(
        'User email is required for re-authentication',
        'auth/no-email'
      );
    }

    const credential = EmailAuthProvider.credential(currentUser.email, password);
    await reauthenticateWithCredential(currentUser, credential);
  },

  /**
   * Link Google account to existing email/password account
   * Requires user to be signed in with email/password and re-authenticated first
   * 
   * @param currentUser - Currently signed-in Firebase user (must be email/password, re-authenticated)
   */
  async linkAccount(currentUser: FirebaseUser): Promise<FirebaseUser> {
    try {
      console.log('[GoogleAuth] link-account-start:', { uid: currentUser.uid });

      // Verify user is signed in with email/password
      if (!currentUser.email || !currentUser.providerData.some(p => p.providerId === 'password')) {
        throw new GoogleAuthError(
          'Account linking requires email/password authentication',
          'auth/invalid-account-type'
        );
      }

      // Ensure Google Sign-In is configured
      if (!isInitialized) {
        initializeGoogleSignIn();
        isInitialized = true;
      }

      // Check if Google Play Services are available (Android only)
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      }

      // Sign in with Google
      const { idToken } = await GoogleSignin.signIn();

      if (!idToken) {
        throw new GoogleAuthError(
          'No ID token received from Google',
          'auth/no-id-token'
        );
      }

      // Create Firebase credential
      const credential = GoogleAuthProvider.credential(idToken);

      // Link credential to current user
      const userCredential = await linkWithCredential(currentUser, credential);
      
      console.log('[GoogleAuth] link-account-success:', { uid: userCredential.user.uid });
      return userCredential.user;
    } catch (error: any) {
      console.error('[GoogleAuth] link-account-error:', error);
      
      if (error instanceof GoogleAuthError) {
        throw error;
      }

      // Handle Google Sign-In specific errors
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new GoogleAuthError('Google sign-in was cancelled', 'auth/cancelled');
      }

      // Handle Firebase linking errors
      if (error.code === 'auth/credential-already-in-use') {
        throw new GoogleAuthError(
          'This Google account is already linked to another account',
          'auth/credential-already-in-use'
        );
      }

      if (error.code === 'auth/requires-recent-login') {
        throw new GoogleAuthError(
          'Please sign in again to link your Google account',
          'auth/requires-recent-login'
        );
      }

      throw new GoogleAuthError(
        error.message || 'Failed to link Google account',
        error.code || 'auth/link-error'
      );
    }
  },

  /**
   * Sign out from Google (optional - Firebase handles this)
   */
  async signOut(): Promise<void> {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.error('[GoogleAuth] signout-error:', error);
      // Don't throw - Firebase signOut will handle cleanup
    }
  },
};
```

---

## Step 7: Remove Old Dependencies (Optional)

After confirming the new implementation works, you can remove `expo-auth-session`:

```bash
cd frontend
npm uninstall expo-auth-session
```

**Note:** Keep it for now until you've fully tested the new implementation.

---

## Step 8: Rebuild App

Since we're using a native module, you need to rebuild:

```bash
cd frontend

# For Android
npx expo run:android

# For iOS
npx expo run:ios
```

**Important:** 
- Expo Go won't work until you build a dev build
- After building, the app will work in Expo Go (if configured correctly)

---

## Step 9: Testing Checklist

### 9.1 Basic Sign-In

- [ ] New user can sign in with Google
- [ ] User document is created in Firestore
- [ ] User is redirected to onboarding
- [ ] Onboarding flow works correctly

### 9.2 Account Linking

- [ ] User with email/password account can link Google
- [ ] Password verification works
- [ ] Account linking succeeds
- [ ] User can sign in with either method after linking

### 9.3 Error Handling

- [ ] Cancelled sign-in shows appropriate message
- [ ] Account exists error triggers linking modal
- [ ] Network errors are handled gracefully
- [ ] Google Play Services errors are handled (Android)

### 9.4 Production Testing

- [ ] Test with release build
- [ ] Test on physical devices (Android + iOS)
- [ ] Test with different Google accounts
- [ ] Test account linking flow end-to-end

---

## Step 10: Troubleshooting

### Issue: "DEVELOPER_ERROR" on Android

**Cause:** SHA-256 fingerprint not configured or package name mismatch

**Fix:**
1. Get SHA-256 fingerprint (see Step 3.3)
2. Add to Google Cloud Console > Credentials > Android OAuth Client
3. Ensure package name matches `app.json` (`com.ballerpro.app`)

### Issue: "Sign-in cancelled" immediately

**Cause:** Google Sign-In not properly configured

**Fix:**
1. Verify `EXPO_PUBLIC_GOOGLE_CLIENT_ID` is set
2. Check `google-services.json` exists and is valid
3. Rebuild app after configuration changes

### Issue: "No ID token received"

**Cause:** OAuth client not configured for mobile

**Fix:**
1. Use Web Client ID (not Android/iOS specific)
2. Ensure redirect URIs are configured
3. Check Firebase Console > Authentication > Sign-in method > Google is enabled

### Issue: Works in dev build but not Expo Go

**Cause:** Native module requires dev build

**Fix:**
- This is expected. Use dev build for testing.
- Or configure EAS Build for Expo Go compatibility (advanced)

---

## Step 11: Production Deployment

### 11.1 Pre-Deployment Checklist

- [ ] All environment variables set in production
- [ ] SHA-256 fingerprints added for release keystore
- [ ] OAuth redirect URIs configured for production
- [ ] Firebase project configured correctly
- [ ] Tested on physical devices

### 11.2 EAS Build Configuration

If using EAS Build, ensure `eas.json` includes:

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_GOOGLE_CLIENT_ID": "your-web-client-id"
      }
    }
  }
}
```

### 11.3 Monitoring

After deployment, monitor:
- Google Sign-In success rate
- Account linking success rate
- Error rates (use Firebase Crashlytics)
- User feedback

---

## Migration Notes

### Breaking Changes

- **Expo Go:** Will require dev build (one-time setup)
- **Environment Variables:** Must set `EXPO_PUBLIC_GOOGLE_CLIENT_ID`
- **Google Cloud Console:** Must configure SHA-256 fingerprints

### Backward Compatibility

- Existing email/password users: ✅ No impact
- Existing Google users: ✅ No impact (same Firebase Auth)
- Account linking: ✅ Works the same way

### Rollback Plan

If issues occur:
1. Revert `googleAuth.ts` to previous version
2. Reinstall `expo-auth-session`
3. Rebuild app
4. Investigate issues in staging

---

## Success Criteria

✅ Google Sign-In works in Expo Go (after dev build)  
✅ Google Sign-In works in dev builds  
✅ Google Sign-In works in production builds  
✅ Account linking works correctly  
✅ No PKCE errors  
✅ Better UX (native sign-in vs browser redirect)  

---

## Additional Resources

- [Google Sign-In React Native Docs](https://github.com/react-native-google-signin/google-signin)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Expo Native Modules Guide](https://docs.expo.dev/bare/overview/)

---

**End of Implementation Guide**

