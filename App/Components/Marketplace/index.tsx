import { useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import AddProductFAB from "@/Components/Marketplace/AddProductFAB";
import ProductCard from "@/Components/Marketplace/ProductCard";
import { useProductStore } from "@/stores/productStore";

const MarketPlace = () => {
  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleModifyProduct = (id: string, updatedProduct: { productName: string; sellingPrice: string; description: string }) => {
    console.log(`Modify product with ID: ${id}`, updatedProduct);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            productName={item.name}
            sellingPrice={item.price.toString()}
            description={item.description}
            onModify={(updatedProduct) => handleModifyProduct(item.id, updatedProduct)}
            onViewSales={() => console.log(`View Sales for ${item.name}`)}
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
  list: {
    paddingBottom: 80,
  },
});

export default MarketPlace;