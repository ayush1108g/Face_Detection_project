import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

// Dummy class data
const classes = [
  { id: "1", subject: "Mathematics" },
  { id: "2", subject: "Physics" },
  { id: "3", subject: "Chemistry" },
  { id: "4", subject: "English" },
  { id: "5", subject: "Computer Science" },
  { id: "6", subject: "Biology" },
];

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

export default function AllClassesScreen() {
  const navigation = useNavigation();

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => {
        // navigation.navigate("ClassDetails", {
        //   classData: { id: "c101", name: "Physics" },
        //   user: { id: "u101", name: "Ayush", role: "teacher" },
        // });
        navigation.navigate("FaceCapture", { userId: "ayush123" });
      }}
    >
      <View style={[styles.card, { backgroundColor: getRandomColor(index) }]}>
        <Text style={styles.cardText}>{item.subject}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
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
});
