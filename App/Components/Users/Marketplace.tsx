import { View, Text, StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";
import { useState } from "react";

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const onChangeSearch = (query: string) => setSearchQuery(query);

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchbar}
      />
      <Text style={styles.text}>Marketplace</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  searchbar: {
    width: "100%",
    marginBottom: 16,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Marketplace;
