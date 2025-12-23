import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, SPACING, SIZES, FONTS } from '@/constants/theme';
import { Button } from '../Button';
import { Workout } from '../../constants/workouts';

interface WorkoutCardProps {
  workout: Workout;
  onStart?: () => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onStart }) => {
  return (
    <View style={styles.card}>
      {/* Image Placeholder */}
      <View style={styles.imageContainer}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>Workout</Text>
        </View>
        {workout.tags && workout.tags.length > 0 && (
          <View style={styles.tagContainer}>
            {workout.tags.map((tag, index) => (
              <View
                key={index}
                style={[
                  styles.tag,
                  tag === 'NEW' && styles.tagNew,
                  tag === 'POPULAR' && styles.tagPopular,
                ]}
              >
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.trainLabel}>Train</Text>
            <Text style={styles.title}>{workout.title}</Text>
          </View>
          <View style={styles.profileIcon}>
            <Text style={styles.profileIconText}>👤</Text>
          </View>
        </View>

        <Text style={styles.details}>
          {workout.duration} min • {workout.difficulty} • {workout.location}
        </Text>

        <Button
          title="Start Workout"
          onPress={onStart || (() => console.log('Start workout:', workout.id))}
          variant="primary"
          style={styles.startButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    marginBottom: SPACING.l,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    color: COLORS.textSecondary,
    fontSize: 18,
    fontFamily: FONTS.medium,
  },
  tagContainer: {
    position: 'absolute',
    top: SPACING.m,
    right: SPACING.m,
    gap: SPACING.xs,
  },
  tag: {
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs,
    borderRadius: SIZES.radius,
  },
  tagNew: {
    backgroundColor: COLORS.primary,
  },
  tagPopular: {
    backgroundColor: COLORS.gold,
  },
  tagText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: COLORS.black,
  },
  content: {
    padding: SPACING.l,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.s,
  },
  titleContainer: {
    flex: 1,
  },
  trainLabel: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIconText: {
    fontSize: 16,
  },
  details: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: SPACING.m,
  },
  startButton: {
    width: '100%',
    borderRadius: SIZES.radius,
    height: 48,
  },
});
