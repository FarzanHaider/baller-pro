# 🚀 BallerPro - Complete Setup Guide

## 📱 Testing on Mobile with Expo Go

### ⚠️ Important: Localhost Issue

When testing on a **physical mobile device** with **Expo Go**, your phone **cannot access `localhost:5000`** because:
- `localhost` on your phone refers to the phone itself, not your computer
- You need to use your **computer's local IP address** instead

The API configuration has been **automatically updated** to detect and use the correct IP address!

---

## 🔧 Setup Instructions

### **Option A: Same WiFi Network (Recommended - Easiest)**

#### **Step 1: Find Your Computer's IP Address**

**Windows:**
```bash
# Open Command Prompt (CMD) and type:
ipconfig

# Look for "IPv4 Address" under your active network adapter
# Example: 192.168.1.100
```

**Mac/Linux:**
```bash
# Open Terminal and type:
ifconfig | grep "inet "

# Or check in: System Preferences > Network
# Example: 192.168.1.100
```

Your IP will usually be in one of these formats:
- `192.168.x.x` (most common for home WiFi)
- `10.0.x.x` (some routers)
- `172.16.x.x` (less common)

#### **Step 2: Update API Config (Only if auto-detection fails)**

The app should automatically detect your IP, but if it doesn't work:

1. Open `frontend/src/config/api.ts`
2. Find this line:
   ```typescript
   const MANUAL_IP = '192.168.1.100'; // ⚠️ REPLACE THIS
   ```
3. Replace with **your actual IP address**
4. Save the file

#### **Step 3: Ensure Same WiFi**

✅ Make sure your:
- Computer is connected to WiFi (e.g., "Home WiFi")
- Phone is connected to the **same** WiFi network

❌ This won't work if:
- Phone is on cellular/mobile data
- Phone is on different WiFi
- Computer is using Ethernet (still works, but needs IP setup)

#### **Step 4: Start Backend**

```bash
cd backend
npm run dev

# You should see:
# ✅ MongoDB connected successfully
# API running on port 5000
```

#### **Step 5: Start Frontend**

```bash
cd frontend
npm start

# Scan QR code with Expo Go app on your phone
```

#### **Step 6: Test API Connection**

When you open the app, check the console/terminal logs:
```
[API Config] 📱 Mobile detected - Using local IP: http://192.168.1.100:5000/api
```

If you see this, you're good! ✅

---

### **Option B: Different Networks / ngrok (Advanced)**

Use this if:
- Your phone is on cellular data
- Your phone is on different WiFi
- Option A doesn't work

#### **Step 1: Install ngrok**

```bash
# Download from: https://ngrok.com/download
# Or with npm:
npm install -g ngrok

# Sign up for free account at ngrok.com and get auth token
ngrok authtoken YOUR_AUTH_TOKEN
```

#### **Step 2: Start Backend**

```bash
cd backend
npm run dev

# Backend runs on port 5000
```

#### **Step 3: Expose Backend with ngrok**

```bash
# In a new terminal:
ngrok http 5000

# You'll see output like:
# Forwarding    https://abc123.ngrok.io -> http://localhost:5000
```

**Copy the `https://abc123.ngrok.io` URL!**

#### **Step 4: Update API Config**

Open `frontend/src/config/api.ts` and modify:

```typescript
function getApiUrl(): string {
  if (!isDevelopment) {
    return 'https://api.ballerpro.com/api';
  }

  // FOR NGROK: Temporarily use ngrok URL
  return 'https://YOUR_NGROK_URL.ngrok.io/api'; // ← Replace with your ngrok URL
  
  // Comment out the rest of the function temporarily
  // ...
}
```

#### **Step 5: Start Frontend**

```bash
cd frontend
npm start
```

Now your phone can connect through the ngrok tunnel! ✅

---

## 🧪 Testing the Connection

### **1. Test from the App**

Open your app and try to register/login. Watch the console logs:

**Success:**
```
[API Config] 📱 Mobile detected - Using local IP: http://192.168.1.100:5000/api
[ApiService] 🚀 POST /auth/register
[ApiService] ✅ POST /auth/register - 201
[AuthService] ✅ Registration successful: user@example.com
```

**Failure (Connection refused):**
```
[ApiService] ❌ Network error - No response received
[AuthService] ❌ Registration error: Unable to connect to server
```

### **2. Test from Browser (Computer)**

Open: `http://YOUR_IP:5000/api/health`

You should see: `{"status":"ok"}`

### **3. Test from Phone Browser**

Open Safari/Chrome on your phone and visit:
`http://YOUR_IP:5000/api/health`

If this works, the API configuration should work!

---

## 🐛 Troubleshooting

### **Issue: "Unable to connect to server"**

**Cause:** Phone can't reach backend

**Solutions:**
1. ✅ Verify both devices on same WiFi
2. ✅ Check your computer's firewall (allow port 5000)
3. ✅ Verify backend is running (`npm run dev` in backend folder)
4. ✅ Test IP in phone browser: `http://YOUR_IP:5000/api/health`
5. ✅ Update `MANUAL_IP` in `frontend/src/config/api.ts`
6. ✅ Try ngrok (Option B)

**Windows Firewall:**
```bash
# Allow Node.js through firewall:
# 1. Open "Windows Defender Firewall"
# 2. Click "Allow an app through firewall"
# 3. Find Node.js and check both Private and Public
```

---

### **Issue: "Network request failed"**

**Cause:** CORS or network configuration

**Solution:**
Your backend already has CORS enabled, but verify:

```javascript
// backend/src/index.js
app.use(cors({
  origin: '*', // ← Should allow all origins in development
  credentials: true
}));
```

---

### **Issue: Auto-detection not working**

**Cause:** `Constants.expoConfig.hostUri` is undefined

**Solution:**
Manually set your IP in `frontend/src/config/api.ts`:
```typescript
const MANUAL_IP = '192.168.1.100'; // ← Your actual IP here
```

---

### **Issue: Works on computer but not on phone**

**Cause:** Computer firewall blocking external connections

**Solution:**
- Temporarily disable firewall to test
- Or add exception for Node.js on port 5000
- Or use ngrok

---

## 📋 Quick Start Checklist

For fastest setup:

- [ ] **Backend running** (`cd backend && npm run dev`)
- [ ] **MongoDB connected** (check backend logs)
- [ ] **Find your IP** (`ipconfig` on Windows, `ifconfig` on Mac)
- [ ] **Update MANUAL_IP if needed** (in `frontend/src/config/api.ts`)
- [ ] **Same WiFi** (computer and phone)
- [ ] **Firewall allows port 5000** (Windows Defender)
- [ ] **Start frontend** (`cd frontend && npm start`)
- [ ] **Scan QR code** with Expo Go
- [ ] **Check console logs** for API URL

---

## 🎯 Final Check

When app launches, you should see in console:
```
[API Config] 📱 Mobile detected - Using local IP: http://192.168.x.x:5000/api
```

If you see this with your correct IP, **you're all set!** ✅

---

## 📚 Project Structure

After cleanup, you now have these documentation files:

| File | Purpose |
|------|---------|
| `README.md` | Project overview |
| `SETUP_GUIDE.md` | This file - setup instructions |
| `NAVIGATION_FLOW_COMPLETE.md` | Complete navigation flow documentation |
| `API_CONTRACT.md` | Full API documentation |
| `ERD.md` | Database schema |
| `TESTING_GUIDE.md` | Testing instructions |

---

## 🎉 What's Working

Once connected, your app has:

✅ **Complete Auth Flow**
- Register (creates user in MongoDB via API)
- Login (authenticates with backend)
- Logout (clears tokens and session)
- Auto token refresh

✅ **Navigation Flow**
- Startup → Login → Onboarding → Main App
- Route protection on all stacks
- Session persistence
- Automatic redirects

✅ **Security**
- JWT tokens stored in SecureStore (encrypted)
- Bearer token authentication
- Automatic token refresh
- Secure password handling

---

## 🔄 Development Workflow

**Every time you start development:**

1. Start backend:
   ```bash
   cd backend
   npm run dev
   ```

2. Start frontend:
   ```bash
   cd frontend
   npm start
   ```

3. Scan QR with Expo Go on phone

4. Check console logs for API connection

---

## 🚀 Ready for Production

When deploying to production:

1. Deploy backend to your server (e.g., Heroku, AWS, DigitalOcean)
2. Get production URL (e.g., `https://api.yourdomain.com`)
3. Update `frontend/src/config/api.ts`:
   ```typescript
   if (!isDevelopment) {
     return 'https://api.yourdomain.com/api'; // ← Your production URL
   }
   ```
4. Build and deploy frontend

The API config will automatically use production URL in production builds!

---

**Need Help?** Check the console logs first - they show exactly what's happening! 🔍

