import React from "react";
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { useTheme } from "react-native-paper";

interface PerformanceProps {
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  chartData: {
    labels: string[];
    datasets: {
      data: number[];
      colors?: ((opacity: number) => string)[];
    }[];
  };
  revenue: number;
  capital: number;
  expenditures: number;
  profit: number;
}

const months = [
  { id: "01", name: "Jan" }, { id: "02", name: "Feb" }, { id: "03", name: "Mar" },
  { id: "04", name: "Apr" }, { id: "05", name: "May" }, { id: "06", name: "Jun" },
  { id: "07", name: "Jul" }, { id: "08", name: "Aug" }, { id: "09", name: "Sep" },
  { id: "10", name: "Oct" }, { id: "11", name: "Nov" }, { id: "12", name: "Dec" }
];

const Performance: React.FC<PerformanceProps> = ({
  selectedMonth,
  setSelectedMonth,
  chartData,
  revenue,
  capital,
  expenditures,
  profit,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.heading, { color: theme.colors.onBackground }]}>
        {months.find(m => m.id === selectedMonth)?.name} Performance
      </Text>

      <FlatList
        data={months}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.monthItem,
              selectedMonth === item.id && {
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.primary,
              },
            ]}
            onPress={() => setSelectedMonth(item.id)}
          >
            <Text style={[
              styles.monthText,
              selectedMonth === item.id && { color: theme.colors.onPrimary }
            ]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.monthPicker}
      />

      <BarChart
        data={chartData}
        width={Dimensions.get("window").width - 32}
        height={220}
        yAxisLabel="₹"
        yAxisSuffix=""
        fromZero
        chartConfig={{
          backgroundColor: theme.colors.surface,
          backgroundGradientFrom: theme.colors.surface,
          backgroundGradientTo: theme.colors.surfaceVariant,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => theme.colors.onSurface,
          barPercentage: 0.5,
          propsForBackgroundLines: {
            strokeWidth: 0
          },
          style: {
            borderRadius: 16,
          },
        }}
        style={styles.chart}
      />

      <View style={[styles.summary, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.summaryText, { color: theme.colors.onSurface }]}>
          Revenue: ₹{revenue.toLocaleString('en-IN')}
        </Text>
        <Text style={[styles.summaryText, { color: theme.colors.onSurface }]}>
          Capital: ₹{capital.toLocaleString('en-IN')}
        </Text>
        <Text style={[styles.summaryText, { color: theme.colors.onSurface }]}>
          Expenditure: ₹{expenditures.toLocaleString('en-IN')}
        </Text>
        <Text style={[
          styles.summaryText, 
          { color: profit >= 0 ? '#4CAF50' : '#F44336', fontWeight: 'bold' }
        ]}>
          Profit: ₹{profit.toLocaleString('en-IN')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  monthPicker: {
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  monthItem: {
    padding: 10,
    marginHorizontal: 4,
    borderWidth: 1,
    borderRadius: 8,
    minWidth: 50,
    alignItems: 'center',
  },
  monthText: {
    fontSize: 14,
  },
  chart: {
    marginVertical: 16,
    borderRadius: 16,
  },
  summary: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  summaryText: {
    fontSize: 16,
  },
});

export default Performance;