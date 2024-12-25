import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Location from './components/Location.jsx';
import Forecast from './components/Forecast.jsx';
import HourlyWeather from './components/HourlyWeather.jsx';
import TemperatureChart from './components/TemperatureChart.jsx';

export default function App() {
  const [locationData, setLocationData] = useState(null);
  const [searched, setSearched] = useState(false);
  const [forecast, setForecast] = useState(false);
  const [hourlyData, setHourlyData] = useState(null);
  const [showChart, setShowChart] = useState(null);

  const handleSearch = (returnedData) => {
    setLocationData(returnedData);
    setSearched(true);
    setForecast(false);
  };

  const handleForecastPress = () => {
    console.log(locationData);
    setForecast(true);
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20, paddingTop: 20 }}>
      <View style={styles.container}>

        <Header onSearch={handleSearch} searched={searched} />

        {locationData && (
          <Pressable style={styles.forecastButton} onPress={handleForecastPress}>
            <Text style={styles.forecastButtonText}>3 Day Forecast</Text>
          </Pressable>
        )}

        {!searched ? (
          <Location
            current={(returnedData) => {
              setLocationData(returnedData);
              setForecast(false);
            }}
          />
        ) : (
          <Location data={locationData} />
        )}

        {forecast && locationData && (
          <Forecast
            locationName={locationData.location.name}
            hourlyWeather={(data) => {
              setShowChart(false);
              setHourlyData(data);
            }}
            chart={(data) => {
              setShowChart(true);
              setHourlyData(data);

            }}
          />
        )}

        {hourlyData && (
          <View>
            {!showChart ? (
              <View><HourlyWeather hourlyData={hourlyData.hours} day={hourlyData.day} /></View>
            ) : (
              <View>
                <Text style={styles.chartTitle}>Hourly Temperature Chart</Text>
                <TemperatureChart hourlyData={hourlyData.hours} day={hourlyData.day} />
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    paddingBottom: 20,
    paddingTop: 150,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  forecastButton: {
    borderColor: 'black',
    borderWidth: 1,
    padding: 5,
    borderRadius: 8,
    marginBottom: 20,
    width: "50%",
    alignSelf: "center"
  },
  forecastButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
});
