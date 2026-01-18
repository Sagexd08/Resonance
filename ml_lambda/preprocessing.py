"""
Preprocessing utilities for image and audio data in Lambda.
"""
import numpy as np
from PIL import Image
import librosa
import io

                              
IMAGENET_MEAN = np.array([0.485, 0.456, 0.406])
IMAGENET_STD = np.array([0.229, 0.224, 0.225])

def preprocess_image(image_bytes: bytes, target_size=(224, 224)) -> np.ndarray:
    """
    Preprocess image for ResNet model.
    
    Args:
        image_bytes: Raw image bytes
        target_size: Target image size (height, width)
    
    Returns:
        Preprocessed image array (1, 3, H, W) ready for ONNX inference
    """
                
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    
            
    image = image.resize(target_size, Image.Resampling.LANCZOS)
    
                                                    
    img_array = np.array(image, dtype=np.float32) / 255.0
    
                                   
    img_array = (img_array - IMAGENET_MEAN) / IMAGENET_STD
    
                                                   
    img_array = img_array.transpose(2, 0, 1)              
    img_array = np.expand_dims(img_array, axis=0)                       
    
    return img_array.astype(np.float32)

def preprocess_audio(audio_bytes: bytes, sample_rate=16000, max_length=6.0) -> np.ndarray:
    """
    Preprocess audio for Wav2Vec2 model.
    
    Args:
        audio_bytes: Raw audio bytes
        sample_rate: Target sample rate
        max_length: Maximum audio length in seconds
    
    Returns:
        Preprocessed audio array ready for Wav2Vec2
    """
                
    audio, sr = librosa.load(io.BytesIO(audio_bytes), sr=sample_rate, mono=True)
    
                                   
    max_samples = int(max_length * sample_rate)
    if len(audio) > max_samples:
        audio = audio[:max_samples]
    else:
        audio = np.pad(audio, (0, max_samples - len(audio)), mode='constant')
    
               
    if np.max(np.abs(audio)) > 0:
        audio = audio / np.max(np.abs(audio))
    
    return audio.astype(np.float32)

def emotion_to_stress_score(emotion_probs: np.ndarray, emotion_labels: list) -> float:
    """
    Map emotion probabilities to stress score (0-1).
    
    Args:
        emotion_probs: Array of emotion probabilities
        emotion_labels: List of emotion labels in order
    
    Returns:
        Stress score (0-1) where 1 = high stress
    """
    emotion_to_stress = {
        "neutral": 0.3,
        "calm": 0.2,
        "happy": 0.1,
        "sad": 0.6,
        "angry": 0.9,
        "fearful": 0.85,
        "disgust": 0.8,
        "surprised": 0.4,
    }
    
                                     
    stress_score = 0.0
    for i, emotion in enumerate(emotion_labels):
        if emotion in emotion_to_stress:
            stress_score += emotion_probs[i] * emotion_to_stress[emotion]
    
    return float(np.clip(stress_score, 0.0, 1.0))
