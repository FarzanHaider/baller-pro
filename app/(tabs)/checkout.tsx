import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, SIZES } from '@/constants/theme';
import PaymentInfoRow from '@/components/ui/PaymentInfoRow';
import PriceBreakdownRow from '@/components/ui/PriceBreakdownRow';
import PayButton from '@/components/ui/PayButton';

export default function CheckoutScreen() {
  const handleClose = () => {
    // Navigation go back logic
    console.log("Close sheet");
  };
  const handleChange = () => {
    console.log("Change selection");
  };
  const handlePay = () => {
    console.log("Processing Payment...");
  };
  return (
    <SafeAreaView style={styles.overlay}>
      {/* Mimicking a Bottom Sheet Interface */}
      <View style={styles.sheetContainer}>
        {/* Handle Bar */}
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.placeholder} />
          <Text style={styles.headerTitle}>Payment Summary</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          {/* Shipping Info */}
          <PaymentInfoRow 
            icon="local-shipping"
            title="Ship To"
            subtitle="Jane Doe, 123 Fitness Ave, 90210"
            onChange={handleChange}
          />
          {/* Payment Method */}
          <PaymentInfoRow 
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuAIHtrMdkT18qcpcF99qCpzMMRpCKbmDVYx9Bf0q9BR4QqOm3ZvjfVViFK1Bjmze0zzQPdqaINt_cVVbqM5O_LuedMaDuIIhBb71l96Ov_-GshPEIoK2dn6FNjkvQXDfzZoevcvT06mQmo_NlZ-AqxtG8pyThU1uKe0XKvepHYmO8Vkv6Irj8cXMvYlWnIP_xghOwHIkKkEtwKcmCD0unhmL5YjRSElqQ0CL_zT1Km3h4pIYong0ra54kU0f3KIdR3K6sYNJhU9sUQ" // Visa Logo
            title="Method"
            subtitle="Visa .... 1234"
            onChange={handleChange}
          />
          {/* Divider */}
          <View style={styles.divider} />
          {/* Breakdown */}
          <View style={styles.breakdownContainer}>
            <PriceBreakdownRow label="Subtotal" value="$119.98" />
            <PriceBreakdownRow label="Shipping & Handling" value="$5.00" />
            <PriceBreakdownRow label="Estimated Tax" value="$9.60" />
          </View>
          {/* Divider */}
          <View style={styles.divider} />
          {/* Total */}
          <View style={styles.totalContainer}>
            <PriceBreakdownRow label="Total (USD)" value="$134.58" isTotal />
          </View>
          {/* Pay Button */}
          <View style={styles.footer}>
            <PayButton onPress={handlePay} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: SIZES.radiusXl,
    borderTopRightRadius: SIZES.radiusXl,
    maxHeight: '90%',
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: SPACING.m,
    paddingBottom: SPACING.s,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.l,
    paddingBottom: SPACING.m,
  },
  placeholder: {
    width: 40,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  content: {
    paddingHorizontal: SPACING.l,
    paddingBottom: SPACING.xl,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.m,
  },
  breakdownContainer: {
    paddingVertical: SPACING.xs,
  },
  totalContainer: {
    marginBottom: SPACING.l,
  },
  footer: {
    marginTop: SPACING.s,
    marginBottom: SPACING.l,
  },
});
