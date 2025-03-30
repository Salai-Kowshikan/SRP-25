import {
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Text, Button, Searchbar, Divider} from "react-native-paper";
import InvestCard from "./InvestCards";
import { useState, useEffect } from "react";
import api from "@/api/api";

function Invest() {
  const [shgData, setShgData] = useState([]);
  async function fetchShgData() {
    try {
      let response = await api.get("/fetchAllShg");
     
      setShgData(response.data);
    } catch (error) {
      console.error("Error fetching SHG data:", error);
    }
  }

  useEffect(() => {
    fetchShgData();
  }, []);
  return (
    <>
      <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <View style={styles.banner}>
              <Text style={styles.bannerText}>
                Small Investment, Big Impact: Empower Communities through SHGs
              </Text>
              <Image
                style={styles.bannerImage}
                source={require("@/assets/images/invest-banner.png")}
              />
            </View>
            <View style={styles.searchBar}>
              <Searchbar placeholder="Search for SHGs" />
            </View>
            <Divider />
            <View style={styles.cardContainer}>
              <Text variant="headlineSmall" style={{fontWeight: "bold"}} > SHGs around you </Text>
              {shgData.map((shg, index) => (
                <InvestCard
                  key={index}
                  title={shg.name}
                  subtitle={shg.subtitle}
                  description={shg.description}
                  imageUri={shg.img}
                  id={shg.shg_id}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

export default Invest;


const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    height: "100%",
    marginBottom: 20,
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
  searchBar: {
    marginHorizontal: 10,
  },
  cardContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginHorizontal: 20,
  }
});
