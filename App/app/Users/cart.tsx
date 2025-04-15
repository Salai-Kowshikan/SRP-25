import { View, FlatList, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Text, Card, Button, IconButton } from 'react-native-paper';
import useCartStore from '@/stores/cartStore';
import api from '@/api/api';

type Product = {
  id: string;
  name: string;
  description: string;
};

type OrderItem = {
  id: string;
  price: number;
  quantity: number;
  total: number;
  shg_id: string;
};

const Cart = () => {
  const { cart, clearCart } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [order, setOrder] = useState<Record<string, OrderItem>>({});

  useEffect(() => {
    const fetchProducts = async () => {
      if (cart.length > 0) {
        try {
          const response = await api.post('/api/products/fetch-by-ids', { product_ids: cart });
          setProducts(response.data.products);

          const initialOrder = response.data.products.reduce((acc: Record<string, OrderItem>, product: any) => {
            acc[product.id] = {
              id: product.id,
              price: product.price,
              quantity: 1,
              total: product.price,
              shg_id: product.shg_id,
            };
            return acc;
          }, {});
          setOrder(initialOrder);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      } else {
        setProducts([]);
        setOrder({});
      }
    };

    fetchProducts();
  }, [cart]);

  const updateQuantity = (productId: string, increment: boolean) => {
    setOrder((prevOrder) => {
      const currentItem = prevOrder[productId];
      const newQuantity = increment ? currentItem.quantity + 1 : Math.max(currentItem.quantity - 1, 1);
      return {
        ...prevOrder,
        [productId]: {
          ...currentItem,
          quantity: newQuantity,
          total: newQuantity * currentItem.price,
        },
      };
    });
  };

  const placeOrder = async () => {
    try {
      const userId = '2bd38c45-e460-4a73-bed7-0967290b6a6b';
      const orders = Object.values(order);

      const otherAccount = {
        account_name: 'Marketplace Account',
        account_number: '1234567890',
        bank_name: 'Sample Bank',
        ifsc_code: 'SBIN0001234',
      };

      const response = await api.post('/api/marketplace/place-order', {
        user_id: userId,
        orders,
        other_account: otherAccount,
      });

      console.log('Order placed successfully:', response.data);
      clearCart(); 
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Cart
      </Text>
      {products.length > 0 ? (
        <>
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card style={styles.card}>
                <Card.Title title={item.name} />
                <Card.Content>
                  <Text>{item.description}</Text>
                  <Text>Price: ${order[item.id]?.price}</Text>
                  <Text>Quantity: {order[item.id]?.quantity}</Text>
                  <Text>Total: ${order[item.id]?.total}</Text>
                  <View style={styles.quantityControls}>
                    <IconButton
                      icon="minus"
                      onPress={() => updateQuantity(item.id, false)}
                    />
                    <IconButton
                      icon="plus"
                      onPress={() => updateQuantity(item.id, true)}
                    />
                  </View>
                </Card.Content>
              </Card>
            )}
          />
          <Button
            mode="contained"
            onPress={clearCart}
            style={styles.clearButton}
          >
            Clear Cart
          </Button>
          <Button
            mode="contained"
            onPress={placeOrder}
            style={styles.placeOrderButton}
          >
            Place Order
          </Button>
        </>
      ) : (
        <Text variant="bodyLarge" style={styles.empty}>
          Your cart is empty.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    marginBottom: 8,
  },
  clearButton: {
    marginTop: 16,
  },
  empty: {
    textAlign: 'center',
    color: 'gray',
  },
  quantityControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  placeOrderButton: {
    marginTop: 16,
    backgroundColor: 'green',
  },
});

export default Cart;