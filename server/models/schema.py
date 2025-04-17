from pydantic import BaseModel
from typing import List

class FaceEmbeddingRequest(BaseModel):
    embeddings: List[List[float]]  # List of N x 512 embeddings

class FaceMatchResponse(BaseModel):
    person: str
    face_idx: int
    confidence: float