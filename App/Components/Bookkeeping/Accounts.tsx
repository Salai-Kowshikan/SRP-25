import { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Surface, Text, DataTable, FAB } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import DialogBox from "@/Components/UI/DialogBox";
import api from "@/api/api";
import ExpenditureDialogBox from "./ExpenditureDialogBox";

interface AccountsProps {
  shg_id: string;
}

interface TransactionResponse {
  amount: number;
  id: string;
  other_account: {
    account_number?: string;
    bank: string;
    source?: string;
    vendor?: string;
    customer_name?: string;
    payment_mode?: string;
    transaction_id?: string;
    reference_id?: string;
    invoice_id?: string;
    note?: string;
    to_account?: string;
  };
  shg_id: string;
  t_timestamp: string;
  type: string;
}

const Accounts = ({ shg_id }: AccountsProps) => {
  const [transactions, setTransactions] = useState<
    {
      id: string;
      date: string;
      type: string;
      amount: number;
      details: string;
    }[]
  >([]);
  const [isEmpty, setIsEmpty] = useState(false); // New state to track empty responses

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

  const [isAddExpenditureDialogVisible, setIsAddExpenditureDialogVisible] =
    useState(false);

  const handleAddExpenditure = () => {
    setIsAddExpenditureDialogVisible(true);
  };

  const closeAddExpenditureDialog = () => {
    setIsAddExpenditureDialogVisible(false);
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get<TransactionResponse[]>(
          `/api/transactions/${shg_id}?month=${selectedMonth}&year=${selectedYear}`
        );

        if (response.data.length === 0) {
          setIsEmpty(true);
          setTransactions([]);
        } else {
          setIsEmpty(false);
          const mappedTransactions = response.data.map((transaction) => ({
            id: transaction.id,
            date: transaction.t_timestamp.split(" ")[0],
            type: transaction.type,
            amount: transaction.amount,
            details:
              transaction.other_account.vendor ||
              transaction.other_account.customer_name ||
              transaction.other_account.source ||
              transaction.other_account.note ||
              "N/A",
          }));
          setTransactions(mappedTransactions);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setIsEmpty(true);
      }
    };

    fetchTransactions();
  }, [shg_id, selectedMonth, selectedYear]);

  const filteredTransactions = transactions.filter((transaction) => {
    const [year, month] = transaction.date.split("-");
    return year === selectedYear && month === selectedMonth;
  });

  const revenue = filteredTransactions
    .filter((transaction) => transaction.type === "sales")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const capital = filteredTransactions
    .filter((transaction) => transaction.type === "funds")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const expenditures = filteredTransactions
    .filter((transaction) => transaction.type === "expenditure")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const profit = revenue - expenditures;

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, filteredTransactions.length);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage, selectedMonth, selectedYear]);

  return (
    <>
      <ScrollView
        contentContainerStyle={[styles.scrollContainer, { paddingBottom: 80 }]}
      >
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
            {isEmpty ? (
              <Text style={styles.noDataText}>
                No transactions available for the selected month and year.
              </Text>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <DataTable>
                  <DataTable.Header>
                    <DataTable.Title style={[styles.column, styles.dateColumn]}>
                      Date
                    </DataTable.Title>
                    <DataTable.Title style={[styles.column, styles.typeColumn]}>
                      Type
                    </DataTable.Title>
                    <DataTable.Title
                      numeric
                      style={[styles.column, styles.amountColumn]}
                    >
                      Amount
                    </DataTable.Title>
                    <DataTable.Title
                      style={[styles.column, styles.detailsColumn]}
                    >
                      Details
                    </DataTable.Title>
                  </DataTable.Header>

                  {filteredTransactions.slice(from, to).map((transaction) => (
                    <DataTable.Row key={transaction.id}>
                      <DataTable.Cell
                        style={[styles.column, styles.dateColumn]}
                      >
                        {transaction.date}
                      </DataTable.Cell>
                      <DataTable.Cell
                        style={[styles.column, styles.typeColumn]}
                      >
                        {transaction.type}
                      </DataTable.Cell>
                      <DataTable.Cell
                        numeric
                        style={[styles.column, styles.amountColumn]}
                      >
                        {transaction.amount}
                      </DataTable.Cell>
                      <DataTable.Cell
                        style={[styles.column, styles.detailsColumn]}
                      >
                        <DialogBox
                          title="Transaction Details"
                          trigger="View"
                          content={JSON.stringify(transaction, null, 2)}
                        />
                      </DataTable.Cell>
                    </DataTable.Row>
                  ))}

                  <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.ceil(
                      filteredTransactions.length / itemsPerPage
                    )}
                    onPageChange={(page) => setPage(page)}
                    label={`${from + 1}-${to} of ${
                      filteredTransactions.length
                    }`}
                    numberOfItemsPerPageList={numberOfItemsPerPageList}
                    numberOfItemsPerPage={itemsPerPage}
                    onItemsPerPageChange={setItemsPerPage}
                    showFastPaginationControls
                    selectPageDropdownLabel={"Rows per page"}
                  />
                </DataTable>
              </ScrollView>
            )}
          </Surface>
        </View>
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleAddExpenditure}
        label="Add Expenditure"
      />

      <ExpenditureDialogBox
        visible={isAddExpenditureDialogVisible}
        onClose={closeAddExpenditureDialog}
      />
    </>
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
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
    marginVertical: 20,
  },
  column: {
    paddingHorizontal: 10,
    justifyContent: "space-evenly",
  },
  dateColumn: {
    flex: 2,
    textAlign: "left",
  },
  typeColumn: {
    flex: 2,
    textAlign: "left",
  },
  amountColumn: {
    flex: 1,
    textAlign: "right",
  },
  detailsColumn: {
    flex: 3,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    right: 4,
    bottom: 4,
  },
});

export default Accounts;
