import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

export default function RoleSelector({ role, setRole }) {
  return (
    <View style={styles.roleContainer}>
      <Button
        mode={role === "student" ? "contained" : "outlined"}
        onPress={() => setRole("student")}
        style={styles.button}
      >
        Student
      </Button>
      <Button
        mode={role === "teacher" ? "contained" : "outlined"}
        onPress={() => setRole("teacher")}
        style={styles.button}
      >
        Teacher
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  button: { width: "45%" },
});
