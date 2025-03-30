import { View, StyleSheet, ScrollView, Image } from "react-native";
import { FAB, Text, Modal, Portal, TextInput, Button } from "react-native-paper";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

type ImagePickerResult = {
  uri: string;
  base64?: string | null;
};

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
  const [productName, setProductName] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [threshold, setThreshold] = useState("");
  const [image, setImage] = useState<ImagePickerResult | null>(null); // Explicitly define the type

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleListProduct = () => {
    const productData = {
      productName,
      sellingPrice,
      quantity,
      threshold,
      image: image?.base64,
    };
    // console.log("Product Data:", JSON.stringify(productData, null, 2));
    setProductName("");
    setSellingPrice("");
    setQuantity("");
    setThreshold("");
    setImage(null);
    dismiss(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Add Product Form</Text>
        <TextInput
          label="Product Name"
          value={productName}
          onChangeText={setProductName}
          style={styles.input}
        />
        <TextInput
          label="Selling Price"
          value={sellingPrice}
          onChangeText={setSellingPrice}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          label="Quantity"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          label="Threshold for Restock"
          value={threshold}
          onChangeText={setThreshold}
          keyboardType="numeric"
          style={styles.input}
        />
        <Button mode="outlined" onPress={handlePickImage} style={styles.input}>
          {image ? "Change Image" : "Upload Image"}
        </Button>
        {image && (
          <Image
            source={{ uri: image.uri }}
            style={styles.imagePreview}
            resizeMode="contain"
          />
        )}
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
  imagePreview: {
    width: "100%",
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
});

export default AddProductFAB;