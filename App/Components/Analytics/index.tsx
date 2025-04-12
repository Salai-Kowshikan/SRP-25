import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import Performance from "@/Components/Analytics/performance";
import Sales from "@/Components/Analytics/sales"; 
import { calculatePerformance, getChartData } from "@/utils/calculatePerformance";

const Analytics = () => {
  const [selectedMonth, setSelectedMonth] = useState("01");
  const [tab, setTab] = useState("performance");
  const shgId = "101";

  const { revenue, capital, expenditures, profit } = calculatePerformance(shgId, selectedMonth);
  const chartData = getChartData(shgId, selectedMonth);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.segmentedButtons}>
        <SegmentedButtons
          value={tab}
          onValueChange={setTab}
          buttons={[
            { value: "performance", label: "Performance", icon: "chart-line" },
            { value: "sales", label: "sales", icon: "cash" },
          ]}
        />
      </View>

      {tab === "performance" && (
        <Performance
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          chartData={chartData}
          revenue={revenue}
          capital={capital}
          expenditures={expenditures}
          profit={profit}
        />
      )}
      {tab === "sales" && <Sales />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
});

export default Analytics;