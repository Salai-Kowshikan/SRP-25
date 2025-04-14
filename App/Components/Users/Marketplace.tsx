import { View, StyleSheet, FlatList } from "react-native";
import { Searchbar, Button, Card, Text } from "react-native-paper";
import { useState } from "react";
import api from "@/api/api";

type Product = {
  id: string;
  name: string;
  description: string;
};

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

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

  const renderProduct = ({ item }: { item: Product }) => (
    <Card style={styles.card}>
      <Card.Title title={item.name} />
      <Card.Content>
        <Text>{item.description}</Text>
      </Card.Content>
    </Card>
  );

  return (
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
});

export default Marketplace;
