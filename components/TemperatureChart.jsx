import React from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";

function TemperatureChart({ hourlyData, day }) {
  if (!hourlyData || hourlyData.length === 0) {
    return <Text style={styles.loadingText}>Loading temperature data...</Text>;
  }

  const hourlyLabels = hourlyData.map((hour) => hour.time.split(" ")[1].split(":")[0]);
  const temperatures = hourlyData.map((hour) => hour.temp_c);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hourly Temperature for {day}</Text>
      <LineChart
        data={{
          labels: hourlyLabels,
          datasets: [
            {
              data: temperatures,
              color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`, // Line color
            },
          ],
        }}
        width={Dimensions.get("window").width - 40} // Full width of the screen minus padding
        height={220}
        yAxisSuffix="°C"
        chartConfig={{
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 1, // Number of decimal places for values
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Label and axis color
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: "#ffa726",
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
}

export default TemperatureChart;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
  },
});
