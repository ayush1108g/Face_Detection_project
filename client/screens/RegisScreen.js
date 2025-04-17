import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import RoleSelector from "../components/RoleSelector";
import { Picker } from "@react-native-picker/picker";

// Dummy API function
const registerUser = async ({ id, name, password, role }) => {
  // Handle actual API call here
};

export default function RegisterScreen({ navigation }) {
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({
    name: "",
    rollno: "",
    branch: "EE",
    batch: "21",
    password: "",
    teacherId: "",
  });

  const handleRegister = async () => {
    try {
      const payload = {
        ...form,
        id: form.rollno || form.teacherId,
        role,
      };
      await registerUser(payload);
      Alert.alert("Registered successfully");
      navigation.navigate("Login");
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
          </Picker>
        </>
      ) : (
        <TextInput
          label="Teacher ID"
          value={form.teacherId}
          onChangeText={(val) => setForm({ ...form, teacherId: val })}
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
