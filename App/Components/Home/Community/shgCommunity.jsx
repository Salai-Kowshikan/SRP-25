import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
} from "react-native";
import { Searchbar, Divider, Button, Card, FAB } from "react-native-paper";
import api from "@/api/api";
import i from "@/Translations";

export default function ShgCommunity() {
  const [shgData, setShgData] = useState([]);

  async function fetchShgData() {
    try {
      let response = await api.get("/fetchAllShg");
      // console.log(response.data);
      setShgData(response.data);
    } catch (error) {
      console.error("Error fetching SHG data:", error);
    }
  }

  function handleCall(contact) {
    const url = `tel:${contact}`;
    Linking.openURL(url).catch((err) =>
      console.error("Error opening dialer", err)
    );
  }

  const recentActivities = [
    {
      date: "2024-07-25",
      shgName: "Sunrise SHG",
      description: "Conducted a workshop on sustainable farming practices.",
      details:
        "Detailed description of the workshop on sustainable farming practices by Sunrise SHG.",
    },
    {
      date: "2024-07-20",
      shgName: "Empowerment SHG",
      description: "Launched a new handicraft product line.",
      details:
        "Detailed description of the new handicraft product line launched by Empowerment SHG.",
    },
    {
      date: "2024-07-15",
      shgName: "Unity SHG",
      description: "Organized a health camp for the local community.",
      details:
        "Detailed description of the health camp organized by Unity SHG for the local community.",
    },
  ];

  useEffect(() => {
    fetchShgData();
  }, []);

  return (
    <>
      <ScrollView>
        <View style={styles.pageLayout}>
          <Divider />
          <View style={styles.banner}>
            <Image
              style={styles.bannerImage}
              source={require("@/assets/images/image.png")}
            />
            <Text style={styles.bannerText}>{i.t("formCommunity")}</Text>
          </View>
          <Divider />
          <View style={styles.newsContainerWrapper}>
            <View style={styles.Searchbar}>
              <Searchbar placeholder="Search for SHGs near you" />
            </View>
            <Text style={styles.heading}>{i.t("recentPosts")}</Text>
            <ScrollView style={styles.newsContainer} nestedScrollEnabled={true}>
              {recentActivities.map((activity, index) => (
                <Card key={index} style={styles.newsCard}>
                  <Card.Content>
                    <Text style={styles.date}>{activity.date}</Text>
                    <Text style={styles.shgName}>{activity.shgName}</Text>
                    <Text>{activity.description}</Text>
                  </Card.Content>
                </Card>
              ))}
            </ScrollView>
          </View>
          <Text style={styles.heading2}>{i.t("connect")}</Text>
          <ScrollView style={styles.scroll}>
            {shgData.map((item) => (
              <View key={item.shg_id} style={styles.card}>
                <Card>
                  <Card.Content style={styles.shopCard}>
                    <Image source={{ uri: item.img }} style={styles.img} />
                    <View style={styles.textContent}>
                      <Text style={styles.caption}>{item.name}</Text>
                      <View style={styles.communityInfo}>
                        <Text style={styles.communityText}>
                          {item.location}
                        </Text>
                      </View>
                    </View>
                  </Card.Content>
                  <Card.Actions>
                    <Button
                      style={styles.button1}
                      onPress={() => handleCall(item.contact)}
                    >
                      {i.t("contact")}
                    </Button>
                    <Button style={styles.button}>{i.t("visit")} </Button>
                  </Card.Actions>
                </Card>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
      <FAB
        icon="plus"
        label={i.t("newPost")}
        style={styles.cartFAB}
        // onPress={() => setFormVisible(true)}
        onPress={() => console.log("Create post clicked")}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  searchContainer: {
    marginBottom: 15,
  },
  newsContainerWrapper: {
    maxHeight: 300,
    marginBottom: 20,
  },
  newsContainer: {
    marginBottom: 10,
  },
  newsCard: {
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
  shgName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  heading: {
    fontSize: 20,
    marginVertical: 10,
    fontWeight: "bold",
    color: "000",
  },
  horizontalScroll: {
    marginBottom: 20,
  },
  card: {
    width: 250,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDate: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  modalDetails: {
    fontSize: 16,
    marginBottom: 20,
  },
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
  communityInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  communityText: {
    marginLeft: 5,
    fontSize: 14,
    color: "grey",
  },

  button: {
    width: "50%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  button1: {
    width: "40%",
    fontSize: 10,
    height: 40,
  },
});
