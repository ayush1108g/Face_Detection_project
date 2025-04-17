import React from "react";
import { View, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisScreen";
import UploadAttendanceScreen from "./screens/UploadAttendence";
import AllClassesScreen from "./screens/AllClassesScreen";
import ClassDetailsScreen from "./screens/ClassDetailScreen";
import FaceCaptureScreen from "./screens/FaceCaptureScreen";
import CreateAttendanceScreen from "./screens/CreateAttendance";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen
          name="UploadAttendance"
          component={UploadAttendanceScreen}
        />
        <Stack.Screen
          name="AllClasses"
          component={AllClassesScreen}
          options={{
            title: "All Classes",
          }}
        />
        <Stack.Screen
          name="ClassDetails"
          component={ClassDetailsScreen}
          options={{ title: "All Classes" }}
        />
        <Stack.Screen
          name="FaceCapture"
          component={FaceCaptureScreen}
          options={{ title: "Face Data" }}
        />
        <Stack.Screen
          name="CreateAttendance"
          component={CreateAttendanceScreen}
          options={{ title: "Take Attendance" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
