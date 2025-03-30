import { View, Image, ScrollView, StyleSheet } from "react-native";
import { Button, Card, Text } from "react-native-paper";

const HorizontalScrollView = ({ data, onProductPress }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    {data.map((item, index) => (
      <Button
        key={index}
        onPress={() => onProductPress(item)}
        style={styles.productCard}
        mode="contained"
      >
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>₹{item.price}</Text>
      </Button>
    ))}
  </ScrollView>
);

export default HorizontalScrollView;

const styles = StyleSheet.create({
  img: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  productCard: {
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  productPrice: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
});