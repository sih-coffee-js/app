# GeoTrack - Geolocation-Based Attendance Tracking Mobile Application

GeoTrack is a React Native mobile application that automates employee attendance tracking using geolocation services. Designed for both Android and iOS using Expo, GeoTrack ensures accurate location-based check-ins and check-outs for employees, providing real-time attendance records.

## Features

- **Automated Attendance**: Automatically tracks employee attendance based on their location.
- **Push Notifications**: Monthly reports of check-in and check-out times sent via Firebase Cloud Messaging (FCM).
- **Admin Dashboard**: Admins can view a detailed history of employee working hours and generate monthly reports.
- **Secure Data Storage**: All data is securely stored in MongoDB, with backup and recovery options.
- **Cross-Platform**: Built using React Native, works on both Android and iOS devices.

## Installation Steps

### Prerequisites

- **Node.js** (version 14+ recommended)
- **Expo CLI** installed globally:  
  ```bash
  npm install -g expo-cli
  ```
- **Firebase Project** with Firebase Cloud Messaging (FCM) enabled
- **MongoDB** for storing attendance data

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sih-coffee-js/app.git
   cd app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Setup Environment Variables**:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     FIREBASE_API_KEY=<your-firebase-api-key>
     MONGODB_URI=<your-mongodb-connection-string>
     FCM_SERVER_KEY=<your-fcm-server-key>
     GOOGLE_MAPS_API_KEY=<your-google-maps-api-key>
     ```

4. **Run the application**:
   ```bash
   num run android
   ```
