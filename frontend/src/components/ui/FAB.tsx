import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

interface FABProps {
  onPress: () => void;
}

const FAB: React.FC<FABProps> = ({ onPress }) => {
  return (
    <View style={styles.fabContainer}>
      <TouchableOpacity
        style={styles.fab}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={36} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    zIndex: 20,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    shadowOpacity: 0.25,
    elevation: 8,
  },
});

export default FAB;
