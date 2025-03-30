import React, { useState } from "react";
import { Text, StyleSheet, View, ScrollView, Modal, TouchableOpacity } from "react-native";
import { Card, Button, Chip, Paragraph, useTheme, TextInput } from "react-native-paper";

export default function Members() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [addMemberVisible, setAddMemberVisible] = useState(false);
  const [scheduleMeetingVisible, setScheduleMeetingVisible] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberLoanBought, setNewMemberLoanBought] = useState("");
  const [newMemberLoanRepaid, setNewMemberLoanRepaid] = useState("");
  const [newMemberSmartphone, setNewMemberSmartphone] = useState(false);

  const members = [
    { id: 1, name: "Maariyamma", loanBought: "₹50,000", loanRepaid: "₹30,000", isSmartphoneUser: true },
    { id: 2, name: "Christina", loanBought: "₹70,000", loanRepaid: "₹50,000", isSmartphoneUser: false },
    { id: 3, name: "Nadia", loanBought: "NIL", loanRepaid: "NIL", isSmartphoneUser: false },
    { id: 4, name: "Bibi", loanBought: "₹10,000", loanRepaid: "₹10,000", isSmartphoneUser: false },
    { id: 5, name: "Nina", loanBought: "₹20,000", loanRepaid: "NIL", isSmartphoneUser: false },
  ];

  const handleViewDetails = (member) => {
    setSelectedMember(member);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMember(null);
  };

  const handleAddMember = () => {
    // Add member logic
    setAddMemberVisible(false);
  };

  const handleScheduleMeeting = () => {
    // Schedule meeting logic
    setScheduleMeetingVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SHG Members</Text>

      <ScrollView>
        <View style={styles.membersContainer}>
          {members.map((member) => (
            <Card key={member.id} style={styles.card}>
              <Card.Title title={member.name} />
              <Card.Content>
                <Paragraph>Loan Bought: {member.loanBought}</Paragraph>
                <Paragraph>Loan Repaid: {member.loanRepaid}</Paragraph>
                <Paragraph>Smartphone User: {member.isSmartphoneUser ? "Yes" : "No"}</Paragraph>
                <Button mode="outlined" onPress={() => handleViewDetails(member)}>View Details</Button>
                <Button mode="outlined" onPress={() => {/* removeMember(member.id) */}} style={styles.removeButton}>Remove</Button>
              </Card.Content>
            </Card>
          ))}
        </View>
      </ScrollView>

      <Button style={styles.button} mode="contained" onPress={() => setAddMemberVisible(true)}>
        Add Member
      </Button>
      <Button style={styles.button} mode="contained" onPress={() => setScheduleMeetingVisible(true)}>
        Schedule Meeting
      </Button>

      {/* Member Details Modal */}
      {selectedMember && (
        <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedMember.name}</Text>
              <Paragraph>Loan Bought: {selectedMember.loanBought}</Paragraph>
              <Paragraph>Loan Repaid: {selectedMember.loanRepaid}</Paragraph>
              <Paragraph>Smartphone User: {selectedMember.isSmartphoneUser ? "Yes" : "No"}</Paragraph>
              <Button style={styles.modalButton} mode="contained" onPress={closeModal}>
                Close
              </Button>
            </View>
          </View>
        </Modal>
      )}

      {/* Add Member Modal */}
      {addMemberVisible && (
        <Modal visible={addMemberVisible} animationType="slide" transparent={true} onRequestClose={() => setAddMemberVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Member</Text>
              <TextInput label="Name" value={newMemberName} onChangeText={setNewMemberName} style={styles.input} />
              <TextInput label="Loan Bought" value={newMemberLoanBought} onChangeText={setNewMemberLoanBought} style={styles.input} />
              <TextInput label="Loan Repaid" value={newMemberLoanRepaid} onChangeText={setNewMemberLoanRepaid} style={styles.input} />
              <View style={styles.smartphoneContainer}>
                <Text>Smartphone User:</Text>
                <Chip
                  selected={newMemberSmartphone}
                  style={styles.chip}
                  onPress={() => setNewMemberSmartphone(!newMemberSmartphone)}
                >
                  {newMemberSmartphone ? "Yes" : "No"}
                </Chip>
              </View>
              <Button style={styles.modalButton} mode="contained" onPress={handleAddMember}>
                Add Member
              </Button>
              <Button style={styles.modalButton} mode="contained" onPress={() => setAddMemberVisible(false)}>
                Cancel
              </Button>
            </View>
          </View>
        </Modal>
      )}

      {/* Schedule Meeting Modal */}
      {scheduleMeetingVisible && (
        <Modal visible={scheduleMeetingVisible} animationType="slide" transparent={true} onRequestClose={() => setScheduleMeetingVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Schedule Meeting</Text>
              <TextInput label="Meeting Date" style={styles.input} />
              <TextInput label="Meeting Time" style={styles.input} />
              <TextInput label="Agenda" style={styles.input} />
              <Button style={styles.modalButton} mode="contained" onPress={handleScheduleMeeting}>
                Schedule
              </Button>
              <Button style={styles.modalButton} mode="contained" onPress={() => setScheduleMeetingVisible(false)}>
                Cancel
              </Button>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  membersContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  card: {
    marginVertical: 10,
  },
  button: {
    marginTop: 15,
    marginBottom: 5,
    paddingVertical: 8,
    alignSelf: "center",
    width: "60%",
  },
  removeButton: {
    marginTop: 10,
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    marginBottom: 10,
  },
  smartphoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  chip: {
    marginLeft: 10,
  },
  modalButton: {
    marginTop: 10,
    paddingVertical: 8,
    alignSelf: "center",
    width: "50%",
  },
});
