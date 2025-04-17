import React, { useState, useEffect } from "react";
import {
  Modal,
  TextInput,
  Button,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

function generateClassId(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let classId = "";
  for (let i = 0; i < length; i++) {
    classId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return classId;
}

const CreateClassModal = ({ visible, onClose, onSubmit }) => {
  const [classid, setClassid] = useState("");
  const [subject, setSubject] = useState("");
  const [branch, setBranch] = useState("ECE");
  const [batch, setBatch] = useState("22");

  useEffect(() => {
    const randomId = generateClassId();
    if (visible) {
      setClassid(randomId);
    }
  }, [visible]);

  const handleCreate = async () => {
    console.log("Creating class with data");
    const teacher_id = await AsyncStorage.getItem("id");
    console.log("Teacher ID:", teacher_id);
    onSubmit({ classid, subject, teacher_id, branch, batch });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalBox}>
          <TextInput
            placeholder="Class ID"
            value={classid}
            onChangeText={setClassid}
            style={[
              styles.input,
              {
                backgroundColor: "#f0f0f0",
              },
            ]}
            editable={false}
          />
          <TextInput
            placeholder="Subject"
            value={subject}
            onChangeText={setSubject}
            style={styles.input}
          />
          <Text style={styles.label}>Branch</Text>
          <Picker
            selectedValue={branch}
            onValueChange={(val) => setBranch(val)}
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
            selectedValue={batch}
            onValueChange={(val) => setBatch(val)}
            style={styles.picker}
          >
            <Picker.Item label="21" value="21" />
            <Picker.Item label="22" value="22" />
            <Picker.Item label="23" value="23" />
            <Picker.Item label="24" value="24" />
            <Picker.Item label="25" value="25" />
          </Picker>
          <TouchableOpacity style={{ padding: 5 }}>
            <Button title="Create Class" onPress={handleCreate} />
          </TouchableOpacity>

          <TouchableOpacity style={{ padding: 5 }}>
            <Button title="Cancel" onPress={onClose} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CreateClassModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalBox: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
