import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, SIZES } from '@/constants/theme';
import CategoryFilter from '@/components/ui/CategoryFilter';
import ProductCard from '@/components/ui/ProductCard';
import { Product, Category } from '@/types/merch';

// Mock Data
const CATEGORIES: Category[] = [
  { id: '1', label: 'Apparel' },
  { id: '2', label: 'Accessories' },
  { id: '3', label: 'Equipment' },
];

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Performance Tee',
    price: 29.99,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNamsXeco7q3KirPMTBx5HxVWEcHWJXZg3O8KYCopVGq66z1SoKfMAwHyNgpyERKDVf02C9xh65lZdHogwfkGlT2LHwoyMVYzLH8XrSZNEE4mUW37kBeeBzgRbA0DlpCVnF_AR_LD_qfiE9dSb02C8jqjCMGk7_3lew004sgZSJM2ppQJt7BIjKZl3rbMqwfBLCkBzPmCDLUZls9qIU4EA2FCwLoNVjCtADavc2AGCVZ-F9Gzw7QJ7oLsI3iE7JduSXQPMQDABUnA',
  },
  {
    id: '2',
    name: 'Insulated Shaker',
    price: 19.99,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoGf_cp86W26rHMxoz3oKA_YKaiGwDPjrthomUHM7qwKlLGAktZX7brPyNEUvZqXfOgtQ0DY3YShNp4AWe9oOEUKivIusQWbbqN-KwgNx2sjKhGwNEU38NueKHMiEAnMZ47J47pPGOdXzjey_SQlrrTLaWlMiUOyynj5GrUCa1ZTaTG26YwGi54yJxKR6H3JKkzwnjfWFMMkyDUmLJI133eK6WL71h5z5LoLr48_Z_M2ZOIUiRJRKojan_-2pGy4N0fEfQ_fPZ-vs',
  },
  {
    id: '3',
    name: 'Resistance Band Set',
    price: 24.99,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgT50QwDodRezBzOialmXhO-Ib076qfKFh_G12aPYWpYWjGIiZlfSTqDh00Hzen4xoId7PWd9AwGECz-k_m1VKjGO59Ud_-QtH3mcMBiCFWtM6i0Xl2ia8c9ixn8jAY0u_16vXeXH8yzAhCWgG2UAmKxO8wZb0NvtZmw3vTtVol3DySG1OfHbbDkOLqsXagAbuxuxzZK7kklPuiUy7UL6GzW5EBVUIT2BVbHbN7UVGjiVag0ZGX3X9NU0ek40BNOVaasGT8wm05fU',
    isAccent: true,
  },
  {
    id: '4',
    name: 'Pro-Grip Gloves',
    price: 22.50,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjk0RYmZkoyHDSt6-KzTg71TNO4YQyPorB-sTRsicwkv1HiMCbAt1vhtyO-dus3rDFFpZPv2DmfH1mNKOoBZpyZ4J8qPqONFA6E1YOFrhJvXbFDYyOiB-YPuncaZ_9b9GGN2QEKKaLB29XpmJcuPtrdaidVgf_Kfk2Ke3_homd3Mz1Er3lO3-fND6T_-S8sbN9a-4-D-MbY7JqM34KyFTFUhjICFC0LsfZJolvA3R13oQGCf6cQ_tfvHvOnOohtjoe1y36xVytwoo',
  },
  {
    id: '5',
    name: 'Aero-Lite Hoodie',
    price: 45.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtOutp7PEyPgA0nLyPPaVKYLo_g5kmmj2e7XEktrmFTCU0r58bIpeI-qxZknkcCudrwjDORV7TxLjqViUUJabq9dlMZpRCO6U3ypLIVRl-Fw7dzvitSxYp5wuXQFdTMwvvdORToZSTrd7tA2Dga-1NeMYeKWuTiCv_MGxeZVV63w3EgseqmWzVro5Xyy-cOh1x11UsiXVly-OXf7L0KWhsLxwUy5oHeRwPNWPd4oatt5X572Y6oVk4mh4tG0qAFsyKXl3S_6eInmc',
  },
  {
    id: '6',
    name: 'Hydro-Flow Bottle',
    price: 18.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4wbBTAQZ4TtK0t_HtHBvr7uuapr0OqmCnaUUSehmLlueqrHiDI2ptRkSF_ZiAOTW3L98_MQ3zgxw2NRx8i0nVsYPHTl8ES1YVY4WZOvyMgf9QDQ1e6ZURAYbUYDRWF1hdbEHRNVlxvoSjsRhXYLnauPgXIfav4RNwYMCQns9QdsyFjjXVKK_p-gAYRvs672L7xf6ZjDUX4a0SPmS6NwVD-g7gee3auq4LZdeQT99Go1QT9ArW-USSiO0JjyooFujFW_B50wIrUiQ',
  },
  {
    id: '7',
    name: 'Velocity Trainers',
    price: 89.99,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-5tQcUFr8Y0z7fERJdBIXKUyyDcqyiUpaUTOSexFkSRv7fube9vXjVBu9bQyLHe4HcRW7uFURWHZvUyLTtiWz2_xzd9rn4fde3siVyXbcv31rrtDciriw7SkCQPoAa0C7oantdfxlRvZ1Cpf31VesuBCxOcCeHAiq_MlTyjYqwiJfgyel90P3JZanDT8gWkPVPBsTB7wsVuJ1x76tG7HvKz42zXWngly-8y1hxd_g6OQoXlHTBg8-mx0zcThkl1B5NGG3IcBzWEg',
  },
  {
    id: '8',
    name: 'Flex Cap',
    price: 24.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARQzGW74cCygTaSe79wWKc72WD_EZPg-ibmBeIf4djLITQyqDWmdkmZaSifWGfT1TrA4_QshGKtIbFycZ1FZOyhOCI5g_7jkLMicuyuu7EA04i-pJ_zQ-KILsXfBrgteboS-2v-EgOPdHuNjieEVnThF9fg3nvz66kFnHR5vMDoWjks_WPRcq3bp-9A3gMjAfvF4JUyLqymqk5Er3X7LTL6SelT-6MjkrfdoPn_OPuyInIN6zopwk28EeL54KrPyHAO2Kmh2JwNL0',
  },
];

export default function ShopScreen() {
  const [selectedCategory, setSelectedCategory] = useState('1');
  const cartCount = 2;
  const { width } = useWindowDimensions();
  const isTablet = width > 768;
  const contentWidth = isTablet ? SIZES.containerMaxWidth : '100%';
  const insets = useSafeAreaInsets();

  const handleProductPress = (item: Product) => {
    console.log('Product pressed:', item.name);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {/* Header */}
      <View style={[styles.header, { paddingTop: SPACING.s + insets.top }]}>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Merch Shop</Text>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="shopping-bag" size={24} color={COLORS.text} />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      {/* Filter Bar */}
      <View style={styles.filterContainer}>
        <CategoryFilter 
          categories={CATEGORIES}
          selectedId={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </View>
      {/* Product Grid */}
      <FlatList
        data={PRODUCTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard item={item} onPress={handleProductPress} />
        )}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={[
          styles.listContent,
          { width: contentWidth, alignSelf: 'center' },
        ]}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.l,
    paddingBottom: SPACING.s,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontFamily: FONTS.bold,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.primary,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontFamily: FONTS.bold,
  },
  filterContainer: {
    marginBottom: SPACING.s,
  },
  listContent: {
    paddingHorizontal: SPACING.l,
    paddingBottom: SPACING.xl,
    paddingTop: SPACING.s,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: SPACING.s,
  },
});
