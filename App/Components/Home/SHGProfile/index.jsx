import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import axios from "axios";
import { Card, FAB, Modal, Portal, Button, TextInput, Provider as PaperProvider } from "react-native-paper";

export default function SHGProfile() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormVisible, setFormVisible] = useState(false);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await axios.get("http://10.16.49.244:5000/fetchSHG");
        setData(response.data);
        setLoading(false);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  if (data.length === 0) {
    return <Text>No data available</Text>;
  }

  const shg = data[0];

  const containerStyle = { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 8 };

  return (

      <View style={styles.screen}>
        <Card style={styles.card}>
          <ScrollView>
            <View style={styles.container}>
              <View style={styles.dataContainer}>
                <Text style={styles.dataLabel}>Name:</Text>
                <Text style={styles.dataValue}>{shg.SHG_Name}</Text>
              </View>
              <View style={styles.dataContainer}>
                <Text style={styles.dataLabel}>Risk Assessment Score</Text>
                <Text style={styles.dataValue}>{shg.Score}</Text>
              </View>
              <View style={styles.dataContainer}>
                <Text style={styles.dataLabel}>Annual Revenue:</Text>
                <Text style={styles.dataValue}>{shg.Annual_Revenue}</Text>
              </View>
              <View style={styles.dataContainer}>
                <Text style={styles.dataLabel}>Awards & Recognition:</Text>
                <Text style={styles.dataValue}>{shg.Awards_Recognition}</Text>
              </View>
              <View style={styles.dataContainer}>
                <Text style={styles.dataLabel}>Community Impact:</Text>
                <Text style={styles.dataValue}>{shg.Community_Impact}</Text>
              </View>
              <View style={styles.dataContainer}>
                <Text style={styles.dataLabel}>Date of Establishment:</Text>
                <Text style={styles.dataValue}>{shg.Date_Of_Establishment}</Text>
              </View>
              <View style={styles.dataContainer}>
                <Text style={styles.dataLabel}>Economic Conditions:</Text>
                <Text style={styles.dataValue}>{shg.Economic_Conditions}</Text>
              </View>
              <View style={styles.dataContainer}>
                <Text style={styles.dataLabel}>Geographical Area:</Text>
                <Text style={styles.dataValue}>{shg.Geographical_Area}</Text>
              </View>
              <View style={styles.dataContainer}>
                <Text style={styles.dataLabel}>Government Support:</Text>
                <Text style={styles.dataValue}>{shg.Government_Support}</Text>
              </View>
              <View style={styles.dataContainer}>
                <Text style={styles.dataLabel}>Loan Amount:</Text>
                <Text style={styles.dataValue}>{shg.Loan_Amount}</Text>
              </View>
              <View style={styles.dataContainer}>
                <Text style={styles.dataLabel}>Loan Repayment Status:</Text>
                <Text style={styles.dataValue}>{shg.Loan_Repayment_Status}</Text>
              </View>
              <View style={styles.dataContainer}>
                <Text style={styles.dataLabel}>Market Reach:</Text>
                <Text style={styles.dataValue}>{shg.Market_Reach}</Text>
              </View>
              <View style={styles.dataContainer}>
                <Text style={styles.dataLabel}>Market Trends:</Text>
                <Text style={styles.dataValue}>{shg.Market_Trends}</Text>
              </View>
              <View style={styles.dataContainer}>
                <Text style={styles.dataLabel}>Projects Completed:</Text>
                <Text style={styles.dataValue}>{shg.Projects_Completed}</Text>
              </View>
              <View style={styles.dataContainer}>
                <Text style={styles.dataLabel}>SHG Members:</Text>
                <Text style={styles.dataValue}>{shg.SHG_Members}</Text>
              </View>
              <View style={styles.dataContainer}>
                <Text style={styles.dataLabel}>Success Rate:</Text>
                <Text style={styles.dataValue}>{shg.Success_Rate}%</Text>
              </View>
            </View>
          </ScrollView>
          <FAB
            style={styles.cartFAB}
            icon="plus"
            label="Add non-smartphone user"
            onPress={() => setFormVisible(true)}
          />
          <Portal>
            <Modal visible={isFormVisible} onDismiss={() => setFormVisible(false)} contentContainerStyle={containerStyle}>
              <TextInput
                label="Name"
                value={name}
                onChangeText={text => setName(text)}
                style={styles.input}
              />
              <TextInput
                label="Phone Number"
                value={phoneNumber}
                onChangeText={text => setPhoneNumber(text)}
                style={styles.input}
              />
              <Button mode="contained" onPress={() => {}} style={styles.button}>
                Add
              </Button>
              <Button mode="contained" onPress={() => setFormVisible(false)} style={styles.button}>
                Close
              </Button>
            </Modal>
          </Portal>
        </Card>
      </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  card: {
    margin: 10,
    flex: 1,
  },
  container: {
    padding: 20,
  },
  dataContainer: {
    marginBottom: 15,
  },
  dataLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dataValue: {
    fontSize: 16,
    marginTop: 5,
  },
  cartFAB: {
    position: "absolute",
    margin: 30,
    right: 0,
    bottom: 0,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
  },
});
