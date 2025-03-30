
import api from "@/api/api";
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, FlatList } from 'react-native';
import { Card, Button, SegmentedButtons, TextInput } from 'react-native-paper';
import i from '@/Translations';

const Loan = () => {
  const [selectedTab, setSelectedTab] = useState("ActiveLoans");
  const [expandedLoanId, setExpandedLoanId] = useState(null);
  const [loanAmount, setLoanAmount] = useState("");
  const [loanPurpose, setLoanPurpose] = useState("");
  const [activeLoans, setActiveLoans] = useState([]);

  const applyLoan = async () => {
    const formData = {
      member_id: "shg_001_m1",
      loan_amount: loanAmount,
      purpose: loanPurpose,
    };
    try {
      const response = await api.post("/applyLoan", formData);
      if (response.data.success) {
        setLoanAmount("");
        setLoanPurpose("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLoans = async () => {
    try {
      const response = await api.get("/fetchLoan/shg_001_m1");
      console.log(response.data);
      setActiveLoans(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const renderActiveLoans = () => (
    <FlatList
      data={activeLoans}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <Card style={styles.card} key={item._id}>
          <Card.Content>
            {expandedLoanId === item._id ? (
              <>
                <Text style={styles.loanTitle}>{i.t('LoanAmount')}: {item.amount}</Text>
                <Text>{i.t('purpose')}: {item.purpose}</Text>
                <Text>{i.t('date')}: {item.date}</Text>
                <Button
                  mode="contained"
                  style={styles.repayButton}
                  onPress={() => console.log("Repay loan")}
                >
                  {i.t('repayLoan')}
                </Button>
                <Button
                  mode="text"
                  style={styles.collapseButton}
                  onPress={() => setExpandedLoanId(null)}
                >
                  {i.t('collapse')}
                </Button>
              </>
            ) : (
              <>
                <Text style={styles.loanTitle}>{item.loan_amount}</Text>
                <Button
                  mode="text"
                  style={styles.viewDetailsButton}
                  onPress={() => setExpandedLoanId(item._id)}
                >
                  {i.t('viewDetails')}
                </Button>
              </>
            )}
          </Card.Content>
        </Card>
      )}
      ListEmptyComponent={<Text>No active loans.</Text>}
    />
  );

  const renderApplyLoans = () => (
    <View style={styles.applyContainer}>
      <Text style={styles.title}>{i.t('applyLoans')}</Text>
      <TextInput
        mode="outlined"
        label={i.t('amount')}
        style={styles.input}
        keyboardType="numeric"
        value={loanAmount}
        onChangeText={setLoanAmount}
      />
      <TextInput
        mode="outlined"
        label={i.t('purpose')}
        style={styles.input}
        value={loanPurpose}
        onChangeText={setLoanPurpose}
      />
      <Button
        mode="contained"
        style={styles.submitButton}
        onPress={applyLoan}
      >
        {i.t('submitApplication')}
      </Button>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <SegmentedButtons
          value={selectedTab}
          onValueChange={setSelectedTab}
          buttons={[
            { label: i.t('activeLoans'), value: 'ActiveLoans' },
            { label: i.t('applyLoans'), value: 'ApplyLoans' },
          ]}
        />
      </View>
      {selectedTab === "ActiveLoans" ? renderActiveLoans() : renderApplyLoans()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  topBar: {
    marginBottom: 8,
  },
  card: {
    marginBottom: 20,
    borderRadius: 8,
  },
  loanTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  viewDetailsButton: {
    marginTop: 10,
  },
  repayButton: {
    marginTop: 10,
  },
  collapseButton: {
    marginTop: 10,
  },
  applyContainer: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    marginBottom: 15,
  },
  submitButton: {
    marginTop: 20,
  },
});

export default Loan;
