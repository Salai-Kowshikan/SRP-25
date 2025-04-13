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

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            productId={item.id}
            productName={item.name}
            sellingPrice={item.price.toString()}
            description={item.description}
            on_sale={item.on_sale}
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