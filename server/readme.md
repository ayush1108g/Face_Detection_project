# Face Recognition API Server

This is a FastAPI-based backend server designed for handling face recognition functionalities, user and class management for an educational or institutional setup.

## Features

- Add and manage users
- Add and manage teachers
- Create and fetch classes
- Add face data for users
- Recognize faces through camera or image feed
- MongoDB-based data persistence

## Technologies Used

- **FastAPI** - Web framework
- **Uvicorn** - ASGI server
- **MongoDB** - NoSQL database
- **Pymongo** - MongoDB client
- **OpenCV / Face Recognition** - used for facial recognition logic

## Project Structure

```
face-recognition-api/
├── main.py                 # Entry point of the application
├── routes/                # API route handlers
│   ├── face_recognition.py
│   ├── add_face.py
│   ├── user_routes.py
│   ├── teacher_routes.py
│   └── class_routes.py
├── models/                # Pydantic schemas
├── utils/                 # Helper functions (e.g., DB connection, face processing)
├── requirements.txt       # Python dependencies
└── README.md              # Project documentation
```

## Setup Server Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/face-recognition-api.git
cd face-recognition-api
cd server
```

### 2. Create and Activate a Virtual Environment

```bash
python3 -m venv myenv
source myenv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Set Up MongoDB
Ensure MongoDB is installed and running locally or provide a remote connection string in your code.
Add .env file and Add the MongoDB connection string

### 5. Run the Server

```bash
uvicorn main:app --reload
```

The server will start at `http://127.0.0.1:8000`

## API Endpoints

| Method | Endpoint                 | Description                       |
| ------ | ------------------------ | --------------------------------- |
| GET    | `/`                      | Server health check               |
| POST   | `/face/recognize`        | Recognize a face                  |
| POST   | `/face/add`              | Add a new face to the system      |
| GET    | `/user/{rollno}/classes` | Fetch user classes by roll number |
| POST   | `/class/create`          | Create a new class                |
| POST   | `/user/create`           | Create a new user                 |
| POST   | `/teacher/create`        | Create a new teacher              |

---

