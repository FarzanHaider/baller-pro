import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  FlatList, 
  TouchableOpacity, 
  StatusBar 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import CartItemRow from '@/components/ui/CartItemRow';
import CartSummary from '@/components/ui/CartSummary';
import { CartItem } from '@/types/cart';

// Mock Data
const INITIAL_CART: CartItem[] = [
  {
    id: '1',
    title: 'Performance Tee',
    price: 45.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCs3Xv0cbjggZGW5lr2xm_AGnH0zw1S3yHipS-atkB7Hp_69WB7B_dUmu5RlCJTB8Uh0uDws3lur9AvO7zmV6QZsxEEyUBsnlxbLVAI6_8mjBEkikJX9qNWccde4Fe5MmNdFokWG6Ar1u6PNAgsAcxi2vFduByP0damhNzk01ex5InGjitgT2TBzEQZYKmctI2EGQFDjNIvP5aZJWdXbDsrPpIV9TlrK8iQ-Pb2kjSeboTrxKsS9Wx3dSrz1grGw5ikkPzP0YNZLPI',
    size: 'L',
    color: 'Black',
    quantity: 1,
  },
  {
    id: '2',
    title: 'Pro Training Shorts',
    price: 29.99,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY6aoUKUHcnl_ZLXSG5hoVN30u4KIdkag69xizt1ItRzHFxGG1_-V5r_auEKEUBp3eB1yLbw9Tr--dhdOYraigYXBrmZMY8O0rBbLBB8DuHcH185-JdsRD2LpQw5Xn1JZSr8mci2VeIN4CZT4xZ2g2yyFlVEaCT5PLAdo704sCreodHWSMXxnE_ph4eaKYRlhb_3IiN8zvSKeieLRZEA9S8a9UkppxR6ddGcxP5x4z-whe_EoZ3GD4fsMLLf9liTvtKqsACiCFGgc',
    size: 'M',
    color: 'Red',
    quantity: 1,
  },
];

export default function CartScreen() {
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART);

  const handleIncrease = (id: string) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const handleDecrease = (id: string) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
    ));
  };

  const handleRemove = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    console.log('Proceeding to checkout...');
  };

  // Calculate Subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart</Text>
        <TouchableOpacity style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>
      {/* Cart List */}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CartItemRow 
            item={item}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            onRemove={handleRemove}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <MaterialIcons name="shopping-cart" size={48} color={COLORS.surfaceHighlight} />
                <Text style={styles.emptyText}>Your cart is empty</Text>
            </View>
        }
      />
      {/* Footer Summary */}
      {cartItems.length > 0 && (
        <CartSummary 
          subtotal={subtotal} 
          onCheckout={handleCheckout} 
        />
      )}
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
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceHighlight,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontFamily: FONTS.bold,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  listContent: {
    paddingHorizontal: SPACING.l,
    paddingBottom: SPACING.l,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    gap: SPACING.m,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
    fontSize: 16,
  },
});
