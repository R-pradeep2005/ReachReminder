import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PinPage from './PinPage';
import Time from './Time';
import Alarm from './alarm';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PinPage">
        <Stack.Screen name="PinPage" component={PinPage} options={{ title: 'Select Pin' }} />
        <Stack.Screen name="Time" component={Time} options={{ title: 'Travel Time' }} />
        <Stack.Screen name="Alarm" component={Alarm} options={{ title: 'Alarm' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
