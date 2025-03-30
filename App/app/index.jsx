import React, { useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Card, Button, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import { AuthContext } from "@/contexts/AuthContext";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Main() {
  const { setRole, setIsAuthenticated } = useContext(AuthContext);
  const router = useRouter();
  const theme = useTheme();

  const userRouting = () => {
    setRole("User");
    setIsAuthenticated(true);
    router.push("/Home");
  };
  const SHGRouting = () => {
    setRole("SHG");
    setIsAuthenticated(true);
    router.push("/Home");
  };
  const SHGHeadRouting = () => {
    setRole("SHG-Head");
    setIsAuthenticated(true);
    router.push("/Home");
  };
  const VORouting = () => {
    setRole("VO");
    setIsAuthenticated(true);
    router.push("/VO");
  };

  return (
    <View style={styles.pageLayout}>
      <View style={styles.cardContainer}>
        <Card style={styles.card} onPress={userRouting}>
          <Card.Content style={styles.cardContent}>
            <MaterialCommunityIcons
              name="account"
              size={40}
              color={theme.colors.primary}
            />
            <Text style={styles.cardText}>Proceed as normal user</Text>
          </Card.Content>
        </Card>
        <Card style={styles.card} onPress={SHGRouting}>
          <Card.Content style={styles.cardContent}>
            <MaterialCommunityIcons
              name="account-group"
              size={40}
              color={theme.colors.primary}
            />
            <Text style={styles.cardText}>Login as SHG member</Text>
          </Card.Content>
        </Card>
      </View>
      <View style={styles.cardContainer}>
        <Card style={styles.card} onPress={SHGHeadRouting}>
          <Card.Content style={styles.cardContent}>
            <MaterialCommunityIcons
              name="account-cowboy-hat"
              size={40}
              color={theme.colors.primary}
            />
            <Text style={styles.cardText}>Login as SHG head</Text>
          </Card.Content>
        </Card>
        <Card style={styles.card} onPress={VORouting}>
          <Card.Content style={styles.cardContent}>
            <MaterialCommunityIcons
              name="account-tie"
              size={40}
              color={theme.colors.primary}
            />
            <Text style={styles.cardText}>Login as VO</Text>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageLayout: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 10,
  },
  cardContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  card: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    justifyContent: "center", // Center content within card
  },
  cardContent: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  cardText: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 16,
    color: 'black',
  },
});
