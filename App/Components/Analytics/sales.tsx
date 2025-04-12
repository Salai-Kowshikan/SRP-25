import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useTheme } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";

interface Product {
  id: string;
  name: string;
}

const Sales = () => {
  const theme = useTheme();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://192.168.1.4:5000/products");
        setProducts(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={[styles.message, { color: theme.colors.primary }]}>Loading...</Text>
      ) : error ? (
        <Text style={[styles.message, { color: theme.colors.error }]}>{error}</Text>
      ) : (
        <>
         
          <View style={[styles.pickerWrapper, {
            backgroundColor: theme.colors.secondaryContainer,
            borderRadius: 12,
          }]}>
            <Picker
              selectedValue={selectedProduct}
              onValueChange={(value) => setSelectedProduct(value)}
              style={[styles.picker, { color: theme.colors.onSecondaryContainer }]}
              dropdownIconColor={theme.colors.onSecondaryContainer}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Select a product" value={null} enabled={false} />
              {products.map((product) => (
                <Picker.Item key={product.id} label={product.name} value={product.name} />
              ))}
            </Picker>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
  },
  pickerWrapper: {
    width: "90%",
    marginTop: 8,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    height: 48,
    paddingHorizontal: 12,
  },
  pickerItem: {
    fontSize: 16,
  },
});

export default Sales;
