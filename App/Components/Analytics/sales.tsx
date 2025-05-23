import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useTheme, Card } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useProductStore } from "@/stores/productStore";
import { useSalesStore } from "@/stores/salesStore";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const Sales = () => {
  const theme = useTheme();
  const { products, fetchProducts } = useProductStore();
  const {
    sales,
    monthlySales,
    fetchSales,
    resetSales,
  } = useSalesStore();

  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const selectedProductDetails = products.find(
    (product) => product.id === selectedProduct
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchProducts();
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const year = new Date().getFullYear().toString();

    if (selectedProduct) {
      fetchSales(selectedProduct, year);
    } else {
      resetSales();
    }
  }, [selectedProduct]);

  const fullYearData = Array(12).fill(0);
  monthlySales.forEach(({ month, price_sold }) => {
    const monthIndex = Number(month) - 1; 
    if (monthIndex >= 0 && monthIndex < 12) {
      fullYearData[monthIndex] = price_sold;
    }
  });
  
  const formattedData = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    datasets: [
      {
        data: fullYearData,
        strokeWidth: 3, // Slightly thicker line to make it more visible
        color: (opacity = 1) => theme.colors.primary,
      },
    ],
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={[styles.message, { color: theme.colors.primary }]}>Loading...</Text>
      ) : error ? (
        <Text style={[styles.message, { color: theme.colors.error }]}>{error}</Text>
      ) : products.length > 0 ? (
        <View
          style={[
            styles.pickerWrapper,
            {
              backgroundColor: theme.colors.secondaryContainer,
              borderRadius: 12,
            },
          ]}
        >
          <Picker
            selectedValue={selectedProduct}
            onValueChange={(value) => setSelectedProduct(value)}
            style={[styles.picker, { color: theme.colors.onSecondaryContainer }]}
            dropdownIconColor={theme.colors.onSecondaryContainer}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="Select a product" value={null} enabled={false} />
            {products.map((product) => (
              <Picker.Item key={product.id} label={product.name} value={product.id} />
            ))}
          </Picker>
        </View>
      ) : (
        <Text style={[styles.message, { color: theme.colors.error }]}>No products available</Text>
      )}

      {selectedProductDetails && (
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.cardTitle, { color: theme.colors.primary }]}>
              {selectedProductDetails.name}
            </Text>
            <Text style={[styles.cardText, { color: theme.colors.onSurface }]}>
              <Text style={{ fontWeight: "bold" }}>Price:</Text> ${selectedProductDetails.price}
            </Text>
            <Text style={[styles.cardText, { color: theme.colors.onSurface }]}>
              <Text style={{ fontWeight: "bold" }}>Description:</Text> {selectedProductDetails.description}
            </Text>
          </Card.Content>
        </Card>
      )}

      {monthlySales.length > 0 && (
        <>
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={[styles.cardTitle, { color: theme.colors.primary }]}>Monthly Sales</Text>
              {monthlySales.map((month) => (
                <View key={`${month.month}-${month.year}`} style={{ marginBottom: 8 }}>
                  <Text style={[styles.cardText, { color: theme.colors.onSurface }]}>
                    <Text style={{ fontWeight: "bold" }}>Month:</Text> {month.month} {month.year}
                  </Text>
                  <Text style={[styles.cardText, { color: theme.colors.onSurface }]}>
                    <Text style={{ fontWeight: "bold" }}>Quantity Sold:</Text> {month.quantity_sold}
                  </Text>
                  <Text style={[styles.cardText, { color: theme.colors.onSurface }]}>
                    <Text style={{ fontWeight: "bold" }}>Total Price:</Text> ${month.price_sold}
                  </Text>
                </View>
              ))}
            </Card.Content>
          </Card>

         
              <Text style={[styles.cardTitle, { color: theme.colors.primary }]}>Monthly Sales Trend</Text>
              <LineChart
                data={formattedData}
                width={Dimensions.get("window").width - 32}
                height={220}
                chartConfig={{
                  backgroundColor: theme.colors.surface,
                  backgroundGradientFrom: theme.colors.surface,
                  backgroundGradientTo: theme.colors.surface,
                  decimalPlaces: 2,
                  color: (opacity = 1) => theme.colors.primary,
                  labelColor: (opacity = 1) => theme.colors.onSurface,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: "3", 
                    strokeWidth: "2",
                    stroke: theme.colors.primary,
                  },
                }}
                withDots={true}
                withInnerLines={false}
                withOuterLines={false}
                bezier
                
              />
           
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
  },
  pickerWrapper: {
    width: "90%",
    marginTop: 8,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    height: 60,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  pickerItem: {
    fontSize: 18,
  },
  card: {
    marginTop: 16,
    width: "90%",
    borderRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cardText: {
    fontSize: 16,
    marginTop: 4,
  },
});

export default Sales;
