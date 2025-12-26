import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS } from '@/constants/theme';
import { RehabItem } from '@/types/rehab';

interface RehabListItemProps {
  item: RehabItem;
  onPress: () => void;
}

export const RehabListItem: React.FC<RehabListItemProps> = ({ item, onPress }) => {
  const isLocked = item.type === 'locked';
  const isActive = item.type === 'active';
  const isEducation = item.type === 'education';
  const isCompleted = item.type === 'completed';

  const getIconColor = () => {
    if (isActive) return COLORS.primary;
    if (isEducation || isCompleted) return COLORS.gold;
    return COLORS.textSecondary;
  };
  const getIconBackground = () => {
    if (isActive) return COLORS.primaryLowOpacity;
    if (isEducation || isCompleted) return COLORS.goldLowOpacity;
    return COLORS.whiteLowOpacity;
  };
  const renderIcon = () => {
    let iconName: keyof typeof Ionicons.glyphMap = 'help-circle';
    if (item.iconName === 'run') iconName = 'walk'; 
    else if (item.iconName === 'lightbulb') iconName = 'bulb-outline';
    else if (item.iconName === 'lock') iconName = 'lock-closed';
    else if (item.iconName === 'school') iconName = 'school-outline';
    else if (item.iconName === 'check') iconName = 'checkmark-circle-outline';
    return (
      <View style={[styles.iconContainer, { backgroundColor: getIconBackground() }]}> 
        <Ionicons name={iconName} size={24} color={getIconColor()} />
      </View>
    );
  };
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        isActive && styles.activeBorder,
        isCompleted && styles.completedBorder,
        isLocked && styles.lockedOpacity
      ]}
      onPress={onPress}
      disabled={isLocked}
      activeOpacity={0.7}
    >
      <View style={styles.contentRow}>
        {renderIcon()}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
          {isLocked && item.metadata && (
            <Text style={styles.metadataGold}>{item.metadata}</Text>
          )}
          {isCompleted && item.metadata && (
            <Text style={styles.metadataDim}>{item.metadata}</Text>
          )}
        </View>
        {(isEducation || isCompleted) && (
          <Ionicons 
            name={isCompleted ? "time-outline" : "chevron-forward"} 
            size={20} 
            color={COLORS.textSecondary}
          />
        )}
      </View>
      {isActive && item.progress && (
        <View style={styles.progressWrapper}>
          <View style={styles.progressBarBg}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${(item.progress.current / item.progress.total) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {item.progress.current}/{item.progress.total} workouts
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  activeBorder: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  completedBorder: {
    borderWidth: 1,
    borderColor: COLORS.goldLowOpacity,
  },
  lockedOpacity: {
    opacity: 0.5,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
  },
  textContainer: {
    flex: 1,
    marginRight: SPACING.s,
  },
  title: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.bold,
    marginBottom: 4,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: FONTS.regular,
    lineHeight: 20,
  },
  metadataGold: {
    color: COLORS.gold,
    fontSize: 13,
    fontFamily: FONTS.medium,
    marginTop: 4,
  },
  metadataDim: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontFamily: FONTS.regular,
    marginTop: 4,
  },
  progressWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.m,
    gap: SPACING.s,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.whiteLowOpacity,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    color: COLORS.text,
    fontSize: 14,
    fontFamily: FONTS.medium,
  },
});
