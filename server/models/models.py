from pydantic import BaseModel
from typing import List, Optional

# ---------- USER ----------
class UserRegister(BaseModel):
    name: str
    rollno: str
    branch: str  # "EE" or "ECE"
    batch: int   # 21, 22, 23, 24
    password: str
    isAdmin: Optional[bool] = False  # default False
    classes: Optional[List[str]] = []

# ---------- TEACHER ----------
class TeacherRegister(BaseModel):
    id: str
    name: str
    pass_: str  
    classes: Optional[List[str]] = []

# ---------- CLASS ----------
class ClassCreate(BaseModel):
    classid: str
    subject: str
    branch: str
    batch: int
    teacher_id: str

# ---------- ATTENDANCE ----------
class AttendanceCreate(BaseModel):
    classid: str
    date: str  # ISO format string
    studentPresent: List[str]
