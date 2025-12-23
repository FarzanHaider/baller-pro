import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting seed...');

  // Create workout categories
  const categories = await Promise.all([
    prisma.workoutCategory.upsert({
      where: { slug: 'strength' },
      update: {},
      create: { name: 'Strength', slug: 'strength', icon: 'fitness-center', sortOrder: 1 },
    }),
    prisma.workoutCategory.upsert({
      where: { slug: 'speed' },
      update: {},
      create: { name: 'Speed', slug: 'speed', icon: 'directions-run', sortOrder: 2 },
    }),
    prisma.workoutCategory.upsert({
      where: { slug: 'power' },
      update: {},
      create: { name: 'Power', slug: 'power', icon: 'flash-on', sortOrder: 3 },
    }),
    prisma.workoutCategory.upsert({
      where: { slug: 'endurance' },
      update: {},
      create: { name: 'Endurance', slug: 'endurance', icon: 'timer', sortOrder: 4 },
    }),
    prisma.workoutCategory.upsert({
      where: { slug: 'flexibility' },
      update: {},
      create: { name: 'Flexibility', slug: 'flexibility', icon: 'self-improvement', sortOrder: 5 },
    }),
  ]);

  console.log(`Created ${categories.length} workout categories`);

  // Create exercises
  const exercises = await Promise.all([
    prisma.exercise.upsert({
      where: { id: 'ex-squat' },
      update: {},
      create: {
        id: 'ex-squat',
        name: 'Barbell Squat',
        description: 'A compound lower body exercise targeting quads, hamstrings, and glutes.',
        instructions: '1. Stand with feet shoulder-width apart\n2. Lower your body by bending knees\n3. Keep chest up and back straight\n4. Push through heels to return to start',
        muscleGroups: ['quadriceps', 'hamstrings', 'glutes'],
        equipment: ['barbell', 'squat rack'],
      },
    }),
    prisma.exercise.upsert({
      where: { id: 'ex-deadlift' },
      update: {},
      create: {
        id: 'ex-deadlift',
        name: 'Deadlift',
        description: 'Full body compound exercise for overall strength.',
        instructions: '1. Stand with feet hip-width apart\n2. Hinge at hips to grip the bar\n3. Drive through heels and stand tall\n4. Lower with control',
        muscleGroups: ['back', 'hamstrings', 'glutes', 'core'],
        equipment: ['barbell'],
      },
    }),
    prisma.exercise.upsert({
      where: { id: 'ex-bench-press' },
      update: {},
      create: {
        id: 'ex-bench-press',
        name: 'Bench Press',
        description: 'Upper body push exercise targeting chest, shoulders, and triceps.',
        instructions: '1. Lie on bench with feet flat on floor\n2. Grip bar slightly wider than shoulder width\n3. Lower bar to chest\n4. Press back up to start',
        muscleGroups: ['chest', 'shoulders', 'triceps'],
        equipment: ['barbell', 'bench'],
      },
    }),
    prisma.exercise.upsert({
      where: { id: 'ex-pull-up' },
      update: {},
      create: {
        id: 'ex-pull-up',
        name: 'Pull-ups',
        description: 'Upper body pull exercise for back and biceps.',
        instructions: '1. Hang from bar with overhand grip\n2. Pull body up until chin clears bar\n3. Lower with control\n4. Repeat',
        muscleGroups: ['back', 'biceps', 'core'],
        equipment: ['pull-up bar'],
      },
    }),
    prisma.exercise.upsert({
      where: { id: 'ex-box-jump' },
      update: {},
      create: {
        id: 'ex-box-jump',
        name: 'Box Jumps',
        description: 'Plyometric exercise for explosive leg power.',
        instructions: '1. Stand facing box\n2. Swing arms and jump onto box\n3. Land softly with bent knees\n4. Step down and repeat',
        muscleGroups: ['quadriceps', 'glutes', 'calves'],
        equipment: ['plyo box'],
      },
    }),
    prisma.exercise.upsert({
      where: { id: 'ex-sprint' },
      update: {},
      create: {
        id: 'ex-sprint',
        name: 'Sprint Intervals',
        description: 'High-intensity running for speed and conditioning.',
        instructions: '1. Sprint at maximum effort for set distance\n2. Walk or jog back to start\n3. Rest as needed\n4. Repeat',
        muscleGroups: ['quadriceps', 'hamstrings', 'calves', 'core'],
        equipment: [],
      },
    }),
    prisma.exercise.upsert({
      where: { id: 'ex-plank' },
      update: {},
      create: {
        id: 'ex-plank',
        name: 'Plank Hold',
        description: 'Core stability exercise.',
        instructions: '1. Get into push-up position on forearms\n2. Keep body in straight line\n3. Engage core and hold\n4. Breathe steadily',
        muscleGroups: ['core', 'shoulders'],
        equipment: [],
      },
    }),
    prisma.exercise.upsert({
      where: { id: 'ex-lunges' },
      update: {},
      create: {
        id: 'ex-lunges',
        name: 'Walking Lunges',
        description: 'Unilateral leg exercise for strength and balance.',
        instructions: '1. Step forward into lunge\n2. Lower until back knee nearly touches ground\n3. Push through front heel\n4. Step forward with other leg',
        muscleGroups: ['quadriceps', 'hamstrings', 'glutes'],
        equipment: ['dumbbells'],
      },
    }),
  ]);

  console.log(`Created ${exercises.length} exercises`);

  // Create workouts
  const strengthCategory = categories.find(c => c.slug === 'strength')!;
  const speedCategory = categories.find(c => c.slug === 'speed')!;
  const powerCategory = categories.find(c => c.slug === 'power')!;
  const enduranceCategory = categories.find(c => c.slug === 'endurance')!;

  const workouts = await Promise.all([
    prisma.workout.upsert({
      where: { id: 'workout-strength-1' },
      update: {},
      create: {
        id: 'workout-strength-1',
        title: 'Full Body Strength',
        description: 'Complete strength workout targeting all major muscle groups. Perfect for building a strong foundation.',
        categoryId: strengthCategory.id,
        durationMinutes: 45,
        difficulty: 'Intermediate',
        location: 'Gym',
        tags: ['strength', 'full-body', 'compound'],
        isPremium: false,
      },
    }),
    prisma.workout.upsert({
      where: { id: 'workout-strength-2' },
      update: {},
      create: {
        id: 'workout-strength-2',
        title: 'Lower Body Power',
        description: 'Focused leg workout for building powerful legs essential for football performance.',
        categoryId: strengthCategory.id,
        durationMinutes: 40,
        difficulty: 'Intermediate',
        location: 'Gym',
        tags: ['strength', 'legs', 'power'],
        isPremium: false,
      },
    }),
    prisma.workout.upsert({
      where: { id: 'workout-speed-1' },
      update: {},
      create: {
        id: 'workout-speed-1',
        title: 'Sprint Training',
        description: 'High-intensity sprint session to improve your top speed and acceleration.',
        categoryId: speedCategory.id,
        durationMinutes: 30,
        difficulty: 'Advanced',
        location: 'Field',
        tags: ['speed', 'sprints', 'conditioning'],
        isPremium: false,
      },
    }),
    prisma.workout.upsert({
      where: { id: 'workout-power-1' },
      update: {},
      create: {
        id: 'workout-power-1',
        title: 'Explosive Power',
        description: 'Plyometric workout focused on developing explosive power for jumping and quick movements.',
        categoryId: powerCategory.id,
        durationMinutes: 35,
        difficulty: 'Advanced',
        location: 'Gym',
        tags: ['power', 'plyometrics', 'explosive'],
        isPremium: true,
      },
    }),
    prisma.workout.upsert({
      where: { id: 'workout-endurance-1' },
      update: {},
      create: {
        id: 'workout-endurance-1',
        title: 'Football Conditioning',
        description: 'Match-day conditioning to build stamina and endurance for 90 minutes of play.',
        categoryId: enduranceCategory.id,
        durationMinutes: 50,
        difficulty: 'Intermediate',
        location: 'Field',
        tags: ['endurance', 'conditioning', 'cardio'],
        isPremium: false,
      },
    }),
    prisma.workout.upsert({
      where: { id: 'workout-beginner-1' },
      update: {},
      create: {
        id: 'workout-beginner-1',
        title: 'Beginner Foundation',
        description: 'Perfect starting point for new athletes. Learn proper form and build base strength.',
        categoryId: strengthCategory.id,
        durationMinutes: 30,
        difficulty: 'Beginner',
        location: 'Home',
        tags: ['beginner', 'foundation', 'basics'],
        isPremium: false,
      },
    }),
  ]);

  console.log(`Created ${workouts.length} workouts`);

  // Add exercises to workouts
  await prisma.workoutExercise.createMany({
    data: [
      // Full Body Strength
      { workoutId: 'workout-strength-1', exerciseId: 'ex-squat', sets: 4, reps: '8-10', restSeconds: 90, sortOrder: 1 },
      { workoutId: 'workout-strength-1', exerciseId: 'ex-bench-press', sets: 4, reps: '8-10', restSeconds: 90, sortOrder: 2 },
      { workoutId: 'workout-strength-1', exerciseId: 'ex-deadlift', sets: 3, reps: '6-8', restSeconds: 120, sortOrder: 3 },
      { workoutId: 'workout-strength-1', exerciseId: 'ex-pull-up', sets: 3, reps: '8-12', restSeconds: 60, sortOrder: 4 },
      { workoutId: 'workout-strength-1', exerciseId: 'ex-plank', sets: 3, reps: '45 seconds', restSeconds: 30, sortOrder: 5 },

      // Lower Body Power
      { workoutId: 'workout-strength-2', exerciseId: 'ex-squat', sets: 5, reps: '5', restSeconds: 120, sortOrder: 1 },
      { workoutId: 'workout-strength-2', exerciseId: 'ex-lunges', sets: 3, reps: '12 each leg', restSeconds: 60, sortOrder: 2 },
      { workoutId: 'workout-strength-2', exerciseId: 'ex-deadlift', sets: 4, reps: '6', restSeconds: 120, sortOrder: 3 },

      // Sprint Training
      { workoutId: 'workout-speed-1', exerciseId: 'ex-sprint', sets: 8, reps: '40 meters', restSeconds: 90, sortOrder: 1 },

      // Explosive Power
      { workoutId: 'workout-power-1', exerciseId: 'ex-box-jump', sets: 4, reps: '8', restSeconds: 60, sortOrder: 1 },
      { workoutId: 'workout-power-1', exerciseId: 'ex-squat', sets: 3, reps: '5 (explosive)', restSeconds: 90, sortOrder: 2 },

      // Beginner Foundation
      { workoutId: 'workout-beginner-1', exerciseId: 'ex-plank', sets: 3, reps: '30 seconds', restSeconds: 30, sortOrder: 1 },
      { workoutId: 'workout-beginner-1', exerciseId: 'ex-lunges', sets: 2, reps: '10 each leg', restSeconds: 45, sortOrder: 2 },
    ],
    skipDuplicates: true,
  });

  console.log('Added exercises to workouts');

  // Create a sample program
  const program = await prisma.program.upsert({
    where: { id: 'program-foundation-1' },
    update: {},
    create: {
      id: 'program-foundation-1',
      title: '8-Week Football Foundation',
      description: 'Complete 8-week program to build strength, speed, and endurance for football. Perfect for pre-season preparation.',
      durationWeeks: 8,
      difficulty: 'Intermediate',
      category: 'Pre-Season',
      isPremium: false,
    },
  });

  console.log('Created program:', program.title);

  // Create program weeks
  for (let week = 1; week <= 4; week++) {
    await prisma.programWeek.upsert({
      where: { id: `program-foundation-1-week-${week}` },
      update: {},
      create: {
        id: `program-foundation-1-week-${week}`,
        programId: program.id,
        weekNumber: week,
        title: `Week ${week}: ${week <= 2 ? 'Foundation' : 'Build'}`,
        description: week <= 2
          ? 'Focus on proper form and building base strength'
          : 'Increase intensity and add power exercises',
      },
    });
  }

  console.log('Created program weeks');

  // Add workouts to program weeks
  await prisma.programWorkout.createMany({
    data: [
      // Week 1
      { id: 'pw-1-1', weekId: 'program-foundation-1-week-1', workoutId: 'workout-strength-1', dayOfWeek: 1, sortOrder: 1 },
      { id: 'pw-1-2', weekId: 'program-foundation-1-week-1', workoutId: 'workout-endurance-1', dayOfWeek: 3, sortOrder: 2 },
      { id: 'pw-1-3', weekId: 'program-foundation-1-week-1', workoutId: 'workout-strength-2', dayOfWeek: 5, sortOrder: 3 },

      // Week 2
      { id: 'pw-2-1', weekId: 'program-foundation-1-week-2', workoutId: 'workout-strength-1', dayOfWeek: 1, sortOrder: 1 },
      { id: 'pw-2-2', weekId: 'program-foundation-1-week-2', workoutId: 'workout-speed-1', dayOfWeek: 3, sortOrder: 2 },
      { id: 'pw-2-3', weekId: 'program-foundation-1-week-2', workoutId: 'workout-strength-2', dayOfWeek: 5, sortOrder: 3 },

      // Week 3
      { id: 'pw-3-1', weekId: 'program-foundation-1-week-3', workoutId: 'workout-power-1', dayOfWeek: 1, sortOrder: 1 },
      { id: 'pw-3-2', weekId: 'program-foundation-1-week-3', workoutId: 'workout-endurance-1', dayOfWeek: 3, sortOrder: 2 },
      { id: 'pw-3-3', weekId: 'program-foundation-1-week-3', workoutId: 'workout-strength-1', dayOfWeek: 5, sortOrder: 3 },

      // Week 4
      { id: 'pw-4-1', weekId: 'program-foundation-1-week-4', workoutId: 'workout-strength-2', dayOfWeek: 1, sortOrder: 1 },
      { id: 'pw-4-2', weekId: 'program-foundation-1-week-4', workoutId: 'workout-speed-1', dayOfWeek: 3, sortOrder: 2 },
      { id: 'pw-4-3', weekId: 'program-foundation-1-week-4', workoutId: 'workout-power-1', dayOfWeek: 5, sortOrder: 3 },
    ],
    skipDuplicates: true,
  });

  console.log('Added workouts to program weeks');

  // Create subscription plans
  await Promise.all([
    prisma.subscriptionPlan.upsert({
      where: { id: 'plan-monthly' },
      update: {},
      create: {
        id: 'plan-monthly',
        name: 'Monthly',
        priceCents: 999,
        currency: 'USD',
        interval: 'month',
        features: ['Unlimited Workouts', 'Personalized Plans', 'Ad-Free'],
      },
    }),
    prisma.subscriptionPlan.upsert({
      where: { id: 'plan-yearly' },
      update: {},
      create: {
        id: 'plan-yearly',
        name: 'Yearly',
        priceCents: 6999,
        currency: 'USD',
        interval: 'year',
        features: ['Save 40%', 'Unlimited Workouts', 'Personalized Plans', 'Ad-Free'],
      },
    }),
  ]);

  console.log('Created subscription plans');

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
