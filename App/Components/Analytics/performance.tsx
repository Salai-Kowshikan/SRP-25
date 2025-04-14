import React, { useEffect } from "react";
import { View, Dimensions } from "react-native";
import { useTheme, Surface, Text } from "react-native-paper";
import { BarChart } from "react-native-chart-kit";
import { Picker } from "@react-native-picker/picker";
import { usePerformanceStore } from "@/stores/performanceStore";

const months = [
  { label: "January", value: "1" },
  { label: "February", value: "2" },
  { label: "March", value: "3" },
  { label: "April", value: "4" },
  { label: "May", value: "5" },
  { label: "June", value: "6" },
  { label: "July", value: "7" },
  { label: "August", value: "8" },
  { label: "September", value: "9" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => ({
  label: (currentYear - i).toString(),
  value: (currentYear - i).toString(),
}));

const Performance = () => {
  const theme = useTheme();
  const {
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
    fetchPerformanceData,
    revenue,
    capital,
    expenditures,
    profit,
  } = usePerformanceStore();

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchPerformanceData();
    }
  }, [selectedMonth, selectedYear]);

  const chartData = {
    labels: ["Revenue", "Expenditure", profit < 0 ? "Loss" : "Profit", "Capital"],
    datasets: [
      {
        data: [revenue, expenditures, Math.abs(profit), capital],
      },
    ],
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Picker
        selectedValue={selectedMonth}
        onValueChange={(value) => setSelectedMonth(value)}
        style={{ height: 50, marginBottom: 15 }}
      >
        <Picker.Item label="Select month" value={null} />
        {months.map((month) => (
          <Picker.Item key={month.value} label={month.label} value={month.value} />
        ))}
      </Picker>

      <Picker
        selectedValue={selectedYear}
        onValueChange={(value) => setSelectedYear(value)}
        style={{ height: 50, marginBottom: 15 }}
      >
        <Picker.Item label="Select year" value={null} />
        {years.map((year) => (
          <Picker.Item key={year.value} label={year.label} value={year.value} />
        ))}
      </Picker>

      <Surface style={styles.statsbox} elevation={4} mode="flat">
        <Text>Revenue: ₹{revenue.toLocaleString("en-IN")}</Text>
        <Text>Capital: ₹{capital.toLocaleString("en-IN")}</Text>
        <Text>Expenditure: ₹{expenditures.toLocaleString("en-IN")}</Text>
        <Text>
          {profit >= 0 ? "Profit" : "Loss"}: ₹{Math.abs(profit).toLocaleString("en-IN")}
        </Text>
      </Surface>

      <BarChart
        data={chartData}
        width={Dimensions.get("window").width - 32}
        height={250}
        fromZero
        withCustomBarColorFromData
        showValuesOnTopOfBars
        yAxisLabel="₹"
        yAxisSuffix=""
        chartConfig={{
          backgroundGradientFrom: theme.colors.surface,
          backgroundGradientTo: theme.colors.surface,
          color: (opacity = 1) => theme.colors.primary,
          labelColor: () => theme.colors.onSurface,
          barPercentage: 0.5,
        }}
      />
    </View>
  );
};

const styles = {
  statsbox: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
};

export default Performance;
