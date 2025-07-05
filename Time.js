import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import * as Location from 'expo-location';

export default function Time({ route }) {
  const GH_KEY = "38b2096b-51cc-428e-a112-4ba88e6c838f"; // Replace with your actual GraphHopper API key
  const { destination } = route.params;
  const [currentLocation, setCurrentLocation] = useState(null);
  const [duration, setDuration] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
    })();
  }, []);

  const getTravelDuration = async () => {
    if (!currentLocation) return;
    const point1 = `${currentLocation.latitude},${currentLocation.longitude}`;
    const point2 = `${destination.latitude},${destination.longitude}`;
    // You can change 'car' to 'bike', 'foot', etc. for different modes
    const url = `https://graphhopper.com/api/1/route?point=${point1}&point=${point2}&vehicle=car&locale=en&calc_points=false&key=${GH_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.paths && data.paths.length > 0) {
        // duration is in milliseconds, convert to minutes
        const durationInSeconds = data.paths[0].time / 1000;
        const minutes = Math.round(durationInSeconds / 60);
        setDuration(`${minutes} min`);
      } else if (data.message) {
        setDuration(data.message);
      } else {
        setDuration("No route found");
      }
    } catch (error) {
      setDuration("Error fetching route");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>
        Current Location: {currentLocation ? `${currentLocation.latitude}, ${currentLocation.longitude}` : 'Fetching...'}
      </Text>
      <Text>
        Destination: {destination.latitude}, {destination.longitude}
      </Text>
      <Button title="Get Travel Duration" onPress={getTravelDuration} />
      {duration && (
        <Text>
          Estimated Duration: {duration}
        </Text>
      )}
    </View>
  );
}
