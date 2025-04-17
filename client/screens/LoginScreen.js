import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import RoleSelector from "../components/RoleSelector";
import { BackendURL } from "../constant";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
  const [role, setRole] = useState("student");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const checkLoginStatus = async () => {
      const storedRole = await AsyncStorage.getItem("role");
      if (storedRole) {
        if (storedRole === "student") {
          const rollno = await AsyncStorage.getItem("rollno");
          navigation.replace("FaceCapture", { rollno });
        } else {
          navigation.replace("AllClasses");
        }
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    try {
      if (!id || !password) {
        Alert.alert("Please fill all fields");
        return;
      }

      let data = {
        password,
      };
      if (role === "student") {
        data.rollno = id?.toLowerCase().trim();
      } else {
        data.id = id?.toLowerCase().trim();
      }

      let response;
      if (role === "teacher") {
        response = await axios.post(
          `${BackendURL}/teacher/login?id=${
            data.id
          }&password=${password.trim()}`
        );
      } else {
        response = await axios.post(
          `${BackendURL}/user/login?rollno=${
            data.rollno
          }&password=${password.trim()}`
        );
      }
      console.log(response.data);
      if (response.data.success) {
        Alert.alert("Login successful");
        await AsyncStorage.setItem("role", role);
        if (role === "student") {
          await AsyncStorage.setItem("rollno", id.toLowerCase().trim());
        } else {
          await AsyncStorage.setItem("id", id.toLowerCase().trim());
        }

        if (role === "student") {
          await AsyncStorage.setItem("name", response.data.name.trim());
          navigation.navigate("FaceCapture");
          navigation.navigate("AllClasses");
        } else {
          navigation.navigate("AllClasses");
        }
      }
    } catch (err) {
      Alert.alert("Login failed", err.message || "Check credentials");
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Login
      </Text>
      <RoleSelector role={role} setRole={setRole} />
      <TextInput
        label={role === "student" ? "Roll Number" : "Teacher ID"}
        value={id}
        onChangeText={setId}
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </Button>
      <Button onPress={() => navigation.navigate("Register")}>
        Don't have an account? Register
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { textAlign: "center", marginBottom: 20 },
  input: { marginBottom: 10 },
  button: { marginTop: 10 },
});
