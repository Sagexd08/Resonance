"""
Configuration file for ML model training.
Contains hyperparameters, paths, and model settings.
"""
from pathlib import Path

# Base paths
BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"
MODELS_DIR = BASE_DIR / "models"

# Dataset paths
BURNOUT_DATA_DIR = DATA_DIR / "burnout"
RAVDESS_DATA_DIR = DATA_DIR / "ravdess"
DROWSINESS_DATA_DIR = DATA_DIR / "drowsiness"

# Model output paths
FATIGUE_MODEL_PATH = MODELS_DIR / "fatigue_resnet.pth"
VOICE_MODEL_PATH = MODELS_DIR / "voice_wav2vec2.pth"
BURNOUT_MODEL_PATH = MODELS_DIR / "burnout_xgboost.pkl"

# Fatigue Model (ResNet) Configuration
FATIGUE_CONFIG = {
    "model_name": "resnet18",  # or "resnet34"
    "num_classes": 2,  # alert/drowsy
    "input_size": (224, 224),
    "batch_size": 32,
    "learning_rate": 1e-4,
    "num_epochs": 20,
    "early_stopping_patience": 5,
    "train_split": 0.8,
    "dropout": 0.5,
    "weight_decay": 1e-4,
}

# Voice Model (Wav2Vec2) Configuration
VOICE_CONFIG = {
    "model_name": "facebook/wav2vec2-base",
    "num_classes": 8,  # RAVDESS emotions
    "sample_rate": 16000,
    "max_audio_length": 6.0,  # seconds
    "batch_size": 8,  # Smaller due to memory constraints
    "learning_rate": 3e-5,
    "num_epochs": 10,
    "early_stopping_patience": 3,
    "freeze_encoder_epochs": 2,  # Freeze encoder for first N epochs
    "weight_decay": 0.01,
}

# Emotion to stress mapping (for RAVDESS)
EMOTION_TO_STRESS = {
    "neutral": 0.3,
    "calm": 0.2,
    "happy": 0.1,
    "sad": 0.6,
    "angry": 0.9,
    "fearful": 0.85,
    "disgust": 0.8,
    "surprised": 0.4,
}

# Burnout Model (XGBoost) Configuration
BURNOUT_CONFIG = {
    "n_estimators": 100,
    "max_depth": 6,
    "learning_rate": 0.1,
    "subsample": 0.8,
    "colsample_bytree": 0.8,
    "random_state": 42,
    "cv_folds": 5,
}

# ONNX Export Configuration
ONNX_CONFIG = {
    "dynamic_axes": {
        "input": {0: "batch_size"},
        "output": {0: "batch_size"}
    },
    "opset_version": 13,
    "do_constant_folding": True,
}

# Device configuration
DEVICE = "cuda"  # Change to "cpu" if no GPU available
