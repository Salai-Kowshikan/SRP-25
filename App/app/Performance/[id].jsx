import { View, StyleSheet, Image, ScrollView, Dimensions } from "react-native";
import { Text, Surface, Button, Chip, useTheme } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { LineChart } from "react-native-chart-kit";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import api from "@/api/api";

const screenWidth = Dimensions.get("window").width - 40;

function Performance() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const [expanded, setExpanded] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [shgData, setShgData] = useState();
  const [label, setLabel] = useState([]);
  const [performance, setPerformance] = useState([]);

  const handlePress = () => setExpanded(!expanded);
  const toggleGraph = () => setShowGraph(!showGraph);
  const fetchData = async () => {
    try {
      const response = await api.get(`/fetchSHGs/${id}`);
      setShgData(response.data);
      const expenses = await api.get(`/fetchExpenses/${id}`);
      const performanceArray = Object.keys(expenses.data[0].records).map(
        (date) => ({
          date: date,
          performance: expenses.data[0].records[date].performance,
        })
      );

      const sortedPerformanceArray = performanceArray.sort(
        (a, b) =>
          new Date(a.date.split("/").reverse().join("-")) -
          new Date(b.date.split("/").reverse().join("-"))
      );

      const newLabels = sortedPerformanceArray.map(
        (performance) => performance.date
      );
      const newPerformances = sortedPerformanceArray.map(
        (performance) => performance.performance
      );
      setLabel(newLabels);
      setPerformance(newPerformances);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const data = {
    labels: label,
    datasets: [
      {
        data: performance,
      },
    ],
    yAxisMin: 0,
    yAxisMax: 100,
  };

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(151, 72, 16, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
      paddingRight: 20,
      paddingLeft: 20,
      marginBottom: 20,
    },
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: "#e3e3e3",
      strokeDasharray: "0",
    },
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {shgData && (
          <>
            <Surface style={styles.surfaceContainer}>
              <Text variant="displaySmall" style={styles.heading}>
                {shgData.name}
              </Text>
              <View style={styles.chipContainer}>
                <Chip variant="titleSmall">from {shgData.location}</Chip>
                {shgData && (
                  <>
                    <Chip variant="titleSmall">on {shgData.date}</Chip>
                    <Chip variant="titleSmall">{shgData.subtitle}</Chip>
                  </>
                )}
              </View>
            </Surface>

            <Image source={{ uri: shgData.img }} style={styles.cover} />
            <Surface style={styles.surfaceContainer}>
              <Button
                onPress={handlePress}
                icon={expanded ? "chevron-up" : "chevron-down"}
              >
                Read More
              </Button>
            </Surface>
            <View>
              {expanded && <Text variant="bodyLarge">{shgData.desc}</Text>}
            </View>
            <Surface style={styles.surfaceContainer}>
              <Button
                onPress={toggleGraph}
                icon={showGraph ? "chevron-up" : "chevron-down"}
              >
                Performance Analytics
              </Button>
            </Surface>

            <View style={{ marginBottom: 100 }}>
              {showGraph && performance.length > 0 && (
                <LineChart
                  data={data}
                  width={screenWidth}
                  height={300}
                  chartConfig={chartConfig}
                  fromZero={true}
                  verticalLabelRotation={-45}
                />
              )}
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
}

export default Performance;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    margin: 20,
    gap: 20,
  },
  heading: {
    fontWeight: "bold",
  },
  cover: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
  },
  surfaceContainer: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 200,
  },
  origin: {
    width: "100%",
  },
  chipContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
});
