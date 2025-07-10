import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

export default function PinPage({ navigation }) {
  const [marker, setMarker] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to show your current location.');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);

      // Center map on current location
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 1000);
      }
    })();
  }, []);

  const handleSet = () => {
    if (marker) {
      navigation.navigate('Time', { destination: marker });
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: currentLocation ? currentLocation.latitude : 37.78825,
          longitude: currentLocation ? currentLocation.longitude : -122.4324,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        onPress={e => setMarker(e.nativeEvent.coordinate)}
        onLongPress={e => setMarker(e.nativeEvent.coordinate)}
      >
        {/* Marker for selected destination */}
        {marker && (
          <Marker
            coordinate={marker}
            title="Destination Location"
            description="Used to Set alarm"
            pinColor="blue"
          />
        )}
        {/* Marker for current location (optional, since showsUserLocation already displays a blue dot) */}
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            title="Your Location"
            description="This is your current location"
            pinColor="green"
          />
        )}
      </MapView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => setMarker(null)}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.setButton}
          onPress={handleSet}
          disabled={!marker}
        >
          <Text style={styles.setText}>Set</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  setButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelText: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  setText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
