"""
Train voice stress detection model using Wav2Vec2 transfer learning.
Dataset: RAVDESS emotional speech audio
"""
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from transformers import Wav2Vec2Processor, Wav2Vec2Model
import librosa
import numpy as np
import os
from pathlib import Path
from tqdm import tqdm
import config
from sklearn.metrics import f1_score, confusion_matrix, classification_report
import matplotlib.pyplot as plt
import seaborn as sns

                         
RAVDESS_EMOTIONS = {
    "01": "neutral",
    "02": "calm",
    "03": "happy",
    "04": "sad",
    "05": "angry",
    "06": "fearful",
    "07": "disgust",
    "08": "surprised"
}

class RAVDESSDataset(Dataset):
    """Dataset loader for RAVDESS emotional speech audio."""
    
    def __init__(self, data_dir, processor, max_length=6.0):
        self.data_dir = Path(data_dir)
        self.processor = processor
        self.max_length = max_length
        self.sample_rate = config.VOICE_CONFIG["sample_rate"]
        self.samples = []
        
                                                           
                                                                                     
        for audio_file in self.data_dir.rglob("*.wav"):
            filename = audio_file.stem
            parts = filename.split("-")
            if len(parts) >= 4:
                emotion_code = parts[2]                       
                if emotion_code in RAVDESS_EMOTIONS:
                    emotion = RAVDESS_EMOTIONS[emotion_code]
                    emotion_idx = list(RAVDESS_EMOTIONS.keys()).index(emotion_code)
                    self.samples.append((str(audio_file), emotion_idx, emotion))
        
        if len(self.samples) == 0:
                                                       
            for actor_dir in self.data_dir.iterdir():
                if actor_dir.is_dir():
                    for audio_file in actor_dir.glob("*.wav"):
                        filename = audio_file.stem
                        parts = filename.split("-")
                        if len(parts) >= 4:
                            emotion_code = parts[2]
                            if emotion_code in RAVDESS_EMOTIONS:
                                emotion = RAVDESS_EMOTIONS[emotion_code]
                                emotion_idx = list(RAVDESS_EMOTIONS.keys()).index(emotion_code)
                                self.samples.append((str(audio_file), emotion_idx, emotion))
        
        if len(self.samples) == 0:
            raise ValueError(f"No RAVDESS audio files found in {data_dir}")
        
        print(f"Found {len(self.samples)} audio samples")
        for emotion in RAVDESS_EMOTIONS.values():
            count = sum(1 for _, _, e in self.samples if e == emotion)
            if count > 0:
                print(f"  {emotion}: {count}")
    
    def __len__(self):
        return len(self.samples)
    
    def __getitem__(self, idx):
        audio_path, emotion_idx, emotion = self.samples[idx]
        
                                   
        audio, sr = librosa.load(audio_path, sr=self.sample_rate, mono=True)
        
                                       
        max_samples = int(self.max_length * self.sample_rate)
        if len(audio) > max_samples:
            audio = audio[:max_samples]
        else:
            audio = np.pad(audio, (0, max_samples - len(audio)), mode='constant')
        
                   
        audio = audio / np.max(np.abs(audio)) if np.max(np.abs(audio)) > 0 else audio
        
                                         
        inputs = self.processor(audio, sampling_rate=self.sample_rate, return_tensors="pt", padding=True)
        
        return {
            "input_values": inputs["input_values"].squeeze(0),
            "labels": emotion_idx
        }

class Wav2Vec2Classifier(nn.Module):
    """Wav2Vec2 model with classification head."""
    
    def __init__(self, model_name, num_classes):
        super().__init__()
        self.wav2vec2 = Wav2Vec2Model.from_pretrained(model_name)
        self.classifier = nn.Linear(self.wav2vec2.config.hidden_size, num_classes)
        self.dropout = nn.Dropout(0.1)
    
    def forward(self, input_values):
        outputs = self.wav2vec2(input_values)
                                                  
        pooled = outputs.last_hidden_state.mean(dim=1)
        pooled = self.dropout(pooled)
        logits = self.classifier(pooled)
        return logits

def train_epoch(model, dataloader, criterion, optimizer, device, freeze_encoder=False):
    """Train for one epoch."""
    model.train()
    if freeze_encoder:
        model.wav2vec2.eval()                  
    
    running_loss = 0.0
    correct = 0
    total = 0
    
    for batch in tqdm(dataloader, desc="Training"):
        input_values = batch["input_values"].to(device)
        labels = batch["labels"].to(device)
        
        optimizer.zero_grad()
        outputs = model(input_values)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        
        running_loss += loss.item()
        _, predicted = torch.max(outputs.data, 1)
        total += labels.size(0)
        correct += (predicted == labels).sum().item()
    
    epoch_loss = running_loss / len(dataloader)
    epoch_acc = 100 * correct / total
    return epoch_loss, epoch_acc

def validate(model, dataloader, criterion, device, return_predictions=False):
    """Validate model."""
    model.eval()
    running_loss = 0.0
    correct = 0
    total = 0
    all_preds = []
    all_labels = []
    
    with torch.no_grad():
        for batch in tqdm(dataloader, desc="Validating"):
            input_values = batch["input_values"].to(device)
            labels = batch["labels"].to(device)
            
            outputs = model(input_values)
            loss = criterion(outputs, labels)
            
            running_loss += loss.item()
            _, predicted = torch.max(outputs.data, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
            
            all_preds.extend(predicted.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())
    
    epoch_loss = running_loss / len(dataloader)
    epoch_acc = 100 * correct / total
    
    if return_predictions:
        return epoch_loss, epoch_acc, all_preds, all_labels
    return epoch_loss, epoch_acc

def main():
    """Main training function."""
    print("="*60)
    print("Training Voice Stress Detection Model (Wav2Vec2)")
    print("="*60)
    
           
    device = torch.device(config.DEVICE if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")
    
                    
    print(f"\nLoading Wav2Vec2 processor: {config.VOICE_CONFIG['model_name']}")
    processor = Wav2Vec2Processor.from_pretrained(config.VOICE_CONFIG["model_name"])
    
                  
    print(f"\nLoading dataset from {config.RAVDESS_DATA_DIR}")
    full_dataset = RAVDESSDataset(
        config.RAVDESS_DATA_DIR,
        processor,
        max_length=config.VOICE_CONFIG["max_audio_length"]
    )
    
                                                                                 
    from torch.utils.data import random_split
    train_size = int(0.8 * len(full_dataset))
    val_size = len(full_dataset) - train_size
    train_dataset, val_dataset = random_split(full_dataset, [train_size, val_size])
    
    train_loader = DataLoader(
        train_dataset,
        batch_size=config.VOICE_CONFIG["batch_size"],
        shuffle=True,
        num_workers=2
    )
    val_loader = DataLoader(
        val_dataset,
        batch_size=config.VOICE_CONFIG["batch_size"],
        shuffle=False,
        num_workers=2
    )
    
                  
    print("\nCreating Wav2Vec2 model...")
    model = Wav2Vec2Classifier(
        config.VOICE_CONFIG["model_name"],
        num_classes=config.VOICE_CONFIG["num_classes"]
    )
    model = model.to(device)
    
                        
    criterion = nn.CrossEntropyLoss()
    
                                                    
    print("\nPhase 1: Training classifier with frozen encoder...")
    optimizer = optim.AdamW(
        model.classifier.parameters(),
        lr=config.VOICE_CONFIG["learning_rate"],
        weight_decay=config.VOICE_CONFIG["weight_decay"]
    )
    
    best_val_loss = float('inf')
    patience_counter = 0
    
    for epoch in range(config.VOICE_CONFIG["freeze_encoder_epochs"]):
        print(f"\nEpoch {epoch+1}/{config.VOICE_CONFIG['freeze_encoder_epochs']} (Frozen Encoder)")
        train_loss, train_acc = train_epoch(model, train_loader, criterion, optimizer, device, freeze_encoder=True)
        val_loss, val_acc = validate(model, val_loader, criterion, device)
        
        print(f"Train Loss: {train_loss:.4f}, Train Acc: {train_acc:.2f}%")
        print(f"Val Loss: {val_loss:.4f}, Val Acc: {val_acc:.2f}%")
        
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            patience_counter = 0
        else:
            patience_counter += 1
    
                                
    print("\nPhase 2: Fine-tuning encoder...")
                                       
    for param in list(model.wav2vec2.encoder.layers[-2:].parameters()):
        param.requires_grad = True
    
    optimizer = optim.AdamW(
        [
            {"params": model.classifier.parameters()},
            {"params": model.wav2vec2.encoder.layers[-2].parameters()},
            {"params": model.wav2vec2.encoder.layers[-1].parameters()},
        ],
        lr=config.VOICE_CONFIG["learning_rate"] * 0.1,                            
        weight_decay=config.VOICE_CONFIG["weight_decay"]
    )
    
    for epoch in range(config.VOICE_CONFIG["freeze_encoder_epochs"], config.VOICE_CONFIG["num_epochs"]):
        print(f"\nEpoch {epoch+1}/{config.VOICE_CONFIG['num_epochs']} (Fine-tuning)")
        train_loss, train_acc = train_epoch(model, train_loader, criterion, optimizer, device, freeze_encoder=False)
        val_loss, val_acc = validate(model, val_loader, criterion, device)
        
        print(f"Train Loss: {train_loss:.4f}, Train Acc: {train_acc:.2f}%")
        print(f"Val Loss: {val_loss:.4f}, Val Acc: {val_acc:.2f}%")
        
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            patience_counter = 0
                             
            config.MODELS_DIR.mkdir(parents=True, exist_ok=True)
            torch.save(model.state_dict(), config.VOICE_MODEL_PATH)
            print(f"✓ Saved best model (val_loss: {val_loss:.4f})")
        else:
            patience_counter += 1
            if patience_counter >= config.VOICE_CONFIG["early_stopping_patience"]:
                print(f"Early stopping triggered after {epoch+1} epochs")
                break
    
                                   
    print(f"\n{'='*60}")
    print("Final Evaluation on Validation Set")
    print(f"{'='*60}")
    
    val_loss, val_acc, val_preds, val_labels = validate(model, val_loader, criterion, device, return_predictions=True)
    
                        
    f1 = f1_score(val_labels, val_preds, average='weighted')
    f1_macro = f1_score(val_labels, val_preds, average='macro')
    f1_per_class = f1_score(val_labels, val_preds, average=None)
    
                      
    cm = confusion_matrix(val_labels, val_preds)
    
    emotion_names = list(RAVDESS_EMOTIONS.values())
    
    print(f"\nValidation Accuracy: {val_acc:.2f}%")
    print(f"Weighted F1 Score: {f1:.4f}")
    print(f"Macro F1 Score: {f1_macro:.4f}")
    print(f"\nPer-class F1 Scores:")
    for i, (emotion, score) in enumerate(zip(emotion_names, f1_per_class)):
        print(f"  {emotion}: {score:.4f}")
    
    print(f"\nConfusion Matrix:")
    print(cm)
    
                                
    plt.figure(figsize=(12, 10))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=emotion_names,
                yticklabels=emotion_names)
    plt.title('Voice Stress Detection Model - Confusion Matrix')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.xticks(rotation=45, ha='right')
    plt.yticks(rotation=0)
    plt.tight_layout()
    cm_path = config.MODELS_DIR / "voice_confusion_matrix.png"
    plt.savefig(cm_path)
    print(f"\nConfusion matrix saved to: {cm_path}")
    
                           
    print(f"\nClassification Report:")
    print(classification_report(val_labels, val_preds, target_names=emotion_names))
    
    print(f"\n{'='*60}")
    print("Training complete!")
    print(f"Best validation loss: {best_val_loss:.4f}")
    print(f"Final Validation Accuracy: {val_acc:.2f}%")
    print(f"Weighted F1 Score: {f1:.4f}")
    print(f"Model saved to: {config.VOICE_MODEL_PATH}")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()
