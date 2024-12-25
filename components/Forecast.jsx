import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";

function Forecast(props) {
  const [forecastData, setForecastData] = useState([]);

  function getDayOfWeek(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  }

  function dayAndMonth(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
    });
  }

  useEffect(() => {
    async function getForecast() {
      try {
        const response = await axios.post("http://192.168.100.177:4000/get-forecast", {
          location: props.locationName,
        });
        console.log(response.data);
        setForecastData(response.data);
      } catch (error) {
        console.error("Error getting forecast data: ", error);
      }
    }

    getForecast();
  }, [props.locationName]);

  function forecastDay(forecast, index) {
    return (
      <View key={index} style={styles.forecastCard}>
        <View style={styles.forecastHeader}>
          <Text style={styles.dateText}>
            {getDayOfWeek(forecast.date)}, {dayAndMonth(forecast.date)}
          </Text>
          <Image
            source={{ uri: `https:${forecast.day.condition.icon}` }}
            style={styles.weatherIcon}
          />
          <Text style={styles.conditionText}>{forecast.day.condition.text}</Text>
        </View>
        <View style={styles.forecastDetails}>
          {forecast.day.daily_chance_of_rain > 0 ? (
            <View style={styles.infoBlock}>
              <Text>Chance of rain: {forecast.day.daily_chance_of_rain}%</Text>
              <Text>Precipitation: {forecast.day.totalprecip_mm}mm</Text>
            </View>
          ) : forecast.day.daily_chance_of_snow > 0 ? (
            <View style={styles.infoBlock}>
              <Text>Chance of snow: {forecast.day.daily_chance_of_snow}%</Text>
              <Text>Precipitation: {forecast.day.totalprecip_mm}mm</Text>
            </View>
          ) : null}
          <Text>Average Temperature: {forecast.day.avgtemp_c}°C</Text>
          <Text>Max Temperature: {forecast.day.maxtemp_c}°C</Text>
          <Text>Min Temperature: {forecast.day.mintemp_c}°C</Text>
          <Text>RealFeel: {forecast.day.avgtemp_c}°C</Text>
          <Text>Wind: {forecast.day.maxwind_kph} km/h</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              props.hourlyWeather({
                day: getDayOfWeek(forecast.date),
                hours: forecast.hour,
              })
            }
          >
            <Text style={styles.buttonText}>Hourly Forecast</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => props.chart({
              day: getDayOfWeek(forecast.date),
              hours: forecast.hour
            })}
          >
            <Text style={styles.buttonText}>Temperature Chart</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Forecast for the next 3 days</Text>
      {forecastData.length > 1 ? (
        forecastData.slice(1).map((forecast, index) =>
          forecastDay(forecast, index)
        )
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
    </ScrollView>
  );
}

export default Forecast;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 16,
  },
  forecastCard: {
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    width: "90%",
  },
  forecastHeader: {
    alignItems: "center",
    marginBottom: 8,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  weatherIcon: {
    width: 80,
    height: 80,
    marginVertical: 8,
  },
  conditionText: {
    fontSize: 16,
    color: "#333",
  },
  forecastDetails: {
    marginBottom: 8,
  },
  infoBlock: {
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  button: {
    backgroundColor: "#B0C4DE",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    color: "#000",
    textAlign: "center",
  },
});
