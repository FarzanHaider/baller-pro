import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '@/constants/theme';

interface PayButtonProps {
  onPress: () => void;
}

export default function PayButton({ onPress }: PayButtonProps) {
  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.content}>
        <FontAwesome5 name="apple" size={24} color={COLORS.white} />
        <Text style={styles.text}>Pay</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.black,
    height: 56,
    borderRadius: SIZES.radiusFull,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },
});
