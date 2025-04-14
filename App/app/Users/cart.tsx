import { View, FlatList, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Text, Card, Button } from 'react-native-paper';
import useCartStore from '@/stores/cartStore';
import api from '@/api/api';

type Product = {
  id: string;
  name: string;
  description: string;
};

const Cart = () => {
  const { cart, clearCart } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (cart.length > 0) {
        try {
          const response = await api.post('/api/products/fetch-by-ids', { product_ids: cart });
          setProducts(response.data.products);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      } else {
        setProducts([]);
      }
    };

    fetchProducts();
  }, [cart]);

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
});

export default Cart;