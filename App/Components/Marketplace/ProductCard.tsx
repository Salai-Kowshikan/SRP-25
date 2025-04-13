import { View, StyleSheet } from "react-native";
import { Text, Card, Button, Modal, Portal, TextInput } from "react-native-paper";
import { useState } from "react";

type ProductCardProps = {
  productName: string;
  sellingPrice: string;
  description: string;
  onModify: (updatedProduct: { productName: string; sellingPrice: string; description: string }) => void;
  onViewSales: () => void;
};

const ProductCard = ({
  productName,
  sellingPrice,
  description,
  onModify,
  onViewSales,
}: ProductCardProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [updatedName, setUpdatedName] = useState(productName);
  const [updatedPrice, setUpdatedPrice] = useState(sellingPrice);
  const [updatedDescription, setUpdatedDescription] = useState(description);

  const handleSaveChanges = () => {
    onModify({
      productName: updatedName,
      sellingPrice: updatedPrice,
      description: updatedDescription,
    });
    setIsModalVisible(false);
  };

  return (
    <>
      <Card style={styles.card}>
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
          <Button mode="contained" onPress={onViewSales} style={styles.actionButton}>
            View Sales
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
          <Button mode="contained" onPress={handleSaveChanges} style={styles.saveButton}>
            Save Changes
          </Button>
          <Button mode="outlined" onPress={handleSaveChanges} style={styles.saveButton}>
            Delete listing
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
  saveButton: {
    marginTop: 10,
  },
});

export default ProductCard;