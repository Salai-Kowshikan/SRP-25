import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, TextInput, Button, Checkbox } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "@/api/api";

const Card = ({ children, onAdd, onRemove, disabled }) => (
  <View style={styles.card}>
    {children}
    {onAdd && (
      <Button
        onPress={onAdd}
        style={styles.cardAction}
        mode="outlined"
        disabled={disabled}
      >
        + Add
      </Button>
    )}
    {onRemove && (
      <Button onPress={onRemove} style={styles.cardAction} mode="outlined">
        - Remove
      </Button>
    )}
  </View>
);

function Bookkeeping() {
  const [todayDate, setTodayDate] = useState("");

  const [members, setMembers] = useState([]);

  const [credits, setCredits] = useState([
    { from: "", transaction_id: "", amount: 0 },
  ]);

  const [debits, setDebits] = useState([
    { to: "", transaction_id: "", amount: 0, purpose: "" },
  ]);

  const [expenditures, setExpenditures] = useState([
    { project_id: "", project_name: "", amount: 0 },
  ]);

  const [revenues, setRevenues] = useState([
    { project_id: "", project_name: "", amount: 0 },
  ]);

  const [minutes, setMinutes] = useState("");
  const [currentBalance, setCurrentBalance] = useState("");
  const [attendance, setAttendance] = useState("");
  const [loanRepayments, setLoanRepayments] = useState("");
  const [totalRevenue, setTotalRevenue] = useState("");

  const fetchMembers = async () => {
    try {
      const response = await api.get("/fetchAllMembers");
      console.log(response.data);
      setMembers(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const calculateTotalRevenue = () => {
    const totalCredits = credits.reduce(
      (sum, credit) => sum + parseFloat(credit.amount),
      0
    );
    const totalRevenues = revenues.reduce(
      (sum, revenue) => sum + parseFloat(revenue.amount),
      0
    );
    const totalDebits = debits.reduce(
      (sum, debit) => sum + parseFloat(debit.amount),
      0
    );
    const totalExpenditures = expenditures.reduce(
      (sum, expenditure) => sum + parseFloat(expenditure.amount),
      0
    );

    const rev = totalCredits + totalRevenues - totalDebits - totalExpenditures;
    setTotalRevenue(rev);
  };

  useEffect(() => {
    const date = new Date();
    setTodayDate(date.toDateString());
    fetchMembers();
  }, []);

  useEffect(() => {
    calculateTotalRevenue();
  },[credits, revenues, debits, expenditures]);

  const handleCheckboxChange = (memberId) => {
    setAttendance((prevAttendance) =>
      prevAttendance.includes(memberId)
        ? prevAttendance.filter((member_id) => member_id !== memberId)
        : [...prevAttendance, memberId]
    );
  };

  const calculateAttendancePercentage = () => {
    if (members.length === 0) return 0;
    return ((attendance.length / members.length) * 100).toFixed(2);
  };

  const handleSubmit = async () => {
    const attendancePercentage = calculateAttendancePercentage();
    const bookkeepingRecord = {
      date: todayDate,
      credit: credits,
      debit: debits,
      expenditures,
      revenue: revenues,
      currentBalance: parseFloat(currentBalance),
      attendance,
      minutes_book: minutes,
      attendance_percentage: parseFloat(attendancePercentage),
      loan_repayments: parseFloat(loanRepayments),
      total_revenue: parseFloat(totalRevenue),
    };
    const response = await api.post("/addExpense/shg_001", bookkeepingRecord);
    if (response.data.success) {
      console.log("Record added successfully");
    }
  };

  const addCard = (category) => {
    switch (category) {
      case "credit":
        setCredits([...credits, { from: "", transaction_id: "", amount: "" }]);
        break;
      case "debit":
        setDebits([
          ...debits,
          { to: "", transaction_id: "", amount: "", purpose: "" },
        ]);
        break;
      case "expenditure":
        setExpenditures([
          ...expenditures,
          { project_id: "", project_name: "", amount: "" },
        ]);
        break;
      case "revenue":
        setRevenues([
          ...revenues,
          { project_id: "", project_name: "", amount: "" },
        ]);
        break;
      default:
        break;
    }
  };

  const removeCard = (category, index) => {
    switch (category) {
      case "credit":
        setCredits(credits.filter((_, i) => i !== index));
        break;
      case "debit":
        setDebits(debits.filter((_, i) => i !== index));
        break;
      case "expenditure":
        setExpenditures(expenditures.filter((_, i) => i !== index));
        break;
      case "revenue":
        setRevenues(revenues.filter((_, i) => i !== index));
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={styles.pageLayout}>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text variant="headlineSmall">Bookkeeping Entry for</Text>
        <Text>{todayDate}</Text>

        {credits.map((credit, index) => (
          <Card
            key={index}
            onAdd={() => addCard("credit")}
            onRemove={
              credits.length > 1 ? () => removeCard("credit", index) : null
            }
          >
            <TextInput
              label="Credit From"
              value={credit.from}
              onChangeText={(text) => {
                const newCredits = [...credits];
                newCredits[index].from = text;
                setCredits(newCredits);
              }}
              style={styles.textInput}
            />
            <TextInput
              label="Credit Transaction ID"
              value={credit.transaction_id}
              onChangeText={(text) => {
                const newCredits = [...credits];
                newCredits[index].transaction_id = text;
                setCredits(newCredits);
              }}
              style={styles.textInput}
            />
            <TextInput
              label="Credit Amount"
              value={credit.amount}
              onChangeText={(text) => {
                const newCredits = [...credits];
                newCredits[index].amount = text;
                setCredits(newCredits);
              }}
              style={styles.textInput}
              keyboardType="numeric"
            />
          </Card>
        ))}

        {debits.map((debit, index) => (
          <Card
            key={index}
            onAdd={() => addCard("debit")}
            onRemove={
              debits.length > 1 ? () => removeCard("debit", index) : null
            }
          >
            <TextInput
              label="Debit To"
              value={debit.to}
              onChangeText={(text) => {
                const newDebits = [...debits];
                newDebits[index].to = text;
                setDebits(newDebits);
              }}
              style={styles.textInput}
            />
            <TextInput
              label="Debit Transaction ID"
              value={debit.transaction_id}
              onChangeText={(text) => {
                const newDebits = [...debits];
                newDebits[index].transaction_id = text;
                setDebits(newDebits);
              }}
              style={styles.textInput}
            />
            <TextInput
              label="Debit Amount"
              value={debit.amount}
              onChangeText={(text) => {
                const newDebits = [...debits];
                newDebits[index].amount = text;
                setDebits(newDebits);
              }}
              style={styles.textInput}
              keyboardType="numeric"
            />
            <TextInput
              label="Purpose"
              value={debit.purpose}
              onChangeText={(text) => {
                const newDebits = [...debits];
                newDebits[index].purpose = text;
                setDebits(newDebits);
              }}
              style={styles.textInput}
            />
          </Card>
        ))}

        {expenditures.map((expenditure, index) => (
          <Card
            key={index}
            onAdd={() => addCard("expenditure")}
            onRemove={
              expenditures.length > 1
                ? () => removeCard("expenditure", index)
                : null
            }
          >
            <TextInput
              label="Expenditure Project ID"
              value={expenditure.project_id}
              onChangeText={(text) => {
                const newExpenditures = [...expenditures];
                newExpenditures[index].project_id = text;
                setExpenditures(newExpenditures);
              }}
              style={styles.textInput}
            />
            <TextInput
              label="Expenditure Project Name"
              value={expenditure.project_name}
              onChangeText={(text) => {
                const newExpenditures = [...expenditures];
                newExpenditures[index].project_name = text;
                setExpenditures(newExpenditures);
              }}
              style={styles.textInput}
            />
            <TextInput
              label="Expenditure Amount"
              value={expenditure.amount}
              onChangeText={(text) => {
                const newExpenditures = [...expenditures];
                newExpenditures[index].amount = text;
                setExpenditures(newExpenditures);
              }}
              style={styles.textInput}
              keyboardType="numeric"
            />
          </Card>
        ))}

        {revenues.map((revenue, index) => (
          <Card
            key={index}
            onAdd={() => addCard("revenue")}
            onRemove={
              revenues.length > 1 ? () => removeCard("revenue", index) : null
            }
          >
            <TextInput
              label="Revenue Project ID"
              value={revenue.project_id}
              onChangeText={(text) => {
                const newRevenues = [...revenues];
                newRevenues[index].project_id = text;
                setRevenues(newRevenues);
              }}
              style={styles.textInput}
            />
            <TextInput
              label="Revenue Project Name"
              value={revenue.project_name}
              onChangeText={(text) => {
                const newRevenues = [...revenues];
                newRevenues[index].project_name = text;
                setRevenues(newRevenues);
              }}
              style={styles.textInput}
            />
            <TextInput
              label="Revenue Amount"
              value={revenue.amount}
              onChangeText={(text) => {
                const newRevenues = [...revenues];
                newRevenues[index].amount = text;
                setRevenues(newRevenues);
              }}
              style={styles.textInput}
              keyboardType="numeric"
            />
          </Card>
        ))}

        <TextInput
          label="Minutes of the meeting"
          value={minutes}
          onChangeText={setMinutes}
          style={styles.textInput}
          multiline={true}
        />
        <TextInput
          label="Current Balance"
          value={currentBalance}
          onChangeText={setCurrentBalance}
          style={styles.textInput}
          keyboardType="numeric"
        />
        <Text>Attendance</Text>
        <View style={styles.attendance}>
          {members.map((member) => (
            <View key={member._id} style={styles.checkboxContainer}>
              <Checkbox
                status={
                  attendance.includes(member.member_id) ? "checked" : "unchecked"
                }
                onPress={() => handleCheckboxChange(member.member_id)}
              />
              <Text>{member.name}</Text>
            </View>
          ))}
        </View>

        <TextInput
          label="Loan Repayments"
          value={loanRepayments}
          onChangeText={setLoanRepayments}
          style={styles.textInput}
          keyboardType="numeric"
        />

        <Text>Total Revenue: {totalRevenue}</Text>

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
        >
          Submit
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pageLayout: {
    flex: 1,
  },
  formContainer: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 20,
  },
  textInput: {
    width: "80%",
    margin: 10,
    borderRadius: 5,
  },
  submitButton: {
    marginTop: 20,
    width: "60%",
  },
  card: {
    width: "80%",
    padding: 15,
    borderRadius: 15,
    backgroundColor: "#f8f8f8",
    marginVertical: 10,
    elevation: 3,
  },
  cardAction: {
    marginTop: 10,
  },
  cardActionText: {
    fontWeight: "bold",
  },
  checkboxContainer: {
    flexDirection: "row",
    marginVertical: 5,
    alignItems: "center",
    gap: 5,
  },
  attendance: {
    width: "80%",
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
});

export default Bookkeeping;
