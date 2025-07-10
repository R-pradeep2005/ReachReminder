import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button, TouchableOpacity, Alert, AppState } from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';

const GH_KEY = "38b2096b-51cc-428e-a112-4ba88e6c838f"; // Replace with your actual GraphHopper API key
const TASK_NAME = 'tracker-task';

export default function Time({ route, navigation }) {
  const { destination } = route.params;
  const [currentLocation, setCurrentLocation] = useState(null);
  const [userDefined, setUserDefined] = useState(10);
  const [alarmSet, setAlarmSet] = useState(false);
  const appState = useRef(AppState.currentState);

  // Get current location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
    })();
  }, []);

  // Listen for notification response to navigate to alarm screen
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      navigation.navigate('Alarm', { destination });
    });
    return () => subscription.remove();
  }, [navigation, destination]);

  // Clean up background task when leaving screen
  useEffect(() => {
    return () => {
      BackgroundFetch.unregisterTaskAsync(TASK_NAME).catch(() => {});
    };
  }, []);

  // Function to calculate duration
  const getTravelDuration = async (from, to) => {
    const point1 = `${from.latitude},${from.longitude}`;
    const point2 = `${to.latitude},${to.longitude}`;
    const url = `https://graphhopper.com/api/1/route?point=${point1}&point=${point2}&vehicle=car&locale=en&calc_points=false&key=${GH_KEY}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.paths && data.paths.length > 0) {
        return data.paths[0].time / 60000; // minutes
      }
      return null;
    } catch {
      return null;
    }
  };

  // Set alarm and register background task
  const setAlarm = async () => {
    if (!currentLocation) {
      Alert.alert('Location not ready');
      return;
    }
    await Notifications.requestPermissionsAsync();
    await Location.startLocationUpdatesAsync(TASK_NAME, {
      accuracy: Location.Accuracy.Highest,
      distanceInterval: 100, // meters
      deferredUpdatesInterval: 60000, // 1 min
      showsBackgroundLocationIndicator: true,
    });
    await BackgroundFetch.registerTaskAsync(TASK_NAME, {
      minimumInterval: 60, // seconds
      stopOnTerminate: false,
      startOnBoot: true,
    });
    global.trackerParams = {
      destination,
      userDefined,
      navigation,
    };
    setAlarmSet(true);
    Alert.alert('Alarm Set', `You will be notified when you are within ${userDefined} minutes of your destination.`);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>
        Current Location: {currentLocation ? `${currentLocation.latitude}, ${currentLocation.longitude}` : 'Fetching...'}
      </Text>
      <Text>
        Destination: {destination.latitude}, {destination.longitude}
      </Text>
      <View style={{ flexDirection: 'row', marginVertical: 20 }}>
        <TouchableOpacity onPress={() => setUserDefined(10)} style={{ marginRight: 10, backgroundColor: userDefined === 10 ? '#007AFF' : '#ccc', padding: 10 }}>
          <Text style={{ color: 'white' }}>10 min</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setUserDefined(15)} style={{ backgroundColor: userDefined === 15 ? '#007AFF' : '#ccc', padding: 10 }}>
          <Text style={{ color: 'white' }}>15 min</Text>
        </TouchableOpacity>
      </View>
      <Button title={alarmSet ? "Alarm Set" : "Set Alarm"} onPress={setAlarm} disabled={alarmSet} />
    </View>
  );
}

// Background Task definition
TaskManager.defineTask(TASK_NAME, async ({ data, error }) => {
  try {
    const location = await Location.getCurrentPositionAsync({});
    const params = global.trackerParams;
    if (!params) return BackgroundFetch.Result.NoData;
    const { destination, userDefined } = params;
    const point1 = `${location.coords.latitude},${location.coords.longitude}`;
    const point2 = `${destination.latitude},${destination.longitude}`;
    const url = `https://graphhopper.com/api/1/route?point=${point1}&point=${point2}&vehicle=car&locale=en&calc_points=false&key=${GH_KEY}`;
    const response = await fetch(url);
    const dataJson = await response.json();
    if (dataJson.paths && dataJson.paths.length > 0) {
      const minutes = dataJson.paths[0].time / 60000;
      if (minutes <= userDefined) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Destination Nearby",
            body: "You are within your selected threshold!",
            sound: true,
            data: { alarm: true }
          },
          trigger: null,
        });
        await BackgroundFetch.unregisterTaskAsync(TASK_NAME);
        return BackgroundFetch.Result.NewData;
      }
    }
    return BackgroundFetch.Result.NoData;
  } catch (e) {
    return BackgroundFetch.Result.Failed;
  }
});
