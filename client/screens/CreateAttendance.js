import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Progress from "react-native-progress";
import * as ImageManipulator from "expo-image-manipulator";

import { BackendURL } from "../constant";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function FaceCaptureScreen({ route, navigation }) {
  const { classData } = route.params;
  const [permission, requestPermission] = useCameraPermissions();
  const [imagesCaptured, setImagesCaptured] = useState(0);
  const [croppingImage, setCroppingImage] = useState(null);
  const cameraRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const takePicture = async () => {
    if (!cameraRef.current || imagesCaptured >= 3) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        skipProcessing: false,
      });

      console.log("Captured image:", photo.uri);

      // Open crop modal
      setCroppingImage(photo);
    } catch (err) {
      console.error("Error taking picture:", err);
    }
  };

  const handleCrop = async () => {
    try {
      const cropped = await ImageManipulator.manipulateAsync(
        croppingImage.uri,
        [
          {
            crop: {
              originX: 0,
              originY: 0,
              width: croppingImage.width,
              height: croppingImage.height, // cropping into a square
            },
          },
        ],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      console.log("Cropped image:", cropped.uri);

      const sendImageToBackend = async (imageUri) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("files", {
          uri: imageUri,
          name: `image_${imagesCaptured}.jpg`,
          type: "image/jpeg",
        });
        const classid = classData.classid;
        formData.append("classid", classid); // Add classid to the form data

        try {
          const response = await axios.post(
            `${BackendURL}/identify_from_images`, // Adjust the endpoint as needed
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log("Response from backend:", response.data);
          if (response?.data?.success) {
            console.log("Image saved successfully");
            navigation.goBack();
          } else {
            Alert.alert("Error", "Failed to save image. Please try again.");
          }
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.error("Error sending image to backend:", error);
        }
      };
      sendImageToBackend(cropped.uri);
    } catch (error) {
      console.error("Cropping failed:", error);
      setLoading(false);
    }
  };

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to access the camera.
        </Text>
        <TouchableOpacity style={styles.captureBtn} onPress={requestPermission}>
          <Text style={styles.captureBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Attendance</Text>

      <CameraView
        ref={cameraRef}
        facing="back"
        style={styles.camera}
        onCameraReady={() => console.log("Camera ready")}
      />

      <TouchableOpacity
        onPress={takePicture}
        disabled={croppingImage !== null}
        style={styles.captureBtn}
      >
        <Text style={styles.captureBtnText}>Capture Face</Text>
      </TouchableOpacity>

      <Text style={styles.note}>!!Can Take Multiple images</Text>

      {/* Crop Modal */}
      <Modal visible={!!croppingImage} animationType="slide">
        <View style={styles.cropContainer}>
          <Text style={styles.heading}>Image</Text>
          {croppingImage && (
            <Image
              source={{ uri: croppingImage.uri }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          )}
          <TouchableOpacity
            style={styles.cropBtn}
            onPress={handleCrop}
            disabled={loading}
          >
            {!loading && <Text style={styles.captureBtnText}>Save</Text>}
            {loading && <ActivityIndicator size="small" color="#fff" />}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.cropBtn, { backgroundColor: "#ccc" }]}
            onPress={() => setCroppingImage(null)}
          >
            <Text style={styles.captureBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    paddingTop: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  camera: {
    flex: 1,
    aspectRatio: 3 / 4,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },
  captureBtn: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  captureBtnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  note: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    marginTop: 6,
  },
  cropContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  previewImage: {
    width: "100%",
    height: 400,
    marginBottom: 20,
    borderRadius: 10,
  },
  cropBtn: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 10,
    width: "80%",
    marginTop: 10,
  },
});
