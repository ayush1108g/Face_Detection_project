// screens/UploadAttendanceScreen.js
import React, { useState } from "react";
import { View, Button, Image, Text, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

export default function UploadAttendanceScreen() {
  const [images, setImages] = useState([]);

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow access to your photos.");
      return;
    }
    console.log("Permission granted");
    try {
      // Step 2: Open image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.IMAGE, // Correct media type for images
        allowsMultipleSelection: true, // Allows multiple selections (should work on Android as well)
        quality: 1,
      });

      // Step 3: Handle the result
      if (!result.canceled) {
        // If images are picked
        console.log("Selected images:", result.assets); // This will give you an array of assets
      } else {
        // If user cancels the picker
        console.log("Image picker was canceled");
      }
    } catch (error) {
      console.error("Error while picking images:", error); // Error handling
    }
  };

  const uploadImages = async () => {
    const formData = new FormData();
    images.forEach((uri, idx) => {
      formData.append("files", {
        uri,
        name: `image${idx}.jpg`,
        type: "image/jpeg",
      });
    });

    try {
      const response = await axios.post(
        "http://<YOUR_BACKEND>/identify_from_image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Attendance marked");
    } catch (error) {
      console.error(error);
      alert("Failed to upload");
    }
  };

  return (
    <View>
      <Button title="Pick Images" onPress={pickImages} />
      {images.map((img, i) => (
        <Image
          key={i}
          source={{ uri: img }}
          style={{ width: 100, height: 100 }}
        />
      ))}
      <Button title="Upload for Attendance" onPress={uploadImages} />
    </View>
  );
}
