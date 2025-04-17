import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";

export default function ClassDetailsScreen({ route }) {
  const { classData, user } = route.params;

  const [attendanceList, setAttendanceList] = useState([
    { id: "a1", date: "2024-04-10", present: true },
    { id: "a2", date: "2024-04-13", present: false },
  ]);

  const handleCreateAttendance = () => {
    const newAttendance = {
      id: `a${attendanceList.length + 1}`,
      date: new Date().toISOString().split("T")[0],
      present: false,
    };

    setAttendanceList([newAttendance, ...attendanceList]);
    Alert.alert(
      "Attendance Created",
      `New attendance for ${newAttendance.date} has been added.`
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.attendanceCard}>
      <Text style={styles.attendanceText}>Date: {item.date}</Text>
      {user.role === "student" && (
        <Text style={{ color: item.present ? "green" : "red" }}>
          {item.present ? "Present" : "Absent"}
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.classTitle}>{classData.name} - Attendance</Text>

      {user.role === "teacher" && (
        <TouchableOpacity
          onPress={handleCreateAttendance}
          style={styles.createButton}
        >
          <Text style={styles.createButtonText}>+ Create Attendance</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={attendanceList}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 16,
  },
  classTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 20,
  },
  createButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  attendanceCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  attendanceText: {
    fontSize: 16,
    marginBottom: 4,
  },
});
