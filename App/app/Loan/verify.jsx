import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Modal, TouchableOpacity } from "react-native";
import { Text, Card, Button, Paragraph, useTheme } from "react-native-paper";

export default function VerifyLoans() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [activeTab, setActiveTab] = useState('requests');
  const [requestLoans, setRequestLoans] = useState([
    { id: '1', userName: 'Maariyamma', loanAmount: '₹50,000', purpose: 'Agriculture', status: 'Pending' },
    { id: '2', userName: 'Christina', loanAmount: '₹70,000', purpose: 'Health', status: 'Pending' },
  ]);
  const [pastLoans, setPastLoans] = useState([
    { id: '3', userName: 'Nadia', loanAmount: '₹40,000', purpose: 'Education', status: 'Approved' },
    { id: '4', userName: 'Bibi', loanAmount: '₹60,000', purpose: 'Healthcare', status: 'Approved' },
  ]);

  const handleViewDetails = (loan) => {
    setSelectedLoan(loan);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedLoan(null);
  };

  const handleAccept = (id) => {
    // Logic to accept the loan
    setRequestLoans(requestLoans.filter(loan => loan.id !== id));
    closeModal();
  };

  const handleReject = (id) => {
    // Logic to reject the loan
    setRequestLoans(requestLoans.filter(loan => loan.id !== id));
    closeModal();
  };

  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <Button
          style={[styles.tabButton, activeTab === 'requests' && styles.activeTab]}
          mode="contained"
          onPress={() => setActiveTab('requests')}
        >
          Requests
        </Button>
        <Button
          style={[styles.tabButton, activeTab === 'past' && styles.activeTab]}
          mode="contained"
          onPress={() => setActiveTab('past')}
        >
          Past/Active Loans
        </Button>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {activeTab === 'requests' && (
          <View>
            {requestLoans.map((loan) => (
              <Card key={loan.id} style={styles.card}>
                <Card.Title title={loan.userName} />
                <Card.Content>
                  <Paragraph>Loan Amount: {loan.loanAmount}</Paragraph>
                  <Paragraph>Purpose: {loan.purpose}</Paragraph>
                  <View style={styles.buttonContainer}>
                    <Button
                      mode="contained"
                      style={styles.rejectButton}
                      onPress={() => handleReject(loan.id)}
                    >
                      Reject
                    </Button>
                    <Button
                      mode="contained"
                      style={styles.acceptButton}
                      onPress={() => handleAccept(loan.id)}
                    >
                      Accept
                    </Button>
                  </View>
                  <Button
                    mode="outlined"
                    onPress={() => handleViewDetails(loan)}
                  >
                    View Details
                  </Button>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}

        {activeTab === 'past' && (
          <View>
            {pastLoans.map((loan) => (
              <Card key={loan.id} style={styles.card}>
                <Card.Title title={loan.userName} />
                <Card.Content>
                  <Paragraph>Loan Amount: {loan.loanAmount}</Paragraph>
                  <Paragraph>Purpose: {loan.purpose}</Paragraph>
                  <Paragraph>Status: {loan.status}</Paragraph>
                  <Button
                    mode="outlined"
                    onPress={() => handleViewDetails(loan)}
                  >
                    View Details
                  </Button>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>

      {selectedLoan && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Loan Details</Text>
              <Paragraph>User Name: {selectedLoan.userName}</Paragraph>
              <Paragraph>Loan Amount: {selectedLoan.loanAmount}</Paragraph>
              <Paragraph>Purpose: {selectedLoan.purpose}</Paragraph>
              <Paragraph>Status: {selectedLoan.status}</Paragraph>
              <Button mode="contained" onPress={closeModal} style={styles.modalButton}>
                Close
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: '#5B1F04',
  },
  scrollContainer: {
    flex: 1,
  },
  card: {
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  acceptButton: {
    marginRight: 10,
  },
  rejectButton: {
    backgroundColor: '#d32f2f',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButton: {
    marginTop: 20,
  },
});
