# Face Recognition Model Training & Evaluation

This document describes the training and evaluation pipeline for the face detection and recognition model used in the project.

## Overview
The model is designed to detect faces in images and extract their embeddings for recognition. The pipeline includes:

- Training a face detection model on WIDER FACE dataset
- Validating model performance
- Extracting facial features using InsightFace
- Matching faces using cosine similarity

---

## Dataset

### WIDER FACE Dataset
- **Link**: [WIDER FACE Official Website](http://shuoyang1213.me/WIDERFACE/)
- **Content**: Contains 32,203 images and 393,703 labeled faces with variations in scale, pose, and occlusion.
- **Usage**:
  - **Training**: WiderFace training set
  - **Validation**: WiderFace validation set

---

## Model Architecture & Training

- **Backbone**: Pre-trained YOLO
- **Input Format**: Raw images with bounding box annotations for faces
- **Loss Function**: Object detection loss (classification + bounding box regression)
- **Framework**: PyTorch / TensorFlow 

---

## Evaluation Metrics

Model performance is reported for the face detection task as follows:

### Class 0 - Face:
- **Precision**: 85.95%
- **Recall**: 62.89%
- **AP@0.5**: 71.14%
- **AP@0.5:0.95**: 39.85%

These metrics confirm that the model performs reliably at detecting faces in varied conditions.

---

## Face Feature Extraction

- **Library Used**: [InsightFace](https://github.com/deepinsight/insightface)
- **Model**: Pretrained ArcFace model (typically using ResNet100)
- **Output**: 512-dimensional facial embeddings

---

## Face Matching

Once embeddings are generated:

- **Matching Algorithm**: Cosine similarity
- **Thresholding**: Matching threshold (typically between 0.5 and 0.7 based on experiments)
- **Storage**: Facial embeddings are stored in a persistent database and indexed by user ID

---

## Usage

The model is deployed as part of the backend server, where it handles:

- Adding new face data to the system (embedding generation)
- Comparing captured faces with stored embeddings

---

## Notes

- Future improvements could include training with hard example mining or ensemble detectors.
- Additional fine-tuning on a custom dataset may further improve accuracy in specific environments.

---

For more information, refer to the full backend system documentation.

