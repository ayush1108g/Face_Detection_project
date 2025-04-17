# routes/teacher_routes.py
from fastapi import APIRouter, HTTPException
from models.models import TeacherRegister
from database.db import db, hash_password

router = APIRouter()

@router.post("/teacher/register")
def register_teacher(data: TeacherRegister):
    if db.teachers.find_one({"id": data.id}):
        raise HTTPException(status_code=400, detail="Teacher already exists")

    db.teachers.insert_one({
        "id": data.id,
        "name": data.name,
        "pass": hash_password(data.pass_),
        "classes": []
    })

    return {
        "success": True,
        "message": "Teacher registered successfully"
        }

@router.post("/teacher/login")
def login_teacher(id: str, password: str):
    teacher = db.teachers.find_one({"id": id})
    if not teacher or teacher["pass"] != hash_password(password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {
        "success": True,
        "message": "Teacher login successful"
        }
