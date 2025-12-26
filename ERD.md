# BallerPro Entity Relationship Diagram (ERD)

## Database Schema Overview

This document contains the Entity Relationship Diagram for the BallerPro fitness application database.

> **Quick View:** See [ERD_VISUAL.txt](./ERD_VISUAL.txt) for a text-based visual representation.

---

## 📋 Table of Contents

1. [Mermaid ERD Diagram](#erd-diagram-mermaid)
2. [Entity Descriptions](#entity-descriptions)
3. [Relationship Summary](#relationship-summary)
4. [Recommended Indexes](#indexes-recommended)
5. [Data Flow Diagram](#data-flow-diagram)
6. [Collection Summary](#mongodb-collection-summary)

---

## ERD Diagram (Mermaid)

```mermaid
erDiagram
    User ||--o{ Workout : creates
    User ||--o{ WorkoutSession : completes
    User ||--o{ Meal : logs
    User ||--o{ Post : creates
    User ||--o{ BodyMeasurement : tracks
    User ||--o{ ProgressPhoto : uploads
    User ||--o{ Follow : "follows/followed_by"
    User ||--o{ ProgramEnrollment : enrolls
    
    Workout ||--o{ WorkoutSession : "has sessions"
    Workout ||--o{ Post : "tagged_in"
    Workout ||--o{ WorkoutExercise : contains
    WorkoutExercise }o--|| Exercise : references
    
    Exercise ||--o{ WorkoutExercise : "used_in"
    
    Program ||--o{ ProgramEnrollment : "has enrollments"
    Program ||--o{ ProgramWorkout : contains
    ProgramWorkout }o--|| Workout : references
    
    Post ||--o{ PostLike : "has likes"
    Post ||--o{ PostComment : "has comments"
    PostLike }o--|| User : "liked_by"
    PostComment }o--|| User : "commented_by"
    
    Follow }o--|| User : "follower"
    Follow }o--|| User : "following"

    User {
        ObjectId _id PK
        string email UK "unique"
        string password "hashed"
        string name
        string avatar
        boolean isEmailVerified
        object onboarding "embedded"
        date createdAt
        date updatedAt
    }
    
    Workout {
        ObjectId _id PK
        string title
        string description
        number duration "minutes"
        string difficulty "beginner|intermediate|advanced"
        string category
        string image "URL"
        array tags
        ObjectId createdBy FK "references User"
        date createdAt
        date updatedAt
    }
    
    Exercise {
        ObjectId _id PK
        string name
        string description
        array instructions "embedded"
        string videoUrl
        string imageUrl
        array muscleGroups
        array equipment
        date createdAt
        date updatedAt
    }
    
    WorkoutExercise {
        ObjectId exerciseId FK "references Exercise"
        number sets
        number|string reps
        number restTime "seconds"
        number order
    }
    
    WorkoutSession {
        ObjectId _id PK
        ObjectId userId FK "references User"
        ObjectId workoutId FK "references Workout"
        date startedAt
        date completedAt
        number duration "seconds"
        array exercises "embedded"
        string status "in_progress|completed|abandoned"
        date createdAt
        date updatedAt
    }
    
    Meal {
        ObjectId _id PK
        ObjectId userId FK "references User"
        string name
        string type "breakfast|lunch|dinner|snack"
        string description
        number calories
        object macros "embedded"
        date date
        string icon
        date createdAt
        date updatedAt
    }
    
    Post {
        ObjectId _id PK
        ObjectId userId FK "references User"
        string content
        array images "URLs"
        ObjectId workoutId FK "references Workout, nullable"
        array likes "embedded"
        array comments "embedded"
        date createdAt
        date updatedAt
    }
    
    PostLike {
        ObjectId userId FK "references User"
        date createdAt
    }
    
    PostComment {
        ObjectId userId FK "references User"
        string text
        date createdAt
    }
    
    Program {
        ObjectId _id PK
        string title
        string description
        number duration "weeks"
        string difficulty
        string image "URL"
        ObjectId createdBy FK "references User"
        date createdAt
        date updatedAt
    }
    
    ProgramEnrollment {
        ObjectId _id PK
        ObjectId userId FK "references User"
        ObjectId programId FK "references Program"
        date enrolledAt
        date completedAt
        number currentWeek
        string status "active|completed|abandoned"
        date createdAt
        date updatedAt
    }
    
    ProgramWorkout {
        ObjectId programId FK "references Program"
        ObjectId workoutId FK "references Workout"
        number week
        number day
        number order
    }
    
    BodyMeasurement {
        ObjectId _id PK
        ObjectId userId FK "references User"
        number weight "kg"
        number chest "cm"
        number waist "cm"
        number hips "cm"
        number arms "cm"
        number thighs "cm"
        date measuredAt
        date createdAt
        date updatedAt
    }
    
    ProgressPhoto {
        ObjectId _id PK
        ObjectId userId FK "references User"
        string imageUrl
        number weight "kg, optional"
        string notes
        date takenAt
        date createdAt
        date updatedAt
    }
    
    Follow {
        ObjectId _id PK
        ObjectId followerId FK "references User"
        ObjectId followingId FK "references User"
        date createdAt
    }
```

---

## Entity Descriptions

### 1. User
**Primary Entity** - Stores user account information and authentication data.

**Key Fields:**
- `_id` (PK): Unique identifier
- `email` (UK): Unique email address for login
- `password`: Hashed password (bcrypt)
- `onboarding`: Embedded object containing onboarding steps data
- `isEmailVerified`: Email verification status

**Relationships:**
- One-to-Many with Workout (createdBy)
- One-to-Many with WorkoutSession
- One-to-Many with Meal
- One-to-Many with Post
- One-to-Many with BodyMeasurement
- One-to-Many with ProgressPhoto
- Many-to-Many with User (Follow relationship)

---

### 2. Workout
**Core Entity** - Represents workout plans/templates.

**Key Fields:**
- `_id` (PK): Unique identifier
- `title`: Workout name
- `difficulty`: beginner | intermediate | advanced
- `category`: upper_body | lower_body | full_body | cardio
- `createdBy` (FK): Reference to User who created it

**Relationships:**
- Many-to-One with User (createdBy)
- One-to-Many with WorkoutSession
- One-to-Many with WorkoutExercise (embedded array)
- One-to-Many with Post (optional workout tag)

---

### 3. Exercise
**Reference Entity** - Master list of all exercises.

**Key Fields:**
- `_id` (PK): Unique identifier
- `name`: Exercise name
- `instructions`: Array of step-by-step instructions
- `videoUrl`: Video demonstration URL
- `muscleGroups`: Array of targeted muscle groups
- `equipment`: Array of required equipment

**Relationships:**
- One-to-Many with WorkoutExercise (through Workout)

---

### 4. WorkoutExercise
**Embedded/Junction Entity** - Links exercises to workouts with specific parameters.

**Note:** This is embedded in the Workout document, not a separate collection.

**Key Fields:**
- `exerciseId` (FK): Reference to Exercise
- `sets`: Number of sets
- `reps`: Number of reps (can be string like "10-12")
- `restTime`: Rest time in seconds
- `order`: Order in workout

---

### 5. WorkoutSession
**Transaction Entity** - Tracks individual workout completions.

**Key Fields:**
- `_id` (PK): Unique identifier
- `userId` (FK): Reference to User
- `workoutId` (FK): Reference to Workout
- `status`: in_progress | completed | abandoned
- `exercises`: Array of completed exercise data

**Relationships:**
- Many-to-One with User
- Many-to-One with Workout

---

### 6. Meal
**Transaction Entity** - User's logged meals for nutrition tracking.

**Key Fields:**
- `_id` (PK): Unique identifier
- `userId` (FK): Reference to User
- `name`: Meal name
- `type`: breakfast | lunch | dinner | snack
- `calories`: Calorie count
- `macros`: Embedded object (protein, carbs, fats)
- `date`: Date of meal (for daily tracking)

**Relationships:**
- Many-to-One with User

---

### 7. Post
**Content Entity** - Community posts/feed content.

**Key Fields:**
- `_id` (PK): Unique identifier
- `userId` (FK): Reference to User (post author)
- `content`: Post text content
- `images`: Array of image URLs
- `workoutId` (FK): Optional reference to Workout
- `likes`: Embedded array of PostLike objects
- `comments`: Embedded array of PostComment objects

**Relationships:**
- Many-to-One with User (author)
- Many-to-One with Workout (optional tag)
- One-to-Many with PostLike (embedded)
- One-to-Many with PostComment (embedded)

---

### 8. PostLike
**Embedded Entity** - Likes on posts (embedded in Post).

**Key Fields:**
- `userId` (FK): Reference to User who liked
- `createdAt`: Timestamp

---

### 9. PostComment
**Embedded Entity** - Comments on posts (embedded in Post).

**Key Fields:**
- `userId` (FK): Reference to User who commented
- `text`: Comment text
- `createdAt`: Timestamp

---

### 10. Program
**Entity** - Training programs with multiple workouts.

**Key Fields:**
- `_id` (PK): Unique identifier
- `title`: Program name
- `duration`: Duration in weeks
- `createdBy` (FK): Reference to User (program creator)

**Relationships:**
- Many-to-One with User (createdBy)
- One-to-Many with ProgramEnrollment
- One-to-Many with ProgramWorkout

---

### 11. ProgramEnrollment
**Junction Entity** - Tracks user enrollments in programs.

**Key Fields:**
- `_id` (PK): Unique identifier
- `userId` (FK): Reference to User
- `programId` (FK): Reference to Program
- `status`: active | completed | abandoned
- `currentWeek`: Current week in program

**Relationships:**
- Many-to-One with User
- Many-to-One with Program

---

### 12. ProgramWorkout
**Junction Entity** - Links workouts to programs with scheduling.

**Key Fields:**
- `programId` (FK): Reference to Program
- `workoutId` (FK): Reference to Workout
- `week`: Week number in program
- `day`: Day number in week
- `order`: Order within day

**Relationships:**
- Many-to-One with Program
- Many-to-One with Workout

---

### 13. BodyMeasurement
**Transaction Entity** - User body measurements over time.

**Key Fields:**
- `_id` (PK): Unique identifier
- `userId` (FK): Reference to User
- `weight`: Weight in kg
- `chest`, `waist`, `hips`, `arms`, `thighs`: Measurements in cm
- `measuredAt`: Date of measurement

**Relationships:**
- Many-to-One with User

---

### 14. ProgressPhoto
**Content Entity** - User progress photos.

**Key Fields:**
- `_id` (PK): Unique identifier
- `userId` (FK): Reference to User
- `imageUrl`: Photo URL
- `weight`: Optional weight at time of photo
- `takenAt`: Date photo was taken

**Relationships:**
- Many-to-One with User

---

### 15. Follow
**Junction Entity** - User follow relationships for community features.

**Key Fields:**
- `_id` (PK): Unique identifier
- `followerId` (FK): Reference to User (follower)
- `followingId` (FK): Reference to User (being followed)
- `createdAt`: Timestamp

**Relationships:**
- Many-to-One with User (follower)
- Many-to-One with User (following)

**Constraints:**
- Unique constraint on (followerId, followingId) pair
- Cannot follow self

---

## Relationship Summary

### One-to-Many Relationships
- **User → Workout**: One user can create many workouts
- **User → WorkoutSession**: One user can have many workout sessions
- **User → Meal**: One user can log many meals
- **User → Post**: One user can create many posts
- **User → BodyMeasurement**: One user can have many measurements
- **User → ProgressPhoto**: One user can upload many photos
- **User → ProgramEnrollment**: One user can enroll in many programs
- **Workout → WorkoutSession**: One workout can have many sessions
- **Workout → Post**: One workout can be tagged in many posts
- **Program → ProgramEnrollment**: One program can have many enrollments
- **Post → PostLike**: One post can have many likes (embedded)
- **Post → PostComment**: One post can have many comments (embedded)

### Many-to-Many Relationships
- **User ↔ User** (through Follow): Users can follow each other
- **Workout ↔ Exercise** (through WorkoutExercise): Workouts contain many exercises, exercises can be in many workouts
- **Program ↔ Workout** (through ProgramWorkout): Programs contain many workouts, workouts can be in many programs

### Embedded Documents
- **WorkoutExercise**: Embedded in Workout document
- **PostLike**: Embedded in Post document
- **PostComment**: Embedded in Post document
- **Onboarding**: Embedded in User document

---

## Indexes Recommended

### User Collection
- `email` (unique index)
- `createdAt` (for sorting)

### Workout Collection
- `createdBy` (for user's workouts)
- `category` (for filtering)
- `difficulty` (for filtering)
- `createdAt` (for sorting)

### WorkoutSession Collection
- `userId` (for user's sessions)
- `workoutId` (for workout stats)
- `startedAt` (for date range queries)
- `status` (for filtering)
- Compound index: `(userId, startedAt)` (for user history)

### Meal Collection
- `userId` (for user's meals)
- `date` (for daily tracking)
- Compound index: `(userId, date)` (for user's daily meals)

### Post Collection
- `userId` (for user's posts)
- `createdAt` (for feed sorting)
- `workoutId` (for workout-related posts)
- Compound index: `(userId, createdAt)` (for user feed)

### ProgramEnrollment Collection
- `userId` (for user's programs)
- `programId` (for program stats)
- `status` (for filtering active programs)
- Compound index: `(userId, status)` (for user's active programs)

### Follow Collection
- `followerId` (for followers list)
- `followingId` (for following list)
- Unique compound index: `(followerId, followingId)` (prevent duplicates and self-follow)

---

## Data Flow Diagram

```
User Registration → User Collection
User Login → JWT Token Generation
Onboarding → Update User.onboarding field

Workout Creation → Workout Collection (with embedded WorkoutExercises)
Workout Start → WorkoutSession Collection (status: in_progress)
Workout Complete → Update WorkoutSession (status: completed)

Meal Logging → Meal Collection
Daily Nutrition → Aggregate Meals by date

Post Creation → Post Collection
Like/Comment → Update Post.likes/comments (embedded)

Program Enrollment → ProgramEnrollment Collection
Program Progress → Update ProgramEnrollment.currentWeek
```

---

## MongoDB Collection Summary

| Collection | Primary Purpose | Estimated Size |
|------------|----------------|----------------|
| users | User accounts and profiles | Small (~10K users) |
| workouts | Workout templates | Medium (~1K workouts) |
| exercises | Exercise master data | Small (~500 exercises) |
| workoutsessions | Workout completion history | Large (grows over time) |
| meals | Meal logging history | Large (grows over time) |
| posts | Community feed content | Medium (grows with activity) |
| programs | Training programs | Small (~100 programs) |
| programenrollments | User program enrollments | Medium |
| programworkouts | Program-workout mappings | Small |
| bodymeasurements | Body measurement history | Medium |
| progressphotos | Progress photo gallery | Large (images) |
| follows | User follow relationships | Medium |

---

## Notes

1. **Embedded vs Referenced Documents:**
   - **Embedded**: WorkoutExercise, PostLike, PostComment, Onboarding (for frequently accessed together)
   - **Referenced**: Workout, Exercise, User relationships (for flexibility and normalization)

2. **Scalability Considerations:**
   - Post likes/comments are embedded for read performance but may need refactoring if counts become very large
   - Consider pagination for large collections (WorkoutSession, Meal, Post)
   - Image URLs stored, actual images in cloud storage (S3/Cloudinary)

3. **Data Retention:**
   - Consider archival strategy for old WorkoutSessions and Meals
   - Progress photos should have retention policy

4. **Soft Deletes:**
   - Consider adding `deletedAt` field for soft deletes on Posts, Workouts
   - Maintain referential integrity

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024 | Initial ERD creation |

---

**End of ERD Document**

