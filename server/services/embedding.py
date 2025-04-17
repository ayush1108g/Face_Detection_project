import cv2
import numpy as np
import insightface
from insightface.app import FaceAnalysis
import matplotlib.pyplot as plt
import math
from ultralytics import YOLO  

import pickle


# Load YOLO model (custom trained on faces or pretrained face model)
yolo_model = YOLO("/home/ayush/DSP_Project/best_yolo_model.pt")  # Custom trained model here

# Initialize InsightFace (ArcFace) model
app = FaceAnalysis(name='buffalo_l', providers=['CPUExecutionProvider'])
app.prepare(ctx_id=0, det_size=(320, 320))

def extract_embedding(img, temp, printimage=False):
    
    if img is None:
        print(f"❌ Error: Couldn't load '{image_path}'")
        return None

    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # YOLO inference
    results = yolo_model(img_rgb)
    detections = results[0].boxes

    if detections is None or len(detections) == 0:
        print(f"❌ No face detected in {image_path}")
        return None

    embeddings = []
    count = 0
    num_faces = len(detections)
    rows = min(5, num_faces)
    cols = math.ceil(num_faces / rows)

    if printimage:
        fig, ax = plt.subplots(rows, cols, figsize=(5 * cols, 5 * rows))
        ax = np.array(ax).reshape(rows, cols)

    for idx, box in enumerate(detections):
        x1, y1, x2, y2 = map(int, box.xyxy[0].cpu().numpy())
        x1, y1 = max(x1, 0), max(y1, 0)
        x2, y2 = min(x2, img.shape[1]), min(y2, img.shape[0])

        # Crop face
        face_crop = img[y1:y2, x1:x2]

        # Extract embedding using InsightFace
        detected_faces = app.get(face_crop)

        if len(detected_faces) > 0:
            embedding = detected_faces[0].normed_embedding
            embeddings.append(embedding)
            temp.append(face_crop)

            if printimage:
                row, col = divmod(idx, cols)
                ax[row, col].imshow(cv2.cvtColor(face_crop, cv2.COLOR_BGR2RGB))
                ax[row, col].set_title(f"Face {idx + 1}")
                ax[row, col].axis("off")

    return embeddings




def identify_person(group_embeddings, threshold=0.5):
    
    # Load reference embeddings
    with open("reference_embeddings.pkl", "rb") as f:
        reference_embeddings = pickle.load(f)

    # Convert reference embeddings (M×512) to a NumPy array of shape (M, 512)
    persons = list(reference_embeddings.keys())  # List of person names
    ref_matrix = np.array([reference_embeddings[person] for person in persons])  # Shape: (M, 512)
    
    group_embeddings = np.array(group_embeddings)  # Shape: (N, 512)

    # Invert current embeddings (N×512 → 512×N)
    group_matrix = group_embeddings.T  # Shape: (512, N)

    # Compute similarity using matrix multiplication (M×512) · (512×N) = (M×N)
    similarity_matrix = np.dot(ref_matrix, group_matrix)  # Shape: (M, N)

    # Normalize similarity scores (optional)
    similarity_matrix = (similarity_matrix - similarity_matrix.min()) / (similarity_matrix.max() - similarity_matrix.min())

    match_results = []
    used_indices = set()  # Track assigned indices

    # Iterate through each row (M) — checking reference persons
    sorted_matches = []  # Store all matches before filtering
    for i, similarities in enumerate(similarity_matrix):
        best_idx = np.argmax(similarities)  # Index of max similarity
        best_score = similarities[best_idx]  # Max similarity score

        if best_score > threshold:  # Check threshold
            sorted_matches.append((persons[i], best_idx, best_score))

    # Sort matches by confidence score (highest first)
    sorted_matches.sort(key=lambda x: x[2], reverse=True)

    # Assign unique indices only
    for person, idx, score in sorted_matches:
        if idx not in used_indices:  # Ensure uniqueness
            match_results.append((person, idx, score))
            used_indices.add(idx)  # Mark index as used

    return match_results

