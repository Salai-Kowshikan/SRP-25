import React, { useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Text, Button, TextInput, Card } from "react-native-paper";

const VO = () => {
  const [selectedTab, setSelectedTab] = useState("Applied SHGs");
  const [appliedShgs, setAppliedShgs] = useState([
    { id: 1, name: "SHG 1", details: "Details about SHG 1", rejected: false },
    { id: 2, name: "SHG 2", details: "Details about SHG 2", rejected: false },
    { id: 3, name: "SHG 3", details: "Details about SHG 3", rejected: false },
  ]);
  const [existingShgs, setExistingShgs] = useState([
    { id: 1, name: "SHG A", details: "Bookkeeping records of SHG A" },
    { id: 2, name: "SHG B", details: "Bookkeeping records of SHG B" },
    { id: 3, name: "SHG C", details: "Bookkeeping records of SHG C" },
  ]);
  const [selectedShg, setSelectedShg] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [rejectionModalVisible, setRejectionModalVisible] = useState(false);

  const handleApprove = (shgId) => {
    setAppliedShgs(appliedShgs.filter(shg => shg.id !== shgId));
  };

  const handleReject = (shgId) => {
    setAppliedShgs(appliedShgs.filter(shg => shg.id !== shgId));
    setRejectionModalVisible(false);
    setRejectReason("");
  };

  const openRejectionModal = (shgId) => {
    setSelectedShg(shgId);
    setRejectionModalVisible(true);
  };

  const renderAppliedShgs = () => {
    return appliedShgs.map((shg) => (
      <Card key={shg.id} style={styles.card}>
        <TouchableOpacity onPress={() => setSelectedShg(shg.id)}>
          <Card.Content>
            <Text variant="titleLarge">{shg.name}</Text>
            <Text>{shg.details}</Text>
          </Card.Content>
        </TouchableOpacity>
        {selectedShg === shg.id && (
          <View style={styles.actionsContainer}>
            {!rejectionModalVisible && (
              <>
                <Button
                  mode="contained"
                  onPress={() => openRejectionModal(shg.id)}
                  style={[styles.button, styles.rejectButton]}
                >
                  Reject
                </Button>
                <Button
                  mode="contained"
                  onPress={() => handleApprove(shg.id)}
                  style={styles.button}
                >
                  Approve
                </Button>
              </>
            )}
          </View>
        )}
      </Card>
    ));
  };

  const renderRejectionModal = () => (
    <Modal visible={rejectionModalVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <Card style={styles.modalCard}>
          <Card.Content>
            <Text variant="titleMedium">Reason for Rejection</Text>
            <TextInput
              label="Reason"
              value={rejectReason}
              onChangeText={setRejectReason}
              style={styles.textInput}
            />
            <Button
              mode="contained"
              onPress={() => handleReject(selectedShg)}
              style={styles.submitButton}
            >
              Submit
            </Button>
          </Card.Content>
        </Card>
      </View>
    </Modal>
  );

  const renderExistingShgs = () => {
    return existingShgs.map((shg) => (
      <Card key={shg.id} style={styles.card}>
        <TouchableOpacity onPress={() => {setSelectedShg(shg.id); setModalVisible(true);}}>
          <Card.Content>
            <Text variant="titleLarge">{shg.name}</Text>
            <Text>{shg.details}</Text>
          </Card.Content>
        </TouchableOpacity>
      </Card>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <Button
          mode={selectedTab === "Applied SHGs" ? "contained" : "text"}
          onPress={() => setSelectedTab("Applied SHGs")}
          style={styles.tabButton}
        >
          Applied SHGs
        </Button>
        <Button
          mode={selectedTab === "Existing SHGs" ? "contained" : "text"}
          onPress={() => setSelectedTab("Existing SHGs")}
          style={styles.tabButton}
        >
          Existing SHGs
        </Button>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        {selectedTab === "Applied SHGs" ? renderAppliedShgs() : renderExistingShgs()}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <Card style={styles.modalCard}>
            <Card.Content>
              {selectedTab === "Existing SHGs" && (
                <>
                  <Text variant="titleLarge">Bookkeeping Records</Text>
                  <Text>{existingShgs.find((shg) => shg.id === selectedShg)?.details}</Text>
                </>
              )}
              <Button onPress={() => setModalVisible(false)} mode="contained" style={styles.closeButton}>
                Close
              </Button>
            </Card.Content>
          </Card>
        </View>
      </Modal>

      {renderRejectionModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  card: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 4,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  button: {
    marginRight: 8,
    paddingHorizontal: 8,
  },
  rejectButton: {
    backgroundColor: "#BD6E47",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalCard: {
    padding: 16,
    width: "80%",
  },
  textInput: {
    marginBottom: 16,
  },
  submitButton: {
    alignSelf: "center",
    marginTop: 16,
  },
  closeButton: {
    alignSelf: "center",
    marginTop: 16,
  },
});

export default VO;
