import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";

function HourlyWeather({ hourlyData, day }) {
  if (!hourlyData) return null;

  function forecastHour(forecast, index) {
    return (
      <View key={index} style={styles.hourlyCard}>
        <Text style={styles.hourlyText}>{forecast.time.split(" ")[1]}</Text>
        <Text style={styles.hourlyText}>{forecast.condition.text}</Text>
        <Text style={styles.hourlyText}>Temperature: {forecast.temp_c}°C</Text>
        <Text style={styles.hourlyText}>Feels like: {forecast.feelslike_c}°C</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hourly Forecast for {day}</Text>
      <ScrollView
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      >
        {hourlyData.length > 1 ? (
          hourlyData.map((forecast, index) => forecastHour(forecast, index))
        ) : (
          <Text style={styles.loadingText}>Loading Hourly Data...</Text>
        )}
      </ScrollView>
    </View>
  );
}

export default HourlyWeather;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  hourlyCard: {
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    width: "48%",
  },
  hourlyText: {
    fontSize: 14,
    textAlign: "center",
    marginVertical: 2,
  },
  loadingText: {
    fontSize: 16,
    color: "#555",
  },
});
