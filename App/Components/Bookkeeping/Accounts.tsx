import { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Surface, Text, DataTable } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";

const Accounts = () => {
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([5, 10, 15]);
  const [itemsPerPage, setItemsPerPage] = useState(numberOfItemsPerPageList[0]);

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    String(currentDate.getMonth() + 1).padStart(2, "0")
  );
  const [selectedYear, setSelectedYear] = useState(
    String(currentDate.getFullYear())
  ); 

  const [transactions] = useState([
    { key: 1, date: "2025-03-01", from: "Investor A", to: "Business", type: "Capital", amount: 14000 },
    { key: 2, date: "2025-03-02", from: "Customer X", to: "Business", type: "Sales", amount: 5000 },
    { key: 3, date: "2025-03-03", from: "Business", to: "Supplier Y", type: "Expenditure", amount: 2000 },
    { key: 4, date: "2025-03-04", from: "Investor B", to: "Business", type: "Capital", amount: 10000 },
    { key: 5, date: "2025-03-05", from: "Customer Y", to: "Business", type: "Sales", amount: 7000 },
    { key: 6, date: "2025-03-06", from: "Business", to: "Supplier Z", type: "Expenditure", amount: 3000 },
    { key: 7, date: "2025-02-15", from: "Investor C", to: "Business", type: "Capital", amount: 8000 },
    { key: 8, date: "2025-02-20", from: "Customer Z", to: "Business", type: "Sales", amount: 6000 },
    { key: 9, date: "2025-01-10", from: "Investor D", to: "Business", type: "Capital", amount: 12000 },
    { key: 10, date: "2025-01-15", from: "Customer W", to: "Business", type: "Sales", amount: 4000 },
  ]);

  const filteredTransactions = transactions.filter((transaction) => {
    const [year, month] = transaction.date.split("-");
    return year === selectedYear && month === selectedMonth;
  });

  const revenue = filteredTransactions
    .filter((transaction) => transaction.type === "Sales")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const capital = filteredTransactions
    .filter((transaction) => transaction.type === "Capital")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const expenditures = filteredTransactions
    .filter((transaction) => transaction.type === "Expenditure")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const profit = revenue - expenditures;

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, filteredTransactions.length);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage, selectedMonth, selectedYear]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Surface style={styles.filterSection} elevation={4} mode="flat">
          <Text style={styles.filterTitle}>Filter Transactions</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedMonth}
              onValueChange={(itemValue) => setSelectedMonth(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="January" value="01" />
              <Picker.Item label="February" value="02" />
              <Picker.Item label="March" value="03" />
              <Picker.Item label="April" value="04" />
              <Picker.Item label="May" value="05" />
              <Picker.Item label="June" value="06" />
              <Picker.Item label="July" value="07" />
              <Picker.Item label="August" value="08" />
              <Picker.Item label="September" value="09" />
              <Picker.Item label="October" value="10" />
              <Picker.Item label="November" value="11" />
              <Picker.Item label="December" value="12" />
            </Picker>
            <Picker
              selectedValue={selectedYear}
              onValueChange={(itemValue) => setSelectedYear(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="2025" value="2025" />
              <Picker.Item label="2024" value="2024" />
              <Picker.Item label="2023" value="2023" />
            </Picker>
          </View>
        </Surface>

        <Surface style={styles.summary} elevation={4} mode="flat">
          <Text style={styles.summaryText}>Revenue: {revenue}</Text>
          <Text style={styles.summaryText}>Capital: {capital}</Text>
          <Text style={styles.summaryText}>Profit: {profit}</Text>
        </Surface>

        <Surface style={styles.filters} elevation={4} mode="flat">
          <Text style={styles.title}>Transactions</Text>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Date</DataTable.Title>
              <DataTable.Title>From</DataTable.Title>
              <DataTable.Title>To</DataTable.Title>
              <DataTable.Title>Type</DataTable.Title>
              <DataTable.Title numeric>Amount</DataTable.Title>
            </DataTable.Header>

            {filteredTransactions.slice(from, to).map((transaction) => (
              <DataTable.Row key={transaction.key}>
                <DataTable.Cell>{transaction.date}</DataTable.Cell>
                <DataTable.Cell>{transaction.from}</DataTable.Cell>
                <DataTable.Cell>{transaction.to}</DataTable.Cell>
                <DataTable.Cell>{transaction.type}</DataTable.Cell>
                <DataTable.Cell numeric>{transaction.amount}</DataTable.Cell>
              </DataTable.Row>
            ))}

            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(filteredTransactions.length / itemsPerPage)}
              onPageChange={(page) => setPage(page)}
              label={`${from + 1}-${to} of ${filteredTransactions.length}`}
              numberOfItemsPerPageList={numberOfItemsPerPageList}
              numberOfItemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
              showFastPaginationControls
              selectPageDropdownLabel={"Rows per page"}
            />
          </DataTable>
        </Surface>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
  },
  filterSection: {
    padding: 10,
    borderRadius: 6,
    marginBottom: 20,
    backgroundColor: "white",
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  picker: {
    flex: 1,
    marginHorizontal: 5,
  },
  summary: {
    padding: 10,
    borderRadius: 6,
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  filters: {
    padding: 10,
    borderRadius: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default Accounts;