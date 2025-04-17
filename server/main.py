from fastapi import FastAPI
from routes import face_recognition,add_face, user_routes, teacher_routes, class_routes

app = FastAPI(title="Face Recognition API", version="1.0")

# Include Routers
app.include_router(face_recognition.router, tags=["Face Recognition"])
app.include_router(add_face.router,tags=["Add a Face"])

app.include_router(user_routes.router, tags=["Users"])
app.include_router(teacher_routes.router, tags=["Teachers"])
app.include_router(class_routes.router, tags=["Classes"])

@app.get("/")
def read_root():
    return {"message": "Face Recognition API is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)


# run the server
# source myenv/bin/activate
# python3 -m uvicorn main:app --reload

