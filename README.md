# ArriveAlert

ArriveAlert is a mobile application designed to **notify users when they reach a predefined destination**. The app leverages real-time location tracking, route duration calculation, and interactive map selection to help users set a destination and receive alerts as they approach it. This is ideal for travelers, commuters, or anyone who wants a reminder when arriving at a specific place.

## 🚀 Features

- **Live Location Tracking:** Uses device GPS to track your position in real time.
- **Map Integration:** Select your destination using an interactive Google Map.
- **Route Calculation:** Calculates optimal route and travel time using GraphHopper.
- **Arrival Alerts:** Sends push notifications as you approach or reach your destination.


  ## 📥 How to Use ArriveAlert (APK Download)

1. **Download the APK**
   - Go to the [Releases](https://github.com/yourusername/ArriveAlert/releases) section of this repository.
   - Download the latest `ArriveAlert.apk` file to your Android device.

2. **Install the APK**
   - Open the downloaded APK file on your device.
   - You may need to allow installation from unknown sources in your device settings.
   - Follow the on-screen instructions to complete the installation.

3. **Open the App**
   - Launch ArriveAlert from your app drawer or home screen.

4. **Set Your Destination and Go!**
   - Use the map to select your destination and start tracking.
   - The app will notify you when you are near or have arrived at your chosen location.

> **Note:**  
> ArriveAlert currently supports Android devices only. Make sure you have enabled location services and notification permissions for the best experience.


## 🧭 How to Use

1. **Set Your Destination**
   - Open the app and use the integrated Google Map to select your desired destination.
   - Search for a place or long-press on the map to drop a pin.

2. **Start Tracking**
   - Tap the “Start” button to begin monitoring your location.
   - The app calculates the optimal route and estimated travel time using GraphHopper.

3. **Get Notified**
   - Receive a notification as you approach your destination.

4. **Stop Tracking**
   - Tracking stops automatically upon arrival or can be stopped manually at any time.

## 🛠️ Technical Overview

| Component        | Technology / API Used             | Purpose                                                                                   |
|------------------|-----------------------------------|-------------------------------------------------------------------------------------------|
| **Frontend**     | Expo (React Native)               | Cross-platform mobile development framework                                               |
| **Location**     | expo-location                     | Access device geolocation, track user’s position, and subscribe to location updates        |
| **Map Selection**| Google Maps API                   | Interactive map for destination selection and visualization                               |
| **Route & ETA**  | GraphHopper API                   | Calculate optimal route and travel duration                                               |
| **Notifications**| Expo Notifications                | Alert user when approaching or arriving at the destination                                |

## ⚙️ Setup & Running Locally


## 🔑 Configuration Notes

- **expo-location:** Configure permissions for background and foreground location access in your `app.json`.
- **Google Maps:** Set up your Google Maps API key and enable required services in the Google Cloud Console.
- **GraphHopper:** Register for an API key and consult their documentation for traffic and routing options.

