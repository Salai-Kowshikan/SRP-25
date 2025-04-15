import { View, StyleSheet, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { Title, DataTable } from "react-native-paper";
import api from "@/api/api"; 

interface OrderItem {
  id: string;
  price: number;
  quantity: number;
  shg_id: string;
  total: number;
}

interface Order {
  order_id: string;
  orders: OrderItem[];
  shg_id: string;
  user_id: string;
}

const Orders = () => {
  const userId = "2bd38c45-e460-4a73-bed7-0967290b6a6b";
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get<{ orders: Order[] }>(`/api/orders/${userId}`);
        setOrders(response.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Orders</Title>
      {orders.map((order) => (
        <View key={order.order_id} style={styles.orderContainer}>
          <Title style={styles.orderHeader}>Order ID: {order.order_id}</Title>
          <ScrollView horizontal>
            <ScrollView>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Item ID</DataTable.Title>
                  <DataTable.Title numeric>Price</DataTable.Title>
                  <DataTable.Title numeric>Quantity</DataTable.Title>
                  <DataTable.Title numeric>Total</DataTable.Title>
                </DataTable.Header>
                {order.orders.map((item) => (
                  <DataTable.Row key={item.id}>
                    <DataTable.Cell>{item.id}</DataTable.Cell>
                    <DataTable.Cell numeric>{item.price}</DataTable.Cell>
                    <DataTable.Cell numeric>{item.quantity}</DataTable.Cell>
                    <DataTable.Cell numeric>{item.total}</DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            </ScrollView>
          </ScrollView>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  orderContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 3,
    maxHeight: 300, // Limit vertical scroll height
  },
  orderHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default Orders;
