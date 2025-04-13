import { Modal, Portal, Button, Text, TextInput } from "react-native-paper";
import { View, StyleSheet, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import { useProductStore } from "@/stores/productStore";
import api from "@/api/api";

interface ExpenditureDialogBoxProps {
  visible: boolean;
  onClose: () => void;
}

const ExpenditureDialogBox = ({ visible, onClose }: ExpenditureDialogBoxProps) => {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [accountOwnerName, setAccountOwnerName] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const shg_id = "shg_001";

  const products = useProductStore((state) => state.products);
  const fetchProducts = useProductStore((state) => state.fetchProducts);

  useEffect(() => {
    if (visible) {
      fetchProducts();
    }
  }, [visible, fetchProducts]);

  const handleSubmit = async () => {
    try {
      const payload = {
        amount: parseFloat(amount),
        other_account: {
          account_owner_name: accountOwnerName || undefined,
          account_number: accountNumber || undefined,
        },
        product_id: selectedProductId,
        notes,
        quantity: parseInt(quantity, 10),
      };

      await api.post(`/api/transactions/expenditure/${shg_id}`, payload);
      onClose();
    } catch (error) {
      console.error("Failed to add expenditure:", error);
    }
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modalContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Add Expenditure</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedProductId}
              onValueChange={(itemValue) => setSelectedProductId(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select a product" value={null} />
              {products.map((product) => (
                <Picker.Item key={product.id} label={product.name} value={product.id} />
              ))}
            </Picker>
          </View>
          <TextInput
            label="Amount"
            style={styles.input}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <TextInput
            label="Quantity"
            style={styles.input}
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />
          <TextInput
            label="Notes"
            style={styles.input}
            multiline
            value={notes}
            onChangeText={setNotes}
          />
          <TextInput
            label="Account Owner Name (Optional)"
            style={styles.input}
            value={accountOwnerName}
            onChangeText={setAccountOwnerName}
          />
          <TextInput
            label="Account Number/UPI ID (Optional)"
            style={styles.input}
            value={accountNumber}
            onChangeText={setAccountNumber}
          />
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={handleSubmit} style={styles.button}>
              Submit
            </Button>
            <Button mode="outlined" onPress={onClose} style={styles.button}>
              Cancel
            </Button>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 8,
    maxHeight: "90%",
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  pickerContainer: {
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  input: {
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default ExpenditureDialogBox;
