import { View, ScrollView } from "react-native";
import { useState } from "react";
import { Text, Surface, Button } from "react-native-paper";
import i from "@/Translations";

function CashBook({ records }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <>
      <View>
        <ScrollView>
          {Object.keys(records).map((date, index) => (
            <View key={index}>
              <Button
                onPress={() => {
                  expanded === index ? setExpanded(null) : setExpanded(index);
                }}
                icon={expanded === index ? "chevron-up" : "chevron-down"}
              >
                {date}
              </Button>
              <View style={styles.cardContainer}>
                {expanded === index && (
                  <>
                    {records[date].credit.map((credit, creditIndex) => (
                      <Surface key={creditIndex} style={styles.creditContainer}>
                        <Text>{i.t('from')}: {credit.from}</Text>
                        <Text>{i.t('transaction')} ID: {credit.transaction_id}</Text>
                        <Text>{i.t('amount')}: {credit.amount}</Text>
                      </Surface>
                    ))}
                    {records[date].debit.map((debit, debitIndex) => (
                      <Surface key={debitIndex} style={styles.debitContainer}>
                        <Text>{i.t('to')}: {debit.to}</Text>
                        <Text>{i.t('transaction')} ID: {debit.transaction_id}</Text>
                        <Text>{i.t('amount')}: {debit.amount}</Text>
                      </Surface>
                    ))}
                    {records[date].expenditures.map(
                      (expenditure, expenditureIndex) => (
                        <Surface
                          key={expenditureIndex}
                          style={styles.debitContainer}
                        >
                          <Text>{i.t('project')} ID: {expenditure.project_id}</Text>
                          <Text>{i.t('projectName')}: {expenditure.project_name}</Text>
                          <Text>{i.t('amount')}: {expenditure.amount}</Text>
                        </Surface>
                      )
                    )}
                    {records[date].revenue.map((revenue, revenueIndex) => (
                      <Surface
                        key={revenueIndex}
                        style={styles.creditContainer}
                      >
                        <Text>{i.t('project')} ID: {revenue.project_id}</Text>
                        <Text>{i.t('projectName')} : {revenue.project_name}</Text>
                        <Text>{i.t('amount')}: {revenue.amount}</Text>
                      </Surface>
                    ))}
                  </>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = {
  creditContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 4,
    elevation: 2,
    backgroundColor: "#d3f2db",
  },
  debitContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 4,
    elevation: 2,
    backgroundColor: "#f2d3d3",
  },
  cardContainer: {
    padding: 10,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
};

export default CashBook;
