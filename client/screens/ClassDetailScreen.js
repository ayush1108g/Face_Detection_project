import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Image,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BackendURL } from "../constant";

export default function ClassDetailsScreen({ route, navigation }) {
  const { classData } = route.params;
  const [role, setRole] = useState();
  const [attendenceData, setAttendanceData] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState({});
  useEffect(() => {
    const fetchRole = async () => {
      const storedRole = await AsyncStorage.getItem("role");
      setRole(storedRole);
    };
    fetchRole();
  }, []);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!role) return;
      try {
        if (role === "student") {
          const rollno = await AsyncStorage.getItem("rollno");
          const response = await axios.get(
            `${BackendURL}/user/${rollno}/attendance/${classData.classid}`,
            {
              params: { rollno, classid: classData.classid },
            }
          );
          console.log("ppp,", response.data);
          if (response.data.success) {
            setAttendanceData(response.data.attendance);
          } else {
            Alert.alert("Error", response.data.message || "Try again");
          }
        } else {
          const response = await axios.get(
            `${BackendURL}/teacher/get-attendance-sheet/${classData.classid}`,
            {
              params: { classid: classData.classid },
            }
          );
          if (response.data.success) {
            console.log("attata", response.data);
            const table = response.data.attendance_table;
            const attendanceArray = Object.entries(table).map(
              ([date, records]) => ({
                date,
                records,
              })
            );
            setAttendanceList(attendanceArray);
          } else {
            Alert.alert("Error", response.data.message || "Try again");
          }
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    };
    fetchAttendance();
  }, [role, classData, navigation]);

  const [attendanceList, setAttendanceList] = useState([
    // { id: "a1", date: "2024-04-10", present: true },
    // { id: "a2", date: "2024-04-13", present: false },
  ]);

  const handleCreateAttendance = () => {
    navigation.navigate("CreateAttendance", { classData });
  };

  const renderItem = ({ item }) => (
    <View style={styles.attendanceCard}>
      <Text style={styles.attendanceText}>Date: {item.date}</Text>
      {role === "student" && (
        <Text style={{ color: item.present ? "green" : "red" }}>
          {item.present ? "Present" : "Absent"}
        </Text>
      )}
    </View>
  );

  const renderItem2 = ({ item }) => (
    <TouchableOpacity
      style={styles.attendanceCard}
      onPress={() => {
        setSelectedRecords({ date: item.date, records: item.records });
        setModalVisible(true);
      }}
    >
      <Text style={styles.attendanceText}>Date: {item.date}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.classTitle}>
        {classData.subject}- {classData.classid} - Attendance
      </Text>

      {role === "teacher" && (
        <TouchableOpacity
          onPress={handleCreateAttendance}
          style={styles.createButton}
        >
          <Text style={styles.createButtonText}>+ Take Attendance</Text>
        </TouchableOpacity>
      )}
      {role === "student" ? (
        <>
          <FlatList
            data={attendenceData}
            keyExtractor={(item, index) => index}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
          {attendenceData?.length === 0 && (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No attendance data available.
            </Text>
          )}
        </>
      ) : (
        <>
          <FlatList
            data={attendanceList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem2}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
          {attendanceList?.length === 0 && (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No attendance data available.
            </Text>
          )}
        </>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Attendance for {selectedRecords?.date}
            </Text>
            <ScrollView>
              {selectedRecords?.records &&
                Object.entries(selectedRecords.records).map(
                  ([roll, status]) => (
                    <Text key={roll} style={styles.modalItem}>
                      {roll}: {status}
                    </Text>
                  )
                )}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  attendanceCard: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
  },
  attendanceText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 10,
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  closeButton: {
    marginTop: 10,
    alignSelf: "flex-end",
    backgroundColor: "#007bff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
  },
});
