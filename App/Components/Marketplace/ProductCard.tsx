import { View, StyleSheet, Image } from "react-native";
import { Text, Card, Button, Modal, Portal, TextInput } from "react-native-paper";
import { useState } from "react";

type ProductCardProps = {
  productName: string;
  sellingPrice: string;
  imageUri: string;
  quantity: string;
  onModify: (updatedProduct: { productName: string; sellingPrice: string; quantity: string }) => void;
  onViewSales: () => void;
};

const ProductCard = ({
  productName,
  sellingPrice,
  imageUri,
  quantity,
  onModify,
  onViewSales,
}: ProductCardProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [updatedName, setUpdatedName] = useState(productName);
  const [updatedPrice, setUpdatedPrice] = useState(sellingPrice);
  const [updatedQuantity, setUpdatedQuantity] = useState(quantity);

  const handleSaveChanges = () => {
    onModify({
      productName: updatedName,
      sellingPrice: updatedPrice,
      quantity: updatedQuantity,
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
            <Text style={styles.quantity}>Quantity: {quantity}</Text>
          </View>
          <Image source={{ uri: imageUri }} style={styles.productImage} />
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
            label="Quantity"
            value={updatedQuantity}
            onChangeText={setUpdatedQuantity}
            keyboardType="numeric"
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
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  sellingPrice: {
    fontSize: 16,
    color: "gray",
  },
  quantity: {
    fontSize: 16,
    color: "gray",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
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