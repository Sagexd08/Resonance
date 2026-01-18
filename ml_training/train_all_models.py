"""
Master script to train all models and generate evaluation metrics.
Run this script to train all models and get F1 scores and confusion matrices.
"""
import subprocess
import sys
from pathlib import Path

def run_training_script(script_name, description):
    """Run a training script and capture output."""
    print(f"\n{'='*60}")
    print(f"Training: {description}")
    print(f"{'='*60}")
    
    try:
        result = subprocess.run(
            [sys.executable, script_name],
            capture_output=True,
            text=True,
            check=True
        )
        print(result.stdout)
        if result.stderr:
            print("Warnings/Errors:", result.stderr)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error running {script_name}:")
        print(e.stdout)
        print(e.stderr)
        return False

def main():
    """Train all models in sequence."""
    print("="*60)
    print("Resonance ML Model Training Pipeline")
    print("="*60)
    
                                      
    from config import DROWSINESS_DATA_DIR, RAVDESS_DATA_DIR, BURNOUT_DATA_DIR
    
    datasets_ready = (
        DROWSINESS_DATA_DIR.exists() and any(DROWSINESS_DATA_DIR.rglob("*")) and
        RAVDESS_DATA_DIR.exists() and any(RAVDESS_DATA_DIR.rglob("*.wav")) and
        BURNOUT_DATA_DIR.exists() and any(BURNOUT_DATA_DIR.rglob("*.csv"))
    )
    
    if not datasets_ready:
        print("\n[WARNING] Datasets may not be downloaded.")
        print("Run 'python download_datasets.py' first.")
        response = input("Continue anyway? (y/n): ")
        if response.lower() != 'y':
            return
    
                             
    from config import MODELS_DIR
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    
                  
    results = {}
    
                            
    results['fatigue'] = run_training_script(
        'train_fatigue_model.py',
        'Fatigue Detection Model (ResNet)'
    )
    
                          
    results['voice'] = run_training_script(
        'train_voice_model.py',
        'Voice Stress Detection Model (Wav2Vec2)'
    )
    
                            
    results['burnout'] = run_training_script(
        'train_burnout_model.py',
        'Burnout Prediction Model (XGBoost)'
    )
    
             
    print(f"\n{'='*60}")
    print("Training Summary")
    print(f"{'='*60}")
    for model_name, success in results.items():
        status = "[OK]" if success else "[FAILED]"
        print(f"{status} {model_name.capitalize()} Model")
    
    if all(results.values()):
        print("\n[SUCCESS] All models trained successfully!")
        print("\nNext steps:")
        print("1. Review confusion matrices in ml_training/models/")
        print("2. Run: python convert_to_onnx.py")
        print("3. Copy ONNX models to ml_lambda/models/")
    else:
        print("\n[WARNING] Some models failed to train. Check errors above.")

if __name__ == "__main__":
    main()
