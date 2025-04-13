import { View, StyleSheet, ScrollView } from "react-native";
import { FAB, Text, Modal, Portal, TextInput, Button } from "react-native-paper";
import { useState } from "react";
import api from "@/api/api";

const AddProductFAB = () => {
  const [AddProductModalVisible, setAddProductModalVisible] = useState(false);

  return (
    <>
      <FAB
        icon="plus"
        style={styles.fab}
        label="Add Product"
        onPress={() => setAddProductModalVisible(true)}
      />
      <Portal>
        <Modal
          visible={AddProductModalVisible}
          onDismiss={() => setAddProductModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <AddProductForm dismiss={setAddProductModalVisible} />
        </Modal>
      </Portal>
    </>
  );
};

const AddProductForm = ({ dismiss }: { dismiss: (value: boolean) => void }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleListProduct = async () => {
    const payload = {
      shg_id: "shg_001",
      name,
      description,
      price: parseFloat(price),
    };

    try {
      const response = await api.post("/api/products/add", payload);
      if (response.data.success) {
        console.log("Product added successfully:", response.data);
      } else {
        console.error("Error adding product:", response.data.error);
      }
    } catch (error) {
      console.error("API call failed:", error);
    }

    setName("");
    setDescription("");
    setPrice("");
    dismiss(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>New product listing</Text>
        <TextInput
          label="Product Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
        />
        <TextInput
          label="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={styles.input}
        />
        <Button mode="contained" onPress={handleListProduct}>
          List Product
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
    maxHeight: "70%",
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    flex: 1,
    gap: 10,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
});

export default AddProductFAB;