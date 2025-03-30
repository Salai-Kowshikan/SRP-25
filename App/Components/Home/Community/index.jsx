import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Linking } from "react-native";
import {
  Text,
  Card,
  Searchbar,
  Button,
  Avatar,
  Modal,
  Portal,
} from "react-native-paper";
import api from "@/api/api";

function Community() {
  const [visible, setVisible] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [shgData, setShgData] = useState([]);

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
    }
  ];

  async function fetchShgData() {
    //console.log(api.defaults.baseURL + "/fetchAllShg");
    try {
      let response = await api.get("/fetchAllShg");
      //console.log(response.data);
      setShgData(response.data);
    } catch (error) {
      console.error("Error fetching SHG data:", error);
    }
  }

  useEffect(() => {
    fetchShgData();
  }, []);

  const ngoData = [
    {
      name: "Helping Hands NGO",
      resources: "Financial Aid, Training Programs",
      contact: "0987654321",
      avatar:
        "https://images.pexels.com/photos/3541916/pexels-photo-3541916.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      name: "Growth Foundation",
      contact: "0123456789",
      resources: "Microfinance, Skill Development",
      avatar: "https://picsum.photos/100/100",
    },
  ];

  const showModal = (news) => {
    setSelectedNews(news);
    setVisible(true);
  };
  function handleCall(contact) {
    const url = `tel:${contact}`;
    Linking.openURL(url).catch((err) =>
      console.error("Error opening dialer", err)
    );
  }

  const hideModal = () => {
    setVisible(false);
    setSelectedNews(null);
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.searchContainer}>
          <Searchbar placeholder="Search SHGs or NGOs" />
        </View>
        <Text style={styles.heading}>Recent Activities</Text>
        <View style={styles.newsContainerWrapper}>
          <ScrollView style={styles.newsContainer} nestedScrollEnabled={true}>
            {recentActivities.map((activity, index) => (
              <Card
                key={index}
                style={styles.newsCard}
                onPress={() => showModal(activity)}
              >
                <Card.Content>
                  <Text style={styles.date}>{activity.date}</Text>
                  <Text style={styles.shgName}>{activity.shgName}</Text>
                  <Text>{activity.description}</Text>
                </Card.Content>
              </Card>
            ))}
          </ScrollView>
        </View>
        <Text style={styles.heading}>Self Help Groups</Text>
        <ScrollView horizontal style={styles.horizontalScroll}>
          {shgData.map((shg) => (
            <Card key={shg.shg_id} style={styles.card}>
              <Card.Title
                title={shg.name}
                subtitle={shg.location}
                left={(props) => (
                  <Avatar.Image {...props} source={{ uri: shg.img }} />
                )}
              />
              <Card.Actions>
                <Button onPress={() => handleCall(shg.contact)}>Contact</Button>
              </Card.Actions>
            </Card>
          ))}
        </ScrollView>
        <Text style={styles.heading}>NGOs</Text>
        <ScrollView horizontal style={styles.horizontalScroll}>
          {ngoData.map((ngo, index) => (
            <Card key={index} style={styles.card}>
              <Card.Title
                title={ngo.name}
                subtitle={ngo.resources}
                left={(props) => (
                  <Avatar.Image {...props} source={{ uri: ngo.avatar }} />
                )}
              />
              <Card.Actions>
                <Button  onPress={() => handleCall(ngo.contact)}>Contact</Button>
              </Card.Actions>
            </Card>
          ))}
        </ScrollView>
      </ScrollView>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>{selectedNews?.shgName}</Text>
          <Text style={styles.modalDate}>{selectedNews?.date}</Text>
          <Text style={styles.modalDetails}>{selectedNews?.details}</Text>
          <Button onPress={hideModal}>Close</Button>
        </Modal>
      </Portal>
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
    maxHeight: 250,
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
    marginRight: 15,
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
});

export default Community;
