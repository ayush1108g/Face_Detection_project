from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from typing import List
import numpy as np
import cv2
from datetime import datetime
from services.embedding import extract_embedding, identify_person
from models.schema import FaceMatchResponse
from database.db import db
from bson import ObjectId  # To handle MongoDB ObjectId

router = APIRouter()

@router.post("/identify_from_images", response_model=dict)
async def identify_from_images(
    classid: str = Form(...),
    files: List[UploadFile] = File(...)
):
    """Receive multiple images, identify persons, mark attendance, and update class & teacher records."""
    try:
        # Step 1: Check if class exists
        class_data = db.classes.find_one({"classid": classid})
        if not class_data:
            raise HTTPException(status_code=404, detail="Class not found")

        present_rollnos = set()

        # Step 2: Process each image
        for file in files:
            image_bytes = await file.read()
            if not image_bytes:
                raise HTTPException(status_code=400, detail="Empty file uploaded")

            image_np = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(image_np, cv2.IMREAD_COLOR)
            if img is None:
                raise HTTPException(status_code=400, detail="Invalid image format")

            temp = []
            embeddings = extract_embedding(img, temp)
            if not embeddings:
                continue

            matches = identify_person(embeddings, threshold=0.65)
            for person, _, _ in matches:
                if '-' in person:
                    rollno = person.split('-')[0]
                    present_rollnos.add(rollno)

        if not present_rollnos:
            raise HTTPException(status_code=404, detail="No valid roll numbers detected")

        today = datetime.utcnow().strftime('%Y-%m-%d')

        # Step 3: Mark attendance for class
        existing_attendance = db.attendance.find_one({"classid": classid, "date": today})
        if existing_attendance:
            db.attendance.update_one(
                {"_id": existing_attendance["_id"]},
                {"$addToSet": {"studentPresent": {"$each": list(present_rollnos)}}}
            )
            attendance_id = existing_attendance["_id"]
        else:
            attendance_doc = {
                "classid": classid,
                "date": today,
                "studentPresent": list(present_rollnos)
            }
            result = db.attendance.insert_one(attendance_doc)
            attendance_id = result.inserted_id

            # Step 4: Update class's attendance array
            db.classes.update_one(
                {"classid": classid},
                {"$addToSet": {"attendence": attendance_id}}  # Note spelling
            )

            # Step 5: Update teacher's attendance array
            teacher_id = class_data.get("teacherid")
            if teacher_id:
                db.users.update_one(
                    {"userid": teacher_id},
                    {"$addToSet": {"attendence": attendance_id}}
                )

        return {
            "success": True,
            "classid": classid,
            "students_present": list(present_rollnos),
            "date": today,
            "attendance_id": str(attendance_id)
        }

    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
