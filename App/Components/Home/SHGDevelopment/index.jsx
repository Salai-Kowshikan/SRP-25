import React, { useState } from "react";
import { Text, StyleSheet, View, ScrollView, Modal } from "react-native";
import { Card, Button, Chip, Paragraph, useTheme } from "react-native-paper";
import { Linking } from "react-native";
import i from "@/Translations";

export default function SHGDevelopment() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [flagPrivateBank, setFlagPrivateBank] = useState(false);
  const [flagGovt, setFlagGovt] = useState(true);
  const theme = useTheme();

  const openURL = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't load page", err)
    );
  };

  const LearningProgramme = [
    {
      title: "Training programs for SHG",
      subtitle: "Government Schemes",
      url: "https://www.sftindia.in/training-programs-for-shgs/",
      desc: "The Deendayal Antyodaya Yojana – National Rural Livelihoods Mission (DAY-NRLM) is making a difference in the lives of over 6.9 crore rural households across 698 districts, 6000 blocks, 2.5 lakh Gram Panchayats, and 6 lakh villages in the country.",
    },
    {
      title: "Learning Programme",
      subtitle: "by pmgdisha",
      url: "https://www.pmgdisha.in/",
      desc: "Pradhan Mantri Gramin Digital Saksharta Abhiyan (PMGDISHA) aims to make six crore persons in rural areas, across States/UTs, digitally literate, reaching around 40% of rural households by covering one member from every eligible household.",
    },
  ];

  const govt_schemes = [
    {
      title: "DAY-NRLM",
      subtitle: "Deendayal Antyodaya Yojana – National Rural Livelihoods Mission",
      url: "https://nrlm.gov.in/outerReportAction.do?methodName=showIndex#gsc.tab=0",
      desc: "The Deendayal Antyodaya Yojana – National Rural Livelihoods Mission (DAY-NRLM) is making a difference in the lives of over 6.9 crore rural households across 698 districts, 6000 blocks, 2.5 lakh Gram Panchayats, and 6 lakh villages in the country.",
    },
    {
      title: "PMGDISHA",
      subtitle: "Pradhan Mantri Gramin Digital Saksharta Abhiyan",
      url: "https://www.pmgdisha.in/",
      desc: "Pradhan Mantri Gramin Digital Saksharta Abhiyan (PMGDISHA) aims to make six crore persons in rural areas, across States/UTs, digitally literate, reaching around 40% of rural households by covering one member from every eligible household.",
    },
    {
      title: "PMAY",
      subtitle: "Pradhan Mantri Awas Yojana",
      url: "https://pmaymis.gov.in/",
      desc: "Pradhan Mantri Awas Yojana (PMAY) aims to provide affordable housing to the urban poor with a target of building 20 million affordable houses by 31 March 2022.",
    },
  ];

  const private_banks = [
    {
      title: "HDFC Bank",
      subtitle: "HDFC Bank offers various schemes for SHG Development",
      url: "https://www.hdfcbank.com/",
      desc: "HDFC Bank offers various schemes for SHG Development",
    },
    {
      title: "ICICI Bank",
      subtitle: "ICICI Bank offers various schemes for SHG Development",
      url: "https://www.icicibank.com/",
      desc: "ICICI Bank offers various schemes for SHG Development",
    },
  ];

  const handleViewDetails = (scheme) => {
    setSelectedScheme(scheme);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedScheme(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.head1}>{i.t('upcomingLearning')}</Text>

      <ScrollView>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={styles.learncontainer}>
            {LearningProgramme.map((scheme, index) => (
              <Card key={index} style={styles.card}>
                <Card.Title title={scheme.title} subtitle={scheme.subtitle} />
                <Card.Content>
                  <Button
                    mode="outlined"
                    onPress={() => handleViewDetails(scheme)}
                  >
                    {i.t('viewDetails')}
                  </Button>
                </Card.Content>
              </Card>
            ))}
          </View>
        </ScrollView>

        <Text style={styles.head1}>{i.t('schemes')}</Text>
        <View style={styles.chipFlex}>
          <Chip
            selected={flagGovt}
            selectedColor="white"
            style={[
              styles.chip,
              flagGovt ? { backgroundColor: theme.colors.primary } : { backgroundColor: theme.colors.primaryContainer },
            ]}
            onPress={() => setFlagGovt(!flagGovt)}
            textStyle={{ color: flagGovt ? "white" : theme.colors.text }}
          >
            {i.t('govt')}
          </Chip>
          <Chip
            selected={flagPrivateBank}
            selectedColor="white"
            style={[
              styles.chip,
              flagPrivateBank ? { backgroundColor: theme.colors.primary } : { backgroundColor: theme.colors.primaryContainer },
            ]}
            onPress={() => setFlagPrivateBank(!flagPrivateBank)}
            textStyle={{ color: flagPrivateBank ? "white" : theme.colors.text }}
          >
            {i.t('privateBanks')}
          </Chip>
        </View>

        {flagGovt &&
          govt_schemes.map((scheme, index) => (
            <Card key={index} style={styles.card}>
              <Card.Title title={scheme.title} subtitle={scheme.subtitle} />
              <Card.Content>
                <Button
                  style={styles.cardButton}
                  mode="contained"
                  onPress={() => handleViewDetails(scheme)}
                >
                  {i.t('viewDetails')}
                </Button>
              </Card.Content>
            </Card>
          ))}

        {flagPrivateBank &&
          private_banks.map((scheme, index) => (
            <Card key={index} style={styles.card}>
              <Card.Title title={scheme.title} subtitle={scheme.subtitle} />
              <Card.Content>
                <Button
                  style={styles.cardButton}
                  mode="contained"
                  onPress={() => handleViewDetails(scheme)}
                >
                  {i.t('viewDetails')}
                </Button>
              </Card.Content>
            </Card>
          ))}
      </ScrollView>

      {selectedScheme && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedScheme.title}</Text>
              <Text style={styles.modalSubtitle}>
                {selectedScheme.subtitle}
              </Text>
              <Paragraph style={styles.modalDescription}>
                {selectedScheme.desc}
              </Paragraph>
              <Button
                mode="contained"
                onPress={() => openURL(selectedScheme.url)}
                style={styles.modalButton}
              >
                {i.t('visitSite')}
              </Button>
              <Button style={styles.modalClose} onPress={closeModal}>
                {i.t('close')}
              </Button>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  learncontainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  head1: {
    color: "black",
    fontSize: 20,
    textAlign: "left",
    paddingBottom: 10,
    fontWeight: "bold",
  },
  card: {
    marginVertical: 10,
  },
  cardButton: {
    width: "65%",
    alignSelf: "center",
  },
  chipFlex: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  chip: {
    width: "fit-content",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButton: {
    width: "70%",
    alignSelf: "center",
    marginBottom: 20,
  },
  modalClose: {
    width: "70%",
    alignSelf: "center",
  },
});

