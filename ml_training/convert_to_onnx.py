"""
Convert trained PyTorch models to ONNX format for Lambda deployment.
"""
import torch
import torch.onnx
from pathlib import Path
import config

def convert_fatigue_model():
    """Convert ResNet fatigue model to ONNX."""
    print("="*60)
    print("Converting Fatigue Model to ONNX")
    print("="*60)
    
                             
    from torchvision import models
    import torch.nn as nn
    
    model = models.resnet18(weights=None)
    num_features = model.fc.in_features
    model.fc = nn.Sequential(
        nn.Dropout(config.FATIGUE_CONFIG["dropout"]),
        nn.Linear(num_features, config.FATIGUE_CONFIG["num_classes"])
    )
    
                          
    if not config.FATIGUE_MODEL_PATH.exists():
        raise FileNotFoundError(f"Model not found: {config.FATIGUE_MODEL_PATH}")
    
    model.load_state_dict(torch.load(config.FATIGUE_MODEL_PATH, map_location='cpu'))
    model.eval()
    
                                                                          
    dummy_input = torch.randn(1, 3, 224, 224)
    
                    
    onnx_path = config.BASE_DIR.parent / "ml_lambda" / "models" / "fatigue_model.onnx"
    onnx_path.parent.mkdir(parents=True, exist_ok=True)
    
    print(f"Exporting to {onnx_path}...")
    torch.onnx.export(
        model,
        dummy_input,
        str(onnx_path),
        input_names=['input'],
        output_names=['output'],
        dynamic_axes={
            'input': {0: 'batch_size'},
            'output': {0: 'batch_size'}
        },
        opset_version=config.ONNX_CONFIG["opset_version"],
        do_constant_folding=config.ONNX_CONFIG["do_constant_folding"]
    )
    
    print(f"✓ Fatigue model converted successfully!")
    print(f"  Size: {onnx_path.stat().st_size / (1024*1024):.2f} MB")
    return onnx_path

def convert_voice_model():
    """Convert Wav2Vec2 voice model to ONNX."""
    print("\n" + "="*60)
    print("Converting Voice Model to ONNX")
    print("="*60)
    
                                                                    
                                                                         
                                                                                 
    
    from transformers import Wav2Vec2Processor
    import config as cfg
    
    print("⚠ Wav2Vec2 models are complex to convert to ONNX.")
    print("For Lambda deployment, consider:")
    print("1. Using ONNX Runtime with PyTorch backend")
    print("2. Using a quantized version")
    print("3. Keeping PyTorch for this model (larger size)")
    
                                                                                
    print(f"\nVoice model saved at: {config.VOICE_MODEL_PATH}")
    print("Note: This model may need to be loaded with PyTorch in Lambda")
    print("or converted using transformers.onnx export.")
    
                                                           
    try:
        from transformers.onnx import export
        from transformers import Wav2Vec2Model
        
        model = Wav2Vec2Model.from_pretrained(config.VOICE_CONFIG["model_name"])
                                                                               
        print("\nFor full ONNX conversion, use transformers.onnx.export()")
        print("or keep PyTorch for Wav2Vec2 inference.")
        
    except ImportError:
        print("\nTransformers ONNX export not available.")
        print("Model will use PyTorch in Lambda (larger size but works).")
    
    return None

def verify_onnx_model(onnx_path):
    """Verify ONNX model can be loaded."""
    try:
        import onnx
        import onnxruntime as ort
        
                              
        onnx_model = onnx.load(str(onnx_path))
        onnx.checker.check_model(onnx_model)
        
                        
        session = ort.InferenceSession(str(onnx_path))
        print(f"\n✓ ONNX model verified successfully")
        print(f"  Inputs: {[inp.name for inp in session.get_inputs()]}")
        print(f"  Outputs: {[out.name for out in session.get_outputs()]}")
        
        return True
    except Exception as e:
        print(f"\n✗ ONNX verification failed: {e}")
        return False

def main():
    """Main conversion function."""
    print("Starting ONNX conversion process...")
    
                           
    try:
        fatigue_onnx = convert_fatigue_model()
        if fatigue_onnx:
            verify_onnx_model(fatigue_onnx)
    except Exception as e:
        print(f"\n✗ Error converting fatigue model: {e}")
    
                                                 
    try:
        convert_voice_model()
    except Exception as e:
        print(f"\n✗ Error converting voice model: {e}")
    
    print(f"\n{'='*60}")
    print("ONNX Conversion Complete")
    print(f"{'='*60}")
    print("\nNext steps:")
    print("1. Copy ONNX models to ml_lambda/models/")
    print("2. Build Lambda Docker image")
    print("3. Deploy to AWS Lambda")

if __name__ == "__main__":
    main()
