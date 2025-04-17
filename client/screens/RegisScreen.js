import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import RoleSelector from "../components/RoleSelector";
import { Picker } from "@react-native-picker/picker";
import { BackendURL } from "../constant";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegisterScreen({ navigation }) {
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({
    name: "",
    rollno: "",
    branch: "ECE",
    batch: "22",
    password: "",
    id: "",
  });

  const handleRegister = async () => {
    try {
      if (role === "student") {
        if (!form.name || !form.rollno || !form.password) {
          Alert.alert("Please fill all fields");
          return;
        }
        const data = {
          name: form.name,
          rollno: form.rollno?.toLowerCase().trim(),
          branch: form.branch,
          batch: form.batch,
          password: form.password.trim(),
        };
        const response = await axios.post(`${BackendURL}/user/register`, data);

        if (response.data.success) {
          await AsyncStorage.setItem(
            "rollno",
            form.rollno?.toLowerCase().trim()
          );
          await AsyncStorage.setItem("role", "student");
          await AsyncStorage.setItem("name", form.name?.trim());
          await AsyncStorage.setItem("branch", form.branch);
          await AsyncStorage.setItem("batch", form.batch);

          Alert.alert("Registered successfully");

          setTimeout(() => {
            navigation.navigate("FaceCapture");
          }, 1000);
        } else {
          Alert.alert(
            "Registration failed",
            response.data.message || "Try again"
          );
        }
      } else {
        if (!form.name || !form.id || !form.password) {
          Alert.alert("Please fill all fields");
          return;
        }
        const data = {
          name: form.name,
          id: form.id.toLowerCase().trim(),
          pass_: form.password.trim(),
        };
        const response = await axios.post(
          `${BackendURL}/teacher/register`,
          data
        );

        if (response.data.success) {
          await AsyncStorage.setItem("id", form.id?.toLowerCase());
          await AsyncStorage.setItem("role", "teacher");
          await AsyncStorage.setItem("name", form.name);

          Alert.alert("Registered successfully");

          setTimeout(() => {
            navigation.navigate("AllClasses");
          }, 1000);
        } else {
          Alert.alert(
            "Registration failed",
            response.data.message || "Try again"
          );
        }
      }
    } catch (err) {
      Alert.alert("Registration failed", err.message || "Try again");
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Register
      </Text>
      <RoleSelector role={role} setRole={setRole} />

      <TextInput
        label="Name"
        value={form.name}
        onChangeText={(val) => setForm({ ...form, name: val })}
        style={styles.input}
      />

      {role === "student" ? (
        <>
          <TextInput
            label="Roll No"
            value={form.rollno}
            onChangeText={(val) => setForm({ ...form, rollno: val })}
            style={styles.input}
          />

          <Text style={styles.label}>Branch</Text>
          <Picker
            selectedValue={form.branch}
            onValueChange={(val) => setForm({ ...form, branch: val })}
            style={styles.picker}
          >
            <Picker.Item label="ECE" value="ECE" />
            <Picker.Item label="EE" value="EE" />
            <Picker.Item label="ME" value="ME" />
            <Picker.Item label="CSE" value="CSE" />
            <Picker.Item label="CE" value="CE" />
            <Picker.Item label="META" value="META" />
          </Picker>

          <Text style={styles.label}>Batch</Text>
          <Picker
            selectedValue={form.batch}
            onValueChange={(val) => setForm({ ...form, batch: val })}
            style={styles.picker}
          >
            <Picker.Item label="21" value="21" />
            <Picker.Item label="22" value="22" />
            <Picker.Item label="23" value="23" />
            <Picker.Item label="24" value="24" />
            <Picker.Item label="25" value="25" />
          </Picker>
        </>
      ) : (
        <TextInput
          label="Teacher ID"
          value={form.id}
          onChangeText={(val) => setForm({ ...form, id: val })}
          style={styles.input}
        />
      )}

      <TextInput
        label="Password"
        secureTextEntry
        value={form.password}
        onChangeText={(val) => setForm({ ...form, password: val })}
        style={styles.input}
      />

      <Button mode="contained" onPress={handleRegister} style={styles.button}>
        Register
      </Button>
      <Button onPress={() => navigation.navigate("Login")}>
        Already have an account? Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { textAlign: "center", marginBottom: 20 },
  input: { marginBottom: 10 },
  button: { marginTop: 10 },
  label: { marginTop: 10, fontSize: 16, fontWeight: "bold" },
  picker: {
    backgroundColor: "cyan",
    marginBottom: 10,
  },
});
