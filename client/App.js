import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisScreen";
import UploadAttendanceScreen from "./screens/UploadAttendence";
import AllClassesScreen from "./screens/AllClassesScreen";
import ClassDetailsScreen from "./screens/ClassDetailScreen";
import FaceCaptureScreen from "./screens/FaceCaptureScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AllClasses">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen
          name="UploadAttendance"
          component={UploadAttendanceScreen}
        />
        <Stack.Screen
          name="AllClasses"
          component={AllClassesScreen}
          options={{ title: "All Classes" }}
        />
        <Stack.Screen
          name="ClassDetails"
          component={ClassDetailsScreen}
          options={{ title: "All Classes" }}
        />
        <Stack.Screen
          name="FaceCapture"
          component={FaceCaptureScreen}
          options={{ title: "All Classes" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
