# routes/user_routes.py
from fastapi import APIRouter, HTTPException
from models.models import UserRegister
from database.db import db, hash_password

router = APIRouter()

@router.post("/user/register")
def register_user(data: UserRegister):
    if db.users.find_one({"rollno": data.rollno}):
        raise HTTPException(status_code=400, detail="User already exists")

    # Find all classes matching branch & batch
    matching_classes = list(db.classes.find({"branch": data.branch, "batch": data.batch}))
    class_ids = [cls["classid"] for cls in matching_classes]

    # Insert user
    db.users.insert_one({
        "name": data.name,
        "rollno": data.rollno,
        "branch": data.branch,
        "batch": data.batch,
        "password": hash_password(data.password),
        "classes": class_ids,
        "isAdmin": False
    })

    # Add rollno to each matching class
    for cls in matching_classes:
        db.classes.update_one(
            {"classid": cls["classid"]},
            {"$addToSet": {"rollno": data.rollno}}
        )

    return {
        "success": True,
        "message": "User registered and enrolled in relevant classes"
        }

    
@router.post("/user/login")
def login_user(rollno: str, password: str):
    user = db.users.find_one({"rollno": rollno})
    if not user or user["password"] != hash_password(password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {
        "success": True,
        "name": user["name"],
        "message": "User login successful"
    }
