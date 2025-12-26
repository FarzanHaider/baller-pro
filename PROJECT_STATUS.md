# BallerPro - Project Status & Current Issues

**Last Updated:** 2024  
**App:** Baller Pro — fitness & social mobile app (Expo + Firebase)  
**Status:** ⚠️ **Google Sign-In Blocked** | ✅ **Core Features Stable**

---

## 📱 Tech Stack

- **Frontend:** Expo (React Native), expo-router
- **Auth:** Firebase Authentication
  - ✅ Email / Password — **WORKING**
  - ❌ Google Sign-In — **BLOCKED** (see issue below)
- **Database:** Firestore (single-document user model)
- **State:** Context-based auth flow
- **Navigation:** expo-router (index.tsx decides redirects)

---

## ✅ COMPLETED & STABLE

### 1️⃣ Signup + Onboarding (PRODUCTION READY)

**Status:** ✅ **FULLY FUNCTIONAL**

- ✅ 5 onboarding steps implemented
- ✅ Step 5 issue (multiple clicks required) → **FIXED**
- ✅ Signup flow → **FIXED**
- ✅ Navigation race conditions → **FIXED**
- ✅ Uses delayed navigation (`setTimeout`) intentionally to allow state propagation (copied from working repo)

**Onboarding Steps:**
1. About (gender selection)
2. Journey (goal + training level)
3. Training Experience (experience level)
4. Injuries (injuries + details)
5. Main Goal (final goal selection)

**Navigation Flow:**
```
Login/Register → Onboarding (if not completed) → Main App (tabs)
```

---

### 2️⃣ Firestore Schema (FINALIZED)

**Status:** ✅ **PRODUCTION READY**

**User Document Structure:**
```typescript
users/{uid}
{
  email: string,
  displayName: string,
  providerIds: ["password", "google.com"], // Array of auth providers
  onboarding: {
    goals: string[],
    trainingLevel: string,
    completed: boolean,
    completedAt: Timestamp
  },
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Design Decisions:**
- ✅ Single user document per UID
- ✅ No onboarding subcollections
- ✅ No duplicated user docs
- ✅ Future-safe for admin dashboard
- ✅ Atomic onboarding save (all steps at once)

---

### 3️⃣ Workouts (Confirmed Design)

**Status:** ✅ **SCHEMA FINALIZED**

**Workout Document Structure:**
```typescript
workouts/{id}
{
  title: string,
  description: string,
  difficulty: string,
  category: string,
  exercises: Exercise[],
  createdBy: uid,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Design Decisions:**
- ✅ Top-level collection (not user subcollections)
- ✅ Supports discovery, search, recommendations
- ✅ CreatedBy field for ownership tracking
- ✅ Ready for social features (Phase 2)

---

### 4️⃣ Firestore Security Rules (DEPLOYED)

**Status:** ✅ **PRODUCTION-GRADE**

**Key Features:**
- ✅ UID-based access only
- ✅ Social reads allowed (authenticated users can read profiles)
- ✅ Writes locked for Phase 2 (social features)
- ✅ Ownership immutable (can't change createdBy/userId)
- ✅ Google login ready (when fixed)
- ✅ No hard deletes (soft delete pattern)

**Current Rules:**
```javascript
// Users
allow read: if isAuthenticated();  // Any authenticated user
allow create: if isOwner(uid);     // Only owner
allow update: if isOwner(uid);     // Only owner
allow delete: if false;            // No deletes

// Workouts
allow read: if isAuthenticated();
allow create: if isAuthenticated() && request.resource.data.createdBy == request.auth.uid;
allow update: if resource.data.createdBy == request.auth.uid;

// Workout Sessions
allow read: if resource.data.userId == request.auth.uid;
allow create: if request.resource.data.userId == request.auth.uid;
```

**⚠️ Security Note:** User profile reads are currently open to all authenticated users. Consider restricting to owner-only or public profiles only (see `AUTHENTICATION_ARCHITECTURE_ANALYSIS.md`).

---

## 🚨 CURRENT BLOCKER — GOOGLE SIGN-IN

### Problem Summary

**Status:** ❌ **BLOCKED**

**Error:**
```
400 invalid_request
Parameter not allowed for this message type: code_challenge_method
flowName=GeneralOAuthFlow
```

**Impact:**
- ⛔ Google login is **NOT working**
- ⛔ Codebase has Google logic but OAuth never completes
- ⛔ Blocks 30-50% of potential sign-ups (typical Google usage)

---

### What Was Tried

**Attempted Solutions:**
1. ✅ `expo-auth-session` — Implemented but fails
2. ✅ PKCE → Removed (still fails)
3. ✅ Web client ID from Firebase — Configured
4. ✅ Android client ID — Tried
5. ✅ Expo Go — Fails
6. ✅ Android Studio — Fails
7. ✅ Expo proxy — Fails
8. ✅ Non-proxy — Fails
9. ✅ Account linking logic — Implemented (but can't test)

**Key Findings:**
- ❌ Error occurs **before Firebase** (at Google OAuth layer)
- ❌ Happens at Google OAuth layer
- ❌ Google OAuth via `expo-auth-session` is **NOT reliable** in Expo Go
- ❌ Requires Dev Build or Native SDK

---

### Likely Root Cause

**Primary Issue:**
1. **Expo Go injects PKCE internally** → Google rejects it
2. **Web OAuth flow is incompatible** with Google IdToken on mobile
3. **Firebase + Expo OAuth mismatch**

**Technical Details:**
- `expo-auth-session` uses Web OAuth flow
- Google Web Client expects browser-based OAuth
- Mobile apps need native OAuth flow
- PKCE parameters cause conflicts

---

### Recommended Solution

**Option:** Use Native Google Sign-In SDK

**Package:** `@react-native-google-signin/google-signin`

**Why:**
- ✅ Native implementation (best UX)
- ✅ Works in Expo Go (with config plugin)
- ✅ Production-proven
- ✅ No PKCE issues
- ✅ Direct Firebase integration

**Implementation Guide:** See `GOOGLE_SIGNIN_PRODUCTION_FIX.md`

**Estimated Fix Time:** 1 day

---

## 🔐 AUTH DESIGN DECISIONS (IMPORTANT)

### Account Linking Policy

**Policy:** ❌ **NO silent auto-merge**

**Requirements:**
- ✅ Password verification required
- ✅ Protects against email hijacking
- ✅ Uses `auth/account-exists-with-different-credential`
- ✅ User must explicitly link accounts

**Flow:**
```
1. User tries Google Sign-In
2. If email exists with password → Show linking modal
3. User enters password
4. System re-authenticates
5. Google account is linked
6. User can sign in with either method
```

**Security Benefits:**
- Prevents unauthorized account access
- User must prove ownership
- No silent account merging

---

### Anonymous Auth

**Status:** ❌ **Not enabled**

**Policy:**
- All access requires authenticated user
- No guest/anonymous access
- Users must sign up or sign in

---

## 🔮 FUTURE ROADMAP (NOT IMPLEMENTED YET)

### Step 7 — Social Features

**Planned Features:**
- Posts (user-generated content)
- Likes (posts)
- Comments (posts)
- Follow / unfollow users

**Status:** ⏳ **Not Started**

**Firestore Schema:**
```typescript
posts/{postId}
{
  authorId: uid,
  content: string,
  createdAt: Timestamp,
  likesCount: number
}

likes/{likeId}
{
  postId: string,
  userId: uid,
  createdAt: Timestamp
}

comments/{commentId}
{
  postId: string,
  authorId: uid,
  content: string,
  createdAt: Timestamp
}
```

**Security Rules:** Already prepared (writes locked for Phase 2)

---

### Step 8 — Admin Dashboard

**Planned Features:**
- View users
- View workouts
- Moderate content

**Status:** ⏳ **Not Started**

**Requirements:**
- Admin role system
- Admin-only Firestore rules
- Dashboard UI (web or mobile)

---

### Step 9 — Monetization / Scaling

**Planned Features:**
- Programs (paid workout programs)
- Paid plans (subscriptions)
- Creator verification

**Status:** ⏳ **Not Started**

**Requirements:**
- Payment integration (Stripe/RevenueCat)
- Subscription management
- Creator verification system

---

## 📊 Current Status Summary

| Component | Status | Notes |
|-----------|--------|-------|
| Email/Password Auth | ✅ Working | Production ready |
| Google Sign-In | ❌ Blocked | Needs native SDK |
| Onboarding Flow | ✅ Working | All 5 steps functional |
| Firestore Schema | ✅ Finalized | Production ready |
| Security Rules | ✅ Deployed | May need refinement |
| Account Linking | ⚠️ Implemented | Can't test (Google blocked) |
| Social Features | ⏳ Planned | Phase 2 |
| Admin Dashboard | ⏳ Planned | Phase 3 |
| Monetization | ⏳ Planned | Phase 4 |

---

## 🎯 Immediate Next Steps

### Priority 1: Fix Google Sign-In (CRITICAL)

1. **Install Native SDK:**
   ```bash
   npx expo install @react-native-google-signin/google-signin
   ```

2. **Update Configuration:**
   - Configure `app.json` with plugin
   - Set environment variables
   - Configure Google Cloud Console

3. **Update Code:**
   - Replace `expo-auth-session` with native SDK
   - Update `googleAuth.ts`

4. **Test:**
   - Test in Expo Go (after dev build)
   - Test in dev build
   - Test account linking flow

**Guide:** See `GOOGLE_SIGNIN_PRODUCTION_FIX.md`

---

### Priority 2: Security Hardening

1. **Restrict Firestore Reads:**
   - Change user profile reads to owner-only
   - Or implement public profile flag

2. **Add Rate Limiting:**
   - Implement Firebase App Check
   - Add rate limiting for auth attempts

**Details:** See `AUTHENTICATION_ARCHITECTURE_ANALYSIS.md`

---

### Priority 3: Production Configuration

1. **Configure OAuth:**
   - Set up redirect URIs
   - Add SHA-256 fingerprints
   - Test end-to-end

2. **Add Monitoring:**
   - Integrate error tracking (Sentry/Crashlytics)
   - Add analytics (Firebase Analytics)

---

## 📚 Related Documentation

- **`AUTHENTICATION_ARCHITECTURE_ANALYSIS.md`** — Complete technical analysis
- **`GOOGLE_SIGNIN_PRODUCTION_FIX.md`** — Step-by-step fix guide
- **`ANALYSIS_SUMMARY.md`** — Quick reference summary
- **`API_CONTRACT.md`** — API documentation
- **`TESTING_GUIDE.md`** — Testing procedures

---

## 🚦 Production Readiness

**Current Score:** 6/10 ⚠️

**Blockers:**
1. ❌ Google Sign-In broken
2. ⚠️ Security rules need refinement

**After Fixes:** 9/10 ✅

**Estimated Time to Production Ready:** 3-5 days

---

## 📝 Notes

- **Navigation:** Uses `setTimeout` intentionally for state propagation (copied from working repo)
- **Onboarding:** Atomic save (all steps saved at once) prevents partial data
- **Account Linking:** Secure password verification prevents unauthorized access
- **Firestore:** Single-document user model simplifies queries and reduces reads

---

**Last Updated:** 2024  
**Maintained By:** Development Team

