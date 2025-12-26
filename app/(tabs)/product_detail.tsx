import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, SIZES } from '@/constants/theme';
import ProductCarousel from '@/components/ui/ProductCarousel';
import OptionSelector from '@/components/ui/OptionSelector';
import QuantityCounter from '@/components/ui/QuantityCounter';

export default function ProductDetailScreen() {
  const [selectedColor, setSelectedColor] = useState('red');
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock Data
  const images = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD5XBv8drUfsm2jbcDF5p205v22NJHpx06MykNgEjOCVXMC_zAqspDiIHRT7HAilGZ421M9uQ7G99JoJwdoDGy3vvj0p3nzECc5WhpVrLYysB8ugTNEkyXRyWVFkwS6MJ-eFaasuHOcXX48UAsI2GW50980u0Nlqa775LazB5RaIFaBgjA0fJ_lgA3KP6WYpb_85K17UUxhHBxGWt-7xM7T4Q4Q-VD-EPznkJm_yfYbn9YELkLTHS04YzQfkcAd-b9arbwJHYO9BW8',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBDOULm2ITbp1vQEtTbJ2G3EedwJ0fiKubLyhcRAbLpL1PneqQW6C6nANSEwHOOacj4sSR2E5rA1CNRAwYoOBlI1nsLFaxWA6g2Xh1FlUEXaF2T6pTFvw3Hd5qQ5NtteXTxlexBWNUs9bUnAAOOYMBNFU70bjpAtB8_x-7m7xtahi82imHgQWVrQTiMrxfQJG7V0HclU3Vl_GlMGM8a9WyQq3F9UdFhhhZeNpB5uKUnI0RF0WgnQZPp7GS4PbVbbcJmrZjFN4xjZPo',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBuvHXgRvAAJjE7vKkyxFCFrrZE2DOqK-6F9BrCWeKffc5vcd9UXLgWH088_oXpVi24k753_3cPMikKWUeCPNSqPaaC7GJtIfeG5Cvnza32Qyx8MEDBoWehZDnslRj8fZz_yN5O6KoeQHmiRoqdfA_Hx1G2PnCCgZDr4e45qDprHCUAuerI2CW8wiGBtOd4C6um7u84TQnUxCBWnm6tFFA-BLlS0QscJZGFV3fmK1I9qg1niHw2-978vddR9YswImcWKywtk2NDFas',
  ];

  const colors = [
    { id: 'red', color: COLORS.primary },
    { id: 'white', color: COLORS.white },
    { id: 'black', color: COLORS.black },
    { id: 'blue', color: COLORS.blue },
  ];

  const sizes = [
    { id: 'XS', label: 'XS', disabled: true },
    { id: 'S', label: 'S' },
    { id: 'M', label: 'M' },
    { id: 'L', label: 'L' },
    { id: 'XL', label: 'XL' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Bar */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton}>
             {/* Simulating the "handle" visual from the screenshot top */}
            <View style={styles.dragHandle} />
          </TouchableOpacity>
        </View>
        {/* Image Carousel */}
        <ProductCarousel images={images} />
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.productTitle}>Performance Tech Tee</Text>
          <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
            <MaterialIcons 
              name={isFavorite ? "favorite" : "favorite-border"} 
              size={28} 
              color={isFavorite ? COLORS.primary : COLORS.textSecondary} 
            />
          </TouchableOpacity>
        </View>
        {/* Price */}
        <Text style={styles.price}>$39.99</Text>
        {/* Options */}
        <OptionSelector 
          title="Color"
          type="color"
          options={colors}
          selectedId={selectedColor}
          onSelect={setSelectedColor}
        />
        <OptionSelector 
          title="Size"
          type="size"
          options={sizes}
          selectedId={selectedSize}
          onSelect={setSelectedSize}
        />
        {/* Quantity */}
        <QuantityCounter 
          value={quantity} 
          onIncrease={() => setQuantity(q => q + 1)}
          onDecrease={() => setQuantity(q => Math.max(1, q - 1))}
        />
        {/* Description */}
        <View style={styles.descriptionContainer}>
            <View style={styles.descriptionHeader}>
                <Text style={styles.descriptionTitle}>Description</Text>
                <MaterialIcons name="keyboard-arrow-up" size={24} color={COLORS.textSecondary} />
            </View>
            <Text style={styles.descriptionText}>
                Engineered for peak performance, this tech tee is made from a lightweight, moisture-wicking fabric that keeps you cool and dry. The athletic fit allows for a full range of motion.
            </Text>
        </View>
      </ScrollView>
      {/* Sticky Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.addToCartButton} activeOpacity={0.8}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 100, // Space for bottom bar
  },
  header: {
    alignItems: 'center',
    paddingTop: SPACING.m,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.surfaceHighlight,
  },
  closeButton: {
    padding: SPACING.s,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.l,
    marginTop: SPACING.s,
  },
  productTitle: {
    flex: 1,
    color: COLORS.text,
    fontSize: 24,
    fontFamily: FONTS.bold,
    marginRight: SPACING.m,
  },
  price: {
    color: COLORS.text,
    fontSize: 32,
    fontFamily: FONTS.bold,
    paddingHorizontal: SPACING.l,
    marginTop: SPACING.s,
    marginBottom: SPACING.xl,
  },
  descriptionContainer: {
    paddingHorizontal: SPACING.l,
    marginBottom: SPACING.xl,
  },
  descriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  descriptionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  descriptionText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: FONTS.regular,
    lineHeight: 22,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    padding: SPACING.l,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  addToCartButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
});
