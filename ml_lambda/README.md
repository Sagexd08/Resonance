# AWS Lambda ML Inference Service

FastAPI-based ML inference service deployed on AWS Lambda for fatigue and voice stress detection.

## Architecture

- **Framework:** FastAPI + Mangum (Lambda adapter)
- **Runtime:** Python 3.9 (AWS Lambda base image)
- **Models:** ONNX Runtime for inference (CPU-only)
- **Endpoints:**
  - `POST /predict/fatigue` - Image-based fatigue detection
  - `POST /predict/voice` - Audio-based stress detection

## Local Development

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run locally with uvicorn:**
   ```bash
   uvicorn app:app --reload --port 8000
   ```

3. **Test endpoints:**
   ```bash
   # Test fatigue endpoint
   curl -X POST http://localhost:8000/predict/fatigue \
     -F "file=@test_image.jpg"

   # Test voice endpoint
   curl -X POST http://localhost:8000/predict/voice \
     -F "file=@test_audio.wav"
   ```

## Docker Build

```bash
# Build Docker image
docker build -t resonance-ml .

# Test locally
docker run -p 9000:8080 resonance-ml
```

## AWS Lambda Deployment

1. **Build and push to ECR:**
   ```bash
   # Login to ECR
   aws ecr get-login-password --region us-east-1 | \
     docker login --username AWS --password-stdin \
     [ACCOUNT_ID].dkr.ecr.us-east-1.amazonaws.com

   # Build and tag
   docker build -t resonance-ml .
   docker tag resonance-ml:latest \
     [ACCOUNT_ID].dkr.ecr.us-east-1.amazonaws.com/resonance-ml:latest

   # Push
   docker push [ACCOUNT_ID].dkr.ecr.us-east-1.amazonaws.com/resonance-ml:latest
   ```

2. **Create Lambda Function:**
   - Go to AWS Lambda Console
   - Create Function → Container Image
   - Select ECR image
   - **Memory:** 3008 MB (for faster CPU)
   - **Timeout:** 30 seconds
   - Create Function URL (NONE auth for demo)

3. **Environment Variables:**
   - `MODEL_DIR=/var/task/models` (default, usually not needed)

## Model Requirements

- Place ONNX models in `models/` directory:
  - `fatigue_model.onnx` - ResNet-based fatigue detection
  - `voice_model.onnx` - Wav2Vec2-based voice stress (optional, uses fallback if missing)

## Notes

- Models are loaded once at cold start (global variables)
- Cold start time: ~2-3 seconds (with Wav2Vec2 model)
- Consider Lambda Provisioned Concurrency for production
- Wav2Vec2 model may be large - consider quantization if needed
