# React Native Attendance System using Face Recognition

This is a React Native application designed to interact with the Face Recognition API backend. It provides a user-friendly mobile interface for features like adding faces, recognizing faces, and accessing user/class data.

## Features

- Capture face image using the device camera
- Send image to backend for face recognition
- User authentication and class association (based on backend API)
- Real-time feedback and result display

## Technologies Used

- **React Native** - Mobile app framework
- **Expo / React Native CLI** - Development environment
- **Axios** - HTTP client for API calls
- **React Navigation** - Navigation and routing
- **AsyncStorage** - Local storage for session/token
- **Expo Camera** - Access device camera

## Project Structure

```
.
├── App.js                      # Entry point of the app
├── components/                 # Reusable UI components
├── screens/                    # Screen/page components
│   ├── HomeScreen.js
│   ├── FaceRecognitionScreen.js
│   └── AddFaceScreen.js
├── constants.js                # For using constant varibles across the App
├── assets/                     # Images, icons, fonts, etc.
├── app.json                    # App config 
├── package.json                # Dependencies
└── README.md
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/face-recognition-app.git
cd face-recognition-app
cd client
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

### 3. Start the App

```bash
npx expo run android   # For Android
```

### 4. Add backend connection
Add BackendURL in constant.js file
```
BackendURL=http://<your-backend-ip>:8000
```

Make sure to install `react-native-dotenv` and configure Babel to use it if using `.env`.


## API Integration

Ensure your FastAPI backend server is running and accessible via the IP/port configured in `.env`.

## Notes

- For local testing, mobile device and backend should be on the same network.
- Use Android emulator or physical device with camera permissions.



