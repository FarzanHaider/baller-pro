/**
 * Google Sign-In Service
 * Handles Google OAuth flow with Firebase Auth and account linking
 * 
 * ⚠️ IMPORTANT: Testing Requirements
 * 
 * Google Sign-In with Expo AuthSession does NOT work in Expo Go due to PKCE being
 * automatically injected by Expo Go, which causes OAuth 400 errors with Google.
 * 
 * This implementation is configured for:
 * - Development builds: `expo run:android` or `expo run:ios`
 * - Production builds: EAS Build or standalone builds
 * 
 * DO NOT test Google Sign-In in Expo Go. It will fail with "dismiss" or OAuth errors.
 * 
 * Configuration:
 * - Uses Firebase Web Client ID (EXPO_PUBLIC_GOOGLE_CLIENT_ID) for all platforms
 * - No Android/iOS OAuth client IDs required
 * - Uses Expo proxy redirect (useProxy: true) for development
 * - Uses IdToken response type for Firebase compatibility
 * - No PKCE parameters (Expo handles this automatically in dev/prod builds)
 */

import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { 
  GoogleAuthProvider, 
  signInWithCredential, 
  linkWithCredential,
  fetchSignInMethodsForEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  AuthCredential,
  User as FirebaseUser,
} from 'firebase/auth';
import { firebaseAuth } from '../firebase';

// Required for web authentication
WebBrowser.maybeCompleteAuthSession();

// Google OAuth discovery document
const GOOGLE_DISCOVERY = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  userInfoEndpoint: 'https://www.googleapis.com/oauth2/v3/userinfo',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

// Google OAuth scopes
const GOOGLE_SCOPES = ['openid', 'profile', 'email'];

// Exchange code for token
async function exchangeCodeForTokenAsync(
  code: string,
  clientId: string,
  tokenEndpoint: string
) {
  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      redirect_uri: AuthSession.makeRedirectUri({ useProxy: true }),
      grant_type: 'authorization_code',
    }).toString(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Token exchange error:', errorData);
    throw new Error('Failed to exchange code for token');
  }

  return await response.json();
}

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
 * Get Google OAuth Web Client ID from environment variables
 * 
 * Firebase Authentication requires Google ID tokens issued for a Web OAuth client.
 * Expo AuthSession requires Web Client ID for all platforms (Android, iOS, Web).
 * 
 * ✅ Correct: Using Firebase Web Client ID for all platforms
 * ❌ Incorrect: Using Android/iOS OAuth client IDs (causes OAuth 400 errors)
 * 
 * Configuration steps:
 * 1. Enable Google Sign-In in Firebase Console
 * 2. Get the Web client ID from Firebase Console > Authentication > Sign-in method > Google
 * 3. Add it to environment variables: EXPO_PUBLIC_GOOGLE_CLIENT_ID
 * 
 * This Web Client ID works for:
 * - Development builds (expo run:android, expo run:ios)
 * - Production builds (EAS Build, standalone builds)
 * - Web platform
 * 
 * No separate Android or iOS OAuth client IDs are needed.
 */
function getGoogleClientId(): string {
  const clientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
  
  if (!clientId || clientId.trim() === '') {
    throw new GoogleAuthError(
      'EXPO_PUBLIC_GOOGLE_CLIENT_ID is not configured. ' +
      'Firebase Authentication requires a Web OAuth client ID. ' +
      'Please set EXPO_PUBLIC_GOOGLE_CLIENT_ID in your environment variables.',
      'auth/missing-client-id'
    );
  }
  
  return clientId;
}

/**
 * Google Sign-In Service
 * 
 * Implementation details:
 * - Uses Firebase Web Client ID (works for all platforms)
 * - Uses Expo proxy redirect for OAuth flow
 * - Uses IdToken response type (required for Firebase)
 * - Compatible with Firebase signInWithCredential
 * - Handles account linking for existing email/password accounts
 * 
 * Testing: Must be tested in dev build (expo run:android/ios), NOT Expo Go
 */
export const googleAuthService = {
  /**
   * Initiate Google Sign-In flow
   * 
   * Returns Firebase user on success
   * Throws GoogleAuthError with account-exists-with-different-credential if account exists
   * 
   * ⚠️ This method will fail in Expo Go. Test in dev build or production build.
   */
  async signIn(): Promise<FirebaseUser> {
    try {
      console.log('[GoogleAuth] Starting Google sign-in...');
      
      // 1. Get Firebase Web Client ID (required for all platforms)
      const clientId = getGoogleClientId();
      console.log('[GoogleAuth] Using client ID:', clientId.substring(0, 10) + '...');

      // 2. Create auth request with Expo proxy redirect
      const redirectUri = AuthSession.makeRedirectUri({
        useProxy: true,
        native: 'com.ballerpro.redirect',
      });
      
      console.log('[GoogleAuth] Redirect URI:', redirectUri);

      const request = new AuthSession.AuthRequest({
        clientId,
        scopes: GOOGLE_SCOPES,
        responseType: AuthSession.ResponseType.IdToken,
        redirectUri,
      });

      // 3. Fetch discovery document
      const discovery = await AuthSession.fetchDiscoveryAsync('https://accounts.google.com');
      
      // 4. Prompt user for Google authentication
      console.log('[GoogleAuth] Prompting for Google authentication...');
      const result = await request.promptAsync(discovery, {
        useProxy: true,
      });

      console.log('[GoogleAuth] Auth result type:', result.type);
      
      if (result.type !== 'success') {
        if (result.type === 'cancel') {
          throw new GoogleAuthError('Google sign-in was cancelled', 'auth/cancelled');
        }
        throw new GoogleAuthError(
          `Google sign-in failed: ${result.type}`,
          'auth/google-signin-failed'
        );
      }

      // 5. Extract ID token from response
      if (!result.params?.id_token) {
        console.error('[GoogleAuth] No ID token in response:', result);
        throw new GoogleAuthError(
          'No ID token received from Google',
          'auth/no-id-token'
        );
      }

      const idToken = result.params.id_token;
      console.log('[GoogleAuth] Successfully obtained ID token');

      // 6. Create Firebase credential from Google ID token
      const credential = GoogleAuthProvider.credential(idToken);
      if (!credential) {
        throw new GoogleAuthError(
          'Failed to create Firebase credential',
          'auth/credential-creation-failed'
        );
      }

      // 7. Sign in with Firebase
      try {
        const userCredential = await signInWithCredential(firebaseAuth, credential);
        console.log('[GoogleAuth] signin-success:', { uid: userCredential.user.uid });
        return userCredential.user;
      } catch (firebaseError: any) {
        // Handle account-exists-with-different-credential error
        if (firebaseError.code === 'auth/account-exists-with-different-credential') {
          // Extract email from error if available
          const email = firebaseError.customData?.email;
          
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
    if (!currentUser || !currentUser.email) {
      throw new GoogleAuthError('No authenticated user found', 'auth/no-current-user');
    }

    try {
      console.log('[GoogleAuth] Starting Google account linking...');
      
      // 1. Get Firebase Web Client ID
      const clientId = getGoogleClientId();
      console.log('[GoogleAuth] Using client ID for linking:', clientId.substring(0, 10) + '...');

      // 2. Create auth request with Expo proxy redirect
      const redirectUri = AuthSession.makeRedirectUri({
        useProxy: true,
        native: 'com.ballerpro.redirect',
      });
      
      console.log('[GoogleAuth] Link account redirect URI:', redirectUri);

      const request = new AuthSession.AuthRequest({
        clientId,
        scopes: GOOGLE_SCOPES,
        responseType: AuthSession.ResponseType.IdToken,
        redirectUri,
        // Add login hint to improve UX for account selection
        extraParams: {
          login_hint: currentUser.email,
          prompt: 'select_account',
        },
      });

      // 3. Fetch discovery document
      const discovery = await AuthSession.fetchDiscoveryAsync('https://accounts.google.com');
      
      // 4. Prompt user for Google authentication
      console.log('[GoogleAuth] Prompting for Google authentication (linking)...');
      const result = await request.promptAsync(discovery, {
        useProxy: true,
      });

      console.log('[GoogleAuth] Link auth result type:', result.type);
      
      if (result.type !== 'success') {
        if (result.type === 'cancel') {
          throw new GoogleAuthError('Google sign-in was cancelled', 'auth/cancelled');
        }
        throw new GoogleAuthError(
          `Google sign-in failed during linking: ${result.type}`,
          'auth/google-signin-failed'
        );
      }

      // 5. Extract ID token from response
      if (!result.params?.id_token) {
        console.error('[GoogleAuth] No ID token in link response:', result);
        throw new GoogleAuthError(
          'No ID token received from Google during linking',
          'auth/no-id-token'
        );
      }

      const idToken = result.params.id_token;
      console.log('[GoogleAuth] Successfully obtained ID token for linking');

      // 6. Create Firebase credential from Google ID token
      const credential = GoogleAuthProvider.credential(idToken);
      if (!credential) {
        throw new GoogleAuthError(
          'Failed to create Firebase credential for linking',
          'auth/credential-creation-failed'
        );
      }

      // 7. Link the Google credential to the current user
      console.log('[GoogleAuth] Linking Google account...');
      const userCredential = await linkWithCredential(currentUser, credential);
      console.log('[GoogleAuth] link-account-success:', { uid: userCredential.user.uid });
      return userCredential.user;
    } catch (error: any) {
      console.error('[GoogleAuth] link-account-error:', error);
      
      if (error instanceof GoogleAuthError) {
        throw error;
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
};

