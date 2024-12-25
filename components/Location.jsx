import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import * as ExpoLocation from "expo-location"; // Import expo-location

function AiqDescription({ aqiLevel }) {
  const aqiDescriptions = {
    1: "Air quality is satisfactory, and air pollution poses little or no risk.",
    2: "Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.",
    3: "Members of sensitive groups may experience health effects. The general public is less likely to be affected.",
    4: "Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.",
    5: "Health alert: The risk of health effects is increased for everyone.",
    6: "Health warning of emergency conditions: everyone is more likely to be affected.",
  };

  const description = aqiDescriptions[aqiLevel] || "Unknown AIQ level.";

  return <Text style={styles.description}>{description}</Text>;
}

function LocationDetails({ location }) {
  return (
    <View style={styles.locationDetails}>
      <Text style={styles.locationName}>
        {location.name}
        {location.region && `, ${location.region}`}
      </Text>
      <Text style={styles.country}>{location.country}</Text>
      <Text style={styles.localtime}>{location.localtime.split(" ")[1]}</Text>
    </View>
  );
}

function WeatherDetails({ current }) {
  return (
    <View style={styles.weatherDetails}>
      <Image
        source={{ uri: `https:${current.condition.icon}` }}
        style={styles.weatherIcon}
      />
      <Text style={styles.conditionText}>{current.condition.text}</Text>
      <Text>Temperature: {current.temp_c}°C || {current.temp_f}°F</Text>
      <Text>Feels like: {current.feelslike_c}°C || {current.feelslike_f}°F</Text>
    </View>
  );
}

function AdditionalInfo({ current }) {
  return (
    <View style={styles.additionalInfo}>
      <View style={styles.infoSection}>
        <Text>Wind speed: {current.wind_kph} km/h</Text>
        <Text>Precipitation: {current.precip_mm}mm</Text>
      </View>
      <View style={styles.infoSection}>
        <Text>Air Quality:</Text>
        <View style={styles.airQualityList}>
          <Text>Carbon Monoxide: {current.air_quality.co} μg/m³</Text>
          <Text>Ozone: {current.air_quality.no2} μg/m³</Text>
          <Text>Nitrogen Dioxide: {current.air_quality.o3} μg/m³</Text>
          <Text>Sulphur Dioxide: {current.air_quality.so2} μg/m³</Text>
          <Text>US-EPA Index: {current.air_quality["us-epa-index"]}</Text>
          <Text><AiqDescription aqiLevel={current.air_quality["us-epa-index"]} /></Text>
        </View>
      </View>
    </View>
  );
}

export default function Location(props) {
  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null,
  });
  const [coordinatesError, setCoordinatesError] = useState(null);
  const [locationData, setLocationData] = useState(null);

  // Fetch location data from the server
  async function fetchCurrentLocationData() {
    try {
      const response = await axios.post("http://192.168.100.177:4000/current-location", {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });
      setLocationData(response.data);
      props.current && props.current(response.data);
    } catch (error) {
      console.error("Error fetching current location data: ", error);
    }
  }

  // Use expo-location to fetch geolocation
  useEffect(() => {
    (async () => {
      if (!props.data) {
        try {
          let { status } = await ExpoLocation.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            setCoordinatesError("Permission to access location was denied");
            return;
          }

          let location = await ExpoLocation.getCurrentPositionAsync({});
          setCoordinates({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        } catch (error) {
          setCoordinatesError("Error accessing location: " + error.message);
        }
      }
    })();
  }, [props.data]);

  useEffect(() => {
    if (coordinates.latitude && coordinates.longitude) {
      fetchCurrentLocationData();
    }
  }, [coordinates]);

  useEffect(() => {
    if (props.data) {
      setLocationData(props.data);
    }
  }, [props.data]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {locationData ? (
        <View style={styles.card}>
          <Text>
          <LocationDetails location={locationData.location} />
          <WeatherDetails current={locationData.current} />
          <AdditionalInfo current={locationData.current} />
          </Text>
        </View>
      ) : coordinatesError ? (
        <Text style={styles.errorText}>Error: {coordinatesError}</Text>
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    width: "90%",
  },
  locationDetails: {
    alignItems: "center",
    marginBottom: 10,
  },
  locationName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  country: {
    fontSize: 16,
  },
  localtime: {
    fontSize: 14,
    color: "#888",
  },
  weatherDetails: {
    alignItems: "center",
    marginBottom: 10,
  },
  weatherIcon: {
    width: 64,
    height: 64,
  },
  conditionText: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 4,
  },
  additionalInfo: {
    marginTop: 10,
  },
  infoSection: {
    marginVertical: 5,
  },
  airQualityList: {
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});
