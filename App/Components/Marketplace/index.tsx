import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import AddProductFAB from "@/Components/Marketplace/AddProductFAB";
import ProductCard from "@/Components/Marketplace/ProductCard";
import Orders from "@/Components/Marketplace/Orders";
import { useProductStore } from "@/stores/productStore";

const MarketPlace = () => {
  const { products, fetchProducts } = useProductStore();
  const [activeTab, setActiveTab] = useState("products");

  useEffect(() => {
    if (activeTab === "products") {
      fetchProducts();
    }
  }, [activeTab]);

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={activeTab}
        onValueChange={setActiveTab}
        buttons={[
          { value: "products", label: "Product Listing" },
          { value: "orders", label: "Orders" },
        ]}
        style={styles.segmentedButtons}
      />
      {activeTab === "products" ? (
        <View style={styles.tabContent}>
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
      ) : (
        <Orders />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  segmentedButtons: {
    marginBottom: 10,
  },
  tabContent: {
    flex: 1,
  },
  list: {
    paddingBottom: 80,
  },
});

export default MarketPlace;