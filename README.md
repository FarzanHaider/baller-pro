# BallerPro 💪

A comprehensive fitness mobile application built with React Native (Expo) and Node.js/Express backend.

## 📱 Overview

BallerPro is a full-stack fitness application designed to help users achieve their fitness goals through:
- **Personalized Workout Plans** - Customized workouts based on goals and experience level
- **Nutrition Tracking** - Track calories, macros, and meals
- **Progress Monitoring** - Body measurements, photos, and workout history
- **Community Features** - Share progress, follow users, and get motivated
- **Training Programs** - Structured multi-week programs

## 🏗️ Tech Stack

### Frontend
- **React Native** with **Expo** (~51.0.0)
- **Expo Router** (File-based routing)
- **TypeScript**
- **React Context API** (State management)
- **Axios** (HTTP client)
- **Expo SecureStore** (Secure token storage)
- **@expo/vector-icons** (Ionicons)

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** (Authentication)
- **bcryptjs** (Password hashing)
- **Zod** (Validation)
- **TypeScript**

## 📁 Project Structure

```
ballerpro/
├── frontend/                 # React Native mobile app
│   ├── app/                  # Expo Router screens
│   │   ├── (tabs)/          # Tab navigation screens
│   │   ├── auth/            # Authentication screens
│   │   ├── onboarding/      # Onboarding flow
│   │   └── workouts/        # Workout screens
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── services/        # API services
│   │   ├── context/         # React Context providers
│   │   ├── theme/           # Design system
│   │   └── types/           # TypeScript types
│   └── package.json
├── backend/                  # Express.js API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── utils/           # Utilities
│   │   └── index.ts         # Server entry
│   └── package.json
├── ERD.md                    # Entity Relationship Diagram
├── DEVELOPMENT_PLAN.md       # Development roadmap
├── MOBILE_APP_REQUIREMENTS.md # Complete requirements doc
└── package.json              # Root scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- MongoDB (local or Atlas)
- Expo CLI (optional, for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mrjaved121/ballerpro.git
   cd ballerpro
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**

   **Backend** (`backend/.env`):
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/ballerpro
   JWT_SECRET=your-secret-key-here
   JWT_REFRESH_SECRET=your-refresh-secret-here
   JWT_EXPIRE=15m
   JWT_REFRESH_EXPIRE=7d
   NODE_ENV=development
   ```

   **Frontend** (`frontend/src/config/env.ts`):
   ```typescript
   export const API_URL = 'http://localhost:3000/api';
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:3000`
   - Frontend Expo dev server

5. **Run the mobile app**
   - Scan the QR code with Expo Go app (iOS/Android)
   - Or press `i` for iOS simulator / `a` for Android emulator

## 📊 Database Schema

The application uses MongoDB with the following main collections:

### Core Entities
- **User** - User accounts and profiles
- **Workout** - Workout templates/plans
- **Exercise** - Master exercise library
- **WorkoutSession** - Completed workout tracking
- **Meal** - Nutrition tracking
- **Post** - Community posts
- **Program** - Training programs
- **BodyMeasurement** - Body measurements
- **ProgressPhoto** - Progress photos

See **[ERD.md](./ERD.md)** for the complete Entity Relationship Diagram with detailed schema, relationships, and indexes.

### Quick ERD Overview

```
User
├── creates → Workout
├── completes → WorkoutSession
├── logs → Meal
├── creates → Post
├── enrolls → Program
├── tracks → BodyMeasurement
└── uploads → ProgressPhoto

Workout
├── contains → Exercise (via WorkoutExercise)
└── has → WorkoutSession

Program
├── contains → Workout (via ProgramWorkout)
└── has → ProgramEnrollment

Post
├── has → PostLike (embedded)
└── has → PostComment (embedded)

User ↔ User (via Follow)
```

## 🔐 Authentication

The app uses JWT-based authentication:
- **Access Token**: Expires in 15 minutes
- **Refresh Token**: Expires in 7 days
- Tokens stored securely using Expo SecureStore
- Auto-refresh on token expiration

## 📱 Features

### ✅ Completed Features

- [x] User Authentication (Register, Login, Password Reset)
- [x] 4-Step Onboarding Flow
  - [x] Step 1: Gender Selection
  - [x] Step 2: Training Experience
  - [x] Step 3: Injury History
  - [x] Step 4: Goal Selection
- [x] Dashboard with Stats
- [x] Workout Browsing & Filtering
- [x] Exercise Detail Screen with Timer
- [x] Nutrition Tracking Screen
- [x] Circular Progress Indicators
- [x] Macro Tracking (Protein, Carbs, Fats)
- [x] Meal Logging UI

### 🚧 In Progress / Planned

- [ ] Workout Session Tracking
- [ ] Active Workout Screen
- [ ] Progress Charts & Analytics
- [ ] Community Feed
- [ ] Program Enrollment
- [ ] Body Measurements Tracking
- [ ] Progress Photos

## 📄 Documentation

- **[ERD.md](./ERD.md)** - Complete database schema and relationships
- **[DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md)** - Development roadmap and phases
- **[MOBILE_APP_REQUIREMENTS.md](./MOBILE_APP_REQUIREMENTS.md)** - Complete requirements document
- **[API_ENDPOINTS_CHECKLIST.md](./API_ENDPOINTS_CHECKLIST.md)** - API endpoints checklist

## 🛠️ Development

### Running Individual Services

**Backend only:**
```bash
npm run dev:backend
```

**Frontend only:**
```bash
npm run dev:frontend
```

### Available Scripts

```bash
# Install all dependencies
npm run install:all

# Start both frontend and backend
npm run dev

# Build for production
npm run build

# Backend only
npm run dev:backend
npm run start:backend

# Frontend only
npm run dev:frontend
npm start:frontend
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📦 Building for Production

### iOS
```bash
cd frontend
eas build --platform ios
```

### Android
```bash
cd frontend
eas build --platform android
```

## 🔒 Environment Variables

See `.env.example` files in both `backend/` and `frontend/` directories for required environment variables.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 👤 Author

**mrjaved121**
- GitHub: [@mrjaved121](https://github.com/mrjaved121)

## 🙏 Acknowledgments

- Expo team for the amazing React Native framework
- MongoDB for the flexible database solution
- All open-source contributors whose packages made this possible

---

## 📊 ERD Quick Reference

For the complete Entity Relationship Diagram, see **[ERD.md](./ERD.md)**

### Main Collections

| Collection | Purpose | Key Fields |
|------------|---------|------------|
| `users` | User accounts | email, password, onboarding |
| `workouts` | Workout templates | title, difficulty, category, exercises |
| `exercises` | Exercise library | name, instructions, videoUrl |
| `workoutsessions` | Workout history | userId, workoutId, status, duration |
| `meals` | Nutrition logs | userId, name, calories, macros, date |
| `posts` | Community feed | userId, content, images, likes, comments |
| `programs` | Training programs | title, duration, difficulty |
| `programenrollments` | User enrollments | userId, programId, status, currentWeek |
| `bodymeasurements` | Body tracking | userId, weight, measurements, date |
| `progressphotos` | Progress photos | userId, imageUrl, takenAt |
| `follows` | User relationships | followerId, followingId |

---

**Made with 💪 for fitness enthusiasts**

