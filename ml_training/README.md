# ML Model Training Pipeline

This directory contains scripts for downloading datasets, training models, and converting them to ONNX format for Lambda deployment.

## Setup

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up Kaggle API credentials:**
   - Create account at https://kaggle.com
   - Go to Account → API → Create New Token
   - Place `kaggle.json` in `~/.kaggle/` directory
   - Set permissions: `chmod 600 ~/.kaggle/kaggle.json`

## Usage

### Step 1: Download Datasets

```bash
python download_datasets.py
```

This will download:
- Employee burnout challenge dataset → `data/burnout/`
- RAVDESS emotional speech audio → `data/ravdess/`
- Driver drowsiness dataset → `data/drowsiness/`

### Step 2: Train Models

**Train Fatigue Detection Model (ResNet):**
```bash
python train_fatigue_model.py
```

**Train Voice Stress Detection Model (Wav2Vec2):**
```bash
python train_voice_model.py
```

**Train Burnout Prediction Model (XGBoost):**
```bash
python train_burnout_model.py
```

### Step 3: Convert to ONNX

```bash
python convert_to_onnx.py
```

This converts PyTorch models to ONNX format for Lambda deployment.

### Step 4: Copy Models to Lambda

```bash
# Copy ONNX models to Lambda directory
cp models/fatigue_model.onnx ../ml_lambda/models/
# Note: Voice model may need special handling (see convert_to_onnx.py)
```

## Model Details

### Fatigue Detection (ResNet18)
- **Input:** 224x224 RGB face images
- **Output:** Fatigue score (0-1)
- **Dataset:** Driver drowsiness dataset
- **Training Time:** ~30-60 minutes (GPU) or 2-4 hours (CPU)

### Voice Stress Detection (Wav2Vec2)
- **Input:** 16kHz mono audio (max 6 seconds)
- **Output:** Stress score (0-1) mapped from emotion predictions
- **Dataset:** RAVDESS emotional speech
- **Training Time:** ~1-2 hours (GPU) or 8-12 hours (CPU)

### Burnout Prediction (XGBoost)
- **Input:** Tabular features (work hours, workload, etc.)
- **Output:** Burnout probability (0-1)
- **Dataset:** Employee burnout challenge
- **Training Time:** ~5-10 minutes

## Notes

- GPU recommended for Wav2Vec2 training (significantly faster)
- Models are saved to `models/` directory
- ONNX models are optimized for Lambda deployment
- Wav2Vec2 model may be large (~95MB) - consider quantization if needed
