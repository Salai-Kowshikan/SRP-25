import { View, StyleSheet } from "react-native";
import { Text, Card, Button, Modal, Portal, TextInput, Switch } from "react-native-paper";
import { useState } from "react";
import { useProductStore } from "@/stores/productStore";
import api from "@/api/api";

type ProductCardProps = {
  productId: string; // Added productId prop
  productName: string;
  sellingPrice: string;
  description: string;
  on_sale: boolean;
};

const ProductCard = ({
  productId, // Destructure productId
  productName,
  sellingPrice,
  description,
  on_sale,
}: ProductCardProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [updatedName, setUpdatedName] = useState(productName);
  const [updatedPrice, setUpdatedPrice] = useState(sellingPrice);
  const [updatedDescription, setUpdatedDescription] = useState(description);
  const [updatedOnSale, setUpdatedOnSale] = useState(on_sale);

  const { fetchProducts } = useProductStore();

  const handleSaveChanges = async () => {
    const payload = {
      product_id: productId,
      name: updatedName,
      description: updatedDescription,
      price: parseFloat(updatedPrice),
      on_sale: updatedOnSale,
    };

    try {
      const response = await api.put("/api/products/edit", payload);
      if (response.data.success) {
        console.log("Product updated successfully:", response.data);
        await fetchProducts();
      } else {
        console.error("Error updating product:", response.data.error);
      }
    } catch (error) {
      console.error("API call failed:", error);
    }

    setIsModalVisible(false);
  };

  return (
    <>
      <Card style={[styles.card, !on_sale && styles.dullCard]}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.textContainer}>
            <Text style={styles.productName}>{productName}</Text>
            <Text style={styles.sellingPrice}>Price: ${sellingPrice}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
        </Card.Content>
        <Card.Actions style={styles.cardActions}>
          <Button mode="outlined" onPress={() => setIsModalVisible(true)} style={styles.actionButton}>
            Modify Listing
          </Button>
        </Card.Actions>
      </Card>

      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={() => setIsModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Modify Listing</Text>
          <TextInput
            label="Product Name"
            value={updatedName}
            onChangeText={setUpdatedName}
            style={styles.input}
          />
          <TextInput
            label="Selling Price"
            value={updatedPrice}
            onChangeText={setUpdatedPrice}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Description"
            value={updatedDescription}
            onChangeText={setUpdatedDescription}
            style={styles.input}
          />
          <View style={styles.switchContainer}>
            <Text>On Sale</Text>
            <Switch
              value={updatedOnSale}
              onValueChange={setUpdatedOnSale}
            />
          </View>
          <Button mode="contained" onPress={handleSaveChanges} style={styles.saveButton}>
            Save Changes
          </Button>
        </Modal>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  dullCard: {
    opacity: 0.5,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  textContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  sellingPrice: {
    fontSize: 16,
    color: "gray",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "gray",
  },
  cardActions: {
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  actionButton: {
    marginHorizontal: 5,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  saveButton: {
    marginTop: 10,
  },
});

export default ProductCard;