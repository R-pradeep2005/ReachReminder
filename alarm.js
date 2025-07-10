import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av';

export default function Alarm({ navigation, route }) {
  useEffect(() => {
    let sound;
    (async () => {
      sound = new Audio.Sound();
      await sound.loadAsync(require('./assets/alarm.mp3')); // Place alarm.mp3 in your assets folder
      await sound.playAsync();
    })();
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Destination Nearby!</Text>
      <Text style={styles.subtitle}>You are within your selected threshold.</Text>
      <Button title="Dismiss" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20, color: '#007AFF' },
  subtitle: { fontSize: 20, marginBottom: 40 },
});
