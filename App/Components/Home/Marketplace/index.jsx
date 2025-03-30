import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  Modal,
  TouchableOpacity,
} from "react-native";
import {
  Searchbar,
  FAB,
  Divider,
  Chip,
  Button,
  useTheme,
} from "react-native-paper";
// import HorizontalScrollView from "@/Components/UI/MarketScroll";

const HorizontalScrollView = ({ data, onProductPress }) => (
  
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    {data.map((item, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => onProductPress(item)}
        style={styles.productCard}
        mode="contained"
      >
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>₹{item.price}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

export default function MarketPlace() {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [cartVisible, setCartVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState([]);

  const data = [
    {
      name: "Thirunelveli Alwa",
      price: 100,
      image:
        "https://images.pexels.com/photos/20446403/pexels-photo-20446403/free-photo-of-top-view-of-gajorer-halwa-dessert.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      name: "Basket",
      price: 200,
      image:
        "https://images.pexels.com/photos/2113125/pexels-photo-2113125.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      name: "Candle",
      price: 300,
      image:
        "https://images.pexels.com/photos/783200/pexels-photo-783200.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      name: "Handbag",
      price: 400,
      image:
        "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      name: "Pot",
      price: 500,
      image:
        "https://images.pexels.com/photos/3692083/pexels-photo-3692083.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
  ];

  const categories = [
    { key: "1", name: "Pot", icon: "pot" },
    { key: "2", name: "Clothing", icon: "tshirt-crew" },
    { key: "3", name: "Baskets", icon: "basket" },
    { key: "4", name: "Spices", icon: "spoon-sugar" },
    { key: "5", name: "Herbal Tea", icon: "tea" },
    { key: "6", name: "Pickle", icon: "food-variant" },
    { key: "7", name: "Honey", icon: "bee-flower" },
    { key: "8", name: "Candles", icon: "candle" },
    { key: "9", name: "Shoes", icon: "shoe-formal" },
  ];

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setModalVisible(true);
  };

  const addProductToCart = () => {
    if (selectedProduct) {
      setCartItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex(
          (item) => item.name === selectedProduct.name
        );
        if (existingItemIndex >= 0) {
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex].quantity += quantity;
          return updatedItems;
        }
        return [...prevItems, { ...selectedProduct, quantity }];
      });
      setModalVisible(false);
    }
  };

  const handleRemoveFromCart = (name) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.name !== name));
  };

  const handleQuantityChange = (name, change) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.name === name
          ? { ...item, quantity: item.quantity + change }
          : item
      )
    );
  };

  const handleModalQuantityChange = (change) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + change));
  };

  return (
    <>
      <ScrollView style={styles.scrollView}>
        <View style={styles.pageLayout}>
          <View style={styles.Searchbar}>
            <Searchbar placeholder="Search for products near you" />
          </View>
          <Divider />
          <View style={styles.banner}>
            <Image
              style={styles.bannerImage}
              source={require("@/assets/images/marketplace-banner.png")}
            />
            <Text style={styles.bannerText}>
              Your wallet has power, support local businesses
            </Text>
          </View>
          <Divider />
          <Text style={styles.heading2}>Top selling Products</Text>
          <HorizontalScrollView data={data} onProductPress={openProductModal} />
          <Divider />
          <Text style={styles.heading2}>Shop by category</Text>
          <FlatList
            data={categories}
            renderItem={({ item }) => (
              <Chip icon={item.icon} style={styles.chip}>
                {item.name}
              </Chip>
            )}
            keyExtractor={(item) => item.key}
            numColumns={3}
            columnWrapperStyle={styles.row}
          />
          <Divider />
          <Text style={styles.heading2}>Suggested for you</Text>
          <HorizontalScrollView data={data} onProductPress={openProductModal} />
        </View>
      </ScrollView>

      <FAB
        icon="cart-variant"
        style={styles.cartFAB}
        onPress={() => setCartVisible(true)}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Product Details</Text>
            {selectedProduct && (
              <>
                <Image
                  source={{ uri: selectedProduct.image }}
                  style={styles.modalImage}
                />
                <Text style={styles.modalLabel}>
                  Name: {selectedProduct.name}
                </Text>
                <Text style={styles.modalLabel}>
                  Price: ₹{selectedProduct.price}
                </Text>
                <Text style={styles.modalLabel}>
                  Availability: {selectedProduct.availability || "N/A"} items
                </Text>
                <View style={styles.quantityContainer}>
                  <Button
                    onPress={() => handleModalQuantityChange(-1)}
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>-</Text>
                  </Button>
                  <Text style={styles.quantityLabel}>{quantity}</Text>
                  <Button
                    onPress={() => handleModalQuantityChange(1)}
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </Button>
                </View>
                <View style={styles.modalButtons}>
                  <Button
                    mode="outlined"
                    onPress={() => setModalVisible(false)}
                    style={styles.modalButton}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    onPress={addProductToCart}
                    style={styles.modalButton}
                  >
                    Add to Cart
                  </Button>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
      <Modal
        visible={cartVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCartVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {cartItems.length === 0 ? (
              <Text style={styles.emptyCartMessage}>Your cart is empty.</Text>
            ) : (
              <>
                <Text style={styles.modalTitle}>Your Cart</Text>
                <FlatList
                  data={cartItems}
                  renderItem={({ item }) => (
                    <View style={styles.cartItem}>
                      <Image
                        source={{ uri: item.image }}
                        style={styles.cartItemImage}
                      />
                      <View style={styles.cartItemDetails}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemDetails}>
                          Price: ₹{item.price}
                        </Text>
                        <View style={styles.quantityContainer}>
                          <TouchableOpacity
                            onPress={() => handleQuantityChange(item.name, -1)}
                            style={styles.quantityButton}
                          >
                            <Text style={styles.quantityButtonText}>-</Text>
                          </TouchableOpacity>
                          <Text style={styles.quantityLabel}>
                            {item.quantity}
                          </Text>
                          <TouchableOpacity
                            onPress={() => handleQuantityChange(item.name, 1)}
                            style={styles.quantityButton}
                          >
                            <Text style={styles.quantityButtonText}>+</Text>
                          </TouchableOpacity>
                        </View>
                        <View style={styles.cartItemButtons}>
                          <Button
                            mode="outlined"
                            onPress={() => handleRemoveFromCart(item.name)}
                            style={styles.cartButton}
                          >
                            Remove
                          </Button>
                        </View>
                      </View>
                    </View>
                  )}
                  keyExtractor={(item) => item.name}
                />
                <View style={styles.modalButtons}>
                  <Button
                    mode="outlined"
                    onPress={() => setCartVisible(false)}
                    style={styles.modalButton}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() => console.log("Proceed to Buy")}
                    style={styles.modalButton}
                  >
                    Proceed to Buy
                  </Button>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  pageLayout: {
    padding: 16,
  },
  Searchbar: {
    marginVertical: 16,
  },
  banner: {
    width: "100%",
    height: 180,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  bannerText: {
    flex: 1,
    textAlign: "center",
    padding: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  bannerImage: {
    flex: 1,
    height: "100%",
  },
  heading2: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 16,
  },
  chip: {
    margin: 8,
  },
  row: {
    justifyContent: "space-around",
  },
  productCard: {
    width: 120,
    margin: 8,
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 4,
  },
  productPrice: {
    fontSize: 12,
    color: "#4caf50",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  modalImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    margin: 8,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  cartButton: {
    margin: 4,
  },
  cartFAB: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
  cartItem: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  cartItemDetails: {
    flex: 1,
    justifyContent: "center",
  },
  emptyCartMessage: {
    fontSize: 18,
    textAlign: "center",
    color: "#888",
    padding: 20,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemDetails: {
    fontSize: 14,
    marginBottom: 4,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  quantityButton: {
    backgroundColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    margin: 4,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 12,
  },
});
