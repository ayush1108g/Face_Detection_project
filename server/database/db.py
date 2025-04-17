# app/database/db.py
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import hashlib

# Load environment variables from .env file
load_dotenv()

# MongoDB URI (from .env)
MONGO_URL = os.getenv("MONGO_URI", "mongodb://localhost:27017")

# MongoDB client connection
client = MongoClient(MONGO_URL)


# Connect to the specific database
db = client["dsp_attendence_system"]

print("Database Connected")

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()