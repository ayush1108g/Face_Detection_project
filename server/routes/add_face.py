from fastapi import APIRouter, UploadFile, File, Form, HTTPException
import os
import pickle
import numpy as np
import cv2
from services.embedding import extract_embedding

router = APIRouter()

@router.post("/save_face_embedding")
async def save_face_embedding(
    file: UploadFile = File(...),
    rollno: str = Form(...),
    name: str = Form(...),
):
    try:
        # 1. Read and decode the image
        image_bytes = await file.read()
        if not image_bytes:
            raise HTTPException(status_code=400, detail="Empty file uploaded")

        if not rollno:
            raise HTTPException(status_code=400, detail="Empty roll number")

        if not name:
            raise HTTPException(status_code=400, detail="Invalid name")

        rollno = rollno.lower()
        name = name.lower()

        image_np = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(image_np, cv2.IMREAD_COLOR)
        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image format")

        # 2. Create directory and save image
        person_key = f"{rollno}-{name.replace(' ', '_')}"
        save_dir = os.path.join("../faces", person_key)
        os.makedirs(save_dir, exist_ok=True)

        image_path = os.path.join(save_dir, file.filename)
        with open(image_path, "wb") as f:
            f.write(image_bytes)

        # 3. Extract embedding from image
        temp = []
        embeddings = extract_embedding(img, temp)
        if not embeddings:
            raise HTTPException(status_code=400, detail="No face found in the image")

        # Assuming one face per image
        new_embedding = embeddings[0]  # Shape: (512,)

        # 4. Load existing embeddings
        embeddings_path = "../reference_embeddings.pkl"
        if os.path.exists(embeddings_path):
            with open(embeddings_path, "rb") as f:
                reference_embeddings = pickle.load(f)
        else:
            reference_embeddings = {}

        # 5. Add or update entry with mean of embeddings
        if person_key in reference_embeddings:
            existing_embedding = reference_embeddings[person_key]
            
            # Convert both to numpy and average
            avg_embedding = np.mean(np.array([existing_embedding, new_embedding]), axis=0)
            reference_embeddings[person_key] = avg_embedding
        else:
            reference_embeddings[person_key] = new_embedding
        
        # 6. Save back to pickle
        with open(embeddings_path, "wb") as f:
            pickle.dump(reference_embeddings, f)

        return {
            "success": True,
            "message": "Embedding saved successfully",
            "person_key": person_key,
            "image_path": image_path
        }

    except Exception as e:
        print(f"Exception in saving face embedding: {e}")
        raise HTTPException(status_code=500, detail=str(e))
