from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import numpy as np
import os
import tensorflow as tf
from PIL import Image
from io import BytesIO

app = FastAPI(title="HealthCare AI API")

# Allow CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the Heart Disease model globally on startup (if it exists)
model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'heart_disease_rf.pkl')
heart_model = None
feature_names = None

try:
    if os.path.exists(model_path):
        with open(model_path, 'rb') as f:
            data = pickle.load(f)
            heart_model = data['model']
            feature_names = data['features']
        print("[INFO] Heart Disease Model loaded successfully.")
except Exception as e:
    print(f"[ERROR] Could not load Heart Disease Model: {e}")

# Load the Pneumonia CNN globally on startup (if it exists)
pneumonia_model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'pneumonia_cnn.h5')
pneumonia_model = None

try:
    if os.path.exists(pneumonia_model_path):
        pneumonia_model = tf.keras.models.load_model(pneumonia_model_path)
        print("[INFO] Pneumonia CNN Model loaded successfully.")
except Exception as e:
    print(f"[ERROR] Could not load Pneumonia CNN Model: {e}")

# Pydantic schema for the input data validation
class HeartDiseaseInput(BaseModel):
    age: float
    sex: float
    cp: float
    trestbps: float
    chol: float
    fbs: float
    restecg: float
    thalach: float
    exang: float
    oldpeak: float
    slope: float
    ca: float
    thal: float

@app.get("/")
def read_root():
    return {
        "status": "API is running", 
        "models_loaded": {
            "heart_disease": heart_model is not None,
            "pneumonia_cnn": pneumonia_model is not None
        }
    }

@app.post("/api/predict/heart-disease")
def predict_heart_disease(data: HeartDiseaseInput):
    if heart_model is None:
        return {"error": "Heart disease model is not loaded or missing."}
    
    # Ensure features are in the exact column order expected by the Random Forest model
    input_data = []
    for f in feature_names:
        input_data.append(getattr(data, f))
    
    # Inference
    input_array = np.array([input_data])
    prediction = heart_model.predict(input_array)[0]
    probabilities = heart_model.predict_proba(input_array)[0]
    
    risk_level = "High Risk" if prediction == 1 else "Low Risk"
    confidence = float(probabilities[1] if prediction == 1 else probabilities[0])
    
    return {
        "prediction": int(prediction),
        "risk_level": risk_level,
        "confidence": confidence
    }

@app.post("/api/predict/pneumonia")
async def predict_pneumonia(file: UploadFile = File(...)):
    if pneumonia_model is None:
        return {"error": "Pneumonia model is not loaded or missing."}
    
    try:
        # Read image
        contents = await file.read()
        image = Image.open(BytesIO(contents)).convert('RGB')
        
        # Resize to 224x224 for MobileNetV2
        image = image.resize((224, 224))
        
        # Convert to numpy array and normalize
        image_array = np.array(image) / 255.0
        
        # MobileNet expects a batch dimension: (1, 224, 224, 3)
        image_batch = np.expand_dims(image_array, axis=0)
        
        # Inference
        prediction = pneumonia_model.predict(image_batch)[0][0]
        
        # Interpret results
        risk_level = "High Risk of Pneumonia" if prediction > 0.5 else "Normal (Low Risk)"
        confidence = float(prediction if prediction > 0.5 else 1.0 - prediction)
        
        return {
            "prediction": float(prediction),
            "risk_level": risk_level,
            "confidence": confidence * 100 # return as percentage
        }
    except Exception as e:
        return {"error": f"Image processing failed: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
