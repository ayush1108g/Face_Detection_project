# routes/class_routes.py
from fastapi import APIRouter, HTTPException,Query
from models.models import ClassCreate
from database.db import db
from datetime import datetime
from fastapi.encoders import jsonable_encoder
from bson import ObjectId


def clean_mongo_object(obj):
    if isinstance(obj, list):
        return [clean_mongo_object(item) for item in obj]
    elif isinstance(obj, dict):
        return {key: clean_mongo_object(value) for key, value in obj.items()}
    elif isinstance(obj, ObjectId):
        return str(obj)
    elif isinstance(obj, datetime):
        return obj.isoformat()
    else:
        return obj

router = APIRouter()

@router.post("/teacher/add-class")
def add_class(data: ClassCreate):
    if db.classes.find_one({"classid": data.classid}):
        raise HTTPException(status_code=400, detail="Class already exists")

    # Get all users matching branch + batch
    matching_users = list(db.users.find({"branch": data.branch, "batch": data.batch}))
    rollnos = [u["rollno"] for u in matching_users]

    # Insert class
    db.classes.insert_one({
        "classid": data.classid,
        "subject": data.subject,
        "teacher_id":data.teacher_id,
        "branch": data.branch,
        "batch": data.batch,
        "dateCreated": datetime.utcnow().isoformat(),
        "attendence": [],
        "rollno": rollnos
    })

    # Add this class to each user’s 'classes' list
    for user in matching_users:
        db.users.update_one(
            {"rollno": user["rollno"]},
            {"$addToSet": {"classes": data.classid}}
        )

    # Add class to teacher's record
    db.teachers.update_one(
        {"id": data.teacher_id},
        {"$addToSet": {"classes": data.classid}}
    )

    return {
        "success": True,
        "message": f"Class {data.classid} created and users enrolled"}




@router.get("/teacher/get-attendance-sheet/{classid}")
def get_attendance_sheet(classid: str):
    class_data = db.classes.find_one({"classid": classid})
    if not class_data:
        raise HTTPException(status_code=404, detail="Class not found")

    all_rollnos = db.users.find({"branch": class_data["branch"], "batch": class_data["batch"]})
    rollnos = [r["rollno"] for r in all_rollnos]

    table = {}
    for att_id in class_data["attendence"]:
        print(att_id)
        att = db.attendance.find_one({"_id": att_id})
        print(att)
        if not att: continue
        row = {roll: ("P" if roll in att["studentPresent"] else "A") for roll in rollnos}
        table[att["date"]] = row

    return {
        "success": True,
        "attendance_table": table
        }


# ------------------------
# Get User's Classes
# ------------------------
@router.get("/user/{rollno}/classes")
def get_user_classes(rollno: str):
    user = db.users.find_one({"rollno": rollno})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    classes = list(db.classes.find({"classid": {"$in": user.get("classes", [])}}))
    classes = clean_mongo_object(classes)

    return {
        "success": True,
        "classes": classes,
    }
# ------------------------
# Get Attendance of a User in a Class
# ------------------------
@router.get("/user/{rollno}/attendance/{classid}")
def get_user_attendance_in_class(rollno: str, classid: str):
    class_data = db.classes.find_one({"classid": classid})
    if not class_data:
        raise HTTPException(status_code=404, detail="Class not found")

    attendance_records = list(db.attendance.find({"classid": classid}))
    result = []
    for record in attendance_records:
        result.append({
            "date": record["date"],
            "present": rollno in record.get("studentPresent", [])
        })

    return {
        "success": True,
        "classid": classid,
        "rollno": rollno,
        "attendance": result
    }



@router.get("/teacher/classes")
def get_teacher_classes(id: str = Query(..., description="Teacher ID")):
    teacher_classes = list(db.classes.find({"teacher_id": id}))

    if not teacher_classes:
        raise HTTPException(status_code=404, detail="No classes found for this teacher.")

    cleaned = clean_mongo_object(teacher_classes)

    return {
        "success": True,
        "classes": cleaned
    }