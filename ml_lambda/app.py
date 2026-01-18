"""
AWS Lambda ML Inference Service using FastAPI + Mangum.
Handles fatigue detection (images) and voice stress detection (audio).
"""
import os
import numpy as np
from fastapi import FastAPI, UploadFile, File, HTTPException
from mangum import Mangum
import onnxruntime as ort
from preprocessing import preprocess_image, preprocess_audio, emotion_to_stress_score
from transformers import Wav2Vec2Processor
import torch

app = FastAPI(title="Resonance ML Inference Service")

# Global model sessions (loaded once at cold start)
fatigue_session = None
voice_processor = None
voice_model = None

# Model paths (will be in /var/task/models/ in Lambda)
MODEL_DIR = os.environ.get("MODEL_DIR", "/var/task/models")
FATIGUE_MODEL_PATH = os.path.join(MODEL_DIR, "fatigue_model.onnx")
VOICE_MODEL_PATH = os.path.join(MODEL_DIR, "voice_wav2vec2.pth")  # PyTorch for Wav2Vec2

# RAVDESS emotion labels (must match training)
EMOTION_LABELS = ["neutral", "calm", "happy", "sad", "angry", "fearful", "disgust", "surprised"]

def load_models():
    """Load models globally (called once at Lambda cold start)."""
    global fatigue_session, voice_processor, voice_model
    
    # Load fatigue model (ONNX)
    if os.path.exists(FATIGUE_MODEL_PATH):
        try:
            fatigue_session = ort.InferenceSession(
                FATIGUE_MODEL_PATH,
                providers=['CPUExecutionProvider']
            )
            print(f"✓ Loaded fatigue model from {FATIGUE_MODEL_PATH}")
        except Exception as e:
            print(f"✗ Error loading fatigue model: {e}")
            fatigue_session = None
    else:
        print(f"⚠ Fatigue model not found at {FATIGUE_MODEL_PATH}")
    
    # Load voice model (PyTorch - Wav2Vec2)
    # Note: For Lambda, we may need to use ONNX or quantized version
    # For now, we'll use a fallback heuristic if model not available
    if os.path.exists(VOICE_MODEL_PATH):
        try:
            from transformers import Wav2Vec2Model
            import torch.nn as nn
            
            # Load processor
            voice_processor = Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-base")
            
            # Load model (simplified - full implementation needs model class)
            # For MVP, we'll use librosa features as fallback
            print(f"⚠ Voice model loading requires full model architecture")
            print(f"  Using librosa feature-based fallback for now")
        except Exception as e:
            print(f"✗ Error loading voice model: {e}")
    
    print("Model loading complete")

# Load models at startup
load_models()

@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "service": "Resonance ML Inference",
        "status": "running",
        "fatigue_model_loaded": fatigue_session is not None,
        "voice_model_loaded": voice_processor is not None
    }

@app.post("/predict/fatigue")
async def predict_fatigue(file: UploadFile = File(...)):
    """
    Predict fatigue score from face image.
    
    Args:
        file: Image file (JPG/PNG)
    
    Returns:
        {"fatigue_score": float} where 1.0 = high fatigue
    """
    if fatigue_session is None:
        raise HTTPException(status_code=503, detail="Fatigue model not loaded")
    
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read image bytes
        image_bytes = await file.read()
        
        # Preprocess image
        preprocessed = preprocess_image(image_bytes)
        
        # Run inference
        input_name = fatigue_session.get_inputs()[0].name
        output = fatigue_session.run(None, {input_name: preprocessed})
        
        # Get prediction (binary classification: 0=alert, 1=drowsy)
        probs = np.exp(output[0][0])  # Apply softmax if needed
        if len(probs) == 2:
            fatigue_score = float(probs[1])  # Probability of drowsy class
        else:
            # If single output, use sigmoid
            fatigue_score = float(1.0 / (1.0 + np.exp(-output[0][0][0])))
        
        return {"fatigue_score": float(np.clip(fatigue_score, 0.0, 1.0))}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/predict/voice")
async def predict_voice(file: UploadFile = File(...)):
    """
    Predict stress score from audio.
    
    Args:
        file: Audio file (WAV/MP3)
    
    Returns:
        {"stress_score": float} where 1.0 = high stress
    """
    # Validate file type
    if not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="File must be an audio file")
    
    try:
        # Read audio bytes
        audio_bytes = await file.read()
        
        # Preprocess audio
        audio = preprocess_audio(audio_bytes)
        
        # If voice model is loaded, use it
        if voice_processor is not None and voice_model is not None:
            # Process with Wav2Vec2
            inputs = voice_processor(audio, sampling_rate=16000, return_tensors="pt", padding=True)
            with torch.no_grad():
                outputs = voice_model(inputs.input_values)
                probs = torch.softmax(outputs, dim=1).numpy()[0]
            
            # Map to stress score
            stress_score = emotion_to_stress_score(probs, EMOTION_LABELS)
        else:
            # Fallback: Use librosa features for heuristic stress detection
            import librosa
            
            # Extract features
            mfccs = librosa.feature.mfcc(y=audio, sr=16000, n_mfcc=13)
            spectral_centroid = librosa.feature.spectral_centroid(y=audio, sr=16000)[0]
            zero_crossing_rate = librosa.feature.zero_crossing_rate(audio)[0]
            
            # Heuristic: Higher spectral centroid and ZCR = more stress
            # Normalize features
            mfcc_mean = np.mean(mfccs)
            centroid_mean = np.mean(spectral_centroid)
            zcr_mean = np.mean(zero_crossing_rate)
            
            # Simple heuristic mapping (0-1)
            stress_score = float(np.clip(
                (centroid_mean / 5000.0 + zcr_mean * 10.0) / 2.0,
                0.0, 1.0
            ))
        
        return {"stress_score": float(np.clip(stress_score, 0.0, 1.0))}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

# Lambda handler
handler = Mangum(app, lifespan="off")
