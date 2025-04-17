import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  Alert,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";
import { useLayoutEffect } from "react";

import { BackendURL } from "../constant";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("window").width;
import CreateClassModal from "../components/CreateClassModal";
// Dummy class data
const classes = [];

// Predefined color palette
const colors = [
  "#FFB6C1",
  "#87CEEB",
  "#98FB98",
  "#FFD700",
  "#DDA0DD",
  "#FFA07A",
  "#00CED1",
];

function getRandomColor(index) {
  return colors[index % colors.length];
}

export default function AllClassesScreen({ navigation }) {
  const [role, setRole] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const [AllClasses, setAllClasses] = React.useState(classes);
  const [updateClasses, setUpdateClasses] = React.useState(false);

  const LogoutHandler = async () => {
    console.log("Logging out...");
    await AsyncStorage.clear();
    navigation.replace("Login");
  };

  useEffect(() => {
    const fetchRole = async () => {
      const storedRole = await AsyncStorage.getItem("role");
      setRole(storedRole);
    };
    fetchRole();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      if (!role) return;
      try {
        if (role === "student") {
          const rollno = await AsyncStorage.getItem("rollno");
          const response = await axios.get(
            `${BackendURL}/user/${rollno}/classes`,
            {
              params: { rollno },
            }
          );
          console.log(response.data);
          if (response.data.success) {
            setAllClasses(response.data.classes);
          } else {
            consolele.log("Error fetching classes:", response.data.message);
          }
        } else {
          const response = await axios.get(`${BackendURL}/teacher/classes`, {
            params: { id: await AsyncStorage.getItem("id") },
          });
          if (response.data.success) {
            console.log(response.data.classes);
            setAllClasses(response.data.classes);
          } else {
            console.log("Error fetching classes:", response.data.message);
          }
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    };
    fetchClasses();
  }, [role, updateClasses]);

  const handleCreateClass = async ({
    classid,
    subject,
    teacher_id,
    branch,
    batch,
  }) => {
    console.log("Creating class with data:");

    if (!classid || !subject || !teacher_id || !branch || !batch) {
      Alert.alert("Please fill all fields");
      return;
    }

    try {
      const response = await axios.post(`${BackendURL}/teacher/add-class`, {
        classid,
        subject,
        teacher_id,
        branch,
        batch,
      });
      if (response.data.success) {
        Alert.alert("Class created successfully");
        setShowModal(false);
        setUpdateClasses((prev) => !prev);
      } else {
        Alert.alert("Error", response.data.message || "Try again");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("ClassDetails", {
          classData: AllClasses[index],
        });
      }}
    >
      <View style={[styles.card, { backgroundColor: getRandomColor(index) }]}>
        <Text style={styles.cardText}>{item.subject}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {AllClasses.length === 0 && (
        <View style={styles.card}>
          <Text style={styles.cardText}>No Classes Found</Text>
        </View>
      )}
      <FlatList
        data={AllClasses}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />

      {role === "teacher" && (
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.btnText}>+ Create Class</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={LogoutHandler}>
        <Text>Logout</Text>
      </TouchableOpacity>
      <CreateClassModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateClass}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  card: {
    width: screenWidth - 32,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
    fontSize: 16,
  },
  createBtn: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});
