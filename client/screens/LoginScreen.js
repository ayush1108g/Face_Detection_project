import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import RoleSelector from "../components/RoleSelector";
// import { loginUser } from "../api/api";
const loginUser = async ({ id, password, role }) => {};

export default function LoginScreen({ navigation }) {
  const [role, setRole] = useState("student");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await loginUser({ id, password, role });
      Alert.alert("Login successful");
      // navigate to dashboard or class screen
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
