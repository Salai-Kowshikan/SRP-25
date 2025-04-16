import { View, StyleSheet, FlatList, ScrollView } from "react-native";
import { Searchbar, Button, Card, Text, FAB } from "react-native-paper";
import { useState, useEffect } from "react";
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
  const [isSearchPerformed, setIsSearchPerformed] = useState(false); 
  const { cart, addToCart, removeFromCart } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    setIsSearchPerformed(false); 
  }, []);

  const handleSearch = async () => {
    try {
      if (searchQuery.trim()) {
        const response = await api.post('/api/search/', { query: searchQuery });
        setProducts(response.data);
        setIsSearchPerformed(true); 
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
      <View style={[styles.container, !isSearchPerformed && styles.centeredContainer]}>
        {!isSearchPerformed && (
          <Text style={styles.caption}>
            Search semantically with our intelligent vector search
          </Text>
        )}
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchbar, isSearchPerformed && styles.searchbarTop]}
        />
        <Button mode="contained" onPress={handleSearch} style={styles.searchButton}>
          Search
        </Button>
        {isSearchPerformed && products.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Closest Match</Text>
            {renderProduct({ item: products[0] })}
            {products.length > 1 && (
              <>
                <Text style={styles.sectionTitle}>Other Results</Text>
                <FlatList
                  data={products.slice(1)}
                  keyExtractor={(item) => item.id}
                  renderItem={renderProduct}
                  contentContainerStyle={styles.list}
                />
              </>
            )}
          </>
        )}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  caption: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  searchbarTop: {
    marginBottom: 16,
    alignSelf: "stretch",
  },
});

export default Marketplace;
