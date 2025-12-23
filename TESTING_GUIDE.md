# BallerPro API Testing Guide

## 🚀 Quick Start

### Prerequisites
1. **MongoDB** running on `localhost:27017`
2. **Backend server** running on `localhost:5000`
3. **Thunder Client** extension installed in VS Code

---

## 📦 Setup

### 1. Start MongoDB
```bash
# Windows (if installed as service)
net start MongoDB

# Or run manually
mongod --dbpath C:\data\db
```

### 2. Start Backend Server
```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
API running on port 5000
```

### 3. Import Thunder Client Collection
1. Open VS Code
2. Click Thunder Client icon in sidebar
3. Click "Collections" tab
4. Click "..." menu → "Import"
5. Select `thunder-client-collection.json`

---

## 🧪 Testing Flow

### Step 1: Health Check ✅
**No Authentication Required**

```
GET http://localhost:5000/health
```

Expected Response:
```json
{
  "ok": true,
  "service": "ballerpro-api"
}
```

---

### Step 2: Register New User 📝
**No Authentication Required**

```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "testuser@test.com",
  "password": "test123",
  "name": "Test User"
}
```

Expected Response (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**🔑 IMPORTANT: Copy the `token` value - you'll need it for all authenticated requests!**

---

### Step 3: Login User 🔐
**No Authentication Required**

```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "testuser@test.com",
  "password": "test123"
}
```

Expected Response (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "...",
    "refreshToken": "..."
  }
}
```

---

### Step 4: Get Current User 👤
**Authentication Required**

```
GET http://localhost:5000/api/auth/me
Authorization: Bearer <paste_your_token_here>
```

Expected Response (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "testuser@test.com",
      "name": "Test User",
      "avatar": null,
      "isEmailVerified": false,
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

---

### Step 5: Complete Onboarding Flow 🎯

#### Step 5.1: Save Step 1 (About)
```
POST http://localhost:5000/api/onboarding/step1
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "gender": "male"
}
```

Valid values: `male`, `female`, `other`

---

#### Step 5.2: Save Step 2 (Journey)
```
POST http://localhost:5000/api/onboarding/step2
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "experienceLevel": "intermediate"
}
```

Valid values: `beginner`, `intermediate`, `advanced`

---

#### Step 5.3: Save Step 3 (Training Experience)
```
POST http://localhost:5000/api/onboarding/step3
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "injuries": ["knee", "shoulder"],
  "otherDetails": "Had knee surgery 2 years ago"
}
```

Both fields are optional.

---

#### Step 5.4: Save Step 4 (Main Goal) - Completes Onboarding
```
POST http://localhost:5000/api/onboarding/step4
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "goal": "muscle-gain"
}
```

Valid values: `muscle-gain`, `fat-loss`, `maintenance`

Expected Response:
```json
{
  "success": true,
  "message": "Onboarding completed successfully",
  "data": {
    "onboarding": {
      ...
      "completed": true,
      "completedAt": "2025-12-09T10:30:00.000Z"
    }
  }
}
```

---

#### Step 5.5: Check Onboarding Status
```
GET http://localhost:5000/api/onboarding/status
Authorization: Bearer <your_token>
```

---

### Step 6: User Profile Management 👤

#### Get Full Profile
```
GET http://localhost:5000/api/users/profile
Authorization: Bearer <your_token>
```

#### Update Profile
```
PUT http://localhost:5000/api/users/profile
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "avatar": "https://example.com/avatar.jpg"
}
```

---

### Step 7: Token Management 🔄

#### Refresh Token
```
POST http://localhost:5000/api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "<your_refresh_token>"
}
```

Returns new `token` and `refreshToken`.

---

### Step 8: Logout 👋
```
POST http://localhost:5000/api/auth/logout
Authorization: Bearer <your_token>
```

---

## 🐛 Common Issues

### Issue 1: "Connection Refused"
**Cause:** Backend server not running

**Solution:**
```bash
cd backend
npm run dev
```

---

### Issue 2: "MongoDB connection error"
**Cause:** MongoDB not running

**Solution:**
```bash
# Windows
net start MongoDB

# Or check if mongod is running
tasklist | find "mongod"
```

---

### Issue 3: "401 Unauthorized"
**Cause:** Token missing or expired

**Solution:**
1. Login again to get new token
2. Copy the token from response
3. Update Authorization header: `Bearer <new_token>`

---

### Issue 4: "400 Validation Error"
**Cause:** Invalid request body

**Solution:**
- Check the validation rules in `API_CONTRACT.md`
- Ensure JSON is properly formatted
- Check for typos in field names

---

## 📊 Testing Checklist

### ✅ Authentication Flow
- [ ] Health check works
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Can get current user with token
- [ ] Can refresh token
- [ ] Can logout

### ✅ Onboarding Flow
- [ ] Can save step 1 (gender)
- [ ] Can save step 2 (experience level)
- [ ] Can save step 3 (injuries)
- [ ] Can save step 4 (goal)
- [ ] Step 4 marks onboarding as complete
- [ ] Can get onboarding status

### ✅ User Profile
- [ ] Can get full profile
- [ ] Can update profile name
- [ ] Can update profile avatar

### ✅ Error Handling
- [ ] 401 on missing token
- [ ] 400 on invalid email format
- [ ] 400 on short password
- [ ] 401 on wrong password
- [ ] 400 on invalid enum values

---

## 🎯 Thunder Client Tips

### Setting Environment Variables
1. Click Thunder Client → Env tab
2. Add variables:
   ```
   token: <paste_token_here>
   refreshToken: <paste_refresh_token_here>
   ```
3. Use in requests: `{{token}}`

### Saving Response Values
After login/register, you can manually copy tokens or use Thunder Client's test scripts:
```javascript
// In Tests tab of request
if (tc.response.body.success) {
  tc.setVar("token", tc.response.body.data.token);
  tc.setVar("refreshToken", tc.response.body.data.refreshToken);
}
```

---

## 📝 Notes

- **Token Expiry:** 15 minutes (configurable)
- **Refresh Token Expiry:** 30 days
- **Password Min Length:** 6 characters
- **Port:** Backend runs on `5000`, Frontend on `19006`

---

## 🔜 Next: Connect Frontend

Once all API tests pass, you can:
1. Update frontend services to use real API
2. Replace mock data with API calls
3. Test full integration with Expo app

See `API_CONTRACT.md` for the complete Frontend-API mapping.

