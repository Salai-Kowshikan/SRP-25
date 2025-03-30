import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  TextInput,
} from 'react-native';
import { Searchbar, FAB, Divider, Button, Card, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import i from '@/Translations';
import api from '@/api/api';

export default function ShgMarket() {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [addProductModalVisible, setAddProductModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updatedPrice, setUpdatedPrice] = useState("");
  const [updatedAvailability, setUpdatedAvailability] = useState("");
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductAvailability, setNewProductAvailability] = useState("");
  const [newProductImage, setNewProductImage] = useState("");
  const [data, setData] = useState([]);

  const chartData = {
    labels: data.map((item) => item.product_name),
    datasets: [
      {
        data: data.map((item) => item.quantity_sold),
      },
    ],
  };

  const screenWidth = Dimensions.get("window").width;

  const openModal = (item) => {
    setSelectedProduct(item);
    setUpdatedPrice(item.price.toString());
    setUpdatedAvailability(item.availability.toString());
    setModalVisible(true);
  };

  const addProduct = async () => {
    const response = await api.post("/addProduct", {
      product_name: newProductName,
      price: parseFloat(newProductPrice),
      image: newProductImage,
      shg_id: "shg_001",
      availability: parseInt(newProductAvailability),
    });
    console.log(response.data);
    setAddProductModalVisible(false);
    setNewProductName("");
    setNewProductPrice("");
    setNewProductAvailability("");
    setNewProductImage("");
    fetchProducts();
  };

  const saveChanges = async () => {
    try {
      const response = await api.post("/updateProduct", {
        shg_id: "shg_001",
        product_name: selectedProduct.product_name,
        price: parseFloat(updatedPrice),
        availability: parseInt(updatedAvailability),
      });
    } catch (error) {
      console.error(error);
    }
    fetchProducts();
    setModalVisible(false);
  };

  const openAddProductModal = () => {
    setAddProductModalVisible(true);
  };

  const fetchProducts = async () => {
    const response = await api.get("/fetchProducts");
    setData(response.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <ScrollView>
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
              {i.t('marketQuote')}
            </Text>
          </View>
          <Divider />

          <Text style={styles.heading2}>{i.t('salesChart')}</Text>
          <BarChart
            data={chartData}
            width={screenWidth - 30}
            height={220}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: theme.colors.surface,
              backgroundGradientFrom: theme.colors.surface,
              backgroundGradientTo: theme.colors.surface,
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(151, 72, 16, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForBackgroundLines: {
                strokeWidth: 1,
                stroke: "#e3e3e3",
                strokeDasharray: "0",
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
              alignSelf: "center",
            }}
          />
          
          <Text style={styles.heading2}>{i.t('yourProducts')}</Text>
          <ScrollView style={styles.scroll}>
            {data.map((item, index) => (
              <View key={index} style={styles.card}>
                <Card>
                  <Card.Content style={styles.shopCard}>
                    <Image source={{ uri: item.image }} style={styles.img} />
                    <View style={styles.textContent}>
                      <Text style={styles.caption}>{item.product_name}</Text>
                      <View style={styles.salesInfo}>
                        <MaterialCommunityIcons name="chart-line" size={20} color="green" />
                        <Text style={styles.salesText}>{i.t('sales')} : {item.sale}</Text>
                      </View>
                      <Text style={styles.priceText}>{i.t('price')}: ₹{item.price}</Text>
                      <Text style={styles.availabilityText}>{i.t('availability')}: {item.availability} items</Text>
                    </View>
                  </Card.Content>
                  <Card.Actions>
                    <Button onPress={() => openModal(item)}>{i.t('changeAvailability')}</Button>
                  </Card.Actions>
                </Card>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
      <FAB
        icon="plus"
        label={i.t('addProduct')}
        style={styles.cartFAB}
        onPress={openAddProductModal}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{i.t('editProductDetails')}</Text>

            <Text style={styles.modalLabel}>{i.t('productName')}: {selectedProduct?.name}</Text>
            <Text style={styles.modalLabel}>{i.t('UpdatePrice')}:</Text>
            <TextInput
              style={styles.input}
              value={updatedPrice}
              onChangeText={setUpdatedPrice}
              keyboardType="numeric"
            />

            <Text style={styles.modalLabel}>{i.t('UpdateAvailability')}:</Text>
            <TextInput
              style={styles.input}
              value={updatedAvailability}
              onChangeText={setUpdatedAvailability}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <Button mode="outlined" onPress={() => setModalVisible(false)}>
                {i.t('cancel')}
              </Button>
              <Button mode="contained" onPress={saveChanges}>
                {i.t('save')}
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={addProductModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddProductModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{i.t('addNewProduct')}</Text>

            <Text style={styles.modalLabel}>{i.t('productName')}</Text>
            <TextInput
              style={styles.input}
              value={newProductName}
              onChangeText={setNewProductName}
            />

            <Text style={styles.modalLabel}>{i.t('price')}:</Text>
            <TextInput
              style={styles.input}
              value={newProductPrice}
              onChangeText={setNewProductPrice}
              keyboardType="numeric"
            />

            <Text style={styles.modalLabel}>{i.t('availability')}:</Text>
            <TextInput
              style={styles.input}
              value={newProductAvailability}
              onChangeText={setNewProductAvailability}
              keyboardType="numeric"
            />

            <Text style={styles.modalLabel}>{i.t('ImageLink')}:</Text>
            <TextInput
              style={styles.input}
              value={newProductImage}
              onChangeText={setNewProductImage}
            />

            <View style={styles.modalButtons}>
              <Button mode="outlined" onPress={() => setAddProductModalVisible(false)}>
              {i.t('cancel')}
              </Button>
              <Button mode="contained" onPress={addProduct}>
                {i.t('Add')}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  Searchbar: {
    margin: 10,
  },
  heading2: {
    fontSize: 20,
    textAlign: "left",
    marginHorizontal: 15,
    marginTop: 10,
  },
  cartFAB: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
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
  pageLayout: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    marginBottom: 20,
  },
  scroll: {
    paddingHorizontal: 15,
  },
  card: {
    marginBottom: 15,
  },
  shopCard: {
    flexDirection: "row",
    alignItems: "center",
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  textContent: {
    flex: 1,
  },
  caption: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  salesInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  salesText: {
    marginLeft: 5,
    fontSize: 16,
  },
  priceText: {
    fontSize: 14,
    marginTop: 5,
  },
  availabilityText: {
    fontSize: 14,
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
