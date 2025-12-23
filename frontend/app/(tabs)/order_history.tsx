import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
  StatusBar 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import OrderCard from '@/components/ui/OrderCard';
import { Order } from '@/types/order';

// Mock Data matching the screenshot
const ORDER_HISTORY: Order[] = [
  {
    id: '1',
    orderNumber: 'Order #RN-12345',
    date: 'Oct 26, 2023',
    status: 'Delivered',
    price: 89.99,
  },
  {
    id: '2',
    orderNumber: 'Order #RN-12321',
    date: 'Oct 15, 2023',
    status: 'Shipped',
    price: 45.50,
  },
  {
    id: '3',
    orderNumber: 'Order #RN-12298',
    date: 'Sep 30, 2023',
    status: 'Processing',
    price: 112.00,
  },
  {
    id: '4',
    orderNumber: 'Order #RN-12150',
    date: 'Sep 05, 2023',
    status: 'Delivered',
    price: 24.99,
  },
];

export default function OrderHistoryScreen() {
  const handleOrderPress = (item: Order) => {
    console.log('Order pressed:', item.orderNumber);
    // Navigate to order details (future)
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order History</Text>
        <View style={styles.placeholder} />
      </View>
      {/* Order List */}
      <FlatList
        data={ORDER_HISTORY}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OrderCard item={item} onPress={handleOrderPress} />
        )}
        contentContainerStyle={styles.listContent}
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
    paddingVertical: SPACING.m,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  placeholder: {
    width: 40,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  listContent: {
    padding: SPACING.l,
  },
});
