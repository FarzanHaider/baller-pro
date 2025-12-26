import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const Header: React.FC = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Habit Tracker</Text>
      <TouchableOpacity style={styles.iconBtn}>
        <Ionicons name="calendar-outline" size={32} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderBottomColor: colors.surfaceLight,
    borderBottomWidth: 1,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
  },
  iconBtn: {
    height: 48,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },
});

export default Header;
