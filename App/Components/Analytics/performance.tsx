import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useTheme } from "@react-navigation/native";
import { BarChart } from "react-native-chart-kit";
import axios from "axios";
import RNPickerSelect from "react-native-picker-select";

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

interface PerformanceProps {
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  chartData: {
    labels: string[];
    datasets: {
      data: number[];
      colors: ((opacity?: number) => string)[];
    }[];
  };
  revenue: number;
  capital: number;
  expenditures: number;
  profit: number;
}

const Performance: React.FC<PerformanceProps> = ({
  selectedMonth,
  setSelectedMonth,
}) => {
  const theme = useTheme();
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [revenue, setRevenue] = useState(0);
  const [capital, setCapital] = useState(0);
  const [expenditures, setExpenditures] = useState(0);
  const [profit, setProfit] = useState(0);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const res = await axios.get("http://192.168.1.4:5000/analysis", {
          params: {
            month: parseInt(selectedMonth),
            year: parseInt(selectedYear),
          },
        });

        const data = res.data.summary;
        setRevenue(data.total_revenue);
        setCapital(data.total_funds_received);
        setExpenditures(data.total_expenditure);
        setProfit(data.net_profit);
      } catch (err) {
        console.error("Failed to fetch performance data:", err);
      }
    };

    if (selectedMonth && selectedYear) {
      fetchPerformanceData();
    }
  }, [selectedMonth, selectedYear]);

  const chartData = {
    labels: ["Revenue", "Expenditure", profit < 0 ? "Loss" : "Profit", "Capital"],
    datasets: [
      {
        data: [
          revenue,
          expenditures,
          Math.abs(profit),
          capital,
        ],
      },
    ],
  };

  return (
    <View >
  
      <Text>
      Select Month:
      </Text>
      <RNPickerSelect
      onValueChange={setSelectedMonth}
      items={months}
      placeholder={{ label: "Select month", value: null }}
     
      value={selectedMonth}
      />

      
      <Text >
      Select Year:
      </Text>
      <RNPickerSelect
      onValueChange={setSelectedYear}
      items={years}
      placeholder={{ label: "Select year", value: null }}
      
      value={selectedYear}
      />

   
    <BarChart
    data={chartData}
    width={Dimensions.get("window").width - 32}
    height={250}
    fromZero
    withCustomBarColorFromData
    showValuesOnTopOfBars
    yAxisLabel="₹"
    yAxisSuffix=""
    yAxisInterval={1}
    verticalLabelRotation={0}
    chartConfig={{
      backgroundGradientFrom: "#ffffff",
      backgroundGradientTo: "#ffffff",
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      barPercentage: 0.5,
      useShadowColorFromDataset: false,
    }}
    />

      <View style={{ backgroundColor: theme.colors.card, marginTop: 16, padding: 16, borderRadius: 8 }}>
      <Text style={{ color: theme.colors.text, fontSize: 16, marginBottom: 8 }}>
        Revenue: ₹{revenue.toLocaleString("en-IN")}
      </Text>
      <Text style={{ color: theme.colors.text, fontSize: 16, marginBottom: 8 }}>
        Capital: ₹{capital.toLocaleString("en-IN")}
      </Text>
      <Text style={{ color: theme.colors.text, fontSize: 16, marginBottom: 8 }}>
        Expenditure: ₹{expenditures.toLocaleString("en-IN")}
      </Text>
      <Text
        style={{
        color: profit >= 0 ? theme.colors.primary : theme.colors.notification,
        fontWeight: "bold",
        fontSize: 16,
        }}
      >
        {profit >= 0 ? "Profit" : "Loss"}: ₹{Math.abs(profit).toLocaleString("en-IN")}
      </Text>
      </View>
    </View>
  );
};


export default Performance;