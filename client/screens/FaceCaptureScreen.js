import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Camera } from "expo-camera";
import * as Progress from "react-native-progress";

export default function FaceCaptureScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [imagesCaptured, setImagesCaptured] = useState(0);
  const cameraRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing && imagesCaptured < 3) {
      try {
        setIsCapturing(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
        });

        // Optional: Add face detection/cropping logic here
        // or show a modal for user to crop manually (advanced step)

        // Store image (you can upload/store in async storage or state)
        console.log("Captured Image URI:", photo.uri);

        setImagesCaptured((prev) => prev + 1);

        if (imagesCaptured + 1 === 3) {
          Alert.alert("Done!", "All 3 face images captured!");
          // Proceed to next step
          navigation.navigate("Home"); // or wherever
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsCapturing(false);
      }
    }
  };

  if (hasPermission === null) return <ActivityIndicator size="large" />;
  if (hasPermission === false)
    return <Text>No access to camera. Please enable permissions.</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Face Registration</Text>

      <Progress.Bar
        progress={imagesCaptured / 3}
        width={null}
        color="#007AFF"
        borderRadius={8}
        height={14}
        style={{ marginBottom: 20 }}
      />

      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={Camera.Constants.Type.front}
      />

      <TouchableOpacity
        onPress={takePicture}
        disabled={isCapturing}
        style={styles.captureBtn}
      >
        <Text style={styles.captureBtnText}>
          {isCapturing ? "Capturing..." : "Capture Face"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.note}>
        ⚠️ Make sure only one face is visible in the image.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    paddingTop: 40,
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
});
