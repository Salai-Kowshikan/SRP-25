import { useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Text } from "react-native-paper";
import AddProductFAB from "@/Components/Marketplace/AddProductFAB";
import ProductCard from "@/Components/Marketplace/ProductCard";

const MarketPlace = () => {
  const [products, setProducts] = useState([
    {
      id: "1",
      productName: "Sample Product 1",
      sellingPrice: "25.99",
      quantity: "10",
      imageUri: "https://placehold.co/400",
    },
    {
      id: "2",
      productName: "Sample Product 2",
      sellingPrice: "15.49",
      quantity: "5",
      imageUri: "https://placehold.co/400",
    },
    {
      id: "3",
      productName: "Sample Product 3",
      sellingPrice: "30.00",
      quantity: "20",
      imageUri: "https://placehold.co/400",
    },
  ]);

  const handleModifyProduct = (id: string, updatedProduct: { productName: string; sellingPrice: string; quantity: string }) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, ...updatedProduct } : product
      )
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            productName={item.productName}
            sellingPrice={item.sellingPrice}
            quantity={item.quantity}
            imageUri={item.imageUri}
            onModify={(updatedProduct) => handleModifyProduct(item.id, updatedProduct)}
            onViewSales={() => console.log(`View Sales for ${item.productName}`)}
          />
        )}
        contentContainerStyle={styles.list}
      />
      <AddProductFAB />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  list: {
    paddingBottom: 80,
  },
});

export default MarketPlace;