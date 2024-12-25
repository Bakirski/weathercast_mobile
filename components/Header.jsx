import React, { useState } from "react";
import axios from "axios";
import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";

function Header(props) {
  const [location, setLocation] = useState("");
  const [error, setError] = useState(null);

  async function getLocationData() {
    try {
      setError(null);
      const response = await axios.post(
        "http://192.168.100.177:4000/get-location-data",
        {
          location_name: location,
        }
      );
      console.log("Response from server: ", response.data);
      props.onSearch(response.data);
    } catch (error) {
      setError("City name does not exist.");
      console.error("Error sending request for location weather: ", error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather Forecast</Text>
      <TextInput
        style={styles.input}
        placeholder="Search"
        value={location}
        onChangeText={setLocation}
      />
      <Pressable style={styles.button} onPress={getLocationData}>
        <Text style={styles.buttonText}>Search</Text>
      </Pressable>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center"
  },
  input: {
    height: 40,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});

export default Header;
