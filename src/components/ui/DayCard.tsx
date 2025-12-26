import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';
import { PlanDay } from '@/types/plan';

interface DayCardProps {
  item: PlanDay;
  onPress: () => void;
}

export default function DayCard({ item, onPress }: DayCardProps) {
  const isActive = item.status === 'active';
  const isRest = item.status === 'rest';
  const isCompleted = item.status === 'completed';

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.container,
        isActive && styles.activeContainer,
        isRest && styles.restContainer
      ]}
    >
      {/* Active Indicator Line */}
      {isActive && <View style={styles.activeStrip} />}

      {/* Date Column */}
      <View style={[styles.dateCol, isActive && styles.activeDateCol]}>
        <Text style={[styles.dayName, isActive && { color: COLORS.primary }]}>
          {item.dayName}
        </Text>
        <Text style={[styles.dayNum, isActive && { color: COLORS.white }]}>
          {item.dayNumber}
        </Text>
        
        {isCompleted && (
          <View style={styles.checkBadge}>
            <MaterialIcons name="check" size={14} color={COLORS.success} />
          </View>
        )}
        
        {isActive && (
          <View style={styles.todayBadge}>
            <Text style={styles.todayText}>TODAY</Text>
          </View>
        )}
      </View>

      {/* Content Column */}
      <View style={styles.contentCol}>
        <View style={styles.headerRow}>
          <View>
            {item.meta && (
              <Text style={styles.metaLabel}>{item.meta.label}</Text>
            )}
            <Text 
              style={[
                styles.title, 
                isActive && styles.activeTitle,
                isCompleted && styles.completedTitle
              ]}
            >
              {item.title}
            </Text>
            {item.subtitle && (
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            )}
          </View>
          
          {item.duration && (
            <View style={styles.durationBadge}>
              <MaterialIcons name="timer" size={12} color={COLORS.textSecondaryZinc} />
              <Text style={styles.durationText}>{item.duration}</Text>
            </View>
          )}

          {isRest && (
            <View style={styles.restIcon}>
              <MaterialIcons name="spa" size={20} color={COLORS.textSecondaryZinc} />
            </View>
          )}
        </View>

        {isActive && <View style={styles.divider} />}

        {/* Tags / Details */}
        <View style={styles.detailsRow}>
          {item.tags?.map((tag, idx) => (
            <View key={idx} style={styles.tag}>
              {isActive ? (
                // Mock icons for active state detail
                <MaterialIcons name="restaurant" size={12} color={COLORS.blue} />
              ) : (
                <MaterialIcons name="restaurant" size={12} color={COLORS.textSecondaryZinc} />
              )}
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          
          {/* Mock Habit Check for Active State */}
          {isActive && (
             <View style={styles.tag}>
               <MaterialIcons name="checklist" size={12} color={COLORS.purple} />
               <Text style={styles.tagText}>Creatine, Sleep 8h</Text>
             </View>
          )}
        </View>

        {isActive && (
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startText}>Start Workout</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardDefault,
    borderRadius: SIZES.radiusPlan,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: SPACING.m,
  },
  activeContainer: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.cardDark,
    // Add shadow/elevation if desired
  },
  restContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  activeStrip: {
    width: 4,
    backgroundColor: COLORS.primary,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
  },
  dateCol: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    paddingVertical: SPACING.l,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  activeDateCol: {
    borderRightColor: 'rgba(255,255,255,0.05)',
    backgroundColor: 'transparent',
  },
  dayName: {
    color: COLORS.textSecondaryZinc,
    fontSize: 10,
    fontFamily: FONTS.bold,
    marginBottom: 2,
  },
  dayNum: {
    color: COLORS.textSecondaryZinc,
    fontSize: 20,
    fontFamily: FONTS.bold,
  },
  checkBadge: {
    marginTop: SPACING.s,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    padding: 2,
    borderRadius: SIZES.radiusFull,
  },
  todayBadge: {
    marginTop: SPACING.s,
    backgroundColor: 'rgba(239, 67, 67, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  todayText: {
    color: COLORS.primary,
    fontSize: 10,
    fontFamily: FONTS.bold,
  },
  contentCol: {
    flex: 1,
    padding: SPACING.l,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  metaLabel: {
    color: COLORS.primary,
    fontSize: 10,
    fontFamily: FONTS.bold,
    letterSpacing: 1,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  title: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.bold,
    marginBottom: 2,
  },
  activeTitle: {
    fontSize: 18, // Slightly larger for active
  },
  completedTitle: {
    color: COLORS.textSecondaryZinc,
    textDecorationLine: 'line-through',
  },
  subtitle: {
    color: COLORS.textSecondaryZinc,
    fontSize: 12,
    fontFamily: FONTS.regular,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: SPACING.s,
  },
  durationText: {
    color: COLORS.textSecondaryZinc,
    fontSize: 12,
    fontFamily: FONTS.bold,
    marginLeft: 4,
  },
  restIcon: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: SPACING.m,
  },
  detailsRow: {
    flexDirection: 'column',
    marginTop: SPACING.s,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  tagText: {
    color: COLORS.textSecondaryZinc,
    fontSize: 12,
    fontFamily: FONTS.medium,
    marginLeft: 6,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    marginTop: SPACING.m,
    paddingVertical: SPACING.m,
    borderRadius: 6,
    alignItems: 'center',
  },
  startText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 14,
  },
});

