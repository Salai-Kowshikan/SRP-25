import { View, StyleSheet, FlatList, ScrollView } from "react-native";
import { Searchbar, Button, Card, Text, FAB } from "react-native-paper";
import { useState } from "react";
import api from "@/api/api";
import useCartStore from "@/stores/cartStore";
import { useRouter } from "expo-router";

type Product = {
  id: string;
  name: string;
  description: string;
};

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const { cart, addToCart, removeFromCart } = useCartStore();
  const router = useRouter();

  const handleSearch = async () => {
    try {
      if (searchQuery.trim()) {
        const response = await api.get(`/api/marketplace/search?query=${searchQuery}`);
        setProducts(response.data.products);
        console.log("Search results:", response.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleCartToggle = (productId: string) => {
    if (cart.includes(productId)) {
      console.log(`Removing product ${productId} from cart`);
      removeFromCart(productId);
    } else {
      console.log(`Adding product ${productId} to cart`);
      addToCart(productId);
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <Card style={styles.card}>
      <Card.Title title={item.name} />
      <Card.Content>
        <Text>{item.description}</Text>
      </Card.Content>
      <Card.Actions>
        <Button
          mode="contained"
          onPress={() => handleCartToggle(item.id)}
        >
          {cart.includes(item.id) ? "Remove from Cart" : "Add to Cart"}
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        <Button mode="contained" onPress={handleSearch} style={styles.searchButton}>
          Search
        </Button>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          contentContainerStyle={styles.list}
        />
        <FAB
          style={styles.fab}
          icon={"cart"}
          label="View Cart"
          onPress={() => router.push("/Users/cart")}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 80,
  },
  searchbar: {
    marginBottom: 16,
  },
  searchButton: {
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
});

export default Marketplace;
