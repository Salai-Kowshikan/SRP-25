import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Card } from "react-native-paper";
import axios from "axios";

const Sales = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://192.168.1.4:5000/analysis", {
          params: { month: 3, year: 2025 },
        });
        setData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          {error ? (
            <Text style={styles.error}>Error: {error}</Text>
          ) : data ? (
            <Text style={styles.message}>{JSON.stringify(data, null, 2)}</Text>
          ) : (
            <Text style={styles.loading}>Loading...</Text>
          )}
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "90%",
    padding: 16,
    borderRadius: 8,
    elevation: 4,
  },
  message: {
    fontSize: 16,
    fontWeight: "normal",
    textAlign: "left",
  },
  error: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
    textAlign: "center",
  },
  loading: {
    fontSize: 16,
    fontWeight: "normal",
    textAlign: "center",
  },
});

export default Sales;