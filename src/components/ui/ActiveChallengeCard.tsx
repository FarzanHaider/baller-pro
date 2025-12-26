import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';

export default function ActiveChallengeCard() {
  const avatars = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD2rWzvHT4S-qXdkcy178-P_qDzXcbCHIK5gAErH9945LuczCOfZgo6nzQyLlQHOwk6ySR6kkqBbEzj7O_3jV3337eqfkTwNqD_1A7CEj5vPHDbae6cGgsdw7GT4t2KLvpRjeecXcmA90Y-5OWq2Zea0HYIX5jrxtpZ9sLvpbJ_lMRsmw3j9H8KLgcMFkZ7w_DyVnCz43nENLJeH0lk3qnIyLGmRn6i2thj9Tbcj08vAszyKU4MiczfuMBKLNQ-CAqTgtneHOLTESM',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBFfUdRGzAe551AXagfkCESTXnIjBEVvExkPGOjjmnQSkdayAf-oDlj_qYKdES8LpIUinAwd65uhlUVPA-JUpnwRcP-ui-0bIQAXKbioU6B4cODBdTB6l-ZgmUZyApzvD9RLYHsYG0Vp8LFzBewwvns5oz8BM7MIde73UDcRl9NK0VAkhvDXGHfDr_CdH57RPyijnpl73SYljqTMEPc9pj622Zhgw3clzV1I6v1EfnNEgzU1yh1i0MgYCvcgbPhmbvfKs-hiog_NT8',
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Weekly Step Challenge</Text>
          <Text style={styles.subtitle}>3 days remaining</Text>
        </View>
        <View style={styles.avatarGroup}>
          {avatars.map((uri, index) => (
            <Image key={index} source={{ uri }} style={[styles.avatar, { marginLeft: index > 0 ? -10 : 0 }]} />
          ))}
          <View style={[styles.avatarBadge, { marginLeft: -10 }]}>
            <Text style={styles.avatarBadgeText}>+5</Text>
          </View>
        </View>
      </View>

      <View style={styles.progressRow}>
        <Text style={styles.progressValue}>15,240</Text>
        <Text style={styles.progressGoal}>Goal: 25,000</Text>
      </View>

      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: '65%' }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: SPACING.l,
    marginBottom: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.m,
  },
  title: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.bold,
    marginBottom: 4,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: FONTS.regular,
  },
  avatarGroup: {
    flexDirection: 'row',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  avatarBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  avatarBadgeText: {
    color: COLORS.text,
    fontSize: 10,
    fontFamily: FONTS.bold,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.s,
  },
  progressValue: {
    color: COLORS.text,
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  progressGoal: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: FONTS.regular,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: COLORS.progressTrack,
    borderRadius: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
});

